package com.example.demo.model.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.Data;

@Data
@MappedSuperclass  // 使用 @MappedSuperclass 註解，讓這個類成為父類，JPA 不會為它生成表
public abstract class BaseEntity {

    @CreationTimestamp  // 自動填充創建時間
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp  // 自動填充更新時間
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}

