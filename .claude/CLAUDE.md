# CLAUDE.md — Financial Tracker V2

## Project Overview
Turborepo monorepo for a financial tracker with three apps: Next.js web, Expo React Native mobile (offline-first), and NestJS backend. Key features: PDF financial statement parsing, receipt scanning (on-device OCR), investment portfolio tracking (crypto, US stocks, PH stocks), recurring transactions, financial goals, bill reminders, spending insights, CSV import, multi-currency support, dark mode, and offline-first mobile with DB-based sync queue. Default currency: PHP. **Out of scope:** shared accounts / family mode.

## Monorepo Structure
```
apps/
  web/        → Next.js + Chakra UI + Tailwind CSS
  mobile/     → Expo + React Native + NativeBase + Drizzle/SQLite
  api/        → NestJS + TypeORM + PostgreSQL
packages/
  shared-types/   → Zod schemas + inferred TypeScript types (single source of truth)
  shared-utils/   → Currency, date, financial calculations, currency conversion
  api-client/     → Axios instances + typed service classes
  query-hooks/    → Shared TanStack Query hooks
  store/          → Shared Zustand stores
  pdf-parser/     → Rule-based PDF parsing logic
```

## Tech Stack
- **Language:** TypeScript everywhere
- **Package manager:** pnpm
- **Build system:** Turborepo
- **Validation:** Zod — all DTOs defined as Zod schemas in `shared-types`, types inferred via `z.infer`
- **State management:** Zustand (client state) + TanStack Query (server state)
- **HTTP client:** Axios instances in `api-client` package
- **Auth:** JWT + Passport (NestJS) — email/password + Google OAuth. Tokens in `expo-secure-store` on mobile
- **Testing:** Jest (TDD approach), `ts-jest`, `@testing-library/react`, `@testing-library/react-native`
- **Charts:** Recharts (web), react-native-chart-kit or Victory Native (mobile)
- **Export:** `exceljs` (Excel), `jspdf` + `jspdf-autotable` (PDF)
- **Containerization:** Docker (web + api) + docker-compose (with PostgreSQL)
- **CI/CD:** GitHub Actions
- **Linting:** ESLint (flat config) + Prettier, shared config at root
- **API docs:** Scalar (`@scalar/nestjs-api-reference`) + `@nestjs/swagger` for OpenAPI spec
- **Rate limiting:** `@nestjs/throttler`
- **Forms:** `react-hook-form` + `@hookform/resolvers/zod`
- **Icons:** `react-icons` (web), `@expo/vector-icons` (mobile)
- **Timestamps:** All stored/transmitted as UTC. Frontend converts to local timezone for display only

## Data Model
- **User** → has many Accounts, Categories, Budgets, Investments, Statements, Notifications, RefreshTokens, Goals, BillReminders
- **Account** → has many Transactions, Investments. Types: `checking`, `savings`, `credit_card`, `cash`, `investment`, `loan`, `e_wallet`. Fully customizable sources of funds — user-defined `bank_name` (free text) + optional custom logo upload (`logo_url`)
- **Category** → has many Transactions and Budgets. Types: `expense` | `income`. Supports subcategories via `parent_id`. System defaults (user_id=NULL) cannot be deleted, only hidden
- **Transaction** → belongs to Account + Category. Types: `income` | `expense` | `transfer`. Supports recurring, transfers between accounts, image attachment (`image_url`), and GPS location tagging (`latitude`, `longitude`, `location_name`)
- **Budget** → belongs to Category. Periods: `weekly` | `monthly` | `yearly`. Has alert threshold → triggers Notification
- **Investment** → belongs to User + Account (investment type). Asset types: `crypto` | `us_stock` | `ph_stock`
- **InvestmentTransaction** → belongs to Investment. Types: `buy` | `sell` | `dividend`
- **Statement** → uploaded PDF linked to User and optionally Account
- **Goal** → belongs to User. Savings targets with progress tracking (`current_amount` vs `target_amount`)
- **BillReminder** → belongs to User. Recurring bills with due dates, push notification reminders, optional auto-transaction creation
- **Notification** → belongs to User. Types: `budget_alert` | `bill_reminder` | `goal_reached` | `sync_conflict` | `statement_parsed` | `system`
- **ExchangeRate** → shared across all users. Cached daily exchange rates for currency conversion
- **RefreshToken** → belongs to User. Hashed, revocable, per-device
- **SubscriptionPlan** → admin-defined plans (Free, Premium Web, Premium Mobile). Feature flags in JSONB `features` column
- **Subscription** → belongs to User (one active per user). Tracks plan, status, PayMongo IDs, billing period
- **Payment** → belongs to User + Subscription. PayMongo payment history (amount, method, status)

