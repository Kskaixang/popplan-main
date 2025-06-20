package com.example.demo.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
//給UserSchedule用的 日曆行程
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserSchScheduleDto {
	private Integer eventId;
	private String time;
    private String title;
}
