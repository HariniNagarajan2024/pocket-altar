import type { SigilData } from "@/app/types";

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function seededRandom(seed: number) {
  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

const PETAL = "M 50 8 Q 72 28 68 52 Q 50 72 32 52 Q 28 28 50 8";
const CIRCLE = "M 50 15 A 35 35 0 1 1 49.9 15";
const STAR =
  "M 50 12 L 58 38 L 86 38 L 64 54 L 72 82 L 50 66 L 28 82 L 36 54 L 14 38 L 42 38 Z";

export function generateSigil(
  intention: string,
  color: string,
  seedOffset = 0
): SigilData {
  const seed = `${intention}-${seedOffset}`;
  const hash = hashString(seed);
  const rand = seededRandom(hash);

  const cx = 50;
  const cy = 50;
  const rays = 5 + Math.floor(rand() * 4);
  const parts: string[] = [];

  parts.push(STAR);
  parts.push(CIRCLE);

  for (let i = 0; i < rays; i++) {
    const angle = (i / rays) * Math.PI * 2 + rand() * 0.4;
    const len = 18 + rand() * 22;
    const x2 = cx + Math.cos(angle) * len;
    const y2 = cy + Math.sin(angle) * len;
    const cpX = cx + Math.cos(angle + 0.3) * (len * 0.5);
    const cpY = cy + Math.sin(angle + 0.3) * (len * 0.5);
    parts.push(`M ${cx} ${cy} Q ${cpX.toFixed(1)} ${cpY.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`);
  }

  if (rand() > 0.4) parts.push(PETAL);

  const innerR = 8 + rand() * 6;
  parts.push(
    `M ${cx} ${cy - innerR} A ${innerR} ${innerR} 0 1 1 ${cx - 0.1} ${cy - innerR}`
  );

  return {
    path: parts.join(" "),
    color,
    seed,
    intention,
  };
}

export const sigilPalette = [
  { name: "Lavender Dream", color: "#d4b5e8" },
  { name: "Rose Glow", color: "#f5d0d9" },
  { name: "Peach Warmth", color: "#ffd8bf" },
  { name: "Sage Calm", color: "#c9dac1" },
  { name: "Sky Serenity", color: "#cce4f7" },
  { name: "Golden Light", color: "#f5e6d3" },
];
