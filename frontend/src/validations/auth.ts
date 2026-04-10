import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(150, "Username must be at most 150 characters")
      .regex(
        /^[\w.@+-]+$/,
        "Username may only contain letters, digits, and @/./+/-/_"
      ),
    email: z.string().email("Enter a valid email address"),
    password1: z.string().min(8, "Password must be at least 8 characters"),
    password2: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password1 === data.password2, {
    message: "Passwords do not match",
    path: ["password2"],
  });

export type SignupInput = z.infer<typeof signupSchema>;
