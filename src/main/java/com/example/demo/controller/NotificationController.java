package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.dto.EventDto;
import com.example.demo.model.dto.NotificationDto;
import com.example.demo.model.dto.UserCert;
import com.example.demo.model.entity.Notification;
import com.example.demo.repository.NotificationRepository;
import com.example.demo.response.ApiResponse;
import com.example.demo.service.NotificationService;
import com.example.demo.service.impl.NotificationServiceImpl;

import jakarta.servlet.http.HttpSession;

@RestController
@CrossOrigin(origins = {"http://localhost:5173","http://10.100.53.3:5173"}, allowCredentials = "true") // 允許來自 React 開發伺服器的跨域請求
@RequestMapping("/notification")
public class NotificationController {

    private final NotificationRepository notificationRepository;
	@Autowired
	private NotificationService notificationService;

    NotificationController(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }
	
	@GetMapping
	public ResponseEntity<ApiResponse<List<NotificationDto>>> findAllEvents(HttpSession session) {
		UserCert userCert = (UserCert) session.getAttribute("userCert");
		Integer userId = userCert.getUserId(); 
		List<NotificationDto> eventDtos = notificationService.getNotificationByUserId(userId); // payload
		String message = eventDtos.isEmpty() ? "查無資料" : "查詢成功";
		//應該不會拋例外吧? 空就空阿...
		return ResponseEntity.ok(ApiResponse.success(200, message, eventDtos));
	}
	
	@PutMapping("/{notificationId}")
	public ResponseEntity<ApiResponse<String>> toggleFavorite(@PathVariable Integer notificationId, HttpSession session){
		notificationService.markAsRead(notificationId);
		return ResponseEntity.ok(ApiResponse.success(200, "已讀操作", "成功"));
	}
	
	@PutMapping("/allAsRead")
	public ResponseEntity<ApiResponse<String>> allAsRead(HttpSession session) {
		System.out.println("進入?");
		UserCert userCert = (UserCert) session.getAttribute("userCert");
		Integer userId = userCert.getUserId(); 
		notificationRepository.markAllAsReadByUserId(userId);
		return ResponseEntity.ok(ApiResponse.success(200, "已讀操作", "成功"));
	}
	
	
	
	

}
