import { CreateAccountSchema, AccountSchema, UpdateAccountSchema } from './account.schema';

describe('AccountSchema', () => {
  const validAccount = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    user_id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'BDO Savings',
    bank_name: 'BDO',
    type: 'savings' as const,
    balance: 50000,
    currency: 'PHP',
    color: '#4A90D9',
    icon: 'fa-wallet',
    logo_url: null,
    is_active: true,
    created_at: '2026-06-28T12:00:00.000Z',
    updated_at: '2026-06-28T12:00:00.000Z',
  };

  it('should validate a valid account', () => {
    expect(AccountSchema.safeParse(validAccount).success).toBe(true);
  });

  it('should reject invalid account type', () => {
    expect(AccountSchema.safeParse({ ...validAccount, type: 'invalid' }).success).toBe(false);
  });

  it('should reject invalid hex color', () => {
    expect(AccountSchema.safeParse({ ...validAccount, color: 'red' }).success).toBe(false);
  });

  it('should accept all account types', () => {
    const types = ['checking', 'savings', 'credit_card', 'cash', 'investment', 'loan', 'e_wallet'];
    types.forEach((type) => {
      expect(AccountSchema.safeParse({ ...validAccount, type }).success).toBe(true);
    });
  });
});

describe('CreateAccountSchema', () => {
  it('should apply defaults', () => {
    const result = CreateAccountSchema.safeParse({
      name: 'Cash',
      type: 'cash',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.balance).toBe(0);
      expect(result.data.currency).toBe('PHP');
      expect(result.data.color).toBe('#4A90D9');
    }
  });

  it('should reject empty name', () => {
    expect(CreateAccountSchema.safeParse({ name: '', type: 'cash' }).success).toBe(false);
  });
});

describe('UpdateAccountSchema', () => {
  it('should allow partial update', () => {
    expect(UpdateAccountSchema.safeParse({ name: 'New Name' }).success).toBe(true);
  });

  it('should allow empty update', () => {
    expect(UpdateAccountSchema.safeParse({}).success).toBe(true);
  });
});
