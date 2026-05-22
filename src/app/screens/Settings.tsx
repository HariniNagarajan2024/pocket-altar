import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { DeferredParticles } from "../components/DeferredParticles";
import { ThemePicker } from "../components/settings/ThemePicker";
import { SoundSettingsPanel } from "../components/settings/SoundSettingsPanel";
import { Palette, Bell, Sparkles, ChevronRight } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

export default function Settings() {
  const navigate = useNavigate();
  const notificationsEnabled = useAppStore((s) => s.preferences.notificationsEnabled);
  const setPreferences = useAppStore((s) => s.setPreferences);
  const onboardingComplete = useAppStore((s) => s.preferences.onboardingComplete);

  return (
    <div className="min-h-screen pb-28 relative overflow-hidden">
      <DeferredParticles type="sparkles" count={4} delayMs={500} />

      <div className="sticky top-0 z-20 backdrop-blur-md bg-white/60 border-b border-[#d4b5e8]/20 px-6 py-4 safe-top">
        <h1 className="text-2xl font-semibold text-[#4a4458]">Settings</h1>
        <p className="text-xs text-[#8a7d9e]">Changes save automatically</p>
      </div>

      <div className="px-6 py-6 space-y-5">
        <section className="bg-white/60 rounded-3xl p-5 border border-[#d4b5e8]/15">
          <div className="flex items-center gap-2 mb-4">
            <Palette size={18} className="text-[#d4b5e8]" />
            <h2 className="font-semibold text-[#4a4458]">Altar theme</h2>
          </div>
          <ThemePicker />
        </section>

        <section className="bg-white/60 rounded-3xl p-5 border border-[#d4b5e8]/15">
          <SoundSettingsPanel />
        </section>

        <section className="bg-white/60 rounded-3xl p-5 border border-[#d4b5e8]/15">
          <div className="flex items-center gap-2 mb-4">
            <Bell size={18} className="text-[#ffd8bf]" />
            <h2 className="font-semibold text-[#4a4458]">Notifications</h2>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-[#4a4458]">Daily ritual reminders</p>
              <p className="text-xs text-[#8a7d9e]">Gentle nudges to return to your altar</p>
            </div>
            <Toggle
              checked={notificationsEnabled}
              onChange={() =>
                setPreferences({ notificationsEnabled: !notificationsEnabled })
              }
            />
          </div>
        </section>

        <section className="bg-white/60 rounded-3xl p-5 border border-[#d4b5e8]/15 space-y-2">
          <h2 className="font-semibold text-[#4a4458] mb-2">Ritual preferences</h2>
          <SettingsLink
            label="Favorite spell categories"
            hint="Update your preferred ritual types"
            onClick={() => navigate("/onboarding?mode=categories")}
          />
          {onboardingComplete && (
            <SettingsLink
              label="Replay welcome tour"
              hint="See the introduction again — won't reset your data"
              onClick={() => navigate("/onboarding?mode=welcome")}
            />
          )}
        </section>

        <motion.div
          className="rounded-3xl p-5 text-center text-white"
          style={{ background: "linear-gradient(135deg, #f5d0d9, #d4b5e8)" }}
          animate={{ scale: [1, 1.008, 1] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          <p className="text-xl mb-1">💜</p>
          <p className="text-sm font-medium">Virtual Altar v1.0</p>
        </motion.div>
      </div>
    </div>
  );
}

function SettingsLink({
  label,
  hint,
  onClick,
}: {
  label: string;
  hint: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 p-4 rounded-2xl hover:bg-[#f0ebf5]/50 text-left transition-colors"
    >
      <Sparkles size={18} className="text-[#d4b5e8] shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#4a4458]">{label}</p>
        <p className="text-xs text-[#8a7d9e]">{hint}</p>
      </div>
      <ChevronRight size={18} className="text-[#8a7d9e] shrink-0" />
    </button>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onChange}
      className={`w-14 h-8 rounded-full shrink-0 ${checked ? "bg-[#d4b5e8]" : "bg-[#cbced4]"}`}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="w-6 h-6 bg-white rounded-full shadow-md"
        animate={{ x: checked ? 28 : 4 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </motion.button>
  );
}
