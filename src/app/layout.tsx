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
    <html lang="id">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📚</text></svg>" />
      </head>
      <body>
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
