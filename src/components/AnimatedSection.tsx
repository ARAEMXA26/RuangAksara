"use client";

import { useEffect, useRef, useState } from "react";

export default function AnimatedSection({
  children,
  className = "",
  delay = 0,
  animation = "fade-up",
  style = {},
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`scroll-reveal ${visible ? "scroll-reveal--visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}s`, ...(style as any) }}
    >
      {children}
    </div>
  );
}
