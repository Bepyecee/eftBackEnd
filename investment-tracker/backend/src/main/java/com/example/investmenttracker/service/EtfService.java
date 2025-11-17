package com.example.investmenttracker.service;

import com.example.investmenttracker.model.Etf;
import com.example.investmenttracker.storage.FileStorage;
import com.example.investmenttracker.exception.ResourceConflictException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class EtfService {
    private final FileStorage fileStorage;

    public EtfService(FileStorage fileStorage) {
        this.fileStorage = fileStorage;
    }

    public List<Etf> getAllEtfs() {
        return fileStorage.readEtfs();
    }

    public Etf getEtfById(Long id) {
        return fileStorage.readEtfs().stream()
                .filter(etf -> Objects.equals(etf.getId(), id))
                .findFirst()
                .orElse(null);
    }

    public void addEtf(Etf etf) {
        List<Etf> etfs = fileStorage.readEtfs();
        etfs.add(etf);
        fileStorage.writeEtfs(etfs);
    }

    /**
     * Convenience method used by controllers: create and return the saved ETF.
     * Keeps backward compatibility if callers expect a returned Etf.
     */
    public Etf createEtf(Etf etf) {
        List<Etf> etfs = fileStorage.readEtfs();
        // Check ticker uniqueness (case-insensitive) before assigning id
        if (etf.getTicker() != null && !etf.getTicker().trim().isEmpty()) {
            boolean tickerExists = etfs.stream()
                    .anyMatch(e -> e.getTicker() != null && e.getTicker().equalsIgnoreCase(etf.getTicker()));
            if (tickerExists) {
                throw new ResourceConflictException("Etf with ticker already exists: " + etf.getTicker());
            }
        }

        // If no id provided, assign a new unique id (max existing id + 1)
        if (etf.getId() == null) {
            Long maxId = etfs.stream()
                    .map(Etf::getId)
                    .filter(Objects::nonNull)
                    .max(Long::compareTo)
                    .orElse(0L);
            etf.setId(maxId + 1);
        } else {
            // Ensure provided id is unique — if it already exists, throw
            // ResourceConflictException
            boolean exists = etfs.stream().anyMatch(e -> Objects.equals(e.getId(), etf.getId()));
            if (exists) {
                throw new ResourceConflictException("An Etf with id=" + etf.getId() + " already exists");
            }
        }

        etfs.add(etf);
        fileStorage.writeEtfs(etfs);
        return etf;
    }

    public void updateEtf(Long id, Etf updatedEtf) {
        List<Etf> etfs = fileStorage.readEtfs();
        // Validate ticker uniqueness: another ETF (different id) must not have the same
        // ticker
        if (updatedEtf.getTicker() != null && !updatedEtf.getTicker().trim().isEmpty()) {
            boolean tickerConflict = etfs.stream()
                    .anyMatch(e -> !Objects.equals(e.getId(), id)
                            && e.getTicker() != null
                            && e.getTicker().equalsIgnoreCase(updatedEtf.getTicker()));
            if (tickerConflict) {
                throw new ResourceConflictException(
                        "Etf ticker conflicts with existing ETF: " + updatedEtf.getTicker());
            }
        }
        for (int i = 0; i < etfs.size(); i++) {
            if (Objects.equals(etfs.get(i).getId(), id)) {
                // preserve id on updated object
                updatedEtf.setId(id);
                etfs.set(i, updatedEtf);
                break;
            }
        }
        fileStorage.writeEtfs(etfs);
    }

    public void deleteEtf(Long id) {
        List<Etf> etfs = fileStorage.readEtfs();
        etfs.removeIf(etf -> Objects.equals(etf.getId(), id));
        fileStorage.writeEtfs(etfs);
    }
}