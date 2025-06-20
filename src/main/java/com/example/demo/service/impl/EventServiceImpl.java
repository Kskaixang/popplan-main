package com.example.demo.service.impl;

import java.io.IOException;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.*;
import java.util.stream.Collector;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.exception.event.EventImageIOException;
import com.example.demo.exception.event.EventNotFoundException;
import com.example.demo.exception.login.UserNotFoundException;
import com.example.demo.mapper.EventMapper;
import com.example.demo.model.dto.EventDetailDto;
import com.example.demo.model.dto.EventDto;
import com.example.demo.model.dto.UserCert;
import com.example.demo.model.entity.Event;
import com.example.demo.model.entity.Favorite;
import com.example.demo.model.entity.Tag;
import com.example.demo.repository.EventRepository;
import com.example.demo.repository.FavoriteRepository;
import com.example.demo.repository.RegistrationRepository;
import com.example.demo.repository.TagRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.EventService;
import com.example.demo.service.FavoriteService;
import com.example.demo.service.ImageService;
import com.example.demo.service.RegistrationService;

import jakarta.transaction.Transactional;

import com.example.demo.model.entity.User;
import com.example.demo.model.enums.EventStatus;

@Service
public class EventServiceImpl implements EventService {

	@Autowired
	private EventRepository eventRepository;
	@Autowired
	private UserRepository userRepository;
	@Autowired
	private EventMapper eventMapper;
	@Autowired
	private TagRepository tagRepository;
	@Autowired
	private ImageService imageService;
	@Autowired
	private FavoriteRepository favoriteRepository;
	@Autowired
	private RegistrationRepository registrationRepository;
	@Autowired
	private RegistrationService registrationService;
	
	//三個唯一不同的在Repository 的篩選 findAllEvents findAllMyEvents findAllFavoriteEvents
	@Transactional
	@Override
	public List<EventDto> findAllEvents(Integer userId) {
		// 用來給前端渲染愛心狀態
		Set<Integer> favoritedIds = getFavoritedIdsByUserId(userId);
		final Set<Integer> favoritedEventIds = favoritedIds;
		List<Object[]> rows = eventRepository.findAllEventDtosNative();
		return eventServiceMapperToDto(favoritedEventIds, rows);
	}
	@Override
	public List<EventDto> findAllmyCreatedEvents(Integer userId) {
		Set<Integer> favoritedIds = getFavoritedIdsByUserId(userId);
		final Set<Integer> favoritedEventIds = favoritedIds;
		List<Object[]> rows = eventRepository.findAllMyEventDtosNative(userId);
		return eventServiceMapperToDto(favoritedEventIds, rows);
	}

	@Override
	public List<EventDto> findAllFavoriteEvents(Integer userId) {
		Set<Integer> favoritedIds = getFavoritedIdsByUserId(userId);
		final Set<Integer> favoritedEventIds = favoritedIds;
		List<Object[]> rows = eventRepository.findAllFavoriteEventDtosNative(userId);
		return eventServiceMapperToDto(favoritedEventIds, rows);
	}

	// 用來給前端渲染愛心狀態
	private Set<Integer> getFavoritedIdsByUserId(Integer userId) {
		Set<Integer> favoritedIds;// set的無序和唯一 查找效率更高
		// 檢查登入狀況
		if (userId != null) {
			List<Favorite> favorites = favoriteRepository.findAllByUser_userId(userId);
			favoritedIds = favorites.stream().map(fav -> fav.getEvent().getEventId()).collect(Collectors.toSet());
		} else {
			favoritedIds = Collections.emptySet();
		}
		return favoritedIds;
	}

	

	// 用來自定義Dto映射
	private List<EventDto> eventServiceMapperToDto(Set<Integer> favoritedEventIds, List<Object[]> rows) {
		// 這邊是為了處理Lambda 不接收外部變數
		// 在 stream().map(...) 的 lambda 裡，你所使用的外部變數（像 favoritedEventIds）
		// 必須是 final 或 effectively final，也就是不能在 lambda 裡之外被重新指派。
		// 否則底下 if(!favoritedEventIds.isEmpty()) 會報錯
		return rows.stream().map(row -> {
			EventDto dto = new EventDto();
			dto.setEventId((Integer) row[0]);
			dto.setOrganizerName((String) row[1]);
			dto.setImage((String) row[2]);
			dto.setTitle((String) row[3]);
			dto.setDescription((String) row[4]);
			dto.setStartTime(((Timestamp) row[5]).toLocalDateTime()); // 若是 SQL Timestamp
			dto.setMaxParticipants((Integer) row[6]);
			dto.setStatus(EventStatus.valueOf((String) row[7]));
			dto.setPrice(new BigDecimal((String) row[8].toString())); // SQL 有下MAX聚合 會先成為字串
			String tagsConcat = (String) row[9];
			dto.setTags(tagsConcat != null ? Arrays.asList(tagsConcat.split(",")) : Collections.emptyList());
			// 如果登入 補上他對於forEach中的活動 有沒有收藏 有的話 給true
			if (!favoritedEventIds.isEmpty()) {
				dto.setIsFavorited(favoritedEventIds.contains(dto.getEventId()));
			}
			int currentParticipants = registrationService.getRegistrationCount((Integer) row[0]);
			dto.setCurrentParticipants(currentParticipants);
			return dto;
		}).toList();
	}

