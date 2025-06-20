package com.example.demo.repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.demo.model.entity.Event;
import com.example.demo.model.entity.Registration;
import com.example.demo.model.entity.RegistrationStaging;
import com.example.demo.model.entity.User;
import com.example.demo.model.enums.RegistrationStatus;

@Repository
public interface RegistrationStagingRepository extends JpaRepository<RegistrationStaging, Integer> {

	boolean existsByUserAndEvent(User registrationUser, Event event);

	Optional<RegistrationStaging> findByUser_userIdAndEvent_eventId(Integer userId, Integer eventId);

	// 統計正在報名中的人數 還未付款
	// Repository: 假表中，還在60秒內 + processed = false
	@Query("SELECT COUNT(rs) FROM RegistrationStaging rs " + "WHERE rs.event.eventId = :eventId "
			+ "AND rs.status = 'PENDING_PAYMENT' " + "AND rs.createdAt > :sixtySecondsAgo "	)
	int countActivePendingPayment(@Param("eventId") Integer eventId,
			@Param("sixtySecondsAgo") LocalDateTime sixtySecondsAgo);
	
	

	//排程 找出時間
	/*
	 * 實際上長這樣
	 * SELECT * FROM registration_staging
		WHERE status = 'PENDING_PAYMENT'
		  AND created_at < '2025-06-05 14:59:00'  舉例
	 */
	List<RegistrationStaging> findByStatusAndCreatedAtBefore(RegistrationStatus status, LocalDateTime time);

	//歷史紀錄用 要合併真假表
	List<RegistrationStaging> findByUserUserIdOrderByCreatedAtDesc(Integer userId);
}
