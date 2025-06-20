package com.example.demo.model.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.example.demo.model.enums.RegistrationStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationHistoryDto {

	private Integer registrationId;

	private RegistrationStatus status;  //狀態

	private BigDecimal paidAmount; // 這裡是要呈現報名金額 不是活動金額

	private Integer eventId; // 活動ID 可能會用到

	private String title; // eventtitle
	
	private LocalDateTime startTime;  // 活動開始時間
	
	private String type;
}
