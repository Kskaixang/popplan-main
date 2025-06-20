package com.example.demo.exception.paymentFail;

public class PaymentFailedException extends IllegalArgumentException {
	public PaymentFailedException(String message) {
		super(message);
	}

}
