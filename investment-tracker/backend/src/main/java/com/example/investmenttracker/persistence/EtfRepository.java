package com.example.investmenttracker.persistence;

import com.example.investmenttracker.model.Etf;
import java.util.List;
import java.util.Optional;

/**
 * Abstraction for ETF persistence layer.
 * Implementations can use file storage, H2, PostgreSQL, or any other backend.
 */
public interface EtfRepository {
    List<Etf> findAll();

    Optional<Etf> findById(Long id);

    Etf save(Etf etf);

    void delete(Long id);

    boolean existsById(Long id);
}
