import { User, AuthResponse } from '../../types/index';

export const mockUser: User = {
  id: '1',
  email: 'test@example.com',
  first_name: 'John',
  last_name: 'Doe',
  is_active: true,
  is_admin: false,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

export const mockAuthResponse: AuthResponse = {
  access_token: 'test-token-123',
  user: mockUser,
};

export const mockAdminUser: User = {
  ...mockUser,
  id: '2',
  email: 'admin@example.com',
  is_admin: true,
};

export const mockInactiveUser: User = {
  ...mockUser,
  id: '3',
  is_active: false,
};
