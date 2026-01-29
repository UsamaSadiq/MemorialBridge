/**
 * Password Reset Page
 * Reset password after requesting password reset
 */

import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { forgotPassword, resetPassword as resetPasswordApi } from '../../api/auth';

const forgotSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const resetSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain uppercase letter')
      .regex(/[a-z]/, 'Must contain lowercase letter')
      .regex(/[0-9]/, 'Must contain digit'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ForgotFormData = z.infer<typeof forgotSchema>;
type ResetFormData = z.infer<typeof resetSchema>;

export const PasswordResetPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const [isLoading, setIsLoading] = useState(false);
  const [resetRequested, setResetRequested] = useState(false);

  const {
    register: registerForgot,
    handleSubmit: handleForgotSubmit,
    formState: { errors: forgotErrors },
  } = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema),
  });

  const {
    register: registerReset,
    handleSubmit: handleResetSubmit,
    watch,
    formState: { errors: resetErrors },
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
  });

  const password = watch('password');

  const onForgotSubmit = async (data: ForgotFormData) => {
    setIsLoading(true);
    try {
      await forgotPassword(data.email);
      toast.success('Password reset link sent to your email');
      setResetRequested(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send reset email';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const onResetSubmit = async (data: ResetFormData) => {
    if (!token) {
      toast.error('Invalid reset link');
      return;
    }

    setIsLoading(true);
    try {
      await resetPasswordApi(token, data.password);
      toast.success('Password reset successful! Please login.');
      navigate('/login');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to reset password';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (pass: string) => {
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[a-z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[!@#$%^&*]/.test(pass)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password || '');
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
        {token ? (
          <>
            <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Reset Password</h1>

            <form onSubmit={handleResetSubmit(onResetSubmit)} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  {...registerReset('password')}
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-600"
                />
                {resetErrors.password && (
                  <p className="text-red-600 text-sm mt-1">{resetErrors.password.message}</p>
                )}
                {password && (
                  <div className="mt-2">
                    <div className="text-xs font-medium text-gray-600 mb-1">Password strength:</div>
                    <div className="flex gap-1">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-2 w-8 rounded ${
                            i < passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm Password
                </label>
                <input
                  {...registerReset('confirmPassword')}
                  type="password"
                  id="confirmPassword"
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-600"
                />
                {resetErrors.confirmPassword && (
                  <p className="text-red-600 text-sm mt-1">{resetErrors.confirmPassword.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary btn-block"
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>

            <p className="text-center text-gray-600 mt-6">
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Back to Login
              </Link>
            </p>
          </>
        ) : resetRequested ? (
          <>
            <h1 className="text-2xl font-bold text-center text-gray-900 mb-4">Check Your Email</h1>
            <p className="text-gray-600 text-center mb-6">
              We've sent a password reset link to your email. Click the link to reset your password.
            </p>
            <Link
              to="/forgot-password"
              className="btn btn-primary btn-block"
            >
              Try Another Email
            </Link>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">Forgot Password</h1>
            <p className="text-gray-600 text-center mb-8">
              Enter your email and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleForgotSubmit(onForgotSubmit)} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  {...registerForgot('email')}
                  type="email"
                  id="email"
                  placeholder="you@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-600"
                />
                {forgotErrors.email && (
                  <p className="text-red-600 text-sm mt-1">{forgotErrors.email.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary btn-block"
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>

            <p className="text-center text-gray-600 mt-6">
              Remember your password?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Login
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};
