package com.example.investmenttracker.persistence;

import com.example.investmenttracker.model.EtfTransaction;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@ConditionalOnProperty(name = "app.persistence.type", havingValue = "jpa", matchIfMissing = true)
public interface EtfTransactionRepository extends JpaRepository<EtfTransaction, Long> {
    List<EtfTransaction> findByEtfId(Long etfId);

    List<EtfTransaction> findByEtfIdOrderByTransactionDateDesc(Long etfId);
}
