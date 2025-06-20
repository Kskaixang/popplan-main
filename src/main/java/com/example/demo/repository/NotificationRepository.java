package com.example.demo.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.demo.model.entity.Notification;

import jakarta.transaction.Transactional;

import java.util.List;


@Repository
public interface NotificationRepository extends JpaRepository<Notification, Integer>{
	
	List<Notification> findByUser_UserIdOrderByCreatedAtDesc(Integer user_UserId);

	@Query(value = "SELECT * FROM notifications WHERE user_id = :userId ORDER BY is_read ASC, created_at DESC", nativeQuery = true)
	List<Notification> findSortedByReadStatus(@Param("userId") Integer userId);
	
	@Transactional
	@Modifying
	@Query(value = "UPDATE notifications SET is_read = true WHERE user_id = :userId AND is_read = false", nativeQuery = true)
	void markAllAsReadByUserId(@Param("userId") Integer userId);

	int countByUser_UserIdAndIsReadFalse(Integer userId);


}
