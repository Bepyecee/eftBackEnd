package com.example.investmenttracker.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "yahoo.finance")
public class YahooFinanceProperties {

    /**
     * Timeout for Yahoo Finance API calls in seconds
     */
    private int timeout = 10;

    /**
     * Cache expiration time in minutes
     */
    private int cacheExpirationMinutes = 30;

    /**
     * Maximum number of cached prices
     */
    private int cacheMaxSize = 100;

    /**
     * Default exchange suffix for unmapped European tickers
     */
    private String defaultEuropeanSuffix = ".DE";

    public int getTimeout() {
        return timeout;
    }

    public void setTimeout(int timeout) {
        this.timeout = timeout;
    }

    public int getCacheExpirationMinutes() {
        return cacheExpirationMinutes;
    }

    public void setCacheExpirationMinutes(int cacheExpirationMinutes) {
        this.cacheExpirationMinutes = cacheExpirationMinutes;
    }

    public int getCacheMaxSize() {
        return cacheMaxSize;
    }

    public void setCacheMaxSize(int cacheMaxSize) {
        this.cacheMaxSize = cacheMaxSize;
    }

    public String getDefaultEuropeanSuffix() {
        return defaultEuropeanSuffix;
    }

    public void setDefaultEuropeanSuffix(String defaultEuropeanSuffix) {
        this.defaultEuropeanSuffix = defaultEuropeanSuffix;
    }
}
