# Investment Tracker — Backend

Spring Boot REST API for managing ETF portfolios, assets, transactions, and live price data.

## Quick Start

```bash
mvn spring-boot:run
# API available at http://localhost:8080/api
# Swagger UI at http://localhost:8080/swagger-ui.html
```

Default credentials: `admin` / `abc123`

## Architecture

| Layer | Responsibility |
|-------|---------------|
| `controller/` | REST endpoints — delegates to services, returns HTTP responses |
| `service/` | Business logic — validation, orchestration |
| `model/` | JPA entities, enums, DTOs |
| `persistence/` | Spring Data JPA repositories |
| `security/` | JWT authentication, OAuth2, request filters |
| `exception/` | Global error handling with `@ControllerAdvice` |
| `config/` | Yahoo Finance properties, cache configuration |

### Key Design Decisions

- **Constructor injection** everywhere — no `@Autowired` field injection
- **Externalized messages** — all user-facing strings in `messages.properties`
- **Profile-based config** — `local`, `dev`, `h2`, `postgres` profiles
- **Global CORS** — configured in `SecurityConfig`, not per-controller

## Configuration

| File | Purpose |
|------|---------|
| `application.properties` | Server port, active profiles, JWT config |
| `application-local.properties` | Local overrides (dev credentials, DB path) |
| `application-h2.properties` | H2 file-based database |
| `application-postgres.properties` | PostgreSQL connection |
| `messages.properties` | All error/success message strings |

## API Overview

| Endpoint | Methods | Description |
|----------|---------|-------------|
| `/api/auth/login` | POST | JWT authentication |
| `/api/etfs` | GET, POST, PUT, DELETE | ETF management |
| `/api/etfs/{id}/transactions` | GET, POST, PUT, DELETE | Transaction management |
| `/api/assets` | GET, POST, PUT, DELETE | Asset management |
| `/api/etf-prices` | GET, POST | Yahoo Finance price data |
| `/api/settings` | GET, PUT | Application settings |
| `/api/portfolio/snapshots` | GET, POST, DELETE | Portfolio versioning |

## Error Format

```json
{
  "timestamp": "2025-01-15T10:00:00Z",
  "status": 409,
  "error": "Conflict",
  "message": "An ETF with ticker ABC already exists.",
  "path": "/api/etfs"
}
```

## Running Tests

```bash
mvn test
```
