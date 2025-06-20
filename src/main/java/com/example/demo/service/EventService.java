package com.example.demo.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.example.demo.exception.event.EventImageIOException;
import com.example.demo.model.dto.EventDetailDto;
import com.example.demo.model.dto.EventDto;
import com.example.demo.model.dto.UserCert;



public interface EventService {
	
	public List<EventDto> findAllEvents(Integer userId); //查詢登入所有 且含isFavorite
	public List<EventDto> findAllmyCreatedEvents(Integer userId); //查詢登入所有 且含isFavorite
	public List<EventDto> findAllFavoriteEvents(Integer userId); //查詢登入所有 且含isFavorite
	
	public EventDetailDto getEventById(Integer eventId); //查詢單筆
	
	public void addEvent(UserCert userCert, EventDto eventDto,MultipartFile eventDtoImage) throws EventImageIOException; //新增
	
	public void updateEvent(Integer eventId, EventDto eventDto); //修改
	
	public void deleteEvent(Integer eventId); //刪除

	
}
