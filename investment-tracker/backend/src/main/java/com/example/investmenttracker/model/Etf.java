package com.example.investmenttracker.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "etf")
public class Etf {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @Enumerated(EnumType.STRING)
    private ETFPriority priority; // 1,2,3,4 as Enum
    @Enumerated(EnumType.STRING)
    private ETFType type; // Bond, Equity as Enum
    private String globalCoverage; // Ireland, EU, US, Global
    private String domicile; // Ireland, Luxembourg
    private String risk; // Low, Moderate, High, Very High
    @Column(unique = true)
    private String ticker; // unique
    private BigDecimal ter; // Total Expense Ratio
    private String notes; // Free text
    private BigDecimal currentValue;
    private BigDecimal investedAmount;
    @ElementCollection
    @CollectionTable(name = "etf_investments", joinColumns = @JoinColumn(name = "etf_id"))
    private List<Investment> investments = new ArrayList<>();

    public Etf() {
    }

    /************* ✨ Windsurf Command ⭐ *************/
    /**
     * Gets the unique identifier of the ETF.
     *
     * @return the ETF's identifier
     */
    /******* 863ad30c-971c-4e0f-b35d-14fae25f6d00 *******/
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Etf(String name, ETFPriority priority, ETFType type, String globalCoverage, String domicile, String risk,
            String ticker, BigDecimal ter, String notes, BigDecimal currentValue,
            BigDecimal investedAmount) {
        this.name = name;
        this.priority = priority;
        this.type = type;
        this.globalCoverage = globalCoverage;
        this.domicile = domicile;
        this.risk = risk;
        this.ticker = ticker;
        this.ter = ter;
        this.notes = notes;
        this.currentValue = currentValue;
        this.investedAmount = investedAmount;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public ETFPriority getPriority() {
        return priority;
    }

    public void setPriority(ETFPriority priority) {
        this.priority = priority;
    }

    public ETFType getType() {
        return type;
    }

    public void setType(ETFType type) {
        this.type = type;
    }

    public String getGlobalCoverage() {
        return globalCoverage;
    }

    public void setGlobalCoverage(String globalCoverage) {
        this.globalCoverage = globalCoverage;
    }

    public String getDomicile() {
        return domicile;
    }

    public void setDomicile(String domicile) {
        this.domicile = domicile;
    }

    public String getRisk() {
        return risk;
    }

    public void setRisk(String risk) {
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