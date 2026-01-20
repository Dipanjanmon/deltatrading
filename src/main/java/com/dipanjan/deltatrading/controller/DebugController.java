package com.dipanjan.deltatrading.controller;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DebugController {

    private final JdbcTemplate jdbcTemplate;

    public DebugController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/debug/db")
    public String dbName() {
        return jdbcTemplate.queryForObject("SELECT current_database()", String.class);
    }

    @GetMapping("/debug/schema")
    public String schema() {
        return jdbcTemplate.queryForObject("SELECT current_schema()", String.class);
    }

    @GetMapping("/debug/count")
    public Integer count() {
        return jdbcTemplate.queryForObject("SELECT COUNT(*) FROM users", Integer.class);
    }
}
