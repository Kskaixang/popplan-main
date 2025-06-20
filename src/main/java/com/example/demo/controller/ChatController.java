package com.example.demo.controller;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import reactor.core.publisher.Flux;
//給MediaType.TEXT_EVENT_STREAM_VALUE用
import org.springframework.http.MediaType;

//我們直接在static index.html啟用 雙擊打開
//AI產生文案
@RestController
@RequestMapping("/chat")
@CrossOrigin(origins = "http://localhost:5173")
public class ChatController {
		@Autowired
		private ChatClient chatClient;		
		// 測試:http://localhost:8081/chat/ask?q=Hello 之後都會用下面的 這不重要了
		//@GetMapping("/ask不使用")
//		public String ask(@RequestParam String q) {
//			return chatClient.prompt().user(q).call().content();
//		}		
		//逐字回報 增加用戶體驗
		//使用SSE技術 Server-Send-Events
		//Emitter :　發射器
		@GetMapping(value = "/ask" , produces = MediaType.TEXT_EVENT_STREAM_VALUE)
		public SseEmitter ask2(@RequestParam String q) {
			
			q += " | (請依照以上關鍵字做一個200字活動文宣且不要生硬，只要結果不要任何補充說明，結尾避免重複我的Tag，文宣有完成就可以了)";
			//建立發射器物件 (0L)代表瀏覽器永遠不超時  我們設定3分鐘吧 太多感覺危險
			SseEmitter emitter = new SseEmitter(3 * 60 * 1000L); 
			//使用ChatClient 的Stream方法 來獲取串流回應
			Flux<String> responseFlex = chatClient.prompt().user(q).stream().content();		
			//透過Flex的訂閱機制 將資料逐字傳回前端
			responseFlex.subscribe(
					word -> {
						try {
							emitter.send(word); // 逐字發送
						} catch (Exception e) {
							emitter.completeWithError(e);  // 回報錯誤
						}
					},
					emitter::completeWithError, //如果有錯誤訊息 放入mitter
					emitter::complete);
			return emitter;
		}
}
