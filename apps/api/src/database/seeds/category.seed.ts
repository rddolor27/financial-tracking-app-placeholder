import { DataSource } from 'typeorm';
import { Category } from '../../modules/categories/category.entity';

interface DefaultCategory {
  name: string;
  type: 'expense' | 'income';
  icon: string;
  color: string;
}

const DEFAULT_EXPENSE_CATEGORIES: DefaultCategory[] = [
  { name: 'Food & Dining', type: 'expense', icon: 'fa-utensils', color: '#FF6384' },
  { name: 'Groceries', type: 'expense', icon: 'fa-shopping-cart', color: '#36A2EB' },
  { name: 'Rent / Housing', type: 'expense', icon: 'fa-home', color: '#FFCE56' },
  { name: 'Utilities', type: 'expense', icon: 'fa-bolt', color: '#4BC0C0' },
  { name: 'Transportation', type: 'expense', icon: 'fa-car', color: '#9966FF' },
  { name: 'Clothing', type: 'expense', icon: 'fa-tshirt', color: '#FF9F40' },
  { name: 'Healthcare / Medical', type: 'expense', icon: 'fa-medkit', color: '#FF6384' },
  { name: 'Entertainment', type: 'expense', icon: 'fa-film', color: '#C9CBCF' },
  { name: 'Subscriptions', type: 'expense', icon: 'fa-credit-card', color: '#7C4DFF' },
  { name: 'Education', type: 'expense', icon: 'fa-graduation-cap', color: '#00BCD4' },
  { name: 'Insurance', type: 'expense', icon: 'fa-shield-alt', color: '#607D8B' },
  { name: 'Personal Care', type: 'expense', icon: 'fa-spa', color: '#E91E63' },
  { name: 'Gifts & Donations', type: 'expense', icon: 'fa-gift', color: '#8BC34A' },
  { name: 'Miscellaneous', type: 'expense', icon: 'fa-ellipsis-h', color: '#9E9E9E' },
];

const DEFAULT_INCOME_CATEGORIES: DefaultCategory[] = [
  { name: 'Salary / Wages', type: 'income', icon: 'fa-money-bill', color: '#4CAF50' },
  { name: 'Freelance Income', type: 'income', icon: 'fa-laptop', color: '#2196F3' },
  { name: 'Interest / Dividends', type: 'income', icon: 'fa-chart-line', color: '#FF9800' },
  { name: 'Savings / Investment Returns', type: 'income', icon: 'fa-piggy-bank', color: '#009688' },
];

export async function seedCategories(dataSource: DataSource): Promise<void> {
  const repo = dataSource.getRepository(Category);
  const allDefaults = [...DEFAULT_EXPENSE_CATEGORIES, ...DEFAULT_INCOME_CATEGORIES];

  for (const cat of allDefaults) {
    const existing = await repo.findOne({
      where: { name: cat.name, user_id: undefined as unknown as null, is_default: true },
    });

    if (!existing) {
      await repo.save(
        repo.create({
          ...cat,
          user_id: null,
          is_default: true,
          is_hidden: false,
          parent_id: null,
        }),
      );
    }
  }

  console.log(`Seeded ${allDefaults.length} default categories`);
}
