import { CreateCategorySchema, CategorySchema } from './category.schema';

describe('CategorySchema', () => {
  const validCategory = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    user_id: null,
    name: 'Food & Dining',
    type: 'expense' as const,
    icon: 'fa-utensils',
    color: '#FF6384',
    is_default: true,
    is_hidden: false,
    parent_id: null,
    created_at: '2026-06-28T12:00:00.000Z',
    updated_at: '2026-06-28T12:00:00.000Z',
  };

  it('should validate a valid category', () => {
    expect(CategorySchema.safeParse(validCategory).success).toBe(true);
  });

  it('should allow null user_id for system defaults', () => {
    expect(CategorySchema.safeParse({ ...validCategory, user_id: null }).success).toBe(true);
  });

  it('should accept expense and income types', () => {
    expect(CategorySchema.safeParse({ ...validCategory, type: 'expense' }).success).toBe(true);
    expect(CategorySchema.safeParse({ ...validCategory, type: 'income' }).success).toBe(true);
    expect(CategorySchema.safeParse({ ...validCategory, type: 'transfer' }).success).toBe(false);
  });
});

describe('CreateCategorySchema', () => {
  it('should validate with defaults', () => {
    const result = CreateCategorySchema.safeParse({
      name: 'Custom Category',
      type: 'expense',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.icon).toBe('fa-tag');
      expect(result.data.color).toBe('#808080');
    }
  });

  it('should accept subcategory with parent_id', () => {
    const result = CreateCategorySchema.safeParse({
      name: 'Fast Food',
      type: 'expense',
      parent_id: '550e8400-e29b-41d4-a716-446655440000',
    });
    expect(result.success).toBe(true);
  });
});
