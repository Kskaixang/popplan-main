package com.example.demo.model.dto;
//PP
import lombok.Data;
import lombok.ToString;

//@Data
//public class UserDTO {
//	private Integer id;
//	private String username;
//	private String email;
//	private Boolean completed;
//}

//屬性名稱可以與對應的Entity不同
@Data
@ToString
public class UserDto {
	private Integer userId;
	private String username;
	private String password;
	private String email;
	private Boolean active; //帳號是否啟用
	private String role; //角色權限

}
