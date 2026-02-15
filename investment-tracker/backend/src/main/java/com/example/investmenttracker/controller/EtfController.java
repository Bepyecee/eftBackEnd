package com.example.investmenttracker.controller;

import com.example.investmenttracker.model.Etf;
import com.example.investmenttracker.model.TriggerAction;
import com.example.investmenttracker.service.EtfService;
import com.example.investmenttracker.service.PortfolioSnapshotService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/etfs")
public class EtfController {

    private static final Logger logger = LoggerFactory.getLogger(EtfController.class);

    private final EtfService etfService;
    private final PortfolioSnapshotService snapshotService;

    public EtfController(EtfService etfService, PortfolioSnapshotService snapshotService) {
        this.etfService = etfService;
        this.snapshotService = snapshotService;
    }

    @GetMapping
    public ResponseEntity<List<Etf>> getAllEtfs(Authentication authentication) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(etfService.getAllEtfs(userEmail));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Etf> getEtfById(@PathVariable Long id, Authentication authentication) {
        String userEmail = authentication.getName();
        Etf etf = etfService.getEtfById(id, userEmail);
        return etf != null ? ResponseEntity.ok(etf) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Etf> createEtf(@RequestBody Etf etf, Authentication authentication) {
        String userEmail = authentication.getName();
        Etf createdEtf = etfService.createEtf(etf, userEmail);
        createSnapshotSafely(userEmail, TriggerAction.ETF_CREATED,
                String.format("%s (%s)", createdEtf.getTicker(), createdEtf.getName()));
        return ResponseEntity.status(201).body(createdEtf);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Etf> updateEtf(@PathVariable Long id, @RequestBody Etf etf, Authentication authentication) {
        String userEmail = authentication.getName();
        Etf updatedEtf = etfService.updateEtf(id, etf, userEmail);
        createSnapshotSafely(userEmail, TriggerAction.ETF_UPDATED,
                String.format("%s (%s)", updatedEtf.getTicker(), updatedEtf.getName()));
        return ResponseEntity.ok(updatedEtf);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEtf(@PathVariable Long id, Authentication authentication) {
        String userEmail = authentication.getName();
        Etf etf = etfService.getEtfById(id, userEmail);
        etfService.deleteEtf(id, userEmail);
        String details = etf != null ? String.format("%s (%s)", etf.getTicker(), etf.getName()) : "Unknown ETF";
        createSnapshotSafely(userEmail, TriggerAction.ETF_DELETED, details);
        return ResponseEntity.noContent().build();
    }

    private void createSnapshotSafely(String userEmail, TriggerAction action, String details) {
        try {
            snapshotService.createSnapshot(userEmail, action, details);
        } catch (Exception e) {
            logger.warn("Failed to create portfolio snapshot for {}: {}", action, e.getMessage());
        }
    }
}