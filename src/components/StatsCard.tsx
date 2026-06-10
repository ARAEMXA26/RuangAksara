"use client";

import { useEffect, useRef } from "react";

export default function StatsCard({ icon, label, value, color = "blue", delay = 0 }) {
  const valueRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    const loadGSAP = async () => {
      const gsapModule = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const gsap = gsapModule.default;
      gsap.registerPlugin(ScrollTrigger);

      if (!cardRef.current || !valueRef.current) return;

      // Card entrance animation
      gsap.from(cardRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.6,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      // Number counter animation
      const numericValue = parseInt(value) || 0;
      if (numericValue > 0) {
        const counter = { val: 0 };
        gsap.to(counter, {
          val: numericValue,
          duration: 1.5,
          delay: delay + 0.3,
          ease: "power2.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          onUpdate: () => {
            if (valueRef.current) {
              valueRef.current.textContent = Math.round(counter.val).toLocaleString("id-ID");
            }
          },
        });
      }
    };

    loadGSAP();
  }, [value, delay]);

  const colorMap = {
    blue: "var(--primary)",
    green: "#10b981",
    orange: "#f59e0b",
    red: "#ef4444",
    purple: "#8b5cf6",
  };

  return (
    <div
      ref={cardRef}
      className="stats-card"
      style={{ "--accent-color": colorMap[color] || colorMap.blue } as React.CSSProperties}
    >
      <div className="stats-card-icon">{icon}</div>
      <div className="stats-card-content">
        <span className="stats-card-label">{label}</span>
        <span ref={valueRef} className="stats-card-value">
          {value}
        </span>
      </div>
      <div className="stats-card-glow"></div>
    </div>
  );
}
