package com.example.demo.exception.registration;

public class PendingPaymentExistsException extends RuntimeException {
	public PendingPaymentExistsException(String message) {
		super(message);
	}

}
