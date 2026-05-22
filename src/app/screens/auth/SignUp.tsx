import { motion } from "motion/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { FloatingParticles } from "@/app/components/FloatingParticles";
import { MagicalButton } from "@/app/components/MagicalButton";
import { signUp, continueAsGuest, isAuthAvailable } from "@/app/services/authService";
import { useAppStore } from "@/store/useAppStore";

export default function SignUp() {
  const navigate = useNavigate();
  const onboardingComplete = useAppStore((s) => s.preferences.onboardingComplete);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const redirect = () => navigate(onboardingComplete ? "/home" : "/onboarding");

  const handleSignUp = async () => {
    setError("");
    setLoading(true);
    try {
      if (!isAuthAvailable()) {
        setError("Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env, or continue as guest");
        return;
      }
      await signUp(email, password, displayName || "Magical Soul");
      redirect();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 py-12 relative overflow-hidden bg-gradient-to-b from-[#faf8fc] to-[#f0ebf5]">
      <FloatingParticles type="sparkles" count={10} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto w-full">
        <h1 className="text-3xl font-semibold text-[#4a4458] text-center mb-2">Join Virtual Altar</h1>
        <p className="text-center text-[#8a7d9e] mb-8">Save rituals, sigils, and wallpapers forever</p>

        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-[#d4b5e8]/20 space-y-4 shadow-lg">
          <input
            placeholder="Display name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-white/80 border border-[#d4b5e8]/30 outline-none text-[#4a4458]"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-white/80 border border-[#d4b5e8]/30 outline-none text-[#4a4458]"
          />
          <input
            type="password"
            placeholder="Password (6+ characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-white/80 border border-[#d4b5e8]/30 outline-none text-[#4a4458]"
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <MagicalButton onClick={handleSignUp} variant="primary" size="lg" className="w-full" disabled={loading}>
            {loading ? "Creating magic..." : "Create account"}
          </MagicalButton>
        </div>

        <div className="mt-6 text-center space-y-3">
          <button onClick={() => { continueAsGuest(); redirect(); }} className="text-sm text-[#8a7d9e] hover:text-[#4a4458]">
            Continue as guest instead
          </button>
          <p className="text-sm text-[#8a7d9e]">
            Already have an account? <Link to="/login" className="text-[#9b7ec8] font-medium">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
