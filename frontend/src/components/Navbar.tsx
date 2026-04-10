"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <nav className="bg-gradient-nav shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link
            href="/"
            className="flex items-center gap-2 text-primary font-bold text-xl hover:scale-105 transition-transform"
          >
            <i className="fas fa-heart" />
            <span>MemorialBridge</span>
          </Link>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
          >
            <i className={`fas ${menuOpen ? "fa-times" : "fa-bars"} text-lg`} />
          </button>

          {/* Nav links */}
          <div
            className={`${
              menuOpen ? "flex" : "hidden"
            } lg:flex flex-col lg:flex-row absolute lg:relative top-16 lg:top-0 left-0 right-0 bg-surface lg:bg-transparent shadow-lg lg:shadow-none items-start lg:items-center gap-1 lg:gap-2 p-4 lg:p-0 z-50`}
          >
            <NavLink href="/" active={pathname === "/"} onClick={() => setMenuOpen(false)}>
              <i className="fas fa-home mr-1" />Home
            </NavLink>
            <NavLink href="/explore" active={pathname.startsWith("/explore")} onClick={() => setMenuOpen(false)}>
              <i className="fas fa-compass mr-1" />Explore
            </NavLink>

            {user ? (
              <div className="relative">
                <button
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-text-secondary"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <span className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-light inline-flex items-center justify-center text-white font-semibold text-sm">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                  <span>{user.username}</span>
                  {user.verified && (
                    <i className="fas fa-check-circle text-success" />
                  )}
                  <i className="fas fa-chevron-down text-xs" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-1 w-52 bg-surface rounded-xl shadow-lg overflow-hidden z-50">
                    <DropdownLink href="/dashboard" onClick={() => { setDropdownOpen(false); setMenuOpen(false); }}>
                      <i className="fas fa-th-large" />Dashboard
                    </DropdownLink>
                    <DropdownLink href="/memorial/new" onClick={() => { setDropdownOpen(false); setMenuOpen(false); }}>
                      <i className="fas fa-plus" />Create Memorial
                    </DropdownLink>
                    {!user.verified && (
                      <DropdownLink href="/verify" onClick={() => { setDropdownOpen(false); setMenuOpen(false); }}>
                        <i className="fas fa-envelope" />Verify Email
                      </DropdownLink>
                    )}
                    <hr className="my-1 border-border-light" />
                    <button
                      className="flex items-center gap-2 px-4 py-3 text-sm text-danger hover:bg-surface-muted hover:pl-5 transition-all w-full"
                      onClick={() => { logout(); setDropdownOpen(false); setMenuOpen(false); }}
                    >
                      <i className="fas fa-sign-out-alt" />Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <NavLink href="/login" active={false} onClick={() => setMenuOpen(false)}>
                  <i className="fas fa-sign-in-alt mr-1" />Login
                </NavLink>
                <Link
                  href="/signup"
                  className="inline-flex items-center px-4 py-1.5 rounded-md bg-primary text-white text-sm font-medium shadow-sm hover:bg-primary-dark hover:-translate-y-0.5 transition-all"
                  onClick={() => setMenuOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, active, onClick, children }: { href: string; active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        active
          ? "text-primary font-semibold"
          : "text-text-secondary hover:text-primary"
      }`}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}

function DropdownLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-surface-muted hover:pl-5 transition-all"
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
