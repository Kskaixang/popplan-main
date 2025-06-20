package com.example.demo.model.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum EventStatus {
	 DRAFT("草稿"),
	    PUBLISHED("參加"),
	    COMPLETED("結束"),
	    CANCELED("取消");

	    private final String label;

	    EventStatus(String label) {
	        this.label = label;
	    }
	    //Jackson 在反序列化時只會找「中文值」去對應 enum，所以前端 必須傳中文
	    @JsonValue  // 加這行可以讓JSON模式下 直接吐出中文
	    public String getLabel() {
	        return label;
	    }
}