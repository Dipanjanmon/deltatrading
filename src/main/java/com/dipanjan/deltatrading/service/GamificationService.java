package com.dipanjan.deltatrading.service;

import com.dipanjan.deltatrading.entity.User;
import com.dipanjan.deltatrading.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class GamificationService {

    @Autowired
    private UserRepository userRepository;

    private static final int BASE_Trade_XP = 10;
    private static final int XP_PER_LEVEL_MULTIPLIER = 1000;

    @Transactional
    public void awardXp(User user, String action, double value) {
        long xpEarned = 0;

        switch (action) {
            case "TRADE":
                // 10 XP base + 1 XP per $100 traded
                xpEarned = BASE_Trade_XP + (long) (value / 100);
                break;
            case "ACHIEVEMENT":
                xpEarned = 500;
                break;
            default:
                break;
        }

        if (xpEarned > 0) {
            user.setXp(user.getXp() + xpEarned);
            checkLevelUp(user);
            userRepository.save(user);
        }
    }

    private void checkLevelUp(User user) {
        // Simple Level Formula: Level = sqrt(XP / 100) or similar, but let's use step
        // Level N requires N * 1000 XP total?
        // Let's stick to a simple threshold: Level = 1 + (XP / 1000)
        int newLevel = 1 + (int) (user.getXp() / XP_PER_LEVEL_MULTIPLIER);
        if (newLevel > user.getLevel()) {
            user.setLevel(newLevel);
            // Could trigger a notification here
        }
    }
}
