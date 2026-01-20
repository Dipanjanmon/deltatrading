package com.dipanjan.deltatrading.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dipanjan.deltatrading.dto.TradeRequest;

// import java.math.BigDecimal;

@RestController
@RequestMapping("/api/trade")
@org.springframework.web.bind.annotation.CrossOrigin(origins = "http://localhost:5173")
public class TradeController {

    private final com.dipanjan.deltatrading.service.TradeService tradeService;
    private final com.dipanjan.deltatrading.service.MarketDataService marketDataService;

    public TradeController(com.dipanjan.deltatrading.service.TradeService tradeService,
            com.dipanjan.deltatrading.service.MarketDataService marketDataService) {
        this.tradeService = tradeService;
        this.marketDataService = marketDataService;
    }

    @GetMapping("/prices")
    public ResponseEntity<?> getMarketPrices() {
        return ResponseEntity.ok(marketDataService.getAllPrices());
    }

    @GetMapping("/history/{symbol}")
    public ResponseEntity<?> getPriceHistory(
            @org.springframework.web.bind.annotation.PathVariable String symbol,
            @org.springframework.web.bind.annotation.RequestParam(required = false, defaultValue = "1M") String timeframe) {
        return ResponseEntity.ok(marketDataService.getHistory(symbol, timeframe));
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getMarketStats() {
        return ResponseEntity.ok(marketDataService.getMarketTickers());
    }

    @PostMapping("/buy")
    public ResponseEntity<?> buy(@RequestBody TradeRequest request) {
        try {
            String username = extractUsername();
            tradeService.buy(username, request);
            return ResponseEntity.ok("BUY order placed successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/sell")
    public ResponseEntity<?> sell(@RequestBody TradeRequest request) {
        try {
            String username = extractUsername();
            tradeService.sell(username, request);
            return ResponseEntity.ok("SELL order placed successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/portfolio")
    public ResponseEntity<?> getPortfolio() {
        try {
            String username = extractUsername();
            return ResponseEntity.ok(tradeService.getPortfolio(username));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/orders")
    public ResponseEntity<?> getOrders() {
        try {
            String username = extractUsername();
            return ResponseEntity.ok(tradeService.getOrderHistory(username));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    private String extractUsername() {
        var auth = org.springframework.security.core.context.SecurityContextHolder
                .getContext()
                .getAuthentication();

        if (auth == null || auth.getPrincipal() == null) {
            throw new RuntimeException("User not authenticated");
        }

        return auth.getPrincipal().toString();
    }

}
