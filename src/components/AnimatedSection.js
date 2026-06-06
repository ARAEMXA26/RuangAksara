"use client";

import { useEffect, useRef } from "react";

export default function AnimatedSection({
  children,
  animation = "fade-up",
  delay = 0,
  duration = 0.8,
  stagger = 0.15,
  className = "",
  threshold = 0.2,
}) {
  const sectionRef = useRef(null);

  useEffect(() => {
    let ctx;
    const loadGSAP = async () => {
      const gsapModule = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const gsap = gsapModule.default;
      gsap.registerPlugin(ScrollTrigger);

      const el = sectionRef.current;
      if (!el) return;

      const children = el.children;

      const animations = {
        "fade-up": { y: 60, opacity: 0 },
        "fade-down": { y: -60, opacity: 0 },
        "fade-left": { x: -60, opacity: 0 },
        "fade-right": { x: 60, opacity: 0 },
        "scale": { scale: 0.85, opacity: 0 },
        "zoom-in": { scale: 0.5, opacity: 0 },
        "rotate": { rotation: -5, y: 40, opacity: 0 },
      };

      const fromVars = animations[animation] || animations["fade-up"];

      ctx = gsap.context(() => {
        if (children.length > 1 && stagger > 0) {
          gsap.from(children, {
            ...fromVars,
            duration,
            delay,
            stagger,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: `top ${(1 - threshold) * 100}%`,
              toggleActions: "play none none reverse",
            },
          });
        } else {
          gsap.from(el, {
            ...fromVars,
            duration,
            delay,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: `top ${(1 - threshold) * 100}%`,
              toggleActions: "play none none reverse",
            },
          });
        }
      }, el);
    };

    loadGSAP();

    return () => {
      if (ctx) ctx.revert();
    };
  }, [animation, delay, duration, stagger, threshold]);

  return (
    <div ref={sectionRef} className={className}>
      {children}
    </div>
  );
}
