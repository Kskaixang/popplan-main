package com.example.demo.model.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.example.demo.model.enums.RegistrationStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegistrationStagingDto {

    private Integer registrationId;

    private LocalDateTime createdAt;

    private LocalDateTime expireAt;

    private RegistrationStatus status;

    private BigDecimal paidAmount;  // 可選

    private Integer eventId;        // 可選
    
    private String title;  //eventtitle
}
