# UI-PLAN.md — Financial Tracker V2

## Overview
A personal financial tracker with a **web app** (Next.js + Tailwind CSS) and a **mobile app** (Expo + React Native + NativeBase). Both share the same design language, color palette, and iconography. The mobile app is offline-first. Default currency: PHP.

> **Note:** The web app uses **Tailwind CSS only** for styling (no Chakra UI components). ChakraProvider was removed due to CSS conflicts with Tailwind v4. All web UI is built with Tailwind utility classes.

---

## Current Implementation Status

### Web App — Pages Built
All pages use Tailwind CSS utility classes, `react-hook-form` + `zodResolver` for forms, and TanStack Query hooks for data fetching.

| Route | Status | Description |
|-------|--------|-------------|
| `/` | Done | Redirect: authenticated → `/dashboard`, unauthenticated → `/login` |
| `/login` | Done | Email/password sign-in form, server error display, link to register |
| `/register` | Done | First/last name, email, password, default currency PHP |
| `/dashboard` | Done | 4 summary cards, recent transactions, active goals, upcoming bills |
| `/accounts` | Done | 3-column card grid, inline create form, delete per card |
| `/transactions` | Done | Table view, inline create form, colored type/amount badges |
| `/categories` | Done | 2-column (expense/income), hide defaults, delete custom |
| `/budgets` | Done | 3-column card grid, progress bar placeholder, alert threshold |
| `/investments` | Done | Table with P&L, inline create form, investment accounts only |
| `/goals` | Done | 2-column cards, progress bars, inline "Add Funds" flow |
| `/bills` | Done | Vertical list, inline create form, auto-create badge |
| `/insights` | Done | Period selector, spending by category bars, monthly trends table |
| `/settings` | Done | Profile form, change password, read-only email |
| `/import` | Done | 2-step CSV import (upload + preview/confirm) |
| `/export` | Done | Date range + format cards (CSV, Excel, PDF) |

### Web App — Components Built
| Component | Description |
|-----------|-------------|
| `AuthGuard` | Redirects to `/login` if not authenticated |
| `Sidebar` | 256px fixed sidebar with 12 nav links, theme toggle, sign out |
| `ThemeProvider` | Manages dark/light/system mode via `dark` class on `<html>` |

### Web App — Lib/Hooks Built
| File | Description |
|------|-------------|
| `api.ts` | Axios client setup, token refresh, service singletons for all modules |
| `auth-hooks.ts` | `useLogin`, `useRegister`, `useLogout`, `useCurrentUser` |
| `crud-hooks.ts` | All CRUD hooks: accounts, transactions, categories, budgets, goals, bills, investments, insights |
| `env.ts` | Zod-validated env vars (`NEXT_PUBLIC_API_URL`) |

### Backend — Seeded Data
Two demo users with password `Home@1234`:
- `admin@financialtracker.com` (Admin User)
- `demo@financialtracker.com` (Demo User)

Per user demo data:
- **4 accounts:** Cash Wallet (₱5k), BDO Savings (₱50k), GCash (₱12k), BPI Credit Card (-₱15k)
- **27 transactions:** Realistic mix over 2 months (salary, groceries, dining, transport, utilities, subscriptions, entertainment, etc.)
- **4 budgets:** Food & Dining (₱15k/mo), Transportation (₱5k/mo), Entertainment (₱3k/mo), Groceries (₱10k/mo)
- **2 goals:** Emergency Fund (₱45k/₱100k), New Laptop (₱25k/₱80k)
- **3 bill reminders:** Meralco Electric (day 15), PLDT Internet (day 5), Netflix (day 20)
- **18 default categories:** 14 expense + 4 income (system defaults, user_id=NULL)
- **3 subscription plans:** Free, Premium Web (₱199/mo), Premium Mobile (₱499 one-time)

---

## Design System

### Color Palette — Purple Primary
| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `primary` | `#6B46C1` (purple.600) | `#B794F4` (purple.300) | Primary actions, active nav, links, brand color |
| `primary.hover` | `#553C9A` (purple.700) | `#D6BCFA` (purple.200) | Button hover, active states |
| `primary.subtle` | `#FAF5FF` (purple.50) | `#322659` (purple.900) | Primary backgrounds, selected states |
| `accent` | `#319795` (teal.500) | `#4FD1C5` (teal.300) | Secondary accent, complementary highlights, chart accents |
| `income` | `#38A169` (green.500) | `#68D391` (green.300) | Income amounts, positive values, success |
| `expense` | `#E53E3E` (red.500) | `#FC8181` (red.300) | Expense amounts, negative values, errors, delete |
| `warning` | `#DD6B20` (orange.500) | `#F6AD55` (orange.300) | Budget alerts, warnings, near-limit |
| `transfer` | `#3182CE` (blue.500) | `#63B3ED` (blue.300) | Transfer amounts, info states |
| `premium` | `#D69E2E` (yellow.500) | `#F6E05E` (yellow.300) | Premium badge, upgrade CTA, subscription highlights |
| `neutral.bg` | `#F7FAFC` (gray.50) | `#1A202C` (gray.800) | Page background |
| `neutral.card` | `#FFFFFF` | `#2D3748` (gray.700) | Card/surface background |
| `neutral.border` | `#E2E8F0` (gray.200) | `#4A5568` (gray.600) | Borders, dividers |
| `neutral.text` | `#1A202C` (gray.800) | `#F7FAFC` (gray.50) | Primary text |
| `neutral.muted` | `#718096` (gray.500) | `#A0AEC0` (gray.400) | Secondary/muted text |

