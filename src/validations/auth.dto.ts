import { z } from "zod";

export const loginDto = z.object({
  email: z.string().min(1, "Email is required").email(),
  password: z.string().min(1, "Password is required"),
});

export type LoginDto = z.infer<typeof loginDto>;

export const registerDto = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(
      /[0-9!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one number or special character",
    ),
});

export type RegisterDto = z.infer<typeof registerDto>;

export const forgotPasswordDto = z.object({
  email: z.string().min(1, "Email is required").email(),
});

export type ForgotPasswordDto = z.infer<typeof forgotPasswordDto>;
