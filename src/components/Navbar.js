"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    // Check for logged-in user
    const stored = localStorage.getItem("libkms_user");
    if (stored) setUser(JSON.parse(stored));

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
    localStorage.removeItem("libkms_user");
    setUser(null);
    window.location.href = "/";
  };

  const navLinks = [
    { href: "/", label: "Beranda", icon: "🏠" },
    { href: "/search", label: "Pencarian", icon: "🔍" },
    { href: "/chatbot", label: "Chatbot", icon: "🤖" },
  ];

  if (user) {
    navLinks.push({ href: "/dashboard", label: "Dashboard", icon: "📊" });
    navLinks.push({ href: "/circulation", label: "Sirkulasi", icon: "📖" });
    if (user.role === "pustakawan") {
      navLinks.push({ href: "/knowledge", label: "Knowledge", icon: "🧠" });
    }
  }

  const isLanding = pathname === "/";

  return (
    <nav
      ref={navRef}
      className={`navbar ${scrolled ? "navbar-scrolled" : ""} ${!isLanding ? "navbar-solid" : ""}`}
    >
      <div className="navbar-inner">
        <Link href="/" className="navbar-logo">
          <span className="logo-icon">📚</span>
          <span className="logo-text">
            Lib<span className="logo-highlight">KMS</span>-AI
          </span>
        </Link>

        <div className={`navbar-links ${mobileOpen ? "navbar-links-open" : ""}`}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`navbar-link ${pathname === link.href ? "navbar-link-active" : ""}`}
              onClick={() => setMobileOpen(false)}
            >
              <span className="navbar-link-icon">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </div>

        <div className="navbar-actions">
          {user ? (
            <div className="navbar-user">
              <div className="navbar-avatar">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span className="navbar-username">{user.name}</span>
              <button onClick={handleLogout} className="btn btn-sm btn-outline">
                Logout
              </button>
            </div>
          ) : (
            <Link href="/login" className="btn btn-sm btn-primary">
              Login
            </Link>
          )}

          <button
            className="navbar-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
          >
            <span className={`hamburger ${mobileOpen ? "hamburger-open" : ""}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}