	@Override
	public EventDetailDto getEventById(Integer eventId) {
		List<Object[]> result = eventRepository.findEventWithOrganizer(eventId);
		Object[] row = result.get(0);

		EventDetailDto dto = new EventDetailDto();
		dto.setEventId((Integer) row[0]);
		dto.setDescription((String) row[1]);
		dto.setImage((String) row[2]);
		dto.setLocation((String) row[3]);
		dto.setMaxParticipants((Integer) row[4]);
		dto.setPrice(((BigDecimal) row[5]));
		dto.setStartTime(((Timestamp) row[6]).toLocalDateTime());
		dto.setStatus(EventStatus.valueOf((String) row[7]));
		dto.setTitle((String) row[8]);
		dto.setOrganizerName((String) row[9]);

		int currentParticipants = registrationService.getRegistrationCount((Integer) row[0]);
		dto.setCurrentParticipants(currentParticipants);

		return dto;

	}

	// 靠... 應該不會查無此人吧 都filter了 是要多謹慎
	@Transactional
	@Override
	public void addEvent(UserCert userCert, EventDto eventDto, MultipartFile eventDtoImage)
			throws EventImageIOException { // 判斷該房號 是否已經存在

		User user = userRepository.findById(userCert.getUserId())
				.orElseThrow(() -> new UserNotFoundException("登入帳號不存在，請重新登入")); // 通常不會發生

		if (eventDtoImage == null || eventDtoImage.isEmpty()) {
			throw new EventImageIOException("請上傳圖片");
		}
		// 如果圖片有上傳，轉為 base64 存入 imageUrl 欄位
		try {
			// byte[] bytes = eventDtoImage.getBytes();
			String image = imageService.imageIOtoURL(eventDtoImage);
			eventDto.setImage(image);
		} catch (IOException e) {
			throw new EventImageIOException("圖片格式不正確 ： " + e.getMessage()); // 照理說不太會進來
		}

		// 進入新增程序
		Event event = eventMapper.toEntity(eventDto);
		event.setOrganizerUser(user); // 處理 主控設定
		List<String> tagNames = eventDto.getTags();
		// 非空判斷
		if (tagNames != null && !tagNames.isEmpty()) {
			// 先去重
			Set<String> uniqueNames = new HashSet<>(tagNames);
			// 查出所有在資料庫中 相同的Tag
			List<Tag> existingTags = tagRepository.findAllByTagNameIn(tagNames);
			// 做Map轉換 這是為了考慮時間複雜度 當物件抽出比對時 O(n) 可是以鍵比對 只有常數字串 會快很多 O(1)
			Map<String, Tag> existingTagMap = existingTags.stream()
					// 後面表示 以名為鍵 以自身實體為值 最後其實寫Function.identity() 會更專業 但先這樣
					.collect(Collectors.toMap(Tag::getTagName, tag -> tag));
			// uniqueNames 只是個集合 此處建立不存在的tag List
			List<Tag> newTags = uniqueNames.stream()
					// 篩 新名子 -> 在 MAP中 不包含name的 為true
					.filter(name -> !existingTagMap.containsKey(name)).map(Tag::new).collect(Collectors.toList());
			// 存入Tag表
			List<Tag> savedNewTags = tagRepository.saveAll(newTags);
			// 3. 合併全部 Tag
			// 把「已存在的 Tag」跟「新建並儲存的 Tag」合併成一個完整的 List
			// 記得 都是用實體去存
			List<Tag> allTags = new ArrayList<>();
			// 系統初次建立 沒有存在資料? 沒關係 因為是 [ ] 陣列 不會報錯
			allTags.addAll(existingTags);
			allTags.addAll(savedNewTags);

			event.setTags(allTags);
		}

		eventRepository.save(event);
		eventRepository.flush(); // 手動寫入

	}

	@Override
	public void updateEvent(Integer eventId, EventDto eventDto) {
		// 判斷房見是否已經存在
		Optional<Event> optRoom = eventRepository.findById(eventId);
		if (optRoom.isEmpty()) {
			throw new EventNotFoundException("修改失敗ID: " + eventId + "不存在");
		}
		// 因為roomDto 不見得有 roomId 所以要做一次賦值
		eventDto.setEventId(eventId);
		Event room = eventMapper.toEntity(eventDto);
		// saveAndFlush 更新後馬上存入
		// 用於多資料表同時處理 這個savaAndFlush
		eventRepository.saveAndFlush(room);

	}

	@Override
	public void deleteEvent(Integer eventId) {
		Optional<Event> optRoom = eventRepository.findById(eventId);
		if (optRoom.isEmpty()) {
			throw new EventNotFoundException("SEveD 刪除失敗ID: " + eventId + "不存在");
		}
		// 進入新增程序
		eventRepository.deleteById(eventId);

	}

}
