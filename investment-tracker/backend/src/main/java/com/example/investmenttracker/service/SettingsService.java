package com.example.investmenttracker.service;

import com.example.investmenttracker.model.ApplicationSettings;
import org.springframework.beans.factory.annotation.Autowired;
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
    
    @Autowired
    private ConfigurableEnvironment environment;
    
    private static final String LOCAL_PROPERTIES_PATH = "src/main/resources/application-local.properties";
    
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
        
        return settings;
    }
    
    public ApplicationSettings updateSettings(ApplicationSettings settings) throws IOException {
        Properties props = new Properties();
        
        // Load existing properties from application-local.properties
        try {
            if (Files.exists(Paths.get(LOCAL_PROPERTIES_PATH))) {
                props.load(Files.newInputStream(Paths.get(LOCAL_PROPERTIES_PATH)));
            }
        } catch (IOException e) {
            // If file doesn't exist, start with empty properties
        }
        
        // Update Yahoo Finance settings
        if (settings.getYahooFinanceTimeout() != null) {
            props.setProperty("yahoo.finance.timeout", settings.getYahooFinanceTimeout().toString());
        }
        if (settings.getYahooFinanceCacheExpirationMinutes() != null) {
            props.setProperty("yahoo.finance.cache-expiration-minutes", 
                settings.getYahooFinanceCacheExpirationMinutes().toString());
        }
        if (settings.getYahooFinanceCacheMaxSize() != null) {
            props.setProperty("yahoo.finance.cache-max-size", settings.getYahooFinanceCacheMaxSize().toString());
        }
        if (settings.getYahooFinanceDefaultEuropeanSuffix() != null) {
            props.setProperty("yahoo.finance.default-european-suffix", 
                settings.getYahooFinanceDefaultEuropeanSuffix());
        }
        
        // Update Logging settings
        if (settings.getLoggingLevelRoot() != null) {
            props.setProperty("logging.level.root", settings.getLoggingLevelRoot());
        }
        if (settings.getLoggingLevelSpring() != null) {
            props.setProperty("logging.level.org.springframework", settings.getLoggingLevelSpring());
        }
        if (settings.getLoggingLevelApp() != null) {
            props.setProperty("logging.level.com.example.investmenttracker", settings.getLoggingLevelApp());
        }
        
        // Update Cache settings
        if (settings.getCacheType() != null) {
            props.setProperty("spring.cache.type", settings.getCacheType());
        }
        if (settings.getCaffeineSpec() != null) {
            props.setProperty("spring.cache.caffeine.spec", settings.getCaffeineSpec());
        }
        
        // Save to application-local.properties
        try (FileOutputStream out = new FileOutputStream(LOCAL_PROPERTIES_PATH)) {
            props.store(out, "Updated by Settings API");
        }
        
        // Note: Changes will take effect on next application restart
        // To apply immediately, you would need to update the Environment dynamically
        updateEnvironment(props);
        
        return getSettings();
    }
    
    private void updateEnvironment(Properties props) {
        PropertiesPropertySource propertySource = new PropertiesPropertySource("dynamicSettings", props);
        environment.getPropertySources().addFirst(propertySource);
    }
}
