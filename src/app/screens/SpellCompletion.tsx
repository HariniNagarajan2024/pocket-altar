import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { DeferredParticles } from "../components/DeferredParticles";
import { MagicalButton } from "../components/MagicalButton";
import { Download, Home, Archive } from "lucide-react";
import confetti from "canvas-confetti";
import { useAppStore } from "@/store/useAppStore";
import { getSpellById } from "@/app/data/spells";
import { generateWallpaperImage, downloadDataUrl } from "@/app/lib/wallpaperGenerator";
import { audioManager } from "@/app/lib/audioManager";

export default function SpellCompletion() {
  const navigate = useNavigate();
  const pendingSigil = useAppStore((s) => s.pendingSigil);
  const intention = useAppStore((s) => s.currentIntention);
  const spellId = useAppStore((s) => s.currentSpellId);
  const addCastedSpell = useAppStore((s) => s.addCastedSpell);
  const addWallpaper = useAppStore((s) => s.addWallpaper);
  const setActiveSession = useAppStore((s) => s.setActiveSession);
  const spell = spellId ? getSpellById(spellId) : undefined;
  const [downloading, setDownloading] = useState(false);
  const savedRef = useRef(false);

  useEffect(() => {
    audioManager.fadeOutAmbient(0.5);
    if (savedRef.current || !spell || !pendingSigil) return;
    savedRef.current = true;

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.55 },
      colors: ["#d4b5e8", "#f5d0d9", "#ffd8bf", "#cce4f7", "#fff4cc"],
    });
    audioManager.playEffect("chime", 0.9);
    audioManager.playEffect("sparkle", 0.6);

    addCastedSpell({
      spellId: spell.id,
      spellName: spell.name,
      category: spell.category,
      date: new Date().toISOString(),
      intention,
      affirmation: spell.affirmation,
      sigil: pendingSigil,
    });
    setActiveSession(null);
  }, [spell, pendingSigil, intention, addCastedSpell, setActiveSession]);

  const handleWallpaper = async () => {
    if (!spell || !pendingSigil) return;
    setDownloading(true);
    try {
      const wp = await generateWallpaperImage({
        spellName: spell.name,
        affirmation: spell.affirmation,
        sigil: pendingSigil,
        themeColor: spell.color,
        spellId: spell.id,
      });
      addWallpaper(wp);
      if (wp.dataUrl) downloadDataUrl(wp.dataUrl, `${spell.name}-wallpaper.png`);
      audioManager.playEffect("sparkle");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[#faf8fc] to-[#f0ebf5] p-6">
      <DeferredParticles type="sparkles" count={10} color="#d4b5e8" delayMs={400} />

      <div className="max-w-md mx-auto min-h-screen flex flex-col justify-center gap-6 py-10">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
          <motion.span
            className="text-7xl block mb-4"
            animate={{ scale: [1, 1.15, 1], rotate: [0, 8, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            ✨
          </motion.span>
          <h1 className="text-2xl font-semibold text-[#4a4458]">Your ritual has been sealed</h1>
          <p className="text-[#8a7d9e] mt-2">Carry this intention gently. The altar remembers.</p>
        </motion.div>

        {pendingSigil && (
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="rounded-3xl p-6 shadow-xl overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${pendingSigil.color}50, ${pendingSigil.color}90)` }}
          >
            <svg viewBox="0 0 100 100" className="w-full max-w-[200px] mx-auto aspect-square">
              <path
                d={pendingSigil.path}
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,0.6))" }}
              />
            </svg>
            <p className="text-center text-white italic mt-4 text-sm">"{intention}"</p>
            {spell && <p className="text-center text-white/80 text-xs mt-2">{spell.name}</p>}
          </motion.div>
        )}

        <div className="space-y-3">
          <MagicalButton
            onClick={handleWallpaper}
            variant="primary"
            size="lg"
            className="w-full"
            disabled={downloading}
          >
            <span className="flex items-center justify-center gap-2">
              <Download size={18} />
              {downloading ? "Creating wallpaper..." : "Download wallpaper"}
            </span>
          </MagicalButton>
          <div className="grid grid-cols-2 gap-3">
            <MagicalButton onClick={() => navigate("/archive")} variant="secondary" size="md" className="w-full">
              <Archive size={16} className="inline mr-1" /> Archive
            </MagicalButton>
            <MagicalButton onClick={() => navigate("/home")} variant="secondary" size="md" className="w-full">
              <Home size={16} className="inline mr-1" /> Home
            </MagicalButton>
          </div>
        </div>
      </div>
    </div>
  );
}
