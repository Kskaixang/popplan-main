package com.example.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.demo.model.entity.Event;
import com.example.demo.model.entity.Favorite;
import com.example.demo.model.entity.User;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Integer> {
	// findByUser_IdAndEvent_Id 才會深掘他們各自ID
	// 如果你寫 findByUserIdAndEventId 那他就只會在Favorite找userId欄位 但這是沒有的
	Optional<Favorite> findByUser_userIdAndEvent_eventId(Integer userId, Integer eventId);

	// 檢查是否存在
	Boolean existsByUserAndEvent(User userId, Event event);

	void deleteByUserAndEvent(User userId, Event event);
	//給EventList使用的 查詢登入的使用者有哪些收藏
	List<Favorite> findAllByUser_userId(Integer userId);
	
	//給Navbar的 Cert簽證 顯示現在這位使用者有幾筆收藏
	int countByUser_UserId(Integer userId);

	
}
