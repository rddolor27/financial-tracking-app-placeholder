import { CreateTransactionSchema, TransactionSchema } from './transaction.schema';

describe('TransactionSchema', () => {
  const validTransaction = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    user_id: '550e8400-e29b-41d4-a716-446655440001',
    account_id: '550e8400-e29b-41d4-a716-446655440002',
    category_id: '550e8400-e29b-41d4-a716-446655440003',
    type: 'expense' as const,
    amount: 150.5,
    description: 'Grocery shopping',
    date: '2026-06-28',
    transfer_to_account_id: null,
    image_url: null,
    latitude: null,
    longitude: null,
    location_name: null,
    is_recurring: false,
    recurring_interval: null,
    recurring_next_date: null,
    tags: ['groceries'],
    created_at: '2026-06-28T12:00:00.000Z',
    updated_at: '2026-06-28T12:00:00.000Z',
  };

  it('should validate a valid transaction', () => {
    expect(TransactionSchema.safeParse(validTransaction).success).toBe(true);
  });

  it('should reject negative amount', () => {
    expect(TransactionSchema.safeParse({ ...validTransaction, amount: -100 }).success).toBe(false);
  });

  it('should reject zero amount', () => {
    expect(TransactionSchema.safeParse({ ...validTransaction, amount: 0 }).success).toBe(false);
  });

  it('should accept location data', () => {
    const result = TransactionSchema.safeParse({
      ...validTransaction,
      latitude: 14.5995,
      longitude: 120.9842,
      location_name: 'SM Mall of Asia, Pasay',
    });
    expect(result.success).toBe(true);
  });

  it('should reject latitude out of range', () => {
    expect(
      TransactionSchema.safeParse({ ...validTransaction, latitude: 91 }).success,
    ).toBe(false);
  });
});

describe('CreateTransactionSchema', () => {
  it('should validate a simple expense', () => {
    const result = CreateTransactionSchema.safeParse({
      account_id: '550e8400-e29b-41d4-a716-446655440002',
      category_id: '550e8400-e29b-41d4-a716-446655440003',
      type: 'expense',
      amount: 100,
      date: '2026-06-28',
    });
    expect(result.success).toBe(true);
  });

  it('should require transfer_to_account_id for transfers', () => {
    const result = CreateTransactionSchema.safeParse({
      account_id: '550e8400-e29b-41d4-a716-446655440002',
      category_id: '550e8400-e29b-41d4-a716-446655440003',
      type: 'transfer',
      amount: 100,
      date: '2026-06-28',
    });
    expect(result.success).toBe(false);
  });

  it('should accept transfer with transfer_to_account_id', () => {
    const result = CreateTransactionSchema.safeParse({
      account_id: '550e8400-e29b-41d4-a716-446655440002',
      category_id: '550e8400-e29b-41d4-a716-446655440003',
      type: 'transfer',
      amount: 100,
      date: '2026-06-28',
      transfer_to_account_id: '550e8400-e29b-41d4-a716-446655440004',
    });
    expect(result.success).toBe(true);
  });

  it('should require recurring_interval when is_recurring is true', () => {
    const result = CreateTransactionSchema.safeParse({
      account_id: '550e8400-e29b-41d4-a716-446655440002',
      category_id: '550e8400-e29b-41d4-a716-446655440003',
      type: 'expense',
      amount: 100,
      date: '2026-06-28',
      is_recurring: true,
    });
    expect(result.success).toBe(false);
  });

  it('should accept recurring with interval', () => {
    const result = CreateTransactionSchema.safeParse({
      account_id: '550e8400-e29b-41d4-a716-446655440002',
      category_id: '550e8400-e29b-41d4-a716-446655440003',
      type: 'expense',
      amount: 100,
      date: '2026-06-28',
      is_recurring: true,
      recurring_interval: 'monthly',
    });
    expect(result.success).toBe(true);
  });
});
