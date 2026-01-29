import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Header Component
 * Main navigation header – theme matches footer (dark background)
 */
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/index';
import styles from './Header.module.css';
/** Prefer first name in header; fallback to last name, then full name, then email */
function displayName(user) {
    const first = user.first_name?.trim();
    const last = user.last_name?.trim();
    if (first)
        return first;
    if (last)
        return last;
    const full = [user.first_name, user.last_name].filter(Boolean).join(' ').trim();
    return full || user.email;
}
export const Header = () => {
    const { isAuthenticated, user, logout, token } = useAuth();
    const loggedIn = isAuthenticated || !!token;
    const handleLogout = async () => {
        await logout();
    };
    return (_jsx("header", { className: styles.header, children: _jsxs("nav", { className: styles.inner, children: [_jsx(Link, { to: "/", className: styles.logo, children: "Memorial Bridge" }), _jsx("div", { className: styles.nav, children: loggedIn ? (_jsxs(_Fragment, { children: [_jsx(Link, { to: "/memorials", className: styles.link, children: "Memorials" }), _jsx(Link, { to: "/charities", className: styles.link, children: "Charities" }), _jsx(Link, { to: "/donations", className: styles.link, children: "Donations" }), _jsx(Link, { to: "/profile", className: styles.link, children: user ? displayName(user) : 'Profile' }), user?.is_admin && (_jsx(Link, { to: "/admin", className: `${styles.link} ${styles.adminBadge}`, children: "Admin" })), _jsx("button", { type: "button", onClick: handleLogout, className: styles.btnLogout, children: "Logout" })] })) : (_jsxs(_Fragment, { children: [_jsx(Link, { to: "/memorials", className: styles.link, children: "Memorials" }), _jsx(Link, { to: "/charities", className: styles.link, children: "Charities" }), _jsx(Link, { to: "/login", className: styles.linkButton, children: "Login" }), _jsx(Link, { to: "/register", className: styles.btnPrimary, children: "Sign Up" })] })) })] }) }));
};
