package com.example.demo.service.impl;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import com.example.demo.controller.AuthCodeServlet;
import com.example.demo.exception.event.EventNotFoundException;
import com.example.demo.exception.login.UserNotFoundException;
import com.example.demo.exception.registration.AlreadyRegisteredException;
import com.example.demo.exception.registration.PendingPaymentExistsException;
import com.example.demo.exception.registration.RegistrationMaximumException;
import com.example.demo.exception.registration.RegistrationNotFoundException;
import com.example.demo.mapper.RegistrationMapper;
import com.example.demo.model.dto.RegistrationHistoryDto;
import com.example.demo.model.dto.RegistrationStagingDto;
import com.example.demo.model.entity.Event;
import com.example.demo.model.entity.Notification;
import com.example.demo.model.entity.Registration;
import com.example.demo.model.entity.RegistrationStaging;
import com.example.demo.model.entity.User;
import com.example.demo.model.enums.RegistrationStatus;
import com.example.demo.repository.EventRepository;
import com.example.demo.repository.NotificationRepository;
import com.example.demo.repository.RegistrationRepository;
import com.example.demo.repository.RegistrationStagingRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.EmailService;
import com.example.demo.service.RegistrationService;
import com.example.demo.service.RegistrationTaskSchedulerService;

import jakarta.transaction.Transactional;

@Service
public class RegistrationServiceImpl implements RegistrationService {

	// 定義一個常用的日期格式
	private DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

	// 時間轉字串
	private String format(LocalDateTime dateTime) {
		return dateTime.format(formatter);
	}

	@Autowired
	private RegistrationRepository registrationRepository;
	@Autowired
	private RegistrationStagingRepository registrationStagingRepository;
	@Autowired
	private UserRepository userRepository;
	@Autowired
	private EventRepository eventRepository;
	@Autowired
	private EmailService emailService;
	@Autowired
	private RegistrationMapper registrationMapper;
	@Autowired
	private RegistrationTaskSchedulerService registrationTaskSchedulerService;
	@Autowired
	private NotificationRepository notificationRepository;
	@Autowired
	private SimpMessagingTemplate simpMessageinTemplate;

	@Transactional
	@Override
	public RegistrationStagingDto checkRegistrationStaging(Integer userId, Integer eventId) {

		// 檢查真表
		Optional<Registration> optRegistration = registrationRepository
				.findTopByUser_userIdAndEvent_eventIdOrderByCreatedAtDesc(userId, eventId);
		if (optRegistration.isPresent()) {
			Registration registration = optRegistration.get();
			// 如果存在檢查是不是COMPLETED 是的話 報名頁切換提示
			if (registration.getStatus() == RegistrationStatus.COMPLETED) {
				RegistrationStagingDto dto = registrationMapper.toDto(registration); // 有就呈現要的內容
				return dto;
			}
		}
		// 檢查假表
		Optional<RegistrationStaging> optRegistrationStaging = registrationStagingRepository
				.findByUser_userIdAndEvent_eventId(userId, eventId);
		if (optRegistrationStaging.isPresent()) {
			// 如果存在檢查是不是PENDING_PAYMENT 剛報名 未付款 是就直接....
			RegistrationStaging registrationStaging = optRegistrationStaging.get();
			LocalDateTime expireAt = registrationStaging.getCreatedAt().plusSeconds(60);
			// 不信任狀態、信任「時間 」來判斷邏輯是否成立。 staging 表理論上只會有 PENDING_PAYMENT，如果未來擴充再加條件
			if (expireAt.isAfter(LocalDateTime.now())) {
				RegistrationStagingDto dto = registrationMapper.toDto(registrationStaging); // 有就呈現要的內容
				return dto;
			}
		}
		return new RegistrationStagingDto(); // 都沒有就回傳空值
	}
	

	public int getRegistrationCount(Integer eventId) {
		int completedCount = registrationRepository.countByEvent_EventIdAndStatus(eventId,
				RegistrationStatus.COMPLETED);
		LocalDateTime sixtySecondsAgo = LocalDateTime.now().minusSeconds(60);
		int pendingCount = registrationStagingRepository.countActivePendingPayment(eventId, sixtySecondsAgo);
		return completedCount + pendingCount;
	}

