/**
 * API Types and Interfaces
 * Shared types for all API interactions
 */
export interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    is_admin: boolean;
    is_pro: boolean;
    created_at: string;
    updated_at: string;
}
export interface Memorial {
    id: string;
    user_id: string;
    name: string;
    birth_date: string;
    death_date: string;
    biography: string;
    privacy: 'public' | 'private';
    status: 'pending' | 'approved' | 'rejected';
    charity_id?: string;
    created_at: string;
    updated_at: string;
}
export interface MemorialImage {
    id: string;
    memorial_id: string;
    image_url: string;
    created_at: string;
}
export interface Comment {
    id: string;
    memorial_id: string;
    user_email_masked: string;
    body: string;
    created_at: string;
}
export interface Charity {
    id: string;
    name: string;
    description: string;
    website: string;
    is_active: boolean;
}
export interface Subscription {
    user_id: string;
    is_pro: boolean;
    plan: 'free' | 'pro';
    renewal_date?: string;
    created_at: string;
}
export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    page_size: number;
}
export interface ErrorResponse {
    detail: string;
    error_code?: string;
}
export interface AuthResponse {
    access_token: string;
    token_type: string;
}
export interface MemorialCreateRequest {
    name: string;
    birth_date: string;
    death_date: string;
    biography: string;
    privacy: 'public' | 'private';
    charity_id?: string;
}
export interface CommentCreateRequest {
    body: string;
}
export interface RegistrationRequest {
    email: string;
    password: string;
}
export interface LoginRequest {
    email: string;
    password: string;
}
//# sourceMappingURL=index.d.ts.map