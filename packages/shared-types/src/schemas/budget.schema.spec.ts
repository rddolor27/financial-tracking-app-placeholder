import { BudgetSchema, CreateBudgetSchema } from './budget.schema';

describe('BudgetSchema', () => {
  const validBudget = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    user_id: '550e8400-e29b-41d4-a716-446655440001',
    category_id: '550e8400-e29b-41d4-a716-446655440002',
    amount: 5000,
    period: 'monthly' as const,
    start_date: '2026-06-01',
    end_date: null,
    alert_threshold: 0.8,
    is_active: true,
    created_at: '2026-06-28T12:00:00.000Z',
    updated_at: '2026-06-28T12:00:00.000Z',
  };

  it('should validate a valid budget', () => {
    expect(BudgetSchema.safeParse(validBudget).success).toBe(true);
  });

  it('should reject negative amount', () => {
    expect(BudgetSchema.safeParse({ ...validBudget, amount: -100 }).success).toBe(false);
  });

  it('should reject alert_threshold > 1', () => {
    expect(BudgetSchema.safeParse({ ...validBudget, alert_threshold: 1.5 }).success).toBe(false);
  });

  it('should accept all period types', () => {
    ['weekly', 'monthly', 'yearly'].forEach((period) => {
      expect(BudgetSchema.safeParse({ ...validBudget, period }).success).toBe(true);
    });
  });
});

describe('CreateBudgetSchema', () => {
  it('should apply default alert_threshold', () => {
    const result = CreateBudgetSchema.safeParse({
      category_id: '550e8400-e29b-41d4-a716-446655440002',
      amount: 5000,
      period: 'monthly',
      start_date: '2026-06-01',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.alert_threshold).toBe(0.8);
    }
  });
});
