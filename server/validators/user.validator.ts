import { z } from 'zod';

export const userLoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const userRegistrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  registerNumber: z.string().min(5, 'Invalid register number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  year: z.number().int().min(1).max(4),
  department: z.string().min(2, 'Department is required'),
});

export const idSchema = z.string().cuid('Invalid ID format').or(z.string().uuid('Invalid ID format'));