### Auth
- Email/password sign-up (bcrypt) + Google OAuth 2.0 (`passport-google-oauth20`)
- Users can have both auth methods linked (`auth_provider: 'both'`)
- Refresh token rotation, hashed, revocable, per-device

### Default Categories (seeded via `pnpm --filter api seed`)
**Expense:** Food & Dining, Groceries, Rent/Housing, Utilities, Transportation, Clothing, Healthcare/Medical, Entertainment, Subscriptions, Education, Insurance, Personal Care, Gifts & Donations, Miscellaneous
**Income:** Salary/Wages, Freelance Income, Interest/Dividends, Savings/Investment Returns
- Seed script is idempotent (safe to run multiple times)
- Users can add custom categories, edit them, and hide (not delete) defaults

### Mobile Persistence
- `expo-secure-store` → auth tokens, credentials (encrypted)
- `@react-native-async-storage/async-storage` → theme, filters, onboarding state (non-sensitive preferences)
- Zustand `persist` middleware with appropriate adapter per store

## Development Methodology — TDD
All feature development follows Test-Driven Development:
1. **Red:** Write a failing test first
2. **Green:** Write minimum code to pass
3. **Refactor:** Clean up while tests stay green

Always write the test file before the implementation file.

## Commands
```bash
# Install dependencies
pnpm install

# Run all apps in dev mode
turbo dev

# Run individual apps
pnpm --filter web dev
pnpm --filter mobile start
pnpm --filter api start:dev

# Run all tests
turbo run test

# Run tests in watch mode (for TDD)
pnpm --filter <package> test -- --watch

# Lint & format
turbo run lint

# Type check
turbo run type-check

# Build all
turbo build

# Seed default categories
pnpm --filter api seed

# Docker
docker-compose up              # Start all services (postgres, api, web)
docker-compose -f docker-compose.dev.yml up  # Dev mode with hot-reload
```

## Migration Rules — NEVER hand-write migration files

### Backend (TypeORM + PostgreSQL)
```bash
pnpm --filter api typeorm migration:generate src/database/migrations/<MigrationName>
pnpm --filter api typeorm migration:run
pnpm --filter api typeorm migration:revert
pnpm --filter api typeorm migration:show
```
- `synchronize: false` in ALL environments
- Always generate migrations via CLI after modifying entity files
- Commit generated migration files to git

### Mobile (Drizzle + SQLite)
```bash
pnpm --filter mobile drizzle-kit generate
pnpm --filter mobile drizzle-kit drop          # dev only
```
- Always generate migrations via CLI after modifying `schema.ts`
- Migrations run automatically at app startup via `migrate()`
- Commit generated SQL migration files to git

## Code Conventions

