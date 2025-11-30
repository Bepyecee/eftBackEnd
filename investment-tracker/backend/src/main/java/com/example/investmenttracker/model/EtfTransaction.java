package com.example.investmenttracker.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "etf_transaction")
public class EtfTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "etf_id", nullable = false)
    private Etf etf;

    @Column(nullable = false)
    private LocalDate transactionDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType transactionType;

    @Column(nullable = false)
    private BigDecimal unitsPurchased;

    @Column(nullable = false)
    private BigDecimal transactionCost;

    @Column(nullable = false)
    private BigDecimal transactionFees;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public EtfTransaction() {
    }

    public EtfTransaction(Etf etf, LocalDate transactionDate, TransactionType transactionType,
            BigDecimal unitsPurchased, BigDecimal transactionCost, BigDecimal transactionFees) {
        this.etf = etf;
        this.transactionDate = transactionDate;
        this.transactionType = transactionType;
        this.unitsPurchased = unitsPurchased;
        this.transactionCost = transactionCost;
        this.transactionFees = transactionFees;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Etf getEtf() {
        return etf;
    }

    public void setEtf(Etf etf) {
        this.etf = etf;
    }

    public LocalDate getTransactionDate() {
        return transactionDate;
    }

    public void setTransactionDate(LocalDate transactionDate) {
        this.transactionDate = transactionDate;
    }

    public TransactionType getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(TransactionType transactionType) {
        this.transactionType = transactionType;
    }

    public BigDecimal getUnitsPurchased() {
        return unitsPurchased;
    }

    public void setUnitsPurchased(BigDecimal unitsPurchased) {
        this.unitsPurchased = unitsPurchased;
    }

    public BigDecimal getTransactionCost() {
        return transactionCost;
    }

    public void setTransactionCost(BigDecimal transactionCost) {
        this.transactionCost = transactionCost;
    }

    public BigDecimal getTransactionFees() {
        return transactionFees;
    }

    public void setTransactionFees(BigDecimal transactionFees) {
        this.transactionFees = transactionFees;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
