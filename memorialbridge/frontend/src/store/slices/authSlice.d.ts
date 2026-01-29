/**
 * Auth Slice
 * Redux state management for authentication
 */
import { User, LoginRequest, RegistrationRequest, AuthResponse } from '../../types/index';
interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
    isAuthenticated: boolean;
}
export declare const register: import("@reduxjs/toolkit").AsyncThunk<AuthResponse, RegistrationRequest, import("@reduxjs/toolkit").AsyncThunkConfig>;
export declare const login: import("@reduxjs/toolkit").AsyncThunk<AuthResponse, LoginRequest, import("@reduxjs/toolkit").AsyncThunkConfig>;
export declare const fetchCurrentUser: import("@reduxjs/toolkit").AsyncThunk<User, void, import("@reduxjs/toolkit").AsyncThunkConfig>;
export declare const logout: import("@reduxjs/toolkit").AsyncThunk<undefined, void, import("@reduxjs/toolkit").AsyncThunkConfig>;
export declare const clearError: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"auth/clearError">, setIsAuthenticated: import("@reduxjs/toolkit").ActionCreatorWithPayload<boolean, "auth/setIsAuthenticated">;
declare const _default: import("redux").Reducer<AuthState>;
export default _default;
export declare const loginAsync: import("@reduxjs/toolkit").AsyncThunk<AuthResponse, LoginRequest, import("@reduxjs/toolkit").AsyncThunkConfig>;
export declare const logoutAsync: import("@reduxjs/toolkit").AsyncThunk<undefined, void, import("@reduxjs/toolkit").AsyncThunkConfig>;
//# sourceMappingURL=authSlice.d.ts.map