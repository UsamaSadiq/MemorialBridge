/**
 * Profile Page
 * User profile management and account settings
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/index';
import { updateProfile, changePassword } from '../../api/auth';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/index';
import { setUser } from '../../store/slices/authSlice';

const profileSchema = z.object({
  email: z.string().email('Invalid email'),
  first_name: z.string().min(2, 'First name required'),
  last_name: z.string().min(2, 'Last name required'),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(8, 'Password must be at least 8 characters'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain uppercase letter')
      .regex(/[a-z]/, 'Must contain lowercase letter')
      .regex(/[0-9]/, 'Must contain digit'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export const ProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useAuth();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfile,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      email: '',
      first_name: '',
      last_name: '',
    },
  });

  // Sync form when user loads or updates (e.g. after fetchCurrentUser or profile save)
  useEffect(() => {
    if (user) {
      resetProfile({
        email: user.email ?? '',
        first_name: user.first_name ?? '',
        last_name: user.last_name ?? '',
      });
    }
  }, [user?.id, user?.email, user?.first_name, user?.last_name, resetProfile]);

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onProfileSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      const updated = await updateProfile(data);
      dispatch(setUser(updated));
      toast.success('Profile updated successfully');
      setIsEditingProfile(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update profile';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    setIsLoading(true);
    try {
      await changePassword({
        current_password: data.currentPassword,
        new_password: data.newPassword,
      });
      toast.success('Password changed successfully');
      setIsChangingPassword(false);
      resetPassword();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to change password';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue-400 mx-auto mb-4" />
          <p className="text-gray-600 text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="mt-2 text-gray-600">Manage your account and security</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Profile Section */}
        <div className="bg-white rounded-comfort shadow-gentle p-8 border border-brand-blue-100">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Account Information</h2>
            <button
              type="button"
              onClick={() => {
                setIsEditingProfile(!isEditingProfile);
                resetProfile({
                  email: user.email ?? '',
                  first_name: user.first_name ?? '',
                  last_name: user.last_name ?? '',
                });
              }}
              className={`btn ${isEditingProfile ? 'btn-secondary' : 'btn-primary'}`}
              aria-label={isEditingProfile ? 'Cancel editing profile' : 'Edit profile'}
            >
              {isEditingProfile ? 'Cancel' : 'Edit profile'}
            </button>
          </div>

          {isEditingProfile ? (
            <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    {...registerProfile('first_name')}
                    type="text"
                    id="first_name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-soft focus:outline-none focus:ring-2 focus:ring-brand-blue-400 focus:border-transparent text-gray-900 bg-white"
                  />
                  {profileErrors.first_name && (
                    <p className="text-red-600 text-sm mt-1">{profileErrors.first_name.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    {...registerProfile('last_name')}
                    type="text"
                    id="last_name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-soft focus:outline-none focus:ring-2 focus:ring-brand-blue-400 focus:border-transparent text-gray-900 bg-white"
                  />
                  {profileErrors.last_name && (
                    <p className="text-red-600 text-sm mt-1">{profileErrors.last_name.message}</p>
                  )}
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  {...registerProfile('email')}
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-soft focus:outline-none focus:ring-2 focus:ring-brand-blue-400 focus:border-transparent text-gray-900 bg-white"
                />
                {profileErrors.email && (
                  <p className="text-red-600 text-sm mt-1">{profileErrors.email.message}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-success btn-block"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700">First Name</p>
                <p className="text-lg text-gray-900 mt-0.5">
                  {user.first_name?.trim() || '—'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Last Name</p>
                <p className="text-lg text-gray-900 mt-0.5">
                  {user.last_name?.trim() || '—'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Email</p>
                <p className="text-lg text-gray-900 mt-0.5">{user.email}</p>
              </div>
            </div>
          )}
        </div>

        {/* Change Password Section */}
        <div className="bg-white rounded-comfort shadow-gentle p-8 border border-brand-blue-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Security</h2>
            <button
              type="button"
              onClick={() => {
                setIsChangingPassword(!isChangingPassword);
                resetPassword();
              }}
              className={`btn ${isChangingPassword ? 'btn-secondary' : 'btn-primary'}`}
            >
              {isChangingPassword ? 'Cancel' : 'Change Password'}
            </button>
          </div>

          {isChangingPassword ? (
            <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  {...registerPassword('currentPassword')}
                  type="password"
                  id="currentPassword"
                  className="w-full px-4 py-2 border border-gray-300 rounded-soft focus:outline-none focus:ring-2 focus:ring-brand-blue-400 focus:border-transparent text-gray-900 bg-white"
                />
                {passwordErrors.currentPassword && (
                  <p className="text-red-600 text-sm mt-1">{passwordErrors.currentPassword.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  {...registerPassword('newPassword')}
                  type="password"
                  id="newPassword"
                  className="w-full px-4 py-2 border border-gray-300 rounded-soft focus:outline-none focus:ring-2 focus:ring-brand-blue-400 focus:border-transparent text-gray-900 bg-white"
                />
                {passwordErrors.newPassword && (
                  <p className="text-red-600 text-sm mt-1">{passwordErrors.newPassword.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  {...registerPassword('confirmPassword')}
                  type="password"
                  id="confirmPassword"
                  className="w-full px-4 py-2 border border-gray-300 rounded-soft focus:outline-none focus:ring-2 focus:ring-brand-blue-400 focus:border-transparent text-gray-900 bg-white"
                />
                {passwordErrors.confirmPassword && (
                  <p className="text-red-600 text-sm mt-1">{passwordErrors.confirmPassword.message}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-success btn-block"
              >
                {isLoading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          ) : (
            <p className="text-gray-600">Click "Change Password" to update your password</p>
          )}
        </div>
      </div>
    </div>
  );
};
