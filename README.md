# Virtual Altar

A production-ready, mobile-first ritual and manifestation web app — cozy magical self-care in a dreamy pastel world.

## Features

- **55+ curated spells** across 14 emotional categories
- **Guided drag-and-drop rituals** with 8 reusable templates (candle, jar, tea, sigil, moon, crystal, sleep, focus)
- **Procedural sigil generation** from your intentions
- **Wallpaper export** (canvas-generated PNG downloads)
- **Casted Spells archive** — local ritual history persistence
- **Zustand + localStorage** persistence with full offline support
- **Ambient audio** (Web Audio API drones + interaction chimes)
- **5 altar themes** from onboarding
- **Mobile-first UI** with floating bottom navigation

## Tech Stack

- React 18 + TypeScript + Vite
- Tailwind CSS v4
- Motion (Framer Motion)
- React Router 7
- React DnD
- Zustand
- shadcn/ui primitives

## Quick Start

```bash
cd "Pocket Altar"
npm install
npm run dev
```

Open `http://localhost:5173`

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |

## Project Structure

```
src/
  app/
    components/   # UI, layout, ritual engine
    data/         # Spells, categories, ritual templates
    lib/          # Sigil, audio, wallpaper utilities
    screens/      # All app routes
  store/          # Zustand global state
```

## Design

Visual direction follows the Figma spec: lavender/pink/peach pastels, soft glows, floating particles, rounded cards, and meditative motion — never dark occult or horror aesthetics.
