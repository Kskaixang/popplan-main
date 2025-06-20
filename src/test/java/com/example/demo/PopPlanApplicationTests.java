package com.example.demo;

import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.example.demo.model.dto.UserSchScheduleDto;
import com.example.demo.service.UserService;

@SpringBootTest
class PopPlanApplicationTests {
	 @Autowired
	    private UserService userService;

//	@Test
//	void contextLoads() {
//	}
	 
	 @Test
	    void testGetUserScheduleGrouped() {
	        Integer testUserId = 4; // 你要測試的userId
	        System.out.println("好像沒跑進來 我確定有一筆");
	        Map<String, List<UserSchScheduleDto>> schedule = userService.getUserSchedule(testUserId);

	        // 印出結果，方便你看
	        schedule.forEach((date, events) -> {
	        	System.out.println("日期: " + date );
	            events.forEach(event -> {
	            	
	                System.out.println("  活動號: " + event.getEventId() + "  時間: " + event.getTime() + ", 標題: " + event.getTitle());
	            });
	        });

	        // 你可以加一些簡單斷言確保資料有讀到
	        //assert !schedule.isEmpty() : "行程資料不應該是空的";
	        System.out.println("有跑完嗎");
	    }

}
