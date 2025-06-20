package com.example.demo.service.impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import com.example.demo.model.dto.ChatMessage;
import com.example.demo.service.RedisChatService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class RedisChatServiceImpl implements RedisChatService {
	// 注入 Redis操作工具 *字串型
	@Autowired
	private StringRedisTemplate redisTemplate;

	// 因為Redis只能存字串 所以要有工具把物件轉換
	private final ObjectMapper objectMapper = new ObjectMapper();

	@Override
	public void saveMessage(String roomId, ChatMessage message) {

		try {
			// 產生Redis 的Key (每個聊天室都有自己的訊息清單)
			String key = "chat:room:" + roomId + ":messages";

			// 物件轉成 JSON 字串
			String json = objectMapper.writeValueAsString(message);

			// 🔧 將訊息推進 List 的最前方（leftPush = 最新訊息在前）
			redisTemplate.opsForList().leftPush(key, json);

			// 🔧 裁切 List 長度，只保留最前面的 20 筆（最新的）
			redisTemplate.opsForList().trim(key, 0, 19);

		} catch (JsonProcessingException e) {
			e.printStackTrace();
			System.out.println("Redis_service:saveMessage發生錯誤");
		}
	}

	// noSQL中 取得聊天室訊息
	@Override
	public List<ChatMessage> getRecentMessages(String roomId) {
		// 產生Redis的Key
		String key = "chat:room:" + roomId + ":messages";

		// 從Redis 的List 拿出最多20筆資料（這裡順序是最新在前）
		List<String> jsonList = redisTemplate.opsForList().range(key, 0, 19);

		// 宣告一個List 來準備裝 解析Json完成的 ChatMassage物件
		List<ChatMessage> result = new ArrayList<>();

		// 循環處理 JSON 字串 → 物件
		for (String json : jsonList) {
			try {
				ChatMessage msg = objectMapper.readValue(json, ChatMessage.class);
				result.add(msg);
			} catch (JsonProcessingException e) {
				e.printStackTrace();
				System.out.println("Redis_service:getMessage發生錯誤");
			}
		}

		// 🔧 反轉結果，讓前端看到的是「舊到新」順序（FIFO 顯示）
		Collections.reverse(result);

		return result; // ✅ 回傳最近訊息清單
	}
}
