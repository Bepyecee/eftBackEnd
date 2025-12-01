package com.example.investmenttracker.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class EtfPriceResponse {

    private String ticker;
    private BigDecimal price;
    private String currency;
    private LocalDateTime lastUpdated;
    private String source;

    public EtfPriceResponse() {
    }

    public EtfPriceResponse(String ticker, BigDecimal price, String currency, LocalDateTime lastUpdated,
            String source) {
        this.ticker = ticker;
        this.price = price;
        this.currency = currency;
        this.lastUpdated = lastUpdated;
        this.source = source;
    }

    // Getters and Setters
    public String getTicker() {
        return ticker;
    }

    public void setTicker(String ticker) {
        this.ticker = ticker;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }
}
