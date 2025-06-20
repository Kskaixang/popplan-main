package com.example.demo.service.impl;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.exception.event.EventImageIOException;
import com.example.demo.service.ImageService;

@Service
public class ImageServiceImpl implements ImageService {

	//private static final String UPLOAD_DIR = "src/data/images/";
	private static final String UPLOAD_DIR = "popplanReact/public/images/";

	@Override
	public String imageToBase64(MultipartFile eventDtoImage) throws EventImageIOException {
		try {
			byte[] bytes = eventDtoImage.getBytes();
			return Base64.getEncoder().encodeToString(bytes);

		} catch (IOException e) {
			throw new EventImageIOException("圖片格式不正確 ： " + e.getMessage()); // 照理說不太會進來
		}
	}

	@Override
	public String imageIOtoURL(MultipartFile eventDtoImage) throws IOException {
		if (eventDtoImage.isEmpty()) {
			throw new IllegalArgumentException("Uploaded file is empty");
		}

		// 確保資料夾存在
		File uploadDir = new File(UPLOAD_DIR);
		if (!uploadDir.exists()) {
			uploadDir.mkdirs();
		}

		String originalFilename = eventDtoImage.getOriginalFilename();
		String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
		String newFilename = "pp3-" + System.currentTimeMillis() + fileExtension;

		Path filePath = Paths.get(UPLOAD_DIR, newFilename);
		Files.write(filePath, eventDtoImage.getBytes());

		// 回傳給前端（或存入資料庫）使用的 URL 路徑
		return "/images/" + newFilename;
	}

}
