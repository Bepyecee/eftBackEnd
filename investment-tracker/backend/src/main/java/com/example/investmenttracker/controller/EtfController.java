package com.example.investmenttracker.controller;

import com.example.investmenttracker.model.Etf;
import com.example.investmenttracker.service.EtfService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/etfs")
public class EtfController {

    private final EtfService etfService;

    public EtfController(EtfService etfService) {
        this.etfService = etfService;
    }

    @GetMapping
    public ResponseEntity<List<Etf>> getAllEtfs() {
        return ResponseEntity.ok(etfService.getAllEtfs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Etf> getEtfById(@PathVariable Long id) {
        Etf etf = etfService.getEtfById(id);
        return etf != null ? ResponseEntity.ok(etf) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Etf> createEtf(@RequestBody Etf etf) {
        Etf createdEtf = etfService.createEtf(etf);
        return ResponseEntity.status(201).body(createdEtf);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Etf> updateEtf(@PathVariable Long id, @RequestBody Etf etf) {
        etfService.updateEtf(id, etf);
        Etf updatedEtf = etfService.getEtfById(id);
        return updatedEtf != null ? ResponseEntity.ok(updatedEtf) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEtf(@PathVariable Long id) {
        etfService.deleteEtf(id);
        boolean isDeleted = etfService.getEtfById(id) == null;
        return isDeleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}