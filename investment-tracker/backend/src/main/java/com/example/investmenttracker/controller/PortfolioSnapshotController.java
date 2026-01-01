package com.example.investmenttracker.controller;

import com.example.investmenttracker.model.PortfolioSnapshot;
import com.example.investmenttracker.service.PortfolioSnapshotService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/portfolio-snapshots")
@CrossOrigin(origins = "http://localhost:3000")
public class PortfolioSnapshotController {

    private final PortfolioSnapshotService snapshotService;

    public PortfolioSnapshotController(PortfolioSnapshotService snapshotService) {
        this.snapshotService = snapshotService;
    }

    @GetMapping
    public ResponseEntity<List<PortfolioSnapshot>> getAllSnapshots(Authentication authentication) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(snapshotService.getUserSnapshots(userEmail));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PortfolioSnapshot> getSnapshotById(@PathVariable Long id, Authentication authentication) {
        String userEmail = authentication.getName();
        PortfolioSnapshot snapshot = snapshotService.getSnapshotById(id, userEmail);
        return snapshot != null ? ResponseEntity.ok(snapshot) : ResponseEntity.notFound().build();
    }

    @GetMapping("/version/{versionId}")
    public ResponseEntity<PortfolioSnapshot> getSnapshotByVersionId(@PathVariable String versionId) {
        PortfolioSnapshot snapshot = snapshotService.getSnapshotByVersionId(versionId);
        return snapshot != null ? ResponseEntity.ok(snapshot) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<PortfolioSnapshot> createSnapshot(@RequestBody Map<String, String> request,
            Authentication authentication) {
        String userEmail = authentication.getName();
        String triggerAction = request.getOrDefault("triggerAction", "MANUAL");

        PortfolioSnapshot snapshot = snapshotService.createSnapshot(userEmail, triggerAction);
        return ResponseEntity.status(201).body(snapshot);
    }

    @PostMapping("/with-data")
    public ResponseEntity<PortfolioSnapshot> createSnapshotWithData(@RequestBody Map<String, String> request,
            Authentication authentication) {
        String userEmail = authentication.getName();
        String versionId = request.get("versionId");
        String portfolioJson = request.get("portfolioJson");
        String triggerAction = request.getOrDefault("triggerAction", "MANUAL_EXPORT");

        if (versionId == null || portfolioJson == null) {
            return ResponseEntity.badRequest().build();
        }

        PortfolioSnapshot snapshot = snapshotService.createSnapshotWithVersionId(userEmail, versionId, portfolioJson,
                triggerAction);
        return ResponseEntity.status(201).body(snapshot);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSnapshot(@PathVariable Long id, Authentication authentication) {
        String userEmail = authentication.getName();
        snapshotService.deleteSnapshot(id, userEmail);
        return ResponseEntity.noContent().build();
    }
}
