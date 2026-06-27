# UI-PLAN.md — Financial Tracker V2

## Overview
A personal financial tracker with a **web app** (Next.js + Chakra UI + Tailwind CSS) and a **mobile app** (Expo + React Native + NativeBase). Both share the same design language, color palette, and iconography. The mobile app is offline-first. Default currency: PHP.

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

### Typography
- **Web:** Inter (headings + body) — clean, modern, excellent readability
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

### Cards
- White/dark surface with subtle shadow (light) or border (dark)
- 12px radius, 16-24px padding
- Optional header with title + action button
- Used for: account cards, transaction items, budget cards, goal cards, widgets

### Form Inputs
- Label above input (always visible, not placeholder-as-label)
- 8px radius, 1px border
- Focus: 2px primary color border ring
- Error: red border + error message below
- Helper text in muted color below input
- Consistent height: 40px (web), 48px (mobile, larger touch target)

### Transaction Amount Display
- Income: green text with `+` prefix
- Expense: red text with `-` prefix
- Transfer: blue text with arrow icon
- Currency symbol before amount (e.g., `PHP 1,234.50`)
- Always 2 decimal places for fiat, up to 8 for crypto

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

### Loading States
- Skeleton screens (shimmer effect) for content loading
- Spinner for action buttons (inline, replaces text)
- Pull-to-refresh on mobile lists
- Progressive loading for charts

### Toast/Snackbar Notifications
- Bottom-center (web), bottom (mobile)
- Success: green left border
- Error: red left border
- Info: blue left border
- Auto-dismiss after 4 seconds, swipe to dismiss on mobile

---

## Navigation Structure

### Web — Sidebar + Top Bar
```
┌──────────────────────────────────────────────────┐
│ [Logo] Financial Tracker          [🔔] [🌙] [👤] │  ← Top bar
├──────────┬───────────────────────────────────────┤
│          │                                       │
│ Dashboard│         Main Content Area             │
│ Accounts │                                       │
│ Transact.│                                       │
│ Budgets  │                                       │
│ Invest.  │                                       │
│ Goals    │                                       │
│ Bills    │                                       │
│ Insights │                                       │
│ ──────── │                                       │
│ Import   │                                       │
│ Statmnts │                                       │
│ ──────── │                                       │
│ Settings │                                       │
│          │                                       │
└──────────┴───────────────────────────────────────┘
```
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
The main landing page after login. Overview of financial health.

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

```
┌─────────────────────────────────────────────────────────┐
│ Accounts                                  [+ Add Account]│
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Total Balance: PHP 245,830.50                           │
│                                                         │
│ ┌─────────────────────────┐ ┌─────────────────────────┐ │
│ │ [BDO Logo] BDO Savings  │ │ [GCash Logo] GCash      │ │
│ │ Savings Account         │ │ E-Wallet                │ │
│ │ PHP 120,500.00          │ │ PHP 8,350.00            │ │
│ │ ██████████████████      │ │ ███░░░░░░░░░░░░░░░      │ │
│ └─────────────────────────┘ └─────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────┐ ┌─────────────────────────┐ │
│ │ 💰 Cash on Hand         │ │ 💳 BPI Credit Card      │ │
│ │ Cash                    │ │ Credit Card             │ │
│ │ PHP 5,200.00            │ │ PHP -12,450.00          │ │
│ │ █░░░░░░░░░░░░░░░░░      │ │ ████████████ (red)      │ │
│ └─────────────────────────┘ └─────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────┐ ┌─────────────────────────┐ │
│ │ 📈 COL Financial        │ │ 💵 USD Savings           │ │
│ │ Investment              │ │ Savings Account         │ │
│ │ PHP 95,000.00           │ │ $450.00 (PHP 25,380)    │ │
│ └─────────────────────────┘ └─────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

**Account Cards:**
- Custom logo (circular avatar) or fallback icon
- Account name (bold) + bank name (muted)
- Account type badge (chip)
- Balance in native currency
- If foreign currency: converted amount in PHP below
- Proportional bar showing balance relative to total
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

```
┌─────────────────────────────────────────────────────────┐
│ Budgets                                   [+ Add Budget] │
├─────────────────────────────────────────────────────────┤
│ June 2026                          [◀ Prev] [Next ▶]    │
│                                                         │
│ ┌──────────────────────────────────────────────────────┐│
│ │ 🍔 Food & Dining           PHP 8,500 / PHP 12,000   ││
│ │ ██████████████████████░░░░░░░░ 71%                   ││
│ │ PHP 3,500 remaining · 3 days left                    ││
│ ├──────────────────────────────────────────────────────┤│
│ │ 🚗 Transportation          PHP 3,200 / PHP 5,000    ││
│ │ ████████████████░░░░░░░░░░░░░ 64%                   ││
│ │ PHP 1,800 remaining · 3 days left                    ││
│ ├──────────────────────────────────────────────────────┤│
│ │ 📺 Subscriptions           PHP 2,850 / PHP 3,000    ││
│ │ █████████████████████████████░ 95%    ⚠️ Alert!      ││
│ │ PHP 150 remaining · 3 days left                      ││
│ ├──────────────────────────────────────────────────────┤│
│ │ 🎮 Entertainment           PHP 1,200 / PHP 4,000    ││
│ │ █████████░░░░░░░░░░░░░░░░░░░ 30%                    ││
│ │ PHP 2,800 remaining · 3 days left                    ││
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

