package com.dipanjan.deltatrading.repository;

import com.dipanjan.deltatrading.entity.Notification;
import com.dipanjan.deltatrading.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserOrderByCreatedAtDesc(User user);

    List<Notification> findByUserAndIsReadFalseOrderByCreatedAtDesc(User user);
}
