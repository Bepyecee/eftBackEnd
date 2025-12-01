package com.example.investmenttracker.service;

import com.example.investmenttracker.dto.EtfPriceResponse;
import com.example.investmenttracker.dto.YahooFinanceResponse;
import com.example.investmenttracker.model.EtfPrice;
import com.example.investmenttracker.persistence.EtfPriceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EtfPriceService {

    private static final Logger logger = LoggerFactory.getLogger(EtfPriceService.class);

    private final EtfPriceRepository etfPriceRepository;
    private final YahooFinanceService yahooFinanceService;

    public EtfPriceService(EtfPriceRepository etfPriceRepository, YahooFinanceService yahooFinanceService) {
        this.etfPriceRepository = etfPriceRepository;
        this.yahooFinanceService = yahooFinanceService;
    }

    @Cacheable(value = "etfPrices", key = "#ticker")
    public EtfPriceResponse getPrice(String ticker) {
        logger.debug("Getting price for ticker: {}", ticker);

        // First check database for cached price
        Optional<EtfPrice> cachedPrice = etfPriceRepository.findByTicker(ticker);

        if (cachedPrice.isPresent() && isFresh(cachedPrice.get().getLastUpdated())) {
            logger.debug("Returning cached price for {}", ticker);
            return toResponse(cachedPrice.get());
        }

        // If not in cache or stale, fetch from API
        return fetchAndSavePrice(ticker);
    }

    @CacheEvict(value = "etfPrices", key = "#ticker")
    @Transactional
    public EtfPriceResponse refreshPrice(String ticker) {
        logger.info("Refreshing price for ticker: {}", ticker);
        return fetchAndSavePrice(ticker);
    }

    @CacheEvict(value = "etfPrices", allEntries = true)
    @Transactional
    public List<EtfPriceResponse> refreshAllPrices(List<String> tickers) {
        logger.info("Refreshing prices for {} tickers", tickers.size());
        return tickers.stream()
                .map(ticker -> {
                    try {
                        return fetchAndSavePrice(ticker);
                    } catch (Exception e) {
                        logger.warn("Skipping {}: {}", ticker, e.getMessage());
                        return null;
                    }
                })
                .filter(price -> price != null)
                .collect(Collectors.toList());
    }

    public List<EtfPriceResponse> getAllPrices() {
        return etfPriceRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private EtfPriceResponse fetchAndSavePrice(String ticker) {
        try {
            YahooFinanceResponse response = yahooFinanceService.fetchPrice(ticker);

            if (response == null || response.getChart() == null ||
                    response.getChart().getResult() == null ||
                    response.getChart().getResult().isEmpty()) {
                throw new RuntimeException("Invalid response from API for ticker: " + ticker);
            }

            YahooFinanceResponse.Meta meta = response.getChart().getResult().get(0).getMeta();

            if (meta == null || meta.getRegularMarketPrice() == null) {
                throw new RuntimeException("No price data available for ticker: " + ticker);
            }

            BigDecimal price = BigDecimal.valueOf(meta.getRegularMarketPrice());
            String currency = meta.getCurrency() != null ? meta.getCurrency() : "EUR";
            LocalDateTime now = LocalDateTime.now();

            // Save or update in database
            EtfPrice etfPrice = etfPriceRepository.findByTicker(ticker)
                    .orElse(new EtfPrice());

            etfPrice.setTicker(ticker);
            etfPrice.setPrice(price);
            etfPrice.setCurrency(currency);
            etfPrice.setLastUpdated(now);
            etfPrice.setSource("Yahoo Finance");

            etfPrice = etfPriceRepository.save(etfPrice);
            logger.info("Saved price for {}: {} {}", ticker, price, currency);

            return toResponse(etfPrice);

        } catch (Exception e) {
            logger.error("Error fetching and saving price for {}: {}", ticker, e.getMessage());
            throw new RuntimeException("Failed to fetch price for " + ticker, e);
        }
    }

    private boolean isFresh(LocalDateTime lastUpdated) {
        // Consider price fresh if updated within last 30 minutes
        return lastUpdated.isAfter(LocalDateTime.now().minusMinutes(30));
    }

    private EtfPriceResponse toResponse(EtfPrice etfPrice) {
        return new EtfPriceResponse(
                etfPrice.getTicker(),
                etfPrice.getPrice(),
                etfPrice.getCurrency(),
                etfPrice.getLastUpdated(),
                etfPrice.getSource());
    }
}