**Why purple + teal:** Purple is the brand identity. Teal provides a complementary cool-tone accent that contrasts well without clashing. Green/red remain reserved for income/expense semantics. Gold/yellow highlights premium features.

> **Current state:** The web app currently uses `blue-600` for primary buttons and `zinc-*` for neutrals (Tailwind defaults). These should be migrated to the purple primary palette defined above.

### Typography
- **Web:** Geist + Geist Mono (loaded via `next/font/google` in `layout.tsx`)
- **Mobile:** System default (San Francisco on iOS, Roboto on Android)
- **Scale:**
  - `xs`: 12px — captions, timestamps
  - `sm`: 14px — secondary text, labels
  - `md`: 16px — body text (base)
  - `lg`: 18px — subheadings, card titles
  - `xl`: 20px — section headings
  - `2xl`: 24px — page titles
  - `3xl`: 30px — dashboard hero numbers (total balance, net worth)
- **Weights:** Regular (400), Medium (500), Semibold (600), Bold (700)
- **Amounts:** Always use tabular/monospace figures for financial numbers

### Spacing Scale
Uses 4px base unit: `4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80`
- Card padding: 16px (mobile), 24px (web)
- Section gaps: 24px (mobile), 32px (web)
- List item vertical padding: 12px

### Border Radius
- Cards: 12px
- Buttons: 8px
- Inputs: 8px
- Avatars/logos: full circle (50%)
- Chips/tags: 16px (pill shape)

### Shadows (Light Mode)
- `card`: `0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)`
- `card-hover`: `0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)`
- `modal`: `0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)`
- Dark mode: no shadows, use borders instead

### Icons
- **Web:** `react-icons` — primarily use Feather (`fi`) for UI icons, Font Awesome (`fa`) for categories
- **Mobile:** `@expo/vector-icons` — Feather for UI, MaterialIcons/FontAwesome for categories
- Icon size: 20px (inline), 24px (list items), 32px (cards), 48px (empty states)

> **Current state:** The web sidebar uses emoji-style text icons. Category icons are stored in the DB as `fa-*` strings but not yet rendered as actual icon components.

---

## Component Library

### Buttons
| Variant | Usage | Style |
|---------|-------|-------|
| `solid-primary` | Primary actions (Save, Add, Confirm) | Filled primary color, white text |
| `outline` | Secondary actions (Cancel, Filter) | Border only, primary color text |
| `ghost` | Tertiary actions (Edit, View) | No border/bg, primary text, hover bg |
| `danger` | Destructive actions (Delete) | Red filled or red outline |
| `icon` | Icon-only actions (menu, close, settings) | Ghost style, square, centered icon |

> **Current state:** Buttons use inline Tailwind classes (e.g., `bg-blue-600 hover:bg-blue-700 text-white rounded-lg`). No shared button component exists yet. Should be extracted into a reusable `<Button>` component with variant props.

### Cards
- White/dark surface with subtle shadow (light) or border (dark)
- 12px radius, 16-24px padding
- Optional header with title + action button
- Used for: account cards, transaction items, budget cards, goal cards, widgets

> **Current state:** Cards use `bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700 p-6`. Pattern is consistent across pages but not extracted into a component.

### Form Inputs
- Label above input (always visible, not placeholder-as-label)
- 8px radius, 1px border
- Focus: 2px primary color border ring
- Error: red border + error message below
- Helper text in muted color below input
- Consistent height: 40px (web), 48px (mobile, larger touch target)

> **Current state:** Inputs use `w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500`. Validation errors show as red `<p>` elements below inputs. Pattern is consistent but not componentized.

### Transaction Amount Display
- Income: green text with `+` prefix
- Expense: red text with `-` prefix
- Transfer: blue text with arrow icon
- Currency symbol before amount (e.g., `PHP 1,234.50`)
- Always 2 decimal places for fiat, up to 8 for crypto

> **Current state:** Transaction page colors amounts green (income) / red (expense) / blue (transfer). Dashboard uses `formatCurrency()` from shared-utils. The amount display is inline, not a component.

### Tags/Chips
- Pill shape (16px radius)
- Small text (12px)
- Colored background with matching text
- Used for: transaction tags, category badges, status indicators

### Empty States
- Centered illustration/icon (48px, muted color)
- Title text (lg, semibold)
- Description text (sm, muted)
- CTA button if applicable
- Example: "No transactions yet — Add your first transaction"

> **Current state:** Empty states exist but are minimal — just text like "No accounts yet." or "No transactions yet." with no icons or illustrations.

### Loading States
- Skeleton screens (shimmer effect) for content loading
- Spinner for action buttons (inline, replaces text)
- Pull-to-refresh on mobile lists
- Progressive loading for charts

> **Current state:** Loading states show "Loading..." text. The root redirect page (`/`) shows a CSS spinner. No skeleton screens implemented yet.

### Toast/Snackbar Notifications
- Bottom-center (web), bottom (mobile)
- Success: green left border
- Error: red left border
- Info: blue left border
- Auto-dismiss after 4 seconds, swipe to dismiss on mobile

