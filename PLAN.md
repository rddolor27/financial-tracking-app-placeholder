# Financial Tracker V2 - Monorepo Project Plan

## Context
Build a financial tracker application as a Turborepo monorepo with three apps (Next.js web, Expo React Native mobile, NestJS backend). The mobile app is offline-first with auto background sync. Key features include PDF financial statement parsing, receipt scanning (on-device OCR), investment portfolio tracking, recurring transactions, financial goals, bill reminders, spending insights, CSV import, multi-currency support, and dark mode. **Explicitly out of scope:** shared accounts / family mode.

## Tech Stack Summary
- **Monorepo:** Turborepo + pnpm workspaces
- **Web:** Next.js + Chakra UI + Tailwind CSS + TypeScript
- **Mobile:** Expo (managed) + React Native + NativeBase + Drizzle + SQLite + TypeScript
- **Backend:** NestJS + TypeORM + PostgreSQL + TypeScript
- **Auth:** JWT + Passport (NestJS) — email/password + Google OAuth sign-in
- **PDF Parsing:** `pdf-parse` (server), `pdf.js` (client), optional external LLM API for complex PDFs
- **Data Fetching:** Axios instances (shared `api-client`) + TanStack Query (web & mobile)
- **State Management:** Zustand (global client state for web & mobile)
- **Validation:** Zod (shared schemas for DTOs, forms, API request/response validation)
- **Forms:** `react-hook-form` + `@hookform/resolvers/zod` (web + mobile)
- **Secure Storage:** `expo-secure-store` (mobile tokens, secrets)
- **Testing:** Jest across all apps and packages (Test-Driven Development approach)
- **Methodology:** TDD — write failing tests first, then implement to make them pass
- **CI/CD:** GitHub Actions (lint, test, build) — deployment targets TBD
- **Containerization:** Docker for web (Next.js) and backend (NestJS)
- **Charts:** Recharts (web), react-native-chart-kit or Victory Native (mobile)
- **Export:** Excel (`exceljs`) and PDF (`jspdf` + `jspdf-autotable`) export for financial data
- **Icons:** `react-icons` (web), `@expo/vector-icons` (mobile) — consistent icon sets across platforms
- **Timestamps:** All timestamps stored and transmitted as UTC. Frontend converts to local timezone for display only
- **Shared:** Types, utils, API client, UI primitives across apps

---

## Step 1: Scaffold Turborepo Monorepo

Create the root project structure:

```
financial-tracker-v2/
├── apps/
│   ├── web/          # Next.js + Chakra UI + Tailwind
│   ├── mobile/       # Expo React Native + NativeBase
│   └── api/          # NestJS backend
├── packages/
│   ├── shared-types/     # TypeScript types, DTOs, enums
│   ├── shared-utils/     # Business logic, formatters, calculators
│   ├── api-client/       # Axios instances + typed service classes
│   ├── query-hooks/      # Shared TanStack Query hooks
│   ├── store/            # Shared Zustand stores
│   └── pdf-parser/       # Shared PDF parsing logic (rule-based)
├── turbo.json
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── jest.config.base.ts      # Shared Jest base config
├── docker-compose.yml       # Local dev: PostgreSQL, web, api
├── .github/
│   └── workflows/
│       ├── ci.yml            # PR checks: lint, test, build
│       └── deploy.yml        # Deployment (TBD, placeholder)
```

- Initialize Turborepo with `npx create-turbo@latest`
- Configure pnpm workspaces
- Set up shared `tsconfig.base.json` for consistent TS settings
- Configure Turbo pipelines: `build`, `dev`, `lint`, `test`

### App Initialization — Always Use Official CLI Tools
**IMPORTANT:** Each app MUST be initialized using its framework's official CLI scaffolding tool, NOT by hand-writing `package.json` files. This ensures all required framework dependencies, default configs, boilerplate files, and scripts are correctly set up.

- **NestJS (`apps/api`):** `npx @nestjs/cli new api --package-manager pnpm --skip-git` (inside `apps/` directory), then adjust for monorepo
- **Next.js (`apps/web`):** `npx create-next-app@latest web --typescript --app --tailwind --eslint --src-dir --import-alias "@/*"` (inside `apps/` directory), then adjust for monorepo
- **Expo (`apps/mobile`):** `npx create-expo-app mobile --template blank-typescript` (inside `apps/` directory), then adjust for monorepo

After scaffolding each app:
1. Update `tsconfig.json` to extend `../../tsconfig.base.json` (keep framework-specific overrides)
2. Add workspace dependencies (`@financial-tracker/shared-types`, etc.) to `package.json`
3. Add `jest.config.ts` extending the root `jest.config.base.ts`
4. Verify the app runs with its default dev command before adding customizations

**Shared packages** (`packages/*`) are plain TypeScript libraries and can be initialized manually with hand-written `package.json` files — no CLI tool needed.

## Database Schema Design

### Entity Relationship Overview
```
User (1) ──── (N) Account
User (1) ──── (N) Category (user custom + system defaults)
User (1) ──── (N) Budget
User (1) ──── (N) Investment
Account (1) ── (N) Transaction
Category (1) ─ (N) Transaction
Category (1) ─ (N) Budget
Account (1) ── (N) Investment
Investment (1) (N) InvestmentTransaction
User (1) ──── (N) Statement (uploaded PDFs)
User (1) ──── (N) Notification
User (1) ──── (N) RefreshToken
User (1) ──── (N) Goal
User (1) ──── (N) BillReminder
User (1) ──── (1) Subscription
User (1) ──── (N) Payment
SubscriptionPlan    (shared, admin-defined)
ExchangeRate        (shared, not user-specific)
```

### `User`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| email | VARCHAR(255) | Unique, required |
| password_hash | VARCHAR(255) | Nullable (null for Google-only users) |
| google_id | VARCHAR(255) | Nullable, unique (for Google OAuth users) |
| auth_provider | ENUM | `email` \| `google` \| `both` |
| first_name | VARCHAR(100) | Required |
| last_name | VARCHAR(100) | Required |
| avatar_url | VARCHAR(500) | Nullable |
| currency | VARCHAR(3) | Default `'PHP'`, user's preferred currency |
| created_at | TIMESTAMP | Auto-generated |
| updated_at | TIMESTAMP | Auto-updated |

### `Account`
One user can have multiple financial accounts (fully customizable sources of funds).
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| user_id | UUID | FK → User |
| name | VARCHAR(100) | e.g., "BDO Savings", "GCash", "Cash on Hand" |
| bank_name | VARCHAR(100) \| NULL | e.g., "BDO", "BPI", "GCash" — user-defined, not from a fixed list |
| type | ENUM | `checking` \| `savings` \| `credit_card` \| `cash` \| `investment` \| `loan` \| `e_wallet` |
| balance | DECIMAL(15,2) | Current balance |
| currency | VARCHAR(3) | Account currency |
| color | VARCHAR(7) | Hex color for UI display |
| icon | VARCHAR(50) | Icon identifier (from icon library) |
| logo_url | VARCHAR(500) \| NULL | Custom uploaded bank/institution logo (user uploads image) |
| is_active | BOOLEAN | Default true, soft-disable accounts |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

**Custom bank/institution logos:**
- Users can manually add any bank or financial institution name (`bank_name` field)
- Users can upload a custom logo image for each account
- Mobile: logo stored locally via `expo-file-system`, synced to backend when online
- Backend: logo uploaded to `uploads/logos/` directory (cloud storage TBD)
- If no custom logo, the UI falls back to the selected icon from the icon library

### `Category`
System defaults + user-created custom categories.
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| user_id | UUID \| NULL | FK → User. NULL = system default category |
| name | VARCHAR(100) | Category name |
| type | ENUM | `expense` \| `income` |
| icon | VARCHAR(50) | Icon identifier |
| color | VARCHAR(7) | Hex color |
| is_default | BOOLEAN | True for system defaults |
| is_hidden | BOOLEAN | User can hide defaults (not delete) |
| parent_id | UUID \| NULL | FK → Category (for subcategories, optional) |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

**Default Expense Categories (seeded):**
- Food & Dining
- Groceries
- Rent / Housing
- Utilities (Electric, Water, Internet)
- Transportation
- Clothing
- Healthcare / Medical
- Entertainment
- Subscriptions
- Education
- Insurance
- Personal Care
- Gifts & Donations
- Miscellaneous

**Default Income Categories (seeded):**
- Salary / Wages
- Freelance Income
- Interest / Dividends
- Savings / Investments returns

