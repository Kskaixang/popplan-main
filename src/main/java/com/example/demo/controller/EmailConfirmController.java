package com.example.demo.controller;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletResponse;

import com.example.demo.response.ApiResponse;
import com.example.demo.service.UserRegisterService;
import com.example.demo.service.impl.UserRegisterServiceImpl;
//PP
//接收使用者 於email信件中 所按下的確認連結
// "http://local:8080/JavaWebCart/email/confirm?username=Jone"
@RestController
@CrossOrigin(origins = "http://localhost:5173") 
public class EmailConfirmController {
	//PP
	@Autowired
	private UserRegisterService userRegisterService;
	//抓到email/confirm?username=???  只有8080會進到這裡
	@GetMapping(value = "/email/confirm", produces = "application/json;charset=utf-8")
	public ResponseEntity<ApiResponse<String>> confirmEmail(@RequestParam String username, HttpServletResponse response) throws IOException {
		userRegisterService.emailConfirmOk(username);
	    String encodedUsername = URLEncoder.encode(username, StandardCharsets.UTF_8);
	    response.sendRedirect("http://localhost:5173/result?username=" + encodedUsername);		
		return ResponseEntity.ok(ApiResponse.success(200, "驗證成功", "用戶" + username + "的 Email 已通過驗證。"));
	}
	
	//@RequestParam String url,
	@GetMapping(value = "/email/QR", produces = "application/json;charset=utf-8")
	public ResponseEntity<ApiResponse<String>> QREmail(@RequestParam String eventId, HttpServletResponse response) throws IOException {
		String encodedQRURL = URLEncoder.encode("/images/lineQr.jpg", StandardCharsets.UTF_8);
	    response.sendRedirect("http://localhost:5173/paymentSuccess?url=" + encodedQRURL + "&eventId=" + eventId);		
		return ResponseEntity.ok(ApiResponse.success(200, "驗證成功", "報名完成"));
	}
	
}
