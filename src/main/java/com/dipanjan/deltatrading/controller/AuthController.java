package com.dipanjan.deltatrading.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dipanjan.deltatrading.dto.LoginRequest;
import com.dipanjan.deltatrading.dto.RegisterRequest;
import com.dipanjan.deltatrading.entity.User;
import com.dipanjan.deltatrading.repository.UserRepository;
import com.dipanjan.deltatrading.security.JwtUtil;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@org.springframework.web.bind.annotation.CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ✅ REGISTER
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            if (userRepository.findByUsername(request.getUsername()).isPresent()) {
                return ResponseEntity.badRequest().body("User already exists");
            }

            User user = new User();
            user.setUsername(request.getUsername());

            // 🔐 HASH PASSWORD
            user.setPassword(passwordEncoder.encode(request.getPassword()));

            // 🔒 SET PIN
            if (request.getPin() != null && !request.getPin().isEmpty()) {
                user.setPin(request.getPin());
            }

            user.setBalance(request.getBalance());

            User savedUser = userRepository.save(user);
            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error during registration: " + e.getMessage());
        }
    }

    // ✅ LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            User user = userRepository.findByUsername(request.getUsername()).orElse(null);

            if (user == null) {
                return ResponseEntity.status(401).body("User not found");
            }

            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                return ResponseEntity.status(401).body("Invalid credentials");
            }

            String token = JwtUtil.generateToken(user.getUsername());

            return ResponseEntity.ok(
                    Map.of(
                            "token", token,
                            "username", user.getUsername()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error during login: " + e.getMessage());
        }
    }

}
