package com.dipanjan.deltatrading.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dipanjan.deltatrading.dto.LeaderboardEntry;
import com.dipanjan.deltatrading.service.LeaderboardService;

@RestController
@RequestMapping("/api/leaderboard")
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    public LeaderboardController(LeaderboardService leaderboardService) {
        this.leaderboardService = leaderboardService;
    }

    @GetMapping
    public List<LeaderboardEntry> getLeaderboard() {
        return leaderboardService.getGlobalLeaderboard();
    }

    @GetMapping("/weekly")
    public List<LeaderboardEntry> getWeeklyLeaderboard() {
        return leaderboardService.getWeeklyLeaderboard();
    }
}
