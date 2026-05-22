import { motion } from "motion/react";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { DeferredParticles } from "../components/DeferredParticles";
import { audioManager } from "@/app/lib/audioManager";
import { MagicalButton } from "../components/MagicalButton";
import { RefreshCw, Palette, Sparkles } from "lucide-react";
import { generateSigil, sigilPalette } from "@/app/lib/sigilGenerator";
import { useAppStore } from "@/store/useAppStore";
import { getSpellById } from "@/app/data/spells";

export default function SigilGeneration() {
  const navigate = useNavigate();
  const intention = useAppStore((s) => s.currentIntention);
  const spellId = useAppStore((s) => s.currentSpellId);
  const setPendingSigil = useAppStore((s) => s.setPendingSigil);
  const saveSigil = useAppStore((s) => s.saveSigil);
  const spell = spellId ? getSpellById(spellId) : undefined;

  const [colorIndex, setColorIndex] = useState(0);
  const [seedOffset, setSeedOffset] = useState(0);
  const [isGenerating, setIsGenerating] = useState(true);

  const selectedColor = sigilPalette[colorIndex];
  const sigil = useMemo(
    () => generateSigil(intention || "my intention", selectedColor.color, seedOffset),
    [intention, selectedColor.color, seedOffset]
  );

  useEffect(() => {
    audioManager.playEffect("chime", 0.5);
    setIsGenerating(true);
    const t = setTimeout(() => {
      setIsGenerating(false);
      audioManager.playEffect("sparkle", 0.4);
    }, 1600);
    return () => clearTimeout(t);
  }, [seedOffset, colorIndex]);

  const regenerate = () => {
    setSeedOffset((s) => s + 1);
    setIsGenerating(true);
  };

  const handleComplete = () => {
    setPendingSigil(sigil);
    saveSigil(sigil);
    navigate("/completion");
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[#faf8fc] to-[#f0ebf5] p-6 pb-12">
      <DeferredParticles type="stars" count={10} color={selectedColor.color} delayMs={300} />

      <div className="max-w-md mx-auto space-y-6 py-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-[#4a4458]">Your Sigil</h1>
          <p className="text-sm text-[#8a7d9e]">{spell?.name ?? "Personal ritual"}</p>
        </div>

        <motion.div
          className="aspect-square rounded-3xl p-6 relative overflow-hidden shadow-xl"
          style={{
            background: `radial-gradient(circle, ${selectedColor.color}25, ${selectedColor.color}50)`,
            border: `2px solid ${selectedColor.color}70`,
          }}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          {isGenerating ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                <RefreshCw size={40} style={{ color: selectedColor.color }} />
              </motion.div>
            </div>
          ) : (
            <motion.svg viewBox="0 0 100 100" className="w-full h-full">
              <motion.path
                d={sigil.path}
                fill={`${selectedColor.color}18`}
                stroke={selectedColor.color}
                strokeWidth="1.8"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                style={{ filter: `drop-shadow(0 0 8px ${selectedColor.color})` }}
              />
            </motion.svg>
          )}
        </motion.div>

        <p className="text-center text-[#4a4458] italic text-sm px-4">"{intention}"</p>

        <div className="bg-white/60 backdrop-blur-md rounded-3xl p-5 border border-[#d4b5e8]/20">
          <div className="flex items-center gap-2 mb-3">
            <Palette size={18} className="text-[#8a7d9e]" />
            <span className="font-medium text-[#4a4458] text-sm">Recolor sigil</span>
          </div>
          <div className="flex gap-2 flex-wrap justify-center">
            {sigilPalette.map((c, i) => (
              <motion.button
                key={c.name}
                whileTap={{ scale: 0.9 }}
                onClick={() => setColorIndex(i)}
                className={`w-11 h-11 rounded-full ${colorIndex === i ? "ring-2 ring-offset-2 ring-[#9b7ec8]" : ""}`}
                style={{ background: c.color }}
                title={c.name}
              />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <MagicalButton onClick={regenerate} variant="secondary" size="lg" className="w-full">
            <span className="flex items-center justify-center gap-2">
              <RefreshCw size={18} /> Regenerate sigil
            </span>
          </MagicalButton>
          <MagicalButton onClick={handleComplete} variant="primary" size="lg" className="w-full">
            <span className="flex items-center justify-center gap-2">
              <Sparkles size={18} /> Seal ritual
            </span>
          </MagicalButton>
        </div>
      </div>
    </div>
  );
}