> **Current state:** No toast system implemented. Errors show as inline banners or `alert()`. Success feedback is missing in most mutation flows.

---

## Navigation Structure

### Web — Sidebar + Top Bar

> **Current implementation:** Fixed 256px sidebar (no top bar). No collapsible behavior. No notification bell. Theme toggle is in the sidebar footer. User name displayed at bottom.

```
┌──────────────────────────────────────────────────┐
│ Financial Tracker                                 │  ← Sidebar header
├──────────┬───────────────────────────────────────┤
│          │                                       │
│ Dashboard│         Main Content Area             │
│ Accounts │         (p-6, bg-zinc-50)             │
│ Transact.│                                       │
│ Budgets  │                                       │
│ Categor. │                                       │
│ Invest.  │                                       │
│ Goals    │                                       │
│ Bills    │                                       │
│ Insights │                                       │
│ Export   │                                       │
│ Import   │                                       │
│ Settings │                                       │
│ ──────── │                                       │
│ [User]   │                                       │
│ [Theme]  │                                       │
│ [Logout] │                                       │
└──────────┴───────────────────────────────────────┘
```

**Target design:**
- Sidebar: 240px wide, collapsible to 64px (icon-only) on smaller screens
- Top bar: logo left, notification bell + dark mode toggle + user avatar right
- Active nav item: primary color background, primary color text + icon
- Sidebar footer: Settings link
- Mobile web (< 768px): sidebar becomes a hamburger drawer

### Mobile — Bottom Tab Navigator + Stack Navigators
```
┌─────────────────────────────┐
│         Stack Content       │
│         (per tab)           │
│                             │
│                             │
│                             │
│                        [+]  │  ← FAB (Add Transaction)
├─────────────────────────────┤
│ 🏠    📊    ➕    💰    ⋯  │  ← Bottom tabs
│ Home  Trans  Add  Accts More│
└─────────────────────────────┘
```
- 5 bottom tabs: Home, Transactions, Add (center, highlighted), Accounts, More
- "Add" tab opens the Add Transaction screen (not a tab, acts as a modal/push)
- "More" tab: Budgets, Investments, Goals, Bill Reminders, Insights, Statements, Import, Settings
- Each tab has its own stack navigator for drill-down screens
- Header bar per screen: back arrow (if nested), title, optional action buttons

---

## Screens — Web App

### 1. Dashboard

> **Current implementation:** Shows 4 summary cards in a row (Total Balance, Monthly Income, Monthly Expenses, Net This Month), then a 2-column grid with recent transactions list and goals + bills sidebar. Uses `zinc-*` colors, `blue-600` accents. No charts — values are text only.

**Target design:**
```
┌─────────────────────────────────────────────────────────┐
│ Dashboard                                     June 2026 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ┌─────────────────────┐ ┌─────────────────────────────┐ │
│ │ Total Balance        │ │ Income vs Expense (Month)   │ │
│ │ PHP 245,830.50       │ │ ┌────┐     ┌────┐          │ │
│ │ +2.3% from last mo.  │ │ │████│     │▓▓▓▓│          │ │
│ │                      │ │ │████│     │▓▓▓▓│          │ │
│ │ [See all accounts →] │ │ Inc: 85k  Exp: 62k         │ │
│ └─────────────────────┘ └─────────────────────────────┘ │
│                                                         │
│ ┌──────────────────────────────────────────────────────┐│
│ │ Recent Transactions                    [View All →]  ││
│ │ ──────────────────────────────────────────────────── ││
│ │ 🍔 Food & Dining    Jollibee     -PHP 350.00  Today ││
│ │ 💰 Salary           June pay    +PHP 45,000  Jun 25 ││
│ │ 🚗 Transportation   Grab ride    -PHP 180.00  Jun 24 ││
│ │ 🛒 Groceries        SM Market    -PHP 2,150   Jun 23 ││
│ └──────────────────────────────────────────────────────┘│
│                                                         │
│ ┌───────────────────────┐ ┌────────────────────────────┐│
│ │ Budget Progress       │ │ Upcoming Bills             ││
│ │ Food: ████████░░ 78%  │ │ Netflix     Jul 1  PHP 549 ││
│ │ Trans: █████░░░░ 45%  │ │ Electric    Jul 5  PHP 3.2k││
│ │ Subs:  ██████████ 95% │ │ Internet    Jul 10 PHP 1.8k││
│ │ [View budgets →]      │ │ [View all →]               ││
│ └───────────────────────┘ └────────────────────────────┘│
│                                                         │
│ ┌───────────────────────┐ ┌────────────────────────────┐│
│ │ Goals Progress        │ │ Multi-Currency Holdings    ││
│ │ 🎯 Emergency Fund    │ │ PHP  ████████████ 180k     ││
│ │ ████████░░░ 72%       │ │ USD  ████░░░░░░░ $450      ││
│ │ PHP 72k / PHP 100k   │ │ BTC  ██░░░░░░░░░ 0.015     ││
│ │ [View goals →]        │ │ Net Worth: PHP 245,830     ││
│ └───────────────────────┘ └────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

**Widgets (responsive grid):**
1. **Total Balance** — hero number, percentage change from last month, link to accounts
2. **Income vs Expense** — bar chart for current month, shows net savings
3. **Recent Transactions** — last 5 transactions, each with icon, category, description, amount, date
4. **Budget Progress** — top 3-4 budgets with progress bars, percentage, link to budgets page
5. **Upcoming Bills** — next 3-4 bills due, due date, amount
6. **Goals Progress** — top goals with progress bars
7. **Multi-Currency Holdings** — balances per currency, converted total in primary currency

**Layout:** 2-column grid on desktop (lg+), single column on tablet/mobile
**Period selector:** dropdown in header — This Month, Last Month, This Year, Custom Range

### 2. Accounts Page

> **Current implementation:** 3-column card grid showing color dot, account type badge, name, bank name, balance. Inline form toggle for creation. Delete button per card. No proportional bars, no custom logos.

**Target design:**
```
┌─────────────────────────────────────────────────────────┐
│ Accounts                                  [+ Add Account]│
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Total Balance: PHP 52,000.00                            │
│                                                         │
│ ┌─────────────────────────┐ ┌─────────────────────────┐ │
│ │ [BDO Logo] BDO Savings  │ │ [GCash Logo] GCash      │ │
│ │ Savings Account         │ │ E-Wallet                │ │
│ │ PHP 50,000.00           │ │ PHP 12,000.00           │ │
│ └─────────────────────────┘ └─────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────┐ ┌─────────────────────────┐ │
│ │ 💰 Cash Wallet          │ │ 💳 BPI Credit Card      │ │
│ │ Cash                    │ │ Credit Card             │ │
│ │ PHP 5,000.00            │ │ PHP -15,000.00          │ │
│ └─────────────────────────┘ └─────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

