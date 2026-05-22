export type AltarThemeId =
  | "lavender-dream"
  | "moon-garden"
  | "peach-sanctuary"
  | "rose-glow"
  | "starlight-study";

export type RitualType =
  | "candle"
  | "spell-jar"
  | "tea"
  | "sigil"
  | "moon"
  | "crystal"
  | "sleep"
  | "focus";

export type SpellCategoryId =
  | "love"
  | "confidence"
  | "protection"
  | "healing"
  | "sleep"
  | "motivation"
  | "creativity"
  | "focus"
  | "anxiety"
  | "productivity"
  | "friendship"
  | "self-worth"
  | "letting-go"
  | "luck";

export interface Spell {
  id: string;
  name: string;
  category: SpellCategoryId;
  description: string;
  duration: string;
  mood: string;
  intention: string;
  affirmation: string;
  icon: string;
  color: string;
  ingredients: string[];
  ritualType: RitualType;
  emotionalTags: string[];
  steps: string[];
  wallpaperTheme: string;
  sigilStyle: string;
  ambientSound: string;
}

export interface RitualStep {
  id: string;
  instruction: string;
  itemType: string;
  icon: string;
  action: "drag" | "type" | "trace" | "seal";
}

export interface RitualTemplate {
  type: RitualType;
  name: string;
  steps: RitualStep[];
}

export interface SigilData {
  path: string;
  color: string;
  seed: string;
  intention: string;
}

export interface WallpaperData {
  id: string;
  spellId: string;
  spellName: string;
  affirmation: string;
  sigil: SigilData;
  themeColor: string;
  createdAt: string;
  dataUrl?: string;
}

export interface CastedSpellRecord {
  id: string;
  spellId: string;
  spellName: string;
  category: SpellCategoryId;
  date: string;
  intention: string;
  affirmation: string;
  sigil: SigilData | null;
  wallpaperId?: string;
}

export type AmbientSoundPreference = "nature" | "chimes" | "piano" | "silence";

export interface UserPreferences {
  altarTheme: AltarThemeId;
  favoriteCategories: SpellCategoryId[];
  ambientSound: AmbientSoundPreference;
  soundEnabled: boolean;
  /** @deprecated migrated to split volumes — kept for backward compat */
  soundVolume: number;
  ambienceVolume: number;
  effectsVolume: number;
  musicVolume: number;
  notificationsEnabled: boolean;
  onboardingComplete: boolean;
}

export type OnboardingMode = "full" | "theme" | "sound" | "categories" | "welcome";

export interface ActiveRitualSession {
  spellId: string;
  currentStep: number;
  intention: string;
  startedAt: string;
}