	// 當前端已經過濾完 這邊會是決定報名的順間 也就是entity的實體化 因為上面其實都沒有save行為 所以不影響資料庫 但這邊就不一樣了
	public RegistrationStagingDto addRegistrationStaging(Integer userId, Integer eventId) {
		// 檢查暫存假報名 但要用時間和對 而不是 狀態 狀態應該一開始是付款中 就直接return
		Optional<RegistrationStaging> optRegistrationStaging = registrationStagingRepository
				.findByUser_userIdAndEvent_eventId(userId, eventId);
		
		if (optRegistrationStaging.isPresent() ) {
			RegistrationStaging registrationStaging = optRegistrationStaging.get();
			RegistrationStagingDto registrationStagingDto = registrationMapper.toDto(registrationStaging);
			return registrationStagingDto;
		}
		//檢查真表 如果查到東西 代表早就報名"完成"過了 這邊是為了處理AIagent的重複報名 不然光靠前端操作 是很難觸發的
		Optional<Registration> optRegistration = registrationRepository
				 .findByUser_userIdAndEvent_eventIdAndStatus(userId, eventId, RegistrationStatus.COMPLETED);
		if (optRegistration.isPresent() ) {
			throw new RuntimeException("已經報名完成，請勿重複報名");
		}
		
		// 先建立關聯 此階段不代表已經付款完成 會有以下初始化
		// this.isConfirmed = false;
		// this.paidAmount = event.getPrice();
		Event event = eventRepository.findById(eventId).orElseThrow(() -> new EventNotFoundException("活動不存在，系統發生錯誤"));
		User registrationUser = userRepository.findById(userId)
				.orElseThrow(() -> new UserNotFoundException("登入帳號不存在，請重新登入"));
		if (event.getOrganizerUser().getUserId() == userId) {
			throw new RuntimeException("此活動是由您創建，無法報名");
		}
		//未來我想回憶專案 可能會忘記要補上時間  原本是只撈 未來活動 但可能我畢業很久 想回頭看 就撈不到任何新資料了 因為全都是過去活動
		if (event.getStartTime().isBefore(LocalDateTime.now())) {
		    throw new RuntimeException("此活動已經結束，無法報名");
		}
		
		
		// 自訂的公開方法 查看人數
		int registrationCount = getRegistrationCount(eventId);
		if (registrationCount >= event.getMaxParticipants()) {
			throw new RegistrationMaximumException("此活動報名人數已達上限");
		}
		// 判斷活動是否是免費 式的化就即刻報名成功進入正式表
		if (event.getPrice().compareTo(BigDecimal.ZERO) == 0) {
			Registration registration = new Registration(registrationUser, event);
			registration.setStatus(RegistrationStatus.COMPLETED);
			// 轉換
			Registration SqlEntity = registrationRepository.save(registration);
			RegistrationStagingDto registrationStagingDto = registrationMapper.toDto(SqlEntity);
			// 發送Email 上面沒報錯 在送mail
			String QRLink = "http://localhost:8080/email/QR?eventId=" + event.getEventId();
			emailService.sendEmail(registrationUser.getEmail(), QRLink);
			String formattedTime = format(registration.getCreatedAt());
			String sameEventUrl = "/event/" + registration.getEvent().getEventId();
			
			String title = SqlEntity.getEvent().getTitle();
			String titleSub = title.length() <=10 ? title : title.substring(0,10) + "...";
			Notification notification = new Notification(registrationUser, "活動 : " + titleSub + " 的免費報名已成功。", sameEventUrl);
			notificationRepository.save(notification);
			
			
			//這邊是 Websocket 訂閱  這邊沒有存實體 只有WebSocket通知
			simpMessageinTemplate.convertAndSend("/topic/notification/" + registrationUser.getUserId(),
					notification.getMessage());
			return registrationStagingDto; // 雖然是假表 但這邊是真表資料
		}
		// 如果要付費 則是進入Staging 暫表
		RegistrationStaging registrationStaging = new RegistrationStaging(registrationUser, event);
		// 取存好的實體 我要拿id
		RegistrationStaging SqlEntity = registrationStagingRepository.save(registrationStaging);	
		
		String title = SqlEntity.getEvent().getTitle();
		String titleSub = title.length() <=10 ? title : title.substring(0,10) + "...";
		//String formattedTime = format(SqlEntity.getCreatedAt());
		String sameEventUrl = "/event/" + SqlEntity.getEvent().getEventId();
		Notification notification = new Notification(registrationUser, "活動 : " + titleSub + " 的報名已建立請前往付款。", sameEventUrl);
		notificationRepository.save(notification);
		simpMessageinTemplate.convertAndSend("/topic/notification/" + registrationUser.getUserId(),
				notification.getMessage());
		
		
		// 轉換
		RegistrationStagingDto registrationStagingDto = registrationMapper.toDto(SqlEntity);
		
		return registrationStagingDto;

	}

