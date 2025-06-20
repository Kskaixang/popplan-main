package com.example.demo.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.dto.RegistrationHistoryDto;
import com.example.demo.model.dto.RegistrationStagingDto;
import com.example.demo.model.dto.UserCert;
import com.example.demo.model.entity.Registration;
import com.example.demo.model.entity.RegistrationStaging;
import com.example.demo.repository.RegistrationRepository;
import com.example.demo.repository.RegistrationStagingRepository;
import com.example.demo.response.ApiResponse;
import com.example.demo.service.RegistrationService;

import jakarta.servlet.http.HttpSession;

@RestController
@CrossOrigin(origins = "http://localhost:5173,http://localhost:8082", allowCredentials = "true")
@RequestMapping("/registration")
public class RegistrationController {
	@Autowired
	private RegistrationService registrationService;
	@Autowired
	private RegistrationRepository registrationRepository;
	@Autowired
	private RegistrationStagingRepository registrationStagingRepository;
	
	@ExceptionHandler(RuntimeException.class)
	public ResponseEntity<ApiResponse<Void>> handleValidationException(RuntimeException e) {
		return ResponseEntity.ok(ApiResponse.error(500, "報名錯誤 : " + e.getMessage()));
	}
	
	//Get 讓Detil頁面初始加載 得知該用戶和頁面的報名關係 無的話會回傳空的 Dto
	@GetMapping("/status/{eventId}")
	public ResponseEntity<ApiResponse<RegistrationStagingDto>> getStatus(@PathVariable Integer eventId, HttpSession session){		
		UserCert userCert = (UserCert) session.getAttribute("userCert");
		RegistrationStagingDto registrationDto = registrationService.checkRegistrationStaging(userCert.getUserId(), eventId);
		return ResponseEntity.ok(ApiResponse.success(200, "活動頁useEffec", registrationDto));
	}
	
	//PUT 增加關聯 還未付款 關聯好了 再把ID吐回前面 讓React跳轉時 根據resData.eventId 跳轉  解決非同步問題
	@PutMapping("/{eventId}")
	public ResponseEntity<ApiResponse<RegistrationStagingDto>> addRegistration(@PathVariable Integer eventId, HttpSession session){		
		UserCert userCert = (UserCert) session.getAttribute("userCert");
		if(userCert == null) {
			throw new RuntimeException("請先登入");
		}
		RegistrationStagingDto registrationDto = registrationService.addRegistrationStaging(userCert.getUserId(), eventId);
		return ResponseEntity.ok(ApiResponse.success(200, "報名", registrationDto));
	}
	//獲取交易計時Dto
	@GetMapping("/{registrationId}")
	public ResponseEntity<ApiResponse<RegistrationStagingDto>> getRegistrationDto(@PathVariable Integer registrationId){
		RegistrationStagingDto registrationDto = registrationService.getRegistration(registrationId);
		return ResponseEntity.ok(ApiResponse.success(200, "交易資料", registrationDto));		
	}
	
	//獲取報名紀錄
	@GetMapping("/history")
	public ResponseEntity<ApiResponse<List<RegistrationHistoryDto>>> getHistoryRegistrationDtos(HttpSession session){
	UserCert userCert = (UserCert) session.getAttribute("userCert");
		List<RegistrationHistoryDto> registrationHistoryDtos = registrationService.findRegistrationByUserId(userCert.getUserId());
		return ResponseEntity.ok(ApiResponse.success(200, "交易資料", registrationHistoryDtos));		
	}
	
	@PatchMapping("/{registrationId}")
	public ResponseEntity<ApiResponse<String>> transactional(@PathVariable Integer registrationId, HttpSession session){
		registrationService.transactional(registrationId);
		return ResponseEntity.ok(ApiResponse.success(200, "報名", "操作成功"));
	}
	//報名中取消
	@DeleteMapping("/staging/{registrationStagingId}")
	public ResponseEntity<ApiResponse<String>> deleteRegistrationStaging(@PathVariable Integer registrationStagingId,HttpSession session){
		UserCert userCert = (UserCert) session.getAttribute("userCert");
		Optional<RegistrationStaging> optRegistrationStaging = registrationStagingRepository.findById(registrationStagingId);	
	    if (optRegistrationStaging.isEmpty()) {
	    	//好像不會來到這 吧?  這邊的情況是 逾時按下取消可能70秒 且 假表剛好被排程掃過 導致沒有刪除行為 直接回饋
	        return ResponseEntity.ok(ApiResponse.success(200, "取消", "該報名資料已逾時並自動移除")); //Scheduler自動刪除
	    }
	    registrationService.cancelRegistrationStaging(userCert.getUserId(), registrationStagingId);
		return ResponseEntity.ok(ApiResponse.success(200, "取消", "報名取消"));
	}
	//報名後取消
	@DeleteMapping("/real/{registrationId}")
	public ResponseEntity<ApiResponse<String>> deleteRegistration(@PathVariable Integer registrationId,HttpSession session){
		//到時候檢查有沒有session協議 'include'
		UserCert userCert = (UserCert) session.getAttribute("userCert");
		Optional<Registration> optRegistrationStaging = registrationRepository.findById(registrationId);	
	    if (optRegistrationStaging.isEmpty()) { 
	        return ResponseEntity.ok(ApiResponse.success(200, "取消", "報名取消"));
	    }
	    //這邊情況是 未逾時 用戶主動取消
	    registrationService.cancelRegistration(userCert.getUserId(), registrationId);
		return ResponseEntity.ok(ApiResponse.success(200, "取消", "報名取消"));
	}
	
	

}
