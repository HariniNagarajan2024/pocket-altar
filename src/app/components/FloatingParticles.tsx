import { motion } from "motion/react";
import { memo, useEffect, useMemo, useState } from "react";
import { Sparkles, Star, Moon, Heart, Flower2 } from "lucide-react";

type ParticleType = "sparkles" | "stars" | "moons" | "hearts" | "flowers";

const iconMap = {
  sparkles: Sparkles,
  stars: Star,
  moons: Moon,
  hearts: Heart,
  flowers: Flower2,
};

interface FloatingParticlesProps {
  type?: ParticleType;
  count?: number;
  color?: string;
}

function FloatingParticlesInner({
  type = "sparkles",
  count = 12,
  color = "#d4b5e8",
}: FloatingParticlesProps) {
  const [ready, setReady] = useState(false);
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const cappedCount = Math.min(count, reducedMotion ? 0 : count);

  const particles = useMemo(() => {
    const Icon = iconMap[type];
    return Array.from({ length: cappedCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 8 + Math.random() * 6,
      Icon,
      rotation: Math.random() * 360,
      scale: 0.5 + Math.random() * 0.8,
    }));
  }, [cappedCount, type]);

  useEffect(() => {
    const t = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(t);
  }, []);

  if (!ready || cappedCount === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute will-change-transform"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -24, 0],
            opacity: [0, 0.55, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <particle.Icon
            size={14 * particle.scale}
            style={{ color }}
            className="drop-shadow-lg"
          />
        </motion.div>
      ))}
    </div>
  );
}

export const FloatingParticles = memo(FloatingParticlesInner);
