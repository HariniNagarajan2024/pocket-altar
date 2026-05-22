import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  ActiveRitualSession,
  AltarThemeId,
  CastedSpellRecord,
  SigilData,
  SpellCategoryId,
  UserPreferences,
  WallpaperData,
} from "@/app/types";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { audioManager, preferencesToSoundSettings } from "@/app/lib/audioManager";

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  isGuest: boolean;
}

interface AppState {
  user: AuthUser | null;
  authLoading: boolean;
  preferences: UserPreferences;
  castedSpells: CastedSpellRecord[];
  savedSigils: SigilData[];
  wallpapers: WallpaperData[];
  favoriteSpellIds: string[];
  activeSession: ActiveRitualSession | null;
  currentSpellId: string | null;
  currentIntention: string;
  pendingSigil: SigilData | null;

  setUser: (user: AuthUser | null) => void;
  setAuthLoading: (loading: boolean) => void;
  setPreferences: (prefs: Partial<UserPreferences>) => void;
  updateTheme: (theme: AltarThemeId) => void;
  updateSoundPreferences: (prefs: Partial<Pick<UserPreferences, "soundEnabled" | "ambienceVolume" | "effectsVolume" | "musicVolume" | "ambientSound">>) => void;
  updateRitualPreferences: (favoriteCategories: SpellCategoryId[]) => void;
  completeOnboarding: (prefs: Partial<UserPreferences>) => void;
  addCastedSpell: (record: Omit<CastedSpellRecord, "id">) => void;
  saveSigil: (sigil: SigilData) => void;
  addWallpaper: (wallpaper: WallpaperData) => void;
  toggleFavoriteSpell: (spellId: string) => void;
  setActiveSession: (session: ActiveRitualSession | null) => void;
  setCurrentSpellId: (id: string | null) => void;
  setCurrentIntention: (intention: string) => void;
  setPendingSigil: (sigil: SigilData | null) => void;
  hydrateFromCloud: () => Promise<void>;
  syncToCloud: () => Promise<void>;
  resetGuestData: () => void;
}

export const defaultPreferences: UserPreferences = {
  altarTheme: "lavender-dream",
  favoriteCategories: [],
  ambientSound: "chimes",
  soundEnabled: true,
  soundVolume: 0.6,
  ambienceVolume: 0.52,
  effectsVolume: 0.42,
  musicVolume: 0.28,
  notificationsEnabled: true,
  onboardingComplete: false,
};

function migratePreferences(raw: Partial<UserPreferences> | undefined): UserPreferences {
  const p = { ...defaultPreferences, ...raw };
  const legacy = p.soundVolume ?? 0.6;
  return {
    ...p,
    ambienceVolume: p.ambienceVolume ?? Math.min(0.65, legacy * 0.85 + 0.12),
    effectsVolume: p.effectsVolume ?? Math.min(0.55, legacy * 0.75 + 0.1),
    musicVolume: p.musicVolume ?? Math.min(0.4, legacy * 0.45 + 0.08),
    notificationsEnabled: p.notificationsEnabled ?? true,
  };
}

