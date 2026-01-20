package com.dipanjan.deltatrading.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "portfolios", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "user_id", "symbol" })
})
public class Portfolio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String symbol;

    @Column(nullable = false)
    private Long quantity;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal averagePrice;

    public Portfolio() {
    }

    public Portfolio(User user, String symbol, Long quantity, BigDecimal averagePrice) {
        this.user = user;
        this.symbol = symbol;
        this.quantity = quantity;
        this.averagePrice = averagePrice;
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public Long getQuantity() {
        return quantity;
    }

    public void setQuantity(Long quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getAveragePrice() {
        return averagePrice;
    }

    public void setAveragePrice(BigDecimal averagePrice) {
        this.averagePrice = averagePrice;
    }
}
