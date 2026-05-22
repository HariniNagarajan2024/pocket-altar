import { motion } from "motion/react";

interface MagicalLoaderProps {
  label?: string;
  fullScreen?: boolean;
}

export function MagicalLoader({ label = "Awakening your altar...", fullScreen = false }) {
  const wrapper = fullScreen
    ? "min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#e8d9f5] via-[#d4b5e8] to-[#f5d0d9]"
    : "flex flex-col items-center justify-center py-16";

  return (
    <div className={wrapper} role="status" aria-live="polite">
      <motion.div
        className="relative w-24 h-24 mb-6"
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-white/50"
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />
        <motion.svg
          viewBox="0 0 100 100"
          className="absolute inset-2"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <path
            d="M50 12 L58 38 L86 38 L64 54 L72 82 L50 66 L28 82 L36 54 L14 38 L42 38 Z"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,0.6))" }}
          />
        </motion.svg>
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="absolute w-2 h-2 rounded-full bg-white/80"
            style={{
              left: `${30 + i * 20}%`,
              top: `${10 + (i % 2) * 70}%`,
            }}
            animate={{ y: [0, -12, 0], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.4 }}
          />
        ))}
      </motion.div>
      <p className="text-sm text-white/90 font-medium">{label}</p>
    </div>
  );
}
