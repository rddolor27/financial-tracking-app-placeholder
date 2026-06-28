import { type DataSource, IsNull } from 'typeorm';
import { User } from '../../modules/users/user.entity';
import { Account } from '../../modules/accounts/account.entity';
import { Category } from '../../modules/categories/category.entity';
import { Transaction } from '../../modules/transactions/transaction.entity';
import { Budget } from '../../modules/budgets/budget.entity';
import { Goal } from '../../modules/goals/goal.entity';
import { BillReminder } from '../../modules/bill-reminders/bill-reminder.entity';

function daysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split('T')[0];
}

function thisMonthDay(day: number): string {
  const d = new Date();
  d.setDate(day);
  return d.toISOString().split('T')[0];
}

const DEMO_ACCOUNTS = [
  { name: 'Cash Wallet', bank_name: null, type: 'cash' as const, balance: 5000, icon: 'fa-wallet', color: '#4CAF50' },
  { name: 'BDO Savings', bank_name: 'BDO Unibank', type: 'savings' as const, balance: 50000, icon: 'fa-university', color: '#1565C0' },
  { name: 'GCash', bank_name: 'GCash', type: 'e_wallet' as const, balance: 12000, icon: 'fa-mobile-alt', color: '#007BFF' },
  { name: 'BPI Credit Card', bank_name: 'BPI', type: 'credit_card' as const, balance: -15000, icon: 'fa-credit-card', color: '#D32F2F' },
];

interface TransactionSeed {
  accountName: string;
  categoryName: string;
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  description: string;
  daysAgo: number;
}

const DEMO_TRANSACTIONS: TransactionSeed[] = [
  // Income
  { accountName: 'BDO Savings', categoryName: 'Salary / Wages', type: 'income', amount: 45000, description: 'Monthly salary - June', daysAgo: 2 },
  { accountName: 'BDO Savings', categoryName: 'Salary / Wages', type: 'income', amount: 45000, description: 'Monthly salary - May', daysAgo: 32 },
  { accountName: 'GCash', categoryName: 'Freelance Income', type: 'income', amount: 8500, description: 'Web design project', daysAgo: 10 },
  { accountName: 'BDO Savings', categoryName: 'Interest / Dividends', type: 'income', amount: 125, description: 'Savings account interest', daysAgo: 5 },

  // Food & Dining
  { accountName: 'GCash', categoryName: 'Food & Dining', type: 'expense', amount: 350, description: 'Jollibee lunch', daysAgo: 1 },
  { accountName: 'Cash Wallet', categoryName: 'Food & Dining', type: 'expense', amount: 280, description: 'Mang Inasal dinner', daysAgo: 3 },
  { accountName: 'GCash', categoryName: 'Food & Dining', type: 'expense', amount: 450, description: 'Grab Food delivery', daysAgo: 7 },
  { accountName: 'BPI Credit Card', categoryName: 'Food & Dining', type: 'expense', amount: 1200, description: 'Restaurant dinner with friends', daysAgo: 14 },
  { accountName: 'Cash Wallet', categoryName: 'Food & Dining', type: 'expense', amount: 180, description: 'Street food', daysAgo: 20 },
  { accountName: 'GCash', categoryName: 'Food & Dining', type: 'expense', amount: 520, description: 'Pizza delivery', daysAgo: 25 },

  // Groceries
  { accountName: 'BPI Credit Card', categoryName: 'Groceries', type: 'expense', amount: 3500, description: 'SM Supermarket weekly groceries', daysAgo: 4 },
  { accountName: 'GCash', categoryName: 'Groceries', type: 'expense', amount: 1800, description: 'Puregold essentials', daysAgo: 18 },
  { accountName: 'BPI Credit Card', categoryName: 'Groceries', type: 'expense', amount: 2900, description: 'Robinsons Supermarket', daysAgo: 35 },

  // Transportation
  { accountName: 'Cash Wallet', categoryName: 'Transportation', type: 'expense', amount: 150, description: 'Grab ride to office', daysAgo: 2 },
  { accountName: 'Cash Wallet', categoryName: 'Transportation', type: 'expense', amount: 50, description: 'Jeepney fare', daysAgo: 6 },
  { accountName: 'GCash', categoryName: 'Transportation', type: 'expense', amount: 250, description: 'Grab ride home', daysAgo: 9 },
  { accountName: 'Cash Wallet', categoryName: 'Transportation', type: 'expense', amount: 1500, description: 'Gas refuel', daysAgo: 15 },

  // Utilities
  { accountName: 'GCash', categoryName: 'Utilities', type: 'expense', amount: 3200, description: 'Meralco electric bill', daysAgo: 12 },
  { accountName: 'BDO Savings', categoryName: 'Utilities', type: 'expense', amount: 1200, description: 'Manila Water bill', daysAgo: 13 },

  // Subscriptions
  { accountName: 'BPI Credit Card', categoryName: 'Subscriptions', type: 'expense', amount: 549, description: 'Netflix Premium', daysAgo: 8 },
  { accountName: 'GCash', categoryName: 'Subscriptions', type: 'expense', amount: 159, description: 'Spotify Premium', daysAgo: 11 },

  // Entertainment
  { accountName: 'Cash Wallet', categoryName: 'Entertainment', type: 'expense', amount: 800, description: 'Movie tickets - SM Cinema', daysAgo: 16 },
  { accountName: 'BPI Credit Card', categoryName: 'Entertainment', type: 'expense', amount: 1500, description: 'KTV night', daysAgo: 28 },

  // Healthcare
  { accountName: 'BPI Credit Card', categoryName: 'Healthcare / Medical', type: 'expense', amount: 750, description: 'Pharmacy - vitamins and medicine', daysAgo: 22 },

  // Personal Care
  { accountName: 'Cash Wallet', categoryName: 'Personal Care', type: 'expense', amount: 400, description: 'Haircut', daysAgo: 21 },

  // Clothing
  { accountName: 'BPI Credit Card', categoryName: 'Clothing', type: 'expense', amount: 2500, description: 'Uniqlo shirts', daysAgo: 30 },

  // Education
  { accountName: 'BDO Savings', categoryName: 'Education', type: 'expense', amount: 1500, description: 'Udemy course - React Advanced', daysAgo: 40 },
];

