package com.example.demo.repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.entity.Event;
import com.example.demo.model.entity.Registration;
import com.example.demo.model.entity.User;
import com.example.demo.model.enums.RegistrationStatus;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Integer>{

	boolean existsByUserAndEvent(User registrationUser, Event event);
//查找是否已經有關聯
	Optional<Registration> findByUser_userIdAndEvent_eventIdAndStatus(Integer userId, Integer eventId,RegistrationStatus status);
	//人數計算
	int countByEvent_EventIdAndStatus(Integer eventId, RegistrationStatus status);
	//歷史紀錄用 要合併真假表
	List<Registration> findByUserUserIdOrderByCreatedAtDesc(Integer userId);
//頁面及時判斷有沒有成功一次的資料
	Optional<Registration> findTopByUser_userIdAndEvent_eventIdOrderByCreatedAtDesc(Integer userId, Integer eventId);
	
}
