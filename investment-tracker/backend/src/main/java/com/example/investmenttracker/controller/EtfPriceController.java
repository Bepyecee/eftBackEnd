package com.example.investmenttracker.controller;

import com.example.investmenttracker.dto.EtfPriceResponse;
import com.example.investmenttracker.service.EtfPriceService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/etf-prices")
@CrossOrigin(origins = "http://localhost:3000")
public class EtfPriceController {

    private static final Logger logger = LoggerFactory.getLogger(EtfPriceController.class);

    private final EtfPriceService etfPriceService;

    public EtfPriceController(EtfPriceService etfPriceService) {
        this.etfPriceService = etfPriceService;
    }

    @GetMapping("/{ticker}")
    public ResponseEntity<?> getPrice(@PathVariable String ticker) {
        try {
            logger.info("GET request for price of ticker: {}", ticker);
            EtfPriceResponse price = etfPriceService.getPrice(ticker);
            return ResponseEntity.ok(price);
        } catch (Exception e) {
            logger.error("Error getting price for {}: {}", ticker, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to fetch price: " + e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllPrices() {
        try {
            logger.info("GET request for all prices");
            List<EtfPriceResponse> prices = etfPriceService.getAllPrices();
            return ResponseEntity.ok(prices);
        } catch (Exception e) {
            logger.error("Error getting all prices: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to fetch prices: " + e.getMessage()));
        }
    }

    @PostMapping("/refresh/{ticker}")
    public ResponseEntity<?> refreshPrice(@PathVariable String ticker) {
        try {
            logger.info("POST request to refresh price for ticker: {}", ticker);
            EtfPriceResponse price = etfPriceService.refreshPrice(ticker);
            return ResponseEntity.ok(price);
        } catch (Exception e) {
            logger.error("Error refreshing price for {}: {}", ticker, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to refresh price: " + e.getMessage()));
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshAllPrices(@RequestBody List<String> tickers) {
        try {
            logger.info("POST request to refresh prices for {} tickers", tickers.size());
            List<EtfPriceResponse> prices = etfPriceService.refreshAllPrices(tickers);

            if (prices.isEmpty()) {
                return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                        .body(Map.of(
                                "error", "No prices available",
                                "message", "Unable to fetch prices for any of the requested tickers"));
            }

            if (prices.size() < tickers.size()) {
                int unavailable = tickers.size() - prices.size();
                return ResponseEntity.ok(Map.of(
                        "prices", prices,
                        "warning", unavailable + " ticker(s) unavailable"));
            }

            return ResponseEntity.ok(prices);
        } catch (Exception e) {
            logger.error("Error refreshing prices: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to refresh prices: " + e.getMessage()));
        }
    }
}
