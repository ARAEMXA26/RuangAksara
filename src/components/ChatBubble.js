"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { usePathname } from "next/navigation";
import "./chatbubble.css";

export default function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "model", text: "Halo! Saya asisten AI RuangAksara. Ada yang bisa saya bantu terkait perpustakaan hari ini?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const pathname = usePathname();

  const quickQuestions = [
    "Apa itu RuangAksara?",
    "Bagaimana cara meminjam buku?",
    "Berapa batas buku yang bisa dipinjam?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const userMessage = { role: "user", text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Exclude greeting from history if desired, or keep it.
      const history = messages;

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history })
      });

      const data = await response.json();
      
      // Artificial delay 3 seconds to show typing indicator
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setMessages((prev) => [...prev, { role: "model", text: data.reply }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "model", text: "Maaf, terjadi kesalahan jaringan." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  if (pathname === "/login" || pathname === "/register") return null;

  return (
    <div className="chat-widget-container">
      <div className={`chat-window ${isOpen ? 'open' : 'closed'}`}>
        <div className="chat-header">
          <div className="chat-header-info">
            <div className="chat-header-avatar">
              <Bot size={24} />
            </div>
            <div>
              <div className="chat-header-title">RuangAksara Assistant</div>
              <div className="chat-header-status">
                <span className="status-dot"></span> Online - Chat Now
              </div>
            </div>
          </div>
          <button className="chat-close-btn" onClick={() => setIsOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="chat-body">
          {messages.map((msg, idx) => (
            <div key={idx} className={`chat-message ${msg.role}`}>
              <div className={`chat-avatar ${msg.role}`}>
                {msg.role === "model" ? <Bot size={18} /> : <User size={18} />}
              </div>
              <div className="chat-bubble">
                {msg.role === "model" ? (
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                ) : (
                  msg.text
                )}
              </div>
            </div>
          ))}
          
          {messages.length === 1 && (
            <div className="chat-quick-questions">
              {quickQuestions.map((q, idx) => (
                <button 
                  key={idx} 
                  className="quick-question-btn"
                  onClick={() => sendMessage(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {isLoading && (
            <div className="chat-message model">
              <div className="chat-avatar model">
                <Bot size={18} />
              </div>
              <div className="chat-bubble">
                <div className="typing-indicator">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-footer">
          <textarea
            className="chat-input"
            placeholder="Ketik pesan Anda di sini..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <button 
            className="chat-send-btn" 
            onClick={() => sendMessage(input)}
            disabled={isLoading || !input.trim()}
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      <div className={`chat-fab-container ${!isOpen ? 'open' : 'closed'}`}>
        <div className="chat-tooltip">Butuh Bantuan?</div>
        <button className="chat-fab" onClick={() => setIsOpen(true)}>
          <Bot size={22} className="chat-fab-icon" />
        </button>
      </div>
    </div>
  );
}
