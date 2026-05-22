export type { Spell, SpellCategoryId, RitualType } from "@/app/types";
export { spells, getSpellById, getSpellsByCategory, getRecommendedSpells } from "./spellsDatabase";
export { spellCategories, getDailyAffirmation, getMoonPhase } from "./spellCategories";
