package com.example.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

//WebSocket
@Configuration
@EnableWebSocketMessageBroker // 這就是STOMP
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

	// 建立訊息路由規則
	@Override
	public void configureMessageBroker(MessageBrokerRegistry registry) {
		//registry.enableSimpleBroker("/topic"); // 發送到以 /topic 開頭的目的地訊息, 訊息代理的前綴字(例如:/topic/messages)
		registry.enableSimpleBroker("/topic", "/queue");  //queue 代表私人前綴 topic代表廣播前綴
         //.setHeartbeatValue(new long[]{10000, 10000}); // server 送給 client 和接收 client 心跳間隔，單位ms
		registry.setApplicationDestinationPrefixes("/app"); // 應用程式前綴, 前端發送 "/app/chat" 會被對應到 @MessageChat("/chat)
	}

	@Override
	public void registerStompEndpoints(StompEndpointRegistry registry) {
		//這是大家一起連的 不需要{userId}
		registry.addEndpoint("/websocket").setAllowedOriginPatterns("http://localhost:5173") // ✅ 這行是重點
				.withSockJS(); // WebSocket 端點
	}

}
