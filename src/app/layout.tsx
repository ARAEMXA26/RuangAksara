import "./globals.css";

export const metadata = {
  title: "RuangAksara | Sistem Perpustakaan Canggih",
  description:
    "Sistem perpustakaan modern dengan AI-Powered Semantic Search, Chatbot Referensi 24/7, dan Knowledge Management System untuk perpustakaan universitas.",
  keywords:
    "perpustakaan, AI, semantic search, chatbot, knowledge management, universitas",
};

import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import ChatBubble from "@/components/ChatBubble";
import Footer from "@/components/Footer";
import ScrollProgressBar from "@/components/ScrollProgressBar";

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/logo-ra.png" />
      </head>
      <body suppressHydrationWarning>
        <Providers>
          <Navbar />
          {children}
          <Footer />
          <ChatBubble />
          <ScrollProgressBar />
        </Providers>
      </body>
    </html>
  );
}
