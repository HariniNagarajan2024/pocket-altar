import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { getSpellById } from "@/app/data/spells";
import { getRitualSteps } from "@/app/data/ritualTemplates";
import { DeferredParticles } from "../components/DeferredParticles";
import { RitualExperience } from "../components/ritual/RitualExperience";
import { useAppStore } from "@/store/useAppStore";
import { audioManager, categoryToAmbient } from "@/app/lib/audioManager";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";

export default function RitualMode() {
  const { id } = useParams();
  const navigate = useNavigate();
  const spell = id ? getSpellById(id) : undefined;
  const setCurrentSpellId = useAppStore((s) => s.setCurrentSpellId);
  const setCurrentIntention = useAppStore((s) => s.setCurrentIntention);
  const setActiveSession = useAppStore((s) => s.setActiveSession);
  const soundEnabled = useAppStore((s) => s.preferences.soundEnabled);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!spell) return;

    setCurrentSpellId(spell.id);
    if (!startedRef.current) {
      setActiveSession({
        spellId: spell.id,
        currentStep: 0,
        intention: "",
        startedAt: new Date().toISOString(),
      });
      startedRef.current = true;
    }

    audioManager.unlock();
    if (soundEnabled) {
      audioManager.playAmbient(categoryToAmbient(spell.category), { crossfade: true });
    }

    return () => {
      audioManager.fadeOutAmbient(0.8);
    };
  }, [spell?.id, soundEnabled, setCurrentSpellId, setActiveSession]);

  if (!spell) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#4a4458]">
        Spell not found
      </div>
    );
  }

  const steps = getRitualSteps(spell.ritualType);

  return (
    <div className="ritual-screen min-h-[100dvh] flex flex-col relative overflow-hidden bg-gradient-to-b from-[#faf8fc] to-[#f0ebf5] touch-pan-y">
      <DeferredParticles type="sparkles" count={6} color={spell.color} delayMs={500} />

      <div className="px-4 pt-4 safe-top flex items-center gap-3 shrink-0">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            audioManager.fadeOutAmbient(0.4);
            navigate(`/spell/${spell.id}`);
          }}
          className="p-2 rounded-full bg-white/70 border border-[#d4b5e8]/25"
          aria-label="Leave ritual"
        >
          <ArrowLeft size={20} className="text-[#4a4458]" />
        </motion.button>
        <div>
          <h1 className="text-lg font-semibold text-[#4a4458]">{spell.name}</h1>
          <p className="text-xs text-[#8a7d9e]">{spell.duration}</p>
        </div>
      </div>

      <RitualExperience
        spell={spell}
        steps={steps}
        onComplete={(intention) => {
          setCurrentIntention(intention);
          audioManager.playEffect("chime");
          audioManager.playEffect("seal", 0.8);
          navigate("/sigil");
        }}
      />
    </div>
  );
}