### `Transaction`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| user_id | UUID | FK → User |
| account_id | UUID | FK → Account |
| category_id | UUID | FK → Category |
| type | ENUM | `income` \| `expense` \| `transfer` |
| amount | DECIMAL(15,2) | Always positive |
| description | VARCHAR(500) | Optional note |
| date | DATE | Transaction date |
| transfer_to_account_id | UUID \| NULL | FK → Account (for transfers between accounts) |
| image_url | VARCHAR(500) \| NULL | Attached image (receipt photo, proof of purchase, etc.) |
| latitude | DECIMAL(10,7) \| NULL | GPS latitude of transaction location |
| longitude | DECIMAL(10,7) \| NULL | GPS longitude of transaction location |
| location_name | VARCHAR(255) \| NULL | Human-readable location (e.g., "SM Mall of Asia, Pasay") |
| is_recurring | BOOLEAN | Default false |
| recurring_interval | ENUM \| NULL | `daily` \| `weekly` \| `monthly` \| `yearly` |
| recurring_next_date | DATE \| NULL | Next date to auto-generate (used by cron job) |
| tags | TEXT[] | Optional tags array |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### `Budget`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| user_id | UUID | FK → User |
| category_id | UUID | FK → Category |
| amount | DECIMAL(15,2) | Budget limit |
| period | ENUM | `weekly` \| `monthly` \| `yearly` |
| start_date | DATE | Budget period start |
| end_date | DATE \| NULL | NULL = ongoing/recurring |
| alert_threshold | DECIMAL(3,2) | e.g., 0.80 = alert at 80% spent |
| is_active | BOOLEAN | Default true |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### `Investment`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| user_id | UUID | FK → User |
| account_id | UUID | FK → Account (investment/brokerage account) |
| symbol | VARCHAR(20) | Ticker symbol (e.g., `BTC`, `AAPL`, `JFC.PS`) |
| name | VARCHAR(255) | Full name (e.g., "Bitcoin", "Apple Inc.", "Jollibee Foods Corp") |
| asset_type | ENUM | `crypto` \| `us_stock` \| `ph_stock` |
| quantity | DECIMAL(18,8) | Units held (8 decimals for crypto) |
| avg_buy_price | DECIMAL(15,2) | Average purchase price |
| currency | VARCHAR(3) | `USD` \| `PHP` \| etc. |
| current_price | DECIMAL(15,2) | Last fetched price |
| price_updated_at | TIMESTAMP | When price was last fetched |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### `InvestmentTransaction`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| investment_id | UUID | FK → Investment |
| user_id | UUID | FK → User |
| type | ENUM | `buy` \| `sell` \| `dividend` |
| quantity | DECIMAL(18,8) | Units bought/sold |
| price_per_unit | DECIMAL(15,2) | Price at time of transaction |
| total_amount | DECIMAL(15,2) | quantity * price_per_unit |
| fees | DECIMAL(15,2) | Broker/exchange fees |
| date | DATE | Transaction date |
| notes | VARCHAR(500) | Optional |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### `Statement` (uploaded PDFs)
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| user_id | UUID | FK → User |
| account_id | UUID \| NULL | FK → Account (optional link) |
| file_name | VARCHAR(255) | Original filename |
| file_url | VARCHAR(500) | Storage path/URL |
| file_size | INTEGER | Bytes |
| statement_type | ENUM | `bank` \| `credit_card` \| `investment` \| `other` |
| parse_status | ENUM | `pending` \| `processing` \| `completed` \| `failed` |
| parse_method | ENUM \| NULL | `rule_based` \| `llm` \| `client_side` |
| parsed_data | JSONB \| NULL | Raw parsed output |
| transactions_created | INTEGER | Count of transactions created from this statement |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### `Notification`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| user_id | UUID | FK → User |
| type | ENUM | `budget_alert` \| `bill_reminder` \| `goal_reached` \| `sync_conflict` \| `statement_parsed` \| `system` |
| title | VARCHAR(255) | Notification title |
| message | TEXT | Notification body |
| is_read | BOOLEAN | Default false |
| metadata | JSONB | Extra data (budget_id, category_id, etc.) |
| created_at | TIMESTAMP | |

### `RefreshToken`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| user_id | UUID | FK → User |
| token_hash | VARCHAR(255) | Hashed refresh token |
| expires_at | TIMESTAMP | Token expiry |
| is_revoked | BOOLEAN | Default false |
| device_info | VARCHAR(255) | Optional device identifier |
| created_at | TIMESTAMP | |

### `ExchangeRate`
Cached exchange rates for currency conversion (shared across all users).
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| base_currency | VARCHAR(3) | e.g., `USD` |
| target_currency | VARCHAR(3) | e.g., `PHP` |
| rate | DECIMAL(18,8) | Exchange rate (1 base = rate target) |
| fetched_at | TIMESTAMP | When the rate was fetched from the API |
| created_at | TIMESTAMP | |

- Unique constraint on `(base_currency, target_currency)`
- Refreshed daily via `@Cron()` from ExchangeRate-API or Open Exchange Rates
- Not user-specific — shared across all users

### `Goal`
Financial savings goals with progress tracking.
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| user_id | UUID | FK → User |
| name | VARCHAR(100) | e.g., "Emergency Fund", "Vacation" |
| target_amount | DECIMAL(15,2) | Goal target |
| current_amount | DECIMAL(15,2) | Amount saved so far |
| currency | VARCHAR(3) | Goal currency |
| target_date | DATE \| NULL | Optional deadline |
| icon | VARCHAR(50) | Icon identifier |
| color | VARCHAR(7) | Hex color |
| is_completed | BOOLEAN | Default false, auto-set when current >= target |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### `BillReminder`
Recurring bill reminders with push notifications.
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| user_id | UUID | FK → User |
| name | VARCHAR(100) | e.g., "Netflix", "Electric Bill" |
| amount | DECIMAL(15,2) | Expected bill amount |
| currency | VARCHAR(3) | Bill currency |
| due_day | INTEGER | Day of month (1-31) |
| frequency | ENUM | `monthly` \| `quarterly` \| `yearly` |
| category_id | UUID \| NULL | FK → Category (optional link) |
| account_id | UUID \| NULL | FK → Account (pay from) |
| reminder_days_before | INTEGER | Days before due date to send reminder (default 3) |
| is_active | BOOLEAN | Default true |
| last_paid_date | DATE \| NULL | Last time this bill was marked paid |
| auto_create_transaction | BOOLEAN | Default false, auto-create transaction on due date |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### `SubscriptionPlan`
Admin-defined subscription plans (configurable pricing).
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| name | VARCHAR(100) | e.g., "Free", "Premium" |
| slug | VARCHAR(50) | URL-safe identifier, unique (e.g., `free`, `premium`) |
| platform | ENUM | `web` \| `mobile` \| `both` |
| billing_type | ENUM | `free` \| `one_time` \| `monthly` |
| price | DECIMAL(15,2) | Price in PHP (0 for free tier) |
| features | JSONB | Feature flags (see below) |
| max_accounts | INTEGER \| NULL | NULL = unlimited |
| max_transactions_per_month | INTEGER \| NULL | NULL = unlimited |
| is_active | BOOLEAN | Default true |
| sort_order | INTEGER | Display order on pricing page |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

**`features` JSONB structure:**
```json
{
  "investments": true,
  "pdf_parsing": true,
  "insights": true,
  "csv_import": true,
  "goals": true,
  "bill_reminders": true,
  "receipt_scanning": true,
  "multi_currency": true,
  "data_export": true,
  "transaction_search": true,
  "transaction_images": true,
  "transaction_location": true
}
```

### `Subscription`
Tracks each user's current subscription status.
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| user_id | UUID | FK → User, unique (one active subscription per user) |
| plan_id | UUID | FK → SubscriptionPlan |
| status | ENUM | `active` \| `cancelled` \| `expired` \| `past_due` |
| platform | ENUM | `web` \| `mobile` |
| paymongo_subscription_id | VARCHAR(255) \| NULL | PayMongo subscription ID (for recurring web) |
| current_period_start | TIMESTAMP \| NULL | Start of current billing period (web monthly) |
| current_period_end | TIMESTAMP \| NULL | End of current billing period (web monthly) |
| cancelled_at | TIMESTAMP \| NULL | When user cancelled |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### `Payment`
Payment history for all transactions via PayMongo.
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| user_id | UUID | FK → User |
| subscription_id | UUID \| NULL | FK → Subscription |
| paymongo_payment_id | VARCHAR(255) | PayMongo payment intent/source ID |
| amount | DECIMAL(15,2) | Amount in PHP |
| currency | VARCHAR(3) | Default `PHP` |
| status | ENUM | `pending` \| `paid` \| `failed` \| `refunded` |
| payment_method | VARCHAR(50) | `card` \| `gcash` \| `maya` \| `grabpay` \| `bpi_online` \| `unionbank` |
| billing_type | ENUM | `one_time` \| `monthly` |
| description | VARCHAR(255) | e.g., "Premium - One-time purchase", "Premium - July 2026" |
| paid_at | TIMESTAMP \| NULL | When payment was confirmed |
| metadata | JSONB \| NULL | Extra PayMongo data (receipt URL, etc.) |
| created_at | TIMESTAMP | |

### Mobile-only tables (SQLite via Drizzle)
These mirror the backend schema above plus sync columns:

**Additional columns on every entity table:**
| Column | Type | Notes |
|--------|------|-------|
| sync_status | TEXT | `synced` \| `pending_create` \| `pending_update` \| `pending_delete` \| `conflict` |
| server_id | TEXT \| NULL | Backend UUID (null until first sync) |
| local_updated_at | INTEGER | Unix timestamp |
| server_updated_at | INTEGER | Last known server timestamp |

**`sync_queue` table** (see Step 11 for full details)

---

## Step 2: Set Up Shared Packages

