import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(4, "Your name must be at least 4 characters long"),
  email: z.string().email("Invalid email address!"),
  password: z.string().min(6, "Your password must be at least 6 characters long"),
  confirmPassword: z.string().min(6, "Your password must be at least 6 characters long"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const loginUserSchema = z.object({
  email: z.string().email("Invalid email address!"),
  password: z.string().min(6, "Your password must be at least 6 characters long"),
});

export type CreateUserDTO = z.infer<typeof createUserSchema>;
export type LoginDTO = z.infer<typeof loginUserSchema>;
