# Investment Tracker Backend

## Overview
This is the backend for a simple self-hosted Investment Tracker written with Java 21 and Spring Boot.
It exposes REST endpoints to manage ETFs and assets. Persistence is file-based by default (see `etfs.json`).

## Key Behaviors
- Validation: ETFs require `ticker` and `type` fields. Missing required fields return HTTP 400 with a structured `ApiError` JSON payload.
- Conflicts: Attempts to create or update an ETF that violates uniqueness (duplicate ticker or id) return HTTP 409 with a helpful message.
- Messages: Error text is externalized in `src/main/resources/messages.properties` and resolved by the application's `MessageSource`.

## Storage
- Default storage file: `etfs.json` in the backend working directory (`c:\Gav\workspaces\itr\investment-tracker\backend\etfs.json` when running from this repo).
- The `FileStorage` component reads/writes this file as a JSON array. Consider switching to H2 or adding audit fields for production use.

## Error format
When an error occurs the API returns JSON like:

```
{
  "timestamp": "2025-11-29T15:00:00Z",
  "status": 409,
  "error": "Conflict",
  "message": "An ETF with ticker ABC already exists.",
  "path": "/api/etfs"
}
```

## Running locally (Maven)
1. Build:

```bash
cd backend
mvn -U package
```

2. Run:

```bash
mvn spring-boot:run
```

3. Run tests:

```bash
mvn -U test
```

## Validation rules (ETFs)
- `ticker` — required (non-empty string).
- `type` — required (enum: `BOND` or `EQUITY`).
- Duplicate `ticker` or `id` will produce a 409 Conflict and a human-readable message resolved from `messages.properties`.

## Notes & Next steps
- For a timeline/audit trail: add `createdAt`/`updatedAt` fields or migrate persistence to an embedded DB (H2) with JPA auditing.
- Messages are externalized and ready for localization.

Contributions welcome — open an issue or PR with suggested changes.
