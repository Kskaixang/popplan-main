package com.example.demo.mapper;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.demo.model.dto.RegistrationHistoryDto;
import com.example.demo.model.dto.RegistrationStagingDto;
import com.example.demo.model.entity.Registration;
import com.example.demo.model.entity.RegistrationStaging;
import com.example.demo.model.enums.RegistrationStatus;


@Component  //此物件由SpringBoot 來管理 我們會以mapper用途來定這個
public class RegistrationMapper {

	@Autowired
	private ModelMapper modelMapper;
	//頁面加載呈現
	public RegistrationStagingDto toDto(RegistrationStaging entity) {
	    return new RegistrationStagingDto(
	    		entity.getRegistrationId(),
	    		entity.getCreatedAt(),
	    		entity.getCreatedAt().plusSeconds(60),  // 設定倒數時限
	    		entity.getStatus(),
	    		entity.getPaidAmount(),
	    		entity.getEvent().getEventId(),
	    		entity.getEvent().getTitle()
	        );
	}
	public RegistrationStagingDto toDto(Registration entity) {
	    return new RegistrationStagingDto(
	    		entity.getRegistrationId(),
	    		entity.getCreatedAt(),
	    		entity.getCreatedAt().plusSeconds(60),  // 設定倒數時限
	    		entity.getStatus(),
	    		entity.getPaidAmount(),
	    		entity.getEvent().getEventId(),
	    		entity.getEvent().getTitle()
	        );
	}
	
	
	
	//真表轉歷史
	public RegistrationHistoryDto toHistory(Registration entity) {
	    return new RegistrationHistoryDto(
	    		entity.getRegistrationId(),
	    		entity.getStatus(),
	    		entity.getPaidAmount(),
	    		entity.getEvent().getEventId(),
	    		entity.getEvent().getTitle(),
	    		entity.getEvent().getStartTime(),
	    		"real"
	        );
	}
	//假表轉歷史
	public RegistrationHistoryDto StaginToHistory(RegistrationStaging entity) {
	    return new RegistrationHistoryDto(
	    		entity.getRegistrationId(),
	    		entity.getStatus(),
	    		entity.getPaidAmount(),
	    		entity.getEvent().getEventId(),
	    		entity.getEvent().getTitle(),
	    		entity.getEvent().getStartTime(),
	    		"staging"
	        );
	}
	
	
	// 假表轉換真表
	public Registration toRegistration(RegistrationStaging registrationStaging) {
		 Registration reg = new Registration();
		    // ❗ 不設 id → 讓 Hibernate 自動產生
		    reg.setUser(registrationStaging.getUser());
		    reg.setEvent(registrationStaging.getEvent());
		    reg.setPaidAmount(registrationStaging.getPaidAmount());
		    reg.setCreatedAt(registrationStaging.getCreatedAt()); //這是假表的創建時間 給新表繼承
		   
		    return reg;
		}
}
