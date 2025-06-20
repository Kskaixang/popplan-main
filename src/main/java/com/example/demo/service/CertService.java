package com.example.demo.service;

import com.example.demo.exception.login.*;
import com.example.demo.model.dto.UserCert;

public interface CertService {
	
	//impl實現方式是 拋出UserNotFoundException,PasswordInvalidException  因為我們CertException透過繼承關係 所以可以寫子類
	UserCert getCert(String username, String password) throws CertException;
}