	@Transactional
	@Override
	public void transactional(Integer registrationId) {
		Optional<RegistrationStaging> optRegistrationStaging = registrationStagingRepository.findById(registrationId);
		// 這應該很難觸發 畢竟是近頁面後才有付款按鈕
		if (optRegistrationStaging.isEmpty()) {
			throw new AlreadyRegisteredException("操作逾時或報名未成功無報名資料,請查看報名紀錄確認");
		}

		RegistrationStaging registrationStaging = optRegistrationStaging.get();
		Event event = registrationStaging.getEvent();
		User registrationUser = registrationStaging.getUser();
		
		// 檢查用戶的錢包 是否足夠扣款? Wallet實體方法中deduct 已經有檢查機制 所以不寫
		User organizerUser = event.getOrganizerUser();
		BigDecimal transactionAmount = registrationStaging.getPaidAmount(); // 要拿當初USER報明瞬間的金額 而不是從event拿
		// 此Service我們自己寫的交易方法
		transferAmount(registrationUser, organizerUser, transactionAmount);
		// 支付都沒問題 要進行 暫存假表 與 真表的至換 且刪除假表
		Registration registration = registrationMapper.toRegistration(registrationStaging);
		registration.setStatus(RegistrationStatus.COMPLETED);
		registrationRepository.save(registration); // 真表建立完成
		// registrationRepository.flush(); // <--- 強制寫入，避免同步衝突

		registrationStagingRepository.delete(registrationStaging);		
		String QRLink = "http://localhost:8080/email/QR?eventId=" + event.getEventId();
		emailService.sendEmail(registrationUser.getEmail(), QRLink);
		// 通知
		String title = event.getTitle();
		String titleSub = title.length() <=10 ? title : title.substring(0,10) + "...";
		//String formattedTime = format(registration.getCreatedAt());
		String sameEventUrl = "/event/" + registration.getEvent().getEventId();
		Notification notification = new Notification(registrationUser, "活動 : " + titleSub +  " 的付費報名已成功。", sameEventUrl);
		notificationRepository.save(notification);
		simpMessageinTemplate.convertAndSend("/topic/notification/" + registrationUser.getUserId(),
				notification.getMessage());

	}

	// 交易過程
	@Transactional
	private void transferAmount(User from, User to, BigDecimal amount) {
		BigDecimal deducted = from.getWallet().deduct(amount);
		to.getWallet().add(deducted);
	}

