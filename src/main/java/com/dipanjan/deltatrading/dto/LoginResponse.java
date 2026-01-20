package com.dipanjan.deltatrading.dto;

import java.math.BigDecimal;

public class LoginResponse {

    private Long id;
    private String username;
    private BigDecimal balance;

    public LoginResponse(Long id, String username, BigDecimal balance) {
        this.id = id;
        this.username = username;
        this.balance = balance;
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public BigDecimal getBalance() {
        return balance;
    }
}
