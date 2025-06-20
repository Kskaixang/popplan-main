package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletComponentScan;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@ServletComponentScan //啟用WebFilter 掃描 因為SpringBoot 預設會忽略JAVAweb基本的 使用了自己的Filter 所以要取代 取用
@EnableScheduling  //啟用定時排程任務
public class PopPlanApplication {

	public static void main(String[] args) {
		SpringApplication.run(PopPlanApplication.class, args);
	}

} 
