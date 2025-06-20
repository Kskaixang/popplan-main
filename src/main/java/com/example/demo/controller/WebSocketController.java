package com.example.demo.controller;

import java.time.Instant;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import com.example.demo.model.dto.ChatMessage;
import com.example.demo.service.RedisChatService;

@Controller
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class WebSocketController {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    @Autowired
    private RedisChatService redisChatService;
    
	// 活動聊天室 不存紀錄 退出即刪 @DestinationVariable STOMP 訊息中的 destination，如 /app/chat/1
	// 相似PathVariable
	@MessageMapping("/chat/{eventId}") // 當有訊息到了/app/chat 那就發送給有/topic/message 訂閱的人 收資料
	 public void send(@DestinationVariable String eventId, ChatMessage message) {
        //補上時間格式
		message.setTimestamp(Instant.now().toString());
		//儲存訊息到Redis 以聊天室Id 為 key List結構儲存
		redisChatService.saveMessage(eventId,message);
        messagingTemplate.convertAndSend("/topic/messages/" + eventId, message);
    }
	
	
	
	// 錯誤通知訂閱
	@MessageMapping("/registrationFail/{userId}")
	public void sendFail(@DestinationVariable String userId,ChatMessage message) {
		System.out.println("有個用戶啟動了訂閱通知功能 他是:" + userId);
		messagingTemplate.convertAndSend("/topic/notification/" + userId, message);
	}
}
