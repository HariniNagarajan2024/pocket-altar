import { motion } from "motion/react";
import { altarThemes, useAppStore } from "@/store/useAppStore";
import type { AltarThemeId } from "@/app/types";

export function ThemePicker() {
  const current = useAppStore((s) => s.preferences.altarTheme);
  const updateTheme = useAppStore((s) => s.updateTheme);

  return (
    <div className="grid grid-cols-1 gap-2">
      {(Object.entries(altarThemes) as [AltarThemeId, (typeof altarThemes)[AltarThemeId]][]).map(
        ([id, theme]) => (
          <motion.button
            key={id}
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={() => updateTheme(id)}
            className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
              current === id
                ? "border-[#d4b5e8] shadow-md bg-white/70"
                : "border-[#d4b5e8]/15 bg-white/40"
            }`}
            style={{
              background:
                current === id
                  ? `linear-gradient(135deg, ${theme.accent}30, ${theme.accent}50)`
                  : undefined,
            }}
          >
            <span className="text-xl mr-2">{theme.icon}</span>
            <span className="font-medium text-[#4a4458]">{theme.name}</span>
            {current === id && (
              <span className="float-right text-xs text-[#9b7ec8] font-medium">Active</span>
            )}
          </motion.button>
        )
      )}
    </div>
  );
}
