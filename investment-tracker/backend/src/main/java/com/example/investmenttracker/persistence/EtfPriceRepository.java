package com.example.investmenttracker.persistence;

import com.example.investmenttracker.model.EtfPrice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EtfPriceRepository extends JpaRepository<EtfPrice, Long> {
    
    Optional<EtfPrice> findByTicker(String ticker);
    
    void deleteByTicker(String ticker);
}
