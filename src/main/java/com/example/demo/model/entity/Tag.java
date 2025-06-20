package com.example.demo.model.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = false) // 忽略不參考父屬性的 哈希比對計算
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "tags")
public class Tag extends BaseEntity{

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "tag_id") // 預設的資料表中的 如果一致 其實可以不加
	private Integer tagId; // 使用者Id
	
	@Column(name = "tag_name", unique = true, nullable = false, length = 50)
	private String tagName;
	
	@ManyToMany(mappedBy = "tags")
	private List<Event> events = new ArrayList<>();
	
	
	//這是要給service 快速篩名子用的
	//事實上 id是自鍵  events是關聯  所以這邊單值建構也沒有邏輯漏洞
	 public Tag(String tagName) {
	        this.tagName = tagName;
	    }
	
	
}
