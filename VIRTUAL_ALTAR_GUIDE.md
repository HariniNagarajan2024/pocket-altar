# Virtual Altar - Magical Ritual App

A cozy, dreamy mobile-first ritual app for self-care and manifestation.

## Features

### Core Screens

1. **Splash Screen** - Magical welcome with floating particles
2. **Onboarding** - Choose your altar aesthetic theme
3. **Homepage** - Browse spells by category with daily suggestions
4. **Spell Detail** - View ritual information and affirmations
5. **Interactive Ritual Mode** - Drag & drop ritual items to altar
6. **Sigil Generation** - Create personalized magical symbols
7. **Spell Completion** - Celebrate completed rituals with confetti
8. **Casted Spells Archive** - Browse your ritual history
9. **Profile** - View stats, achievements, and recent activity
10. **Daily Rituals** - Curated suggestions for each day
11. **Settings** - Customize theme and preferences

### Design System

**Colors:**
- Lavender (#d4b5e8)
- Dusty Pink (#f5d0d9)
- Peach Cream (#ffd8bf)
- Sage Green (#c9dac1)
- Pale Blue (#cce4f7)
- Butter Yellow (#fff4cc)

**Aesthetic:**
- Soft, pastel magical girl vibes
- Cozy witchcore atmosphere
- Dreamy gradients and soft glows
- Rounded, playful interfaces
- Floating particle effects
- Gentle animations

### Spell Categories

- Love
- Self Confidence
- Protection
- Sleep
- Creativity
- Motivation
- Healing
- Friendship
- Study Focus
- Good Luck
- Letting Go
- Productivity

### Interactive Features

- **Drag & Drop Rituals** - Place candles, petals, and charms on your altar
- **Intention Writing** - Type your personal intentions
- **Sigil Creation** - Generate unique magical symbols
- **Color Customization** - Choose from 6 pastel palettes
- **Wallpaper Downloads** - Save completed rituals
- **Archive System** - Track all completed spells

## Tech Stack

- React 18
- React Router (Data Mode)
- Motion (Framer Motion)
- React DnD (Drag & Drop)
- Tailwind CSS v4
- Lucide React (Icons)
- Canvas Confetti

## Navigation Flow

```
Splash (3s) → Onboarding → Homepage
                              ├─→ Spell Detail → Ritual Mode → Sigil → Completion
                              ├─→ Daily Rituals
                              ├─→ Archive
                              ├─→ Profile
                              └─→ Settings
```

## Key Components

- `FloatingParticles` - Ambient magical particles
- `MagicalButton` - Glowing animated buttons
- Various spell and ritual components

## Local Storage

The app uses localStorage to persist:
- `altarTheme` - Selected altar aesthetic
- `currentIntention` - User's ritual intention
- `completedSigil` - Generated sigil data
- `castedSpells` - Array of completed rituals

## Design Philosophy

The app is intentionally:
- NOT dark/gothic/horror themed
- Emotionally soothing and safe
- Slow-paced and meditative
- Focused on self-care over gameplay
- Visually soft and breathable
- Mobile-first responsive

## Future Enhancements

- Real wallpaper generation/download
- Sound effects for interactions
- More spell varieties
- User customization options
- Export ritual journal
- Social sharing features
