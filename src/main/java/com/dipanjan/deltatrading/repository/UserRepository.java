package com.dipanjan.deltatrading.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dipanjan.deltatrading.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
}
