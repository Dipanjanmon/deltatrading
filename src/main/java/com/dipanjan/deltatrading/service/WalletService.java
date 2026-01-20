package com.dipanjan.deltatrading.service;

import com.dipanjan.deltatrading.entity.Transaction;
import com.dipanjan.deltatrading.entity.User;
import com.dipanjan.deltatrading.repository.TransactionRepository;
import com.dipanjan.deltatrading.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class WalletService {

    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;

    public WalletService(UserRepository userRepository, TransactionRepository transactionRepository) {
        this.userRepository = userRepository;
        this.transactionRepository = transactionRepository;
    }

    @Transactional
    public void deposit(String username, BigDecimal amount) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Amount must be positive");
        }

        if (amount.compareTo(new BigDecimal("1000000")) > 0) {
            throw new RuntimeException("Deposit limit exceeded. Max: 1,000,000");
        }

        user.setBalance(user.getBalance().add(amount));
        userRepository.save(user);

        Transaction tx = new Transaction(user, "DEPOSIT", amount);
        transactionRepository.save(tx);
    }

    @Transactional
    public void withdraw(String username, BigDecimal amount) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Amount must be positive");
        }

        if (user.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient funds");
        }

        user.setBalance(user.getBalance().subtract(amount));
        userRepository.save(user);

        Transaction tx = new Transaction(user, "WITHDRAW", amount);
        transactionRepository.save(tx);
    }

    public List<Transaction> getHistory(String username) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null)
            return List.of();
        return transactionRepository.findByUserOrderByCreatedAtDesc(user);
    }
}
