package com.example.investmenttracker.service;

import com.example.investmenttracker.model.Etf;
import com.example.investmenttracker.model.User;
import com.example.investmenttracker.persistence.EtfRepository;
import com.example.investmenttracker.persistence.JpaEtfRepository;
import com.example.investmenttracker.exception.ResourceConflictException;
import com.example.investmenttracker.exception.ValidationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import org.springframework.data.jpa.repository.JpaRepository;

@Service
@Transactional
public class EtfService {
    private final EtfRepository etfRepository;
    private final UserService userService;

    public EtfService(EtfRepository etfRepository, UserService userService) {
        this.etfRepository = etfRepository;
        this.userService = userService;
    }

    /**
     * Internal method to get all ETFs without user filtering.
     * Used by internal services like EtfPriceService.
     */
    protected List<Etf> getAllEtfsInternal() {
        return etfRepository.findAll();
    }

    public List<Etf> getAllEtfs(String userEmail) {
        User user = userService.getCurrentUser(userEmail);
        
        // If using JPA repository, use the user-specific query
        if (etfRepository instanceof JpaEtfRepository) {
            return ((JpaEtfRepository) etfRepository).findByUserId(user.getId());
        }
        
        // Fallback for file-based repository - filter in memory
        return etfRepository.findAll().stream()
                .filter(etf -> etf.getUser() != null && etf.getUser().getId().equals(user.getId()))
                .collect(Collectors.toList());
    }

    public Etf getEtfById(Long id, String userEmail) {
        User user = userService.getCurrentUser(userEmail);
        
        // If using JPA repository, use the user-specific query
        if (etfRepository instanceof JpaEtfRepository) {
            return ((JpaEtfRepository) etfRepository).findByIdAndUserId(id, user.getId()).orElse(null);
        }
        
        // Fallback for file-based repository
        Etf etf = etfRepository.findById(id).orElse(null);
        if (etf != null && etf.getUser() != null && etf.getUser().getId().equals(user.getId())) {
            return etf;
        }
        return null;
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
    public Etf createEtf(Etf etf, String userEmail) {
        User user = userService.findOrCreateUser(userEmail, "local", userEmail);
        etf.setUser(user);
        
        List<Etf> etfs = getAllEtfs(userEmail);
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

    public Etf updateEtf(Long id, Etf updatedEtf, String userEmail) {
        User user = userService.getCurrentUser(userEmail);
        List<Etf> etfs = getAllEtfs(userEmail);
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

        // Update existing ETF in place to preserve transaction relationships
        Etf existingEtf = etfRepository.findById(id)
                .orElseThrow(() -> new ValidationException("etf.not.found"));

        // Update all fields except relationships
        existingEtf.setName(updatedEtf.getName());
        existingEtf.setType(updatedEtf.getType());
        existingEtf.setMarketConcentration(updatedEtf.getMarketConcentration());
        existingEtf.setDomicile(updatedEtf.getDomicile());
        existingEtf.setVolatility(updatedEtf.getVolatility());
        existingEtf.setTicker(updatedEtf.getTicker());
        existingEtf.setYahooFinanceTicker(updatedEtf.getYahooFinanceTicker());
        existingEtf.setTer(updatedEtf.getTer());
        existingEtf.setNotes(updatedEtf.getNotes());

        return etfRepository.save(existingEtf);
    }

    public void deleteEtf(Long id, String userEmail) {
        Etf etf = getEtfById(id, userEmail);
        if (etf == null) {
            throw new ValidationException("etf.not.found");
        }
        if (etf.getTransactions() != null && !etf.getTransactions().isEmpty()) {
            throw new ValidationException("etf.delete.has.transactions");
        }
        etfRepository.delete(id);
    }
}