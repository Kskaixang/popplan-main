package com.example.demo.model.entity;
//src/main/java/com/example/demo/model/Event.java

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.example.demo.model.enums.EventStatus;

@Data
@ToString(exclude = {"tags", "organizerUser", "registrations", "favorites"})
@EqualsAndHashCode(callSuper = false) // 忽略不參考父屬性的 哈希比對計算
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "events")
public class Event extends BaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "event_id")
	private Integer eventId; // 活動主鍵 ID

	@Column(nullable = false, length = 100)
	private String title; // 活動標題

	@Lob // 大資料標籤 優化存儲
	@Column(name = "image", columnDefinition = "MEDIUMTEXT")
	private String image;

	@Column(columnDefinition = "TEXT")
	private String description; // 活動描述

	@Column(length = 255)
	private String location; // 活動地點（自由輸入）

	@Column(name = "start_time", nullable = false)
	private LocalDateTime startTime; // 活動開始時間

	@Column(name = "max_participants")
	private Integer maxParticipants; // 最大參加人數

	@Column(precision = 10, scale = 2)
	private BigDecimal price; // 活動價格，使用 BigDecimal 儲存精確小數

	@Enumerated(EnumType.STRING)
	@Column(length = 20)
	private EventStatus status; // 活動狀態 enum

	// @Column(columnDefinition = "TEXT")
	// private String tags; // 活動標籤，JSON 字串儲存

	// @Transient
	// private List<String> tags; 監修中監修中監修中監修中監修中監修中監修中監修中監修中監修中監修中

//	@Column(columnDefinition = "TEXT")
//	private String tagsString; // 臨時調整測試用

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "organizer_id", nullable = false)
	private User organizerUser; // 主控

	// 新增 一對多 給報名關聯表 要準備銜接給 Event 被控
	@OneToMany(mappedBy = "event")
	private List<Registration> registrations = new ArrayList<>();

	@OneToMany(mappedBy = "event")
	private List<Favorite> favorites = new ArrayList<>();

	@ManyToMany
	@JoinTable(name = "event_tag", // 關聯表的表名
			joinColumns = @JoinColumn(name = "event_id"), // 自己的 ID
			inverseJoinColumns = @JoinColumn(name = "tag_id") // 對方的 ID
	)
	private List<Tag> tags = new ArrayList<>();

}
