package com.example.demo.service;

import com.example.demo.model.dto.UserDto;

public interface UserRegisterService {
	//新增 User
	void addUser(String username , String password , String email);
	void addUser(UserDto userDto);
	//Email 驗證成功
	void emailConfirmOk(String username);
	
	UserDto getUser(String username);
	
}
