/**
 * Auth API Endpoints
 */
import { User, LoginRequest, RegistrationRequest, AuthResponse } from '../types/index';
export declare const authAPI: {
    register: (credentials: RegistrationRequest) => Promise<AuthResponse>;
    login: (credentials: LoginRequest) => Promise<AuthResponse>;
    logout: () => Promise<void>;
    getCurrentUser: () => Promise<User>;
    updateProfile: (data: Partial<User>) => Promise<User>;
    changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;
    resetPassword: (token: string, newPassword: string) => Promise<void>;
};
export declare const registerUser: (credentials: RegistrationRequest) => Promise<AuthResponse>;
export declare const loginUser: (credentials: LoginRequest) => Promise<AuthResponse>;
export declare const logoutUser: () => Promise<void>;
export declare const getCurrentUser: () => Promise<User>;
export declare const updateProfile: (data: Partial<User>) => Promise<User>;
export declare const changePassword: (data: {
    current_password: string;
    new_password: string;
}) => Promise<void>;
export declare const forgotPassword: (email: string) => Promise<void>;
export declare const resetPassword: (token: string, newPassword: string) => Promise<void>;
//# sourceMappingURL=auth.d.ts.map