import { useEffect, type ReactNode } from "react";
import { audioManager, preferencesToSoundSettings } from "@/app/lib/audioManager";
import { useAppStore } from "@/store/useAppStore";

/** Keeps Web Audio in sync with persisted preferences */
export function AudioProvider({ children }: { children: ReactNode }) {
  const soundSettings = useAppStore((s) => ({
    soundEnabled: s.preferences.soundEnabled,
    soundVolume: s.preferences.soundVolume,
    ambienceVolume: s.preferences.ambienceVolume,
    effectsVolume: s.preferences.effectsVolume,
    musicVolume: s.preferences.musicVolume,
  }), (a, b) =>
    a.soundEnabled === b.soundEnabled &&
    a.soundVolume === b.soundVolume &&
    a.ambienceVolume === b.ambienceVolume &&
    a.effectsVolume === b.effectsVolume &&
    a.musicVolume === b.musicVolume
  );

  useEffect(() => {
    audioManager.applySettings(preferencesToSoundSettings(soundSettings));
  }, [soundSettings]);

  useEffect(() => {
    const unlock = () => audioManager.unlock();
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  return <>{children}</>;
}
