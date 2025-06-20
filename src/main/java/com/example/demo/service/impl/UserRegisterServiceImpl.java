package com.example.demo.service.impl;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

//PP
import com.example.demo.exception.login.UserNotFoundException;
import com.example.demo.mapper.UserMapper;
import com.example.demo.model.dto.UserDto;
import com.example.demo.model.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.EmailService;
import com.example.demo.service.UserRegisterService;
import com.example.demo.util.Hash;

//或是說 我把這個當作userService改 因為這裡比較接近我的商業邏輯
@Service
public class UserRegisterServiceImpl implements UserRegisterService{
	
	@Autowired
	private UserRepository userRepository;
	@Autowired
	private UserMapper userMapper;
	@Autowired
	private EmailService emailService;
	
	//這老師好像簡化了 有用嗎...
	@Override
	public UserDto getUser(String username) {
		User user = userRepository.getUser(username);
		if(user == null) {
			return null;
		}
		return userMapper.toDto(user);
	}
	
	//取得鹽  注意有利用 建構多載 所以是先進DTO 才進這裡
	@Override
	public void addUser(String username , String password , String email) {
		try {
			//隨機鹽建立 要丟給SQL的
			
			String salt = Hash.getSalt();
			//註冊密 + 隨機鹽 混和成 密鹽
			String passwordHash = Hash.getHash(password, salt);			
			User user = new User(username, passwordHash, salt, email);
			// 發送 email
			String encodedUsername = URLEncoder.encode(username, StandardCharsets.UTF_8);
			String emailConfirmLink = "http://localhost:8080/email/confirm?username=" + encodedUsername;
			emailService.sendEmail(email, emailConfirmLink);
			
			userRepository.save(user);
			
			
		} catch (Exception e) {
			e.printStackTrace();
		} 		
	}	
	public void addUser(UserDto userDto) {
		addUser(userDto.getUsername(),userDto.getPassword(),userDto.getEmail());
	}
	
	@Override
	public void emailConfirmOk(String username) {
		User user = userRepository.findByUsername(username);
		if (user != null) {
		    user.setActive(true);            // 改你要的值
		    userRepository.save(user);        // JPA 自動發出 UPDATE 語句
		} else {
		    throw new UserNotFoundException("使用者遺失無法驗證信箱");
		}
		
	}

}