**Account Cards:**
- Custom logo (circular avatar) or fallback icon
- Account name (bold) + bank name (muted)
- Account type badge (chip)
- Balance in native currency
- If foreign currency: converted amount in PHP below
- Credit cards show negative balance in red
- Click card → Account Detail page (transactions filtered to that account)

**Add/Edit Account Form:**
- Name (required)
- Bank name (optional, free text)
- Account type (dropdown: checking, savings, credit_card, cash, investment, loan, e_wallet)
- Currency (dropdown with search)
- Starting balance
- Color picker (preset palette)
- Icon picker (grid of icons)
- Logo upload (optional: camera/gallery, with preview and remove button)

### 3. Transactions Page

> **Current implementation:** Full-width HTML table with columns: Date, Description, Type, Amount, Actions. Inline form toggle. Type badges colored green/red/blue. No search, no filters, no grouping by date, no pagination. Category not shown in the list.

**Target design:**
```
┌─────────────────────────────────────────────────────────┐
│ Transactions                              [+ Add Trans.] │
├─────────────────────────────────────────────────────────┤
│ [🔍 Search transactions...]                             │
│ [All Types ▾] [All Accounts ▾] [All Categories ▾]      │
│ [Date: Jun 1 - Jun 28 ▾]                               │
├─────────────────────────────────────────────────────────┤
│ Today, June 28                                          │
│ ┌──────────────────────────────────────────────────────┐│
│ │ 🍔 Food & Dining                        -PHP 350.00 ││
│ │    Jollibee — SM North EDSA    📷 📍      12:30 PM  ││
│ ├──────────────────────────────────────────────────────┤│
│ │ 🚗 Transportation                       -PHP 180.00 ││
│ │    Grab ride to office                     9:15 AM  ││
│ └──────────────────────────────────────────────────────┘│
│                                                         │
│ Yesterday, June 27                                      │
│ ┌──────────────────────────────────────────────────────┐│
│ │ 💰 Salary                             +PHP 45,000.00││
│ │    June 2026 payroll — BDO Savings        3:00 PM   ││
│ ├──────────────────────────────────────────────────────┤│
│ │ 🛒 Groceries                           -PHP 2,150.00││
│ │    SM Hypermarket — weekly groceries 📷   5:45 PM   ││
│ └──────────────────────────────────────────────────────┘│
│                                                         │
│ [Load more...]                                          │
└─────────────────────────────────────────────────────────┘
```

**List View:**
- Grouped by date (sticky date headers)
- Each row: category icon + color | category name | description | amount (colored)
- Small indicators: 📷 (has image), 📍 (has location), 🔄 (recurring)
- Income in green with `+`, expense in red with `-`, transfer in blue with `↔`
- Click row → Transaction Detail view (or edit modal)
- Infinite scroll with "Load more" at bottom

**Filters (collapsible bar):**
- Type: All / Income / Expense / Transfer
- Account: dropdown (multi-select)
- Category: dropdown (multi-select, grouped by type)
- Date range: preset (Today, This Week, This Month, This Year, Custom)
- Search: full-text search with debounce
- Filters reflected in URL params for shareable links

**Add/Edit Transaction Form (modal or page):**
- Type selector: Income / Expense / Transfer (tab-style toggle)
- Amount (large numeric input, prominent)
- Category (searchable dropdown with icons)
- Account (dropdown — "From" account; for transfers, also "To" account)
- Date (date picker, defaults to today)
- Description (text input, optional)
- Tags (multi-input chip field, optional)
- Image attachment (optional): camera button + gallery button, preview thumbnail, remove button
- Location (optional): "Add location" button → auto-detect GPS or manual text input, shows location name when set
- Recurring toggle + interval selector (if toggled on)

