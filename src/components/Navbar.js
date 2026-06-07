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
} from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
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
    router.push("/");
  };

  const navLinks = user ? [
    { href: "/", label: "Beranda", icon: <Home size={18} /> },
    { href: "/search", label: "Katalog", icon: <Search size={18} /> },
    { href: "/repository", label: "Repository", icon: <BookOpen size={18} /> },
    { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { href: "/circulation", label: "Sirkulasi", icon: <BookOpen size={18} /> },
    ...(user.role === "pustakawan" ? [{ href: "/knowledge", label: "Knowledge", icon: <Brain size={18} /> }] : []),
  ] : [
    { href: "/", label: "Beranda", icon: <Home size={18} /> },
    { href: "/search", label: "Katalog", icon: <Search size={18} /> },
    { href: "/repository", label: "Repository", icon: <BookOpen size={18} /> },
    { href: "#", label: "Bantuan", icon: <Brain size={18} /> },
    { href: "#", label: "Tentang Kami", icon: <Book size={18} /> },
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
          <Image src="/logo-ra.png" alt="RuangAksara Logo" width={70} height={35} style={{ objectFit: "contain" }} priority />
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
              <div className="navbar-user">
                <div className="navbar-avatar" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <User size={16} />
                </div>
                <span className="navbar-username">{user.name}</span>
                <button onClick={handleLogout} className="btn btn-sm" style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.1)", color: "white", border: "none" }}>
                  <LogOut size={14} /> Logout
                </button>
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