**Add/Edit Budget Form:**
- Category (dropdown, one budget per category per period)
- Budget amount
- Period: weekly / monthly / yearly
- Alert threshold (slider: 50% - 100%, default 80%)
- Start date

### 5. Investments Page

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

```
┌─────────────────────────────────────────────────────────┐
│ Financial Goals                            [+ Add Goal]  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ┌──────────────────────────────────────────────────────┐│
│ │ 🎯 Emergency Fund                                   ││
│ │ PHP 72,000 / PHP 100,000                       72%  ││
│ │ ██████████████████████████░░░░░░░░░                  ││
│ │ Target: Dec 2026 · PHP 28,000 to go                  ││
│ │                                    [+ Contribute]    ││
│ ├──────────────────────────────────────────────────────┤│
│ │ ✈️ Japan Trip                                        ││
│ │ PHP 35,000 / PHP 80,000                        44%  ││
│ │ █████████████░░░░░░░░░░░░░░░░░░                      ││
│ │ Target: Mar 2027 · PHP 45,000 to go                  ││
│ │                                    [+ Contribute]    ││
│ ├──────────────────────────────────────────────────────┤│
│ │ 🎓 Course Fund                          ✅ Completed ││
│ │ PHP 15,000 / PHP 15,000                       100%  ││
│ │ █████████████████████████████████████████████████████ ││
│ │ Completed: Jun 15, 2026                              ││
│ └──────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

**Goal Cards:**
- Icon + color indicator (user-chosen)
- Name, progress bar, percentage
- Current amount / target amount
- Target date + remaining amount
- "Contribute" button → modal with amount input
- Completed goals: green checkmark, grayed out or celebratory style

### 7. Bill Reminders Page

```
┌─────────────────────────────────────────────────────────┐
│ Bill Reminders                         [+ Add Reminder]  │
├─────────────────────────────────────────────────────────┤
│ [List View] [Calendar View]                             │
│                                                         │
│ Due This Week                                           │
│ ┌──────────────────────────────────────────────────────┐│
│ │ 🔴 Netflix              Jul 1      PHP 549    [Pay] ││
│ │    Monthly · Auto-create transaction                 ││
│ ├──────────────────────────────────────────────────────┤│
│ │ 🟡 Electric Bill         Jul 5      PHP 3,200  [Pay] ││
│ │    Monthly · Reminder 3 days before                  ││
│ └──────────────────────────────────────────────────────┘│
│                                                         │
│ Due Later                                               │
│ ┌──────────────────────────────────────────────────────┐│
│ │ ⚪ Internet               Jul 10     PHP 1,899  [Pay] ││
│ │ ⚪ Insurance              Jul 15     PHP 5,000  [Pay] ││
│ │ ⚪ Rent                   Jul 30     PHP 15,000 [Pay] ││
│ └──────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

