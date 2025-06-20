package com.example.demo.controller;

//PP舊
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

import com.example.demo.exception.login.CertException;
import com.example.demo.model.dto.UserCert;
import com.example.demo.model.dto.UserDto;
import com.example.demo.model.dto.UserSchScheduleDto;
import com.example.demo.model.entity.User;
import com.example.demo.repository.FavoriteRepository;
import com.example.demo.repository.NotificationRepository;
import com.example.demo.response.ApiResponse;
import com.example.demo.service.CertService;
import com.example.demo.service.EmailService;
import com.example.demo.service.UserLoginService;
import com.example.demo.service.UserRegisterService;
import com.example.demo.service.UserService;
import com.example.demo.service.impl.UserLoginServiceImpl;
import com.example.demo.service.impl.UserRegisterServiceImpl;
import com.example.demo.util.JwtUtil;
import com.fasterxml.jackson.annotation.JsonProperty;

//要準備把內容一到老師的LoginRestController
@RestController
@CrossOrigin(origins = {"http://localhost:5173"}, allowCredentials = "true") // 允許來自 React 開發伺服器的跨域請求
public class UserController {
	@Autowired
	private UserService userService;
	@Autowired
	private UserRegisterService userRegisterService;
	@Autowired
	private UserLoginService userLoginService;
	@Autowired
	private FavoriteRepository favoriteRepository;
	@Autowired
	private NotificationRepository notificationRepository;
	

	// 註冊
	@PostMapping("/user/register")
	public ResponseEntity<ApiResponse<UserDto>> register(@RequestBody UserDto userDto) {
		userRegisterService.addUser(userDto);
		return ResponseEntity.ok().body(ApiResponse.success(200, "註冊成功已經發送驗證信請至信箱查看", null));
	}

	@PostMapping("/user/login")
	public ResponseEntity<ApiResponse<Map<String, Object>>> login(@RequestBody Map<String, String> data, HttpSession session) {
		String sesstionAuthCode = session.getAttribute("authcode") + ""; // ""代表轉成字串的簡單寫法 比toString或強轉換更能防異常 因為不會null
		try {// Cert不用再核對一次 只需要發簽證
			UserCert userCert = userLoginService.login(data.get("email"), data.get("password"), data.get("authcode"),
					sesstionAuthCode);
			//創建token
			String token = JwtUtil.generateToken(userCert.getUserId().toString());	
			System.out.println("userID:" +userCert.getUserId().toString() + "[已經轉換成]"+ token);
			// 把 userCert 放進 session，保持原本session邏輯不動
			session.setAttribute("userCert", userCert);
			
			// 準備回傳資料，讓前端同時拿到 userCert 跟 JWT token
			Map<String,Object> responseData = new HashMap<>();
			responseData.put("userCert", userCert);
			responseData.put("token", token);
			
			
			return ResponseEntity.ok(ApiResponse.success(200, "登入成功", responseData));
		} catch (RuntimeException e) {
			if (session.getAttribute("userCert") != null) {
				session.removeAttribute("userCert"); // 只有當存在時才移除
			}
			return ResponseEntity.ok(ApiResponse.error(400, "登入失敗:" + e.getMessage()));
		}
	}

	// 登出  那啥... JWT要求登出一定要是POST
	@PostMapping("/logout")
	public ResponseEntity<ApiResponse<Void>> logout(HttpSession session) {
		System.out.println("登出被觸發了");
	    if(session.getAttribute("userCert") == null) {
	    	return ResponseEntity
	                .status(HttpStatus.UNAUTHORIZED) //非授權的錯誤
	                .body(ApiResponse.error(401, "登出失敗: 尚未登入 "));
	    }
	    session.invalidate();
	    return ResponseEntity.ok(ApiResponse.success(200,"登出成功", null));
	}

	// 檢查session存在與否http://localhost:8080/user/login/session
	@GetMapping("/user/login/session")
	public ResponseEntity<ApiResponse<UserCert>> debugSession(HttpSession session) {
		UserCert userCert = (UserCert)session.getAttribute("userCert");
		if(userCert == null) {
			return ResponseEntity.ok(ApiResponse.success(500, "已登出", null));
	    }	
		//更新最新的收藏數
		int newFavoriteCount = favoriteRepository.countByUser_UserId(userCert.getUserId());
		userCert.setFavoriteCount(newFavoriteCount);
		int notificationCount = notificationRepository.countByUser_UserIdAndIsReadFalse(userCert.getUserId());
		userCert.setNotificationCount(notificationCount);	
		 return ResponseEntity.ok(ApiResponse.success(200, "已登入", userCert));
	}
	
	@GetMapping("/user/schedule")
	public ResponseEntity<ApiResponse<Map<String, List<UserSchScheduleDto>>>> getUserSchedule(){
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		String userIdStr = (String) auth.getPrincipal(); // 安全轉型
		Integer userId = Integer.parseInt(userIdStr);
		System.out.println("JWT拿到了ID" + userId);
		Map<String, List<UserSchScheduleDto>> userScheduleDtos = userService.getUserSchedule(userId);
	    return ResponseEntity.ok(ApiResponse.success(200, "schedule", userScheduleDtos));
	}

}
