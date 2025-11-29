package com.example.investmenttracker.service;

import com.example.investmenttracker.model.Asset;
import com.example.investmenttracker.storage.FileStorage;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class AssetService {
    private final FileStorage fileStorage;
    private final List<Asset> cache = new ArrayList<>();

    public AssetService(FileStorage fileStorage) {
        this.fileStorage = fileStorage;
    }

    public List<Asset> getAllAssets() {
        // FileStorage currently returns List<String>; cast through a raw wildcard to
        // satisfy the method signature.
        @SuppressWarnings("unchecked")
        List<Asset> assets = (List<Asset>) (List<?>) fileStorage.readAssets();
        cache.clear();
        if (assets != null) {
            cache.addAll(assets);
        }
        return new ArrayList<>(cache);
    }

    public void addAsset(Asset asset) {
        cache.add(asset);
    }

    /**
     * Update asset by id and return the updated asset, or null if not found.
     */
    public Asset updateAsset(Long id, Asset asset) {
        for (int i = 0; i < cache.size(); i++) {
            Asset a = cache.get(i);
            if (Objects.equals(a.getId(), id)) {
                asset.setId(id);
                cache.set(i, asset);
                return asset;
            }
        }
        return null;
    }

    public void updateAsset(Asset asset) {
        for (int i = 0; i < cache.size(); i++) {
            Asset a = cache.get(i);
            if (Objects.equals(a.getId(), asset.getId())) {
                cache.set(i, asset);
                return;
            }
        }
        // if not found, add as new
        cache.add(asset);
    }

    public boolean deleteAsset(Long assetId) {
        return cache.removeIf(a -> Objects.equals(a.getId(), assetId));
    }
}