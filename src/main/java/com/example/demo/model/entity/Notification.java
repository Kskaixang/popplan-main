package com.example.demo.model.entity;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

//通知
@Data
@EqualsAndHashCode(callSuper = false) // 忽略不參考父屬性的 哈希比對計算
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "notifications") // 可手動建立資料表明 通常加上s 可以避免建表語句有問題
public class Notification extends BaseEntity{

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "notification_id")
	private Integer notificationId;

	// 主控端
	@ManyToOne
	@JoinColumn(name = "user_id")
	private User user;
	
	@Column(name = "is_read")
	private Boolean isRead;
	
	@Column(name = "message")
	private String message;	
	
	@Column(name = "url")
	private String url;
	
	public Notification(User user ,String message,String url) {
		this.user = user;
		this.isRead = false;  //未讀
		this.message = message;
		this.url = url;
	}
	
	public Notification(User user ,String message) {		
		this(user,message,null);  //前端通知不一定需要 {url && <a href={url}>點我</a>} 這樣還可以
	}
	

}
