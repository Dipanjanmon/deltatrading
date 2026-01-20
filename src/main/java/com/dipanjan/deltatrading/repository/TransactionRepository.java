package com.dipanjan.deltatrading.repository;

import com.dipanjan.deltatrading.entity.Transaction;
import com.dipanjan.deltatrading.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByUserOrderByCreatedAtDesc(User user);
}
