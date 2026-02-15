package com.example.investmenttracker.service;

import com.example.investmenttracker.model.Etf;
import com.example.investmenttracker.model.EtfTransaction;
import com.example.investmenttracker.exception.ValidationException;
import com.example.investmenttracker.persistence.EtfRepository;
import com.example.investmenttracker.persistence.EtfTransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class EtfTransactionService {

    private final EtfTransactionRepository transactionRepository;
    private final EtfRepository etfRepository;

    public EtfTransactionService(EtfTransactionRepository transactionRepository, EtfRepository etfRepository) {
        this.transactionRepository = transactionRepository;
        this.etfRepository = etfRepository;
    }

    public List<EtfTransaction> getAllTransactionsForEtf(Long etfId) {
        return transactionRepository.findByEtfIdOrderByTransactionDateDesc(etfId);
    }

    public Optional<EtfTransaction> getTransactionById(Long id) {
        return transactionRepository.findById(id);
    }

    public EtfTransaction createTransaction(Long etfId, EtfTransaction transaction) {
        Etf etf = etfRepository.findById(etfId)
                .orElseThrow(() -> new ValidationException("transaction.etf.not.found", etfId));
        transaction.setEtf(etf);
        return transactionRepository.save(transaction);
    }

    public EtfTransaction updateTransaction(Long id, EtfTransaction transactionDetails) {
        EtfTransaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ValidationException("transaction.not.found", id));

        transaction.setTransactionDate(transactionDetails.getTransactionDate());
        transaction.setTransactionType(transactionDetails.getTransactionType());
        transaction.setUnitsPurchased(transactionDetails.getUnitsPurchased());
        transaction.setTransactionCost(transactionDetails.getTransactionCost());
        transaction.setTransactionFees(transactionDetails.getTransactionFees());

        return transactionRepository.save(transaction);
    }

    public void deleteTransaction(Long id) {
        EtfTransaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ValidationException("transaction.not.found", id));
        transactionRepository.delete(transaction);
    }
}
