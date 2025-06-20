package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.dto.ChatMessage;
import com.example.demo.service.RedisChatService;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true") // ✅ 前端用 Vite 的 dev server 要這個 CORS
public class WebRestChatController {
	@Autowired
	private RedisChatService redisChatService;
	
	/**
	 * 提供聊天室歷史訊息的API
	 * GET /api/chat/{roomId}/history
	 * 
	 * @Param roomId 前端傳來得聊天室ID (eventID)
	 * @return List<ChatMessage> 轉成Json給前端
	 */
	@GetMapping("/{roomId}/history")
	public List<ChatMessage> getHistory(@PathVariable String roomId){
		List<ChatMessage> messages = redisChatService.getRecentMessages(roomId);
		System.out.println(messages);
		return messages;
	}
}
