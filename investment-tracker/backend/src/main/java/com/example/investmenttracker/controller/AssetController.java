package com.example.investmenttracker.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.example.investmenttracker.model.Asset;
import com.example.investmenttracker.model.TriggerAction;
import com.example.investmenttracker.service.AssetService;
import com.example.investmenttracker.service.PortfolioSnapshotService;

@RestController
@RequestMapping("/api/assets")
public class AssetController {

    private static final Logger logger = LoggerFactory.getLogger(AssetController.class);

    private final AssetService assetService;
    private final PortfolioSnapshotService snapshotService;

    public AssetController(AssetService assetService, PortfolioSnapshotService snapshotService) {
        this.assetService = assetService;
        this.snapshotService = snapshotService;
    }

    @GetMapping
    public ResponseEntity<List<Asset>> getAllAssets(Authentication authentication) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(assetService.getAllAssets(userEmail));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Asset> getAssetById(@PathVariable Long id, Authentication authentication) {
        String userEmail = authentication.getName();
        Asset asset = assetService.getAssetById(id, userEmail);
        return asset != null ? ResponseEntity.ok(asset) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Asset> createAsset(@RequestBody Asset asset, Authentication authentication) {
        String userEmail = authentication.getName();
        Asset createdAsset = assetService.addAsset(asset, userEmail);
        createSnapshotSafely(userEmail, TriggerAction.ASSET_CREATED,
                String.format("%s: %.1f%%", createdAsset.getName(), createdAsset.getAllocationPercentage()));
        return ResponseEntity.status(201).body(createdAsset);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Asset> updateAsset(@PathVariable Long id, @RequestBody Asset asset,
            Authentication authentication) {
        String userEmail = authentication.getName();
        Asset updatedAsset = assetService.updateAsset(id, asset, userEmail);
        if (updatedAsset != null) {
            createSnapshotSafely(userEmail, TriggerAction.ASSET_UPDATED,
                    String.format("%s: %.1f%%", updatedAsset.getName(), updatedAsset.getAllocationPercentage()));
        }
        return updatedAsset != null ? ResponseEntity.ok(updatedAsset) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAsset(@PathVariable Long id, Authentication authentication) {
        String userEmail = authentication.getName();
        Asset asset = assetService.getAssetById(id, userEmail);
        boolean isDeleted = assetService.deleteAsset(id, userEmail);
        if (isDeleted) {
            String details = asset != null ? asset.getName() : "Unknown asset";
            createSnapshotSafely(userEmail, TriggerAction.ASSET_DELETED, details);
        }
        return isDeleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    private void createSnapshotSafely(String userEmail, TriggerAction action, String details) {
        try {
            snapshotService.createSnapshot(userEmail, action, details);
        } catch (Exception e) {
            logger.warn("Failed to create portfolio snapshot for {}: {}", action, e.getMessage());
        }
    }
}