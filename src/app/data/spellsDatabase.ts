import type { RitualType, Spell, SpellCategoryId } from "@/app/types";

const ritualByCategory: Record<SpellCategoryId, RitualType> = {
  love: "candle",
  confidence: "sigil",
  protection: "crystal",
  healing: "tea",
  sleep: "sleep",
  motivation: "candle",
  creativity: "sigil",
  focus: "focus",
  anxiety: "tea",
  productivity: "focus",
  friendship: "spell-jar",
  "self-worth": "sigil",
  "letting-go": "moon",
  luck: "spell-jar",
};

const categoryMeta: Record<
  SpellCategoryId,
  { color: string; ambient: string; tags: string[] }
> = {
  love: { color: "#f5d0d9", ambient: "soft-chimes", tags: ["tender", "romantic"] },
  confidence: { color: "#ffd8bf", ambient: "warm-glow", tags: ["empowering", "radiant"] },
  protection: { color: "#c9dac1", ambient: "shield-hum", tags: ["safe", "grounded"] },
  healing: { color: "#f5d0d9", ambient: "gentle-wind", tags: ["soothing", "restorative"] },
  sleep: { color: "#cce4f7", ambient: "night-dream", tags: ["dreamy", "calm"] },
  motivation: { color: "#ffd8bf", ambient: "sunrise", tags: ["energizing", "bold"] },
  creativity: { color: "#d4b5e8", ambient: "sparkle", tags: ["playful", "inspired"] },
  focus: { color: "#fff4cc", ambient: "study-rain", tags: ["clear", "focused"] },
  anxiety: { color: "#e8d9f5", ambient: "soft-wind", tags: ["peaceful", "gentle"] },
  productivity: { color: "#fff4cc", ambient: "fireplace", tags: ["efficient", "bright"] },
  friendship: { color: "#fff4cc", ambient: "chimes", tags: ["warm", "connected"] },
  "self-worth": { color: "#f5d0d9", ambient: "heart-chime", tags: ["loving", "affirming"] },
  "letting-go": { color: "#e8d9f5", ambient: "wind-release", tags: ["free", "light"] },
  luck: { color: "#c9dac1", ambient: "shimmer", tags: ["hopeful", "lucky"] },
};

function makeSpell(
  partial: Omit<Spell, "ritualType" | "emotionalTags" | "steps" | "wallpaperTheme" | "sigilStyle" | "ambientSound"> & {
    ritualType?: RitualType;
  }
): Spell {
  const meta = categoryMeta[partial.category];
  const ritualType =
    partial.ritualType ?? ritualByCategory[partial.category] ?? "candle";
  return {
    ...partial,
    ritualType,
    emotionalTags: meta.tags,
    steps: [
      "Prepare your sacred space with a deep breath",
      "Follow each guided interaction with intention",
      "Speak your affirmation softly",
      "Seal the ritual and carry its glow with you",
    ],
    wallpaperTheme: partial.category,
    sigilStyle: "floral-geometric",
    ambientSound: meta.ambient,
  };
}

