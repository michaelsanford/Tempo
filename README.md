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

---

## Developing

```sh
npm install
npm run dev
```

## Testing & Linting

```sh
npm test          # Run unit tests with Vitest
npm run check     # Type-check with svelte-check
npm run lint      # Code formatting & linting with Prettier & ESLint
npm run build     # Production static build
```
