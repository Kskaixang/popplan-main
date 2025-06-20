package com.example.demo.mapper;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.demo.model.dto.EventDto;
import com.example.demo.model.entity.Event;


//其實性質也很像 @Repository  @Service  這和@Component  這三者都是由SpringBoot 管理
@Component  //此物件由SpringBoot 來管理 我們會以mapper用途來定這個
public class EventMapper {

	@Autowired
	private ModelMapper modelMapper;
	
	public EventDto toDto(Event event) {
		
		return modelMapper.map(event, EventDto.class);
	}
	
	public Event toEntity(EventDto eventDto) {
		return modelMapper.map(eventDto, Event.class);
	}
}
