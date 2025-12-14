package com.example.investmenttracker.service;

import com.example.investmenttracker.model.Asset;
import com.example.investmenttracker.model.User;
import com.example.investmenttracker.persistence.JpaAssetRepository;
import com.example.investmenttracker.storage.FileStorage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class AssetService {
    private final FileStorage fileStorage;
    private final List<Asset> cache = new ArrayList<>();

    @Autowired(required = false)
    private JpaAssetRepository jpaAssetRepository;

    @Autowired
    private UserService userService;

    public AssetService(FileStorage fileStorage) {
        this.fileStorage = fileStorage;
    }

    public List<Asset> getAllAssets(String userEmail) {
        User user = userService.getCurrentUser(userEmail);

        // Use JPA repository if available
        if (jpaAssetRepository != null) {
            return jpaAssetRepository.findByUserId(user.getId());
        }

        // Fallback to file storage and filter by user
        @SuppressWarnings("unchecked")
        List<Asset> assets = (List<Asset>) (List<?>) fileStorage.readAssets();
        if (assets != null) {
            return assets.stream()
                    .filter(asset -> asset.getUser() != null && asset.getUser().getId().equals(user.getId()))
                    .collect(Collectors.toList());
        }
        return new ArrayList<>();
    }

    public Asset getAssetById(Long id, String userEmail) {
        User user = userService.getCurrentUser(userEmail);

        if (jpaAssetRepository != null) {
            return jpaAssetRepository.findByIdAndUserId(id, user.getId()).orElse(null);
        }

        return getAllAssets(userEmail).stream()
                .filter(asset -> asset.getId().equals(id))
                .findFirst()
                .orElse(null);
    }

    public Asset addAsset(Asset asset, String userEmail) {
        User user = userService.findOrCreateUser(userEmail, "local", userEmail);
        asset.setUser(user);

        if (jpaAssetRepository != null) {
            return jpaAssetRepository.save(asset);
        }

        cache.add(asset);
        return asset;
    }

    /**
     * Update asset by id and return the updated asset, or null if not found.
     */
    public Asset updateAsset(Long id, Asset asset, String userEmail) {
        User user = userService.getCurrentUser(userEmail);

        if (jpaAssetRepository != null) {
            Asset existing = jpaAssetRepository.findByIdAndUserId(id, user.getId()).orElse(null);
            if (existing == null) {
                return null;
            }
            asset.setId(id);
            asset.setUser(user);
            return jpaAssetRepository.save(asset);
        }

        for (int i = 0; i < cache.size(); i++) {
            Asset a = cache.get(i);
            if (Objects.equals(a.getId(), id) && a.getUser() != null && a.getUser().getId().equals(user.getId())) {
                asset.setId(id);
                asset.setUser(user);
                cache.set(i, asset);
                return asset;
            }
        }
        return null;
    }

    public boolean deleteAsset(Long assetId, String userEmail) {
        User user = userService.getCurrentUser(userEmail);

        if (jpaAssetRepository != null) {
            Asset asset = jpaAssetRepository.findByIdAndUserId(assetId, user.getId()).orElse(null);
            if (asset == null) {
                return false;
            }
            jpaAssetRepository.deleteById(assetId);
            return true;
        }

        return cache.removeIf(a -> Objects.equals(a.getId(), assetId) &&
                a.getUser() != null &&
                a.getUser().getId().equals(user.getId()));
    }
}