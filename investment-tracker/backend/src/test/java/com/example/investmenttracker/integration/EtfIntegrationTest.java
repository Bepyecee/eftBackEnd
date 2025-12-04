package com.example.investmenttracker.integration;

import com.example.investmenttracker.config.TestSecurityConfig;
import com.example.investmenttracker.model.Etf;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.TestPropertySource;

// ...existing code...

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Import(TestSecurityConfig.class)
@TestPropertySource(properties = {
                "spring.datasource.url=jdbc:h2:mem:testdb",
                "spring.jpa.hibernate.ddl-auto=create-drop",
                "spring.profiles.active=test"
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

                String payload = "{\"ticker\":\"INT-TEST\",\"name\":\"Integration Test ETF\",\"type\":\"EQUITY\"," +
                                "\"marketConcentration\":\"GLOBAL_DEVELOPED\",\"domicile\":\"IRELAND\"," +
                                "\"volatility\":\"HIGH\",\"ter\":0.10}";

                HttpEntity<String> request = new HttpEntity<>(payload, headers);

                ResponseEntity<Etf> resp = restTemplate.postForEntity(url, request, Etf.class);

                System.out.println("Response status: " + resp.getStatusCode());
                System.out.println("Response body: " + resp.getBody());

                assertThat(resp.getStatusCode().is2xxSuccessful())
                                .as("Expected 2xx status but got: " + resp.getStatusCode())
                                .isTrue();
                Etf body = resp.getBody();
                assertThat(body)
                                .as("Response body should not be null")
                                .isNotNull();
                if (body != null) {
                        assertThat(body.getId()).isNotNull();
                        assertThat(body.getTicker()).isEqualTo("INT-TEST");
                }
        }
}
