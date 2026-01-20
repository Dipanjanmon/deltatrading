package com.dipanjan.deltatrading.controller;

import com.dipanjan.deltatrading.entity.Transaction;
import com.dipanjan.deltatrading.service.WalletService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wallet")
@CrossOrigin(origins = "*")
public class WalletController {

    private final WalletService walletService;

    public WalletController(WalletService walletService) {
        this.walletService = walletService;
    }

    @PostMapping("/deposit")
    public ResponseEntity<?> deposit(@AuthenticationPrincipal String username,
            @RequestBody Map<String, BigDecimal> payload) {
        try {
            walletService.deposit(username, payload.get("amount"));
            return ResponseEntity.ok("Deposit successful");
        } catch (RuntimeException e) {
            if ("User not found".equals(e.getMessage())) {
                return ResponseEntity.status(404).body("User does not exist");
            }
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("An error occurred");
        }
    }

    @PostMapping("/withdraw")
    public ResponseEntity<?> withdraw(@AuthenticationPrincipal String username,
            @RequestBody Map<String, BigDecimal> payload) {
        try {
            walletService.withdraw(username, payload.get("amount"));
            return ResponseEntity.ok("Withdrawal successful");
        } catch (RuntimeException e) {
            if ("User not found".equals(e.getMessage())) {
                return ResponseEntity.status(404).body("User does not exist");
            }
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("An error occurred");
        }
    }

    @GetMapping("/transactions")
    public ResponseEntity<List<Transaction>> getTransactions(@AuthenticationPrincipal String username) {
        return ResponseEntity.ok(walletService.getHistory(username));
    }
}
