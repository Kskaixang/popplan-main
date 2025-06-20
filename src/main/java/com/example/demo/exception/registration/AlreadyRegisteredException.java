package com.example.demo.exception.registration;

public class AlreadyRegisteredException extends RuntimeException {
	public AlreadyRegisteredException(String message) {
		super(message);
	}
}
