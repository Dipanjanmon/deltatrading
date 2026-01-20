package com.dipanjan.deltatrading.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.dipanjan.deltatrading.dto.LeaderboardEntry;
import com.dipanjan.deltatrading.entity.Portfolio;
import com.dipanjan.deltatrading.entity.User;
import com.dipanjan.deltatrading.repository.PortfolioRepository;
import com.dipanjan.deltatrading.repository.UserRepository;

@Service
public class LeaderboardService {

    private final UserRepository userRepository;
    private final PortfolioRepository portfolioRepository;
    private final MarketDataService marketDataService;
    private final com.dipanjan.deltatrading.repository.WeeklySnapshotRepository weeklySnapshotRepository;

    public LeaderboardService(UserRepository userRepository, PortfolioRepository portfolioRepository,
            MarketDataService marketDataService,
            com.dipanjan.deltatrading.repository.WeeklySnapshotRepository weeklySnapshotRepository) {
        this.userRepository = userRepository;
        this.portfolioRepository = portfolioRepository;
        this.marketDataService = marketDataService;
        this.weeklySnapshotRepository = weeklySnapshotRepository;
    }

    public List<LeaderboardEntry> getGlobalLeaderboard() {
        List<User> allUsers = userRepository.findAll();
        Map<String, BigDecimal> currentPrices = marketDataService.getAllPrices();

        return allUsers.stream()
                .map(user -> {
                    BigDecimal totalStockValue = calculateStockValue(user, currentPrices);
                    BigDecimal netWorth = user.getBalance().add(totalStockValue);
                    return new LeaderboardEntry(user.getUsername(), user.getProfilePictureUrl(), netWorth);
                })
                .sorted((a, b) -> b.getNetWorth().compareTo(a.getNetWorth())) // Descending
                .limit(50) // Top 50
                .collect(Collectors.toList());
    }

    public List<LeaderboardEntry> getWeeklyLeaderboard() {
        List<User> allUsers = userRepository.findAll();
        Map<String, BigDecimal> currentPrices = marketDataService.getAllPrices();

        // Determine start of week (e.g., last Monday at 00:00)
        java.time.LocalDateTime startOfWeek = java.time.LocalDate.now()
                .with(java.time.temporal.TemporalAdjusters.previousOrSame(java.time.DayOfWeek.MONDAY)).atStartOfDay();

        return allUsers.stream()
                .map(user -> {
                    BigDecimal totalStockValue = calculateStockValue(user, currentPrices);
                    BigDecimal currentNetWorth = user.getBalance().add(totalStockValue);

                    // Fetch snapshot
                    BigDecimal startNetWorth = weeklySnapshotRepository.findByUserAndWeekStartDate(user, startOfWeek)
                            .map(com.dipanjan.deltatrading.entity.WeeklySnapshot::getStartNetWorth)
                            .orElse(currentNetWorth); // If no snapshot, 0 gain

                    BigDecimal gain = currentNetWorth.subtract(startNetWorth);

                    // Reusing LeaderboardEntry but using 'gain' as the value to sort by
                    // We might need a new DTO or just reuse netWorth field for 'Score'
                    return new LeaderboardEntry(user.getUsername(), user.getProfilePictureUrl(), gain);
                })
                .sorted((a, b) -> b.getNetWorth().compareTo(a.getNetWorth())) // Descending by Gain
                .limit(50)
                .collect(Collectors.toList());
    }

    // Scheduled task to create snapshots would go here or in a separate scheduler
    // For MVP, snapshots could be created lazily or we assume they exist.
    // Let's add a helper to ensure snapshot exists on 'participation'
    public void ensureSnapshot(User user) {
        java.time.LocalDateTime startOfWeek = java.time.LocalDate.now()
                .with(java.time.temporal.TemporalAdjusters.previousOrSame(java.time.DayOfWeek.MONDAY)).atStartOfDay();
        if (weeklySnapshotRepository.findByUserAndWeekStartDate(user, startOfWeek).isEmpty()) {
            Map<String, BigDecimal> currentPrices = marketDataService.getAllPrices();
            BigDecimal totalStockValue = calculateStockValue(user, currentPrices);
            BigDecimal netWorth = user.getBalance().add(totalStockValue);

            com.dipanjan.deltatrading.entity.WeeklySnapshot snapshot = new com.dipanjan.deltatrading.entity.WeeklySnapshot(
                    user, startOfWeek, netWorth);
            weeklySnapshotRepository.save(snapshot);
        }
    }

    private BigDecimal calculateStockValue(User user, Map<String, BigDecimal> prices) {
        List<Portfolio> portfolio = portfolioRepository.findByUser(user);
        return portfolio.stream()
                .map(p -> {
                    BigDecimal price = prices.getOrDefault(p.getSymbol(), BigDecimal.ZERO);
                    return price.multiply(BigDecimal.valueOf(p.getQuantity()));
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
