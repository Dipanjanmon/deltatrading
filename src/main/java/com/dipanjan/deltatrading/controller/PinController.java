package com.dipanjan.deltatrading.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.dipanjan.deltatrading.service.UserService;
import com.dipanjan.deltatrading.entity.User;

import java.util.Map;

@RestController
@RequestMapping("/api/pin")
@CrossOrigin(origins = "http://localhost:5173")
public class PinController {

    private final UserService userService;

    public PinController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/set")
    public ResponseEntity<?> setPin(@RequestBody Map<String, String> payload) {
        String username = payload.get("username");
        String pin = payload.get("pin");
        userService.setPin(username, pin);
        return ResponseEntity.ok("PIN set successfully");
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPin(@RequestBody Map<String, String> payload) {
        String username = payload.get("username");
        String pin = payload.get("pin");
        boolean isValid = userService.verifyPin(username, pin);
        if (isValid) {
            return ResponseEntity.ok(Map.of("success", true));
        } else {
            return ResponseEntity.status(401).body(Map.of("success", false, "message", "Invalid PIN"));
        }
    }

    @GetMapping("/status/{username}")
    public ResponseEntity<?> checkPinStatus(@PathVariable String username) {
        User user = userService.getUserByUsername(username);
        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }
        boolean hasPin = user.getPin() != null && !user.getPin().isEmpty();
        return ResponseEntity.ok(Map.of("hasPin", hasPin));
    }
}
