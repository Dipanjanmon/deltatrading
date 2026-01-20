package com.dipanjan.deltatrading.service;

import com.dipanjan.deltatrading.dto.TradeRequest;
import com.dipanjan.deltatrading.entity.Order;
import com.dipanjan.deltatrading.entity.Portfolio;
import com.dipanjan.deltatrading.entity.User;
import com.dipanjan.deltatrading.repository.OrderRepository;
import com.dipanjan.deltatrading.repository.PortfolioRepository;
import com.dipanjan.deltatrading.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class TradeService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final PortfolioRepository portfolioRepository;
    private final MarketDataService marketDataService;

    public TradeService(UserRepository userRepository, OrderRepository orderRepository,
            PortfolioRepository portfolioRepository, MarketDataService marketDataService) {
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.portfolioRepository = portfolioRepository;
        this.marketDataService = marketDataService;
    }

    @Transactional
    public void buy(String username, TradeRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Get live price
        BigDecimal currentPrice = marketDataService.getPrice(request.getSymbol());
        if (currentPrice.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Invalid symbol or market closed for: " + request.getSymbol());
        }

        // Round price to 2 decimal places
        BigDecimal executionPrice = currentPrice.setScale(2, java.math.RoundingMode.HALF_UP);
        BigDecimal cost = executionPrice.multiply(BigDecimal.valueOf(request.getQuantity())).setScale(2,
                java.math.RoundingMode.HALF_UP);

        if (user.getBalance().compareTo(cost) < 0) {
            throw new RuntimeException("Insufficient balance");
        }

        user.setBalance(user.getBalance().subtract(cost));
        userRepository.save(user);

        Portfolio portfolio = portfolioRepository.findByUserAndSymbol(user, request.getSymbol())
                .orElse(new Portfolio(user, request.getSymbol(), 0L, BigDecimal.ZERO));

        BigDecimal totalValue = portfolio.getAveragePrice().multiply(BigDecimal.valueOf(portfolio.getQuantity()))
                .add(cost);
        Long newQuantity = portfolio.getQuantity() + request.getQuantity();

        if (newQuantity > 0) {
            portfolio.setAveragePrice(
                    totalValue.divide(BigDecimal.valueOf(newQuantity), 2, java.math.RoundingMode.HALF_UP));
        }

        portfolio.setQuantity(newQuantity);
        portfolioRepository.save(portfolio);

        Order order = new Order();
        order.setUser(user);
        order.setSymbol(request.getSymbol());
        order.setType("BUY");
        order.setQuantity(request.getQuantity());
        order.setPrice(executionPrice); // Use rounded market price
        order.setTargetPrice(request.getTargetPrice());
        order.setStopLoss(request.getStopLoss());
        orderRepository.save(order);
    }

    @Transactional
    public void sell(String username, TradeRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Get live price
        BigDecimal currentPrice = marketDataService.getPrice(request.getSymbol());
        if (currentPrice.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Invalid symbol or market closed for: " + request.getSymbol());
        }

        // Round price to 2 decimal places
        BigDecimal executionPrice = currentPrice.setScale(2, java.math.RoundingMode.HALF_UP);

        Portfolio portfolio = portfolioRepository.findByUserAndSymbol(user, request.getSymbol())
                .orElse(new Portfolio(user, request.getSymbol(), 0L, BigDecimal.ZERO));

        // Short selling allowed? The user didn't ask to disable it, but logic suggests
        // we might want to ensure they have enough.
        // For now, retaining existing logic (allows going negative effectively if we
        // don't check).
        // Logic shows: if (portfolio.getQuantity().compareTo(request.getQuantity()) <
        // 0) ...

        // Let's implement basics:
        // revenue = price * quantity
        BigDecimal revenue = executionPrice.multiply(BigDecimal.valueOf(request.getQuantity())).setScale(2,
                java.math.RoundingMode.HALF_UP);

        user.setBalance(user.getBalance().add(revenue));
        userRepository.save(user);

        // Update Portfolio (can go negative)
        portfolio.setQuantity(portfolio.getQuantity() - request.getQuantity());
        portfolioRepository.save(portfolio);

        // Calculate Realized P/L for this specific trade
        // P/L = (SellPrice - AvgPrice) * Qty
        BigDecimal avgPrice = portfolio.getAveragePrice();
        BigDecimal realizedPnl = executionPrice.subtract(avgPrice).multiply(BigDecimal.valueOf(request.getQuantity()));

        Order order = new Order();
        order.setUser(user);
        order.setSymbol(request.getSymbol());
        order.setType("SELL");
        order.setQuantity(request.getQuantity());
        order.setPrice(executionPrice);
        order.setTargetPrice(request.getTargetPrice());
        order.setStopLoss(request.getStopLoss());
        order.setRealizedPnl(realizedPnl);
        orderRepository.save(order);
    }

    public List<Portfolio> getPortfolio(String username) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null)
            return List.of();
        return portfolioRepository.findByUser(user);
    }

    public List<Order> getOrderHistory(String username) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null)
            return List.of();
        return orderRepository.findByUserOrderByCreatedAtDesc(user);
    }
}
