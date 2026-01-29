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
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                {/* Auth routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<PasswordResetPage />} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                {/* Memorial routes */}
                <Route path="/memorials" element={<MemorialsListPage />} />
                <Route path="/memorials/:id" element={<MemorialDetailPage />} />
                <Route path="/memorials/create" element={<ProtectedRoute><CreateMemorialPage /></ProtectedRoute>} />
                <Route path="/memorials/:id/edit" element={<ProtectedRoute><EditMemorialPage /></ProtectedRoute>} />
                <Route path="/memorials/:id/delete" element={<ProtectedRoute><DeleteMemorialPage /></ProtectedRoute>} />
                {/* Charity routes */}
                <Route path="/charities" element={<CharityListPage />} />
                <Route path="/charities/:charityId" element={<CharityDetailPage />} />
                <Route path="/fundraisers/:fundraiserId" element={<FundraiserPage />} />
                <Route path="/donations" element={<ProtectedRoute><DonationPage /></ProtectedRoute>} />
                {/* Admin routes */}
                <Route path="/admin" element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />
                <Route path="/admin/moderation" element={<ProtectedRoute><ModerationQueuePage /></ProtectedRoute>} />
                <Route path="/admin/users" element={<ProtectedRoute><UserManagementPage /></ProtectedRoute>} />
                <Route path="/admin/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
                <Route path="/admin/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
                <Route path="/admin/charities" element={<ProtectedRoute><AdminCharitiesPage /></ProtectedRoute>} />
                {/* 404 fallback */}
                <Route
                  path="*"
                  element={
                    <div className="text-center py-20">
                      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
                    </div>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </div>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </Router>
      </ErrorBoundary>
    </Provider>
  );
}

export default App;
