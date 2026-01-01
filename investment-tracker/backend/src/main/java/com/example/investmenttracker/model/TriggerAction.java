package com.example.investmenttracker.model;

public enum TriggerAction {
    ETF_CREATED("ETF Created"),
    ETF_UPDATED("ETF Updated"),
    ETF_DELETED("ETF Deleted"),
    TRANSACTION_ADDED("Transaction Added"),
    TRANSACTION_UPDATED("Transaction Updated"),
    TRANSACTION_DELETED("Transaction Deleted"),
    ASSET_CREATED("Asset Created"),
    ASSET_UPDATED("Asset Updated"),
    ASSET_DELETED("Asset Deleted"),
    MANUAL_EXPORT("Manual Export");

    private final String displayName;

    TriggerAction(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
