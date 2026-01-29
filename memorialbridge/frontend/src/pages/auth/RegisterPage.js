import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Register Page
 * User registration with email and password
 */
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { registerUser } from '../../api/auth';
const registerSchema = z
    .object({
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one digit'),
    confirmPassword: z.string(),
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
})
    .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});
export const RegisterPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, watch, formState: { errors }, } = useForm({
        resolver: zodResolver(registerSchema),
    });
    const password = watch('password');
    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            await registerUser({
                email: data.email,
                password: data.password,
                first_name: data.firstName,
                last_name: data.lastName,
            });
            toast.success('Registration successful! Please log in.');
            navigate('/login');
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Registration failed';
            toast.error(message);
        }
        finally {
            setIsLoading(false);
        }
    };
    const getPasswordStrength = (pass) => {
        let strength = 0;
        if (pass.length >= 8)
            strength++;
        if (/[A-Z]/.test(pass))
            strength++;
        if (/[a-z]/.test(pass))
            strength++;
        if (/[0-9]/.test(pass))
            strength++;
        if (/[!@#$%^&*]/.test(pass))
            strength++;
        return strength;
    };
    const passwordStrength = getPasswordStrength(password || '');
    const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500'];
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4", children: _jsxs("div", { className: "max-w-md mx-auto bg-white rounded-lg shadow-lg p-8", children: [_jsx("h1", { className: "text-3xl font-bold text-center text-gray-900 mb-8", children: "Create Account" }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "firstName", className: "block text-sm font-medium text-gray-700 mb-1", children: "First Name" }), _jsx("input", { ...register('firstName'), type: "text", id: "firstName", placeholder: "John", className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-600" }), errors.firstName && (_jsx("p", { className: "text-red-600 text-sm mt-1", children: errors.firstName.message }))] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "lastName", className: "block text-sm font-medium text-gray-700 mb-1", children: "Last Name" }), _jsx("input", { ...register('lastName'), type: "text", id: "lastName", placeholder: "Doe", className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-600" }), errors.lastName && (_jsx("p", { className: "text-red-600 text-sm mt-1", children: errors.lastName.message }))] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700 mb-1", children: "Email Address" }), _jsx("input", { ...register('email'), type: "email", id: "email", placeholder: "you@example.com", className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-600" }), errors.email && _jsx("p", { className: "text-red-600 text-sm mt-1", children: errors.email.message })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "block text-sm font-medium text-gray-700 mb-1", children: "Password" }), _jsx("input", { ...register('password'), type: "password", id: "password", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-600" }), errors.password && (_jsx("p", { className: "text-red-600 text-sm mt-1", children: errors.password.message })), password && (_jsxs("div", { className: "mt-2", children: [_jsx("div", { className: "text-xs font-medium text-gray-600 mb-1", children: "Password strength:" }), _jsx("div", { className: "flex gap-1", children: [0, 1, 2, 3, 4].map((i) => (_jsx("div", { className: `h-2 w-8 rounded ${i < passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-gray-200'}` }, i))) })] }))] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "confirmPassword", className: "block text-sm font-medium text-gray-700 mb-1", children: "Confirm Password" }), _jsx("input", { ...register('confirmPassword'), type: "password", id: "confirmPassword", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-600" }), errors.confirmPassword && (_jsx("p", { className: "text-red-600 text-sm mt-1", children: errors.confirmPassword.message }))] }), _jsx("button", { type: "submit", disabled: isLoading, className: "btn btn-primary btn-block mt-6", children: isLoading ? 'Creating account...' : 'Sign Up' })] }), _jsxs("p", { className: "text-center text-gray-600 mt-6", children: ["Already have an account?", ' ', _jsx(Link, { to: "/login", className: "text-blue-600 hover:text-blue-700 font-medium", children: "Login" })] })] }) }));
};
