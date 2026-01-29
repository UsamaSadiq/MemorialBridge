import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Main App Component
 * Application routing and layout
 */
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { store } from './store/index';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ProfilePage } from './pages/auth/ProfilePage';
import { PasswordResetPage } from './pages/auth/PasswordResetPage';
import { MemorialsListPage } from './pages/memorials/MemorialsListPage';
import { MemorialDetailPage } from './pages/memorials/MemorialDetailPage';
import { CreateMemorialPage } from './pages/memorials/CreateMemorialPage';
import { EditMemorialPage } from './pages/memorials/EditMemorialPage';
import { DeleteMemorialPage } from './pages/memorials/DeleteMemorialPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { ModerationQueuePage } from './pages/admin/ModerationQueuePage';
import { UserManagementPage } from './pages/admin/UserManagementPage';
import { ReportsPage } from './pages/admin/ReportsPage';
import { SettingsPage } from './pages/admin/SettingsPage';
import { AdminCharitiesPage } from './pages/admin/AdminCharitiesPage';
import { CharityListPage } from './pages/CharityListPage';
import { CharityDetailPage } from './pages/CharityDetailPage';
import { FundraiserPage } from './pages/FundraiserPage';
import { DonationPage } from './pages/DonationPage';
import 'react-toastify/dist/ReactToastify.css';
function App() {
    return (_jsx(Provider, { store: store, children: _jsx(ErrorBoundary, { children: _jsxs(Router, { children: [_jsxs("div", { className: "flex flex-col min-h-screen", children: [_jsx(Header, {}), _jsx("main", { className: "flex-grow", children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(HomePage, {}) }), _jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsx(Route, { path: "/register", element: _jsx(RegisterPage, {}) }), _jsx(Route, { path: "/forgot-password", element: _jsx(PasswordResetPage, {}) }), _jsx(Route, { path: "/profile", element: _jsx(ProtectedRoute, { children: _jsx(ProfilePage, {}) }) }), _jsx(Route, { path: "/memorials", element: _jsx(MemorialsListPage, {}) }), _jsx(Route, { path: "/memorials/:id", element: _jsx(MemorialDetailPage, {}) }), _jsx(Route, { path: "/memorials/create", element: _jsx(ProtectedRoute, { children: _jsx(CreateMemorialPage, {}) }) }), _jsx(Route, { path: "/memorials/:id/edit", element: _jsx(ProtectedRoute, { children: _jsx(EditMemorialPage, {}) }) }), _jsx(Route, { path: "/memorials/:id/delete", element: _jsx(ProtectedRoute, { children: _jsx(DeleteMemorialPage, {}) }) }), _jsx(Route, { path: "/charities", element: _jsx(CharityListPage, {}) }), _jsx(Route, { path: "/charities/:charityId", element: _jsx(CharityDetailPage, {}) }), _jsx(Route, { path: "/fundraisers/:fundraiserId", element: _jsx(FundraiserPage, {}) }), _jsx(Route, { path: "/donations", element: _jsx(ProtectedRoute, { children: _jsx(DonationPage, {}) }) }), _jsx(Route, { path: "/admin", element: _jsx(ProtectedRoute, { children: _jsx(AdminDashboardPage, {}) }) }), _jsx(Route, { path: "/admin/moderation", element: _jsx(ProtectedRoute, { children: _jsx(ModerationQueuePage, {}) }) }), _jsx(Route, { path: "/admin/users", element: _jsx(ProtectedRoute, { children: _jsx(UserManagementPage, {}) }) }), _jsx(Route, { path: "/admin/reports", element: _jsx(ProtectedRoute, { children: _jsx(ReportsPage, {}) }) }), _jsx(Route, { path: "/admin/settings", element: _jsx(ProtectedRoute, { children: _jsx(SettingsPage, {}) }) }), _jsx(Route, { path: "/admin/charities", element: _jsx(ProtectedRoute, { children: _jsx(AdminCharitiesPage, {}) }) }), _jsx(Route, { path: "*", element: _jsx("div", { className: "text-center py-20", children: _jsx("h1", { className: "text-4xl font-bold", children: "404 - Page Not Found" }) }) })] }) }), _jsx(Footer, {})] }), _jsx(ToastContainer, { position: "top-right", autoClose: 5000, hideProgressBar: false, newestOnTop: false, closeOnClick: true, rtl: false, pauseOnFocusLoss: true, draggable: true, pauseOnHover: true })] }) }) }));
}
export default App;