### `packages/shared-types`
- Financial entity types: `Transaction`, `Account`, `Category`, `Budget`, `Statement`
- **Zod schemas** for every DTO — single source of truth for validation across the entire stack:
  - `CreateTransactionSchema`, `UpdateTransactionSchema`, `TransactionResponseSchema`, etc.
  - TypeScript types inferred from Zod schemas via `z.infer<typeof Schema>` (no duplicate type definitions)
- Enum definitions as Zod enums (TransactionType, AccountType, StatementType, etc.)
- Shared between: NestJS (request validation), web (form validation), mobile (form validation), api-client (response validation)

### `packages/shared-utils`
- Currency formatting and math utilities
- Date helpers for financial periods
- Transaction categorization logic
- Financial calculations (balances, totals, summaries)

### `packages/api-client`
- **Axios instance** with pre-configured base URL, interceptors, and headers
  - Request interceptor: attach JWT access token from storage
  - Response interceptor: handle 401 → refresh token flow automatically
  - Configurable base URL per environment (dev/staging/prod)
- Typed service classes per module (e.g., `TransactionService.getAll()`, `AccountService.create()`)
  - Each method is fully typed using `shared-types` DTOs
- Used by both web and mobile apps as the single API layer

### `packages/query-hooks` (shared TanStack Query hooks)
- Shared **TanStack Query** hooks wrapping the `api-client` service methods
- Pre-configured query keys, stale times, and cache invalidation rules per entity
- Examples:
  - `useTransactions(filters)` — fetches & caches transaction list
  - `useCreateTransaction()` — mutation with optimistic update + cache invalidation
  - `useAccounts()`, `useBudgets()`, etc.
- Shared between web and mobile (TanStack Query works in both React and React Native)
- Each app provides its own `QueryClientProvider` with platform-specific config (e.g., mobile may use longer stale times for offline resilience)

### `packages/store` (shared Zustand stores)
- **Zustand** for global client-side state (not server state — that stays in TanStack Query)
- Stores shared between web and mobile:
  - `useAuthStore` — auth state (user info, tokens, isAuthenticated, login/logout actions)
  - `useAppStore` — app-wide UI state (theme mode, sidebar open, active filters, selected date range)
  - `useExportStore` — export state (format selection, export progress, download status)
  - `useSyncStore` (mobile) — sync status (lastSyncAt, isSyncing, pendingCount, errors)
- Each store uses Zustand's `persist` middleware where needed (e.g., auth store persists tokens)
  - Web: persists to `localStorage`
  - Mobile persist adapters:
    - `expo-secure-store` → for `useAuthStore` (tokens, user credentials — encrypted)
    - `@react-native-async-storage/async-storage` → for `useAppStore` (theme, filters, onboarding — non-sensitive)
- Stores are plain functions — no React context needed, works in both React and React Native

### `packages/pdf-parser`
- Rule-based PDF parsing using `pdf-parse` / `pdf.js`
- Parsers for common bank statement formats
- Parsers for credit card statement formats
- Parsers for investment statement formats
- Shared between client-side and server-side processing

## Step 3: Set Up NestJS Backend (`apps/api`)

Initialize NestJS with modular architecture:

```
apps/api/
├── src/
│   ├── modules/
│   │   ├── auth/           # JWT + Passport auth
│   │   ├── users/          # User management
│   │   ├── accounts/       # Financial accounts
│   │   ├── transactions/   # Transaction CRUD
│   │   ├── categories/     # Transaction categories
│   │   ├── budgets/        # Budget management
│   │   ├── statements/     # PDF upload & parsing
│   │   ├── investments/    # Portfolio tracking + market data
│   │   ├── goals/          # Financial goals
│   │   ├── bill-reminders/ # Bill reminders + auto-transactions
│   │   ├── notifications/  # In-app + push notifications
│   │   ├── import/         # CSV import
│   │   ├── subscriptions/  # Subscription plans + PayMongo payments
│   │   └── sync/           # Mobile sync endpoints
│   ├── common/             # Guards, interceptors, pipes, filters
│   ├── config/             # Environment config
│   └── database/           # TypeORM config, migrations
```

Key setup:
- TypeORM with PostgreSQL connection
- JWT + Passport authentication (access + refresh tokens)
  - **Email/password** sign-up & sign-in (bcrypt for password hashing)
  - **Google OAuth 2.0** sign-in via `passport-google-oauth20`
  - Users can link both methods (`auth_provider: 'both'`)
  - Refresh token rotation with `RefreshToken` table (hashed, revocable, per-device)
- Module-per-feature with controller/service/entity/dto pattern
- **Zod** validation via custom `ZodValidationPipe` — validates request bodies/params using shared Zod schemas from `@financial-tracker/shared-types`
- PDF processing endpoint: upload PDF, parse with `pdf-parse`, optionally call external LLM API (e.g., Claude) for complex/unstructured statements
- Sync module: endpoints for mobile to push/pull data with conflict resolution

### Migrations (Backend — TypeORM)
All migrations are generated and run via CLI commands only. Never hand-write migration files.
```bash
# Generate a migration after modifying entities
pnpm --filter api typeorm migration:generate src/database/migrations/<MigrationName>

# Run pending migrations
pnpm --filter api typeorm migration:run

# Revert last migration
pnpm --filter api typeorm migration:revert

# Show migration status
pnpm --filter api typeorm migration:show
```
- TypeORM `synchronize: false` in all environments (never auto-sync schema)
- `apps/api/package.json` includes a `typeorm` script pointing to the data source config
- Migration files are committed to git and run in CI/CD and Docker entrypoint

## Step 4: Set Up Next.js Web App (`apps/web`)

```
apps/web/
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── (auth)/         # Login/register pages
│   │   ├── dashboard/      # Main dashboard
│   │   ├── transactions/   # Transaction views
│   │   ├── accounts/       # Account management
│   │   ├── budgets/        # Budget views
│   │   ├── statements/     # PDF upload & parsed results
│   │   ├── investments/    # Portfolio & investment tracking
│   │   ├── goals/          # Financial goals
│   │   ├── bills/          # Bill reminders
│   │   ├── insights/       # Spending insights & analytics
│   │   └── settings/       # User settings
│   ├── components/         # Reusable UI components
│   ├── hooks/              # Custom React hooks
│   ├── providers/          # Chakra, Auth, Query providers
│   └── lib/                # Web-specific utilities
```

Key setup:
- Chakra UI + Tailwind CSS integration
- **TanStack Query** via shared `@financial-tracker/query-hooks` for all server state (caching, refetching, optimistic updates)
- **Axios instance** via `@financial-tracker/api-client` as the HTTP layer (no direct fetch calls)
- `QueryClientProvider` configured at app root in `providers/`
- **Zustand** stores via `@financial-tracker/store` for global client state (auth, UI preferences, export)
- **Zod** schemas from `@financial-tracker/shared-types` for form validation (integrated with react-hook-form via `@hookform/resolvers/zod`)
- Client-side PDF parsing (offline fallback) using `pdf.js` via shared `pdf-parser` package
- **Recharts** for financial data visualizations:
  - Spending breakdown (pie/donut chart by category)
  - Income vs expenses over time (bar/line chart)
  - Budget progress (bar chart with targets)
  - Account balance trends (area chart)
  - Net worth over time (line chart)
- **Data export:**
  - Export to Excel (`.xlsx`) using `exceljs` — transactions, summaries, filtered views
  - Export to PDF using `jspdf` + `jspdf-autotable` — formatted reports with charts/tables

## Step 5: Set Up Expo Mobile App (`apps/mobile`)

```
apps/mobile/
├── src/
│   ├── screens/            # Screen components
│   ├── components/         # Reusable mobile components
│   ├── navigation/         # React Navigation setup
│   ├── db/                 # Drizzle + SQLite setup
│   │   ├── schema.ts       # Drizzle schema (mirrors backend entities)
│   │   ├── migrations/     # Local SQLite migrations
│   │   └── sync.ts         # Background sync logic
│   ├── hooks/              # Custom hooks
│   ├── providers/          # Auth, DB, Sync providers
│   └── services/           # Background tasks, notifications
```

### Migrations (Mobile — Drizzle)
All migrations are generated via Drizzle Kit CLI commands only. Never hand-write migration files.
```bash
# Generate a migration after modifying schema.ts
pnpm --filter mobile drizzle-kit generate

# Apply migrations (used programmatically at app startup via migrate())
# Drizzle runs migrations in-app via expo-sqlite, but files are generated via CLI

# Drop all and re-migrate (dev only)
pnpm --filter mobile drizzle-kit drop
```
- `drizzle.config.ts` in `apps/mobile/` points to the schema and output directory
- Generated SQL migration files are committed to git
- On app startup, `migrate()` from `drizzle-orm/expo-sqlite/migrator` runs pending migrations

Key setup:
- **NativeBase** component library (Chakra UI-like API — consistent DX across web and mobile)
  - `NativeBaseProvider` with custom theme at app root
  - Shared design tokens (colors, spacing, typography) aligned with web Chakra theme
