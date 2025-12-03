package com.example.investmenttracker.controller;

import com.example.investmenttracker.model.ApplicationSettings;
import com.example.investmenttracker.service.SettingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/settings")
@CrossOrigin(origins = "*")
public class SettingsController {

    @Autowired
    private SettingsService settingsService;

    @GetMapping
    public ResponseEntity<ApplicationSettings> getSettings() {
        return ResponseEntity.ok(settingsService.getSettings());
    }

    @PutMapping
    public ResponseEntity<ApplicationSettings> updateSettings(@RequestBody ApplicationSettings settings) {
        try {
            ApplicationSettings updated = settingsService.updateSettings(settings);
            return ResponseEntity.ok(updated);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
