package com.example.demo.util;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.example.demo.mapper.RegistrationMapper;
import com.example.demo.model.entity.Notification;
import com.example.demo.model.entity.Registration;
import com.example.demo.model.entity.RegistrationStaging;
import com.example.demo.model.entity.User;
import com.example.demo.model.enums.RegistrationStatus;
import com.example.demo.repository.NotificationRepository;
import com.example.demo.repository.RegistrationRepository;
import com.example.demo.repository.RegistrationStagingRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Component
public class RegistrationStagingScheduler {
	// 定義一個常用的日期格式
	private DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
	@Autowired
	private RegistrationStagingRepository registrationStagingRepository;
	@Autowired
	private RegistrationRepository registrationRepository;
	@Autowired
	private RegistrationMapper registrationMapper;
	@Autowired
	private NotificationRepository notificationRepository;

	@Autowired
	private SimpMessagingTemplate simpMessageinTemplate;

	// 時間轉字串
	private String format(LocalDateTime dateTime) {
		return dateTime.format(formatter);
	}

	@Transactional
	@Scheduled(fixedRate = 10000) // 每10秒執行
	public void processExpiredRegistrations() {
		// System.out.println("自動排程執行在:" + LocalDateTime.now());
		LocalDateTime paymentDeadline = LocalDateTime.now().minusSeconds(60);

		List<RegistrationStaging> expiredList = registrationStagingRepository
				.findByStatusAndCreatedAtBefore(RegistrationStatus.PENDING_PAYMENT, paymentDeadline);

		if (expiredList.isEmpty()) {
			// System.out.println("此次排程無逾期交易資料:無動作");
			return;
		}

		for (RegistrationStaging registrationStaging : expiredList) {
			try {
				// ✅ 建立對應的真表資料
				Registration registration = registrationMapper.toRegistration(registrationStaging);
				User user = registration.getUser();
				registration.setStatus(RegistrationStatus.TIMEOUT);
				registrationRepository.save(registration);

				// ✅ 刪除 staging 表的過期資料
				registrationStagingRepository.delete(registrationStaging);

				System.out.println("逾時報名已搬移，Staging.Id: " + registrationStaging.getRegistrationId());

				// 發送給用戶 獲得通知 時間 重新報名的活動頁
				String title = registration.getEvent().getTitle();
				String titleSub = title.length() <= 10 ? title : title.substring(0, 10) + "...";
				String formattedTime = format(registrationStaging.getCreatedAt());
				String sameEventUrl = "/event/" + registrationStaging.getEvent().getEventId();
				Notification notification = new Notification(user, "活動 : " + titleSub + " 的報名因逾時未付款已取消，請重新報名。",
						sameEventUrl);
				notificationRepository.save(notification);
				simpMessageinTemplate.convertAndSend("/topic/notification/" + user.getUserId(),
						notification.getMessage());

			} catch (Exception e) {
				e.printStackTrace();
				System.out.println("搬運失敗：Staging ID = " + registrationStaging.getRegistrationId());
			}
		}
	}

}
