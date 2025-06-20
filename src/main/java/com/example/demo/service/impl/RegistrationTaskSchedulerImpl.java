package com.example.demo.service.impl;

import java.util.Optional;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.entity.Registration;
import com.example.demo.repository.RegistrationRepository;
import com.example.demo.service.RegistrationTaskSchedulerService;
import jakarta.annotation.PreDestroy; // ← 加上這個 import（如果你是 Spring Boot 3+，用 jakarta）
@Service
public class RegistrationTaskSchedulerImpl implements RegistrationTaskSchedulerService{
	
	private final ScheduledExecutorService executor = Executors.newScheduledThreadPool(5); // 固定池

	
	@Autowired
	private RegistrationRepository registrationRepository;
//此頁因為效能問題 之後會淘汰成正規的schedule
	@Override
	public void scheduleAutoDelete(Registration reg) {
	}
	
	@PreDestroy
	public void shutdownExecutor() {
	    executor.shutdown(); // 關閉執行緒池，避免資源泄漏
	    System.out.println("排程執行器已關閉");
	}

}