const coreSpells: Spell[] = [
  makeSpell({ id: "lavender-heart", name: "Lavender Heart Ritual", category: "love", description: "A gentle ritual to open your heart to love and connection", duration: "10 min", mood: "Tender & Hopeful", intention: "Attract loving energy and emotional warmth", affirmation: "I am worthy of gentle, genuine love", icon: "💗", color: "#f5d0d9", ingredients: ["Rose candle", "Lavender petals", "Pink ribbon", "Heart charm"] }),
  makeSpell({ id: "honey-glow", name: "Honey Glow Confidence Ritual", category: "confidence", description: "Awaken your inner radiance and self-assurance", duration: "8 min", mood: "Empowering & Warm", intention: "Build confidence and self-worth", affirmation: "I trust myself fully and shine brightly", icon: "✨", color: "#ffd8bf", ingredients: ["Golden candle", "Honey jar", "Sunflower petals", "Mirror charm"] }),
  makeSpell({ id: "moonwater-dream", name: "Moonwater Dream Spell", category: "sleep", description: "Drift into peaceful dreams under the moon's gentle watch", duration: "12 min", mood: "Calming & Dreamy", intention: "Release the day and embrace restful sleep", affirmation: "I release all worries and welcome peaceful dreams", icon: "🌙", color: "#cce4f7", ingredients: ["Moon water", "Lavender sprigs", "Blue candle", "Star charm"] }),
  makeSpell({ id: "petal-sleep", name: "Petal Sleep Charm", category: "sleep", description: "Create a cocoon of comfort for the sweetest sleep", duration: "7 min", mood: "Soft & Soothing", intention: "Gentle transition to dreamland", affirmation: "Sleep comes easily and naturally to me", icon: "🌸", color: "#e8d9f5", ingredients: ["Chamomile", "Soft petals", "Lavender candle", "Sleep sachet"] }),
  makeSpell({ id: "golden-focus", name: "Golden Focus Tea Ritual", category: "focus", description: "Channel clarity and concentration for your studies", duration: "15 min", mood: "Clear & Focused", intention: "Enhance mental clarity and retention", affirmation: "My mind is clear and focused on what matters", icon: "📚", color: "#fff4cc", ingredients: ["Green tea", "Rosemary", "Yellow candle", "Crystal quartz"], ritualType: "tea" }),
  makeSpell({ id: "rose-thread", name: "Rose Thread Attraction Ritual", category: "love", description: "Weave connections and draw love closer", duration: "10 min", mood: "Romantic & Gentle", intention: "Attract meaningful relationships", affirmation: "Love flows easily into my life", icon: "🌹", color: "#f5d0d9", ingredients: ["Red thread", "Rose petals", "Pink candle", "Rose quartz"] }),
  makeSpell({ id: "cloud-mind", name: "Cloud Mind Calm Jar", category: "anxiety", description: "Create a sanctuary of peace for an anxious mind", duration: "12 min", mood: "Peaceful & Grounding", intention: "Release anxiety and find inner calm", affirmation: "I am safe, I am calm, I am at peace", icon: "☁️", color: "#cce4f7", ingredients: ["Glass jar", "Lavender", "White sand", "Calming herbs"], ritualType: "spell-jar" }),
  makeSpell({ id: "starpath-motivation", name: "Starlight Motivation Ritual", category: "motivation", description: "Ignite your inner fire and chase your dreams", duration: "8 min", mood: "Energizing & Inspiring", intention: "Reignite passion and drive", affirmation: "I am motivated and ready to pursue my goals", icon: "⭐", color: "#ffd8bf", ingredients: ["Orange candle", "Cinnamon", "Star anise", "Citrine"] }),
  makeSpell({ id: "mirror-bloom", name: "Mirror Bloom Self Love Ritual", category: "self-worth", description: "Reflect on and celebrate your beautiful truth", duration: "15 min", mood: "Affirming & Loving", intention: "Cultivate deep self-love and acceptance", affirmation: "I am enough exactly as I am", icon: "🪞", color: "#f5d0d9", ingredients: ["Mirror", "Flower petals", "Pink candle", "Rose water"] }),
  makeSpell({ id: "sunbeam-study", name: "Sunbeam Study Ritual", category: "focus", description: "Harness the sun's energy for learning and growth", duration: "10 min", mood: "Bright & Motivated", intention: "Absorb knowledge with ease", affirmation: "I learn easily and remember clearly", icon: "☀️", color: "#fff4cc", ingredients: ["Yellow candle", "Citrus peel", "Clear quartz", "Notebook"] }),
  makeSpell({ id: "quiet-mind", name: "Quiet Mind Candle Ritual", category: "healing", description: "Gentle ritual to soothe racing thoughts", duration: "10 min", mood: "Serene & Meditative", intention: "Find stillness within", affirmation: "My mind is quiet, my heart is light", icon: "🕯️", color: "#e8d9f5", ingredients: ["White candle", "Sage", "Lavender oil", "Smooth stone"] }),
  makeSpell({ id: "lucky-clover", name: "Lucky Clover Pocket Spell", category: "luck", description: "Carry good fortune with you wherever you go", duration: "5 min", mood: "Hopeful & Playful", intention: "Invite serendipity and opportunity", affirmation: "Luck flows to me naturally", icon: "🍀", color: "#c9dac1", ingredients: ["Clover", "Green pouch", "Small coin", "Bay leaf"], ritualType: "spell-jar" }),
  makeSpell({ id: "blooming-creativity", name: "Blooming Creativity Ritual", category: "creativity", description: "Unlock your creative potential and imagination", duration: "12 min", mood: "Playful & Inspired", intention: "Open channels of creative flow", affirmation: "My creativity flows freely and abundantly", icon: "🌺", color: "#d4b5e8", ingredients: ["Purple candle", "Artistic tools", "Flower essence", "Amethyst"] }),
  makeSpell({ id: "sweet-sleep-moon", name: "Sweet Sleep Moon Spell", category: "sleep", description: "Lunar lullaby for the deepest rest", duration: "10 min", mood: "Tranquil & Dreamy", intention: "Surrender to restorative sleep", affirmation: "I sleep deeply and wake refreshed", icon: "🌛", color: "#cce4f7", ingredients: ["Silver candle", "Moonstone", "Chamomile tea", "Soft pillow"], ritualType: "moon" }),
  makeSpell({ id: "shield-light", name: "Shield of Light Protection", category: "protection", description: "Surround yourself with protective energy", duration: "8 min", mood: "Safe & Empowered", intention: "Create a boundary of positive energy", affirmation: "I am protected and safe in all ways", icon: "🛡️", color: "#c9dac1", ingredients: ["White candle", "Salt circle", "Rosemary", "Black tourmaline"], ritualType: "crystal" }),
  makeSpell({ id: "butterfly-release", name: "Butterfly Release Ritual", category: "letting-go", description: "Let go of what no longer serves you", duration: "12 min", mood: "Liberating & Light", intention: "Release and transform", affirmation: "I release what no longer serves me with love", icon: "🦋", color: "#e8d9f5", ingredients: ["Paper", "Dried flowers", "Lavender candle", "Butterfly charm"], ritualType: "moon" }),
  makeSpell({ id: "petal-healing", name: "Petal Healing Spell", category: "healing", description: "Wrap yourself in floral restorative energy", duration: "11 min", mood: "Nurturing & Soft", intention: "Heal emotional wounds gently", affirmation: "I heal more deeply with each breath", icon: "🌸", color: "#f5d0d9", ingredients: ["Rose petals", "Healing herbs", "Pink candle", "Quartz"] }),
  makeSpell({ id: "friendship-bond", name: "Friendship Bond Jar", category: "friendship", description: "Celebrate and strengthen cherished connections", duration: "9 min", mood: "Warm & Joyful", intention: "Honor meaningful friendships", affirmation: "I attract loyal, loving friendships", icon: "🤝", color: "#fff4cc", ingredients: ["Jar", "Dried flowers", "Yellow ribbon", "Heart charm"], ritualType: "spell-jar" }),
  makeSpell({ id: "productivity-spark", name: "Productivity Spark Ritual", category: "productivity", description: "Light a focused flame for meaningful work", duration: "10 min", mood: "Efficient & Bright", intention: "Complete tasks with calm clarity", affirmation: "I accomplish my goals with ease and joy", icon: "⚡", color: "#fff4cc", ingredients: ["Gold candle", "Citrine", "Mint", "Planner charm"] }),
  makeSpell({ id: "anxiety-mist", name: "Anxiety Mist Calm Tea", category: "anxiety", description: "Sip serenity and soften anxious edges", duration: "8 min", mood: "Soothing & Safe", intention: "Ease worry and restore calm", affirmation: "Peace flows through me like gentle mist", icon: "☁️", color: "#e8d9f5", ingredients: ["Chamomile tea", "Lavender", "Blue candle", "Calm stone"], ritualType: "tea" }),
];

