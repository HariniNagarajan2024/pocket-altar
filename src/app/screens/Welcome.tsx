import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { FloatingParticles } from "@/app/components/FloatingParticles";
import { MagicalButton } from "@/app/components/MagicalButton";
import { useAppStore } from "@/store/useAppStore";
import { Sparkles } from "lucide-react";

export default function Welcome() {
  const navigate = useNavigate();
  const setUser = useAppStore((s) => s.setUser);
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const user = useAppStore.getState().user;
    if (user) {
      navigate("/onboarding", { replace: true });
    }
  }, [navigate]);

  const handleContinue = () => {
    if (!displayName.trim()) {
      setError("Please enter your name");
      return;
    }
    setUser({
      id: `local-${crypto.randomUUID()}`,
      email: "",
      displayName: displayName.trim(),
      isGuest: false,
    });
    navigate("/onboarding", { replace: true });
  };

  const handleGuest = () => {
    setUser({
      id: `guest-${crypto.randomUUID()}`,
      email: "",
      displayName: "Guest Keeper",
      isGuest: true,
    });
    navigate("/onboarding", { replace: true });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleContinue();
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 py-12 relative overflow-hidden bg-gradient-to-b from-[#e8d9f5] via-[#d4b5e8] to-[#f5d0d9]">
      <FloatingParticles type="stars" count={12} color="#ffffff" />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto w-full"
      >
        <div className="text-center mb-8">
          <motion.div
            animate={{
              filter: [
                "drop-shadow(0 0 12px rgba(255,255,255,0.4))",
                "drop-shadow(0 0 28px rgba(255,255,255,0.75))",
                "drop-shadow(0 0 12px rgba(255,255,255,0.4))",
              ],
            }}
            transition={{ duration: 2.5, repeat: Infinity }}
            style={{ willChange: "filter" }}
          >
            <Sparkles className="mx-auto text-white mb-4" size={40} />
          </motion.div>
          <h1 className="text-3xl font-semibold text-white">Pocket Altar</h1>
          <p className="text-white/80 mt-2">A quiet place for intentions.</p>
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-white/50 shadow-xl space-y-4">
          <input
            type="text"
            placeholder="Your name"
            value={displayName}
            onChange={(e) => {
              setDisplayName(e.target.value);
              setError("");
            }}
            onKeyPress={handleKeyPress}
            className="w-full px-4 py-3 rounded-2xl bg-white/80 border border-[#d4b5e8]/30 outline-none focus:border-[#d4b5e8] text-[#4a4458] placeholder:text-[#8a7d9e]"
            autoFocus
          />
          {error && <p className="text-sm text-red-500/90">{error}</p>}
          <MagicalButton onClick={handleContinue} variant="primary" size="lg" className="w-full">
            Enter your altar
          </MagicalButton>
        </div>

        <div className="mt-6 space-y-3">
          <MagicalButton onClick={handleGuest} variant="secondary" size="lg" className="w-full">
            Continue as guest
          </MagicalButton>
          <p className="text-center text-xs text-white/70">
            Your rituals are stored locally on this device.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
