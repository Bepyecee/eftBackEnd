package com.example.investmenttracker.persistence;

import com.example.investmenttracker.model.Asset;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@ConditionalOnProperty(name = "app.persistence.type", havingValue = "jpa", matchIfMissing = false)
public interface JpaAssetRepository extends JpaRepository<Asset, Long> {
    List<Asset> findByUserId(Long userId);
    
    Optional<Asset> findByIdAndUserId(Long id, Long userId);
}