const generatedNames: { name: string; category: SpellCategoryId; icon: string; mood: string }[] = [
  { name: "Coral Kiss Love Spell", category: "love", icon: "💕", mood: "Sweet & Open" },
  { name: "Velvet Heart Candle", category: "love", icon: "💖", mood: "Romantic & Soft" },
  { name: "Sunrise Courage Charm", category: "confidence", icon: "🌅", mood: "Bold & Bright" },
  { name: "Golden Bloom Assurance", category: "confidence", icon: "🌻", mood: "Radiant & Sure" },
  { name: "Crystal Veil Protection", category: "protection", icon: "🔮", mood: "Strong & Calm" },
  { name: "Sage Circle Guardian", category: "protection", icon: "🌿", mood: "Grounded & Safe" },
  { name: "Rosewater Healing Bath", category: "healing", icon: "🛁", mood: "Restorative & Soft" },
  { name: "Mint Breeze Recovery", category: "healing", icon: "🍃", mood: "Fresh & Renewing" },
  { name: "Dreamcatcher Slumber", category: "sleep", icon: "🪶", mood: "Deep & Gentle" },
  { name: "Starlit Pillow Spell", category: "sleep", icon: "✨", mood: "Cozy & Dreamy" },
  { name: "Flameheart Drive Spell", category: "motivation", icon: "🔥", mood: "Passionate & Bold" },
  { name: "Dawn Walker Motivation", category: "motivation", icon: "🌄", mood: "Fresh & Driven" },
  { name: "Paintbrush Star Sigil", category: "creativity", icon: "🖌️", mood: "Inspired & Free" },
  { name: "Iris Imagination Ritual", category: "creativity", icon: "🎭", mood: "Whimsical & Bright" },
  { name: "Library Lantern Focus", category: "focus", icon: "🏮", mood: "Studious & Clear" },
  { name: "Quill & Crystal Study", category: "focus", icon: "📝", mood: "Sharp & Calm" },
  { name: "Breath of Stillness", category: "anxiety", icon: "🫧", mood: "Quiet & Safe" },
  { name: "Lilac Calm Waters", category: "anxiety", icon: "💜", mood: "Peaceful & Soft" },
  { name: "Task Fairy Productivity", category: "productivity", icon: "🧚", mood: "Playful & Efficient" },
  { name: "Honeybee Work Charm", category: "productivity", icon: "🐝", mood: "Busy & Joyful" },
  { name: "Tea Party Connection", category: "friendship", icon: "🫖", mood: "Cheerful & Warm" },
  { name: "Linked Hearts Spell", category: "friendship", icon: "💞", mood: "Loyal & Bright" },
  { name: "Inner Crown Self Worth", category: "self-worth", icon: "👑", mood: "Regal & Loving" },
  { name: "Gentle Mirror Affirmation", category: "self-worth", icon: "✨", mood: "Tender & True" },
  { name: "Feather Float Release", category: "letting-go", icon: "🪶", mood: "Light & Free" },
  { name: "River Stone Letting Go", category: "letting-go", icon: "🪨", mood: "Grounded & Released" },
  { name: "Four Leaf Fortune", category: "luck", icon: "🍀", mood: "Lucky & Light" },
  { name: "Coin & Star Luck Spell", category: "luck", icon: "⭐", mood: "Hopeful & Magical" },
  { name: "Silk Ribbon Love Bind", category: "love", icon: "🎀", mood: "Tender & Devoted" },
  { name: "Moonlit Confidence Bath", category: "confidence", icon: "🌙", mood: "Mystical & Strong" },
  { name: "Ember Shield Ritual", category: "protection", icon: "🕯️", mood: "Warm & Protected" },
  { name: "Chamomile Comfort Cup", category: "healing", icon: "🍵", mood: "Cozy & Healing" },
  { name: "Cloud Pillow Dream Spell", category: "sleep", icon: "☁️", mood: "Fluffy & Restful" },
  { name: "Phoenix Rise Motivation", category: "motivation", icon: "🦋", mood: "Transformative & Bold" },
  { name: "Watercolor Wish Sigil", category: "creativity", icon: "🎨", mood: "Colorful & Free" },
  { name: "Scholar's Moon Focus", category: "focus", icon: "📖", mood: "Wise & Steady" },
  { name: "Still Pond Anxiety Relief", category: "anxiety", icon: "🌊", mood: "Still & Deep" },
  { name: "Clockwork Calm Productivity", category: "productivity", icon: "⏰", mood: "Steady & Clear" },
  { name: "Dewdrop Love Whisper", category: "love", icon: "💧", mood: "Delicate & Open" },
  { name: "Crown of Courage", category: "confidence", icon: "👑", mood: "Noble & Bright" },
  { name: "Forest Shield Spell", category: "protection", icon: "🌲", mood: "Earthy & Safe" },
  { name: "Warm Hearth Healing", category: "healing", icon: "🔥", mood: "Cozy & Restored" },
  { name: "Midnight Lullaby", category: "sleep", icon: "🎵", mood: "Musical & Soft" },
  { name: "Spark Trail Motivation", category: "motivation", icon: "✨", mood: "Electric & Joyful" },
  { name: "Canvas Star Creativity", category: "creativity", icon: "🌟", mood: "Starry & Free" },
];

