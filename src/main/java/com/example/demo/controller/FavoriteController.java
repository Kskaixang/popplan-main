package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.example.demo.model.dto.EventDto;
import com.example.demo.model.dto.UserCert;
import com.example.demo.response.ApiResponse;
import com.example.demo.service.FavoriteService;

import jakarta.servlet.http.HttpSession;

@RestController
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequestMapping("/favorite")
public class FavoriteController {
	@Autowired
	private FavoriteService favoriteService;
	//修改
	@PutMapping("/{eventId}")
	public ResponseEntity<ApiResponse<String>> toggleFavorite(@PathVariable Integer eventId, HttpSession session){
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
	    String userId = (String) auth.getPrincipal(); // 假設 JWT 裡存的是 userId
	    
		UserCert userCert = (UserCert) session.getAttribute("userCert");
		favoriteService.toggleFavorite(userCert.getUserId(), eventId);
		return ResponseEntity.ok(ApiResponse.success(200, "收藏操作", "成功"));
	}

}
