import {
  CreateUserSchema,
  UpdateUserSchema,
  LoginSchema,
  UserSchema,
  UserResponseSchema,
} from './user.schema';

describe('UserSchema', () => {
  const validUser = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    email: 'test@example.com',
    password_hash: '$2b$10$hash',
    google_id: null,
    auth_provider: 'email' as const,
    first_name: 'John',
    last_name: 'Doe',
    avatar_url: null,
    currency: 'PHP',
    created_at: '2026-06-28T12:00:00.000Z',
    updated_at: '2026-06-28T12:00:00.000Z',
  };

  it('should validate a valid user', () => {
    const result = UserSchema.safeParse(validUser);
    expect(result.success).toBe(true);
  });

  it('should reject invalid email', () => {
    const result = UserSchema.safeParse({ ...validUser, email: 'not-email' });
    expect(result.success).toBe(false);
  });

  it('should reject invalid auth_provider', () => {
    const result = UserSchema.safeParse({
      ...validUser,
      auth_provider: 'invalid',
    });
    expect(result.success).toBe(false);
  });

  it('should reject empty first_name', () => {
    const result = UserSchema.safeParse({ ...validUser, first_name: '' });
    expect(result.success).toBe(false);
  });

  it('should accept nullable password_hash for Google users', () => {
    const result = UserSchema.safeParse({
      ...validUser,
      password_hash: null,
      google_id: 'google123',
      auth_provider: 'google',
    });
    expect(result.success).toBe(true);
  });
});

describe('CreateUserSchema', () => {
  it('should validate valid create user data', () => {
    const result = CreateUserSchema.safeParse({
      email: 'test@example.com',
      password: 'password123',
      first_name: 'John',
      last_name: 'Doe',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.currency).toBe('PHP');
    }
  });

  it('should reject short password', () => {
    const result = CreateUserSchema.safeParse({
      email: 'test@example.com',
      password: 'short',
      first_name: 'John',
      last_name: 'Doe',
    });
    expect(result.success).toBe(false);
  });
});

describe('UpdateUserSchema', () => {
  it('should allow partial updates', () => {
    const result = UpdateUserSchema.safeParse({ first_name: 'Jane' });
    expect(result.success).toBe(true);
  });

  it('should allow empty object', () => {
    const result = UpdateUserSchema.safeParse({});
    expect(result.success).toBe(true);
  });
});

describe('LoginSchema', () => {
  it('should validate valid login', () => {
    const result = LoginSchema.safeParse({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(result.success).toBe(true);
  });

  it('should reject missing password', () => {
    const result = LoginSchema.safeParse({ email: 'test@example.com' });
    expect(result.success).toBe(false);
  });
});

describe('UserResponseSchema', () => {
  it('should not include password_hash or google_id', () => {
    const response = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      email: 'test@example.com',
      auth_provider: 'email' as const,
      first_name: 'John',
      last_name: 'Doe',
      avatar_url: null,
      currency: 'PHP',
      created_at: '2026-06-28T12:00:00.000Z',
      updated_at: '2026-06-28T12:00:00.000Z',
    };
    const result = UserResponseSchema.safeParse(response);
    expect(result.success).toBe(true);
  });
});
