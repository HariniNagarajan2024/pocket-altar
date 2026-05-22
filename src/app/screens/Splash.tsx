import { motion } from "motion/react";
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { DeferredParticles } from "../components/DeferredParticles";
import { MagicalLoader } from "../components/MagicalLoader";
import { Sparkles } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useStoreHydrated } from "@/app/hooks/useStoreHydrated";

export default function Splash() {
  const navigate = useNavigate();
  const hydrated = useStoreHydrated();
  const user = useAppStore((s) => s.user);
  const onboardingComplete = useAppStore((s) => s.preferences.onboardingComplete);
  const authLoading = useAppStore((s) => s.authLoading);

  const isReturningUser = Boolean(user && onboardingComplete);
  const splashMs = isReturningUser ? 900 : 2200;

  const destination = useMemo(() => {
    if (!user) return "/login";
    if (!onboardingComplete) return "/onboarding";
    return "/home";
  }, [user, onboardingComplete]);

  useEffect(() => {
    if (!hydrated || authLoading) return;
    const timer = setTimeout(() => {
      navigate(destination, { replace: true });
    }, splashMs);
    return () => clearTimeout(timer);
  }, [hydrated, authLoading, navigate, destination, splashMs]);

  if (!hydrated) {
    return <MagicalLoader fullScreen label="Opening your altar..." />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-[#e8d9f5] via-[#d4b5e8] to-[#f5d0d9]">
      <DeferredParticles type="stars" count={isReturningUser ? 8 : 14} delayMs={300} color="#ffffff" />
      {!isReturningUser && (
        <DeferredParticles type="sparkles" count={8} delayMs={500} color="#fff4cc" />
      )}

      <motion.div
        className="text-center z-10 px-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          animate={{
            filter: [
              "drop-shadow(0 0 12px rgba(255,255,255,0.4))",
              "drop-shadow(0 0 28px rgba(255,255,255,0.75))",
              "drop-shadow(0 0 12px rgba(255,255,255,0.4))",
            ],
          }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <Sparkles size={isReturningUser ? 44 : 56} className="text-white mx-auto mb-5" />
        </motion.div>

        <motion.h1
          className="text-4xl sm:text-5xl font-bold text-white tracking-wide"
          style={{ textShadow: "0 0 24px rgba(255,255,255,0.45)" }}
        >
          Virtual Altar
        </motion.h1>

        <motion.p
          className="text-lg text-white/90 mt-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {isReturningUser ? "Welcome back, dear one" : "Create your ritual space."}
        </motion.p>
      </motion.div>

      <motion.div className="absolute bottom-14 flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-white"
            animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </motion.div>
    </div>
  );
}
