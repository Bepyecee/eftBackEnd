package com.example.investmenttracker.persistence;

import com.example.investmenttracker.model.Etf;
import com.example.investmenttracker.storage.FileStorage;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

/**
 * File-based ETF repository (dev profile: file).
 * Wraps the existing FileStorage implementation.
 */
@Component
@ConditionalOnProperty(name = "app.persistence.type", havingValue = "file")
public class FileEtfRepository implements EtfRepository {
    private final FileStorage fileStorage;

    public FileEtfRepository(FileStorage fileStorage) {
        this.fileStorage = fileStorage;
    }

    @Override
    public List<Etf> findAll() {
        return fileStorage.readEtfs();
    }

    @Override
    public Optional<Etf> findById(Long id) {
        return fileStorage.readEtfs().stream()
                .filter(etf -> Objects.equals(etf.getId(), id))
                .findFirst();
    }

    @Override
    public Etf save(Etf etf) {
        List<Etf> etfs = fileStorage.readEtfs();
        if (etf.getId() != null) {
            etfs.removeIf(e -> Objects.equals(e.getId(), etf.getId()));
        } else {
            Long maxId = etfs.stream()
                    .map(Etf::getId)
                    .filter(Objects::nonNull)
                    .max(Long::compareTo)
                    .orElse(0L);
            etf.setId(maxId + 1);
        }
        etfs.add(etf);
        fileStorage.writeEtfs(etfs);
        return etf;
    }

    @Override
    public void delete(Long id) {
        List<Etf> etfs = fileStorage.readEtfs();
        etfs.removeIf(e -> Objects.equals(e.getId(), id));
        fileStorage.writeEtfs(etfs);
    }

    @Override
    public boolean existsById(Long id) {
        return fileStorage.readEtfs().stream()
                .anyMatch(e -> Objects.equals(e.getId(), id));
    }
}
