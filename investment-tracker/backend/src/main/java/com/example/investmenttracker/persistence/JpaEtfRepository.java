package com.example.investmenttracker.persistence;

import com.example.investmenttracker.model.Etf;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * JPA Repository for Etf entity. Used by H2 (dev) and PostgreSQL (prod)
 * profiles.
 */
@Repository
@ConditionalOnProperty(name = "app.persistence.type", havingValue = "jpa", matchIfMissing = false)
public interface JpaEtfRepository extends JpaRepository<Etf, Long>, EtfRepository {
    /**
     * Default implementation delegates to JpaRepository methods.
     * The interface methods from EtfRepository are already implemented by
     * JpaRepository.
     */
    @Override
    default void delete(Long id) {
        deleteById(id);
    }

    // User-specific queries
    List<Etf> findByUserId(Long userId);

    Optional<Etf> findByIdAndUserId(Long id, Long userId);
}
