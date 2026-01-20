package com.dipanjan.deltatrading.dto;

import java.math.BigDecimal;

public class UserDTO {

    private Long id;
    private String username;
    private BigDecimal balance;
    private String fullName;
    private String email;
    private String phone;
    private String bio;
    private String profilePictureUrl;

    public UserDTO() {
    }

    public UserDTO(Long id, String username, BigDecimal balance, String fullName, String email, String phone,
            String bio, String profilePictureUrl) {
        this.id = id;
        this.username = username;
        this.balance = balance;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.bio = bio;
        this.profilePictureUrl = profilePictureUrl;
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

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getProfilePictureUrl() {
        return profilePictureUrl;
    }

    public void setProfilePictureUrl(String profilePictureUrl) {
        this.profilePictureUrl = profilePictureUrl;
    }
}
