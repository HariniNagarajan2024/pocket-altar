import { motion, AnimatePresence } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { DeferredParticles } from "../components/DeferredParticles";
import { MagicalButton } from "../components/MagicalButton";
import { Flame, Sparkles, BookHeart, ChevronRight, Volume2, ArrowLeft } from "lucide-react";
import { altarThemes, useAppStore } from "@/store/useAppStore";
import type { AltarThemeId, OnboardingMode, SpellCategoryId } from "@/app/types";
import { spellCategories } from "@/app/data/spells";

const onboardingScreens = [
  {
    title: "Welcome to your digital altar.",
    subtitle: "A peaceful space for self-care rituals and manifestation",
    Icon: Sparkles,
    color: "#d4b5e8",
  },
  {
    title: "Perform calming symbolic rituals.",
    subtitle: "Interactive experiences designed to soothe and inspire",
    Icon: Flame,
    color: "#ffd8bf",
  },
  {
    title: "Save your rituals and sigils.",
    subtitle: "Create beautiful wallpapers to carry your intentions",
    Icon: BookHeart,
    color: "#f5d0d9",
  },
];

const ambientOptions = [
  { id: "chimes" as const, label: "Soft chimes", icon: "🔔" },
  { id: "piano" as const, label: "Dreamy piano", icon: "🎹" },
  { id: "nature" as const, label: "Gentle wind", icon: "🍃" },
  { id: "silence" as const, label: "Quiet mode", icon: "🤫" },
];

function parseMode(raw: string | null): OnboardingMode {
  if (raw === "theme" || raw === "sound" || raw === "categories" || raw === "welcome") return raw;
  return "full";
}

