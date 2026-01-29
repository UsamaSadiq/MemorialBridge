/**
 * Header Component
 * Main navigation header – theme matches footer (dark background)
 */

import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/index';
import styles from './Header.module.css';

/** Prefer first name in header; fallback to last name, then full name, then email */
function displayName(user: { first_name?: string | null; last_name?: string | null; email: string }): string {
  const first = user.first_name?.trim();
  const last = user.last_name?.trim();
  if (first) return first;
  if (last) return last;
  const full = [user.first_name, user.last_name].filter(Boolean).join(' ').trim();
  return full || user.email;
}

export const Header = () => {
  const { isAuthenticated, user, logout, token } = useAuth();
  const loggedIn = isAuthenticated || !!token;

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className={styles.header}>
      <nav className={styles.inner}>
        <Link to="/" className={styles.logo}>
          Memorial Bridge
        </Link>

        <div className={styles.nav}>
          {loggedIn ? (
            <>
              <Link to="/memorials" className={styles.link}>
                Memorials
              </Link>
              <Link to="/charities" className={styles.link}>
                Charities
              </Link>
              <Link to="/donations" className={styles.link}>
                Donations
              </Link>
              <Link to="/profile" className={styles.link}>
                {user ? displayName(user) : 'Profile'}
              </Link>
              {user?.is_admin && (
                <Link to="/admin" className={`${styles.link} ${styles.adminBadge}`}>
                  Admin
                </Link>
              )}
              <button type="button" onClick={handleLogout} className={styles.btnLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/memorials" className={styles.link}>
                Memorials
              </Link>
              <Link to="/charities" className={styles.link}>
                Charities
              </Link>
              <Link to="/login" className={styles.linkButton}>
                Login
              </Link>
              <Link to="/register" className={styles.btnPrimary}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};
