import { z } from "zod";

const errorMessage: string = "amount can not be less than 0";

export const ExpenseZod = z.object({
  user: z.string(),
  day: z.number().min(1),
  health: z.number().min(0, { error: errorMessage }).default(0),
  leisure: z.number().min(0, { error: errorMessage }).default(0),
  grocery: z.number().min(0, { error: errorMessage }).default(0),
  clothing: z.number().min(0, { error: errorMessage }).default(0),
  utilities: z.number().min(0, { error: errorMessage }).default(0),
  electronics: z.number().min(0, { error: errorMessage }).default(0),
});

export const userZod = z.object({
  name: z.string().trim(),
  email: z.string().trim().email({ error: "provide a valid email" }),
  password: z
    .string()
    .min(6, { error: "password can not be less than 6 characters" }),
});

export type userType = z.infer<typeof userZod>;
export type expenseType = z.infer<typeof ExpenseZod>;
