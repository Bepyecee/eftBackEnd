package com.example.investmenttracker.controller;

import com.example.investmenttracker.model.EtfTransaction;
import com.example.investmenttracker.service.EtfTransactionService;
import com.example.investmenttracker.service.PortfolioSnapshotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/etfs/{etfId}/transactions")
@CrossOrigin(origins = "http://localhost:3000")
public class EtfTransactionController {

    @Autowired
    private EtfTransactionService transactionService;

    @Autowired
    private PortfolioSnapshotService snapshotService;

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
        EtfTransaction createdTransaction = transactionService.createTransaction(etfId, transaction);

        // Create portfolio snapshot
        try {
            String userEmail = authentication.getName();
            snapshotService.createSnapshot(userEmail, "TRANSACTION_ADDED");
        } catch (Exception e) {
            // Log but don't fail the transaction creation
            System.err.println("Failed to create portfolio snapshot: " + e.getMessage());
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(createdTransaction);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EtfTransaction> updateTransaction(
            @PathVariable Long id,
            @RequestBody EtfTransaction transactionDetails,
            Authentication authentication) {
        EtfTransaction updatedTransaction = transactionService.updateTransaction(id, transactionDetails);

        // Create portfolio snapshot
        try {
            String userEmail = authentication.getName();
            snapshotService.createSnapshot(userEmail, "TRANSACTION_UPDATED");
        } catch (Exception e) {
            System.err.println("Failed to create portfolio snapshot: " + e.getMessage());
        }

        return ResponseEntity.ok(updatedTransaction);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Long id, Authentication authentication) {
        transactionService.deleteTransaction(id);

        // Create portfolio snapshot
        try {
            String userEmail = authentication.getName();
            snapshotService.createSnapshot(userEmail, "TRANSACTION_DELETED");
        } catch (Exception e) {
            System.err.println("Failed to create portfolio snapshot: " + e.getMessage());
        }

        return ResponseEntity.noContent().build();
    }
}
