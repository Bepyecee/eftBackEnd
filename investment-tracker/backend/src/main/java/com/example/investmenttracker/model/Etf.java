package com.example.investmenttracker.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "etf")
public class Etf {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ETFType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ETFMarketConcentration marketConcentration;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ETFDomicile domicile;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ETFRisk risk;

    @Column(unique = true, nullable = false)
    private String ticker;

    @Column(nullable = false)
    private BigDecimal ter;

    @Column(nullable = false)
    private BigDecimal fees;

    private String notes;

    @Column(nullable = false)
    private BigDecimal currentValue;

    @Column(nullable = false)
    private BigDecimal investedAmount;

    @Column(nullable = false)
    private LocalDate purchaseDate;

    @Column(nullable = false)
    private BigDecimal unitsPurchased;

    @ElementCollection
    @CollectionTable(name = "etf_investments", joinColumns = @JoinColumn(name = "etf_id"))
    private List<Investment> investments = new ArrayList<>();

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public Etf() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Etf(String name, ETFType type, ETFMarketConcentration marketConcentration, ETFDomicile domicile,
            ETFRisk risk,
            String ticker, BigDecimal ter, BigDecimal fees, String notes, BigDecimal currentValue,
            BigDecimal investedAmount, LocalDate purchaseDate, BigDecimal unitsPurchased) {
        this.name = name;
        this.type = type;
        this.marketConcentration = marketConcentration;
        this.domicile = domicile;
        this.risk = risk;
        this.ticker = ticker;
        this.ter = ter;
        this.fees = fees;
        this.notes = notes;
        this.currentValue = currentValue;
        this.investedAmount = investedAmount;
        this.purchaseDate = purchaseDate;
        this.unitsPurchased = unitsPurchased;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public ETFType getType() {
        return type;
    }

    public void setType(ETFType type) {
        this.type = type;
    }

    public ETFMarketConcentration getMarketConcentration() {
        return marketConcentration;
    }

    public void setMarketConcentration(ETFMarketConcentration marketConcentration) {
        this.marketConcentration = marketConcentration;
    }

    public ETFDomicile getDomicile() {
        return domicile;
    }

    public void setDomicile(ETFDomicile domicile) {
        this.domicile = domicile;
    }

    public ETFRisk getRisk() {
        return risk;
    }

    public void setRisk(ETFRisk risk) {
        this.risk = risk;
    }

    public String getTicker() {
        return ticker;
    }

    public void setTicker(String ticker) {
        this.ticker = ticker;
    }

    public BigDecimal getTer() {
        return ter;
    }

    public void setTer(BigDecimal ter) {
        this.ter = ter;
    }

    public BigDecimal getFees() {
        return fees;
    }

    public void setFees(BigDecimal fees) {
        this.fees = fees;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public BigDecimal getCurrentValue() {
        return currentValue;
    }

    public void setCurrentValue(BigDecimal currentValue) {
        this.currentValue = currentValue;
    }

    public BigDecimal getInvestedAmount() {
        return investedAmount;
    }

    public void setInvestedAmount(BigDecimal investedAmount) {
        this.investedAmount = investedAmount;
    }

    public LocalDate getPurchaseDate() {
        return purchaseDate;
    }

    public void setPurchaseDate(LocalDate purchaseDate) {
        this.purchaseDate = purchaseDate;
    }

    public BigDecimal getUnitsPurchased() {
        return unitsPurchased;
    }

    public void setUnitsPurchased(BigDecimal unitsPurchased) {
        this.unitsPurchased = unitsPurchased;
    }

    public List<Investment> getInvestments() {
        return investments;
    }

    public void setInvestments(List<Investment> investments) {
        this.investments = investments;
    }

    public void addInvestment(BigDecimal amount, String date) {
        Investment investment = new Investment();
        investment.setAmount(amount);
        investment.setDate(date);
        this.investments.add(investment);
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
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

    @Embeddable
    public static class Investment {
        private BigDecimal amount;
        private String date; // ISO 8601 string, e.g. "2024-06-01"

        public BigDecimal getAmount() {
            return amount;
        }

        public void setAmount(BigDecimal amount) {
            this.amount = amount;
        }

        public String getDate() {
            return date;
        }

        public void setDate(String date) {
            this.date = date;
        }
    }
}