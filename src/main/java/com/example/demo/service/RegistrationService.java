package com.example.demo.service;

import java.util.List;

import com.example.demo.model.dto.RegistrationHistoryDto;
import com.example.demo.model.dto.RegistrationStagingDto;
import com.example.demo.model.entity.User;

public interface RegistrationService {
	RegistrationStagingDto checkRegistrationStaging(Integer userId, Integer eventId);

	RegistrationStagingDto addRegistrationStaging(Integer userId, Integer eventId);

	RegistrationStagingDto getRegistration(Integer regitrationId);

	void transactional(Integer registrationId);

	int getRegistrationCount(Integer integer);

	void cancelRegistrationStaging(Integer userId, Integer restartionStagingId);
	void cancelRegistration(Integer userId, Integer restartionId);
	
	List<RegistrationHistoryDto> findRegistrationByUserId(Integer userId);
	
}
