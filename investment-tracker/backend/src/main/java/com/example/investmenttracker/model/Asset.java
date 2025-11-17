package com.example.investmenttracker.model;

public class Asset {
    private Long id;
    private String name;
    private double allocationPercentage;

    public Asset() {
    }

    public Asset(Long id, String name, double allocationPercentage) {
        this.id = id;
        this.name = name;
        this.allocationPercentage = allocationPercentage;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getAllocationPercentage() {
        return allocationPercentage;
    }

    public void setAllocationPercentage(double allocationPercentage) {
        this.allocationPercentage = allocationPercentage;
    }
}