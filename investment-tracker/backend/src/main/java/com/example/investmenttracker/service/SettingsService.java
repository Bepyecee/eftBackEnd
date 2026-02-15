package com.example.investmenttracker.service;

import com.example.investmenttracker.model.ApplicationSettings;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.PropertiesPropertySource;
import org.springframework.stereotype.Service;

import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Properties;

@Service
public class SettingsService {

    private static final Logger logger = LoggerFactory.getLogger(SettingsService.class);
    private static final String LOCAL_PROPERTIES_PATH = "src/main/resources/application-local.properties";

    private final ConfigurableEnvironment environment;

    @Value("${yahoo.finance.timeout:10}")
    private Integer yahooFinanceTimeout;

    @Value("${yahoo.finance.cache-expiration-minutes:30}")
    private Integer yahooFinanceCacheExpirationMinutes;

    @Value("${yahoo.finance.cache-max-size:100}")
    private Integer yahooFinanceCacheMaxSize;

    @Value("${yahoo.finance.default-european-suffix:.DE}")
    private String yahooFinanceDefaultEuropeanSuffix;

    @Value("${logging.level.root:INFO}")
    private String loggingLevelRoot;

    @Value("${logging.level.org.springframework:INFO}")
    private String loggingLevelSpring;

    @Value("${logging.level.com.example.investmenttracker:DEBUG}")
    private String loggingLevelApp;

    @Value("${spring.cache.type:caffeine}")
    private String cacheType;

    @Value("${spring.cache.caffeine.spec:maximumSize=100,expireAfterWrite=30m}")
    private String caffeineSpec;

    @Value("${tax.etf-exit-tax-percentage:38.0}")
    private Double etfExitTaxPercentage;

    public SettingsService(ConfigurableEnvironment environment) {
        this.environment = environment;
    }

    public ApplicationSettings getSettings() {
        ApplicationSettings settings = new ApplicationSettings();

        // Yahoo Finance settings
        settings.setYahooFinanceTimeout(yahooFinanceTimeout);
        settings.setYahooFinanceCacheExpirationMinutes(yahooFinanceCacheExpirationMinutes);
        settings.setYahooFinanceCacheMaxSize(yahooFinanceCacheMaxSize);
        settings.setYahooFinanceDefaultEuropeanSuffix(yahooFinanceDefaultEuropeanSuffix);

        // Logging settings
        settings.setLoggingLevelRoot(loggingLevelRoot);
        settings.setLoggingLevelSpring(loggingLevelSpring);
        settings.setLoggingLevelApp(loggingLevelApp);

        // Cache settings
        settings.setCacheType(cacheType);
        settings.setCaffeineSpec(caffeineSpec);

        // Tax settings
        settings.setEtfExitTaxPercentage(etfExitTaxPercentage);

        return settings;
    }

    public ApplicationSettings updateSettings(ApplicationSettings settings) throws IOException {
        Properties props = loadExistingProperties();

        // Update all non-null settings
        setIfPresent(props, "yahoo.finance.timeout", settings.getYahooFinanceTimeout());
        setIfPresent(props, "yahoo.finance.cache-expiration-minutes", settings.getYahooFinanceCacheExpirationMinutes());
        setIfPresent(props, "yahoo.finance.cache-max-size", settings.getYahooFinanceCacheMaxSize());
        setIfPresent(props, "yahoo.finance.default-european-suffix", settings.getYahooFinanceDefaultEuropeanSuffix());
        setIfPresent(props, "logging.level.root", settings.getLoggingLevelRoot());
        setIfPresent(props, "logging.level.org.springframework", settings.getLoggingLevelSpring());
        setIfPresent(props, "logging.level.com.example.investmenttracker", settings.getLoggingLevelApp());
        setIfPresent(props, "spring.cache.type", settings.getCacheType());
        setIfPresent(props, "spring.cache.caffeine.spec", settings.getCaffeineSpec());
        setIfPresent(props, "tax.etf-exit-tax-percentage", settings.getEtfExitTaxPercentage());

        saveProperties(props);
        updateEnvironment(props);

        return getSettings();
    }

    private Properties loadExistingProperties() {
        Properties props = new Properties();
        try {
            if (Files.exists(Paths.get(LOCAL_PROPERTIES_PATH))) {
                props.load(Files.newInputStream(Paths.get(LOCAL_PROPERTIES_PATH)));
            }
        } catch (IOException e) {
            logger.warn("Could not load existing properties, starting fresh: {}", e.getMessage());
        }
        return props;
    }

    private void setIfPresent(Properties props, String key, Object value) {
        if (value != null) {
            props.setProperty(key, value.toString());
        }
    }

    private void saveProperties(Properties props) throws IOException {
        try (FileOutputStream out = new FileOutputStream(LOCAL_PROPERTIES_PATH)) {
            props.store(out, "Updated by Settings API");
        }
    }

    private void updateEnvironment(Properties props) {
        PropertiesPropertySource propertySource = new PropertiesPropertySource("dynamicSettings", props);
        environment.getPropertySources().addFirst(propertySource);
    }
}
