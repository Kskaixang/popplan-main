package com.example.demo.controller;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.service.EventService;

import jakarta.validation.Valid;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;

import com.example.demo.exception.event.EventImageIOException;
import com.example.demo.exception.event.EventRuntimeException;
import com.example.demo.model.dto.EventDetailDto;
import com.example.demo.model.dto.EventDto;
import com.example.demo.model.dto.UserCert;
import com.example.demo.response.ApiResponse;

@RestController
@CrossOrigin(origins = {"http://localhost:5173"}, allowCredentials = "true") // 允許來自 React 開發伺服器的跨域請求
@RequestMapping("/event")
public class EventController {

	@Autowired
	private EventService eventService;

	// 因為我的表單是@RequestPart @不是body 會有疏漏要特地捕捉錯誤
	// 錯誤處理 runtime
	// 錯誤處理@Valid
	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ApiResponse<Void>> handleValidationException(MethodArgumentNotValidException e) {
		String message = e.getBindingResult().getAllErrors().get(0).getDefaultMessage();
		return ResponseEntity.ok(ApiResponse.error(500, "valid 錯誤 : " + message));
	}

	@ExceptionHandler(EventRuntimeException.class)
	public ResponseEntity<ApiResponse<Void>> handleValidationException(EventRuntimeException e) {
		return ResponseEntity.ok(ApiResponse.error(500, "錯誤 : " + e.getMessage()));
	}

	// 取得所有公開活動（支援篩選/分頁）
	@GetMapping
	public ResponseEntity<ApiResponse<List<EventDto>>> findAllEvents(HttpSession session) {
		UserCert userCert = (UserCert) session.getAttribute("userCert");
		//這邊因為是首頁獲取 可有 也可無   有的話會呈現愛心渲染  沒有則是全空
		Integer userId = userCert != null ? userCert.getUserId() : null; 
		List<EventDto> eventDtos = eventService.findAllEvents(userId); // payload
		String message = eventDtos.isEmpty() ? "查無資料" : "查詢成功";
		return ResponseEntity.ok(ApiResponse.success(200, message, eventDtos));
	}

	// 取得所有"我的活動"活動（支援篩選/分頁）
	@GetMapping("/myCreatedEvents")
	public ResponseEntity<ApiResponse<List<EventDto>>> findAllmyCreatedEvents(HttpSession session) {
		UserCert userCert = (UserCert) session.getAttribute("userCert");
		if (userCert == null) {
			throw new EventRuntimeException("請先登入");
		}
		List<EventDto> eventDtos = eventService.findAllmyCreatedEvents(userCert.getUserId()); // payload
		String message = eventDtos.isEmpty() ? "查無資料" : "查詢成功";
		return ResponseEntity.ok(ApiResponse.success(200, message, eventDtos));
	}

	// 取得所有"收藏報名"活動（支援篩選/分頁）
	@GetMapping("/favoriteEvent")
	public ResponseEntity<ApiResponse<List<EventDto>>> findAllFavoriteEvents(HttpSession session) {
		UserCert userCert = (UserCert) session.getAttribute("userCert");
		if (userCert == null) {
			throw new EventRuntimeException("請先登入");
		}
		List<EventDto> eventDtos = eventService.findAllFavoriteEvents(userCert.getUserId()); // payload
		String message = eventDtos.isEmpty() ? "查無資料" : "查詢成功";
		return ResponseEntity.ok(ApiResponse.success(200, message, eventDtos));
	}
	
	

	// 取得單筆
	@GetMapping("/{eventId}")
	public ResponseEntity<ApiResponse<EventDetailDto>> getevent(@PathVariable Integer eventId) {
		EventDetailDto eventDetailDto = eventService.getEventById(eventId);
		return ResponseEntity.ok(ApiResponse.success(200, "Event 查詢單筆成功", eventDetailDto));
	}

	// 建立新活動（主辦人用）
	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<ApiResponse<EventDto>> createEvent(@Valid @RequestPart("event") EventDto eventDto,
			@RequestPart(value = "image", required = false) MultipartFile eventDtoImage, HttpSession session,
			BindingResult bindingResult) {
		try {
			UserCert userCert = (UserCert) session.getAttribute("userCert");
			eventService.addEvent(userCert, eventDto, eventDtoImage);
			return ResponseEntity.ok(ApiResponse.success(201, "活動建立成功", eventDto));
		} catch (EventImageIOException e) {
			return ResponseEntity.ok(ApiResponse.error(500, "錯誤 : " + e.getMessage()));
		}
	}

}
