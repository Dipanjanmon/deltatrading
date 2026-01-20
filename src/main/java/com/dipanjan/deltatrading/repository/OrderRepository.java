package com.dipanjan.deltatrading.repository;

import com.dipanjan.deltatrading.entity.Order;
import com.dipanjan.deltatrading.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserOrderByCreatedAtDesc(User user);

    List<Order> findByStatusAndType(String status, String type);
}
