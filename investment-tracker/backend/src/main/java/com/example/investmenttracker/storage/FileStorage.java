package com.example.investmenttracker.storage;

import com.example.investmenttracker.model.Etf;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@Component
public class FileStorage {
    private static final String ASSET_FILE = "assets.json";
    private static final String ETF_FILE = "etfs.json";

    private final ObjectMapper objectMapper;

    public FileStorage() {
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
        this.objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    }

    // Keep asset methods as simple string-list helpers for now
    public List<String> readAssets() {
        return readFromFile(ASSET_FILE);
    }

    public void writeAssets(List<String> assets) {
        writeToFile(ASSET_FILE, assets);
    }

    // JSON-based ETF storage
    public List<Etf> readEtfs() {
        Path path = Paths.get(ETF_FILE);
        if (!Files.exists(path)) {
            return new ArrayList<>();
        }
        try {
            String json = Files.readString(path);
            if (json == null || json.trim().isEmpty()) {
                return new ArrayList<>();
            }
            return objectMapper.readValue(json, new TypeReference<List<Etf>>() {
            });
        } catch (IOException e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    public void writeEtfs(List<Etf> etfs) {
        Path path = Paths.get(ETF_FILE);
        try {
            String json = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(etfs);
            Files.writeString(path, json);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private List<String> readFromFile(String fileName) {
        Path path = Paths.get(fileName);
        try {
            if (!Files.exists(path))
                return new ArrayList<>();
            return Files.readAllLines(path);
        } catch (IOException e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    private void writeToFile(String fileName, List<String> lines) {
        Path path = Paths.get(fileName);
        try {
            Files.write(path, lines);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}