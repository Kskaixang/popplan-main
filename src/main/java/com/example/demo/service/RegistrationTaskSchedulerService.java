package com.example.demo.service;

import com.example.demo.model.entity.Registration;

public interface RegistrationTaskSchedulerService {
	void scheduleAutoDelete(Registration reg);

}
