import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../test-utils';
import { ProfilePage } from '../../pages/auth/ProfilePage';
import * as authSlice from '../../store/slices/authSlice';

// Mock the auth API
vi.mock('../../api/auth', () => ({
  updateProfile: vi.fn(),
  changePassword: vi.fn(),
}));

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock useAuth hook
vi.mock('../../hooks/index', async () => {
  const actual = await vi.importActual('../../hooks/index');
  return {
    ...actual,
    useAuth: () => ({
      user: {
        id: '1',
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
        is_active: true,
        is_admin: false,
      },
      isAuthenticated: true,
      token: 'test-token',
      isLoading: false,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
    }),
  };
});

describe('ProfilePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders profile page with user information', () => {
    renderWithProviders(<ProfilePage />);

    expect(screen.getByText('My Profile')).toBeInTheDocument();
    expect(screen.getByText('Account Information')).toBeInTheDocument();
    expect(screen.getByText('Security')).toBeInTheDocument();
  });

  it('displays user profile in read-only mode initially', () => {
    renderWithProviders(<ProfilePage />);

    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Doe')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('toggles edit mode for profile', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProfilePage />);

    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    const profileEditButton = editButtons[0];

    await user.click(profileEditButton);

    // Should show form inputs in edit mode
    expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
  });

  it('toggles password change mode', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProfilePage />);

    const changePasswordButtons = screen.getAllByRole('button', { name: /change password/i });
    const passwordButton = changePasswordButtons[0];

    await user.click(passwordButton);

    expect(screen.getByLabelText(/current password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/new password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
  });

  it('validates profile form fields', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProfilePage />);

    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    await user.click(editButtons[0]);

    const firstNameInput = screen.getByDisplayValue('John') as HTMLInputElement;
    await user.clear(firstNameInput);
    await user.type(firstNameInput, 'J');

    const saveButton = screen.getByRole('button', { name: /save changes/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/first name required/i)).toBeInTheDocument();
    });
  });

  it('validates password change requires current password', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProfilePage />);

    const changePasswordButtons = screen.getAllByRole('button', { name: /change password/i });
    await user.click(changePasswordButtons[0]);

    const updateButton = screen.getByRole('button', { name: /update password/i });
    await user.click(updateButton);

    await waitFor(() => {
      const errorMessages = screen.getAllByText(/password must be at least 8 characters/i);
      expect(errorMessages.length).toBeGreaterThan(0);
    });
  });

  it('validates new passwords match', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProfilePage />);

    const changePasswordButtons = screen.getAllByRole('button', { name: /change password/i });
    await user.click(changePasswordButtons[0]);

    const currentPasswordInput = screen.getByLabelText(/current password/i);
    const newPasswordInput = screen.getByLabelText(/new password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

    await user.type(currentPasswordInput, 'OldPassword123');
    await user.type(newPasswordInput, 'NewPassword123');
    await user.type(confirmPasswordInput, 'DifferentPassword123');

    const updateButton = screen.getByRole('button', { name: /update password/i });
    await user.click(updateButton);

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  it('shows cancel button to exit edit mode', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProfilePage />);

    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    await user.click(editButtons[0]);

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    expect(cancelButton).toBeInTheDocument();

    await user.click(cancelButton);

    // Should return to read-only mode
    expect(screen.queryByDisplayValue('John')).not.toBeInTheDocument();
  });

  it('displays account information section correctly', () => {
    renderWithProviders(<ProfilePage />);

    expect(screen.getByText('First Name')).toBeInTheDocument();
    expect(screen.getByText('Last Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('displays security section with change password option', () => {
    renderWithProviders(<ProfilePage />);

    const securitySection = screen.getByText('Security');
    expect(securitySection).toBeInTheDocument();
    expect(screen.getByText(/click "change password" to update/i)).toBeInTheDocument();
  });
});