**Transaction Detail View (click/tap a transaction):**
- Full details: amount, category, account, date, description, tags
- Image preview (full-size, tappable to zoom)
- Location with map preview (if set)
- Edit / Delete buttons
- If recurring: shows interval and next date

### 4. Budgets Page

> **Current implementation:** 3-column card grid with period badge, budget amount, and progress bar placeholder (always at 0% — no actual spending calculation). Alert threshold shown as text.

**Target design:**
```
┌─────────────────────────────────────────────────────────┐
│ Budgets                                   [+ Add Budget] │
├─────────────────────────────────────────────────────────┤
│ June 2026                          [◀ Prev] [Next ▶]    │
│                                                         │
│ ┌──────────────────────────────────────────────────────┐│
│ │ 🍔 Food & Dining           PHP 8,500 / PHP 15,000   ││
│ │ ██████████████████████░░░░░░░░ 57%                   ││
│ │ PHP 6,500 remaining · 3 days left                    ││
│ ├──────────────────────────────────────────────────────┤│
│ │ 🚗 Transportation          PHP 1,950 / PHP 5,000    ││
│ │ ████████████░░░░░░░░░░░░░░░░ 39%                    ││
│ │ PHP 3,050 remaining · 3 days left                    ││
│ ├──────────────────────────────────────────────────────┤│
│ │ 🎮 Entertainment           PHP 2,300 / PHP 3,000    ││
│ │ ████████████████████████░░░░ 77%    ⚠️ Near limit    ││
│ │ PHP 700 remaining · 3 days left                      ││
│ ├──────────────────────────────────────────────────────┤│
│ │ 🛒 Groceries               PHP 8,200 / PHP 10,000   ││
│ │ █████████████████████████░░░░ 82%    ⚠️ Alert!       ││
│ │ PHP 1,800 remaining · 3 days left                    ││
│ └──────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

**Budget Cards:**
- Category icon + name
- Progress bar: green (< 70%), yellow (70-90%), red (> 90%)
- Spent / Total amounts
- Remaining amount + days left in period
- Alert badge when threshold exceeded
- Click → drill-down showing transactions in that category for the period

### 5. Investments Page

> **Current implementation:** Table with columns: Symbol, Name, Type, Qty, Avg Price, Current Price, Value, P&L (with %, colored). Inline form for creation. Uses purple accent color for buttons.

**Target design:**
```
┌─────────────────────────────────────────────────────────┐
│ Investments                            [+ Add Holding]   │
├─────────────────────────────────────────────────────────┤
│ Portfolio Value: PHP 195,450.00       +PHP 12,300 (+6.7%)│
│                                                         │
│ ┌─────────────────────────────┐ ┌──────────────────────┐│
│ │ Allocation                  │ │ Performance (6mo)    ││
│ │      ┌────────┐             │ │    /\                ││
│ │    ╱  Crypto   ╲            │ │   /  \    /\  /\     ││
│ │   │  45%  │PH│  │           │ │  /    \/\/  \/  \    ││
│ │    ╲  US   ╱ 20%            │ │ /                 \  ││
│ │      └────────┘             │ │                      ││
│ │    35%                      │ │                      ││
│ └─────────────────────────────┘ └──────────────────────┘│
│                                                         │
│ Holdings                                                │
│ ┌──────────────────────────────────────────────────────┐│
│ │ ₿ Bitcoin (BTC)           0.015 BTC   $1,520 (+8.2%)││
│ │   Crypto · Avg: $98,200   Current: $101,333          ││
│ ├──────────────────────────────────────────────────────┤│
│ │ 🍟 Jollibee (JFC.PS)     100 shares  PHP 24,500 (+3%)││
│ │   PH Stock · Avg: PHP 238  Current: PHP 245          ││
│ ├──────────────────────────────────────────────────────┤│
│ │ 🍎 Apple (AAPL)          5 shares    $1,125 (+12%)  ││
│ │   US Stock · Avg: $201    Current: $225              ││
│ └──────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

### 6. Goals Page

