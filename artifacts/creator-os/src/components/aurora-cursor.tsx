import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function AuroraCursor() {
  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);

  // Outer glow — slow, laggy
  const glowX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const glowY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  // Inner dot — snappy
  const dotX = useSpring(mouseX, { stiffness: 500, damping: 35 });
  const dotY = useSpring(mouseY, { stiffness: 500, damping: 35 });

  const isClickingRef = useRef(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    const down = () => { isClickingRef.current = true; };
    const up = () => { isClickingRef.current = false; };
    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
    };
  }, [mouseX, mouseY]);

  return (
    <>
      {/* Outer aurora glow */}
      <motion.div
        className="pointer-events-none fixed z-[9999] rounded-full mix-blend-screen"
        style={{
          x: glowX,
          y: glowY,
          translateX: "-50%",
          translateY: "-50%",
          width: 320,
          height: 320,
          background: "radial-gradient(ellipse, rgba(45,212,191,0.12) 0%, rgba(167,139,250,0.06) 50%, transparent 70%)",
          filter: "blur(2px)",
        }}
      />
      {/* Mid ring */}
      <motion.div
        className="pointer-events-none fixed z-[9999] rounded-full border border-teal-400/20"
        style={{
          x: glowX,
          y: glowY,
          translateX: "-50%",
          translateY: "-50%",
          width: 36,
          height: 36,
        }}
      />
      {/* Inner dot */}
      <motion.div
        className="pointer-events-none fixed z-[9999] rounded-full bg-teal-300"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
          width: 5,
          height: 5,
          boxShadow: "0 0 8px rgba(45,212,191,0.9)",
        }}
      />
    </>
  );
}
