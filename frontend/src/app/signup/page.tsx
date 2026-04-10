"use client";

import Link from "next/link";
import { useState } from "react";
import { signupSchema, type SignupInput } from "@/validations/auth";

const fields = [
  { id: "username", label: "Username", type: "text", icon: "fa-user", placeholder: "Choose a unique username" },
  { id: "email", label: "Email Address", type: "email", icon: "fa-envelope", placeholder: "your.email@example.com" },
  { id: "password1", label: "Password", type: "password", icon: "fa-lock", placeholder: "Create a strong password" },
  { id: "password2", label: "Confirm Password", type: "password", icon: "fa-lock", placeholder: "Confirm your password" },
] as const;

export default function SignupPage() {
  const [form, setForm] = useState<SignupInput>({ username: "", email: "", password1: "", password2: "" });
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = signupSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as string;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    // TODO: Implement real registration via API
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <div className="bg-surface rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-primary text-center py-6 px-4 rounded-t-lg">
          <h2 className="text-2xl font-bold text-white mb-2">
            <i className="fas fa-user-plus mr-2" />Join MemorialBridge
          </h2>
          <p className="text-white/75">Create your account to start preserving memories</p>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} noValidate>
            {fields.map((field) => (
              <div key={field.id} className="mb-4">
                <label htmlFor={field.id} className="block text-sm font-bold text-text mb-1.5">
                  {field.label} <span className="text-danger">*</span>
                </label>
                <div className="flex">
                  <span className="flex items-center px-3 bg-surface-muted border border-r-0 border-border rounded-l-lg">
                    <i className={`fas ${field.icon} text-text-muted`} />
                  </span>
                  <input
                    type={field.type}
                    id={field.id}
                    name={field.id}
                    className={`flex-1 rounded-r-lg rounded-l-none border py-2.5 px-3 text-base outline-none transition-all ${
                      errors[field.id] ? "border-danger focus:ring-danger/15" : "border-border focus:border-primary focus:ring-2 focus:ring-primary/15"
                    }`}
                    placeholder={field.placeholder}
                    value={form[field.id as keyof SignupInput]}
                    onChange={handleChange}
                  />
                </div>
                {errors[field.id] && (
                  <p className="text-sm text-danger mt-1">{errors[field.id]}</p>
                )}
                {field.id === "email" && !errors.email && (
                  <p className="text-sm text-text-secondary mt-1">We&apos;ll send you a verification link to this email</p>
                )}
              </div>
            ))}

            <button type="submit" className="w-full inline-flex items-center justify-center px-6 py-3 rounded-md bg-primary text-white text-lg font-medium hover:bg-primary-dark hover:-translate-y-0.5 transition-all mb-4">
              <i className="fas fa-user-plus mr-2" />Create Account
            </button>

            <p className="text-center text-text-muted">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-bold">Sign in here</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
