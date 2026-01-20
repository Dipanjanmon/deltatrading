package com.dipanjan.deltatrading.dto;

import java.math.BigDecimal;

public class MarketTicker {
    private String symbol;
    private String name;
    private BigDecimal price;
    private BigDecimal changePercent;
    private BigDecimal volume; // Simulated

    public MarketTicker(String symbol, String name, BigDecimal price, BigDecimal changePercent) {
        this.symbol = symbol;
        this.name = name;
        this.price = price;
        this.changePercent = changePercent;
        this.volume = BigDecimal.ZERO;
    }

    public String getSymbol() {
        return symbol;
    }

    public String getName() {
        return name;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public BigDecimal getChangePercent() {
        return changePercent;
    }

    public BigDecimal getVolume() {
        return volume;
    }

    public void setVolume(BigDecimal volume) {
        this.volume = volume;
    }
}
