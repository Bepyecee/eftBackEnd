package com.example.investmenttracker.service;

import com.example.investmenttracker.model.Etf;
import com.example.investmenttracker.persistence.EtfRepository;
import com.example.investmenttracker.exception.ResourceConflictException;
import com.example.investmenttracker.exception.ValidationException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import org.springframework.data.jpa.repository.JpaRepository;

@Service
public class EtfService {
    private final EtfRepository etfRepository;

    public EtfService(EtfRepository etfRepository) {
        this.etfRepository = etfRepository;
    }

    public List<Etf> getAllEtfs() {
        return etfRepository.findAll();
    }

    public Etf getEtfById(Long id) {
        return etfRepository.findById(id).orElse(null);
    }

    public void addEtf(Etf etf) {
        etfRepository.save(etf);
    }

    /**
     * Convenience method used by controllers: create and return the saved ETF.
     * Keeps backward compatibility if callers expect a returned Etf.
     */
    public Etf createEtf(Etf etf) {
        List<Etf> etfs = etfRepository.findAll();
        // Validate mandatory fields
        if (etf.getTicker() == null || etf.getTicker().trim().isEmpty()) {
            throw new ValidationException("etf.missing.ticker");
        }
        if (etf.getType() == null) {
            throw new ValidationException("etf.missing.type");
        }

        // Check ticker uniqueness (case-insensitive) before assigning id
        boolean tickerExists = etfs.stream()
                .anyMatch(e -> e.getTicker() != null && e.getTicker().equalsIgnoreCase(etf.getTicker()));
        if (tickerExists) {
            throw new ResourceConflictException("etf.duplicate.ticker", etf.getTicker());
        }

        // If caller provided an ID, ensure it doesn't already exist. Do NOT
        // assign IDs here — JPA repositories expect the database to generate
        // identity values and the file-based repository will assign IDs inside
        // its own `save` implementation when needed.
        if (etf.getId() != null) {
            boolean exists = etfRepository.existsById(etf.getId());
            if (exists) {
                throw new ResourceConflictException("etf.duplicate.id", etf.getId());
            }
        }

        // If we're using a JPA-backed repository, ensure new entities do not
        // carry a client-supplied id. Spring Data JPA will call `merge` when
        // an id is present which can produce merge/identity issues; clearing
        // the id ensures the entity is `persist`ed and the DB assigns an id.
        if (etfRepository instanceof JpaRepository) {
            if (etf.getId() != null) {
                etf.setId(null);
            }
        }

        return etfRepository.save(etf);
    }

    public void updateEtf(Long id, Etf updatedEtf) {
        List<Etf> etfs = etfRepository.findAll();
        // Validate mandatory fields
        if (updatedEtf.getTicker() == null || updatedEtf.getTicker().trim().isEmpty()) {
            throw new ValidationException("etf.missing.ticker");
        }
        if (updatedEtf.getType() == null) {
            throw new ValidationException("etf.missing.type");
        }

        // Validate ticker uniqueness: another ETF (different id) must not have the same
        // ticker
        boolean tickerConflict = etfs.stream()
                .anyMatch(e -> !Objects.equals(e.getId(), id)
                        && e.getTicker() != null
                        && e.getTicker().equalsIgnoreCase(updatedEtf.getTicker()));
        if (tickerConflict) {
            throw new ResourceConflictException("etf.duplicate.ticker", updatedEtf.getTicker());
        }

        // Set the id to the one being updated
        updatedEtf.setId(id);
        etfRepository.save(updatedEtf);
    }

    public void deleteEtf(Long id) {
        etfRepository.delete(id);
    }
}