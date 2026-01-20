package com.dipanjan.deltatrading.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.dipanjan.deltatrading.entity.User;
import com.dipanjan.deltatrading.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }

    public void setPin(String username, String pin) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        user.setPin(pin);
        userRepository.save(user);
    }

    public boolean verifyPin(String username, String pin) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        // In a real app, hash this pin! For now simpler.
        return pin.equals(user.getPin());
    }

    public User updateProfile(String username, com.dipanjan.deltatrading.dto.UserDTO updatedData) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (updatedData.getFullName() != null)
            user.setFullName(updatedData.getFullName());
        if (updatedData.getEmail() != null)
            user.setEmail(updatedData.getEmail());
        if (updatedData.getPhone() != null)
            user.setPhone(updatedData.getPhone());
        if (updatedData.getBio() != null)
            user.setBio(updatedData.getBio());
        if (updatedData.getProfilePictureUrl() != null)
            user.setProfilePictureUrl(updatedData.getProfilePictureUrl());

        return userRepository.save(user);
    }
}