	// 付款中取消邏輯
	@Override
	public void cancelRegistrationStaging(Integer userId, Integer restartionStagingId) {
		Optional<RegistrationStaging> optRregistrationStaging = registrationStagingRepository
				.findById(restartionStagingId);
		if (optRregistrationStaging.isEmpty()) {
			return; // 被排程刪掉就不通知 因為排程那邊會自動通知 且轉真表 這邊只需要回饋訊息就好
		}
		RegistrationStaging registrationStaging = optRregistrationStaging.get();
		User registrationUser = userRepository.findById(userId)
				.orElseThrow(() -> new UserNotFoundException("登入帳號不存在，請重新登入"));
		//建立對應的真表資料 且刪除假表
		Registration registration = registrationMapper.toRegistration(registrationStaging);
		registration.setStatus(RegistrationStatus.CANCELLED);
		registrationRepository.save(registration);
		registrationStagingRepository.deleteById(restartionStagingId);
		// 通知需要補強 所以時間工具 確實要抽取 趕時間 算了
		String title = registration.getEvent().getTitle();
		String titleSub = title.length() <=10 ? title : title.substring(0,10) + "...";
		//String formattedTime = format(registrationStaging.getCreatedAt());
		String sameEventUrl = "/event/" + registrationStaging.getEvent().getEventId();
		Notification notification = new Notification(registrationUser,"活動 : " + titleSub +  " 的報名已經取消。", sameEventUrl);
		notificationRepository.save(notification);
		simpMessageinTemplate.convertAndSend("/topic/notification/" + registrationUser.getUserId(),
				notification.getMessage());
	}

	// 報名完成取消邏輯
	@Override
	public void cancelRegistration(Integer userId, Integer restartionId) {
		// 也檢查真表 通常會有 因為取消情況 COMPLETE 會在這邊出現
		Optional<Registration> optRregistration = registrationRepository.findById(restartionId);
		if (optRregistration.isEmpty()) {
			return; // 如果為空 那有BUG 根本前端沒機會取消才正確
		}
		Registration registration = optRregistration.get();
		User registrationUser = userRepository.findById(userId)
				.orElseThrow(() -> new UserNotFoundException("登入帳號不存在，請重新登入"));
		//修改真表的狀態 讓統計人數可以排除
		registration.setStatus(RegistrationStatus.CANCELLED);
		registrationRepository.save(registration);
		// 通知需要補強 所以時間工具 確實要抽取 
		String title = registration.getEvent().getTitle();
		String titleSub = title.length() <=10 ? title : title.substring(0,10) + "...";
		//String formattedTime = format(registration.getCreatedAt());
		String sameEventUrl = "/event/" + registration.getEvent().getEventId();
		Notification notification = new Notification(registrationUser, "活動 : " + titleSub +   " 的參加已經取消。", sameEventUrl);
		notificationRepository.save(notification);
		simpMessageinTemplate.convertAndSend("/topic/notification/" + registrationUser.getUserId(),
				notification.getMessage());

	}

	@Override
	public RegistrationStagingDto getRegistration(Integer RegistrationStagingId) {
		Optional<RegistrationStaging> optRegistrationStaging = registrationStagingRepository
				.findById(RegistrationStagingId);
		if (optRegistrationStaging.isEmpty()) {
			throw new RegistrationNotFoundException("找不到報名紀錄");
		}
		RegistrationStaging registrationStaging = optRegistrationStaging.get();
		RegistrationStagingDto registrationStagingDto = registrationMapper.toDto(registrationStaging);

		return registrationStagingDto;
	}

	@Override
	public List<RegistrationHistoryDto> findRegistrationByUserId(Integer userId) {
		// 我們要查兩張 真假表的資料 並合併成Dto 但要注意 假表先加
		List<RegistrationStaging> registrationStagings = registrationStagingRepository
				.findByUserUserIdOrderByCreatedAtDesc(userId);
		List<Registration> registrations = registrationRepository.findByUserUserIdOrderByCreatedAtDesc(userId);

		List<RegistrationHistoryDto> registrationHistoryDtos = new ArrayList<>();
		if (registrationStagings.size() == 0 && registrations.size() == 0) {
			return registrationHistoryDtos; // 都沒資料就直接傳空
		}
		List<RegistrationHistoryDto> stagingHistorys = registrationStagings.stream()
				.map(r -> registrationMapper.StaginToHistory(r)).toList();

		List<RegistrationHistoryDto> historys = registrations.stream().map(r -> registrationMapper.toHistory(r))
				.toList();

		registrationHistoryDtos.addAll(stagingHistorys);
		registrationHistoryDtos.addAll(historys);

		return registrationHistoryDtos;
	}

}
