package com.dipanjan.deltatrading.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dipanjan.deltatrading.entity.User;
import com.dipanjan.deltatrading.entity.UserAchievement;

public interface UserAchievementRepository extends JpaRepository<UserAchievement, Long> {
    List<UserAchievement> findByUser(User user);

    boolean existsByUserAndAchievement_Name(User user, String achievementName);
}
