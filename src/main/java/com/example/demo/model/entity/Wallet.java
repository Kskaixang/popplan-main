package com.example.demo.model.entity;

import java.math.BigDecimal;
import java.util.List;

import com.example.demo.exception.paymentFail.PaymentFailedException;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = false) // 忽略不參考父屬性的 哈希比對計算
public class Wallet  extends BaseEntity{
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "wallet_id")
	private Integer walletId;
	
	@OneToOne(mappedBy = "wallet")
	private User user;
	
	private BigDecimal balance;
	
	public Wallet(BigDecimal balance) {
		this.balance = balance;
	}

	//金額增減方法
	public void add(BigDecimal amount) {
	
		this.balance = this.balance.add(amount);
	}
	//我認為要吐回實際扣款的金額 因為才符合思想 創辦人該拿的是 用戶扣款的金額 而不是活動定的價格 
	public BigDecimal deduct(BigDecimal amount) {
		//當報名是「免費活動」，那就根本不會呼叫 deduct() 這個方法 這是以防負數
		if(amount.compareTo(BigDecimal.ZERO) <= 0){
	        throw new PaymentFailedException("扣款金額不可小於或等於 0 元");
	    }
		//是否餘額足夠
		//BigDecimal 是一個物件（類別） 不能用 ==、>、<
		if(this.balance.compareTo(amount) < 0) {
			throw new PaymentFailedException(
					String.format("用戶餘額 %s 元不足，無法支付 %s 元", balance, amount)
					);
		}
		this.balance = this.balance.subtract(amount);
		return amount;
	}
}
