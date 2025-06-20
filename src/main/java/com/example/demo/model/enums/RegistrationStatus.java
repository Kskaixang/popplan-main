package com.example.demo.model.enums;

public enum RegistrationStatus {
    PENDING_PAYMENT,  // 剛報名，尚未付款
    COMPLETED,        // 付款完成
    TIMEOUT,          // 超過付款期限未完成，逾時
    CANCELLED         // 用戶取消
}
