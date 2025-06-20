package com.example.demo.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.exception.login.*;
import com.example.demo.model.dto.UserCert;
import com.example.demo.model.entity.User;
import com.example.demo.repository.FavoriteRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.CertService;
import com.example.demo.service.FavoriteService;
import com.example.demo.service.UserService;
import com.example.demo.util.Hash;
//沒使用 但未來要參考
@Service
public class CertServiceImpl implements CertService{
	
	@Autowired
	private UserRepository UserRepository;
	@Autowired
	private FavoriteRepository favoriteRepository;

	@Override
	public UserCert getCert(String email, String password) throws UserNotFoundException,PasswordInvalidException {
		User user =UserRepository.getUser(email);
		if(user == null) {
			throw new UserNotFoundException("查無此人");			
		}
		//你輸入的密碼 和當時的鹽巴比對
		String passwordHash = Hash.getHash(password , user.getSalt());
		if(!passwordHash.equals(user.getPasswordHash())){
			throw new PasswordInvalidException("密碼錯誤");
		}
		//3.簽發憑證 並且帶上當時的收藏數		
		//System.out.println("有沒有得到數字呢?" + favoriteRepository.countByUser_UserId(user.getUserId()));
		UserCert userCert = new UserCert(user.getUserId(),user.getUsername(),user.getRole(), 0,0);
		//這邊完全沒被使用到
		//這邊完全沒被使用到
		//這邊完全沒被使用到
		return userCert;
	}
}
