import type { SigilData, WallpaperData } from "@/app/types";

export async function generateWallpaperImage(options: {
  spellName: string;
  affirmation: string;
  sigil: SigilData;
  themeColor: string;
  spellId: string;
}): Promise<WallpaperData> {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;

  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, lighten(options.themeColor, 40));
  gradient.addColorStop(0.5, options.themeColor + "88");
  gradient.addColorStop(1, lighten(options.themeColor, 60));
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 40; i++) {
    ctx.beginPath();
    ctx.arc(
      Math.random() * canvas.width,
      Math.random() * canvas.height,
      Math.random() * 4 + 1,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.5 + 0.2})`;
    ctx.fill();
  }

  ctx.strokeStyle = options.themeColor;
  ctx.lineWidth = 8;
  roundRect(ctx, 60, 60, canvas.width - 120, canvas.height - 120, 48);
  ctx.stroke();

  const sigilSize = 400;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${sigilSize}" height="${sigilSize}">
      <path d="${options.sigil.path}" fill="none" stroke="${options.sigil.color}" stroke-width="2" stroke-linecap="round"/>
    </svg>`;
  const img = await svgToImage(svg, sigilSize);
  ctx.drawImage(img, (canvas.width - sigilSize) / 2, 500);

  ctx.fillStyle = "#4a4458";
  ctx.font = "bold 56px Georgia, serif";
  ctx.textAlign = "center";
  wrapText(ctx, options.spellName, canvas.width / 2, 200, canvas.width - 160, 64);

  ctx.font = "italic 36px Georgia, serif";
  ctx.fillStyle = "#6a5d7e";
  wrapText(ctx, `"${options.affirmation}"`, canvas.width / 2, 1100, canvas.width - 160, 44);

  ctx.font = "24px system-ui, sans-serif";
  ctx.fillStyle = "#8a7d9e";
  ctx.fillText("Virtual Altar", canvas.width / 2, canvas.height - 120);

  const dataUrl = canvas.toDataURL("image/png");

  return {
    id: crypto.randomUUID(),
    spellId: options.spellId,
    spellName: options.spellName,
    affirmation: options.affirmation,
    sigil: options.sigil,
    themeColor: options.themeColor,
    createdAt: new Date().toISOString(),
    dataUrl,
  };
}

function lighten(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, ((num >> 16) & 0xff) + percent);
  const g = Math.min(255, ((num >> 8) & 0xff) + percent);
  const b = Math.min(255, (num & 0xff) + percent);
  return `rgb(${r},${g},${b})`;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(" ");
  let line = "";
  let yy = y;
  for (const word of words) {
    const test = line + word + " ";
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, yy);
      line = word + " ";
      yy += lineHeight;
    } else {
      line = test;
    }
  }
  ctx.fillText(line, x, yy);
}

function svgToImage(svg: string, size: number): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svg)));
    img.width = size;
    img.height = size;
  });
}

export function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  link.click();
}
