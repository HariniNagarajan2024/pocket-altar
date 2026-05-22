import { useCallback } from "react";
import { motion } from "motion/react";
import { Volume2, VolumeX, Play } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { audioManager, categoryToAmbient, type AmbientTheme } from "@/app/lib/audioManager";

const previewThemes: { id: AmbientTheme; label: string; emoji: string }[] = [
  { id: "sleep", label: "Sleep", emoji: "🌙" },
  { id: "focus", label: "Focus", emoji: "📚" },
  { id: "love", label: "Love", emoji: "💗" },
  { id: "healing", label: "Calm", emoji: "🌸" },
];

function SliderRow({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-[#4a4458]">{label}</span>
        <span className="text-xs text-[#8a7d9e]">{Math.round(value * 100)}%</span>
      </div>
      <p className="text-[10px] text-[#8a7d9e] mb-2">{hint}</p>
      <input
        type="range"
        min={0}
        max={1}
        step={0.05}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-[#d4b5e8]"
      />
    </div>
  );
}

export function SoundSettingsPanel() {
  const prefs = useAppStore((s) => s.preferences);
  const updateSound = useAppStore((s) => s.updateSoundPreferences);

  const handlePreview = useCallback((theme: AmbientTheme) => {
    audioManager.unlock();
    updateSound({ soundEnabled: true });
    audioManager.previewAmbient(theme);
  }, [updateSound]);

  const handlePreviewEffect = () => {
    audioManager.unlock();
    audioManager.playEffect("chime");
    audioManager.playEffect("sparkle", 0.7);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {prefs.soundEnabled ? (
            <Volume2 size={18} className="text-[#d4b5e8]" />
          ) : (
            <VolumeX size={18} className="text-[#8a7d9e]" />
          )}
          <h3 className="font-semibold text-[#4a4458]">Sound</h3>
        </div>
        <Toggle
          checked={prefs.soundEnabled}
          onChange={() => updateSound({ soundEnabled: !prefs.soundEnabled })}
        />
      </div>

      {prefs.soundEnabled && (
        <>
          <SliderRow
            label="Ambience"
            hint="Wind, pads, and atmospheric layers"
            value={prefs.ambienceVolume}
            onChange={(ambienceVolume) => updateSound({ ambienceVolume })}
          />
          <SliderRow
            label="Sound effects"
            hint="Sparkles, drops, chimes during rituals"
            value={prefs.effectsVolume}
            onChange={(effectsVolume) => updateSound({ effectsVolume })}
          />
          <SliderRow
            label="Music"
            hint="Gentle arpeggios and dreamy tones"
            value={prefs.musicVolume}
            onChange={(musicVolume) => updateSound({ musicVolume })}
          />

          <div>
            <p className="text-xs text-[#8a7d9e] mb-2">Preview atmospheres</p>
            <div className="grid grid-cols-2 gap-2">
              {previewThemes.map((t) => (
                <motion.button
                  key={t.id}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handlePreview(t.id)}
                  className="flex items-center gap-2 p-3 rounded-2xl bg-white/50 border border-[#d4b5e8]/20 text-left text-sm text-[#4a4458]"
                >
                  <span>{t.emoji}</span>
                  <span className="flex-1">{t.label}</span>
                  <Play size={14} className="text-[#9b7ec8]" />
                </motion.button>
              ))}
            </div>
            <button
              type="button"
              onClick={handlePreviewEffect}
              className="mt-2 w-full text-xs text-[#9b7ec8] py-2"
            >
              Preview interaction sounds ✨
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onChange}
      className={`w-14 h-8 rounded-full shrink-0 ${checked ? "bg-[#d4b5e8]" : "bg-[#cbced4]"}`}
      whileTap={{ scale: 0.95 }}
      aria-pressed={checked}
    >
      <motion.div
        className="w-6 h-6 bg-white rounded-full shadow-md"
        animate={{ x: checked ? 28 : 4 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </motion.button>
  );
}