- Drizzle ORM + `expo-sqlite` for local offline storage
- **TanStack Query** via shared `@financial-tracker/query-hooks` for online data (with longer stale times for offline resilience)
- **Axios instance** via `@financial-tracker/api-client` for all API calls
- `QueryClientProvider` with mobile-specific config (e.g., `gcTime: Infinity` when offline, `networkMode: 'offlineFirst'`)
- **Zustand** stores via `@financial-tracker/store` for global client state (auth, sync status, UI preferences)
- **Zod** schemas from `@financial-tracker/shared-types` for form validation
- **`expo-secure-store`** for all sensitive data storage:
  - JWT access & refresh tokens
  - User credentials / biometric keys
  - Any API keys or secrets
  - Zustand auth store uses `expo-secure-store` as its persist storage adapter
- Auto background sync service:
  - Detect connectivity changes with `@react-native-community/netinfo`
  - Queue local changes when offline
  - Sync with backend when online (push local changes, pull remote updates)
  - Timestamp-based conflict resolution (last-write-wins or prompt user)
- **`@react-native-async-storage/async-storage`** for non-sensitive persistence (theme, onboarding, filters)
- Client-side PDF parsing for offline use
- **Charts:** `react-native-chart-kit` or Victory Native for mobile dashboards (same data visualizations as web)
- **Data export:** Share/export Excel and PDF reports via `expo-sharing` + `expo-file-system`

## Step 6: PDF Parsing Feature

**Client-side (offline):**
- Use shared `pdf-parser` package
- Rule-based extraction: regex patterns for common statement formats
- Works in both web (pdf.js) and mobile (react-native-pdf-parser or similar)

**Server-side (online, preferred):**
- Upload PDF to NestJS `/statements/upload` endpoint
- First attempt: rule-based parsing via shared `pdf-parser`
- If rule-based fails or confidence is low: call external LLM API (Claude) to extract structured transaction data from PDF text
- Return parsed transactions for user review/confirmation before saving

**Fallback logic (mobile):**
- If online → upload to backend for server-side parsing
- If offline → parse client-side with rule-based parser
- Queue results for sync when back online

## Step 7: Investment Tracking & Market Data

### Supported asset types
- **Crypto:** Bitcoin, Ethereum, and major cryptocurrencies
- **US Stocks:** NYSE/NASDAQ listed companies
- **PH Stocks:** Philippine Stock Exchange (PSE) listed companies

### Market data sources (backend fetches, caches, and serves to clients)
- **Crypto:** CoinGecko API (free tier) or CoinMarketCap API
- **US Stocks:** Alpha Vantage API (free tier) or Yahoo Finance API (unofficial)
- **PH Stocks:** PSE Edge API or investagrams (to be finalized)

### Backend — `investments` module
- CRUD for user investment holdings
- CRUD for buy/sell/dividend transactions (auto-recalculates `avg_buy_price` and `quantity`)
- `GET /investments/prices` — fetch latest prices for user's holdings
- Scheduled price refresh via NestJS `@Cron()` (e.g., every 15 minutes during market hours)
- Cached prices in DB (`current_price`, `price_updated_at`) to avoid redundant API calls
- Portfolio summary endpoint: total value, total gain/loss, per-asset performance

### Frontend — Investment dashboard
- Portfolio overview: total value, daily change, allocation pie chart
- Per-asset cards: current price, quantity, gain/loss, % change
- Investment transaction history (buy/sell/dividend log)
- Performance chart over time (line/area chart)

### Architecture notes
- Market data fetched **server-side only** (API keys stay on backend)
- Clients receive prices via the existing TanStack Query hooks
- Mobile offline: last known prices cached locally, refreshed on sync
- Price data is NOT user-specific — can be shared/cached across users for the same symbols

## Step 8: Testing — Test-Driven Development (TDD)

**All feature development follows the TDD cycle: Red → Green → Refactor.**

Shared base Jest config at root (`jest.config.base.ts`), each app/package extends it.

### TDD Workflow (applied to every feature)
For each piece of functionality:
1. **Red:** Write a failing test that describes the expected behavior
2. **Green:** Write the minimum code to make the test pass
3. **Refactor:** Clean up the implementation while keeping tests green

### TDD by package/app

#### `packages/shared-types`
- **TDD:** Write tests for Zod schema validation behavior (valid data passes, invalid data rejected with correct error messages)
- Test edge cases: boundary values, nullable fields, enum values, string length limits
- Also validated by `tsc --noEmit` for type correctness

#### `packages/shared-utils`
- **TDD:** Write test for each utility first (e.g., `formatCurrency(1234.5, 'USD')` → `'$1,234.50'`), then implement
- Unit tests for: currency formatting, date helpers, financial calculations, categorization logic

#### `packages/api-client`
- **TDD:** Write tests for Axios interceptor behavior first (token attachment, 401 refresh), then implement interceptors
- Mock Axios to test typed service class methods against expected request shapes

#### `packages/query-hooks`
- **TDD:** Write tests for each hook using `@testing-library/react` + `renderHook` with `QueryClientProvider` wrapper
- Test: query key generation, stale time behavior, cache invalidation on mutations, optimistic updates

#### `packages/pdf-parser`
- **TDD:** Write tests with sample PDF fixtures first (expected parsed output for known statement formats), then implement parsers
- Test extraction accuracy for bank, credit card, and investment statement formats

#### `apps/api` (NestJS)
- **TDD per module** — for each module (auth, transactions, accounts, etc.):
  1. Write unit test for service method (mocked repository) → implement service
  2. Write integration test for controller endpoint (`Test.createTestingModule`) → implement controller
  3. Write E2E test with `supertest` against test PostgreSQL → verify full flow
- Each module has co-located `*.spec.ts` files
- Test guards, interceptors, and pipes independently

#### `apps/web` (Next.js)
- **TDD for components:** Write `@testing-library/react` test describing expected renders/interactions → implement component
- **TDD for hooks:** Write `renderHook` tests → implement custom hooks
- **TDD for pages:** Write page render tests with mocked providers (Chakra, QueryClient, Auth) → implement pages
- **TDD for export:** Write tests for Excel/PDF generation with expected output → implement export logic

#### `apps/mobile` (Expo)
- **TDD for components:** Write `@testing-library/react-native` tests → implement screens/components
- **TDD for sync:** Write tests for sync queue operations (insert, batch, retry, conflict detection) → implement sync service
- **TDD for DB:** Write tests for Drizzle schema CRUD operations with in-memory SQLite → implement DB layer

### Test configuration
- Root `turbo.json` pipeline includes `test` task
- `turbo run test` runs all tests across the monorepo in parallel
- Each package/app has its own `jest.config.ts` extending the base config
- `ts-jest` for TypeScript support across all packages
- `--watch` mode available for TDD development flow: `pnpm --filter <package> test -- --watch`

## Step 9: Docker

### `apps/api/Dockerfile`
- Multi-stage build: install deps → build → production image
- Base image: `node:20-alpine`
- Copies only built output + production deps for small image size
- Exposes NestJS port (default 3000)

### `apps/web/Dockerfile`
- Multi-stage build: install deps → `next build` → production image
- Uses `next start` in production with standalone output mode
- Exposes Next.js port (default 3001)

### `docker-compose.yml` (root)
- **postgres:** PostgreSQL 16 with volume for data persistence
- **api:** NestJS backend, depends on postgres, env vars for DB connection
- **web:** Next.js frontend, depends on api, env vars for API URL
- Shared network for inter-service communication
- `.env` file for configurable ports, DB credentials, JWT secrets

### `docker-compose.dev.yml` (optional override)
- Mounts source code as volumes for hot-reload during development
- Uses `turbo dev` commands instead of production builds

## Step 10: CI/CD (GitHub Actions)

### `.github/workflows/ci.yml` — runs on every PR and push to main
```
Jobs (parallel where possible):
1. lint        → turbo run lint
2. type-check  → turbo run type-check (tsc --noEmit)
3. test        → turbo run test (Jest across all apps/packages)
   - Uses PostgreSQL service container for API e2e tests
4. build       → turbo run build (verify all apps compile)
   - Build Docker images (verify Dockerfiles are valid)
```
- Uses Turborepo remote caching for faster CI runs
- pnpm cache for dependency installation
- Node 20.x

### `.github/workflows/deploy.yml` — placeholder for future deployment
- Triggered on push to `main` (after CI passes)
- Builds Docker images and pushes to container registry (e.g., GHCR or Docker Hub)
- Deployment steps TBD (will be configured when hosting is decided)

## Step 11: Sync Architecture (Mobile) — DB-Based Queue

All sync state lives in the local SQLite database via Drizzle. No in-memory queues.

### Sync status on every entity table
Each data table (transactions, accounts, categories, budgets, investments, investment_transactions, goals, bill_reminders) has these sync columns:
- `sync_status`: enum — `synced` | `pending_create` | `pending_update` | `pending_delete` | `conflict`
- `server_id`: nullable string — the backend's ID (null until first sync)
- `local_updated_at`: timestamp — when the record was last modified locally
- `server_updated_at`: timestamp — last known server timestamp

### Dedicated `sync_queue` table in SQLite
```
sync_queue {
  id            INTEGER PRIMARY KEY AUTOINCREMENT
  entity_type   TEXT        -- 'transaction' | 'account' | 'category' | 'budget' | 'investment' | 'investment_transaction' | 'goal' | 'bill_reminder'
  entity_id     INTEGER     -- local row ID
  action        TEXT        -- 'create' | 'update' | 'delete'
  payload       TEXT        -- JSON snapshot of the data at time of change
  created_at    TIMESTAMP   -- when the change was queued
  retry_count   INTEGER     -- number of failed sync attempts
  last_error    TEXT        -- last error message (nullable)
  status        TEXT        -- 'pending' | 'in_progress' | 'failed' | 'completed'
}
```