> **Current implementation:** 2-column card grid with name, current/target amounts, progress bar (uses goal's color), completion badge, target date. Inline "Add Funds" flow (click reveals number input + Save/Cancel). Uses green accent buttons.

**Target design:**
```
┌─────────────────────────────────────────────────────────┐
│ Financial Goals                            [+ Add Goal]  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ┌──────────────────────────────────────────────────────┐│
│ │ 🛡️ Emergency Fund                                   ││
│ │ PHP 45,000 / PHP 100,000                       45%  ││
│ │ █████████████████░░░░░░░░░░░░░░░░░░░                ││
│ │ PHP 55,000 to go                                     ││
│ │                                    [+ Contribute]    ││
│ ├──────────────────────────────────────────────────────┤│
│ │ 💻 New Laptop                                       ││
│ │ PHP 25,000 / PHP 80,000                        31%  ││
│ │ █████████░░░░░░░░░░░░░░░░░░░░░░░░░                  ││
│ │ Target: Dec 2026 · PHP 55,000 to go                  ││
│ │                                    [+ Contribute]    ││
│ └──────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

### 7. Bill Reminders Page

> **Current implementation:** Vertical list with name, amount, due day, frequency, auto-create badge, inactive badge. Inline form for creation. Uses orange accent buttons.

**Target design:**
```
┌─────────────────────────────────────────────────────────┐
│ Bill Reminders                         [+ Add Reminder]  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Due Soon                                                │
│ ┌──────────────────────────────────────────────────────┐│
│ │ ⚡ Meralco Electric Bill   Day 15    PHP 3,500 [Pay] ││
│ │    Monthly · Reminder 3 days before                  ││
│ ├──────────────────────────────────────────────────────┤│
│ │ 🌐 PLDT Internet          Day 5     PHP 1,899 [Pay] ││
│ │    Monthly · Reminder 3 days before                  ││
│ ├──────────────────────────────────────────────────────┤│
│ │ 🎬 Netflix Subscription   Day 20    PHP 549   [Pay] ││
│ │    Monthly · Auto-create transaction                 ││
│ └──────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

### 8. Insights Page

> **Current implementation:** Period selector with 3 options (7d/30d/1y). Four summary cards (income, expenses, net, savings rate). Spending by category shown as horizontal Tailwind-div bars (no chart library). Monthly trends shown as a table. Bug: category names show UUIDs instead of resolved names.

**Target design:**
```
┌─────────────────────────────────────────────────────────┐
│ Spending Insights                [This Month ▾]          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ┌──────────────────────────┐ ┌─────────────────────────┐│
│ │ Spending by Category     │ │ Monthly Trend (6 mo)    ││
│ │                          │ │                         ││
│ │    ╭───────╮             │ │ ┌──┐    ┌──┐           ││
│ │   ╱ Food 32%╲            │ │ │  │┌──┐│  │┌──┐┌──┐  ││
│ │  │ Trans 18% │           │ │ │  ││  ││  ││  ││  │  ││
│ │   ╲Util 15%╱             │ │ Jan Feb Mar Apr May Jun ││
│ │    ╰───────╯             │ │                         ││
│ │  Other 35%               │ │                         ││
│ └──────────────────────────┘ └─────────────────────────┘│
│                                                         │
│ ┌──────────────────────────┐ ┌─────────────────────────┐│
│ │ Income vs Expense        │ │ Savings Rate            ││
│ │                          │ │                         ││
│ │ Inc ████████████ 85,000  │ │       27%               ││
│ │ Exp ████████░░░░ 62,000  │ │    ╭──────╮             ││
│ │                          │ │    │██████│             ││
│ │ Net: +PHP 23,000         │ │    ╰──────╯             ││
│ └──────────────────────────┘ └─────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

### 9. Settings Page

> **Current implementation:** Three sections: Profile form (first name, last name, currency dropdown), Change Password form (current + new), Account Info (read-only email). Uses direct service calls instead of TanStack Query mutations. Some styling inconsistency (`gray-*` vs `zinc-*`).

### 10. Import/Export Pages

> **Current implementation:**
> - **Import:** 2-step CSV flow (upload file + select account → preview table → confirm). Works with `importService` directly.
> - **Export:** Date range picker + 3 format cards (CSV, Excel, PDF). Auto-downloads via blob URL.

### 11. Auth Pages

> **Current implementation:**
> - **Login:** Email + password, zodResolver validation, server error banner, link to register. Clean centered card on `zinc-50/zinc-950` background.
> - **Register:** First name, last name, email, password. No Google OAuth button yet. No password strength indicator.

**Missing from auth pages:**
- "Remember me" checkbox
- "Forgot password?" link
- Google OAuth sign-in/sign-up button
- Password strength indicator on register

### 12. Pricing / Upgrade Page
Not yet implemented. Should show Free vs Premium comparison with PayMongo checkout flow.

---

## Screens — Mobile App

> **Not yet implemented.** Mobile app initialization (Expo + NativeBase + Drizzle/SQLite + React Navigation) is a future phase.

### 1. Home Screen (Dashboard)

```
┌─────────────────────────────┐
│ ≡  Financial Tracker    🔔  │
├─────────────────────────────┤
│                             │
│   Total Balance             │
│   PHP 245,830.50            │
│   +2.3% from last month    │
│                             │
│ ┌───────────────────────┐   │
│ │ Accounts  ───────────→│   │
│ │ BDO  ████████ 120.5k  │   │
│ │ GCash ██░░░░░  8.3k   │   │
│ │ Cash  █░░░░░░  5.2k   │   │
│ └───────────────────────┘   │
│                             │
│ Recent Transactions         │
│ ┌───────────────────────┐   │
│ │ 🍔 Jollibee  -PHP 350 │   │
│ │ 💰 Salary  +PHP 45,000│   │
│ │ 🚗 Grab     -PHP 180  │   │
│ └───────────────────────┘   │
│                             │
│ Budget Alerts               │
│ ┌───────────────────────┐   │
│ │ ⚠️ Subscriptions: 95% │   │
│ └───────────────────────┘   │
│                             │
├─────────────────────────────┤
│ 🏠   📊    ➕    💰    ⋯   │
└─────────────────────────────┘
```

- Pull-to-refresh to sync latest data
- Scrollable vertical layout
- Offline indicator banner at top when no connectivity: "You're offline — changes will sync when connected"
- Sync status indicator (last synced timestamp)

### 2. Add Transaction Screen (Full Screen Modal)

```
┌─────────────────────────────┐
│ ✕  Add Transaction          │
├─────────────────────────────┤
│                             │
│ [Income] [Expense] [Transfer]│  ← Type toggle (segmented control)
│                             │
│ ┌───────────────────────┐   │
│ │     PHP 0.00          │   │  ← Large amount input
│ └───────────────────────┘   │
│                             │
│ Category    [Food & Dining ▾]│
│ Account     [BDO Savings ▾] │
│ Date        [Jun 28, 2026 ▾]│
│ Description [                ]│
│ Tags        [+ Add tag      ]│
│                             │
│ ┌───────────────────────┐   │
│ │ 📷 Add Image          │   │
│ │ [image preview here]  │   │
│ └───────────────────────┘   │
│                             │
│ ┌───────────────────────┐   │
│ │ 📍 Add Location       │   │
│ │ SM North EDSA, QC     │   │
│ └───────────────────────┘   │
│                             │
│ 🔄 Recurring  [OFF ───●]   │
│   Interval    [Monthly ▾]   │
│                             │
│ [     Save Transaction     ]│
│                             │
├─────────────────────────────┤
│ 🏠   📊    ➕    💰    ⋯   │
└─────────────────────────────┘
```

### 3. Receipt Scanning Flow (Mobile Only)

```
Screen 1: Camera                Screen 2: Review
┌─────────────────────────┐    ┌─────────────────────────┐
│ ✕  Scan Receipt         │    │ ←  Review Scan          │
├─────────────────────────┤    ├─────────────────────────┤
│                         │    │                         │
│   ┌─────────────────┐   │    │ Detected:               │
│   │                 │   │    │                         │
│   │  Camera Preview │   │    │ Amount:  PHP 350.00  ✏️ │
│   │                 │   │    │ Date:    Jun 28, 2026✏️ │
│   │                 │   │    │ Merchant: Jollibee   ✏️ │
│   └─────────────────┘   │    │                         │
│                         │    │ Raw text:               │
│   [📸 Capture]          │    │ ┌─────────────────────┐ │
│   [🖼️ From Gallery]     │    │ │ JOLLIBEE            │ │
│                         │    │ │ SM North EDSA       │ │
│                         │    │ │ Total: PHP 350.00   │ │
│                         │    │ └─────────────────────┘ │
│                         │    │                         │
│                         │    │ [Use These Details →]   │
└─────────────────────────┘    └─────────────────────────┘
```

### 4. More Screen (Tab)

```
┌─────────────────────────────┐
│     More                    │
├─────────────────────────────┤
│                             │
│ Financial                   │
│ ┌───────────────────────┐   │
│ │ 📊 Budgets            │   │
│ │ 📈 Investments     🔒 │   │
│ │ 🎯 Goals           🔒 │   │
│ │ 🔔 Bill Reminders  🔒 │   │
│ │ 💡 Spending Insights🔒│   │
│ └───────────────────────┘   │
│                             │
│ Data                        │
│ ┌───────────────────────┐   │
│ │ 📄 Bank Statements    │   │
│ │ 📥 Import CSV         │   │
│ │ 📤 Export Data        │   │
│ └───────────────────────┘   │
│                             │
│ ┌───────────────────────┐   │
│ │ ✨ Upgrade Premium    │   │
│ │ Unlock all features   │   │
│ └───────────────────────┘   │
│                             │
│ App                         │
│ ┌───────────────────────┐   │
│ │ ⚙️ Settings           │   │
│ │ 🔄 Sync Status        │   │
│ │ 🔔 Notifications      │   │
│ └───────────────────────┘   │
│                             │
│ [Sign Out]                  │
│                             │
├─────────────────────────────┤
│ 🏠   📊    ➕    💰    ⋯   │
└─────────────────────────────┘
```

---

## Known Issues & Gaps (Web)

### Styling
- [ ] Primary color is `blue-600` instead of design system `purple-600`
- [ ] No shared reusable components (Button, Card, Input, Badge) — all inline Tailwind
- [ ] Settings page uses `gray-*` inconsistently (should be `zinc-*`)
- [ ] Sidebar uses text-based pseudo-icons instead of `react-icons`
- [ ] Sidebar is not collapsible on smaller screens
- [ ] No top bar with notification bell / user avatar

### Functionality
- [ ] No Google OAuth button on login/register pages
- [ ] No toast/notification system for mutation feedback
- [ ] No search or filters on transactions page
- [ ] No date grouping on transactions (just a flat table)
- [ ] Budget progress bars always show 0% (no actual spending calculation)
- [ ] Insights page shows category UUIDs instead of resolved names
- [ ] No pagination / infinite scroll on any list page
- [ ] No edit functionality on most entities (only create/delete)
- [ ] No transaction detail view
- [ ] No charts (Recharts not integrated yet)
- [ ] No premium feature gating UI
- [ ] No pricing/upgrade page
- [ ] Empty states are text-only (no icons/illustrations)
- [ ] Loading states are text-only (no skeletons)
- [ ] No responsive breakpoints — sidebar is always 256px fixed

---

## Key User Flows

### Flow 1: Quick Add Transaction (Mobile)
1. Tap center "+" tab → Add Transaction screen opens
2. Type defaults to "Expense" (most common)
3. Enter amount via numeric keypad
4. Select category from icon grid or searchable list
5. Account defaults to last-used account
6. Optionally: tap "Add Image" → camera/gallery, tap "Add Location" → auto-detect
7. Tap "Save" → toast confirmation, returns to previous screen
8. If offline: saved locally, queued for sync

### Flow 2: Receipt Scan → Add Transaction (Mobile)
1. From Add Transaction screen, tap "Add Image" → "Scan Receipt"
2. Camera opens → user captures receipt photo
3. OCR processes image → shows extracted data (amount, date, merchant)
4. User reviews/edits detected values
5. Tap "Use These Details" → returns to Add Transaction with fields pre-filled + image attached
6. User confirms category and account → Save

### Flow 3: Budget Alert → Review Spending
1. User receives push notification: "Food & Dining budget is 95% used"
2. Tap notification → opens Budget detail for Food & Dining
3. Shows progress bar, spending breakdown, list of recent transactions
4. User can tap a transaction to view/edit

### Flow 4: Bill Reminder → Pay
1. Notification: "Netflix bill due tomorrow — PHP 549"
2. Tap → opens Bill Reminder detail
3. Tap "Mark as Paid" → optionally auto-creates expense transaction
4. Updates `last_paid_date`, schedules next reminder

### Flow 5: CSV Import (Web)
1. Navigate to Import → CSV Import
2. Drag & drop CSV file
3. Preview table shows first 5 rows
4. Map each CSV column to a transaction field via dropdowns
5. Review all parsed transactions, fix any warnings
6. Confirm import → transactions created, linked to selected account

### Flow 6: Free User Hits Premium Feature Lock
1. Free user taps "Investments" in navigation (shows 🔒 icon)
2. Lock screen/modal appears: "Investments is a Premium feature"
3. Shows brief description + feature highlights
4. [Upgrade to Premium] button → opens Pricing page
5. User selects plan → redirected to PayMongo checkout
6. Completes payment → redirected back → feature now unlocked

---

## Responsive Breakpoints (Web)

| Breakpoint | Width | Layout |
|-----------|-------|--------|
| `sm` | < 640px | Single column, hamburger menu, mobile-like |
| `md` | 640-768px | Single column, sidebar drawer |
| `lg` | 768-1024px | Sidebar collapsed (icons), 1-2 column content |
| `xl` | 1024-1280px | Sidebar expanded, 2-column dashboard |
| `2xl` | > 1280px | Full layout, 2-3 column dashboard |

- Dashboard widgets reflow: 1 col (sm) → 2 col (xl) → 2-3 col (2xl)
- Tables become cards on mobile breakpoints
- Modals become full-screen on mobile breakpoints
- Sidebar: hidden (sm) → icon-only (lg) → full (xl)

> **Current state:** No responsive breakpoints implemented. Sidebar is always 256px fixed. Content doesn't adapt to screen size.

---

## Dark Mode Design Notes

### Color Mapping
- Backgrounds: light gray → dark gray (not pure black, easier on eyes)
- Cards: white → zinc-800
- Text: zinc-900 → zinc-50
- Borders: zinc-200 → zinc-700
- Primary color: adjusts to lighter shade for dark backgrounds
- Charts: use brighter/lighter color variants in dark mode

### Implementation
- `ThemeProvider` component toggles `dark` class on `<html>` element
- Tailwind `dark:` variant used on all styled elements
- User preference stored in Zustand `useAppStore` (persisted to localStorage)
- Three modes: Light / Dark / System (follows `prefers-color-scheme`)
- Theme cycle button in sidebar footer

> **Current state:** Dark mode is functional. The `ThemeProvider` correctly applies/removes the `dark` class. Most pages use `dark:bg-zinc-*` and `dark:text-zinc-*` variants. System mode listens to `matchMedia` changes.

---

## Accessibility

- All interactive elements have minimum 44x44px touch target (mobile)
- Color contrast ratio: minimum 4.5:1 for normal text, 3:1 for large text
- Focus indicators on all interactive elements (keyboard navigation)
- Semantic HTML (web): proper heading hierarchy, ARIA labels
- Screen reader support: meaningful alt text for images, labeled icons
- Financial amounts always include currency symbol (not just color-coding)
- Error messages: descriptive text, not just red color

---

## Animations & Transitions

- Page transitions: fade (200ms)
- Card hover: subtle lift (transform + shadow, 150ms)
- Progress bars: animate from 0 to current value on load (400ms ease-out)
- Toasts: slide in from bottom (200ms)
- Modal: fade + scale (200ms)
- Tab switches: cross-fade content (150ms)
- Pull-to-refresh: custom spinner with sync icon
- Skeleton loading: shimmer animation (1.5s loop)
- No excessive animations — keep it professional and fast-feeling

> **Current state:** No animations or transitions implemented. All page changes and state updates are instant.

---

## Offline Indicators (Mobile)

- **Banner:** Yellow/orange bar at top: "You're offline — changes saved locally"
- **Sync badge:** Small indicator on nav showing pending sync count
- **Transaction badges:** Unsynced transactions show a small cloud-with-arrow icon
- **Last synced:** Timestamp shown on home screen: "Last synced: 5 min ago"
- **Sync progress:** When syncing, show progress: "Syncing 3/8 items..."
- **Conflict:** Red badge on Sync Status page if conflicts exist