**Calendar View:** Monthly calendar grid with colored dots on bill due dates. Tap a day to see bills due.

### 8. Insights Page

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
│                                                         │
│ ┌──────────────────────────────────────────────────────┐│
│ │ Budget Health                                        ││
│ │ ✅ On track (3)  ⚠️ Near limit (1)  🔴 Over (0)     ││
│ └──────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

### 9. PDF Statements Page

```
┌─────────────────────────────────────────────────────────┐
│ Bank Statements                        [📤 Upload PDF]   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ┌──────────────────────────────────────────────────────┐│
│ │ 📄 BDO_Statement_June2026.pdf                        ││
│ │    Bank Statement · Uploaded Jun 25 · ✅ Parsed       ││
│ │    12 transactions found · [View Results]             ││
│ ├──────────────────────────────────────────────────────┤│
│ │ 📄 BPI_CC_May2026.pdf                               ││
│ │    Credit Card · Uploaded Jun 2 · ✅ Parsed           ││
│ │    28 transactions found · [View Results]             ││
│ └──────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

**Upload Flow:**
1. Drag & drop zone or file picker button
2. Select statement type (bank, credit card, investment)
3. Optionally link to an account
4. Upload + parse → show progress spinner
5. Review parsed transactions in a table (editable — fix amounts, categories, dates)
6. Confirm → save transactions to selected account

### 10. CSV Import Page

```
┌─────────────────────────────────────────────────────────┐
│ CSV Import                                               │
├─────────────────────────────────────────────────────────┤
│ Step 1 of 3: Upload File                                │
│                                                         │
│ ┌──────────────────────────────────────────────────────┐│
│ │                                                      ││
│ │       📄 Drag & drop your CSV file here              ││
│ │          or [Browse Files]                           ││
│ │                                                      ││
│ │       Supported: .csv files                          ││
│ └──────────────────────────────────────────────────────┘│
│                                                         │
│ Step 2 of 3: Map Columns                                │
│ ┌──────────────────────────────────────────────────────┐│
│ │ CSV Column    →    Maps To                           ││
│ │ "Date"        →    [Transaction Date ▾]              ││
│ │ "Details"     →    [Description ▾]                   ││
│ │ "Debit"       →    [Expense Amount ▾]                ││
│ │ "Credit"      →    [Income Amount ▾]                 ││
│ │ Preview: first 5 rows shown below                    ││
│ └──────────────────────────────────────────────────────┘│
│                                                         │
│ Step 3 of 3: Review & Confirm                           │
│ ┌──────────────────────────────────────────────────────┐│
│ │ 45 transactions parsed · 2 possible duplicates       ││
│ │ [Confirm Import] [Cancel]                            ││
│ └──────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

### 11. Settings Page

```
┌─────────────────────────────────────────────────────────┐
│ Settings                                                 │
├─────────────────────────────────────────────────────────┤
│ Profile                                                 │
│ ┌──────────────────────────────────────────────────────┐│
│ │ [Avatar]  John Doe                                   ││
│ │           john@example.com                           ││
│ │           [Edit Profile]                             ││
│ └──────────────────────────────────────────────────────┘│
│                                                         │
│ Preferences                                             │
│ ┌──────────────────────────────────────────────────────┐│
│ │ Default Currency     [PHP ▾]                         ││
│ │ Theme               [Light ○] [Dark ○] [System ●]   ││
│ │ Date Format          [MM/DD/YYYY ▾]                  ││
│ └──────────────────────────────────────────────────────┘│
│                                                         │
│ Data                                                    │
│ ┌──────────────────────────────────────────────────────┐│
│ │ [📥 Export to Excel]  [📥 Export to PDF]             ││
│ │ [📤 Import CSV]                                     ││
│ └──────────────────────────────────────────────────────┘│
│                                                         │
│ Subscription                                            │
│ ┌──────────────────────────────────────────────────────┐│
│ │ Current Plan: Free                                   ││
│ │ 2/2 accounts used · 38/50 transactions this month    ││
│ │ [✨ Upgrade to Premium]                              ││
│ └──────────────────────────────────────────────────────┘│
│ -or if premium-                                         │
│ ┌──────────────────────────────────────────────────────┐│
│ │ Current Plan: Premium ⭐                             ││
│ │ Monthly · Renews Jul 28, 2026                        ││
│ │ Payment: GCash                                       ││
│ │ [View Payment History] [Cancel Subscription]         ││
│ └──────────────────────────────────────────────────────┘│
│                                                         │
│ Connected Accounts                                      │
│ ┌──────────────────────────────────────────────────────┐│
│ │ Google   john@gmail.com          [Connected ✅]      ││
│ │ Email    john@example.com        [Change Password]   ││
│ └──────────────────────────────────────────────────────┘│
│                                                         │
│ [Sign Out]                                              │
└─────────────────────────────────────────────────────────┘
```

