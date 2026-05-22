import { motion } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { spells, spellCategories } from "@/app/data/spells";
import { FloatingParticles } from "@/app/components/FloatingParticles";
import { Search } from "lucide-react";

export default function RitualsCatalog() {
  const navigate = useNavigate();
  const [category, setCategory] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const filtered = spells.filter((s) => {
    const matchCat = !category || s.category === category;
    const matchQuery =
      !query ||
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.emotionalTags.some((t) => t.includes(query.toLowerCase()));
    return matchCat && matchQuery;
  });

  return (
    <div className="min-h-screen pb-28 relative overflow-hidden">
      <FloatingParticles type="sparkles" count={6} />

      <div className="sticky top-0 z-20 backdrop-blur-md bg-white/60 border-b border-[#d4b5e8]/20 px-6 py-4 space-y-3">
        <h1 className="text-2xl font-semibold text-[#4a4458]">Ritual Library</h1>
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8a7d9e]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search spells..."
            className="w-full pl-11 pr-4 py-2.5 rounded-full bg-white/70 border border-[#d4b5e8]/25 outline-none text-sm text-[#4a4458]"
          />
        </div>
      </div>

      <div className="px-6 py-4">
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
          <button
            onClick={() => setCategory(null)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
              !category ? "bg-[#d4b5e8] text-white" : "bg-white/60 text-[#4a4458]"
            }`}
          >
            All ({spells.length})
          </button>
          {spellCategories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                category === c.id ? "text-white shadow-md" : "bg-white/60 text-[#4a4458]"
              }`}
              style={category === c.id ? { background: c.color } : undefined}
            >
              {c.icon} {c.name}
            </button>
          ))}
        </div>

        <p className="text-xs text-[#8a7d9e] mb-4">{filtered.length} rituals</p>

        <div className="grid grid-cols-1 gap-3">
          {filtered.map((spell, i) => (
            <motion.button
              key={spell.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.02, 0.4) }}
              onClick={() => navigate(`/spell/${spell.id}`)}
              className="text-left rounded-3xl p-4 border border-white/50 shadow-sm"
              style={{ background: `linear-gradient(135deg, ${spell.color}18, ${spell.color}35)` }}
            >
              <div className="flex gap-3 items-center">
                <span className="text-3xl w-12 h-12 flex items-center justify-center rounded-2xl" style={{ background: `${spell.color}50` }}>
                  {spell.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[#4a4458] truncate">{spell.name}</h3>
                  <p className="text-xs text-[#8a7d9e]">{spell.duration} · {spell.mood}</p>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {spell.emotionalTags.map((t) => (
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-white/50 text-[#8a7d9e]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
