package com.example.demo.model.dto;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDateTime;

import com.example.demo.model.enums.EventStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EventDetailDto {
	private Integer eventId;
	private String description;
	private String image;
	private String location;
	private Integer maxParticipants;
	private BigDecimal price;
	private LocalDateTime startTime;
	private EventStatus status;
	private String title;
	private String organizerName;
	private Integer currentParticipants;  // 當前參加人數
	
}
