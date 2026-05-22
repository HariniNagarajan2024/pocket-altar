import { useEffect, type ReactNode } from "react";
import { audioManager, preferencesToSoundSettings } from "@/app/lib/audioManager";
import { useAppStore } from "@/store/useAppStore";

/** Keeps Web Audio in sync with persisted preferences */
export function AudioProvider({ children }: { children: ReactNode }) {
  const preferences = useAppStore((s) => s.preferences);

  useEffect(() => {
    audioManager.applySettings(preferencesToSoundSettings({
      soundEnabled: preferences.soundEnabled,
      soundVolume: preferences.soundVolume,
      ambienceVolume: preferences.ambienceVolume,
      effectsVolume: preferences.effectsVolume,
      musicVolume: preferences.musicVolume,
    }));
  }, [preferences]);

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
