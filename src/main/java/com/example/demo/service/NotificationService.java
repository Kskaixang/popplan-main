package com.example.demo.service;

import java.util.List;

import com.example.demo.model.dto.NotificationDto;
import com.example.demo.model.entity.Notification;
import com.example.demo.model.entity.User;

public interface NotificationService {
	
	public void addNotification(User user,String message);
	
	public List<NotificationDto> getNotificationByUserId(Integer userId);
	
	void markAsRead(Integer notificationId);

}