### Sync flow
1. **On any local write** (create/update/delete): insert a row into `sync_queue` and set entity's `sync_status` to the appropriate pending state
2. **When online** (detected via `@react-native-community/netinfo`):
   - Query `sync_queue` for rows with `status = 'pending'` ordered by `created_at`
   - Mark batch as `in_progress`
   - Send to backend sync endpoint (`POST /sync/push`)
   - On success: mark queue rows as `completed`, update entity `sync_status` to `synced`, store `server_id`
   - On failure: increment `retry_count`, set `last_error`, mark as `failed` (retry on next sync cycle)
3. **Pull from server**: `GET /sync/pull?since={last_sync_timestamp}`
   - Upsert received records into local DB
   - If local record has `pending_update` and server has a newer version → mark as `conflict` for user resolution
4. **Cleanup**: periodically delete `completed` rows from `sync_queue` older than 24h
5. Sync runs via `expo-task-manager` as a background task + on app foreground + on connectivity restored

## Step 12: Error Handling Strategy

### API error response format (consistent across all endpoints)
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "errors": [
    { "field": "amount", "message": "Amount must be a positive number" }
  ],
  "timestamp": "2026-06-28T12:00:00.000Z",
  "path": "/api/transactions"
}
```

### Backend (NestJS)
- Global `HttpExceptionFilter` — catches all exceptions, formats to standard shape above
- `ZodValidationPipe` returns field-level errors in the `errors[]` array
- Business logic errors use custom exception classes (e.g., `InsufficientBalanceException`, `AccountNotFoundException`)
- Unhandled errors return `500` with generic message (no stack traces in production)

### Web (Next.js)
- React Error Boundary at app root — catches render errors, shows fallback UI
- Per-page error boundaries for isolated failures
- TanStack Query `onError` callbacks for API error toasts via Chakra UI `useToast`
- Axios response interceptor surfaces API errors to the UI layer

### Mobile (Expo)
- React Error Boundary at app root with crash recovery screen
- TanStack Query error handling with NativeBase toast/alert components
- Offline errors handled gracefully (queue for sync, don't show error)
- Network errors distinguished from API errors

## Step 13: Pagination

### Backend
- All list endpoints support cursor-based pagination by default:
  ```
  GET /transactions?cursor=<lastId>&limit=20&sortBy=date&order=desc
  ```
- Response shape:
  ```json
  {
    "data": [...],
    "meta": {
      "hasNextPage": true,
      "nextCursor": "uuid-of-last-item",
      "total": 150
    }
  }
  ```
- Default `limit: 20`, max `limit: 100`
- Filtering via query params: `?categoryId=x&accountId=y&dateFrom=&dateTo=&type=expense`

### Frontend
- TanStack Query `useInfiniteQuery` for paginated lists
- Infinite scroll on mobile, "Load more" button or infinite scroll on web
- Filters synced with URL search params on web (shareable URLs)

## Step 14: Scalar API Documentation

- `@nestjs/swagger` to generate OpenAPI 3.0 spec
- **Scalar** as the API docs UI (replaces default Swagger UI)
  - Install `@scalar/nestjs-api-reference`
  - Modern, clean UI with better DX than Swagger UI
- Available at `GET /api/docs` in development
- Zod schemas converted to OpenAPI via `@anatine/zod-openapi` or manual `@ApiProperty` decorators
- Grouped by module (auth, transactions, accounts, etc.)
- Disabled in production (behind env flag)

## Step 15: ESLint & Prettier

### Shared config at root
- `eslint.config.mjs` (flat config) with shared rules
- `.prettierrc` for consistent formatting
- Packages:
  - `@typescript-eslint/eslint-plugin` + `@typescript-eslint/parser`
  - `eslint-plugin-react` + `eslint-plugin-react-hooks` (web + mobile)
  - `eslint-config-next` (web)
  - `prettier` + `eslint-config-prettier` (disable conflicting rules)
- Each app/package extends the root config
- Turbo pipeline: `turbo run lint` runs across all packages
- Pre-commit: consider `lint-staged` + `husky` for auto-format on commit

## Step 16: Budget Alert Notifications

### Backend
- NestJS `@Cron()` job checks budget spending vs threshold (e.g., every hour)
- When spending reaches `alert_threshold` (e.g., 80%):
  - Create in-app notification record in `Notification` table
  - Optionally send push notification via Expo Push Notifications (`expo-notifications`)

### Frontend
- Web: notification bell icon with unread count, dropdown list
- Mobile: in-app notification screen + push notifications via `expo-notifications`
- TanStack Query polling or WebSocket for real-time updates (polling initially, WebSocket later)

## Step 17: Currency Conversion

- User sets a **primary currency** in their profile (e.g., `PHP`)
- All dashboard totals, charts, and summaries convert to the primary currency
- Exchange rates fetched server-side via a free API:
  - **ExchangeRate-API** (free tier) or **Open Exchange Rates**
  - Cached in DB / Redis, refreshed once daily via `@Cron()`
- Conversion logic in `packages/shared-utils`:
  - `convertCurrency(amount, fromCurrency, toCurrency, rates)` → converted amount
  - Used by both backend (aggregation queries) and frontend (display)
- Account balances stored in their native currency, converted on-the-fly for display
- Investment values converted using market data currency + exchange rate

## Step 18: Environment Configuration

### `.env.example` at project root
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=
DB_DATABASE=financial_tracker

# JWT
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# Market Data APIs
COINGECKO_API_KEY=
ALPHA_VANTAGE_API_KEY=

# Exchange Rates
EXCHANGE_RATE_API_KEY=

# PayMongo
PAYMONGO_SECRET_KEY=
PAYMONGO_PUBLIC_KEY=
PAYMONGO_WEBHOOK_SECRET=
PAYMONGO_CHECKOUT_SUCCESS_URL=http://localhost:3001/subscription/success
PAYMONGO_CHECKOUT_CANCEL_URL=http://localhost:3001/subscription/cancel

# App
API_PORT=3000
WEB_PORT=3001
NODE_ENV=development
```

- Each app (`apps/api`, `apps/web`) has its own `.env` loaded via `@nestjs/config` (backend) or `next.config.js` (web)
- `.env` files are in `.gitignore`
- `.env.example` is committed and kept up to date
- Zod validation for env vars at app startup (fail fast if missing)

## Step 19: Seed Script

### Default category seeding
- Seed script at `apps/api/src/database/seeds/`
- Run via: `pnpm --filter api seed`
- Package.json script: `"seed": "ts-node src/database/seeds/run-seed.ts"`
- Idempotent: checks if defaults exist before inserting (safe to run multiple times)
- Seeds:
  - 14 default expense categories (with icons and colors)
  - 4 default income categories (with icons and colors)
  - 3 default subscription plans (Free, Premium Web, Premium Mobile)
- Runs automatically in Docker entrypoint after migrations
- Also runs in CI for E2E tests

## Step 20: Rate Limiting

### Backend (NestJS)
- `@nestjs/throttler` for rate limiting
- Global defaults: 60 requests per minute per IP
- Stricter limits on auth endpoints:
  - `POST /auth/login` → 5 attempts per minute (brute force protection)
  - `POST /auth/register` → 3 per minute
  - `POST /auth/forgot-password` → 3 per minute
- Relaxed limits on read-heavy endpoints:
  - `GET /transactions` → 120 per minute
  - `GET /investments/prices` → 30 per minute
- Rate limit headers in response: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- 429 Too Many Requests response follows the standard error format

## Step 21: File Storage

### Mobile only — local device storage
- Transaction images (receipts, proofs of purchase), PDFs, and custom logos stored locally on device via `expo-file-system`
- Files saved to app's document directory (persists across app restarts)
- `image_url` / `file_url` columns store local file URI (e.g., `file:///data/user/0/.../transactions/abc.jpg`)
- Files synced to backend when online (future enhancement — cloud storage TBD)
- File cleanup: delete local files when associated record is deleted

### Backend — local disk (development only)
- PDF uploads stored to `uploads/` directory on server for now
- Served via NestJS static file serving
- Cloud storage (S3/R2) to be added when deployment target is decided
- `file_url` stores relative path, easily swappable to cloud URL later

## Step 22: Transaction Image Attachments & Location

### Image Attachments
- Users can attach one image per transaction (receipt photo, proof of purchase, screenshot, etc.)
- Image stored as `image_url` on the Transaction entity
- **Mobile:** image captured via `expo-camera` or selected from gallery via `expo-image-picker`, stored locally via `expo-file-system`, synced to backend when online
- **Web:** image uploaded via file input, sent to `POST /transactions/:id/image` endpoint
- **Backend:** images stored to `uploads/transactions/` directory (cloud storage TBD)
- Image compressed/resized client-side before storage (max 1920px width, JPEG 80% quality)
- Receipt scanning (Step 23) also saves the captured receipt image here — same field, same flow

