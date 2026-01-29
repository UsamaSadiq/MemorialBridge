import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Error Boundary Component
 * Catches React errors and displays fallback UI
 */
import React from 'react';
export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50", children: _jsx("div", { className: "max-w-md w-full space-y-8", children: _jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Something went wrong" }), _jsx("p", { className: "mt-2 text-gray-600", children: this.state.error?.message }), _jsx("button", { onClick: () => window.location.reload(), className: "btn btn-primary btn-block mt-4", children: "Reload Page" })] }) }) }));
        }
        return this.props.children;
    }
}
