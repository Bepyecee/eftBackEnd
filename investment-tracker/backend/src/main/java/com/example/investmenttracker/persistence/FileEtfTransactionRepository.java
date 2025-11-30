package com.example.investmenttracker.persistence;

import com.example.investmenttracker.model.Etf;
import com.example.investmenttracker.model.EtfTransaction;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.repository.query.FluentQuery;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * File-based ETF Transaction repository.
 * Stores transactions within the ETF objects in the file.
 */
@Component
@ConditionalOnProperty(name = "app.persistence.type", havingValue = "file")
public class FileEtfTransactionRepository implements EtfTransactionRepository {

    private final EtfRepository etfRepository;
    private Long nextId = 1L;

    public FileEtfTransactionRepository(EtfRepository etfRepository) {
        this.etfRepository = etfRepository;
        // Initialize nextId based on existing transactions
        List<Etf> etfs = etfRepository.findAll();
        for (Etf etf : etfs) {
            if (etf.getTransactions() != null) {
                for (EtfTransaction tx : etf.getTransactions()) {
                    if (tx.getId() != null && tx.getId() >= nextId) {
                        nextId = tx.getId() + 1;
                    }
                }
            }
        }
    }

    @Override
    public List<EtfTransaction> findByEtfId(Long etfId) {
        return etfRepository.findById(etfId)
                .map(Etf::getTransactions)
                .orElse(List.of());
    }

    @Override
    public List<EtfTransaction> findByEtfIdOrderByTransactionDateDesc(Long etfId) {
        return etfRepository.findById(etfId)
                .map(etf -> etf.getTransactions().stream()
                        .sorted((t1, t2) -> t2.getTransactionDate().compareTo(t1.getTransactionDate()))
                        .collect(java.util.stream.Collectors.toList()))
                .orElse(List.of());
    }

    @Override
    public <S extends EtfTransaction> S save(S transaction) {
        if (transaction.getEtf() == null || transaction.getEtf().getId() == null) {
            throw new IllegalArgumentException("Transaction must be associated with an ETF");
        }

        Long etfId = transaction.getEtf().getId();
        Etf etf = etfRepository.findById(etfId)
                .orElseThrow(() -> new IllegalArgumentException("ETF not found: " + etfId));

        if (transaction.getId() == null) {
            transaction.setId(nextId++);
            etf.getTransactions().add(transaction);
        } else {
            // Update existing transaction
            etf.getTransactions().removeIf(t -> t.getId().equals(transaction.getId()));
            etf.getTransactions().add(transaction);
        }

        etfRepository.save(etf);
        return transaction;
    }

    @Override
    public Optional<EtfTransaction> findById(Long id) {
        return etfRepository.findAll().stream()
                .flatMap(etf -> etf.getTransactions().stream())
                .filter(tx -> tx.getId() != null && tx.getId().equals(id))
                .findFirst();
    }

    @Override
    public void deleteById(Long id) {
        for (Etf etf : etfRepository.findAll()) {
            if (etf.getTransactions().removeIf(tx -> tx.getId() != null && tx.getId().equals(id))) {
                etfRepository.save(etf);
                break;
            }
        }
    }

    @Override
    public List<EtfTransaction> findAll() {
        return etfRepository.findAll().stream()
                .flatMap(etf -> etf.getTransactions().stream())
                .collect(Collectors.toList());
    }

    // Unsupported JPA methods - throw exceptions
    @Override
    public boolean existsById(Long id) {
        return findById(id).isPresent();
    }

    @Override
    public long count() {
        return findAll().size();
    }

    @Override
    public void delete(EtfTransaction entity) {
        if (entity.getId() != null) {
            deleteById(entity.getId());
        }
    }

    @Override
    public void deleteAllById(Iterable<? extends Long> ids) {
        ids.forEach(this::deleteById);
    }

    @Override
    public void deleteAll(Iterable<? extends EtfTransaction> entities) {
        entities.forEach(this::delete);
    }

    @Override
    public void deleteAll() {
        throw new UnsupportedOperationException("DeleteAll not supported in file-based storage");
    }

    @Override
    public <S extends EtfTransaction> List<S> saveAll(Iterable<S> entities) {
        entities.forEach(this::save);
        return (List<S>) entities;
    }

    @Override
    public List<EtfTransaction> findAllById(Iterable<Long> ids) {
        throw new UnsupportedOperationException("FindAllById not supported in file-based storage");
    }

    @Override
    public void flush() {
        // No-op for file-based storage
    }

    @Override
    public <S extends EtfTransaction> S saveAndFlush(S entity) {
        return save(entity);
    }

    @Override
    public <S extends EtfTransaction> List<S> saveAllAndFlush(Iterable<S> entities) {
        return saveAll(entities);
    }

    @Override
    public void deleteAllInBatch(Iterable<EtfTransaction> entities) {
        deleteAll(entities);
    }

    @Override
    public void deleteAllByIdInBatch(Iterable<Long> ids) {
        deleteAllById(ids);
    }

    @Override
    public void deleteAllInBatch() {
        deleteAll();
    }

    @Override
    public EtfTransaction getOne(Long id) {
        return findById(id).orElse(null);
    }

    @Override
    public EtfTransaction getById(Long id) {
        return findById(id).orElse(null);
    }

    @Override
    public EtfTransaction getReferenceById(Long id) {
        return findById(id).orElse(null);
    }

    @Override
    public <S extends EtfTransaction> Optional<S> findOne(Example<S> example) {
        throw new UnsupportedOperationException("findOne with Example not supported");
    }

    @Override
    public <S extends EtfTransaction> List<S> findAll(Example<S> example) {
        throw new UnsupportedOperationException("findAll with Example not supported");
    }

    @Override
    public <S extends EtfTransaction> List<S> findAll(Example<S> example, Sort sort) {
        throw new UnsupportedOperationException("findAll with Example and Sort not supported");
    }

    @Override
    public <S extends EtfTransaction> Page<S> findAll(Example<S> example, Pageable pageable) {
        throw new UnsupportedOperationException("findAll with Example and Pageable not supported");
    }

    @Override
    public <S extends EtfTransaction> long count(Example<S> example) {
        throw new UnsupportedOperationException("count with Example not supported");
    }

    @Override
    public <S extends EtfTransaction> boolean exists(Example<S> example) {
        throw new UnsupportedOperationException("exists with Example not supported");
    }

    @Override
    public <S extends EtfTransaction, R> R findBy(Example<S> example,
            Function<FluentQuery.FetchableFluentQuery<S>, R> queryFunction) {
        throw new UnsupportedOperationException("findBy not supported");
    }

    @Override
    public List<EtfTransaction> findAll(Sort sort) {
        throw new UnsupportedOperationException("findAll with Sort not supported");
    }

    @Override
    public Page<EtfTransaction> findAll(Pageable pageable) {
        throw new UnsupportedOperationException("findAll with Pageable not supported");
    }
}
