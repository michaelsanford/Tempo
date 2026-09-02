# Tempo — Time-Telling Learning App for Kids

A playful, interactive, Montessori-inspired time-telling learning web application and PWA designed specifically for young children (pre-readers and preschoolers).

---

## Features

- **🌙 Dark Mode by Default**: High-contrast, easy-on-the-eyes cosmic midnight palette (`#0c1222` / `#1e293b`) with vibrant kid-friendly neon accents (Sky Blue, Amber Gold, Mint Emerald, Coral Rose, Lavender).
- **🎨 Custom Vector Icon System**: Replaces generic emojis with purpose-built, accessible, scalable SVG illustrations and iconography.
- **🕒 Montessori-Style Analog Clock**: Clearly shows hour numbers (1 to 12) with distinct colors for the hour hand (Sky Blue) and minute hand (Sunny Amber).
- **🎮 Interactive Game Modes**:
  - **Read the Clock**: Match analog clocks with digital readouts and audio pronunciation.
  - **Match the Clock**: Match digital time prompts to the correct analog clock face.
  - **Set the Clock**: Drag hands directly to target times with tactile physics and keyboard/switch navigation.
  - **How Long Until?**: Visual duration wedges illustrating elapsed time.
  - **Explore Clock**: Interactive free-play dial with spoken time narration and "Current Time" jump.
  - **Leave By / Routines**: Visual countdown rings and routine timers.
- **⭐ Gamified Progress & Rewards**: Streaks, star bursts with celebratory particle explosions, and collectible badges.
- **🌐 Bilingual & Multilingual Support**: English (Canada 🇨🇦), Français (Québec ⚜️), and Français (France 🇫🇷) with natural speech synthesis and flag selectors.
- **🔒 Parent Gate**: Press-and-hold protected parent settings for difficulty adjustments, speech narration toggles, theme preferences, and routine management.
- **📱 Installable Full-Screen PWA**: Add to Home Screen on iOS and Android for a distraction-free, full-screen offline learning experience with step-by-step install guidance in Settings.

---

## Developing

```sh
npm install
npm run dev
```

## Testing & Linting

```sh
npm test                    # Run unit tests with Vitest
npm run check               # Type-check with svelte-check
npm run lint                # Code formatting & linting with Prettier & ESLint
npm run build               # Production static build
npm run generate-icons      # Generate PWA app icons
npm run generate-social-images # Generate Open Graph & GitHub social preview images
```

## Full-screen behaviour

The installed app runs genuinely full-screen on Android, hiding the system status and
navigation bars. This is done in two layers, both of which apply **only to the installed
app** — opening Tempo in a normal browser tab never takes over the screen:

1. The web manifest lists `display_override: ["fullscreen", "standalone", "minimal-ui"]`
   (see `vite.config.ts`), so Chrome and Edge launch the installed app full-screen with no
   interaction needed. Order matters here: the browser picks the _first_ mode it supports,
   so `fullscreen` has to precede `standalone`.
2. `initFullscreenOnGesture()` in `src/lib/stores/pwaInstallStore.ts` requests the
   Fullscreen API on the first tap, as a fallback for browsers that ignore
   `display_override`. It is gated on the app running as an installed PWA, and re-arms if
   the user leaves full-screen via the Android back gesture.

On iOS neither layer applies — Safari ignores `display_override` and does not expose the
Fullscreen API for non-video elements — so `display: standalone` plus the
`apple-mobile-web-app-capable` meta tag in `src/app.html` remains the ceiling there.
