import type { RitualStep, RitualTemplate, RitualType } from "@/app/types";

const candleSteps: RitualStep[] = [
  { id: "c1", instruction: "Place the candle in the center of your altar", itemType: "candle", icon: "🕯️", action: "drag" },
  { id: "c2", instruction: "Scatter petals around the gentle flame", itemType: "petals", icon: "🌸", action: "drag" },
  { id: "c3", instruction: "Write your intention with care", itemType: "intention", icon: "✨", action: "type" },
  { id: "c4", instruction: "Seal your ritual with a ribbon of light", itemType: "ribbon", icon: "🎀", action: "seal" },
];

const jarSteps: RitualStep[] = [
  { id: "j1", instruction: "Place your spell jar on the altar", itemType: "jar", icon: "🫙", action: "drag" },
  { id: "j2", instruction: "Pour moon water into the jar", itemType: "water", icon: "💧", action: "drag" },
  { id: "j3", instruction: "Add herbs and petals of intention", itemType: "herbs", icon: "🌿", action: "drag" },
  { id: "j4", instruction: "Seal the jar with your wish", itemType: "seal", icon: "✨", action: "seal" },
];

const teaSteps: RitualStep[] = [
  { id: "t1", instruction: "Set your teacup on the altar", itemType: "cup", icon: "🍵", action: "drag" },
  { id: "t2", instruction: "Add calming herbs to the blend", itemType: "herbs", icon: "🌿", action: "drag" },
  { id: "t3", instruction: "Pour warm intention into the cup", itemType: "pour", icon: "💧", action: "drag" },
  { id: "t4", instruction: "Whisper your affirmation over the steam", itemType: "intention", icon: "✨", action: "type" },
];

const sigilSteps: RitualStep[] = [
  { id: "s1", instruction: "Light a candle for focus", itemType: "candle", icon: "🕯️", action: "drag" },
  { id: "s2", instruction: "Trace your intention in the air", itemType: "trace", icon: "✍️", action: "trace" },
  { id: "s3", instruction: "Write the words that call your magic", itemType: "intention", icon: "📜", action: "type" },
  { id: "s4", instruction: "Seal the sigil with starlight", itemType: "seal", icon: "⭐", action: "seal" },
];

const moonSteps: RitualStep[] = [
  { id: "m1", instruction: "Place moon water at the altar center", itemType: "water", icon: "🌙", action: "drag" },
  { id: "m2", instruction: "Arrange crystals beneath the moon glow", itemType: "crystal", icon: "💎", action: "drag" },
  { id: "m3", instruction: "Scatter silver petals like starlight", itemType: "petals", icon: "🌸", action: "drag" },
  { id: "m4", instruction: "Release your dream intention", itemType: "intention", icon: "✨", action: "type" },
];

const crystalSteps: RitualStep[] = [
  { id: "cr1", instruction: "Place your crystal heart on the altar", itemType: "crystal", icon: "💎", action: "drag" },
  { id: "cr2", instruction: "Circle it with protective petals", itemType: "petals", icon: "🌸", action: "drag" },
  { id: "cr3", instruction: "Light a candle of clarity", itemType: "candle", icon: "🕯️", action: "drag" },
  { id: "cr4", instruction: "Speak your healing intention", itemType: "intention", icon: "✨", action: "type" },
];

const sleepSteps: RitualStep[] = [
  { id: "sl1", instruction: "Place a sleepy moon charm nearby", itemType: "charm", icon: "🌙", action: "drag" },
  { id: "sl2", instruction: "Add lavender for gentle dreams", itemType: "lavender", icon: "💜", action: "drag" },
  { id: "sl3", instruction: "Dim the candle to a soft glow", itemType: "candle", icon: "🕯️", action: "drag" },
  { id: "sl4", instruction: "Whisper your restful intention", itemType: "intention", icon: "☁️", action: "type" },
];

const focusSteps: RitualStep[] = [
  { id: "f1", instruction: "Set your study candle on the altar", itemType: "candle", icon: "🕯️", action: "drag" },
  { id: "f2", instruction: "Place a crystal of clarity beside it", itemType: "crystal", icon: "💎", action: "drag" },
  { id: "f3", instruction: "Add rosemary for sharp focus", itemType: "herbs", icon: "🌿", action: "drag" },
  { id: "f4", instruction: "Write your focus intention", itemType: "intention", icon: "📚", action: "type" },
];

export const ritualTemplates: Record<RitualType, RitualTemplate> = {
  candle: { type: "candle", name: "Candle Ritual", steps: candleSteps },
  "spell-jar": { type: "spell-jar", name: "Spell Jar Ritual", steps: jarSteps },
  tea: { type: "tea", name: "Tea Ritual", steps: teaSteps },
  sigil: { type: "sigil", name: "Sigil Ritual", steps: sigilSteps },
  moon: { type: "moon", name: "Moon Ritual", steps: moonSteps },
  crystal: { type: "crystal", name: "Crystal Ritual", steps: crystalSteps },
  sleep: { type: "sleep", name: "Sleep Ritual", steps: sleepSteps },
  focus: { type: "focus", name: "Focus Ritual", steps: focusSteps },
};

export function getRitualSteps(type: RitualType): RitualStep[] {
  return ritualTemplates[type]?.steps ?? candleSteps;
}
