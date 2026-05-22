import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { FloatingParticles } from "../components/FloatingParticles";
import { Sparkles, Calendar, Heart, Settings, LogOut } from "lucide-react";
import { useAppStore, computeStreak, getFavoriteCategory, altarThemes } from "@/store/useAppStore";
import { spellCategories } from "@/app/data/spells";
import { signOut } from "@/app/services/authService";

export default function Profile() {
  const navigate = useNavigate();
  const user = useAppStore((s) => s.user);
  const castedSpells = useAppStore((s) => s.castedSpells);
  const savedSigils = useAppStore((s) => s.savedSigils);
  const wallpapers = useAppStore((s) => s.wallpapers);
  const preferences = useAppStore((s) => s.preferences);
  const theme = altarThemes[preferences.altarTheme];

  const streak = computeStreak(castedSpells.map((r) => r.date));
  const favoriteCatId = getFavoriteCategory(castedSpells);
  const favoriteLabel = favoriteCatId
    ? spellCategories.find((c) => c.id === favoriteCatId)?.name ?? "Magic"
    : "Begin your practice";

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen pb-28 relative overflow-hidden">
      <FloatingParticles type="sparkles" count={8} />
      <FloatingParticles type="hearts" count={5} color="#f5d0d9" />

      <div className="sticky top-0 z-20 backdrop-blur-md bg-white/60 border-b border-[#d4b5e8]/20 px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-[#4a4458]">Profile</h1>
        <button onClick={() => navigate("/settings")} className="p-2 rounded-full bg-white/70 border border-[#d4b5e8]/25">
          <Settings size={20} className="text-[#4a4458]" />
        </button>
      </div>

      <div className="px-6 py-6 space-y-6">
        <div className="text-center">
          <motion.div
            className="w-28 h-28 mx-auto mb-3 rounded-full flex items-center justify-center text-5xl shadow-lg"
            style={{ background: `linear-gradient(135deg, ${theme.accent}, #f5d0d9)` }}
            animate={{
              boxShadow: [
                `0 0 20px ${theme.accent}40`,
                `0 0 36px ${theme.accent}60`,
                `0 0 20px ${theme.accent}40`,
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {theme.icon}
          </motion.div>
          <h2 className="text-xl font-semibold text-[#4a4458]">
            {user?.displayName ?? "Guest Keeper"}
          </h2>
          <p className="text-sm text-[#8a7d9e]">
            {user?.isGuest ? "Guest mode · data saved locally" : user?.email}
          </p>
          <p className="text-xs text-[#9b7ec8] mt-1">{theme.name} altar</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Sparkles, value: castedSpells.length, label: "Rituals", colors: "#d4b5e8,#f5d0d9" },
            { icon: Calendar, value: streak, label: "Streak", colors: "#ffd8bf,#fff4cc" },
            { icon: Heart, value: savedSigils.length, label: "Sigils", colors: "#f5d0d9,#d4b5e8" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white/60 rounded-2xl p-4 border border-[#d4b5e8]/15 text-center"
            >
              <div
                className="w-10 h-10 mx-auto mb-2 rounded-full flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${stat.colors.split(",")[0]}, ${stat.colors.split(",")[1]})`,
                }}
              >
                <stat.icon size={18} className="text-white" />
              </div>
              <p className="text-xl font-semibold text-[#4a4458]">{stat.value}</p>
              <p className="text-[10px] text-[#8a7d9e]">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div
          className="rounded-3xl p-5 text-white"
          style={{ background: `linear-gradient(135deg, ${theme.accent}, #f5d0d9)` }}
        >
          <p className="text-sm opacity-90">Favorite magic</p>
          <p className="text-xl font-semibold">{favoriteLabel}</p>
          <p className="text-xs opacity-80 mt-1">{wallpapers.length} wallpapers saved</p>
        </div>

        <div className="bg-white/60 rounded-3xl p-5 border border-[#d4b5e8]/15">
          <h3 className="font-semibold text-[#4a4458] mb-3">Recent activity</h3>
          {castedSpells.length === 0 ? (
            <p className="text-sm text-[#8a7d9e]">No rituals yet — your story starts soon ✨</p>
          ) : (
            <div className="space-y-3">
              {castedSpells.slice(0, 5).map((r) => (
                <div key={r.id} className="flex gap-3 items-start border-b border-[#d4b5e8]/15 pb-3 last:border-0 last:pb-0">
                  <span className="text-xl">
                    {spellCategories.find((c) => c.id === r.category)?.icon ?? "✨"}
                  </span>
                  <div>
                    <p className="text-sm text-[#4a4458]">Completed {r.spellName}</p>
                    <p className="text-xs text-[#8a7d9e]">
                      {new Date(r.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {!user?.isGuest && (
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 text-[#8a7d9e] text-sm"
          >
            <LogOut size={16} /> Sign out
          </button>
        )}
      </div>
    </div>
  );
}
