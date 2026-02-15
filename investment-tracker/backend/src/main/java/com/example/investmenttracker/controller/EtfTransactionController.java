package com.example.investmenttracker.controller;

import com.example.investmenttracker.model.EtfTransaction;
import com.example.investmenttracker.model.TriggerAction;
import com.example.investmenttracker.service.EtfTransactionService;
import com.example.investmenttracker.service.PortfolioSnapshotService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/etfs/{etfId}/transactions")
public class EtfTransactionController {

    private static final Logger logger = LoggerFactory.getLogger(EtfTransactionController.class);

    private final EtfTransactionService transactionService;
    private final PortfolioSnapshotService snapshotService;

    public EtfTransactionController(EtfTransactionService transactionService,
            PortfolioSnapshotService snapshotService) {
        this.transactionService = transactionService;
        this.snapshotService = snapshotService;
    }

    @GetMapping
    public ResponseEntity<List<EtfTransaction>> getAllTransactionsForEtf(@PathVariable Long etfId) {
        List<EtfTransaction> transactions = transactionService.getAllTransactionsForEtf(etfId);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EtfTransaction> getTransactionById(@PathVariable Long id) {
        return transactionService.getTransactionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<EtfTransaction> createTransaction(
            @PathVariable Long etfId,
            @RequestBody EtfTransaction transaction,
            Authentication authentication) {
        EtfTransaction created = transactionService.createTransaction(etfId, transaction);
        createSnapshotSafely(authentication.getName(), TriggerAction.TRANSACTION_ADDED,
                formatTransactionDetails(created));
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EtfTransaction> updateTransaction(
            @PathVariable Long id,
            @RequestBody EtfTransaction transactionDetails,
            Authentication authentication) {
        EtfTransaction updated = transactionService.updateTransaction(id, transactionDetails);
        createSnapshotSafely(authentication.getName(), TriggerAction.TRANSACTION_UPDATED,
                formatTransactionDetails(updated));
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Long id, Authentication authentication) {
        EtfTransaction transaction = transactionService.getTransactionById(id).orElse(null);
        transactionService.deleteTransaction(id);
        String details = transaction != null
                ? String.format("%s: %s %.3f units", transaction.getEtf().getTicker(),
                        transaction.getTransactionType(), transaction.getUnitsPurchased())
                : "Unknown transaction";
        createSnapshotSafely(authentication.getName(), TriggerAction.TRANSACTION_DELETED, details);
        return ResponseEntity.noContent().build();
    }

    private String formatTransactionDetails(EtfTransaction tx) {
        return String.format("%s: %s %.3f units @ %s",
                tx.getEtf().getTicker(), tx.getTransactionType(),
                tx.getUnitsPurchased(), tx.getTransactionDate());
    }

    private void createSnapshotSafely(String userEmail, TriggerAction action, String details) {
        try {
            snapshotService.createSnapshot(userEmail, action, details);
        } catch (Exception e) {
            logger.warn("Failed to create portfolio snapshot for {}: {}", action, e.getMessage());
        }
    }
}
