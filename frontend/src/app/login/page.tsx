"use client";

import Link from "next/link";
import { useState } from "react";
import { loginSchema, type LoginInput } from "@/validations/auth";

export default function LoginPage() {
  const [form, setForm] = useState<LoginInput>({ username: "", password: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof LoginInput, string>>>({});
  const [submitError, setSubmitError] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = loginSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: typeof errors = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof LoginInput;
        fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    // TODO: Implement real authentication via API
    setSubmitError(true);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-surface rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-primary text-center py-6 px-4 rounded-t-lg">
          <h2 className="text-2xl font-bold text-white mb-2">
            <i className="fas fa-sign-in-alt mr-2" />Welcome Back
          </h2>
          <p className="text-white/75">Sign in to your MemorialBridge account</p>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} noValidate>
            {[
              { id: "username" as const, label: "Username", type: "text", icon: "fa-user", placeholder: "Enter your username" },
              { id: "password" as const, label: "Password", type: "password", icon: "fa-lock", placeholder: "Enter your password" },
            ].map((field) => (
              <div key={field.id} className={field.id === "password" ? "mb-5" : "mb-4"}>
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
                    value={form[field.id]}
                    onChange={handleChange}
                  />
                </div>
                {errors[field.id] && (
                  <p className="text-sm text-danger mt-1">{errors[field.id]}</p>
                )}
              </div>
            ))}

            {submitError && (
              <div className="rounded-lg bg-danger/10 border-l-4 border-danger px-4 py-3 text-danger mb-4">
                <i className="fas fa-exclamation-circle mr-2" />Please check your username and password and try again.
              </div>
            )}

            <button type="submit" className="w-full inline-flex items-center justify-center px-6 py-3 rounded-md bg-primary text-white text-lg font-medium hover:bg-primary-dark hover:-translate-y-0.5 transition-all mb-4">
              <i className="fas fa-sign-in-alt mr-2" />Sign In
            </button>

            <p className="text-center text-text-muted">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-primary font-bold">Create one here</Link>
            </p>
          </form>
        </div>
      </div>

      <div className="mt-4 rounded-lg bg-accent/10 border-l-4 border-accent px-4 py-3 text-accent-dark shadow-sm">
        <h6 className="font-bold mb-1"><i className="fas fa-info-circle mr-2" />Demo Account</h6>
        <p className="text-sm">
          Try with: <strong>Username:</strong> demo &middot; <strong>Password:</strong> demo1234
        </p>
      </div>
    </div>
  );
}
