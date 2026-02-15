# Investment Tracker

A full-stack, self-hosted investment tracking application for managing ETF and asset portfolios with real-time price data, tax planning, and secure authentication.

## Quick Start

### Prerequisites

- **Java 21+** and **Maven 3.8+**
- **Node.js 18+** and **npm 9+**

### Start the Application

```bash
# Backend (runs on port 8080)
cd backend
mvn spring-boot:run

# Frontend (runs on port 3000)
cd frontend
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) and log in with `admin` / `abc123`.

## Features

| Area | Description |
|------|-------------|
| **Authentication** | JWT login + Google OAuth2 |
| **ETF Management** | Full CRUD with 13+ fields (priority, type, TER, volatility, domicile, etc.) |
| **Transactions** | Buy/sell tracking per ETF with automatic portfolio snapshots |
| **Asset Tracking** | Manage non-ETF asset allocations |
| **Live Prices** | Yahoo Finance integration with configurable caching |
| **Tax Planning** | Deemed disposal tracker with Excel export |
| **Settings** | Runtime-configurable Yahoo Finance, logging, cache, and tax settings |
| **Themes** | Light and dark mode |
| **Portfolio Versions** | Automatic snapshots on every data change, with export/import |

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Backend** | Java 21, Spring Boot 3.5, Spring Security, JWT (JJWT 0.12.5), Spring Data JPA, H2 / PostgreSQL |
| **Frontend** | React 18, React Router v6, Axios, XLSX.js |
| **Build** | Maven (backend), npm (frontend) |

## Project Structure

```
investment-tracker/
├── backend/                    # Spring Boot REST API
│   ├── src/main/java/…/
│   │   ├── controller/         # REST endpoints
│   │   ├── service/            # Business logic
│   │   ├── model/              # JPA entities & enums
│   │   ├── security/           # JWT, OAuth2, filters
│   │   ├── persistence/        # JPA repositories
│   │   ├── exception/          # Global error handling
│   │   └── config/             # Yahoo Finance, cache config
│   ├── src/main/resources/
│   │   ├── application*.properties  # Profile configs
│   │   ├── messages.properties      # Externalized messages
│   │   └── db/migration/            # Flyway migrations
│   └── pom.xml
├── frontend/                   # React SPA
│   ├── src/
│   │   ├── components/         # UI components
│   │   ├── services/           # API service layer (shared Axios instance)
│   │   ├── constants/          # Externalized UI strings
│   │   └── contexts/           # Theme context
│   └── package.json
└── README.md
```

## Configuration

The backend uses Spring profiles. Active profiles are set in `application.properties`:

| Profile | Purpose | Config File |
|---------|---------|-------------|
| `local` | Local development with dev credentials | `application-local.properties` |
| `dev` | Development defaults | (in `application.properties`) |
| `h2` | H2 file-based database | `application-h2.properties` |
| `postgres` | PostgreSQL database | `application-postgres.properties` |

### Key Configuration

| Property | Default | Description |
|----------|---------|-------------|
| `yahoo.finance.timeout` | `10` | API timeout in seconds |
| `yahoo.finance.cache-expiration-minutes` | `30` | Price cache TTL |
| `tax.etf-exit-tax-percentage` | `38.0` | Exit tax rate for deemed disposal |
| `jwt.secret` | (in local config) | JWT signing key |

### Environment Variables (Frontend)

| Variable | Default | Description |
|----------|---------|-------------|
| `REACT_APP_API_URL` | `http://localhost:8080/api` | Backend API base URL |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/login` | Authenticate and get JWT |
| `GET/POST/PUT/DELETE` | `/api/etfs` | ETF CRUD |
| `GET/POST/PUT/DELETE` | `/api/etfs/{id}/transactions` | Transaction CRUD |
| `GET/POST/PUT/DELETE` | `/api/assets` | Asset CRUD |
| `GET/POST` | `/api/etf-prices` | Price fetching and refresh |
| `GET/PUT` | `/api/settings` | Application settings |
| `GET/POST/DELETE` | `/api/portfolio/snapshots` | Portfolio version management |
| `GET` | `/api/user/me` | Current user info |

Full API docs available at [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html) when the backend is running.

## Development

### Backend

```bash
cd backend
mvn test              # Run tests
mvn spring-boot:run   # Start with hot reload
```

### Frontend

```bash
cd frontend
npm test              # Run tests
npm start             # Start dev server with hot reload
```

### Architecture Principles

- **Constructor injection** — all Spring beans use constructor-based DI
- **Externalized strings** — backend uses `messages.properties`; frontend uses `constants/messages.js`
- **Shared HTTP client** — all frontend services use a single Axios instance with automatic JWT injection and 401 handling
- **Global error handling** — `GlobalExceptionHandler` maps exceptions to consistent API error responses
- **Profile-based config** — environment-specific settings via Spring profiles

## Troubleshooting

| Issue | Solution |
|-------|----------|
| H2 database lock error | Kill any lingering Java processes: `jps -l` then `taskkill /PID <pid> /F` |
| Port 3000 in use | Kill the process: `netstat -ano \| findstr :3000` then `taskkill /PID <pid> /F` |
| JWT expired errors | Re-login; the filter gracefully handles expired tokens with a 401 response |
| CORS errors | CORS is configured globally in `SecurityConfig.java` for `localhost:3000` |
