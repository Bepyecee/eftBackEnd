package com.example.investmenttracker.service;

import com.example.investmenttracker.exception.ResourceConflictException;
import com.example.investmenttracker.model.Etf;
import com.example.investmenttracker.model.ETFType;
import com.example.investmenttracker.persistence.FileEtfRepository;
import com.example.investmenttracker.storage.InMemoryFileStorage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class EtfServiceTest {

    private InMemoryFileStorage storage;
    private FileEtfRepository repository;
    private EtfService service;

    @BeforeEach
    public void setup() {
        storage = new InMemoryFileStorage();
        repository = new FileEtfRepository(storage);
        service = new EtfService(repository);
    }

    private Etf sampleEtf(String ticker, Long id) {
        Etf e = new Etf();
        e.setTicker(ticker);
        e.setName("Sample");
        e.setType(ETFType.EQUITY);
        e.setTer(new BigDecimal("0.10"));
        e.setInvestedAmount(new BigDecimal("1000"));
        e.setCurrentValue(new BigDecimal("1100"));
        e.setId(id);
        return e;
    }

    @Test
    public void createAssignsIdWhenMissing() {
        Etf toCreate = sampleEtf("AAA", null);
        Etf created = service.createEtf(toCreate);
        assertNotNull(created.getId(), "ID should be assigned");
        assertEquals(1L, created.getId());
        List<Etf> all = service.getAllEtfs();
        assertEquals(1, all.size());
    }

    @Test
    public void createThrowsOnDuplicateTicker() {
        Etf existing = sampleEtf("BBB", 1L);
        storage.writeEtfs(List.of(existing));

        Etf newOne = sampleEtf("BBB", null);
        assertThrows(ResourceConflictException.class, () -> service.createEtf(newOne));
    }

    @Test
    public void createThrowsOnDuplicateId() {
        Etf existing = sampleEtf("CCC", 5L);
        storage.writeEtfs(List.of(existing));

        Etf newOne = sampleEtf("DDD", 5L); // same id
        assertThrows(ResourceConflictException.class, () -> service.createEtf(newOne));
    }

    @Test
    public void updateThrowsOnTickerConflict() {
        Etf a = sampleEtf("A", 1L);
        Etf b = sampleEtf("B", 2L);
        storage.writeEtfs(List.of(a, b));

        Etf updatedB = sampleEtf("A", null); // change ticker to A which conflicts with id 1
        assertThrows(ResourceConflictException.class, () -> service.updateEtf(2L, updatedB));
    }

    @Test
    public void deleteRemovesEtf() {
        Etf e = sampleEtf("Z", null);
        Etf created = service.createEtf(e);
        Long id = created.getId();
        service.deleteEtf(id);
        assertNull(service.getEtfById(id));
    }
}
