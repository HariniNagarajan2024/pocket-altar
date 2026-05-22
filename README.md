# Virtual Altar

A production-ready, mobile-first ritual and manifestation web app — cozy magical self-care in a dreamy pastel world.

## Features

- **55+ curated spells** across 14 emotional categories
- **Guided drag-and-drop rituals** with 8 reusable templates (candle, jar, tea, sigil, moon, crystal, sleep, focus)
- **Procedural sigil generation** from your intentions
- **Wallpaper export** (canvas-generated PNG downloads)
- **Casted Spells archive** — only real user ritual history
- **Supabase auth** (sign up, login, password reset, guest mode)
- **Zustand + localStorage** persistence with optional cloud sync
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
- Supabase
- shadcn/ui primitives

## Quick Start

```bash
cd "Pocket Altar"
npm install
npm run dev
```

Open `http://localhost:5173`

## Supabase Setup (optional)

1. Create a project at [supabase.com](https://supabase.com)
2. Copy `.env.example` to `.env` and add your keys
3. Run `supabase/schema.sql` in the SQL editor
4. Enable Email auth in Supabase dashboard

Without Supabase, the app runs in **guest mode** with full local persistence.

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
    services/     # Auth
  store/          # Zustand global state
  lib/            # Supabase client
```

## Design

Visual direction follows the Figma spec: lavender/pink/peach pastels, soft glows, floating particles, rounded cards, and meditative motion — never dark occult or horror aesthetics.