### 12. Pricing / Upgrade Page

```
┌─────────────────────────────────────────────────────────┐
│ Upgrade to Premium                                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Unlock the full power of Financial Tracker             │
│                                                         │
│ ┌────────────────────────┐ ┌────────────────────────┐   │
│ │ Free                   │ │ ⭐ Premium             │   │
│ │                        │ │                        │   │
│ │ PHP 0                  │ │ PHP ___/mo (web)       │   │
│ │                        │ │ PHP ___ one-time (app) │   │
│ │ ✅ 2 accounts          │ │                        │   │
│ │ ✅ Basic budgets       │ │ ✅ Unlimited accounts   │   │
│ │ ✅ Dark mode           │ │ ✅ Unlimited transact.  │   │
│ │ ❌ Investments         │ │ ✅ Investments          │   │
│ │ ❌ PDF parsing         │ │ ✅ PDF parsing          │   │
│ │ ❌ Insights            │ │ ✅ Spending insights    │   │
│ │ ❌ Goals               │ │ ✅ Financial goals      │   │
│ │ ❌ Bill reminders      │ │ ✅ Bill reminders       │   │
│ │ ❌ Receipt scan        │ │ ✅ Receipt scanning     │   │
│ │ ❌ CSV import          │ │ ✅ CSV import           │   │
│ │ ❌ Data export         │ │ ✅ Excel & PDF export   │   │
│ │ ❌ Multi-currency      │ │ ✅ Multi-currency       │   │
│ │ ❌ Search              │ │ ✅ Full-text search     │   │
│ │ ❌ Image & location    │ │ ✅ Image & location     │   │
│ │                        │ │                        │   │
│ │ [Current Plan]         │ │ [✨ Upgrade Now]       │   │
│ └────────────────────────┘ └────────────────────────┘   │
│                                                         │
│ Payment methods: 💳 Card  GCash  Maya  GrabPay          │
│                  BPI Online  UnionBank                   │
│                                                         │
│ Secure payments powered by PayMongo                     │
└─────────────────────────────────────────────────────────┘
```

**Upgrade Flow:**
1. User clicks "Upgrade Now" or hits a premium feature lock
2. Redirected to Pricing page (or shown a modal on mobile)
3. Clicks "Upgrade Now" → frontend calls `POST /subscriptions/checkout`
4. Redirected to PayMongo hosted checkout (selects payment method, enters details)
5. On success: redirected back to app → subscription activated → features unlocked
6. On mobile: checkout opens in in-app browser via `expo-web-browser`

**Premium Feature Lock (inline):**
- When a free user tries to access a premium feature (e.g., clicks "Investments" in sidebar):
  - Show a lock overlay or modal: "Investments is a Premium feature"
  - Brief description of the feature
  - [✨ Upgrade to Premium] CTA button
  - "See all features" link → Pricing page
- Navigation items for locked features show a small 🔒 icon

**Dashboard Upgrade CTA (free tier only):**
- Card on dashboard: "Unlock Premium — Get investments, insights, goals, and more"
- Dismissable but reappears periodically
- Uses `premium` gold/yellow accent color

### 13. Auth Pages

**Login:**
- Email + password fields
- "Remember me" checkbox
- "Forgot password?" link
- [Sign In] primary button
- [Sign in with Google] button (Google branded)
- "Don't have an account? [Sign Up]" link
- Clean centered card layout

