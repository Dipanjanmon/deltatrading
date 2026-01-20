package com.dipanjan.deltatrading.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "achievements")
public class Achievement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private String badgeUrl; // URL or icon name for the badge

    @Column(nullable = false)
    private String criteriaType; // e.g., "FIRST_TRADE", "VOLUME_TRADED"

    @Column(nullable = false)
    private Long criteriaValue; // The threshold value (e.g., 1000 for $1000 volume)

    public Achievement() {
    }

    public Achievement(String name, String description, String badgeUrl, String criteriaType, Long criteriaValue) {
        this.name = name;
        this.description = description;
        this.badgeUrl = badgeUrl;
        this.criteriaType = criteriaType;
        this.criteriaValue = criteriaValue;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getBadgeUrl() {
        return badgeUrl;
    }

    public void setBadgeUrl(String badgeUrl) {
        this.badgeUrl = badgeUrl;
    }

    public String getCriteriaType() {
        return criteriaType;
    }

    public void setCriteriaType(String criteriaType) {
        this.criteriaType = criteriaType;
    }

    public Long getCriteriaValue() {
        return criteriaValue;
    }

    public void setCriteriaValue(Long criteriaValue) {
        this.criteriaValue = criteriaValue;
    }
}