### Transaction Location
- Users can optionally tag a transaction with a GPS location
- **Mobile:** auto-detect location via `expo-location` (request permission, get current coordinates)
  - Option to auto-fill location when creating a transaction (user can toggle on/off in settings)
  - Manual location entry also supported (search for a place name)
  - Reverse geocoding via `expo-location` to convert coordinates → human-readable address (`location_name`)
- **Web:** browser Geolocation API (optional, user must grant permission)
  - Manual location entry via text input
- **Backend:** stores `latitude`, `longitude`, `location_name` on Transaction
- **Display:** location shown on transaction detail view with optional map preview
  - Mobile: `react-native-maps` for map preview (optional, can be added later)
  - Web: embedded map or just text display

### Packages
- `expo-location` — GPS coordinates + reverse geocoding (mobile)
- `expo-camera` / `expo-image-picker` — image capture (already listed for OCR)
- `expo-image-manipulator` — client-side image resize/compress (mobile)

## Step 23: Recurring Transaction Auto-Generation

### Backend
- NestJS `@Cron()` job runs daily (e.g., midnight UTC)
- Queries all transactions where `is_recurring = true` and the next occurrence is due based on `recurring_interval` (`daily`, `weekly`, `monthly`, `yearly`)
- Auto-creates a new transaction record with the same details (account, category, amount, type)
- Tracks last generated date to avoid duplicates
- Skips if user has manually created a matching transaction for that period

### Frontend
- Toggle recurring on/off when creating/editing a transaction
- Select interval: daily, weekly, monthly, yearly
- View upcoming recurring transactions in a list
- Option to skip or stop a recurring transaction

### Mobile offline
- Recurring generation runs server-side only
- On sync pull, new auto-generated transactions are downloaded to local DB

## Step 23: Receipt Scanning (On-Device OCR)

### Approach — fully on-device, no backend required
- Use **Google ML Kit** via `@infinitered/react-native-mlkit-text-recognition` (Expo module, free, open source, actively maintained by Infinite Red)
- Camera capture via `expo-camera` or `expo-image-picker`
- All OCR processing happens locally on the device (works offline, no API keys, no network calls)

### Flow
1. User takes a photo of a receipt or selects from gallery
2. Image passed to ML Kit text recognition (on-device)
3. Extracted text parsed with regex/heuristics to identify:
   - Total amount
   - Date
   - Merchant name
   - Line items (best effort)
4. Pre-fill the "Add Transaction" form with extracted data
5. User reviews, corrects if needed, and saves
6. Receipt image stored locally via `expo-file-system` (saved as `image_url` on the transaction)

### Packages
- `@infinitered/react-native-mlkit-text-recognition` — Google ML Kit on-device OCR (free, Expo-native, v5.0.0+)
- `@infinitered/react-native-mlkit-core` — required core dependency
- `expo-camera` — camera capture
- `expo-image-picker` — gallery selection
- Custom receipt parser utility in `apps/mobile/src/services/receipt-parser.ts`

### Notes
- ML Kit text recognition supports Latin script well (English, Filipino, etc.)
- Model is bundled with the app (~3MB), no network needed
- Web app does NOT have receipt scanning (mobile-only feature)
- Accuracy varies by receipt format — user always reviews before saving
- Google ML Kit is free for on-device use (no usage limits, no API key)

## Step 24: Financial Goals

### Backend — `goals` module
- CRUD for financial goals (`Goal` entity — see schema above)
- `PATCH /goals/:id/contribute` — add funds to a goal (increases `current_amount`)
- Auto-mark `is_completed = true` when `current_amount >= target_amount`
- Create `goal_reached` notification when completed
- `GET /goals/summary` — all goals with progress percentages

### Frontend
- Goals list page with progress bars
- Create/edit goal form (name, target amount, target date, icon, color)
- Contribute to goal (manual amount entry)
- Goal detail view with contribution history
- Dashboard widget: top goals with progress

### Mobile
- Goals synced via offline sync system
- Local CRUD with sync queue

## Step 25: Bill Reminders

### Backend — `bill-reminders` module
- CRUD for bill reminders (`BillReminder` entity — see schema above)
- NestJS `@Cron()` job checks daily for upcoming bills:
  - If `due_day - today <= reminder_days_before` → create `bill_reminder` notification
  - If `auto_create_transaction = true` and due date reached → auto-create expense transaction
- Push notification via Expo Push Notifications
- `GET /bill-reminders/upcoming` — bills due in the next 30 days

### Frontend
- Bill reminders list with due dates and amounts
- Create/edit bill reminder form
- Mark as paid (sets `last_paid_date`, optionally creates a transaction)
- Dashboard widget: upcoming bills this month
- Calendar view of bill due dates

### Mobile
- Push notifications via `expo-notifications` for upcoming bills
- Bill reminders synced via offline sync system

## Step 26: Multi-Currency Dashboard Widget

### Dashboard display
- Widget showing account balances in their native currencies AND converted to user's primary currency
- Total net worth across all accounts in primary currency
- Currency breakdown: pie chart showing holdings per currency
- Exchange rate indicators (up/down from yesterday)

### Implementation
- Leverages existing currency conversion logic from Step 17
- `convertCurrency()` from `shared-utils` used for on-the-fly display conversion
- Exchange rates cached daily, shown with "as of" timestamp
- User can click to see the exchange rate used

## Step 27: Transaction Search

### Backend
- `GET /transactions/search?q=<query>` — full-text search across transaction descriptions and tags
- PostgreSQL `tsvector` + `tsquery` for efficient full-text search
- Search filters combinable with existing pagination filters (date range, category, account, type)
- Search results ranked by relevance

### Frontend
- Search bar on transactions page (web) and transactions screen (mobile)
- Real-time search with debounced input (300ms)
- Search results highlighted with matching terms
- Recent searches saved locally (web: localStorage, mobile: AsyncStorage)
- TanStack Query caches search results per query string

## Step 28: CSV Import

### Backend — `import` module
- `POST /import/csv` — upload CSV file, parse, and return preview
- `POST /import/csv/confirm` — confirm and save parsed transactions
- Supports common CSV formats:
  - Generic (date, description, amount, type columns)
  - Bank-specific templates (configurable column mapping)
- Column mapping UI: user maps CSV columns to transaction fields
- Duplicate detection: warn if transactions with same date + amount + description already exist
- Validation via Zod schemas before saving

### Frontend
- CSV upload page (web) — drag & drop or file picker
- Column mapping step: preview table with dropdown selectors for each column
- Review step: show parsed transactions with validation warnings
- Confirm and import
- Import history: list of past imports with counts

### Mobile
- CSV import via `expo-document-picker` (select file from device)
- Same column mapping and review flow as web

## Step 29: Spending Insights & Analytics

### Backend
- `GET /insights/spending-by-category?period=monthly` — breakdown by category
- `GET /insights/spending-trends?months=6` — month-over-month spending trends
- `GET /insights/income-vs-expense?year=2026` — income vs expense per month
- `GET /insights/top-merchants?limit=10` — most frequent merchants/descriptions
- `GET /insights/budget-utilization` — how well budgets are being followed
- `GET /insights/savings-rate` — (income - expenses) / income per period
- `GET /insights/category-comparison?period=monthly` — compare current vs previous period

### Frontend — Insights page
- Spending by category: donut chart + ranked list
- Monthly trends: bar/line chart showing spending over time
- Income vs expenses: side-by-side bar chart
- Savings rate: gauge or percentage display
- Budget health: which budgets are on track vs overrun
- Period selector: weekly, monthly, quarterly, yearly
- Comparison mode: compare current period vs previous period
- All charts use Recharts (web) and react-native-chart-kit/Victory Native (mobile)

## Step 30: Dark Mode

### Implementation
- Both web and mobile support light and dark themes
- User preference stored in:
  - Web: `localStorage` (via Zustand `useAppStore`)
  - Mobile: `AsyncStorage` (via Zustand `useAppStore`)
- Default: follow system preference, with manual override option

### Web (Chakra UI + Tailwind)
- Chakra UI's built-in `ColorModeProvider` + `useColorMode` hook
- Tailwind CSS `dark:` variant classes for custom components
- `ColorModeScript` in `_document` to prevent flash of wrong theme
- All color values use Chakra's semantic tokens (not hardcoded hex values)

### Mobile (NativeBase)
- NativeBase's built-in `useColorMode` hook
- Theme configuration with light/dark mode color definitions
- Shared design tokens between Chakra (web) and NativeBase (mobile) themes

### Settings
- Settings page: toggle between Light / Dark / System
- Icon in header/nav bar for quick toggle

## Step 31: Icon Library

### Web — `react-icons`
- Provides access to Font Awesome, Material Design, Heroicons, Feather, and more from a single package
- Tree-shakeable — only icons actually used are bundled
- Usage: `import { FaWallet } from 'react-icons/fa'`
- Used for: category icons, account type icons, navigation, action buttons

### Mobile — `@expo/vector-icons`
- Built into Expo, includes MaterialIcons, FontAwesome, Ionicons, Feather, etc.
- Usage: `<MaterialIcons name="wallet" size={24} />`
- Same icon names/sets available as web where possible for consistency

### Icon selection in forms
- Category create/edit form: icon picker component (grid of icons to choose from)
- Account create/edit form: icon picker + optional custom logo upload
- Icon identifiers stored as strings in DB (e.g., `"fa-wallet"`, `"material-restaurant"`)

