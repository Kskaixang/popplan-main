package com.example.demo.exception.login;

public class UserNotLoggedInException extends RuntimeException {
	public UserNotLoggedInException(String message) {
		super(message);
	}

}
