package com.example.demo.model.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NotificationDto {
	private Integer notificationId;
	private String message;
	private String url;
	private boolean Read;
	private LocalDateTime createdAt;

	// Constructor, Getters, Setters
}
