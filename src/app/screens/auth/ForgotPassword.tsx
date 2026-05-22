import { motion } from "motion/react";
import { useState } from "react";
import { Link } from "react-router";
import { MagicalButton } from "@/app/components/MagicalButton";
import { resetPassword, isAuthAvailable } from "@/app/services/authService";
import { ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async () => {
    setError("");
    setMessage("");
    try {
      if (!isAuthAvailable()) {
        setError("Supabase not configured");
        return;
      }
      await resetPassword(email);
      setMessage("Check your email for a reset link ✨");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not send reset email");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 bg-gradient-to-b from-[#faf8fc] to-[#f0ebf5]">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md mx-auto w-full">
        <Link to="/login" className="inline-flex items-center gap-2 text-[#8a7d9e] mb-6">
          <ArrowLeft size={18} /> Back
        </Link>
        <h1 className="text-2xl font-semibold text-[#4a4458] mb-2">Reset password</h1>
        <p className="text-[#8a7d9e] mb-6">We'll send a gentle magic link to your inbox</p>
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-2xl bg-white/80 border border-[#d4b5e8]/30 mb-4 outline-none"
        />
        {error && <p className="text-sm text-red-500 mb-2">{error}</p>}
        {message && <p className="text-sm text-[#6a9e6a] mb-2">{message}</p>}
        <MagicalButton onClick={handleReset} variant="primary" size="lg" className="w-full">
          Send reset link
        </MagicalButton>
      </motion.div>
    </div>
  );
}
