"use client";

import { useState, useEffect, useRef } from "react";

export default function ScrollProgressBar() {
  const [visible, setVisible] = useState(false);
  const fillRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    let ticking = false;

    const updateScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      
      if (docHeight <= 0) {
        if (fillRef.current) fillRef.current.style.height = "0%";
        if (labelRef.current) labelRef.current.innerText = "0%";
        setVisible(false);
        ticking = false;
        return;
      }

      const percentRaw = (scrollTop / docHeight) * 100;
      const percentCapped = Math.min(Math.max(percentRaw, 0), 100);
      const percentRounded = Math.round(percentCapped);
      
      if (fillRef.current) {
        fillRef.current.style.height = `${percentCapped}%`;
      }
      if (labelRef.current) {
        labelRef.current.innerText = `${percentRounded}%`;
      }
      
      setVisible(scrollTop > 50);
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`scroll-progress-container ${visible ? "scroll-progress-visible" : ""}`}
    >
      {/* Track (background) */}
      <div className="scroll-progress-track">
        {/* Fill bar */}
        <div
          ref={fillRef}
          className="scroll-progress-fill"
        />
      </div>

      {/* Percentage label */}
      <div ref={labelRef} className="scroll-progress-label">
        0%
      </div>
    </div>
  );
}
