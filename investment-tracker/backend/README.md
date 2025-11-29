# Investment Tracker Backend

## Overview
The Investment Tracker backend is a Java 21 Spring Boot application that provides REST endpoints to manage ETFs and assets. Data is persisted to files (no external database required).

## Features
- Manage ETFs and assets (CRUD).
- Simple file-based persistence.
- OpenAPI/Swagger UI available for interactive API exploration.

## Project Structure (important files)
```
backend/
├─ pom.xml
├─ src/main/java/com/example/investmenttracker
│  ├─ InvestmentTrackerApplication.java
  ├─ controller/AssetController.java
  ├─ controller/EtfController.java
  ├─ service/
  └─ storage/
└─ src/main/resources/application.properties
```

## Prerequisites
- Java 21 (or a compatible JDK)
- Maven 3.8+

## Build & Run (Maven)
From the `backend` directory run:

```cmd
mvn -U clean package
```

Run the application from the Maven plugin:

```cmd
mvn spring-boot:run
```

Or run the packaged jar:

```cmd
java -jar target\investment-tracker-backend-1.0.0-SNAPSHOT.jar
```

Run tests:

```cmd
mvn -U test
```

## Base URLs
- API base: `http://localhost:8080/api`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`
- Swagger UI: `http://localhost:8080/swagger-ui.html` or `http://localhost:8080/swagger-ui/index.html`

Note: The project includes `springdoc-openapi-starter-webmvc-ui` which serves Swagger UI and the OpenAPI spec.

## REST Endpoints (summary)

Assets
- GET    /api/assets           — List all assets
- GET    /api/assets/{id}      — Get asset by id
- POST   /api/assets           — Create a new asset (JSON body)
- PUT    /api/assets/{id}      — Update an asset (JSON body)
- DELETE /api/assets/{id}      — Delete an asset

ETFs
- GET    /api/etfs             — List all ETFs
- GET    /api/etfs/{id}        — Get ETF by id
- POST   /api/etfs             — Create a new ETF (JSON body)
- PUT    /api/etfs/{id}        — Update an ETF (JSON body)
- DELETE /api/etfs/{id}        — Delete an ETF

Example curl commands

```cmd
curl -v http://localhost:8080/api/etfs

curl -X POST -H "Content-Type: application/json" -d "{\"name\":\"Example ETF\", \"ticker\":\"EXMPL\"}" http://localhost:8080/api/etfs

curl http://localhost:8080/api/assets
```

## Swagger / OpenAPI
After starting the application, open the Swagger UI in your browser:

- `http://localhost:8080/swagger-ui.html`
- or `http://localhost:8080/swagger-ui/index.html` (some environments redirect here)

The raw OpenAPI JSON is served at `http://localhost:8080/v3/api-docs` which tools like `swagger-ui` and Postman can consume.

## Contributing
- Open a branch and submit a PR. Example branch name: `chore/ignore-target`, `feat/add-some-feature`.
- Ensure tests pass: `mvn test`.

## Notes
- The application stores data to files under the project directory; backup any important files before cleaning the workspace.
- If you run into dependency resolution issues, run `mvn -U clean package` to force updates.
