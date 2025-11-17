package com.example.investmenttracker.controller;

import java.util.List;
import java.io.IOException;

// constructor injection used; no @Autowired required
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.investmenttracker.model.Asset;
import com.example.investmenttracker.service.AssetService;

@RestController
@RequestMapping("/api/assets")
public class AssetController {

    private final AssetService assetService;

    public AssetController(AssetService assetService) {
        this.assetService = assetService;
    }

    @GetMapping
    public ResponseEntity<List<Asset>> getAllAssets() {
        try {
            return ResponseEntity.ok(assetService.getAllAssets());
        } catch (IOException e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Asset> getAssetById(@PathVariable Long id) {
        try {
            Asset asset = assetService.getAllAssets()
                    .stream()
                    .filter(a -> a.getId() != null && a.getId().equals(id))
                    .findFirst()
                    .orElse(null);
            return asset != null ? ResponseEntity.ok(asset) : ResponseEntity.notFound().build();
        } catch (IOException e) {
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping
    public ResponseEntity<Asset> createAsset(@RequestBody Asset asset) {
        try {
            assetService.addAsset(asset);
            return ResponseEntity.status(201).body(asset);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Asset> updateAsset(@PathVariable Long id, @RequestBody Asset asset) {
        Asset updatedAsset = assetService.updateAsset(id, asset);
        return updatedAsset != null ? ResponseEntity.ok(updatedAsset) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAsset(@PathVariable Long id) {
        boolean isDeleted = assetService.deleteAsset(id);
        return isDeleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}