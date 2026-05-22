import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { DeferredParticles } from "../components/DeferredParticles";
import {
  spells,
  spellCategories,
  getDailyAffirmation,
  getMoonPhase,
  getRecommendedSpells,
} from "../data/spells";
import { Sparkles, Play } from "lucide-react";
import { useState, useMemo } from "react";
import { useAppStore } from "@/store/useAppStore";

export default function Homepage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const user = useAppStore((s) => s.user);
  const activeSession = useAppStore((s) => s.activeSession);
  const castedSpells = useAppStore((s) => s.castedSpells);
  
  const moon = useMemo(() => getMoonPhase(), []);
  const affirmation = useMemo(() => getDailyAffirmation(), []);
  const recommended = useMemo(() => getRecommendedSpells(3), []);
  const dailySpell = useMemo(() => recommended[0] ?? spells[0], [recommended]);

  const filteredSpells = useMemo(() => 
    selectedCategory
      ? spells.filter((s) => s.category === selectedCategory)
      : spells.slice(0, 12),
    [selectedCategory]
  );

  const recentRitual = castedSpells[0];
  const continueSpell = useMemo(() =>
    activeSession
      ? spells.find((s) => s.id === activeSession.spellId)
      : null,
    [activeSession]
  );

  return (
    <div className="min-h-screen pb-28 relative overflow-hidden">
      <DeferredParticles type="stars" count={6} delayMs={350} />
      <DeferredParticles type="sparkles" count={4} delayMs={500} />

      <div className="sticky top-0 z-20 backdrop-blur-md bg-white/55 border-b border-[#d4b5e8]/15 px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-[#8a7d9e]">Your altar</p>
            <h1 className="text-xl font-semibold text-[#4a4458]">
              Hello, {user?.displayName?.split(" ")[0] ?? "dear one"} ✨
            </h1>
          </div>
          <motion.div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 border border-[#d4b5e8]/20 text-sm"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <span>{moon.icon}</span>
            <span className="text-[#4a4458] text-xs">{moon.name}</span>
          </motion.div>
        </div>
      </div>

      <div className="px-5 py-5 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-[#d4b5e8] to-[#f5d0d9] text-white shadow-lg"
        >
          <motion.div
            className="absolute -right-4 -top-4 opacity-20"
            animate={{ rotate: 360 }}
            transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles size={100} />
          </motion.div>
          <p className="text-xs opacity-90 mb-1">Daily affirmation</p>
          <p className="text-lg leading-relaxed font-medium">"{affirmation}"</p>
        </motion.div>

        {continueSpell && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => navigate(`/ritual/${continueSpell.id}`)}
            className="w-full rounded-3xl p-4 border-2 border-dashed border-[#d4b5e8]/50 bg-white/50 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-[#d4b5e8]/30">
                <Play size={20} className="text-[#9b7ec8]" />
              </div>
              <div>
                <p className="text-xs text-[#8a7d9e]">Continue ritual</p>
                <p className="font-semibold text-[#4a4458]">{continueSpell.name}</p>
              </div>
            </div>
          </motion.button>
        )}

        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-[#4a4458]">Tonight's ritual</h2>
            <button onClick={() => navigate("/daily")} className="text-xs text-[#9b7ec8]">
              View all
            </button>
          </div>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(`/spell/${dailySpell.id}`)}
            className="w-full text-left rounded-3xl p-5 border border-white/60 shadow-md"
            style={{ background: `linear-gradient(135deg, ${dailySpell.color}30, ${dailySpell.color}55)` }}
          >
            <div className="flex gap-4 items-center">
              <span className="text-4xl">{dailySpell.icon}</span>
              <div>
                <h3 className="font-semibold text-[#4a4458]">{dailySpell.name}</h3>
                <p className="text-xs text-[#8a7d9e] mt-0.5">{dailySpell.duration} · {dailySpell.mood}</p>
              </div>
            </div>
          </motion.button>
        </div>

        {recentRitual && (
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 border border-white/60">
            <p className="text-xs text-[#8a7d9e] mb-1">Last casted</p>
            <p className="text-sm font-medium text-[#4a4458]">{recentRitual.spellName}</p>
            <p className="text-xs text-[#8a7d9e] italic truncate">"{recentRitual.intention}"</p>
          </div>
        )}

        <div>
          <h2 className="text-lg font-semibold text-[#4a4458] mb-3">Spell categories</h2>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm ${!selectedCategory ? "bg-[#d4b5e8] text-white" : "bg-white/60 text-[#4a4458]"}`}
            >
              All
            </button>
            {spellCategories.map((cat) => (
              <motion.button
                key={cat.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(cat.id)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm flex items-center gap-1 ${
                  selectedCategory === cat.id ? "text-white shadow-md" : "bg-white/60 text-[#4a4458]"
                }`}
                style={selectedCategory === cat.id ? { background: cat.color } : undefined}
              >
                <span>{cat.icon}</span>
                <span className="whitespace-nowrap">{cat.name}</span>
              </motion.button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-[#4a4458] mb-3">
            {selectedCategory
              ? spellCategories.find((c) => c.id === selectedCategory)?.name
              : "Recommended rituals"}
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {filteredSpells.map((spell, i) => (
              <motion.button
                key={spell.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/spell/${spell.id}`)}
                className="text-left rounded-3xl p-4 border border-white/50 shadow-sm relative overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${spell.color}15, ${spell.color}35)` }}
              >
                <motion.span
                  className="absolute right-2 top-2 text-5xl opacity-[0.08]"
                  animate={{ rotate: [0, 6, -6, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                >
                  {spell.icon}
                </motion.span>
                <div className="flex gap-3 relative z-10">
                  <span
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                    style={{ background: `${spell.color}50` }}
                  >
                    {spell.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-[#4a4458] truncate">{spell.name}</h3>
                    <p className="text-xs text-[#8a7d9e] line-clamp-1">{spell.description}</p>
                    <div className="flex gap-2 mt-1 text-[10px] text-[#8a7d9e]">
                      <span>{spell.duration}</span>
                      <span>·</span>
                      <span>{spell.emotionalTags[0]}</span>
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
          {!selectedCategory && (
            <button
              onClick={() => navigate("/rituals")}
              className="w-full mt-3 py-3 text-sm text-[#9b7ec8] font-medium"
            >
              Browse all {spells.length} rituals →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
