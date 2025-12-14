package com.example.investmenttracker.config;

import com.example.investmenttracker.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(UserService userService) {
        return args -> {
            // Create admin user if it doesn't exist
            userService.findOrCreateUser("admin", "local", "Administrator");
        };
    }
}
