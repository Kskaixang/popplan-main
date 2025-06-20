package com.example.demo.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.mapper.UserMapper;
import com.example.demo.model.dto.UserCert;
import com.example.demo.model.dto.UserDto;
import com.example.demo.model.entity.User;
import com.example.demo.repository.FavoriteRepository;
import com.example.demo.repository.NotificationRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.UserLoginService;
import com.example.demo.util.Hash;
//準備廢棄
@Service
public class UserLoginServiceImpl implements UserLoginService{
//	private UserLoginDAO userLoginDAO = new UserLoginDAOImpl();
	
	@Autowired
	private UserRepository userRepository;
	@Autowired
	private FavoriteRepository favoriteRepository;
	@Autowired
	private NotificationRepository notificationRepository;
	
	@Override
	public UserCert login(String email, String password, String authCode, String sessionAuthCode) {
		if(!authCode.equals(sessionAuthCode)) { 
			throw new RuntimeException("驗證碼不符");
		}
		User user = userRepository.findByEmail(email);
		if(user == null) {
			throw new RuntimeException("此信箱查無使用者");
		}
		boolean active = user.getActive();
		if(!active) {
			throw new RuntimeException("信箱未驗證");
		}
		try {
			//登入的密碼 加上資料庫的鹽 混和成 登入密鹽
			String hashPassword = Hash.getHash(password, user.getSalt());
			//比對資料庫密碼 是否等於 混和登入密鹽
			boolean checkPassword = user.getPasswordHash().equals(hashPassword);
			//boolean checkPassword = true;
			if(!checkPassword) {
				throw new RuntimeException("密碼錯誤");
			}
			//驗證成功		
			// 6. 將 userDTO 回傳
			int favoriteCount = favoriteRepository.countByUser_UserId(user.getUserId());
			int notificationCount = notificationRepository.countByUser_UserIdAndIsReadFalse(user.getUserId());
			return new UserCert(user.getUserId(), user.getUsername(), user.getRole(),favoriteCount,notificationCount);
			
		} catch (Exception e) {
			throw new RuntimeException(e.getMessage());
		}
		

	}

}
