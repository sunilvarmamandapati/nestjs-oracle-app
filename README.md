# NestJS Oracle App

A production-ready NestJS REST API with Oracle Database integration, request validation, Swagger docs, and on-premise deployment support.

## Stack

| Layer | Technology |
|---|---|
| Framework | NestJS 10 |
| Database | Oracle DB via TypeORM + `oracledb` |
| Validation | `class-validator` + `class-transformer` |
| API Docs | Swagger / OpenAPI |
| Process Manager | PM2 (on-prem) |
| Tests | Jest (runnable in IntelliJ) |

---

## Prerequisites

- Node.js >= 18
- Oracle Instant Client (required by `oracledb`) — see [Oracle Instant Client Downloads](https://www.oracle.com/database/technologies/instant-client/downloads.html)
- Access to an Oracle DB with a `USERS` table

### Expected USERS table schema

```sql
CREATE TABLE USERS (
  ID          NUMBER        PRIMARY KEY,
  USERNAME    VARCHAR2(100) NOT NULL,
  EMAIL       VARCHAR2(255) NOT NULL,
  FIRST_NAME  VARCHAR2(100),
  LAST_NAME   VARCHAR2(100),
  IS_ACTIVE   NUMBER        DEFAULT 1,
  CREATED_AT  DATE,
  UPDATED_AT  DATE
);
```

---

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy and configure environment
cp .env.example .env
# Edit .env with your Oracle DB credentials

# 3. Build
npm run build
```

---

## Running the App

```bash
# Development (with hot-reload)
npm run start:dev

# Production (compiled)
npm run start:prod

# Production with PM2 (on-prem cluster mode)
npm run build
npm run start:pm2
```

Swagger UI is available at `http://localhost:3000/api/docs` (non-production only).

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/users` | List users (paginated + filterable) |
| GET | `/api/users/:id` | Get user by numeric ID |
| GET | `/api/users/username/:username` | Get user by username |

### Query Parameters for `GET /api/users`

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | integer ≥ 1 | 1 | Page number |
| `limit` | integer 1–100 | 10 | Results per page |
| `username` | string | — | Partial username filter |

---

## Running Tests

### From the terminal

```bash
# Run all unit tests
npm test

# Watch mode
npm run test:watch

# With coverage report
npm run test:cov
```

### From IntelliJ IDEA / WebStorm

1. Open the project root in IntelliJ.
2. Open **Run > Edit Configurations**.
3. Click **+** → **Jest**.
4. Set **Working directory** to the project root.
5. Set **Jest package** to `<project>/node_modules/jest`.
6. Set **Configuration file** to leave blank (Jest reads from `package.json`).
7. Click **OK** and run.

You can also right-click any `*.spec.ts` file → **Run Jest** to run a single test file.

---

## On-Premise Deployment

```bash
# Install PM2 globally on the server
npm install -g pm2

# Clone / copy the project, install deps, build
npm ci --omit=dev
npm run build

# Start with PM2
pm2 start ecosystem.config.js

# Persist PM2 across server reboots
pm2 save
pm2 startup
```

PM2 runs the app in **cluster mode** (one process per CPU core) and auto-restarts on crashes. Logs are written to `logs/`.

---

## Project Structure

```
src/
├── config/
│   └── database.config.ts        # Oracle TypeORM config
├── users/
│   ├── __tests__/
│   │   ├── users.controller.spec.ts
│   │   └── users.service.spec.ts
│   ├── dto/
│   │   ├── get-users-query.dto.ts  # Validated query params
│   │   └── user-response.dto.ts    # Response shape
│   ├── user.entity.ts              # TypeORM entity → USERS table
│   ├── users.controller.ts
│   ├── users.module.ts
│   └── users.service.ts
├── app.module.ts
└── main.ts
ecosystem.config.js                 # PM2 config
```
