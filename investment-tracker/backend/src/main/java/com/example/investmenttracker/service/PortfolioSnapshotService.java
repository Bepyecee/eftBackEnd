package com.example.investmenttracker.service;

import com.example.investmenttracker.model.PortfolioSnapshot;
import com.example.investmenttracker.model.TriggerAction;
import com.example.investmenttracker.model.User;
import com.example.investmenttracker.persistence.PortfolioSnapshotRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class PortfolioSnapshotService {

    private static final Logger logger = LoggerFactory.getLogger(PortfolioSnapshotService.class);
    private static final String VERSION_FORMAT = "yyyyMMddHHmmss";

    private final PortfolioSnapshotRepository snapshotRepository;
    private final UserService userService;
    private final EtfService etfService;
    private final AssetService assetService;
    private final ObjectMapper objectMapper;

    public PortfolioSnapshotService(PortfolioSnapshotRepository snapshotRepository,
                                     UserService userService,
                                     EtfService etfService,
                                     AssetService assetService,
                                     ObjectMapper objectMapper) {
        this.snapshotRepository = snapshotRepository;
        this.userService = userService;
        this.etfService = etfService;
        this.assetService = assetService;
        this.objectMapper = objectMapper;
    }

    /**
     * Generate a version identifier timestamp
     */
    public String generateVersionId() {
        return LocalDateTime.now().format(DateTimeFormatter.ofPattern(VERSION_FORMAT));
    }

    /**
     * Create and save a portfolio snapshot
     */
    public PortfolioSnapshot createSnapshot(String userEmail, TriggerAction triggerAction, String changeDetails) {
        User user = userService.getCurrentUser(userEmail);
        String versionId = generateVersionId();

        try {
            Map<String, Object> portfolioData = buildPortfolioData(userEmail);
            String portfolioJson = objectMapper.writeValueAsString(portfolioData);

            PortfolioSnapshot snapshot = new PortfolioSnapshot(user, versionId, portfolioJson, triggerAction,
                    changeDetails);
            return snapshotRepository.save(snapshot);
        } catch (Exception e) {
            logger.error("Failed to create portfolio snapshot for user {}: {}", userEmail, e.getMessage());
            throw new RuntimeException("snapshot.failed", e);
        }
    }

    /**
     * Create a snapshot with a specific version ID (for manual exports)
     */
    public PortfolioSnapshot createSnapshotWithVersionId(String userEmail, String versionId, String portfolioJson,
            TriggerAction triggerAction, String changeDetails) {
        User user = userService.getCurrentUser(userEmail);

        // Check if version already exists
        if (snapshotRepository.findByVersionId(versionId).isPresent()) {
            // Update existing
            PortfolioSnapshot existing = snapshotRepository.findByVersionId(versionId).get();
            existing.setPortfolioJson(portfolioJson);
            existing.setTriggerAction(triggerAction);
            existing.setChangeDetails(changeDetails);
            return snapshotRepository.save(existing);
        }

        PortfolioSnapshot snapshot = new PortfolioSnapshot(user, versionId, portfolioJson, triggerAction,
                changeDetails);
        return snapshotRepository.save(snapshot);
    }

    /**
     * Get all snapshots for a user
     */
    public List<PortfolioSnapshot> getUserSnapshots(String userEmail) {
        User user = userService.getCurrentUser(userEmail);
        return snapshotRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    /**
     * Get a specific snapshot by ID
     */
    public PortfolioSnapshot getSnapshotById(Long id, String userEmail) {
        User user = userService.getCurrentUser(userEmail);
        return snapshotRepository.findByIdAndUserId(id, user.getId()).orElse(null);
    }

    /**
     * Get a snapshot by version ID
     */
    public PortfolioSnapshot getSnapshotByVersionId(String versionId) {
        return snapshotRepository.findByVersionId(versionId).orElse(null);
    }

    /**
     * Build portfolio data for snapshot
     */
    private Map<String, Object> buildPortfolioData(String userEmail) {
        Map<String, Object> data = new HashMap<>();

        // Get all ETFs with their transactions
        data.put("etfs", etfService.getAllEtfs(userEmail));

        // Get all assets
        data.put("assets", assetService.getAllAssets(userEmail));

        // Add metadata
        Map<String, Object> metadata = new HashMap<>();
        metadata.put("userEmail", userEmail);
        metadata.put("timestamp", LocalDateTime.now().toString());
        data.put("metadata", metadata);

        return data;
    }

    /**
     * Delete a snapshot
     */
    public void deleteSnapshot(Long id, String userEmail) {
        User user = userService.getCurrentUser(userEmail);
        snapshotRepository.findByIdAndUserId(id, user.getId())
                .ifPresent(snapshotRepository::delete);
    }
}
