package com.dipanjan.deltatrading.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dipanjan.deltatrading.dto.AchievementDTO;
import com.dipanjan.deltatrading.entity.Achievement;
import com.dipanjan.deltatrading.entity.User;
import com.dipanjan.deltatrading.entity.UserAchievement;
import com.dipanjan.deltatrading.repository.AchievementRepository;
import com.dipanjan.deltatrading.repository.UserAchievementRepository;
import com.dipanjan.deltatrading.repository.UserRepository;

@RestController
@RequestMapping("/api/achievements")
public class AchievementController {

    private final AchievementRepository achievementRepository;
    private final UserAchievementRepository userAchievementRepository;
    private final UserRepository userRepository;

    public AchievementController(AchievementRepository achievementRepository,
            UserAchievementRepository userAchievementRepository, UserRepository userRepository) {
        this.achievementRepository = achievementRepository;
        this.userAchievementRepository = userAchievementRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<AchievementDTO> getMyAchievements(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            throw new RuntimeException("User not authenticated");
        }
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found: " + userDetails.getUsername()));

        List<Achievement> allAchievements = achievementRepository.findAll();
        List<UserAchievement> unlocked = userAchievementRepository.findByUser(user);

        // Map of achievement ID to UserAchievement (for quick lookup of unlocked
        // status)
        Map<Long, UserAchievement> unlockedMap = unlocked.stream()
                .collect(Collectors.toMap(ua -> ua.getAchievement().getId(), ua -> ua));

        return allAchievements.stream().map(ach -> {
            UserAchievement ua = unlockedMap.get(ach.getId());
            boolean isUnlocked = ua != null;
            java.time.LocalDateTime unlockedAt = isUnlocked ? ua.getUnlockedAt() : null;
            return new AchievementDTO(ach.getName(), ach.getDescription(), ach.getBadgeUrl(), isUnlocked, unlockedAt);
        }).collect(Collectors.toList());
    }
}
