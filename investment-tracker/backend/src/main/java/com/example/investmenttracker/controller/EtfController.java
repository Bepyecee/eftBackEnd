package com.example.investmenttracker.controller;

import com.example.investmenttracker.model.Etf;
import com.example.investmenttracker.model.TriggerAction;
import com.example.investmenttracker.service.EtfService;
import com.example.investmenttracker.service.PortfolioSnapshotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/etfs")
public class EtfController {

    private final EtfService etfService;

    @Autowired
    private PortfolioSnapshotService snapshotService;

    public EtfController(EtfService etfService) {
        this.etfService = etfService;
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

        try {
            String details = String.format("%s (%s)", createdEtf.getTicker(), createdEtf.getName());
            snapshotService.createSnapshot(userEmail, TriggerAction.ETF_CREATED, details);
        } catch (Exception e) {
            System.err.println("Failed to create portfolio snapshot: " + e.getMessage());
        }

        return ResponseEntity.status(201).body(createdEtf);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Etf> updateEtf(@PathVariable Long id, @RequestBody Etf etf, Authentication authentication) {
        String userEmail = authentication.getName();
        Etf updatedEtf = etfService.updateEtf(id, etf, userEmail);

        try {
            String details = String.format("%s (%s)", updatedEtf.getTicker(), updatedEtf.getName());
            snapshotService.createSnapshot(userEmail, TriggerAction.ETF_UPDATED, details);
        } catch (Exception e) {
            System.err.println("Failed to create portfolio snapshot: " + e.getMessage());
        }

        return ResponseEntity.ok(updatedEtf);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEtf(@PathVariable Long id, Authentication authentication) {
        String userEmail = authentication.getName();
        Etf etf = etfService.getEtfById(id, userEmail);
        etfService.deleteEtf(id, userEmail);

        try {
            String details = etf != null ? String.format("%s (%s)", etf.getTicker(), etf.getName()) : "Unknown ETF";
            snapshotService.createSnapshot(userEmail, TriggerAction.ETF_DELETED, details);
        } catch (Exception e) {
            System.err.println("Failed to create portfolio snapshot: " + e.getMessage());
        }

        return ResponseEntity.noContent().build();
    }
}