const generatedSpells: Spell[] = generatedNames.map((g, i) => {
  const meta = categoryMeta[g.category];
  const slug = g.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return makeSpell({
    id: slug || `spell-${i}`,
    name: g.name,
    category: g.category,
    description: `A dreamy ${g.category.replace("-", " ")} ritual for gentle manifestation`,
    duration: `${5 + (i % 8)} min`,
    mood: g.mood,
    intention: `Invite ${g.category.replace("-", " ")} energy into your life`,
    affirmation: `I welcome ${g.category.replace("-", " ")} with an open heart`,
    icon: g.icon,
    color: meta.color,
    ingredients: ["Candle", "Petals", "Charm", "Ribbon"],
  });
});

export const spells: Spell[] = [...coreSpells, ...generatedSpells];

export function getSpellById(id: string): Spell | undefined {
  return spells.find((s) => s.id === id);
}

export function getSpellsByCategory(category: SpellCategoryId): Spell[] {
  return spells.filter((s) => s.category === category);
}

export function getRecommendedSpells(count = 4): Spell[] {
  const day = new Date().getDate();
  const shuffled = [...spells].sort((a, b) => {
    const ha = (a.id.charCodeAt(0) + day) % spells.length;
    const hb = (b.id.charCodeAt(0) + day) % spells.length;
    return ha - hb;
  });
  return shuffled.slice(0, count);
}
