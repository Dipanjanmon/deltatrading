package com.dipanjan.deltatrading.repository;

import com.dipanjan.deltatrading.entity.User;
import com.dipanjan.deltatrading.entity.WeeklySnapshot;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.Optional;

public interface WeeklySnapshotRepository extends JpaRepository<WeeklySnapshot, Long> {
    Optional<WeeklySnapshot> findByUserAndWeekStartDate(User user, LocalDateTime weekStartDate);
}
