package com.example.demo.model.entity;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
//PP
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;


@Data
@EqualsAndHashCode(callSuper = false) // 忽略不參考父屬性的 哈希比對計算
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "users") // 可手動建立資料表明 通常加上s 可以避免建表語句有問題
public class User extends BaseEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "user_id") // 預設的資料表中的 如果一致 其實可以不加
	private Integer userId; // 使用者Id

	@Column(name = "username", unique = true, nullable = false, length = 50) // 像這邊 user_name 不一致
	private String username;

	@Column(name = "password_hash", nullable = false)
	private String passwordHash;

	@Column(name = "salt", nullable = false)
	private String salt;

	@Column(name = "email", nullable = false)
	private String email;

	@Column(name = "active")
	private Boolean active;

	@Column(name = "role")
	private String role;

	// 對多環境 默認LAZY 要查自己寫SQL

	// 新增 一對多 給報名關聯表 要準備銜接給 Event
	@OneToMany(mappedBy = "user")
	private List<Registration> registrations;

	// 該使用者自己創的活動
	@OneToMany(mappedBy = "organizerUser")
	private List<Event> organizedEvents;

	@OneToMany(mappedBy = "user")
	private List<Favorite> favorites;

	// 當你操作主控端（User）時，要對關聯的 Wallet 也做同樣的操作（級聯）。
	// 和以前不同 我們是抽取必要欄位 成唯一張表 以前Book專案中 作者不一定要有自傳
	// 建立使用者時同時建立錢包 就會需要CascadeType.ALL 讓兩者同時建立
	@OneToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "wallet_id")
	private Wallet wallet;

	@OneToMany(mappedBy = "user")
	private List<Notification> notifications;
	
	// 自定義建構子
	public User(String username, String passwordHash, String salt, String email) {
		this.username = username;
		this.passwordHash = passwordHash;
		this.salt = salt;
		this.email = email;

		// 初始化（+預設空集合）
		this.role = "user";
		this.active = false;
		this.registrations = new ArrayList<>();
		this.organizedEvents = new ArrayList<>();
		this.favorites = new ArrayList<>();
		// 大家都是1000元
		this.wallet = new Wallet(new BigDecimal("1000"));
		this.notifications = new ArrayList<>();
	}
}