package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.entity.Wallet;

@Repository
public interface WalletRepository extends JpaRepository<Wallet, Integer>{
	

}
