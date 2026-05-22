import { useEffect, type ReactNode } from "react";
import { audioManager, preferencesToSoundSettings } from "@/app/lib/audioManager";
import { useAppStore } from "@/store/useAppStore";

/** Keeps Web Audio in sync with persisted preferences */
export function AudioProvider({ children }: { children: ReactNode }) {
  const soundEnabled = useAppStore((s) => s.preferences.soundEnabled);
  const ambienceVolume = useAppStore((s) => s.preferences.ambienceVolume);
  const effectsVolume = useAppStore((s) => s.preferences.effectsVolume);
  const musicVolume = useAppStore((s) => s.preferences.musicVolume);
  const soundVolume = useAppStore((s) => s.preferences.soundVolume);

  useEffect(() => {
    audioManager.applySettings(
      preferencesToSoundSettings({
        soundEnabled,
        soundVolume,
        ambienceVolume,
        effectsVolume,
        musicVolume,
      })
    );
  }, [soundEnabled, ambienceVolume, effectsVolume, musicVolume, soundVolume]);

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