function syncAudioFromPrefs(prefs: UserPreferences) {
  audioManager.applySettings(preferencesToSoundSettings(prefs));
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      authLoading: true,
      preferences: defaultPreferences,
      castedSpells: [],
      savedSigils: [],
      wallpapers: [],
      favoriteSpellIds: [],
      activeSession: null,
      currentSpellId: null,
      currentIntention: "",
      pendingSigil: null,

      setUser: (user) => set({ user }),
      setAuthLoading: (authLoading) => set({ authLoading }),

      setPreferences: (prefs) => {
        set((s) => {
          const next = migratePreferences({ ...s.preferences, ...prefs });
          syncAudioFromPrefs(next);
          return { preferences: next };
        });
        get().syncToCloud();
      },

      updateTheme: (altarTheme) => {
        set((s) => ({
          preferences: { ...s.preferences, altarTheme },
        }));
        get().syncToCloud();
      },

      updateSoundPreferences: (prefs) => {
        set((s) => {
          const next = migratePreferences({ ...s.preferences, ...prefs });
          syncAudioFromPrefs(next);
          return { preferences: next };
        });
        get().syncToCloud();
      },

      updateRitualPreferences: (favoriteCategories) => {
        set((s) => ({
          preferences: { ...s.preferences, favoriteCategories },
        }));
        get().syncToCloud();
      },

      completeOnboarding: (prefs) => {
        set((s) => {
          const next = migratePreferences({
            ...s.preferences,
            ...prefs,
            onboardingComplete: true,
          });
          syncAudioFromPrefs(next);
          return { preferences: next };
        });
        get().syncToCloud();
      },

      addCastedSpell: (record) => {
        const entry: CastedSpellRecord = {
          ...record,
          id: crypto.randomUUID(),
        };
        set((s) => ({ castedSpells: [entry, ...s.castedSpells] }));
        get().syncToCloud();
      },

      saveSigil: (sigil) =>
        set((s) => ({
          savedSigils: [sigil, ...s.savedSigils].slice(0, 50),
        })),

      addWallpaper: (wallpaper) =>
        set((s) => ({
          wallpapers: [wallpaper, ...s.wallpapers].slice(0, 30),
        })),

      toggleFavoriteSpell: (spellId) =>
        set((s) => ({
          favoriteSpellIds: s.favoriteSpellIds.includes(spellId)
            ? s.favoriteSpellIds.filter((id) => id !== spellId)
            : [...s.favoriteSpellIds, spellId],
        })),

      setActiveSession: (activeSession) => set({ activeSession }),
      setCurrentSpellId: (currentSpellId) => set({ currentSpellId }),
      setCurrentIntention: (currentIntention) => set({ currentIntention }),
      setPendingSigil: (pendingSigil) => set({ pendingSigil }),

      hydrateFromCloud: async () => {
        const supabase = getSupabase();
        const { user } = get();
        if (!supabase || !user || user.isGuest) return;

        const { data } = await supabase
          .from("user_data")
          .select("payload")
          .eq("user_id", user.id)
          .maybeSingle();

        if (data?.payload) {
          const p = data.payload as Partial<AppState>;
          const preferences = migratePreferences(p.preferences);
          syncAudioFromPrefs(preferences);
          set({
            preferences,
            castedSpells: p.castedSpells ?? [],
            savedSigils: p.savedSigils ?? [],
            wallpapers: p.wallpapers ?? [],
            favoriteSpellIds: p.favoriteSpellIds ?? [],
          });
        }
      },

      syncToCloud: async () => {
        const supabase = getSupabase();
        const { user, preferences, castedSpells, savedSigils, wallpapers, favoriteSpellIds } =
          get();
        if (!supabase || !user || user.isGuest) return;

        await supabase.from("user_data").upsert(
          {
            user_id: user.id,
            payload: {
              preferences,
              castedSpells,
              savedSigils,
              wallpapers,
              favoriteSpellIds,
            },
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );
      },

      resetGuestData: () =>
        set({
          castedSpells: [],
          savedSigils: [],
          wallpapers: [],
          favoriteSpellIds: [],
          activeSession: null,
          currentSpellId: null,
          currentIntention: "",
          pendingSigil: null,
        }),
    }),
    {
      name: "virtual-altar-storage",
      version: 2,
      migrate: (persisted: unknown, version: number) => {
        const state = persisted as { preferences?: Partial<UserPreferences> };
        if (version < 2 && state?.preferences) {
          state.preferences = migratePreferences(state.preferences);
        }
        return persisted as AppState;
      },
      onRehydrateStorage: () => () => {
        const state = useAppStore.getState();
        syncAudioFromPrefs(migratePreferences(state.preferences));
        state.setAuthLoading(false);
      },
      partialize: (state) => ({
        user: state.user,
        preferences: state.preferences,
        castedSpells: state.castedSpells,
        savedSigils: state.savedSigils,
        wallpapers: state.wallpapers,
        favoriteSpellIds: state.favoriteSpellIds,
        activeSession: state.activeSession,
      }),
    }
  )
);

export function computeStreak(dates: string[]): number {
  if (dates.length === 0) return 0;
  const uniqueDays = [
    ...new Set(dates.map((d) => new Date(d).toDateString())),
  ].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < uniqueDays.length; i++) {
    const day = new Date(uniqueDays[i]);
    day.setHours(0, 0, 0, 0);
    const expected = new Date(today);
    expected.setDate(expected.getDate() - i);
    if (day.getTime() === expected.getTime()) streak++;
    else break;
  }
  return streak;
}

export function getFavoriteCategory(
  records: CastedSpellRecord[]
): SpellCategoryId | null {
  if (records.length === 0) return null;
  const counts: Partial<Record<SpellCategoryId, number>> = {};
  records.forEach((r) => {
    counts[r.category] = (counts[r.category] ?? 0) + 1;
  });
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return (sorted[0]?.[0] as SpellCategoryId) ?? null;
}

export const altarThemes: Record<
  AltarThemeId,
  { name: string; gradient: string; accent: string; icon: string }
> = {
  "lavender-dream": {
    name: "Lavender Dream",
    gradient: "from-[#e8d9f5] via-[#d4b5e8] to-[#f5d0d9]",
    accent: "#d4b5e8",
    icon: "💜",
  },
  "moon-garden": {
    name: "Moon Garden",
    gradient: "from-[#e8f4fc] via-[#cce4f7] to-[#e8d9f5]",
    accent: "#cce4f7",
    icon: "🌙",
  },
  "peach-sanctuary": {
    name: "Peach Sanctuary",
    gradient: "from-[#fff4e8] via-[#ffd8bf] to-[#f5d0d9]",
    accent: "#ffd8bf",
    icon: "🍑",
  },
  "rose-glow": {
    name: "Rose Glow",
    gradient: "from-[#fce8f0] via-[#f5d0d9] to-[#e8d9f5]",
    accent: "#f5d0d9",
    icon: "🌹",
  },
  "starlight-study": {
    name: "Starlight Study",
    gradient: "from-[#fff8e8] via-[#fff4cc] to-[#cce4f7]",
    accent: "#fff4cc",
    icon: "⭐",
  },
};
