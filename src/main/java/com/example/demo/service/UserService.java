package com.example.demo.service;

import java.util.List;
import java.util.Map;

import com.example.demo.model.dto.UserSchScheduleDto;

public interface UserService {
	
//	public UserDto getUser(String username);

//	public void addUser(String username, String password, String email, Boolean active, String role);
	
	//自訂
	public Map<String, List<UserSchScheduleDto>> getUserSchedule(Integer userId);

}
