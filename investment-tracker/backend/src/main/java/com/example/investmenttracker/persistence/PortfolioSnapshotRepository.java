package com.example.investmenttracker.persistence;

import com.example.investmenttracker.model.PortfolioSnapshot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PortfolioSnapshotRepository extends JpaRepository<PortfolioSnapshot, Long> {
    List<PortfolioSnapshot> findByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<PortfolioSnapshot> findByVersionId(String versionId);

    Optional<PortfolioSnapshot> findByIdAndUserId(Long id, Long userId);
}
