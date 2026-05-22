import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { getRecommendedSpells } from "@/app/data/spells";
import { FloatingParticles } from "../components/FloatingParticles";
import { Moon, Sun, Sparkles } from "lucide-react";

const suggestions = [
  { title: "Tonight's calming ritual", icon: Moon, filter: "sleep" },
  { title: "Quick confidence boost", icon: Sun, filter: "confidence" },
  { title: "Gentle anxiety relief", icon: Sparkles, filter: "anxiety" },
  { title: "5-minute focus spell", icon: Sparkles, filter: "focus" },
];

export default function DailyRituals() {
  const navigate = useNavigate();
  const recommended = getRecommendedSpells(8);

  return (
    <div className="min-h-screen pb-28 relative overflow-hidden">
      <FloatingParticles type="moons" count={6} />

      <div className="sticky top-0 z-20 backdrop-blur-md bg-white/60 border-b border-[#d4b5e8]/20 px-6 py-4">
        <h1 className="text-2xl font-semibold text-[#4a4458]">Daily Rituals</h1>
        <p className="text-sm text-[#8a7d9e]">Curated for your mood today</p>
      </div>

      <div className="px-6 py-6 space-y-6">
        {suggestions.map((sug, i) => {
          const spell = recommended.find((s) => s.category === sug.filter) ?? recommended[i];
          const Icon = sug.icon;
          return (
            <motion.button
              key={sug.title}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => navigate(`/spell/${spell.id}`)}
              className="w-full text-left rounded-3xl p-5 border border-white/60 shadow-sm"
              style={{ background: `linear-gradient(135deg, ${spell.color}25, ${spell.color}45)` }}
            >
              <div className="flex items-center gap-3 mb-2">
                <Icon size={18} className="text-[#9b7ec8]" />
                <span className="text-xs text-[#8a7d9e]">{sug.title}</span>
              </div>
              <div className="flex gap-3 items-center">
                <span className="text-3xl">{spell.icon}</span>
                <div>
                  <h3 className="font-semibold text-[#4a4458]">{spell.name}</h3>
                  <p className="text-xs text-[#8a7d9e]">{spell.duration}</p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