interface BudgetSeed {
  categoryName: string;
  amount: number;
  period: 'weekly' | 'monthly' | 'yearly';
}

const DEMO_BUDGETS: BudgetSeed[] = [
  { categoryName: 'Food & Dining', amount: 15000, period: 'monthly' },
  { categoryName: 'Transportation', amount: 5000, period: 'monthly' },
  { categoryName: 'Entertainment', amount: 3000, period: 'monthly' },
  { categoryName: 'Groceries', amount: 10000, period: 'monthly' },
];

const DEMO_GOALS = [
  { name: 'Emergency Fund', target_amount: 100000, current_amount: 45000, icon: 'fa-shield-alt', color: '#4CAF50' },
  { name: 'New Laptop', target_amount: 80000, current_amount: 25000, target_date: '2026-12-31', icon: 'fa-laptop', color: '#2196F3' },
];

interface BillReminderSeed {
  name: string;
  amount: number;
  due_day: number;
  frequency: 'monthly' | 'quarterly' | 'yearly';
  categoryName: string | null;
}

const DEMO_BILL_REMINDERS: BillReminderSeed[] = [
  { name: 'Meralco Electric Bill', amount: 3500, due_day: 15, frequency: 'monthly', categoryName: 'Utilities' },
  { name: 'PLDT Internet', amount: 1899, due_day: 5, frequency: 'monthly', categoryName: 'Utilities' },
  { name: 'Netflix Subscription', amount: 549, due_day: 20, frequency: 'monthly', categoryName: 'Subscriptions' },
];

async function getCategoryByName(
  categoryRepo: ReturnType<DataSource['getRepository']>,
  name: string,
): Promise<string> {
  const category = await categoryRepo.findOne({
    where: { name, user_id: IsNull(), is_default: true },
  });
  if (!category) {
    throw new Error(`Default category "${name}" not found. Run category seed first.`);
  }
  return (category as Category).id;
}

