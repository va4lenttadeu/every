import z from "zod";

const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long." })
  .max(20, { message: "Password must be less than 20 characters long." })
  .refine(
    (value) => /(?=.*\d)/.test(value),
    "Password must contain at least one number."
  )
  .refine(
    (value) => /(?=.*[a-z])/.test(value),
    "Password must contain at least one lowercase letter."
  )
  .refine(
    (value) => /(?=.*[A-Z])/.test(value),
    "Password must contain at least one uppercase letter."
  );

export const createUserInputSchema = z.object({
  username: z.string().min(3),
  password: passwordSchema,
});

export type CreateUserInputType = z.infer<typeof createUserInputSchema>;

export const authenticateInputSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(1),
});

export type AuthenticateInputType = z.infer<typeof authenticateInputSchema>;
