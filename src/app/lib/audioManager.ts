export type AmbientTheme =
  | "love"
  | "sleep"
  | "focus"
  | "healing"
  | "default"
  | "motivation"
  | "protection"
  | "creativity"
  | "anxiety";

export type EffectKind =
  | "sparkle"
  | "drop"
  | "seal"
  | "chime"
  | "paper"
  | "pour"
  | "ribbon";

export interface SoundSettings {
  enabled: boolean;
  ambienceVolume: number;
  effectsVolume: number;
  musicVolume: number;
}

interface LayerNodes {
  stop: () => void;
  gains: GainNode[];
}

const DEFAULT_SETTINGS: SoundSettings = {
  enabled: true,
  ambienceVolume: 0.52,
  effectsVolume: 0.42,
  musicVolume: 0.28,
};

class AudioManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private ambienceBus: GainNode | null = null;
  private sfxBus: GainNode | null = null;
  private musicBus: GainNode | null = null;

  private settings: SoundSettings = { ...DEFAULT_SETTINGS };
  private activeLayers: LayerNodes | null = null;
  private currentTheme: AmbientTheme | null = null;
  private sparkleTimer: ReturnType<typeof setInterval> | null = null;
  private fadeToken = 0;
  private unlocked = false;

  private ensureContext() {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.ambienceBus = this.ctx.createGain();
      this.sfxBus = this.ctx.createGain();
      this.musicBus = this.ctx.createGain();

      this.ambienceBus.connect(this.masterGain);
      this.sfxBus.connect(this.masterGain);
      this.musicBus.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
      this.applySettings(this.settings);
    }
    if (this.ctx.state === "suspended" && this.unlocked) {
      void this.ctx.resume();
    }
  }

  /** Call on first user gesture */
  unlock() {
    this.unlocked = true;
    this.ensureContext();
    if (this.ctx?.state === "suspended") void this.ctx.resume();
  }

  applySettings(settings: Partial<SoundSettings>) {
    this.settings = { ...this.settings, ...settings };
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const enabled = this.settings.enabled;
    const targetMaster = enabled ? 1 : 0;

    this.masterGain.gain.cancelScheduledValues(t);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, t);
    this.masterGain.gain.linearRampToValueAtTime(targetMaster, t + 0.35);

    if (this.ambienceBus) {
      this.ambienceBus.gain.cancelScheduledValues(t);
      this.ambienceBus.gain.setValueAtTime(this.ambienceBus.gain.value, t);
      this.ambienceBus.gain.linearRampToValueAtTime(
        enabled ? this.settings.ambienceVolume : 0,
        t + 0.25
      );
    }
    if (this.sfxBus) {
      this.sfxBus.gain.setValueAtTime(enabled ? this.settings.effectsVolume : 0, t);
    }
    if (this.musicBus) {
      this.musicBus.gain.setValueAtTime(enabled ? this.settings.musicVolume : 0, t);
    }
  }

  getSettings(): SoundSettings {
    return { ...this.settings };
  }

  setEnabled(enabled: boolean) {
    this.applySettings({ enabled });
    if (!enabled) this.fadeOutAmbient(0.4);
  }

  /** @deprecated use applySettings */
  setVolume(volume: number) {
    this.applySettings({
      ambienceVolume: volume,
      effectsVolume: volume * 0.85,
      musicVolume: volume * 0.5,
    });
  }

  private rampGain(node: GainNode, to: number, duration = 1.2) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    node.gain.cancelScheduledValues(t);
    node.gain.setValueAtTime(node.gain.value, t);
    node.gain.linearRampToValueAtTime(to, t + duration);
  }

  private createPad(
    freqs: number[],
    type: OscillatorType,
    detune = 0
  ): LayerNodes {
    const ctx = this.ctx!;
    const gains: GainNode[] = [];
    const oscillators: OscillatorNode[] = [];

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 1400;
    filter.Q.value = 0.6;
    filter.connect(this.ambienceBus!);

    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      osc.detune.value = detune + i * 4;
      g.gain.value = 0;
      osc.connect(g);
      g.connect(filter);
      osc.start();
      this.rampGain(g, 0.12 / (i + 1), 2.5);
      oscillators.push(osc);
      gains.push(g);
    });

    return {
      gains,
      stop: () => {
        oscillators.forEach((o) => {
          try {
            o.stop();
          } catch {
            /* */
          }
        });
      },
    };
  }

  private createNoiseTexture(kind: "wind" | "rain" | "crackle" | "shimmer"): LayerNodes {
    const ctx = this.ctx!;
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (kind === "crackle" ? 0.4 : 0.25);
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    gain.gain.value = 0;

    if (kind === "wind") {
      filter.type = "lowpass";
      filter.frequency.value = 420;
    } else if (kind === "rain") {
      filter.type = "bandpass";
      filter.frequency.value = 900;
      filter.Q.value = 0.4;
    } else if (kind === "crackle") {
      filter.type = "highpass";
      filter.frequency.value = 200;
    } else {
      filter.type = "bandpass";
      filter.frequency.value = 2400;
      filter.Q.value = 2;
    }

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.ambienceBus!);
    source.start();

    const level =
      kind === "crackle" ? 0.08 : kind === "rain" ? 0.1 : kind === "shimmer" ? 0.06 : 0.09;
    this.rampGain(gain, level, 2);

    return {
      gains: [gain],
      stop: () => {
        try {
          source.stop();
        } catch {
          /* */
        }
      },
    };
  }

  private createMusicArp(notes: number[]): LayerNodes {
    const ctx = this.ctx!;
    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(this.musicBus!);
    this.rampGain(master, 0.14, 3);

    const oscillators: OscillatorNode[] = [];
    let idx = 0;

    const playNote = () => {
      if (!this.ctx || !this.settings.enabled) return;
      const freq = notes[idx % notes.length];
      idx++;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      const now = ctx.currentTime;
      osc.type = "sine";
      osc.frequency.value = freq;
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(0.2, now + 0.08);
      g.gain.exponentialRampToValueAtTime(0.001, now + 2.2);
      osc.connect(g);
      g.connect(master);
      osc.start(now);
      osc.stop(now + 2.3);
      oscillators.push(osc);
    };

    const interval = setInterval(playNote, 2800);
    playNote();

    return {
      gains: [master],
      stop: () => clearInterval(interval),
    };
  }

  private startSparkleAccents(theme: AmbientTheme) {
    this.stopSparkleAccents();
    const intervals: Record<AmbientTheme, number> = {
      love: 5000,
      sleep: 7000,
      focus: 6500,
      healing: 6000,
      motivation: 5500,
      protection: 6500,
      default: 6000,
      creativity: 5000,
      anxiety: 7000,
    };
    this.sparkleTimer = setInterval(() => {
      if (Math.random() > 0.35) this.playEffect("chime", 0.5);
      if (theme === "love" && Math.random() > 0.6) this.playEffect("sparkle", 0.4);
    }, intervals[theme]);
  }

  private stopSparkleAccents() {
    if (this.sparkleTimer) {
      clearInterval(this.sparkleTimer);
      this.sparkleTimer = null;
    }
  }

  private buildThemeLayers(theme: AmbientTheme): LayerNodes[] {
    const layers: LayerNodes[] = [];

    const themeConfig: Record<
      AmbientTheme,
      { pad: [number[], OscillatorType]; noise: "wind" | "rain" | "crackle" | "shimmer"; arp: number[] }
    > = {
      sleep: {
        pad: [[174, 196, 220, 261], "sine"],
        noise: "wind",
        arp: [174, 196, 220, 196],
      },
      focus: {
        pad: [[261, 329, 392], "triangle"],
        noise: "rain",
        arp: [329, 392, 440, 392],
      },
      love: {
        pad: [[220, 277, 330, 415], "sine"],
        noise: "shimmer",
        arp: [277, 330, 370, 415],
      },
      healing: {
        pad: [[256, 384, 512], "sine"],
        noise: "wind",
        arp: [256, 288, 320, 384],
      },
      motivation: {
        pad: [[294, 370, 440], "triangle"],
        noise: "shimmer",
        arp: [294, 370, 440, 494],
      },
      protection: {
        pad: [[196, 247, 294], "sine"],
        noise: "wind",
        arp: [196, 247, 294, 247],
      },
      creativity: {
        pad: [[262, 330, 392, 494], "triangle"],
        noise: "shimmer",
        arp: [330, 392, 440, 494],
      },
      anxiety: {
        pad: [[174, 207, 261], "sine"],
        noise: "wind",
        arp: [174, 196, 220, 261],
      },
      default: {
        pad: [[220, 293, 349], "sine"],
        noise: "wind",
        arp: [220, 261, 293, 329],
      },
    };

    const cfg = themeConfig[theme];
    layers.push(this.createPad(cfg.pad[0], cfg.pad[1]));
    layers.push(this.createNoiseTexture(cfg.noise));
    if (theme === "focus" || theme === "love") {
      layers.push(this.createNoiseTexture(theme === "focus" ? "crackle" : "shimmer"));
    }
    layers.push(this.createMusicArp(cfg.arp));

    return layers;
  }

  private stopLayers(layers: LayerNodes | null, fadeMs = 800) {
    if (!layers || !this.ctx) return;
    const t = this.ctx.currentTime;
    layers.gains.forEach((g) => {
      g.gain.cancelScheduledValues(t);
      g.gain.setValueAtTime(g.gain.value, t);
      g.gain.linearRampToValueAtTime(0.0001, t + fadeMs / 1000);
    });
    setTimeout(() => layers.stop(), fadeMs + 50);
  }

  playAmbient(theme: AmbientTheme = "default", options?: { crossfade?: boolean }) {
    if (!this.settings.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    if (this.currentTheme === theme && this.activeLayers) return;

    const token = ++this.fadeToken;
    const crossfade = options?.crossfade ?? this.activeLayers !== null;

    if (crossfade && this.activeLayers) {
      const old = this.activeLayers;
      this.stopLayers(old, 900);
      this.activeLayers = null;
    } else {
      this.stopAmbient(0.1);
    }

    this.currentTheme = theme;
    const layers = this.buildThemeLayers(theme);
    this.activeLayers = {
      gains: layers.flatMap((l) => l.gains),
      stop: () => layers.forEach((l) => l.stop()),
    };
    this.startSparkleAccents(theme);

    if (token !== this.fadeToken) {
      layers.forEach((l) => l.stop());
    }
  }

  fadeOutAmbient(durationSec = 1) {
    this.fadeToken++;
    this.stopSparkleAccents();
    if (this.activeLayers) {
      this.stopLayers(this.activeLayers, durationSec * 1000);
      this.activeLayers = null;
    }
    this.currentTheme = null;
  }

  stopAmbient(_immediate?: number) {
    this.fadeOutAmbient(0.6);
  }

  previewAmbient(theme: AmbientTheme) {
    this.unlock();
    const prev = this.currentTheme;
    this.playAmbient(theme, { crossfade: true });
    setTimeout(() => {
      if (prev) this.playAmbient(prev, { crossfade: true });
      else this.fadeOutAmbient(0.8);
    }, 4500);
  }

  playEffect(kind: EffectKind, intensity = 1) {
    if (!this.settings.enabled || !this.sfxBus) return;
    this.ensureContext();
    if (!this.ctx) return;

    const ctx = this.ctx;
    const now = ctx.currentTime;
    const vol = this.settings.effectsVolume * intensity;

    const configs: Record<EffectKind, { freqs: number[]; type: OscillatorType; dur: number }> = {
      sparkle: { freqs: [880, 1320], type: "sine", dur: 0.35 },
      drop: { freqs: [440, 330], type: "triangle", dur: 0.25 },
      seal: { freqs: [523, 659, 784], type: "sine", dur: 0.5 },
      chime: { freqs: [660, 880, 1047], type: "sine", dur: 0.55 },
      paper: { freqs: [180, 240], type: "triangle", dur: 0.15 },
      pour: { freqs: [320, 280], type: "sine", dur: 0.4 },
      ribbon: { freqs: [494, 587], type: "triangle", dur: 0.3 },
    };

    const cfg = configs[kind];
    cfg.freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = cfg.type;
      osc.frequency.setValueAtTime(freq, now + i * 0.04);
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(vol * (0.35 - i * 0.08), now + 0.02 + i * 0.04);
      g.gain.exponentialRampToValueAtTime(0.001, now + cfg.dur + i * 0.05);
      osc.connect(g);
      g.connect(this.sfxBus!);
      osc.start(now + i * 0.04);
      osc.stop(now + cfg.dur + 0.2);
    });
  }
}

export const audioManager = new AudioManager();

export function categoryToAmbient(category: string): AmbientTheme {
  const map: Record<string, AmbientTheme> = {
    love: "love",
    sleep: "sleep",
    focus: "focus",
    healing: "healing",
    motivation: "motivation",
    protection: "protection",
    anxiety: "anxiety",
    creativity: "creativity",
    confidence: "motivation",
    productivity: "focus",
    friendship: "love",
    "self-worth": "healing",
    "letting-go": "healing",
    luck: "default",
  };
  return map[category] ?? "default";
}

export function preferencesToSoundSettings(prefs: {
  soundEnabled: boolean;
  soundVolume?: number;
  ambienceVolume?: number;
  effectsVolume?: number;
  musicVolume?: number;
}): SoundSettings {
  const base = prefs.soundVolume ?? 0.6;
  return {
    enabled: prefs.soundEnabled,
    ambienceVolume: prefs.ambienceVolume ?? Math.min(0.65, base * 0.85 + 0.12),
    effectsVolume: prefs.effectsVolume ?? Math.min(0.55, base * 0.75 + 0.1),
    musicVolume: prefs.musicVolume ?? Math.min(0.4, base * 0.45 + 0.08),
  };
}
