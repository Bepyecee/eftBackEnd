package com.example.investmenttracker.service;

import com.example.investmenttracker.exception.ResourceConflictException;
import com.example.investmenttracker.model.Etf;
import com.example.investmenttracker.model.ETFType;
import com.example.investmenttracker.model.User;
import com.example.investmenttracker.persistence.FileEtfRepository;
import com.example.investmenttracker.storage.InMemoryFileStorage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

public class EtfServiceTest {

    private InMemoryFileStorage storage;
    private FileEtfRepository repository;
    private UserService userService;
    private EtfService service;
    private static final String TEST_USER_EMAIL = "test@example.com";

    @BeforeEach
    public void setup() {
        storage = new InMemoryFileStorage();
        repository = new FileEtfRepository(storage);
        userService = Mockito.mock(UserService.class);

        // Mock user service to return a test user
        User testUser = new User();
        testUser.setId(1L);
        testUser.setEmail(TEST_USER_EMAIL);
        testUser.setName("Test User");
        testUser.setProvider("local");

        when(userService.getCurrentUser(anyString())).thenReturn(testUser);
        when(userService.findOrCreateUser(anyString(), anyString(), anyString())).thenReturn(testUser);

        service = new EtfService(repository, userService);
    }

    private Etf sampleEtf(String ticker, Long id) {
        Etf e = new Etf();
        e.setTicker(ticker);
        e.setName("Sample");
        e.setType(ETFType.EQUITY);
        e.setTer(new BigDecimal("0.10"));
        e.setId(id);
        return e;
    }

    @Test
    public void createAssignsIdWhenMissing() {
        Etf toCreate = sampleEtf("AAA", null);
        Etf created = service.createEtf(toCreate, TEST_USER_EMAIL);
        assertNotNull(created.getId(), "ID should be assigned");
        assertEquals(1L, created.getId());
        List<Etf> all = service.getAllEtfs(TEST_USER_EMAIL);
        assertEquals(1, all.size());
    }

    @Test
    public void createThrowsOnDuplicateTicker() {
        Etf existing = sampleEtf("BBB", 1L);
        storage.writeEtfs(List.of(existing));

        Etf newOne = sampleEtf("BBB", null);
        assertThrows(ResourceConflictException.class, () -> service.createEtf(newOne, TEST_USER_EMAIL));
    }

    @Test
    public void createThrowsOnDuplicateId() {
        Etf existing = sampleEtf("CCC", 5L);
        storage.writeEtfs(List.of(existing));

        Etf newOne = sampleEtf("DDD", 5L); // same id
        assertThrows(ResourceConflictException.class, () -> service.createEtf(newOne, TEST_USER_EMAIL));
    }

    @Test
    public void updateThrowsOnTickerConflict() {
        Etf a = sampleEtf("A", 1L);
        Etf b = sampleEtf("B", 2L);
        storage.writeEtfs(List.of(a, b));

        Etf updatedB = sampleEtf("A", null); // change ticker to A which conflicts with id 1
        assertThrows(ResourceConflictException.class, () -> service.updateEtf(2L, updatedB, TEST_USER_EMAIL));
    }

    @Test
    public void deleteRemovesEtf() {
        Etf e = sampleEtf("Z", null);
        Etf created = service.createEtf(e, TEST_USER_EMAIL);
        Long id = created.getId();
        service.deleteEtf(id, TEST_USER_EMAIL);
        assertNull(service.getEtfById(id, TEST_USER_EMAIL));
    }
}
