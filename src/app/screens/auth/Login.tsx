import { motion } from "motion/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { FloatingParticles } from "@/app/components/FloatingParticles";
import { MagicalButton } from "@/app/components/MagicalButton";
import { signIn, continueAsGuest, isAuthAvailable } from "@/app/services/authService";
import { useAppStore } from "@/store/useAppStore";
import { Sparkles } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const onboardingComplete = useAppStore((s) => s.preferences.onboardingComplete);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const redirect = () => navigate(onboardingComplete ? "/home" : "/onboarding");

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      if (!isAuthAvailable()) {
        setError("Cloud auth not configured — continue as guest or add Supabase keys to .env");
        return;
      }
      await signIn(email, password);
      redirect();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = () => {
    continueAsGuest();
    redirect();
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
          <Sparkles className="mx-auto text-white mb-4" size={40} />
          <h1 className="text-3xl font-semibold text-white">Welcome back</h1>
          <p className="text-white/80 mt-2">Return to your ritual sanctuary</p>
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-white/50 shadow-xl space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-white/80 border border-[#d4b5e8]/30 outline-none focus:border-[#d4b5e8] text-[#4a4458]"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-white/80 border border-[#d4b5e8]/30 outline-none focus:border-[#d4b5e8] text-[#4a4458]"
          />
          {error && <p className="text-sm text-red-500/90">{error}</p>}
          <MagicalButton onClick={handleLogin} variant="primary" size="lg" className="w-full" disabled={loading}>
            {loading ? "Opening altar..." : "Sign in"}
          </MagicalButton>
          <Link to="/forgot-password" className="block text-center text-sm text-[#8a7d9e] hover:text-[#4a4458]">
            Forgot password?
          </Link>
        </div>

        <div className="mt-6 space-y-3">
          <MagicalButton onClick={handleGuest} variant="secondary" size="lg" className="w-full">
            Continue as guest
          </MagicalButton>
          <p className="text-center text-sm text-white/90">
            New here?{" "}
            <Link to="/signup" className="underline font-medium">
              Create account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
