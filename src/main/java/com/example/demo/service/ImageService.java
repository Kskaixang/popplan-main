package com.example.demo.service;

import java.io.IOException;

import org.springframework.web.multipart.MultipartFile;

import com.example.demo.exception.event.EventImageIOException;

public interface ImageService {
	
	public String imageToBase64(MultipartFile eventDtoImage) throws EventImageIOException;
	
	public String imageIOtoURL(MultipartFile eventDtoImage)throws IOException;

}