## Step 32: Custom Bank/Institution Logos & Sources of Funds

### Concept
- Accounts represent fully customizable "sources of funds" — not limited to a predefined list
- Users can manually type any bank or institution name (free-text `bank_name` field)
- Users can upload a custom logo image for each account (e.g., their bank's logo)
- No predefined bank list — the user defines everything

### Logo upload flow
1. User creates/edits an account
2. User types bank name (e.g., "BDO", "Maya", "Coins.ph")
3. User optionally uploads a logo image (camera or gallery)
4. Image resized/compressed client-side before upload
5. Stored as `logo_url` on the Account entity

### Storage
- **Mobile:** Logo image stored locally via `expo-file-system` in app document directory. Synced to backend on next sync cycle
- **Backend:** Logo uploaded to `uploads/logos/` directory. Served via NestJS static file serving. `logo_url` stores the relative path
- **Web:** Logo uploaded via file input, sent to `POST /accounts/:id/logo` endpoint

### Display
- Account cards/lists show the custom logo if available
- Falls back to the selected icon from the icon library if no logo
- Logo displayed as a small circular avatar next to the account name

## Step 33: UTC Timestamp Convention

### Rule — all timestamps are UTC
- All `TIMESTAMP` columns in PostgreSQL use `TIMESTAMP WITH TIME ZONE` and store values in UTC
- All timestamps sent over the API are ISO 8601 strings in UTC (e.g., `"2026-06-28T12:00:00.000Z"`)
- Mobile SQLite stores timestamps as Unix epoch (integer) in UTC
- Frontend converts UTC to the user's local timezone **only at the display layer**
- All date/time comparisons, filtering, and cron jobs operate in UTC

### Implementation
- **Backend (TypeORM):** Entity columns use `@CreateDateColumn()` and `@UpdateDateColumn()` which default to UTC. PostgreSQL `timezone` set to `'UTC'` in connection config
- **Mobile (Drizzle):** Timestamps stored as integer Unix epoch (always UTC). `new Date().getTime()` for local writes
- **Frontend display:** Use `date-fns` or `dayjs` with timezone support to format UTC → local for display
- **API requests:** Date filter params (`dateFrom`, `dateTo`) sent as UTC ISO strings
- **Shared util:** `formatDateLocal(utcDate: string, timezone?: string)` in `packages/shared-utils` for consistent display formatting

## Step 34: Subscription Plans & PayMongo Payments

### Business Model
- **Free tier:** Limited features — max 2 accounts, capped transactions/month, basic tracking only (accounts, categories, transactions, budgets, dark mode)
- **Paid tier:** Unlimited accounts & transactions, all premium features unlocked
- **Web:** Monthly subscription via PayMongo (recurring billing)
- **Mobile:** One-time purchase via PayMongo (lifetime access)
- Prices are configurable in the `SubscriptionPlan` table (not hardcoded)

### Free vs Paid Feature Matrix
| Feature | Free | Paid |
|---------|------|------|
| Accounts | Max 2 | Unlimited |
| Transactions/month | Limited | Unlimited |
| Categories & Budgets | Yes | Yes |
| Dark Mode | Yes | Yes |
| Investments | No | Yes |
| PDF Statement Parsing | No | Yes |
| Spending Insights & Analytics | No | Yes |
| CSV Import | No | Yes |
| Financial Goals | No | Yes |
| Bill Reminders | No | Yes |
| Receipt Scanning (OCR) | No | Yes |
| Multi-Currency Conversion | No | Yes |
| Data Export (Excel/PDF) | No | Yes |
| Transaction Search | No | Yes |
| Transaction Image Attachment | No | Yes |
| Transaction Location Tagging | No | Yes |

### PayMongo Integration

#### Backend — `subscriptions` module
- `GET /subscriptions/plans` — list available plans (public, no auth required)
- `GET /subscriptions/me` — current user's subscription status
- `POST /subscriptions/checkout` — create a PayMongo checkout session
  - For web (monthly): creates a PayMongo Subscription or recurring Payment Intent
  - For mobile (one-time): creates a PayMongo Payment Intent
  - Supports: card, GCash, Maya, GrabPay, BPI Online, UnionBank
  - Returns checkout URL → frontend redirects user to PayMongo hosted payment page
- `POST /subscriptions/webhook` — PayMongo webhook endpoint
  - Receives payment events: `payment.paid`, `payment.failed`, `subscription.created`, etc.
  - Updates `Subscription` and `Payment` records accordingly
  - Webhook signature verification for security
- `POST /subscriptions/cancel` — cancel active subscription (web monthly only)
  - Sets status to `cancelled`, access continues until `current_period_end`
- `POST /subscriptions/restore` — restore after app store purchase verification (mobile)

#### PayMongo API Usage
- **Payment Intents** — for one-time mobile purchases
- **Checkout Sessions** — hosted payment page (handles all payment methods)
- **Webhooks** — server-to-server payment confirmation (never trust client-side)
- **Sources** — for e-wallet payments (GCash, Maya, GrabPay)
- All PayMongo API calls via backend only (secret key never exposed to client)
- `PAYMONGO_SECRET_KEY` and `PAYMONGO_PUBLIC_KEY` in `.env`
- `PAYMONGO_WEBHOOK_SECRET` for webhook signature verification

#### Feature Gating (Backend)
- `SubscriptionGuard` — NestJS guard that checks user's active subscription + plan features
- Applied to premium endpoints (investments, insights, goals, etc.)
- Free tier endpoints skip the guard
- `@RequireFeature('investments')` custom decorator for per-endpoint gating
- Returns `403 Forbidden` with message: "This feature requires a Premium subscription"
- Account/transaction creation checks limits against plan's `max_accounts` / `max_transactions_per_month`

#### Feature Gating (Frontend)
- `useSubscription()` hook (from `packages/query-hooks`) — returns current plan + feature flags
- Premium-locked features show:
  - Lock icon overlay on navigation items
  - "Upgrade to Premium" prompt when user tries to access locked feature
  - Upgrade CTA card on dashboard if on free tier
- Mobile: "Unlock Premium" button → opens PayMongo checkout (in-app browser)
- Web: "Subscribe" button → redirects to PayMongo checkout page

#### Mobile One-Time Purchase Flow
1. User taps "Unlock Premium" → app calls `POST /subscriptions/checkout` with `billing_type: 'one_time'`
2. Backend creates PayMongo Payment Intent, returns checkout URL
3. App opens checkout URL in in-app browser (`expo-web-browser`)
4. User completes payment on PayMongo hosted page
5. PayMongo sends webhook to backend → updates Subscription to `active`
6. App polls subscription status or receives push notification → unlocks features
7. Subscription has no `current_period_end` (lifetime access)

#### Web Monthly Subscription Flow
1. User clicks "Subscribe" → frontend calls `POST /subscriptions/checkout` with `billing_type: 'monthly'`
2. Backend creates PayMongo Checkout Session with recurring config, returns URL
3. Frontend redirects to PayMongo hosted payment page
4. User enters payment details (card, GCash, etc.)
5. PayMongo charges and sends webhook → backend creates Subscription with `current_period_start/end`
6. Monthly recurring: PayMongo auto-charges, sends webhook each cycle → backend extends period
7. On cancellation: access continues until `current_period_end`, then status → `expired`
8. `@Cron()` job checks daily for expired subscriptions and downgrades to free

#### Packages
- `paymongo` — PayMongo Node.js SDK (or raw Axios calls to PayMongo REST API)
- `expo-web-browser` — open PayMongo checkout in in-app browser (mobile)

#### Environment Variables (added to `.env.example`)
```env
# PayMongo
PAYMONGO_SECRET_KEY=
PAYMONGO_PUBLIC_KEY=
PAYMONGO_WEBHOOK_SECRET=
PAYMONGO_CHECKOUT_SUCCESS_URL=http://localhost:3001/subscription/success
PAYMONGO_CHECKOUT_CANCEL_URL=http://localhost:3001/subscription/cancel
```

#### Seed Data
- Seed script includes default subscription plans:
  - **Free** — `price: 0`, `billing_type: free`, limited accounts/transactions, basic features
  - **Premium Web** — `price: TBD`, `billing_type: monthly`, `platform: web`, all features
  - **Premium Mobile** — `price: TBD`, `billing_type: one_time`, `platform: mobile`, all features

## Implementation Order

All initialization and infrastructure must be completed **before** any feature work begins. Follow this order strictly.

### Phase 1: Monorepo Initialization & Tooling
1. **Scaffold Turborepo** — `npx create-turbo@latest`, configure `pnpm-workspace.yaml`, `turbo.json`
2. **Root configs** — `tsconfig.base.json`, `jest.config.base.ts`, `.prettierrc`, `eslint.config.mjs`, `.gitignore`, `.env.example`
3. **Turbo pipeline setup** — configure `build`, `dev`, `lint`, `test`, `type-check` pipelines with proper `dependsOn`, `inputs`, `outputs`, and caching
4. **Turbo cache invalidation** — ensure each pipeline task has correct `inputs` globs so changes to source files invalidate the cache, but changes to unrelated files don't. Example:
   ```json
   {
     "build": { "dependsOn": ["^build"], "inputs": ["src/**", "tsconfig.json"], "outputs": ["dist/**"] },
     "lint": { "inputs": ["src/**", "eslint.config.mjs"], "outputs": [] },
     "test": { "dependsOn": ["^build"], "inputs": ["src/**", "jest.config.*"], "outputs": ["coverage/**"] },
     "type-check": { "dependsOn": ["^build"], "inputs": ["src/**", "tsconfig.json"], "outputs": [] },
     "dev": { "cache": false, "persistent": true }
   }
   ```
5. **ESLint + Prettier** — shared flat config at root, per-app extensions (`eslint-config-next` for web, React Native rules for mobile)
6. **Husky + lint-staged** (optional) — pre-commit hooks for auto-format
7. **Scaffold apps via official CLI tools** — NEVER hand-write app `package.json` files. Use:
   - `npx @nestjs/cli new api --package-manager pnpm --skip-git` for backend
   - `npx create-next-app@latest web --typescript --app --tailwind --eslint --src-dir --import-alias "@/*"` for web
   - `npx create-expo-app mobile --template blank-typescript` for mobile
   - After each scaffold: adjust `tsconfig.json` to extend base, add workspace deps, add jest config
   - Shared packages (`packages/*`) are plain TS libraries — manual `package.json` is fine

### Phase 2: Shared Packages Initialization
Initialize each package with `package.json`, `tsconfig.json` (extending base), `jest.config.ts`, and empty `src/index.ts` export barrel.

1. **`packages/shared-types`** — Zod schemas + inferred types for all entities (User, Account, Category, Transaction, Budget, Investment, InvestmentTransaction, Statement, Notification, RefreshToken, Goal, BillReminder, SubscriptionPlan, Subscription, Payment). All DTOs (Create, Update, Response) defined here. No runtime deps besides `zod`
2. **`packages/shared-utils`** — currency formatting, date helpers, `convertCurrency()`, `formatDateLocal()`, financial calculations. Depends on `shared-types`
3. **`packages/api-client`** — Axios instance with interceptors (token attachment, 401 refresh). Typed service classes per module. Depends on `shared-types`
4. **`packages/query-hooks`** — TanStack Query hooks wrapping `api-client`. Query keys, stale times, cache invalidation rules. Depends on `api-client` + `shared-types`
5. **`packages/store`** — Zustand stores (`useAuthStore`, `useAppStore`, `useSyncStore`, `useExportStore`). Persist middleware configured per platform. Depends on `shared-types`
6. **`packages/pdf-parser`** — rule-based PDF parsing. Depends on `shared-types`

Each package must build independently via `turbo build` before proceeding.

### Phase 3: Backend App Initialization (`apps/api`)
1. **Initialize NestJS via CLI** — run `npx @nestjs/cli new api --package-manager pnpm --skip-git` inside `apps/`, then adjust `tsconfig.json` to extend `../../tsconfig.base.json`, add workspace deps, configure TypeORM with PostgreSQL connection, `synchronize: false`
2. **Database config** — data source config, migration scripts in `package.json`
3. **Environment config** — `@nestjs/config` + Zod validation for env vars at startup
4. **Entity files** — create all TypeORM entity files (User, Account, Category, Transaction, Budget, Investment, InvestmentTransaction, Statement, Notification, RefreshToken, Goal, BillReminder, SubscriptionPlan, Subscription, Payment) with proper decorators and relationships
5. **Generate initial migration** — `typeorm migration:generate` after all entities are created
6. **Common infrastructure** — `HttpExceptionFilter`, `ZodValidationPipe`, `JwtAuthGuard`, response interceptor
7. **Scalar API docs** — `@scalar/nestjs-api-reference` + `@nestjs/swagger` setup
8. **Rate limiting** — `@nestjs/throttler` global config
9. **Seed script** — default categories seeder (idempotent)
10. **Verify** — `pnpm --filter api start:dev` connects to DB, runs migrations, seeds categories

### Phase 4: Web App Initialization (`apps/web`)
1. **Initialize Next.js via CLI** — run `npx create-next-app@latest web --typescript --app --tailwind --eslint --src-dir --import-alias "@/*"` inside `apps/`, then adjust `tsconfig.json` to extend `../../tsconfig.base.json`, add workspace deps
2. **Chakra UI setup** — `ChakraProvider` with custom theme (light + dark mode tokens, semantic colors)
3. **Tailwind CSS setup** — `tailwind.config.ts` with Chakra-compatible config, `dark:` variant
4. **Providers** — `QueryClientProvider`, `ChakraProvider` (with `ColorModeScript`), Auth provider
5. **Layout** — root layout with sidebar/nav, responsive shell
6. **ESLint** — extend root config with `eslint-config-next`
7. **Verify** — `pnpm --filter web dev` renders empty shell with Chakra + Tailwind working, dark mode toggleable

### Phase 5: Mobile App Initialization (`apps/mobile`)
1. **Initialize Expo via CLI** — run `npx create-expo-app mobile --template blank-typescript` inside `apps/`, then adjust `tsconfig.json` to extend `../../tsconfig.base.json`, add workspace deps
2. **NativeBase setup** — `NativeBaseProvider` with custom theme (aligned with web Chakra theme tokens)
3. **Drizzle + SQLite** — `drizzle.config.ts`, schema file mirroring backend entities + sync columns, `expo-sqlite` connection
4. **Generate initial Drizzle migration** — `drizzle-kit generate`
5. **React Navigation** — tab navigator + stack navigators per feature
6. **Providers** — `QueryClientProvider` (mobile config), `NativeBaseProvider`, Auth provider, DB provider
7. **Secure storage** — `expo-secure-store` adapter for Zustand auth persist
8. **AsyncStorage** — adapter for Zustand app store persist (theme, filters)
9. **Verify** — `pnpm --filter mobile start` launches with NativeBase themed shell, SQLite DB created, migrations run

### Phase 6: Integration Verification
1. **`turbo build`** — all apps and packages compile without errors
2. **`turbo run lint`** — no lint errors across monorepo
3. **`turbo run type-check`** — no type errors
4. **`turbo run test`** — all tests pass (even if just placeholder tests at this point)
5. **Cross-package imports** — verify `shared-types`, `shared-utils`, `api-client`, etc. import correctly in all three apps
6. **Cache validation** — run `turbo build` twice, confirm second run is fully cached. Modify a file in `shared-types`, confirm dependent packages rebuild but unrelated ones stay cached
7. **Docker** — `docker-compose up` starts postgres + api + web containers

### Phase 7: Feature Implementation
Only after Phases 1-6 are complete, implement features in this order:
1. Auth (email/password + Google OAuth + JWT + refresh tokens)
2. Users (profile CRUD)
3. Accounts (CRUD + custom bank name + logo upload)
4. Categories (CRUD + default seeding + hide/show)
5. Transactions (CRUD + recurring flag + transfers + image attachment + location)
6. Budgets (CRUD + alert threshold)
7. Budget alert notifications + push notifications
8. Investments + InvestmentTransactions + market data fetching
9. PDF statement upload + parsing (server-side + client-side)
10. Offline sync (mobile sync queue + push/pull endpoints)
11. Financial goals
12. Bill reminders + auto-transaction creation
13. Recurring transaction auto-generation (cron)
14. Receipt scanning (mobile OCR)
15. Transaction search (full-text)
16. CSV import
17. Spending insights & analytics
18. Multi-currency dashboard widget
19. Subscription plans + PayMongo integration (checkout, webhooks, feature gating)
20. Dark mode polish
21. Data export (Excel + PDF)

Each feature follows TDD: write failing tests → implement → refactor.

---

## Verification
1. `pnpm install` succeeds at root with all workspaces resolved
2. `turbo build` compiles all apps and packages without errors
3. `turbo dev` starts all three apps concurrently
4. Shared packages import correctly in all three apps
5. `turbo run test` — all Jest tests pass across apps and packages
6. `docker-compose up` — builds and starts web, api, and postgres containers
7. NestJS connects to PostgreSQL and runs migrations
8. Mobile app creates local SQLite database via Drizzle
9. Auth flow works end-to-end (register → login → JWT → protected routes)
10. PDF upload and parsing returns structured transaction data
11. GitHub Actions CI pipeline passes on push (lint, test, build, Docker build)
12. Recurring transaction cron job generates transactions correctly
13. Receipt OCR extracts text and pre-fills transaction form (mobile)
14. Financial goals CRUD and progress tracking works
15. Bill reminders send push notifications on schedule
16. Multi-currency widget displays converted totals
17. Transaction search returns relevant results with highlighting
18. CSV import parses, previews, and saves transactions
19. Spending insights endpoints return correct analytics data
20. Dark mode toggles correctly on both web and mobile
21. Icons render correctly from icon library on both web and mobile
22. Custom bank logo upload, storage, and display works on web and mobile
23. All timestamps stored as UTC, displayed in local timezone
24. Transaction image attachment works (capture, upload, display) on web and mobile
25. Transaction location tagging works (auto-detect GPS, manual entry, display)
26. PayMongo checkout flow works (one-time mobile purchase, monthly web subscription)
27. PayMongo webhook updates subscription status correctly
28. Feature gating blocks premium features for free tier users
29. Subscription plans seeded correctly (Free, Premium Web, Premium Mobile)
