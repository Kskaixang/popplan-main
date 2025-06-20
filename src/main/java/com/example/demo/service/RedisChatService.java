package com.example.demo.service;

import java.util.List;

import com.example.demo.model.dto.ChatMessage;

public interface RedisChatService {
	void saveMessage(String roomId, ChatMessage message);

	List<ChatMessage> getRecentMessages(String roomId);

}