**Register:**
- First name + Last name (side by side)
- Email
- Password + Confirm password (with strength indicator)
- [Sign Up] primary button
- [Sign up with Google] button
- "Already have an account? [Sign In]" link

---

## Screens — Mobile App

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
│ │ 📷 Add Image          │   │  ← Opens camera/gallery picker
│ │ [image preview here]  │   │  ← Shows thumbnail if image attached
│ └───────────────────────┘   │
│                             │
│ ┌───────────────────────┐   │
│ │ 📍 Add Location       │   │  ← Auto-detect or manual entry
│ │ SM North EDSA, QC     │   │  ← Shows location name if set
│ └───────────────────────┘   │
│                             │
│ 🔄 Recurring  [OFF ───●]   │
│   Interval    [Monthly ▾]   │
│                             │
│ [     Save Transaction     ]│  ← Primary button, full width
│                             │
├─────────────────────────────┤
│ 🏠   📊    ➕    💰    ⋯   │
└─────────────────────────────┘
```

**Mobile-specific features:**
- Large amount input at top (numeric keyboard auto-opens)
- Segmented control for type (not dropdown)
- "Add Image" button: shows bottom sheet with Camera / Gallery / Receipt Scan options
- "Add Location" button: auto-detects GPS (with loading spinner), shows detected location name, option to edit/clear
- Receipt Scan option triggers OCR flow (Step 24 in PLAN.md)

### 3. Transaction Detail Screen

```
┌─────────────────────────────┐
│ ←  Transaction Detail  [✏️] │
├─────────────────────────────┤
│                             │
│        -PHP 350.00          │  ← Large centered amount
│        Expense              │
│                             │
│ ┌───────────────────────┐   │
│ │ 🍔 Food & Dining      │   │
│ │ Jollibee              │   │
│ │ BDO Savings           │   │
│ │ June 28, 2026 12:30PM │   │
│ └───────────────────────┘   │
│                             │
│ 📷 Attached Image           │
│ ┌───────────────────────┐   │
│ │                       │   │
│ │   [Receipt Photo]     │   │  ← Tappable to view full screen
│ │                       │   │
│ └───────────────────────┘   │
│                             │
│ 📍 Location                 │
│ SM North EDSA, Quezon City  │
│ ┌───────────────────────┐   │
│ │   [Mini Map Preview]  │   │  ← Optional map
│ └───────────────────────┘   │
│                             │
│ Tags: #lunch #work          │
│                             │
│ [🗑️ Delete Transaction]     │
│                             │
├─────────────────────────────┤
│ 🏠   📊    ➕    💰    ⋯   │
└─────────────────────────────┘
```

### 4. Receipt Scanning Flow (Mobile Only)

```
Screen 1: Camera                Screen 2: Review
┌─────────────────────────┐    ┌─────────────────────────┐
│ ✕  Scan Receipt         │    │ ←  Review Scan          │
├─────────────────────────┤    ├─────────────────────────┤
│                         │    │                         │
│   ┌─────────────────┐   │    │ Detected:               │
│   │                 │   │    │                         │
│   │                 │   │    │ Amount:  PHP 350.00  ✏️ │
│   │  Camera Preview │   │    │ Date:    Jun 28, 2026✏️ │
│   │                 │   │    │ Merchant: Jollibee   ✏️ │
│   │                 │   │    │                         │
│   └─────────────────┘   │    │ Raw text:               │
│                         │    │ ┌─────────────────────┐ │
│   [📸 Capture]          │    │ │ JOLLIBEE            │ │
│   [🖼️ From Gallery]     │    │ │ SM North EDSA       │ │
│                         │    │ │ Order #12345        │ │
│                         │    │ │ Total: PHP 350.00   │ │
│                         │    │ └─────────────────────┘ │
│                         │    │                         │
│                         │    │ [Use These Details →]   │
│                         │    │ (Opens Add Transaction  │
│                         │    │  with pre-filled data)  │
└─────────────────────────┘    └─────────────────────────┘
```

### 5. More Screen (Tab)

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
│ │ ✨ Upgrade Premium    │   │  ← Gold accent, only shown on free tier
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

### 6. Sync Status Screen (Mobile Only)

```
┌─────────────────────────────┐
│ ←  Sync Status              │
├─────────────────────────────┤
│                             │
│ Last synced: 5 minutes ago  │
│ Status: ✅ Up to date       │
│                             │
│ [🔄 Sync Now]               │
│                             │
│ Pending Changes             │
│ ┌───────────────────────┐   │
│ │ No pending changes    │   │
│ │ All data is synced    │   │
│ └───────────────────────┘   │
│                             │
│ -or if pending-             │
│ ┌───────────────────────┐   │
│ │ 3 pending changes     │   │
│ │ · 2 new transactions  │   │
│ │ · 1 updated account   │   │
│ │ Will sync when online │   │
│ └───────────────────────┘   │
│                             │
│ Conflicts (if any)          │
│ ┌───────────────────────┐   │
│ │ ⚠️ 1 conflict          │   │
│ │ Transaction "Groceries"│   │
│ │ [Keep Local] [Keep Srv]│   │
│ └───────────────────────┘   │
└─────────────────────────────┘
```

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

### Flow 6: View Transaction with Image & Location
1. From transaction list, tap a transaction that has 📷 and 📍 indicators
2. Detail screen shows full transaction info
3. Image shown as preview (tap to view full-screen with pinch-to-zoom)
4. Location shown as text + optional map preview
5. On web: image opens in lightbox, location shows embedded map

### Flow 7: Free User Hits Premium Feature Lock
1. Free user taps "Investments" in navigation (shows 🔒 icon)
2. Lock screen/modal appears: "Investments is a Premium feature"
3. Shows brief description + feature highlights
4. [Upgrade to Premium] button → opens Pricing page
5. User selects plan → redirected to PayMongo checkout
6. Completes payment → redirected back → feature now unlocked
7. 🔒 icons disappear from nav, limits removed

### Flow 8: Web Monthly Subscription
1. User on free tier clicks "Upgrade" in Settings or Dashboard CTA
2. Pricing page shows Free vs Premium comparison
3. Clicks "Upgrade Now" → `POST /subscriptions/checkout` → PayMongo checkout URL
4. Browser redirects to PayMongo hosted payment page
5. User selects payment method (card, GCash, Maya, etc.) and pays
6. PayMongo redirects to success URL → app shows "Welcome to Premium!"
7. Webhook confirms payment → backend activates subscription
8. Monthly auto-renewal handled by PayMongo → webhook extends period each cycle

### Flow 9: Mobile One-Time Purchase
1. User taps "Upgrade Premium" in More tab
2. Pricing screen shows features + one-time price
3. Taps "Purchase" → `POST /subscriptions/checkout` → PayMongo checkout URL
4. In-app browser opens PayMongo payment page (`expo-web-browser`)
5. User pays → browser redirects to deep link / success URL
6. App detects successful payment → "Premium Unlocked!"
7. Webhook confirms payment → backend sets subscription to `active` (no expiry)

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

---

## Dark Mode Design Notes

### Color Mapping
- Backgrounds: light gray → dark gray (not pure black, easier on eyes)
- Cards: white → gray.700
- Text: gray.800 → gray.50
- Borders: gray.200 → gray.600
- Primary color: adjusts to lighter shade for dark backgrounds
- Charts: use brighter/lighter color variants in dark mode

### Implementation
- All colors reference semantic tokens, never hardcoded hex
- `neutral.bg`, `neutral.card`, `neutral.text`, `neutral.border` switch per mode
- Status colors (success/danger/warning) use lighter variants in dark mode
- Shadows removed in dark mode, replaced with borders
- Charts and graphs adapt their color palette

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

---

## Offline Indicators (Mobile)

- **Banner:** Yellow/orange bar at top: "You're offline — changes saved locally"
- **Sync badge:** Small indicator on nav showing pending sync count
- **Transaction badges:** Unsynced transactions show a small cloud-with-arrow icon
- **Last synced:** Timestamp shown on home screen: "Last synced: 5 min ago"
- **Sync progress:** When syncing, show progress: "Syncing 3/8 items..."
- **Conflict:** Red badge on Sync Status page if conflicts exist
