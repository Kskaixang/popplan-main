package com.example.demo.exception.notification;

public class NotificationNotFoundException extends RuntimeException {
	public NotificationNotFoundException (String message){
		super(message);
	}
}
