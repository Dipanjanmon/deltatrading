package com.dipanjan.deltatrading.repository;

import com.dipanjan.deltatrading.entity.Portfolio;
import com.dipanjan.deltatrading.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {
    Optional<Portfolio> findByUserAndSymbol(User user, String symbol);

    List<Portfolio> findByUser(User user);
}
