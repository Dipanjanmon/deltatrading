package com.dipanjan.deltatrading.component;

import com.dipanjan.deltatrading.entity.Achievement;
import com.dipanjan.deltatrading.repository.AchievementRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final AchievementRepository achievementRepository;

    public DataSeeder(AchievementRepository achievementRepository) {
        this.achievementRepository = achievementRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (achievementRepository.count() == 0) {
            achievementRepository.save(new Achievement(
                    "First Trade",
                    "Complete your first trade",
                    "🚀",
                    "TRADE_COUNT",
                    1L));
            achievementRepository.save(new Achievement(
                    "Big Spender",
                    "Trade over $10,000 in volume",
                    "💰",
                    "VOLUME",
                    10000L));
            achievementRepository.save(new Achievement(
                    "Market Mover",
                    "Complete 50 trades",
                    "🐋",
                    "TRADE_COUNT",
                    50L));
        }
    }
}
