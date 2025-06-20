package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jdbc.repository.query.Modifying;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.model.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

	@Query(value = "SELECT user_id, username, password_hash, salt, email, active, role, created_at, updated_at FROM users WHERE email = :email", nativeQuery = true)
	User getUser(@Param("email") String email);

	
	User findByEmail(String email);
	
	User findByUsername(String username);
	
	//查USER的行程
	@Query(value = """
			SELECT  e.event_id ,e.start_time, e.title,r.status
			FROM registrations r
			JOIN events e ON r.event_id = e.event_id
			WHERE r.user_id = :userId AND r.status = 'COMPLETED'
			ORDER BY e.start_time ASC
			"""
			, nativeQuery = true)
	List<Object[]> getUserSchedule(@Param("userId") Integer userId);

}
