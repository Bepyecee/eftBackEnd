package com.example.investmenttracker.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "portfolio_snapshots")
public class PortfolioSnapshot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @Column(nullable = false, unique = true)
    private String versionId; // e.g., "20260101141005"

    @Column(columnDefinition = "TEXT", nullable = false)
    private String portfolioJson;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private String triggerAction; // e.g., "ETF_CREATED", "TRANSACTION_ADDED", "ASSET_UPDATED", "MANUAL_EXPORT"

    public PortfolioSnapshot() {
    }

    public PortfolioSnapshot(User user, String versionId, String portfolioJson, String triggerAction) {
        this.user = user;
        this.versionId = versionId;
        this.portfolioJson = portfolioJson;
        this.triggerAction = triggerAction;
        this.createdAt = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getVersionId() {
        return versionId;
    }

    public void setVersionId(String versionId) {
        this.versionId = versionId;
    }

    public String getPortfolioJson() {
        return portfolioJson;
    }

    public void setPortfolioJson(String portfolioJson) {
        this.portfolioJson = portfolioJson;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getTriggerAction() {
        return triggerAction;
    }

    public void setTriggerAction(String triggerAction) {
        this.triggerAction = triggerAction;
    }
}
