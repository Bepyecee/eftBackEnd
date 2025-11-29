package com.example.investmenttracker.integration;

import com.example.investmenttracker.model.Etf;
import com.example.investmenttracker.model.ETFType;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.TestPropertySource;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestPropertySource(properties = {
        "spring.datasource.url=jdbc:h2:mem:testdb",
        "spring.jpa.hibernate.ddl-auto=create-drop"
})
public class EtfIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    public void postCreatesEtf() {
        String url = "http://localhost:" + port + "/api/etfs";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String payload = "{\"ticker\":\"INT-TEST\",\"type\":\"EQUITY\"}";

        HttpEntity<String> request = new HttpEntity<>(payload, headers);

        ResponseEntity<Etf> resp = restTemplate.postForEntity(url, request, Etf.class);

        assertThat(resp.getStatusCode().is2xxSuccessful()).isTrue();
        Etf body = resp.getBody();
        assertThat(body).isNotNull();
        assertThat(body.getId()).isNotNull();
        assertThat(body.getTicker()).isEqualTo("INT-TEST");
    }
}
