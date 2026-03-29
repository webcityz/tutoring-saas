import { z } from "zod";

// Stronger email regex (practical, not overly strict)
const emailRegex =
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .regex(emailRegex, "Invalid email format"),

  password: z.string().min(6, "Password must be at least 6 characters"),

  role: z.enum(["student", "tutor", "admin"]).optional(),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .regex(emailRegex, "Invalid email format"),

  password: z.string(),
});
