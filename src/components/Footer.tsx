"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  if (pathname === "/login" || pathname === "/register") return null;

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-logo-box">
          <Image src="/logo-ra.png" alt="RuangAksara Logo" width={100} height={100} style={{ objectFit: "contain", width: "100px", height: "100px" }} priority />
        </div>
        <div className="footer-brand-title">
          RUANG<br/>AKSARA
        </div>
        <div className="footer-desc">
          Perpustakaan cerdas berbasis AI &amp; knowledge management<br/>untuk mendukung pendidikan, penelitian, dan inovasi.
        </div>
      </div>

      <div className="footer-inner">
        <div className="footer-section">
          <h4>Layanan</h4>
          <Link href="/search" className="footer-link">Katalog Buku</Link>
          <Link href="/search" className="footer-link">Koleksi Digital</Link>
          <Link href="/repository" className="footer-link">Repository Akademik</Link>
          <Link href="/search" className="footer-link">E-Book</Link>
          <Link href="/search" className="footer-link">Jurnal</Link>
        </div>
        <div className="footer-section">
          <h4>Informasi</h4>
          <Link href="/tentang-kami" className="footer-link">Tentang Kami</Link>
          <Link href="/tentang-kami#visi-misi" className="footer-link">Visi &amp; Misi</Link>
          <Link href="/bantuan" className="footer-link">Kebijakan</Link>
          <Link href="/tentang-kami" className="footer-link">Karir</Link>
        </div>
        <div className="footer-section">
          <h4>Bantuan</h4>
          <Link href="/bantuan" className="footer-link">Pusat Bantuan</Link>
          <Link href="/bantuan" className="footer-link">Panduan Penggunaan</Link>
          <Link href="/bantuan#faq" className="footer-link">FAQ</Link>
          <Link href="/bantuan#kontak" className="footer-link">Hubungi Kami</Link>
        </div>
        <div className="footer-section">
          <h4>Legal</h4>
          <Link href="/bantuan" className="footer-link">Syarat &amp; Ketentuan</Link>
          <Link href="/bantuan" className="footer-link">Kebijakan Privasi</Link>
          <Link href="/bantuan" className="footer-link">Hak Cipta</Link>
        </div>
        <div className="footer-section">
          <h4>Sosial</h4>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer-link">Twitter</a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="footer-link">LinkedIn</a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-link">Instagram</a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer-link">Facebook</a>
        </div>
        <div className="footer-section">
          <h4>Kontak</h4>
          <a href="mailto:perpustakaan@university.ac.id" className="footer-link">Sales</a>
          <a href="mailto:perpustakaan@university.ac.id" className="footer-link">Press</a>
          <a href="mailto:perpustakaan@university.ac.id" className="footer-link">Kemitraan</a>
        </div>
        <div className="footer-section">
          <h4>Keamanan</h4>
          <Link href="/bantuan" className="footer-link">Kepatuhan</Link>
          <Link href="/bantuan#kontak" className="footer-link">Laporkan Masalah</Link>
          <Link href="/bantuan" className="footer-link">Status Sistem</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-text">
          © 2026 RuangAksara. Perpustakaan cerdas masa depan.
        </div>
        <div className="footer-status-badge">
          <div className="footer-status-dot"></div>
          <div className="footer-status-text">All Systems Operational</div>
        </div>
      </div>
    </footer>
  );
}
