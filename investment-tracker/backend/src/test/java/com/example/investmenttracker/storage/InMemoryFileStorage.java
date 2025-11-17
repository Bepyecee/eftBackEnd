package com.example.investmenttracker.storage;

import com.example.investmenttracker.model.Etf;

import java.util.ArrayList;
import java.util.List;

/**
 * Simple in-memory FileStorage substitute for unit tests.
 */
public class InMemoryFileStorage extends FileStorage {
    private final List<Etf> etfs = new ArrayList<>();

    @Override
    public List<Etf> readEtfs() {
        // return a copy to mimic file reads
        return new ArrayList<>(etfs);
    }

    @Override
    public void writeEtfs(List<Etf> newEtfs) {
        etfs.clear();
        if (newEtfs != null) {
            etfs.addAll(newEtfs);
        }
    }
}
