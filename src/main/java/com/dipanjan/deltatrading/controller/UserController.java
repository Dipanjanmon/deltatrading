package com.dipanjan.deltatrading.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dipanjan.deltatrading.dto.UserDTO;
import com.dipanjan.deltatrading.repository.UserRepository;

@RestController
@RequestMapping("/api/users")
@org.springframework.web.bind.annotation.CrossOrigin(origins = "http://localhost:5173")
public class UserController {

        private final UserRepository userRepository;
        private final com.dipanjan.deltatrading.service.UserService userService;
        private final com.dipanjan.deltatrading.service.FileStorageService fileStorageService;

        public UserController(UserRepository userRepository,
                        com.dipanjan.deltatrading.service.UserService userService,
                        com.dipanjan.deltatrading.service.FileStorageService fileStorageService) {
                this.userRepository = userRepository;
                this.userService = userService;
                this.fileStorageService = fileStorageService;
        }

        @GetMapping
        public List<UserDTO> getAllUsers() {
                return userRepository.findAll()
                                .stream()
                                .map(this::convertToDTO)
                                .toList();
        }

        @GetMapping("/{username}")
        public org.springframework.http.ResponseEntity<UserDTO> getUserByUsername(
                        @org.springframework.web.bind.annotation.PathVariable String username) {
                return userRepository.findByUsername(username)
                                .map(user -> org.springframework.http.ResponseEntity.ok(convertToDTO(user)))
                                .orElse(org.springframework.http.ResponseEntity.notFound().build());
        }

        @org.springframework.web.bind.annotation.PostMapping("/{username}/photo")
        public org.springframework.http.ResponseEntity<?> uploadPhoto(
                        @org.springframework.web.bind.annotation.PathVariable String username,
                        @org.springframework.web.bind.annotation.RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
                String fileUrl = fileStorageService.store(file);

                com.dipanjan.deltatrading.dto.UserDTO userDTO = new com.dipanjan.deltatrading.dto.UserDTO();
                userDTO.setProfilePictureUrl("http://localhost:8081" + fileUrl);

                com.dipanjan.deltatrading.entity.User updatedUser = userService.updateProfile(username,
                                userDTO);
                return org.springframework.http.ResponseEntity.ok(convertToDTO(updatedUser));
        }

        @org.springframework.web.bind.annotation.PutMapping("/{username}")
        public org.springframework.http.ResponseEntity<UserDTO> updateProfile(
                        @org.springframework.web.bind.annotation.PathVariable String username,
                        @org.springframework.web.bind.annotation.RequestBody UserDTO userDTO) {
                try {
                        com.dipanjan.deltatrading.entity.User updatedUser = userService.updateProfile(username,
                                        userDTO);
                        return org.springframework.http.ResponseEntity.ok(convertToDTO(updatedUser));
                } catch (RuntimeException e) {
                        return org.springframework.http.ResponseEntity.notFound().build();
                }
        }

        private UserDTO convertToDTO(com.dipanjan.deltatrading.entity.User user) {
                return new UserDTO(
                                user.getId(),
                                user.getUsername(),
                                user.getBalance(),
                                user.getFullName(),
                                user.getEmail(),
                                user.getPhone(),
                                user.getBio(),
                                user.getProfilePictureUrl());
        }
}
