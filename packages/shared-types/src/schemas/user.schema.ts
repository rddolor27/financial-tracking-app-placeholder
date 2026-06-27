import { z } from 'zod';
import { AuthProviderEnum } from '../enums';

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email().max(255),
  password_hash: z.string().max(255).nullable(),
  google_id: z.string().max(255).nullable(),
  auth_provider: AuthProviderEnum,
  first_name: z.string().min(1).max(100),
  last_name: z.string().min(1).max(100),
  avatar_url: z.string().url().max(500).nullable(),
  currency: z.string().length(3).default('PHP'),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type User = z.infer<typeof UserSchema>;

export const CreateUserSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(128),
  first_name: z.string().min(1).max(100),
  last_name: z.string().min(1).max(100),
  currency: z.string().length(3).default('PHP'),
});

export type CreateUser = z.infer<typeof CreateUserSchema>;

export const UpdateUserSchema = z.object({
  first_name: z.string().min(1).max(100).optional(),
  last_name: z.string().min(1).max(100).optional(),
  avatar_url: z.string().url().max(500).nullable().optional(),
  currency: z.string().length(3).optional(),
});

export type UpdateUser = z.infer<typeof UpdateUserSchema>;

export const UserResponseSchema = UserSchema.omit({
  password_hash: true,
  google_id: true,
});

export type UserResponse = z.infer<typeof UserResponseSchema>;

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type Login = z.infer<typeof LoginSchema>;

export const AuthResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  user: UserResponseSchema,
});

export type AuthResponse = z.infer<typeof AuthResponseSchema>;

export const RefreshTokenRequestSchema = z.object({
  refresh_token: z.string(),
});

export type RefreshTokenRequest = z.infer<typeof RefreshTokenRequestSchema>;