export default function Onboarding() {
  const [searchParams] = useSearchParams();
  const mode = parseMode(searchParams.get("mode"));
  const navigate = useNavigate();
  const storedPrefs = useAppStore((s) => s.preferences);
  const onboardingComplete = storedPrefs.onboardingComplete;
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const updateTheme = useAppStore((s) => s.updateTheme);
  const updateSoundPreferences = useAppStore((s) => s.updateSoundPreferences);
  const updateRitualPreferences = useAppStore((s) => s.updateRitualPreferences);

  type ScreenConfig =
    | { type: "intro"; index: number }
    | { type: "theme" }
    | { type: "categories" }
    | { type: "sound" };

  const screens = useMemo((): ScreenConfig[] => {
    switch (mode) {
      case "theme":
        return [{ type: "theme" }];
      case "sound":
        return [{ type: "sound" }];
      case "categories":
        return [{ type: "categories" }];
      case "welcome":
        return [
          { type: "intro", index: 0 },
          { type: "intro", index: 1 },
          { type: "intro", index: 2 },
        ];
      default:
        return [
          { type: "intro", index: 0 },
          { type: "intro", index: 1 },
          { type: "intro", index: 2 },
          { type: "theme" },
          { type: "categories" },
          { type: "sound" },
        ];
    }
  }, [mode]);

  const [currentScreen, setCurrentScreen] = useState(0);
  const [selectedTheme, setSelectedTheme] = useState<AltarThemeId>(storedPrefs.altarTheme);
  const [favoriteCategories, setFavoriteCategories] = useState<SpellCategoryId[]>(
    storedPrefs.favoriteCategories
  );
  const [ambientSound, setAmbientSound] = useState(storedPrefs.ambientSound);

  useEffect(() => {
    if (mode === "full" && onboardingComplete) {
      navigate("/home", { replace: true });
    }
  }, [mode, onboardingComplete, navigate]);

  useEffect(() => {
    setSelectedTheme(storedPrefs.altarTheme);
    setFavoriteCategories(storedPrefs.favoriteCategories);
    setAmbientSound(storedPrefs.ambientSound);
  }, [storedPrefs.altarTheme, storedPrefs.favoriteCategories, storedPrefs.ambientSound]);

  const screen = screens[currentScreen];
  const currentData =
    screen?.type === "intro" ? onboardingScreens[screen.index] : null;

  const toggleCategory = (id: SpellCategoryId) => {
    setFavoriteCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : prev.length < 5 ? [...prev, id] : prev
    );
  };

  const finish = () => {
    if (mode === "theme") {
      updateTheme(selectedTheme);
      navigate("/settings", { replace: true });
      return;
    }
    if (mode === "sound") {
      updateSoundPreferences({
        ambientSound,
        soundEnabled: ambientSound !== "silence",
      });
      navigate("/settings", { replace: true });
      return;
    }
    if (mode === "categories") {
      updateRitualPreferences(favoriteCategories);
      navigate("/settings", { replace: true });
      return;
    }
    if (mode === "welcome") {
      navigate("/home", { replace: true });
      return;
    }
    completeOnboarding({
      altarTheme: selectedTheme,
      favoriteCategories,
      ambientSound,
      soundEnabled: ambientSound !== "silence",
    });
    navigate("/home", { replace: true });
  };

  const handleNext = () => {
    if (currentScreen < screens.length - 1) {
      setCurrentScreen(currentScreen + 1);
    } else {
      finish();
    }
  };

  const exitLabel =
    mode === "theme" || mode === "sound" || mode === "categories"
      ? "Save"
      : mode === "welcome"
      ? "Return home"
      : "Begin your journey";

  const showBackToSettings = mode !== "full";

  return (
    <div className="min-h-screen flex flex-col p-6 relative overflow-hidden bg-gradient-to-b from-[#faf8fc] to-[#f0ebf5]">
      <DeferredParticles type="sparkles" count={8} delayMs={600} />

      {showBackToSettings && (
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-[#8a7d9e] mb-2 self-start"
        >
          <ArrowLeft size={16} /> Back to settings
        </button>
      )}

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md mx-auto">
        <AnimatePresence mode="wait">
          {screen?.type === "intro" && currentData && (
            <motion.div
              key={`intro-${screen.index}`}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              className="text-center"
            >
              <motion.div
                className="mb-8 flex justify-center"
                animate={{ y: [0, -10, 0], rotate: [0, 4, -4, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <div
                  className="p-8 rounded-full"
                  style={{
                    background: `linear-gradient(135deg, ${currentData.color}40, ${currentData.color}90)`,
                  }}
                >
                  <currentData.Icon size={56} style={{ color: currentData.color }} />
                </div>
              </motion.div>
              <h2 className="text-2xl sm:text-3xl font-semibold mb-3 text-[#4a4458]">
                {currentData.title}
              </h2>
              <p className="text-[#8a7d9e] leading-relaxed">{currentData.subtitle}</p>
            </motion.div>
          )}

          {screen?.type === "theme" && (
            <motion.div key="theme" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
              <h2 className="text-2xl font-semibold text-center text-[#4a4458] mb-2">
                Choose your altar aesthetic
              </h2>
              <p className="text-center text-[#8a7d9e] text-sm mb-6">Your sanctuary's mood and colors</p>
              <div className="space-y-3">
                {(Object.entries(altarThemes) as [AltarThemeId, (typeof altarThemes)[AltarThemeId]][]).map(
                  ([id, theme]) => (
                    <motion.button
                      key={id}
                      type="button"
                      onClick={() => setSelectedTheme(id)}
                      className={`w-full p-4 rounded-3xl border-2 text-left ${
                        selectedTheme === id ? "border-[#d4b5e8] shadow-lg" : "border-[#d4b5e8]/20"
                      }`}
                      style={{
                        background: `linear-gradient(135deg, ${theme.accent}25, ${theme.accent}45)`,
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="text-2xl mr-3">{theme.icon}</span>
                      <span className="font-semibold text-[#4a4458]">{theme.name}</span>
                    </motion.button>
                  )
                )}
              </div>
            </motion.div>
          )}

          {screen?.type === "categories" && (
            <motion.div key="cats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
              <h2 className="text-2xl font-semibold text-center text-[#4a4458] mb-2">
                Favorite ritual types
              </h2>
              <p className="text-center text-[#8a7d9e] text-sm mb-6">Pick up to 5 (optional)</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {spellCategories.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleCategory(c.id)}
                    className={`px-4 py-2 rounded-full text-sm border transition-all ${
                      favoriteCategories.includes(c.id)
                        ? "bg-[#d4b5e8] text-white border-[#d4b5e8]"
                        : "bg-white/60 border-[#d4b5e8]/25 text-[#4a4458]"
                    }`}
                  >
                    {c.icon} {c.name}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {screen?.type === "sound" && (
            <motion.div key="sound" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
              <h2 className="text-2xl font-semibold text-center text-[#4a4458] mb-2 flex items-center justify-center gap-2">
                <Volume2 size={22} /> Ambient preference
              </h2>
              <p className="text-center text-[#8a7d9e] text-sm mb-6">Set the mood for your rituals</p>
              <div className="grid grid-cols-2 gap-3">
                {ambientOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setAmbientSound(opt.id)}
                    className={`p-4 rounded-2xl border-2 text-center ${
                      ambientSound === opt.id
                        ? "border-[#d4b5e8] bg-[#d4b5e8]/20"
                        : "border-[#d4b5e8]/20 bg-white/50"
                    }`}
                  >
                    <span className="text-2xl block mb-1">{opt.icon}</span>
                    <span className="text-sm text-[#4a4458]">{opt.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="w-full max-w-md mx-auto space-y-3 safe-bottom">
        {screens.length > 1 && (
          <div className="flex justify-center gap-1.5 mb-4">
            {screens.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === currentScreen ? "w-7 bg-[#d4b5e8]" : "w-2 bg-[#d4b5e8]/30"
                }`}
              />
            ))}
          </div>
        )}
        <MagicalButton onClick={handleNext} variant="primary" size="lg" className="w-full">
          <span className="flex items-center justify-center gap-2">
            {exitLabel}
            <ChevronRight size={18} />
          </span>
        </MagicalButton>
        {currentScreen > 0 && (
          <button
            type="button"
            onClick={() => setCurrentScreen(currentScreen - 1)}
            className="w-full text-[#8a7d9e] text-sm"
          >
            Back
          </button>
        )}
      </div>
    </div>
  );
}
