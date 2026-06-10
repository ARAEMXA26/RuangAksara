"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  Home,
  Search,
  Bot,
  LayoutDashboard,
  BookOpen,
  Brain,
  Book,
  Menu,
  X,
  LogOut,
  User,
  Settings,
} from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout, loading } = useAuth();
  const navRef = useRef(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);

    // GSAP navbar animation
    const loadGSAP = async () => {
      const gsapModule = await import("gsap");
      const gsap = gsapModule.default;
      if (navRef.current) {
        gsap.from(navRef.current, {
          y: -80,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        });
      }
    };
    loadGSAP();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    router.push("/");
  };

  const navLinks = user ? [
    { href: "/search", label: "Katalog", icon: <Search size={18} /> },
    { href: "/repository", label: "Repository", icon: <BookOpen size={18} /> },
    { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    ...(user.role === "pustakawan" ? [{ href: "/knowledge", label: "Knowledge", icon: <Brain size={18} /> }] : []),
  ] : [
    { href: "/search", label: "Katalog", icon: <Search size={18} /> },
    { href: "/repository", label: "Repository", icon: <BookOpen size={18} /> },
    { href: "#", label: "Bantuan", icon: <Brain size={18} /> },
    { href: "/tentang-kami", label: "Tentang Kami", icon: <Book size={18} /> },
  ];

  const isLanding = pathname === "/";
  if (pathname === "/login" || pathname === "/register") return null;

  return (
    <nav
      ref={navRef}
      className={`navbar ${scrolled ? "navbar-scrolled" : ""} ${!isLanding ? "navbar-solid" : ""}`}
    >
      <div className="navbar-inner">
        <Link href="/" className="navbar-logo">
          <Image src="/logo-ra.png" alt="RuangAksara Logo" width={40} height={40} style={{ objectFit: "contain", width: "40px", height: "40px" }} priority />
        </Link>

        <div className={`navbar-links ${mobileOpen ? "navbar-links-open" : ""}`}>
          {navLinks.map((link) => (
            <Link
              key={link.href + link.label}
              href={link.href}
              className={`navbar-link ${pathname === link.href ? "navbar-link-active" : ""}`}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="navbar-actions">
          <Link href="/search" className="navbar-search-icon" aria-label="Search" style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gray-600)", padding: "6px" }}>
            <Search size={20} />
          </Link>
          {!loading && (
            user ? (
              <div className="navbar-user" style={{ position: "relative" }}>
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="navbar-avatar-btn"
                  style={{ 
                    background: "var(--primary)", border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer", 
                    display: "flex", alignItems: "center", justifyContent: "center",
                    width: "36px", height: "36px", borderRadius: "50%",
                    color: "white"
                  }}
                >
                  <User size={18} />
                </button>

                {dropdownOpen && (
                  <div className="navbar-dropdown" style={{
                    position: "absolute", top: "100%", right: "0", marginTop: "12px",
                    background: "white", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    width: "180px", overflow: "hidden", zIndex: 100,
                    display: "flex", flexDirection: "column"
                  }}>
                    <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--gray-100)", background: "var(--gray-50)" }}>
                      <div style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--gray-900)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--gray-500)", textTransform: "capitalize" }}>{user.role}</div>
                    </div>
                    <Link href="/settings" onClick={() => setDropdownOpen(false)} style={{
                      display: "flex", alignItems: "center", gap: "8px", padding: "12px 16px",
                      color: "var(--gray-700)", textDecoration: "none", fontSize: "0.9rem",
                      transition: "background 0.2s"
                    }}>
                      <Settings size={16} /> Pengaturan
                    </Link>
                    <button onClick={handleLogout} style={{
                      display: "flex", alignItems: "center", gap: "8px", padding: "12px 16px",
                      color: "var(--danger)", background: "none", border: "none", width: "100%",
                      textAlign: "left", cursor: "pointer", fontSize: "0.9rem",
                      transition: "background 0.2s", borderTop: "1px solid var(--gray-100)"
                    }}>
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="btn btn-sm" style={{ background: "transparent", color: "white", border: "1px solid rgba(255,255,255,0.2)" }}>
                  Login
                </Link>
                <Link href="/register" className="btn btn-sm btn-white" style={{ color: "var(--gray-900)" }}>
                  Daftar
                </Link>
              </>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
