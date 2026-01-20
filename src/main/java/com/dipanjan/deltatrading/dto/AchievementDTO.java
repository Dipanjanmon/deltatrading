package com.dipanjan.deltatrading.dto;

import java.time.LocalDateTime;

public class AchievementDTO {
    private String name;
    private String description;
    private String badgeUrl; // URL or icon name
    private boolean unlocked;
    private LocalDateTime unlockedAt;

    public AchievementDTO(String name, String description, String badgeUrl, boolean unlocked,
            LocalDateTime unlockedAt) {
        this.name = name;
        this.description = description;
        this.badgeUrl = badgeUrl;
        this.unlocked = unlocked;
        this.unlockedAt = unlockedAt;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public String getBadgeUrl() {
        return badgeUrl;
    }

    public boolean isUnlocked() {
        return unlocked;
    }

    public LocalDateTime getUnlockedAt() {
        return unlockedAt;
    }
}
