package com.example.investmenttracker.controller;

import com.example.investmenttracker.model.EtfTransaction;
import com.example.investmenttracker.service.EtfTransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/etfs/{etfId}/transactions")
@CrossOrigin(origins = "http://localhost:3000")
public class EtfTransactionController {

    @Autowired
    private EtfTransactionService transactionService;

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
            @RequestBody EtfTransaction transaction) {
        EtfTransaction createdTransaction = transactionService.createTransaction(etfId, transaction);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTransaction);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EtfTransaction> updateTransaction(
            @PathVariable Long id,
            @RequestBody EtfTransaction transactionDetails) {
        EtfTransaction updatedTransaction = transactionService.updateTransaction(id, transactionDetails);
        return ResponseEntity.ok(updatedTransaction);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Long id) {
        transactionService.deleteTransaction(id);
        return ResponseEntity.noContent().build();
    }
}
