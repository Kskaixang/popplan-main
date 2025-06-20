package com.example.demo.service.impl;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.dto.UserSchScheduleDto;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.UserService;
//這個將會抄完就移除
@Service
public class UserServiceImpl implements UserService {
	
	@Autowired
	private UserRepository userRepository;
	
	
	@Override
	public Map<String, List<UserSchScheduleDto>> getUserSchedule(Integer userId) {
		List<Object[]> rawList = userRepository.getUserSchedule(userId);
		if(rawList.isEmpty()) {
			  return null; // 或 new 一個自訂的空物件，視需求而定
	    }
		//創建Map
		Map<String,List<UserSchScheduleDto>> grouped = new LinkedHashMap<>();
		for(Object[] row : rawList) {
			Integer eventId = (Integer) row[0];
			Timestamp ts = (Timestamp) row[1];
			String title = (String) row[2];
			
			// 加上 8 小時（台灣時區）
			LocalDateTime localDateTime = ts.toLocalDateTime().plusHours(8);

			// 日期當作 Map 的 key
			String dateKey = localDateTime.toLocalDate().toString(); 

			// 時間字串（value）
			String time = localDateTime.toLocalTime().toString(); 
			
			UserSchScheduleDto item = new UserSchScheduleDto(eventId,time,title);
			//先看鍵 有同鍵直接加value 無同鍵則新增鍵
			grouped.computeIfAbsent(dateKey, k -> new ArrayList<>()).add(item);
			
		}
		
	    return grouped; 
	}
	
}