package com.dipanjan.deltatrading.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.dipanjan.deltatrading.entity.Achievement;

import java.util.Optional;

public interface AchievementRepository extends JpaRepository<Achievement, Long> {
    Optional<Achievement> findByName(String name);
}
