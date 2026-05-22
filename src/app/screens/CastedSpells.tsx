import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { FloatingParticles } from "../components/FloatingParticles";
import { BookHeart, Calendar } from "lucide-react";
import { useAppStore, computeStreak } from "@/store/useAppStore";
import { spellCategories } from "@/app/data/spells";

export default function CastedSpells() {
  const navigate = useNavigate();
  const castedSpells = useAppStore((s) => s.castedSpells);
  const streak = computeStreak(castedSpells.map((r) => r.date));

  return (
    <div className="min-h-screen pb-28 relative overflow-hidden">
      <FloatingParticles type="stars" count={10} />

      <div className="sticky top-0 z-20 backdrop-blur-md bg-white/60 border-b border-[#d4b5e8]/20 px-6 py-4">
        <h1 className="text-2xl font-semibold text-[#4a4458]">Casted Spells</h1>
        <p className="text-sm text-[#8a7d9e]">Your magical scrapbook</p>
      </div>

      <div className="px-6 py-6">
        {castedSpells.length > 0 && (
          <div className="flex gap-4 mb-6">
            <div className="flex-1 bg-white/60 rounded-2xl p-4 border border-[#d4b5e8]/20 text-center">
              <p className="text-2xl font-semibold text-[#4a4458]">{castedSpells.length}</p>
              <p className="text-xs text-[#8a7d9e]">Rituals</p>
            </div>
            <div className="flex-1 bg-white/60 rounded-2xl p-4 border border-[#d4b5e8]/20 text-center">
              <p className="text-2xl font-semibold text-[#4a4458]">{streak}</p>
              <p className="text-xs text-[#8a7d9e]">Day streak</p>
            </div>
          </div>
        )}

        {castedSpells.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <motion.span
              className="text-6xl block mb-4"
              animate={{ rotate: [0, 8, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              📖
            </motion.span>
            <h2 className="text-xl font-semibold text-[#4a4458] mb-2">Your journey begins</h2>
            <p className="text-[#8a7d9e] max-w-xs mx-auto text-sm">
              Complete your first ritual to start building your archive of real memories
            </p>
            <button
              onClick={() => navigate("/rituals")}
              className="mt-6 text-[#9b7ec8] font-medium text-sm"
            >
              Explore rituals →
            </button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <BookHeart size={20} className="text-[#d4b5e8]" />
              <span className="text-sm text-[#8a7d9e]">Only your completed rituals appear here</span>
            </div>
            {castedSpells.map((record, index) => {
              const cat = spellCategories.find((c) => c.id === record.category);
              return (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="rounded-3xl p-5 border border-white/60 shadow-md relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${record.sigil?.color ?? "#d4b5e8"}18, ${record.sigil?.color ?? "#d4b5e8"}38)`,
                  }}
                >
                  {record.sigil && (
                    <svg
                      viewBox="0 0 100 100"
                      className="absolute right-2 top-2 w-24 h-24 opacity-[0.12]"
                    >
                      <path
                        d={record.sigil.path}
                        fill="none"
                        stroke={record.sigil.color}
                        strokeWidth="2"
                      />
                    </svg>
                  )}
                  <div className="relative z-10 flex gap-4">
                    {record.sigil ? (
                      <div
                        className="w-16 h-16 rounded-2xl p-2 shrink-0"
                        style={{ background: `${record.sigil.color}40` }}
                      >
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          <path
                            d={record.sigil.path}
                            fill="none"
                            stroke={record.sigil.color}
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    ) : (
                      <span className="text-3xl">{cat?.icon ?? "✨"}</span>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[#4a4458]">{record.spellName}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-[#8a7d9e] mt-1">
                        <Calendar size={12} />
                        {new Date(record.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                        {cat && <span>· {cat.name}</span>}
                      </div>
                      <p className="text-sm text-[#4a4458] italic mt-2 line-clamp-2">
                        "{record.intention}"
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
