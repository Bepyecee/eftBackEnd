package com.example.investmenttracker.service;

import com.example.investmenttracker.config.YahooFinanceProperties;
import com.example.investmenttracker.dto.YahooFinanceResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.time.Duration;

@Service
public class YahooFinanceService {

    private static final Logger logger = LoggerFactory.getLogger(YahooFinanceService.class);
    private static final String YAHOO_FINANCE_BASE_URL = "https://query1.finance.yahoo.com";

    private final WebClient webClient;
    private final YahooFinanceProperties properties;

    public YahooFinanceService(YahooFinanceProperties properties) {
        this.properties = properties;
        this.webClient = WebClient.builder()
                .baseUrl(YAHOO_FINANCE_BASE_URL)
                .build();
    }

    public YahooFinanceResponse fetchPrice(String ticker) {
        try {
            // Convert ticker to Yahoo Finance format
            String yahooTicker = mapTickerToYahooSymbol(ticker);

            logger.debug("Fetching price for ticker: {} (Yahoo symbol: {})", ticker, yahooTicker);

            YahooFinanceResponse response = webClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/v8/finance/chart/{symbol}")
                            .build(yahooTicker))
                    .retrieve()
                    .bodyToMono(YahooFinanceResponse.class)
                    .timeout(Duration.ofSeconds(properties.getTimeout()))
                    .block();

            if (response == null || response.getChart() == null) {
                logger.warn("Invalid response for {}", ticker);
                throw new RuntimeException("Invalid response from Yahoo Finance for ticker: " + ticker);
            }

            if (response.getChart().getError() != null) {
                logger.warn("Error in Yahoo Finance response for {}: {}", ticker, response.getChart().getError());
                throw new RuntimeException("Yahoo Finance error for ticker: " + ticker);
            }

            if (response.getChart().getResult() == null || response.getChart().getResult().isEmpty()) {
                logger.warn("No data returned for {}", ticker);
                throw new RuntimeException("No price data available for ticker: " + ticker);
            }

            logger.debug("Successfully fetched price for {}", ticker);
            return response;

        } catch (WebClientResponseException e) {
            logger.error("HTTP error fetching price for {}: {} - {}", ticker, e.getStatusCode(), e.getMessage());
            throw new RuntimeException("Failed to fetch price for " + ticker + ": " + e.getMessage(), e);
        } catch (Exception e) {
            logger.warn("Could not fetch price for {}: {}", ticker, e.getMessage());
            throw new RuntimeException("Failed to fetch price for " + ticker, e);
        }
    }

    private String mapTickerToYahooSymbol(String ticker) {
        // Check if we have a specific mapping for this ticker
        String upperTicker = ticker.toUpperCase();
        if (properties.getTickerMappings().containsKey(upperTicker)) {
            return properties.getTickerMappings().get(upperTicker);
        }

        // If no mapping exists and it doesn't already have an exchange suffix,
        // assume it's a European ticker and add configured default suffix
        if (!ticker.contains(".")) {
            logger.debug("No mapping found for {}, adding default suffix: {}", ticker,
                    properties.getDefaultEuropeanSuffix());
            return upperTicker + properties.getDefaultEuropeanSuffix();
        }

        // Return as-is if it already has a suffix
        return upperTicker;
    }

    // Method to manually add ticker mappings at runtime
    public void addTickerMapping(String ticker, String yahooSymbol) {
        properties.getTickerMappings().put(ticker.toUpperCase(), yahooSymbol.toUpperCase());
        logger.info("Added ticker mapping: {} -> {}", ticker, yahooSymbol);
    }
}