async function seedUserDemoData(
  dataSource: DataSource,
  user: User,
): Promise<void> {
  const accountRepo = dataSource.getRepository(Account);
  const categoryRepo = dataSource.getRepository(Category);
  const transactionRepo = dataSource.getRepository(Transaction);
  const budgetRepo = dataSource.getRepository(Budget);
  const goalRepo = dataSource.getRepository(Goal);
  const billReminderRepo = dataSource.getRepository(BillReminder);

  // Check if user already has accounts (skip if already seeded)
  const existingAccounts = await accountRepo.find({ where: { user_id: user.id } });
  if (existingAccounts.length > 0) {
    console.log(`  Skipping demo data for ${user.email} (already has accounts)`);
    return;
  }

  // Seed accounts
  const accountMap = new Map<string, Account>();
  for (const acct of DEMO_ACCOUNTS) {
    const saved = await accountRepo.save(
      accountRepo.create({ ...acct, user_id: user.id, currency: 'PHP' }),
    );
    accountMap.set(acct.name, saved);
  }

  // Build category ID cache
  const categoryIdCache = new Map<string, string>();
  const categoryNames = new Set([
    ...DEMO_TRANSACTIONS.map((t) => t.categoryName),
    ...DEMO_BUDGETS.map((b) => b.categoryName),
    ...DEMO_BILL_REMINDERS.filter((br) => br.categoryName).map((br) => br.categoryName!),
  ]);
  for (const name of categoryNames) {
    categoryIdCache.set(name, await getCategoryByName(categoryRepo, name));
  }

  // Seed transactions
  for (const tx of DEMO_TRANSACTIONS) {
    const account = accountMap.get(tx.accountName);
    if (!account) continue;
    await transactionRepo.save(
      transactionRepo.create({
        user_id: user.id,
        account_id: account.id,
        category_id: categoryIdCache.get(tx.categoryName)!,
        type: tx.type,
        amount: tx.amount,
        description: tx.description,
        date: daysAgo(tx.daysAgo),
      }),
    );
  }

  // Seed budgets
  const firstOfMonth = thisMonthDay(1);
  for (const budget of DEMO_BUDGETS) {
    await budgetRepo.save(
      budgetRepo.create({
        user_id: user.id,
        category_id: categoryIdCache.get(budget.categoryName)!,
        amount: budget.amount,
        period: budget.period,
        start_date: firstOfMonth,
      }),
    );
  }

  // Seed goals
  for (const goal of DEMO_GOALS) {
    await goalRepo.save(
      goalRepo.create({
        user_id: user.id,
        ...goal,
        currency: 'PHP',
      }),
    );
  }

  // Seed bill reminders
  for (const bill of DEMO_BILL_REMINDERS) {
    await billReminderRepo.save(
      billReminderRepo.create({
        user_id: user.id,
        name: bill.name,
        amount: bill.amount,
        currency: 'PHP',
        due_day: bill.due_day,
        frequency: bill.frequency,
        category_id: bill.categoryName ? categoryIdCache.get(bill.categoryName) ?? null : null,
      }),
    );
  }

  console.log(`  Seeded demo data for ${user.email}: ${DEMO_ACCOUNTS.length} accounts, ${DEMO_TRANSACTIONS.length} transactions, ${DEMO_BUDGETS.length} budgets, ${DEMO_GOALS.length} goals, ${DEMO_BILL_REMINDERS.length} bill reminders`);
}

export async function seedDemoData(dataSource: DataSource): Promise<void> {
  const userRepo = dataSource.getRepository(User);

  const demoEmails = ['admin@financialtracker.com', 'demo@financialtracker.com'];

  for (const email of demoEmails) {
    const user = await userRepo.findOne({ where: { email } });
    if (!user) {
      console.log(`  User ${email} not found, skipping demo data`);
      continue;
    }
    await seedUserDemoData(dataSource, user);
  }

  console.log('Seeded demo data for all users');
}
