package com.dipanjan.deltatrading.dto;

import java.math.BigDecimal;

public class LeaderboardEntry {
    private String username;
    private String profilePictureUrl;
    private BigDecimal netWorth;
    private BigDecimal gainLossPercent; // Simple gain/loss since start ($10k)

    public LeaderboardEntry(String username, String profilePictureUrl, BigDecimal netWorth) {
        this.username = username;
        this.profilePictureUrl = profilePictureUrl;
        this.netWorth = netWorth;

        // Calculate gain from initial 10,000
        BigDecimal initial = new BigDecimal("10000.00");
        this.gainLossPercent = netWorth.subtract(initial)
                .divide(initial, 4, java.math.RoundingMode.HALF_UP)
                .multiply(new BigDecimal("100"));
    }

    public String getUsername() {
        return username;
    }

    public String getProfilePictureUrl() {
        return profilePictureUrl;
    }

    public BigDecimal getNetWorth() {
        return netWorth;
    }

    public BigDecimal getGainLossPercent() {
        return gainLossPercent;
    }
}
