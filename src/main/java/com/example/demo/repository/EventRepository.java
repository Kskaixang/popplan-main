package com.example.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.demo.model.entity.Event;

@Repository
public interface EventRepository extends JpaRepository<Event, Integer> {

	
	//findAllEvents
	@Query(value = """
			    SELECT 
			 e.event_id,
			 u.username,
			 MAX(e.image) AS image,
			 MAX(e.title) AS title,
			 MAX(e.description) AS description,
			 MAX(e.start_time) AS start_time,
			 MAX(e.max_participants) AS max_participants,
			 MAX(e.status) AS status,
			 MAX(e.price) AS price,
			 GROUP_CONCAT(t.tag_name ORDER BY t.tag_name SEPARATOR ',') AS tags
			FROM events e
			JOIN users u ON e.organizer_id = u.user_id
			LEFT JOIN event_tag et ON e.event_id = et.event_id
			LEFT JOIN tags t ON et.tag_id = t.tag_id
			WHERE e.start_time > NOW()
			GROUP BY e.event_id, u.username
			ORDER BY MAX(e.created_at) DESC;
			     """, nativeQuery = true)
	List<Object[]> findAllEventDtosNative();
	
	//findAllMyEvents
		@Query(value = """
				    SELECT 
				 e.event_id,
				 u.username,
				 MAX(e.image) AS image,
				 MAX(e.title) AS title,
				 MAX(e.description) AS description,
				 MAX(e.start_time) AS start_time,
				 MAX(e.max_participants) AS max_participants,
				 MAX(e.status) AS status,
				 MAX(e.price) AS price,
				 GROUP_CONCAT(t.tag_name ORDER BY t.tag_name SEPARATOR ',') AS tags
				FROM events e
				JOIN users u ON e.organizer_id = u.user_id
				LEFT JOIN event_tag et ON e.event_id = et.event_id
				LEFT JOIN tags t ON et.tag_id = t.tag_id
				WHERE e.organizer_id = :organizer_id  -- 自己的活動就不用篩時間了 但可能前端要顯示是否結束
				GROUP BY e.event_id, u.username
				ORDER BY MAX(e.created_at) DESC;
				     """, nativeQuery = true)
		List<Object[]> findAllMyEventDtosNative(Integer organizer_id);
		
		//findAllFavoriteEvents
		@Query(value = """
				    SELECT 
				 e.event_id,
				 u.username,
				 MAX(e.image) AS image,
				 MAX(e.title) AS title,
				 MAX(e.description) AS description,
				 MAX(e.start_time) AS start_time,
				 MAX(e.max_participants) AS max_participants,
				 MAX(e.status) AS status,
				 MAX(e.price) AS price,
				 GROUP_CONCAT(t.tag_name ORDER BY t.tag_name SEPARATOR ',') AS tags
				FROM events e
				JOIN favorites f ON f.event_id = e.event_id
				JOIN users u ON e.organizer_id = u.user_id
				LEFT JOIN event_tag et ON e.event_id = et.event_id
				LEFT JOIN tags t ON et.tag_id = t.tag_id
				WHERE f.user_id = :user_id
				GROUP BY e.event_id, u.username
				ORDER BY MAX(f.created_at) DESC;
				     """, nativeQuery = true)
		List<Object[]> findAllFavoriteEventDtosNative(Integer user_id);
	
	
	
	
	
	
	
	
	//EventDetailDto
	@Query(value = """
			SELECT event_id , 
			e.description , 
			e.image , 
			e.location , 
			e.max_participants, 
			e.price, 
			e.start_time,
			e.status,
			e.title,
            u.username
			FROM events e 
            JOIN users u ON e.organizer_id = u.user_id
            WHERE event_id = :eventId
             LIMIT 1;
			""",nativeQuery = true)
	List<Object[]> findEventWithOrganizer(Integer eventId);
	
	
	
	//給AI agent做出第一部查詢
	@Query(value = """
		     SELECT e.event_id,
			        e.title,
			        e.price
		    FROM events e
		    JOIN users u ON e.organizer_id = u.user_id
		    LEFT JOIN event_tag et ON e.event_id = et.event_id
		    LEFT JOIN tags t ON et.tag_id = t.tag_id
		    WHERE t.tag_name = :tag
		      AND e.start_time > NOW()
		      AND e.organizer_id != :userId  
		    GROUP BY e.event_id, u.username
		    ORDER BY e.start_time ASC
		    LIMIT 1;
		    """, nativeQuery = true)
	 List<Object[]>  findTopEventByTag(String tag,Integer userId);
	


}
