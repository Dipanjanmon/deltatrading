package com.dipanjan.deltatrading.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {
    @GetMapping("/")
    public String health() {
        return "Delta Trading! Backend is RUNNING 🚀";
    }
}
