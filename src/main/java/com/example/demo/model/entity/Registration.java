package com.example.demo.model.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.example.demo.model.enums.RegistrationStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = false) // 忽略不參考父屬性的 哈希比對計算
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "registrations")
public class Registration{

	//BaseEntity 提供了創建時間 更新時間
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "registration_id")
	private Integer registrationId;

	// 主控端
	@ManyToOne
	@JoinColumn(name = "user_id")
	private User user;

	@ManyToOne
	@JoinColumn(name = "event_id")
	private Event event;
	// 報名是否已確認（默認為未確認）
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private RegistrationStatus status;

	// 報名時實際支付金額（元，免費活動為 0）
	@Column(name = "paid_amount", nullable = false)
	private BigDecimal paidAmount;
	
    //@CreationTimestamp  // 自動填充創建時間 但如果是假表過來的資料 那以假表為主 要記錄的是創建時間
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();  // 預設是現在;

    @UpdateTimestamp  // 自動填充更新時間
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;


	public Registration(User user, Event event) {
		this.user = user;
		this.event = event;
		this.status = RegistrationStatus.PENDING_PAYMENT;
		this.paidAmount = event.getPrice(); // 用戶報名的瞬間 金額就該固定 萬一突然漲價怎麼辦?
	}

}
