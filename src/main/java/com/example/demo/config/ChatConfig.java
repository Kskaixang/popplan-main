package com.example.demo.config;

//AI工具
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

//告訴Spring是一個設定黨
@Configuration
public class ChatConfig {
	// 此物件被Spring管理 其他程式可以透過 @Autowired 自動綁定來取得該物件 不需要new
	// ChatClient.Builder 由依賴注入 不用創建
	@Bean
	public ChatClient chatClient(ChatClient.Builder builder) {
		return builder.build();
	}

}
