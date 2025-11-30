package com.example.investmenttracker.service;

import com.example.investmenttracker.model.Etf;
import com.example.investmenttracker.model.EtfTransaction;
import com.example.investmenttracker.persistence.EtfRepository;
import com.example.investmenttracker.persistence.EtfTransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class EtfTransactionService {

    @Autowired
    private EtfTransactionRepository transactionRepository;

    @Autowired
    private EtfRepository etfRepository;

    public List<EtfTransaction> getAllTransactionsForEtf(Long etfId) {
        return transactionRepository.findByEtfIdOrderByTransactionDateDesc(etfId);
    }

    public Optional<EtfTransaction> getTransactionById(Long id) {
        return transactionRepository.findById(id);
    }

    public EtfTransaction createTransaction(Long etfId, EtfTransaction transaction) {
        Etf etf = etfRepository.findById(etfId)
                .orElseThrow(() -> new RuntimeException("ETF not found with id: " + etfId));

        transaction.setEtf(etf);
        return transactionRepository.save(transaction);
    }

    public EtfTransaction updateTransaction(Long id, EtfTransaction transactionDetails) {
        EtfTransaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found with id: " + id));

        transaction.setTransactionDate(transactionDetails.getTransactionDate());
        transaction.setTransactionType(transactionDetails.getTransactionType());
        transaction.setUnitsPurchased(transactionDetails.getUnitsPurchased());
        transaction.setTransactionCost(transactionDetails.getTransactionCost());
        transaction.setTransactionFees(transactionDetails.getTransactionFees());

        return transactionRepository.save(transaction);
    }

    public void deleteTransaction(Long id) {
        EtfTransaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found with id: " + id));
        transactionRepository.delete(transaction);
    }
}
