package com.example.demo.model.dto;
import javax.validation.constraints.*;

import org.hibernate.validator.constraints.Range;

import com.example.demo.model.enums.EventStatus;

import jakarta.persistence.Lob;
import jakarta.persistence.Transient;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class EventDto {
	
    //@NotNull(message = "{eventDto.id.notNull}")
    private Integer eventId;  // 活動主鍵 ID

    // @ManyToOne(fetch = FetchType.LAZY)
    // @JoinColumn(name = "organizer_id", nullable = false)
     private String organizerName;  // 主辦人 (使用者) 外鍵，暫時註解
    


    @NotEmpty(message = "{eventDto.title.notEmpty}")
    @Size(min = 2, max = 100, message = "{eventDto.title.size}")
    private String title;  // 活動標題

    @Lob  //大資料標籤 優化存儲
    //@NotEmpty(message = "{eventDto.imageBase64.notEmpty}") // 如果你希望圖片Base64是必填的
    private String image;  // 圖片 Base64 編碼

    @NotEmpty(message = "{eventDto.description.notEmpty}")
    @Size(min = 5, max = 500, message = "{eventDto.description.size}")
    private String description="123456";  // 活動描述

    @NotEmpty(message = "{eventDto.location.notEmpty}")
    @Size(min = 2, max = 255, message = "{eventDto.location.size}")
    private String location;  // 活動地點（自由輸入）

    @NotNull(message = "{eventDto.startTime.notNull}")
    private LocalDateTime startTime;  // 活動開始時間

    @NotNull(message = "{eventDto.maxParticipants.notNull}")
    @Range(min = 1,max = 150, message = "{eventDto.maxParticipants.range}")
    private Integer maxParticipants;  // 最大參加人數

    @NotNull(message = "{eventDto.price.notNull}")
    @PositiveOrZero(message = "{eventDto.price.min}")
    @Digits(integer = 10, fraction = 2, message = "{eventDto.price.digits}")
    private BigDecimal price;  // 活動價格，使用 BigDecimal 儲存精確小數

    @NotNull(message = "{eventDto.status.notNull}")
    private EventStatus status;  // 活動狀態 enum

    private List<String> tags;  // 活動標籤，JSON 字串儲存，如果是作為 DTO 與前端交互，這裡可以是 List

    @Size(max = 500, message = "{eventDto.tagsString.size}")
    private String tagsString; // 臨時調整測試用，若未來需要擴充為標籤欄位，可以在此進行調整

    
    private Boolean isFavorited = false; // 是否已收藏
    private Integer currentParticipants;  // 當前參加人數
}