### Error Handling
- All API errors follow a consistent format: `{ statusCode, message, error, errors[], timestamp, path }`
- NestJS: global `HttpExceptionFilter` formats all exceptions
- Web: React Error Boundary at app root + TanStack Query `onError` for API error toasts
- Mobile: Error Boundary + graceful offline error handling (queue, don't crash)
- Never expose stack traces in production

### Validation (Zod)
- Define all schemas in `packages/shared-types`
- Infer TypeScript types from Zod: `export type Transaction = z.infer<typeof TransactionSchema>`
- Never duplicate type definitions — always derive from Zod schemas
- NestJS uses `ZodValidationPipe` with shared schemas
- Frontend forms use `@hookform/resolvers/zod` with the same shared schemas
- Environment variables validated with Zod at app startup (fail fast)

### Pagination
- All list endpoints use cursor-based pagination: `?cursor=<id>&limit=20`
- Response: `{ data: [], meta: { hasNextPage, nextCursor, total } }`
- Frontend uses TanStack Query `useInfiniteQuery` for paginated lists

### State Management
- **Server state** (data from API): TanStack Query via `packages/query-hooks`
- **Client state** (UI, auth, preferences): Zustand via `packages/store`
- Never mix the two — don't put API data in Zustand stores
- Zustand auth store on mobile persists to `expo-secure-store`
- Zustand app store on mobile persists to `AsyncStorage`

### API Client
- All HTTP calls go through Axios instances in `packages/api-client`
- Never use raw `fetch()` or standalone `axios` calls in app code
- Interceptors handle JWT token attachment and 401 refresh automatically

### Secure Storage (Mobile)
- All sensitive data (tokens, credentials, secrets) stored via `expo-secure-store`
- Never use `AsyncStorage` for sensitive data
- `AsyncStorage` is only for non-sensitive preferences (theme, filters, onboarding)

### File Storage
- Mobile: transaction images (receipts, proofs), PDFs, and custom logos stored locally via `expo-file-system` (device document directory)
- Backend: PDF uploads and account logos stored to `uploads/` directory (local disk for now, cloud storage TBD)
- Account logos: `uploads/logos/` — user-uploaded bank/institution images

### Icons
- Web: `react-icons` (Font Awesome, Material, Heroicons, Feather — tree-shakeable)
- Mobile: `@expo/vector-icons` (MaterialIcons, FontAwesome, Ionicons, Feather — built into Expo)
- Icon identifiers stored as strings in DB (e.g., `"fa-wallet"`, `"material-restaurant"`)
- Category and account forms include an icon picker component

### Timestamps — UTC Everywhere
- All `TIMESTAMP` columns in PostgreSQL use `TIMESTAMP WITH TIME ZONE`, stored as UTC
- All API timestamps are ISO 8601 UTC strings (e.g., `"2026-06-28T12:00:00.000Z"`)
- Mobile SQLite stores timestamps as Unix epoch (integer) in UTC
- Frontend converts UTC → local timezone **only at the display layer**
- Date filter params in API requests sent as UTC ISO strings
- `formatDateLocal()` utility in `packages/shared-utils` for consistent display formatting

### NestJS Backend
- One module per feature: `auth`, `users`, `accounts`, `transactions`, `categories`, `budgets`, `investments`, `statements`, `notifications`, `goals`, `bill-reminders`, `subscriptions`, `import`, `sync`
- Each module: controller + service + entity + DTOs
- Request validation via shared Zod schemas (not class-validator)
- Rate limiting via `@nestjs/throttler` (strict on auth, relaxed on reads)
- API docs via Scalar + `@nestjs/swagger` at `/api/docs` (dev only)

### Currency Conversion
- User sets a primary currency in their profile
- Exchange rates fetched server-side, cached daily via `@Cron()`
- `convertCurrency()` utility in `packages/shared-utils`
- Account balances stored in native currency, converted on-the-fly for display

### Testing
- Co-locate test files: `*.spec.ts` next to implementation files
- NestJS: unit tests (mocked repos) + integration tests (TestingModule) + E2E tests (supertest)
- Web: `@testing-library/react` for components and hooks
- Mobile: `@testing-library/react-native` for screens and components
- Shared packages: unit tests for all exported functions

### Investment & Market Data
- Market data fetched server-side only (API keys stay on backend, never exposed to clients)
- Supported: crypto (CoinGecko), US stocks (Alpha Vantage/Yahoo Finance), PH stocks (PSE Edge)
- Prices cached in DB, refreshed via NestJS `@Cron()` scheduler during market hours
- Price data is shared across users (same symbol = same price) — not duplicated per user

### Mobile Offline Sync
- All sync state tracked in SQLite via `sync_queue` table and `sync_status` columns on entities
- Changes queue in DB, not in memory
- Sync triggers: connectivity restored, app foreground, background task via `expo-task-manager`
- Synced entity types: transaction, account, category, budget, investment, investment_transaction, goal, bill_reminder

### Recurring Transactions
- Backend `@Cron()` job auto-generates transactions based on `is_recurring` flag and `recurring_interval`
- Runs daily, creates new transaction records for due recurring entries
- Mobile receives auto-generated transactions via sync pull

### Transaction Image Attachments & Location
- Image attachment is **optional** — transactions work fine without an image (`image_url` nullable)
- Location is **optional** — transactions work fine without location (`latitude`, `longitude`, `location_name` all nullable)
- Mobile: image via `expo-camera` or `expo-image-picker`, compressed via `expo-image-manipulator`, stored via `expo-file-system`
- Mobile: location via `expo-location` (auto-detect GPS + reverse geocoding for `location_name`)
- Web: image via file input upload, location via browser Geolocation API or manual text entry
- Backend: images stored to `uploads/transactions/` directory

### Receipt Scanning (Mobile-Only, On-Device OCR)
- Google ML Kit via `@infinitered/react-native-mlkit-text-recognition` (free, open source, Expo-native)
- Fully on-device — works offline, no API keys, no backend processing needed
- Camera capture via `expo-camera`, gallery via `expo-image-picker`
- Extracts text → regex parsing for amount, date, merchant → pre-fills transaction form
- Receipt image stored locally via `expo-file-system`

### Financial Goals
- CRUD for savings goals with `target_amount` and `current_amount`
- Progress tracking with visual progress bars
- Auto-complete when `current_amount >= target_amount` → triggers `goal_reached` notification

### Bill Reminders
- Recurring bill reminders with configurable `reminder_days_before` due date
- Push notifications via `expo-notifications`
- Optional `auto_create_transaction` on due date
- Backend `@Cron()` checks daily for upcoming bills

### Transaction Search
- Full-text search via PostgreSQL `tsvector` + `tsquery`
- Searchable fields: description, tags
- Combinable with existing pagination filters

### CSV Import
- `POST /import/csv` — upload, parse, preview, then confirm
- Column mapping UI for flexible CSV formats
- Duplicate detection before saving

### Spending Insights & Analytics
- Backend endpoints for: spending by category, trends, income vs expense, top merchants, savings rate, budget utilization
- Frontend insights page with charts and period selectors

### Dark Mode
- Web: Chakra UI `ColorModeProvider` + Tailwind `dark:` variant
- Mobile: NativeBase `useColorMode`
- User preference: Light / Dark / System (stored in Zustand `useAppStore`)
- All colors use semantic tokens, not hardcoded values

### Subscriptions & Payments (PayMongo)
- **Free tier:** Max 2 accounts, limited transactions/month, basic features (accounts, categories, transactions, budgets, dark mode)
- **Paid tier:** Unlimited everything + all premium features (investments, insights, goals, bill reminders, PDF parsing, OCR, CSV import, export, multi-currency, search, image attachments, location)
- **Web:** Monthly subscription via PayMongo
- **Mobile:** One-time purchase via PayMongo (lifetime access)
- PayMongo payment methods: cards, GCash, Maya, GrabPay, BPI Online, UnionBank
- Prices configurable in `SubscriptionPlan` table (not hardcoded)
- `SubscriptionGuard` + `@RequireFeature()` decorator for backend feature gating
- `useSubscription()` hook for frontend feature gating
- PayMongo webhooks for payment confirmation (never trust client-side)
- `PAYMONGO_SECRET_KEY`, `PAYMONGO_PUBLIC_KEY`, `PAYMONGO_WEBHOOK_SECRET` in `.env`

### Out of Scope
- Shared accounts / family mode — explicitly excluded

## File Naming
- TypeScript files: `kebab-case.ts` / `kebab-case.tsx`
- Test files: `kebab-case.spec.ts`
- NestJS: `feature.controller.ts`, `feature.service.ts`, `feature.entity.ts`, `feature.module.ts`
- Zod schemas: `feature.schema.ts`
- Zustand stores: `use-feature-store.ts`
- Env config: `.env.example` committed, `.env` in `.gitignore`

## Package Scoping
All packages use `@financial-tracker/` scope:
- `@financial-tracker/shared-types`
- `@financial-tracker/shared-utils`
- `@financial-tracker/api-client`
- `@financial-tracker/query-hooks`
- `@financial-tracker/store`
- `@financial-tracker/pdf-parser`

## Implementation Order
**All infrastructure and initialization must be done before any feature work.**
1. Monorepo scaffold + root configs (tsconfig, eslint, prettier, turbo pipelines + cache invalidation)
2. Shared packages initialized (shared-types → shared-utils → api-client → query-hooks → store → pdf-parser)
3. Backend app initialized (NestJS + TypeORM + entities + migration + common infra + seed)
4. Web app initialized (Next.js + Chakra UI + Tailwind + providers)
5. Mobile app initialized (Expo + NativeBase + Drizzle/SQLite + React Navigation + providers)
6. Integration verification (`turbo build`, `turbo lint`, `turbo test`, cross-package imports, cache validation, docker-compose)
7. Feature implementation in order (auth → accounts → categories → transactions → budgets → investments → PDF → sync → goals → bills → recurring → OCR → search → CSV → insights → multi-currency → subscriptions/PayMongo → dark mode → export)

### Turbo Cache Invalidation
- Every pipeline task in `turbo.json` must have correct `inputs` globs so Turborepo caches properly
- `build`: inputs `src/**`, `tsconfig.json`; outputs `dist/**`
- `lint`: inputs `src/**`, `eslint.config.mjs`; no outputs
- `test`: inputs `src/**`, `jest.config.*`; outputs `coverage/**`
- `dev`: `cache: false`, `persistent: true`
- Changing a file in `shared-types` must invalidate builds of all packages that depend on it
