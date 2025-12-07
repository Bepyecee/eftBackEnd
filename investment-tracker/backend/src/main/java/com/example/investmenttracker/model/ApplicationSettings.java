package com.example.investmenttracker.model;

public class ApplicationSettings {
    // Yahoo Finance Settings
    private Integer yahooFinanceTimeout;
    private Integer yahooFinanceCacheExpirationMinutes;
    private Integer yahooFinanceCacheMaxSize;
    private String yahooFinanceDefaultEuropeanSuffix;

    // Logging Settings
    private String loggingLevelRoot;
    private String loggingLevelSpring;
    private String loggingLevelApp;

    // Cache Settings
    private String cacheType;
    private String caffeineSpec;

    // Tax Settings
    private Double etfExitTaxPercentage;

    public ApplicationSettings() {
    }

    // Yahoo Finance getters and setters
    public Integer getYahooFinanceTimeout() {
        return yahooFinanceTimeout;
    }

    public void setYahooFinanceTimeout(Integer yahooFinanceTimeout) {
        this.yahooFinanceTimeout = yahooFinanceTimeout;
    }

    public Integer getYahooFinanceCacheExpirationMinutes() {
        return yahooFinanceCacheExpirationMinutes;
    }

    public void setYahooFinanceCacheExpirationMinutes(Integer yahooFinanceCacheExpirationMinutes) {
        this.yahooFinanceCacheExpirationMinutes = yahooFinanceCacheExpirationMinutes;
    }

    public Integer getYahooFinanceCacheMaxSize() {
        return yahooFinanceCacheMaxSize;
    }

    public void setYahooFinanceCacheMaxSize(Integer yahooFinanceCacheMaxSize) {
        this.yahooFinanceCacheMaxSize = yahooFinanceCacheMaxSize;
    }

    public String getYahooFinanceDefaultEuropeanSuffix() {
        return yahooFinanceDefaultEuropeanSuffix;
    }

    public void setYahooFinanceDefaultEuropeanSuffix(String yahooFinanceDefaultEuropeanSuffix) {
        this.yahooFinanceDefaultEuropeanSuffix = yahooFinanceDefaultEuropeanSuffix;
    }

    // Logging getters and setters
    public String getLoggingLevelRoot() {
        return loggingLevelRoot;
    }

    public void setLoggingLevelRoot(String loggingLevelRoot) {
        this.loggingLevelRoot = loggingLevelRoot;
    }

    public String getLoggingLevelSpring() {
        return loggingLevelSpring;
    }

    public void setLoggingLevelSpring(String loggingLevelSpring) {
        this.loggingLevelSpring = loggingLevelSpring;
    }

    public String getLoggingLevelApp() {
        return loggingLevelApp;
    }

    public void setLoggingLevelApp(String loggingLevelApp) {
        this.loggingLevelApp = loggingLevelApp;
    }

    // Cache getters and setters
    public String getCacheType() {
        return cacheType;
    }

    public void setCacheType(String cacheType) {
        this.cacheType = cacheType;
    }

    public String getCaffeineSpec() {
        return caffeineSpec;
    }

    public void setCaffeineSpec(String caffeineSpec) {
        this.caffeineSpec = caffeineSpec;
    }

    // Tax getters and setters
    public Double getEtfExitTaxPercentage() {
        return etfExitTaxPercentage;
    }

    public void setEtfExitTaxPercentage(Double etfExitTaxPercentage) {
        this.etfExitTaxPercentage = etfExitTaxPercentage;
    }
}
