package com.example.demo.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.example.demo.exception.login.UserNotLoggedInException;
import com.example.demo.response.ApiResponse;

//@ControllerAdvice 的特性 來處理 全局錯誤
@ControllerAdvice
public class GlobalExceptionHandler {
	// 當系統發生例外的錯誤 給一個通用型的錯誤回報
	@ExceptionHandler(UserNotLoggedInException.class)
	public ResponseEntity<ApiResponse<String>> handleLoginError(UserNotLoggedInException  e) {
//		return ResponseEntity.ok(ApiResponse.error(401,"未登入"+ e.getMessage()));
	    return ResponseEntity
	            .status(HttpStatus.UNAUTHORIZED) // 回傳 401 狀態碼
	            .body(ApiResponse.error(401, "未登入: " + e.getMessage()));
	}
}