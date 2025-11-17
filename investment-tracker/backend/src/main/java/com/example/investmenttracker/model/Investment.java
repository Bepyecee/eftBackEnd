package com.example.investmenttracker.model;

public class Investment {
    private String id;
    private String name;
    private double amount;
    private double interestRate;
    private int term;
    private String type;

    public Investment(String id, String name, double amount, double interestRate, int term, String type) {
        this.id = id;
        this.name = name;
        this.amount = amount;
        this.interestRate = interestRate;
        this.term = term;
        this.type = type;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public double getInterestRate() {
        return interestRate;
    }

    public void setInterestRate(double interestRate) {
        this.interestRate = interestRate;
    }

    public int getTerm() {
        return term;
    }

    public void setTerm(int term) {
        this.term = term;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}