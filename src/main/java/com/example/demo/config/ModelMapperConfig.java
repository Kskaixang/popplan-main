package com.example.demo.config;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration //在SpringBoot啟動完成前 會先執行此配置
public class ModelMapperConfig {

	//SpringBoot 會自動建立子物件 並管理
	//其他程式可以透過 @Autowired 來取得實體物件
	@Bean
	ModelMapper modelMapper() {
		return new ModelMapper();
	}
}
