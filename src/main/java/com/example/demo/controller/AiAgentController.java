package com.example.demo.controller;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.dto.RegistrationStagingDto;
import com.example.demo.model.dto.UserCert;
import com.example.demo.model.enums.RegistrationStatus;
import com.example.demo.repository.EventRepository;
import com.example.demo.response.ApiResponse;
import com.example.demo.service.RegistrationService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/popplanllm")
@CrossOrigin(origins = "http://localhost:5173,http://localhost:8082")
public class AiAgentController {

	@Autowired
	private EventRepository eventRepository;
	@Autowired
	private RegistrationService registrationService;

	

	@GetMapping("/agentEvent")
	public String agentEvent(
			@RequestParam String tag,
			@RequestParam Integer userId ) {
		
		String normalizedTag = tag;
		switch (normalizedTag) {
		case "1":
		case "一":
			normalizedTag = "週一";
			break;
		case "2":
		case "二":
			normalizedTag = "週二";
			break;
		case "3":
		case "三":
			normalizedTag = "週三";
			break;
		case "4":
		case "四":
			normalizedTag = "週四";
			break;
		case "5":
		case "五":
			normalizedTag = "週五";
			break;

		case "6":
		case "六":
			normalizedTag = "週六";
			break;
		case "7":
		case "日":
			normalizedTag = "週日";
			break;
		default:
			// 其他狀況可以視情況預設或回錯誤訊息
			System.out.println("無法識別的tag，預設為週六");
			normalizedTag = "週六";
			break;
		}
		
		 
		System.out.println("AAAAAAAAAAAAAAAAA");
	    System.out.println("➡ 收到 tag: " + normalizedTag);

	    List<Object[]> result = eventRepository.findTopEventByTag(normalizedTag,userId);
	    System.out.println("🔍 查詢結果 size: " + result.size());

	    if (result.isEmpty()) {
	        return "找不到與 [" + tag + "] 有關的活動";
	    }

	    Object[] event = result.get(0);
	    System.out.println("✔ 取出 event[0]: " + Arrays.toString(event));

	    // 確保 event 長度夠
	    if (event.length < 3) {
	        return "活動資料欄位不完整";
	    }

	    Integer eventId = ((Number) event[0] ).intValue();
	    String title = (String) event[1];
	    String price = String.valueOf(event[2]);

	    String msg = "查到的活動是「" + title + "」，價格是 " + price + "，活動ID 是 " + eventId;
	    System.out.println("✅ 回傳文字: " + msg);
	    return msg;
	}
	
	//PUT 增加關聯 還未付款 關聯好了 再把ID吐回前面 讓React跳轉時 根據resData.eventId 跳轉  解決非同步問題
		@GetMapping("/registration/{eventId}")
		public String addRegistration(
		    @PathVariable Integer eventId,
		    @RequestParam Integer userId  // ✅ 這裡接住 userId
		) {
		    System.out.println("使用者 ID: " + userId);
		    System.out.println("活動 ID: " + eventId);
		    
		    RegistrationStagingDto registrationDto = registrationService.addRegistrationStaging(userId, eventId);

		    if (registrationDto.getStatus() == RegistrationStatus.COMPLETED) {
		        return "免費活動參加成功，所有動作已經結束";
		    }

		    Integer id = registrationDto.getRegistrationId();
		    return "報名成功 交易編號 : " + id + " AI想詢問是否要幫您完成交易編號" + id + "的交易?";
		}
		
		//點擊付款
		@PutMapping("/transactional/{registrationId}")
		public String transactional(@PathVariable Integer registrationId, HttpSession session){
			System.out.println("CCCCCCCCCagent進入了付款");
			registrationService.transactional(registrationId);
			return "付費活動參加成功";
		}


}
