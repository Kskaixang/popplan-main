package com.example.demo.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.ai.tool.annotation.Tool;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.example.demo.exception.notification.NotificationNotFoundException;
import com.example.demo.mapper.NotificationMapper;
import com.example.demo.model.dto.NotificationDto;
import com.example.demo.model.entity.Notification;
import com.example.demo.model.entity.User;
import com.example.demo.repository.NotificationRepository;
import com.example.demo.service.NotificationService;

@Service
public class NotificationServiceImpl implements NotificationService {

    private final RegistrationTaskSchedulerImpl registrationTaskSchedulerImpl;
	@Autowired
	private NotificationRepository notificationRepository;
	@Autowired
	private SimpMessagingTemplate messageinTemplate; // Spring自己有的
	@Autowired
	private NotificationMapper notificationMapper;

    NotificationServiceImpl(RegistrationTaskSchedulerImpl registrationTaskSchedulerImpl) {
        this.registrationTaskSchedulerImpl = registrationTaskSchedulerImpl;
    }

	// 這不是給controller調用的 是用來發送toast通知 就是WebSocket topic的全域訂閱
	@Override
	public void addNotification(User user, String message) {
		Notification notification = new Notification(user, message);
		notificationRepository.save(notification);
		messageinTemplate.convertAndSend("/topic/notification/" + 1, notification.getMessage());
	}

	// 這邊就是給通知頁用的
	@Tool(name = "getNotificationByUserId", description = "想看有哪些通知")
	@Override
	public List<NotificationDto> getNotificationByUserId(Integer userId) {
		List<Notification> notifications = notificationRepository.findSortedByReadStatus(userId);
		//轉換成Dto 利用MAP 1 999
		return notifications.stream()
			    .map(notificationMapper::toDto)
			    .collect(Collectors.toList());
	}

	@Override
	public void markAsRead(Integer notificationId) {
		Optional<Notification> optNotification = notificationRepository.findById(notificationId);
		//照理說 一定有阿= = 這只有顯示在前端才能觸發
		if(optNotification.isEmpty()) {
			throw new NotificationNotFoundException("通知不存在，ID：" + notificationId);
		}		
		Notification notification = optNotification.get();
		if(Boolean.TRUE.equals(notification.getIsRead())) {
			return; //冪等性處理 已讀就跳過不往下對SQL做事
		}
		
		notification.setIsRead(true);
		notificationRepository.save(notification);
	}

	

}
