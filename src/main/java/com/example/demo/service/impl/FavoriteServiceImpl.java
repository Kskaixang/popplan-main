package com.example.demo.service.impl;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.exception.event.EventNotFoundException;
import com.example.demo.exception.login.UserNotFoundException;
import com.example.demo.model.entity.Event;
import com.example.demo.model.entity.Favorite;
import com.example.demo.model.entity.User;
import com.example.demo.repository.EventRepository;
import com.example.demo.repository.FavoriteRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.FavoriteService;
@Service
public class FavoriteServiceImpl implements FavoriteService{
	
	@Autowired
	private FavoriteRepository favoriteRepository;
	@Autowired
	private UserRepository userRepository;
	@Autowired
	private EventRepository eventRepository;

	@Override
	public void toggleFavorite(Integer userId, Integer eventId) {
		Optional<Favorite> favorite = favoriteRepository.findByUser_userIdAndEvent_eventId(userId, eventId);
		if(favorite.isPresent()) {
			favoriteRepository.delete(favorite.get());
		} else {
			User user = userRepository.findById(userId)
	                .orElseThrow(() -> new UserNotFoundException("登入帳號不存在，請重新登入"));
	        Event event = eventRepository.findById(eventId)
	                .orElseThrow(() -> new EventNotFoundException("活動不存在，系統發生錯誤"));
	        favoriteRepository.save(new Favorite(user, event));
		}
		
	}

}
