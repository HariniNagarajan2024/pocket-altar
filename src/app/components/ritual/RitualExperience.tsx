import { motion, AnimatePresence } from "motion/react";
import { useState, type Ref } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Sparkles } from "lucide-react";
import type { RitualStep, Spell } from "@/app/types";
import { MagicalButton } from "../MagicalButton";
import { audioManager } from "@/app/lib/audioManager";

interface DraggableItemProps {
  step: RitualStep;
  color: string;
  isUsed: boolean;
  isActive: boolean;
}

function DraggableItem({ step, color, isUsed, isActive }: DraggableItemProps) {
  const [{ isDragging }, drag] = useDrag({
    type: "ritual-item",
    item: { itemType: step.itemType },
    canDrag: !isUsed && isActive && step.action === "drag",
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  if (step.action !== "drag") return null;

  return (
    <motion.div
      ref={drag as unknown as Ref<HTMLDivElement>}
      className={`w-[4.5rem] h-[4.5rem] rounded-2xl flex items-center justify-center text-3xl touch-none ${
        isUsed ? "opacity-25 pointer-events-none" : isActive ? "opacity-100" : "opacity-40"
      }`}
      style={{
        background: `linear-gradient(135deg, ${color}40, ${color}90)`,
        boxShadow: isDragging ? `0 12px 40px ${color}50` : `0 4px 16px ${color}25`,
      }}
      whileHover={isActive && !isUsed ? { scale: 1.08, rotate: 4 } : {}}
    >
      {step.icon}
    </motion.div>
  );
}

interface DropZoneProps {
  step: RitualStep;
  color: string;
  isActive: boolean;
  completed: boolean;
  onComplete: () => void;
}

function DropZone({ step, color, isActive, completed, onComplete }: DropZoneProps) {
  const [{ isOver }, drop] = useDrop({
    accept: "ritual-item",
    canDrop: () => isActive && !completed && step.action === "drag",
    drop: (item: { itemType: string }) => {
      if (item.itemType === step.itemType) onComplete();
    },
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  });

  if (step.action === "type" || step.action === "trace") return null;

  return (
    <motion.div
      ref={drop as unknown as Ref<HTMLDivElement>}
      className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full flex items-center justify-center"
      style={{
        background: completed
          ? `radial-gradient(circle, ${color}90, ${color}50)`
          : isOver && isActive
          ? `radial-gradient(circle, ${color}70, ${color}30)`
          : `radial-gradient(circle, ${color}25, transparent)`,
        border: `3px dashed ${isActive ? color : `${color}50`}`,
        boxShadow: completed ? `0 0 48px ${color}50` : isActive ? `0 0 24px ${color}25` : "none",
      }}
      animate={{ scale: isOver && isActive ? 1.06 : completed ? 1.04 : 1 }}
    >
      {completed ? (
        <motion.span
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          className="text-6xl"
        >
          {step.icon}
        </motion.span>
      ) : (
        <motion.span
          className="text-4xl opacity-35"
          animate={{ scale: isActive ? [1, 1.15, 1] : 1 }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          {step.icon}
        </motion.span>
      )}
    </motion.div>
  );
}

interface RitualExperienceProps {
  spell: Spell;
  steps: RitualStep[];
  onComplete: (intention: string) => void;
}

export function RitualExperience({ spell, steps, onComplete }: RitualExperienceProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState<boolean[]>(steps.map(() => false));
  const [intention, setIntention] = useState(spell.affirmation);
  const [showIntention, setShowIntention] = useState(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);

  const step = steps[currentStep];

  const burstParticles = (action = step?.action) => {
    setParticles(
      Array.from({ length: 14 }, (_, i) => ({
        id: Date.now() + i,
        x: 20 + Math.random() * 60,
        y: 20 + Math.random() * 60,
      }))
    );
    audioManager.playEffect("sparkle", 0.85);
    if (step.action === "drag") audioManager.playEffect("drop", 0.7);
    setTimeout(() => setParticles([]), 1800);
  };

  const completeStep = () => {
    const next = [...completed];
    next[currentStep] = true;
    setCompleted(next);
    burstParticles();

    setTimeout(() => {
      if (currentStep < steps.length - 1) {
        const nextIdx = currentStep + 1;
        setCurrentStep(nextIdx);
        if (steps[nextIdx]?.action === "type") setShowIntention(true);
      } else {
        setShowIntention(true);
      }
    }, 900);
  };

  const handleSeal = () => {
    audioManager.playEffect("ribbon", 0.85);
    audioManager.playEffect("seal", 0.9);
    completeStep();
  };

  const handleIntentionSubmit = () => {
    if (!intention.trim()) return;
    audioManager.playEffect("chime");
    onComplete(intention.trim());
  };

  return (
    <div className="flex flex-col flex-1 px-4 pb-8">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute pointer-events-none z-20"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 2.2, opacity: 0 }}
          transition={{ duration: 1.2 }}
        >
          <Sparkles size={20} style={{ color: spell.color }} />
        </motion.div>
      ))}

      <div className="flex justify-center gap-1.5 mb-6 mt-2">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              completed[i] ? "w-7" : i === currentStep ? "w-7" : "w-2"
            }`}
            style={{
              background: completed[i] || i === currentStep ? spell.color : `${spell.color}35`,
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {!showIntention ? (
          <motion.div
            key={`step-${currentStep}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="flex flex-col flex-1"
          >
            <div className="bg-white/55 backdrop-blur-md rounded-3xl px-5 py-4 border border-white/60 text-center mb-6 shadow-sm">
              <p className="text-base sm:text-lg text-[#4a4458] leading-relaxed">
                {step.instruction}
              </p>
            </div>

            <div className="flex-1 flex items-center justify-center mb-8">
              {step.action === "drag" || step.action === "seal" ? (
                <DropZone
                  step={step}
                  color={spell.color}
                  isActive={!completed[currentStep]}
                  completed={completed[currentStep]}
                  onComplete={
                    step.action === "seal" ? handleSeal : completeStep
                  }
                />
              ) : step.action === "trace" ? (
                <motion.button
                  onClick={completeStep}
                  className="w-44 h-44 rounded-full border-2 border-dashed flex items-center justify-center text-5xl"
                  style={{ borderColor: spell.color, background: `${spell.color}20` }}
                  whileTap={{ scale: 0.95 }}
                  animate={{ boxShadow: [`0 0 20px ${spell.color}30`, `0 0 40px ${spell.color}50`, `0 0 20px ${spell.color}30`] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  ✍️
                </motion.button>
              ) : null}
            </div>

            {step.action === "seal" && !completed[currentStep] && (
              <MagicalButton onClick={handleSeal} variant="primary" size="lg" className="w-full mb-4">
                Seal with ribbon ✨
              </MagicalButton>
            )}

            <div className="bg-white/55 backdrop-blur-md rounded-3xl p-5 border border-white/60">
              <p className="text-xs text-center text-[#8a7d9e] mb-3">Magical tools</p>
              <div className="flex justify-center gap-3 flex-wrap">
                {steps.map((s, i) => (
                  <DraggableItem
                    key={s.id}
                    step={s}
                    color={spell.color}
                    isUsed={completed[i]}
                    isActive={i === currentStep}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="intention"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col flex-1 justify-center max-w-md mx-auto w-full"
          >
            <div className="text-center mb-6">
              <motion.span
                className="text-5xl block mb-3"
                animate={{ rotate: [0, 8, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                ✨
              </motion.span>
              <h2 className="text-xl font-semibold text-[#4a4458]">Write your intention</h2>
              <p className="text-sm text-[#8a7d9e] mt-1">Let your words become magic</p>
            </div>
            <textarea
              value={intention}
              onChange={(e) => setIntention(e.target.value)}
              className="w-full h-36 px-5 py-4 rounded-3xl bg-white/60 border-2 border-[#d4b5e8]/30 focus:border-[#d4b5e8] outline-none resize-none text-[#4a4458] mb-4"
              placeholder="I am ready to..."
            />
            <MagicalButton onClick={handleIntentionSubmit} variant="primary" size="lg" className="w-full">
              Create your sigil ✨
            </MagicalButton>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
