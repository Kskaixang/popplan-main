package com.example.demo.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.ToString;

//使用者憑證 代表登入成功之後 會得到的憑證資料 裡面只有get方法
@Data
@Getter
@AllArgsConstructor
@ToString
public class UserCert {
	private Integer userId;
	private String username;
	private String role;
	private int favoriteCount;
	private int notificationCount;
	
	//擴充 LoginFilter
	//private Date loginDate;
	
}
