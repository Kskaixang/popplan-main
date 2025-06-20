package com.example.demo.mapper;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.demo.model.dto.EventDto;
import com.example.demo.model.dto.NotificationDto;
import com.example.demo.model.entity.Notification;
@Component 
public class NotificationMapper {
	@Autowired
	private ModelMapper modelMapper;
	
	public NotificationDto toDto(Notification notification) {
		
		return modelMapper.map(notification, NotificationDto.class);
	}
	
	public Notification toEntity(EventDto notificationDto) {
		return modelMapper.map(notificationDto, Notification.class);
	}
	
}
