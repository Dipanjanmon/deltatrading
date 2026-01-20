package com.dipanjan.deltatrading.service;

import com.dipanjan.deltatrading.config.FinnhubConfig;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import jakarta.annotation.PostConstruct;

import java.math.BigDecimal;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class MarketDataService {

    private final Map<String, BigDecimal> marketPrices = new ConcurrentHashMap<>();
    private final Map<String, List<PricePoint>> marketHistory = new ConcurrentHashMap<>();
    private final Map<String, BigDecimal> dayOpenPrices = new ConcurrentHashMap<>();
    private final Map<String, String> symbolNames = new ConcurrentHashMap<>();
    private final Map<String, String> displayToInternalMap = new ConcurrentHashMap<>();

    // To manage round-robin updates
    private final List<String> symbolList = new CopyOnWriteArrayList<>();
    private int currentUpdateIndex = 0;

    private final FinnhubConfig finnhubConfig;
    private final RestTemplate restTemplate;

    public MarketDataService(FinnhubConfig finnhubConfig, RestTemplate restTemplate) {
        this.finnhubConfig = finnhubConfig;
        this.restTemplate = restTemplate;
    }

    // Initial setup
    @PostConstruct
    public void init() {
        // Indices
        addTicker("SPX", "S&P 500 Index"); // Note: Finnhub might use tickers like ^GSPC for indices, but let's try SPX
                                           // first or use ETFs like SPY if needed.
        addTicker("QQQ", "Nasdaq 100 ETF"); // Using ETF for easier data access
        addTicker("DIA", "Dow Jones ETF");

        // Tech
        addTicker("AAPL", "Apple Inc.");
        addTicker("GOOGL", "Alphabet Inc.");
        addTicker("MSFT", "Microsoft Corporation");
        addTicker("AMZN", "Amazon.com Inc.");
        addTicker("TSLA", "Tesla Inc.");
        addTicker("NVDA", "NVIDIA Corporation");
        addTicker("META", "Meta Platforms Inc.");
        addTicker("NFLX", "Netflix Inc.");

        // Crypto (Binance tickers usually work on Finnhub: BINANCE:BTCUSDT)
        // For simplicity in free tier standard stocks, we'll use Coinbase or just
        // standard symbols if supported.
        // Finnhub supports crypto symbols like 'BINANCE:BTCUSDT'.
        addTicker("BINANCE:BTCUSDT", "Bitcoin");
        addTicker("BINANCE:ETHUSDT", "Ethereum");
        addTicker("BINANCE:SOLUSDT", "Solana");

        // Others
        addTicker("JPM", "JPMorgan Chase & Co.");
        addTicker("DIS", "The Walt Disney Company");

        marketPrices.keySet()
                .forEach(symbol -> marketHistory.put(symbol, Collections.synchronizedList(new ArrayList<>())));

        // Initial fetch for all (might hit rate limit if we do all at once, so we'll
        // let the scheduler pick them up)
    }

    private void addTicker(String symbol, String name) {
        // Initialize with dummy data so UI doesn't crash before first fetch
        marketPrices.put(symbol, BigDecimal.ZERO);
        dayOpenPrices.put(symbol, BigDecimal.ZERO);
        symbolNames.put(symbol, name);
        symbolList.add(symbol);

        // Derive display symbol (matching logic in getMarketTickers)
        String displaySymbol = symbol;
        if (symbol.startsWith("BINANCE:")) {
            displaySymbol = symbol.replace("BINANCE:", "").replace("USDT", "");
        }
        displayToInternalMap.put(displaySymbol, symbol);
    }

    private final Random random = new Random();

    // Rate Limit Friendly Scheduler: Update 3 symbols every 3 seconds (approx 60
    // calls/min is limit)
    // We have ~16 symbols.
    // If we update 2 symbols every 2 seconds -> 60 requests/min.
    // Let's do: Update 1 symbol every 1 second? That's 60 req/min exactly. A bit
    // risky.
    // Let's do: Update batch of 4 symbols every 5 seconds.
    // 60 seconds / 5 seconds = 12 batches.
    // 12 batches * 4 symbols = 48 requests/min. Safe.
    @Scheduled(fixedRate = 5000)
    public void updatePrices() {
        int batchSize = 4;
        if (symbolList.isEmpty())
            return;

        for (int i = 0; i < batchSize; i++) {
            String symbol = symbolList.get(currentUpdateIndex);
            fetchPriceFromApi(symbol);

            currentUpdateIndex = (currentUpdateIndex + 1) % symbolList.size();
        }
    }

    // HYBRID SIMULATION: Update ALL symbols every 1 second with micro-movements to
    // create a "Live" feel.
    // This runs between the actual API fetches (which correct the price to the
    // truth).
    @Scheduled(fixedRate = 1000)
    public void simulateTickers() {
        if (symbolList.isEmpty())
            return;

        marketPrices.forEach((symbol, currentPrice) -> {
            if (currentPrice.compareTo(BigDecimal.ZERO) == 0)
                return;

            // Generate noise: Random drift between -0.05% and +0.05%
            // This is subtle enough to look real, but small enough not to drift too far
            // before the next API syncing.
            double noise = (random.nextDouble() - 0.5) * 0.001;

            BigDecimal change = currentPrice.multiply(new BigDecimal(noise));
            BigDecimal newPrice = currentPrice.add(change);

            // Ensure price doesn't go negative
            if (newPrice.compareTo(BigDecimal.ZERO) < 0)
                newPrice = new BigDecimal("0.01");

            updatePriceAndHistory(symbol, newPrice);
        });
    }

    private void updatePriceAndHistory(String symbol, BigDecimal price) {
        marketPrices.put(symbol, price);

        List<PricePoint> history = marketHistory.get(symbol);
        if (history != null) {
            synchronized (history) {
                if (history.size() >= 100) {
                    history.remove(0);
                }
                history.add(new PricePoint(System.currentTimeMillis(), price));
            }
        }
    }

    private void fetchPriceFromApi(String symbol) {
        try {
            // Finnhub Quote Endpoint: https://finnhub.io/api/v1/quote?symbol=AAPL&token=...
            String url = String.format("%s/quote?symbol=%s&token=%s",
                    finnhubConfig.getBaseUrl(), symbol, finnhubConfig.getApiKey());

            // Response: {"c": 175.50, "d": ..., "dp": ...} (c = current price, o = open
            // price)
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);

            if (response != null && response.containsKey("c")) {
                Object cObj = response.get("c");
                Object oObj = response.get("o"); // Open price of the day

                BigDecimal currentPrice = new BigDecimal(cObj.toString());
                BigDecimal openPrice = new BigDecimal(oObj.toString());

                // Update maps
                dayOpenPrices.put(symbol, openPrice);

                // Use helper to update price and history
                updatePriceAndHistory(symbol, currentPrice);

                System.out.println("Updated " + symbol + ": $" + currentPrice); // Debug log
            }
        } catch (Exception e) {
            System.err.println("Error fetching data for " + symbol + ": " + e.getMessage());
        }
    }

    public Map<String, BigDecimal> getAllPrices() {
        return marketPrices;
    }

    public BigDecimal getPrice(String symbol) {
        return marketPrices.getOrDefault(symbol.toUpperCase(), BigDecimal.ZERO);
    }

    public List<PricePoint> getHistory(String symbol) {
        // Resolve display symbol (e.g., BTC) to internal symbol (e.g., BINANCE:BTCUSDT)
        String internalSymbol = displayToInternalMap.getOrDefault(symbol, symbol.toUpperCase());
        return marketHistory.getOrDefault(internalSymbol, Collections.emptyList());
    }

    public List<PricePoint> getHistory(String symbol, String timeframe) {
        // Return collected history for now.
        // For real "1D", "1W" etc, we would need the 'stock/candle' endpoint which
        // requires premium for some data or more complex logic.
        // We'll stick to our collected history for High Frequency view.
        return getHistory(symbol);
    }

    public List<com.dipanjan.deltatrading.dto.MarketTicker> getMarketTickers() {
        List<com.dipanjan.deltatrading.dto.MarketTicker> tickers = new ArrayList<>();

        marketPrices.forEach((symbol, currentPrice) -> {
            if (currentPrice.compareTo(BigDecimal.ZERO) == 0)
                return; // Skip not-yet-fetched

            BigDecimal startPrice = dayOpenPrices.getOrDefault(symbol, currentPrice);
            if (startPrice.compareTo(BigDecimal.ZERO) == 0)
                startPrice = currentPrice; // Prevent divide by zero

            BigDecimal change = currentPrice.subtract(startPrice);
            BigDecimal changePercent = BigDecimal.ZERO;

            if (startPrice.compareTo(BigDecimal.ZERO) != 0) {
                changePercent = change.divide(startPrice, 4, java.math.RoundingMode.HALF_UP)
                        .multiply(new BigDecimal("100"));
            }

            String name = symbolNames.getOrDefault(symbol, symbol);

            // Clean up name for Crypto if needed
            String displayName = name;
            String displaySymbol = symbol;
            if (symbol.startsWith("BINANCE:")) {
                displaySymbol = symbol.replace("BINANCE:", "").replace("USDT", "");
            }

            com.dipanjan.deltatrading.dto.MarketTicker ticker = new com.dipanjan.deltatrading.dto.MarketTicker(
                    displaySymbol,
                    displayName,
                    currentPrice,
                    changePercent);

            // We don't get volume from Quote endpoint easily (it has 'v' but let's check).
            // Finnhub "quote" has 'v' (Current day volume).
            // Let's assume we can get it if we update the fetch logic to store volume, but
            // for now random/0 is fine or we can parse it.
            // For now, let's keep simulated volume or just 0 to avoid complexity.
            ticker.setVolume(new BigDecimal("1000000")); // Placeholder

            tickers.add(ticker);
        });

        return tickers;
    }

    public static class PricePoint {
        private long timestamp;
        private BigDecimal price;

        public PricePoint(long timestamp, BigDecimal price) {
            this.timestamp = timestamp;
            this.price = price;
        }

        public long getTimestamp() {
            return timestamp;
        }

        public BigDecimal getPrice() {
            return price;
        }
    }
}
