package com.example.investmenttracker.persistence;

import com.example.investmenttracker.model.EtfTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EtfTransactionRepository extends JpaRepository<EtfTransaction, Long> {
    List<EtfTransaction> findByEtfId(Long etfId);

    List<EtfTransaction> findByEtfIdOrderByTransactionDateDesc(Long etfId);
}
