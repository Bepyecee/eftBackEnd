package com.example.investmenttracker.controller;

import java.util.List;

// constructor injection used; no @Autowired required
import org.springframework.beans.factory.annotation.Autowired;
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

    private final AssetService assetService;

    @Autowired
    private PortfolioSnapshotService snapshotService;

    public AssetController(AssetService assetService) {
        this.assetService = assetService;
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

        try {
            snapshotService.createSnapshot(userEmail, TriggerAction.ASSET_CREATED);
        } catch (Exception e) {
            System.err.println("Failed to create portfolio snapshot: " + e.getMessage());
        }

        return ResponseEntity.status(201).body(createdAsset);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Asset> updateAsset(@PathVariable Long id, @RequestBody Asset asset,
            Authentication authentication) {
        String userEmail = authentication.getName();
        Asset updatedAsset = assetService.updateAsset(id, asset, userEmail);

        if (updatedAsset != null) {
            try {
                snapshotService.createSnapshot(userEmail, TriggerAction.ASSET_UPDATED);
            } catch (Exception e) {
                System.err.println("Failed to create portfolio snapshot: " + e.getMessage());
            }
        }

        return updatedAsset != null ? ResponseEntity.ok(updatedAsset) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAsset(@PathVariable Long id, Authentication authentication) {
        String userEmail = authentication.getName();
        boolean isDeleted = assetService.deleteAsset(id, userEmail);

        if (isDeleted) {
            try {
                snapshotService.createSnapshot(userEmail, TriggerAction.ASSET_DELETED);
            } catch (Exception e) {
                System.err.println("Failed to create portfolio snapshot: " + e.getMessage());
            }
        }

        return isDeleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}