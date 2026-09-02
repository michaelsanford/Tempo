import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const staticDir = path.join(root, 'static');
const githubDir = path.join(root, '.github');

await mkdir(staticDir, { recursive: true });
await mkdir(githubDir, { recursive: true });

function createSvg(width, height) {
	const is1280 = width === 1280;

	// Layout coordinates
	const leftX = is1280 ? 76 : 64;
	const clockCenterX = is1280 ? 980 : 920;
	const clockCenterY = Math.round(height / 2);
	const clockRadius = is1280 ? 185 : 175;

	// Hand angles for 10:10 (friendly clock face)
	// Hour hand: 10 + 10/60 = 10.1667 -> 305 deg
	const hourAngle = 305;
	const hourRad = (hourAngle - 90) * (Math.PI / 180);
	const hourLen = clockRadius * 0.52;
	const hx = clockCenterX + hourLen * Math.cos(hourRad);
	const hy = clockCenterY + hourLen * Math.sin(hourRad);

	// Minute hand: 10 mins -> 60 deg
	const minAngle = 60;
	const minRad = (minAngle - 90) * (Math.PI / 180);
	const minLen = clockRadius * 0.76;
	const mx = clockCenterX + minLen * Math.cos(minRad);
	const my = clockCenterY + minLen * Math.sin(minRad);

	// 60 minute ticks & 12 hour ticks
	const ticksSvg = [];
	for (let i = 0; i < 60; i++) {
		const isHour = i % 5 === 0;
		const isMajor = i % 15 === 0;
		const rad = (i * 6 - 90) * (Math.PI / 180);
		const r1 = clockRadius * (isMajor ? 0.86 : isHour ? 0.88 : 0.92);
		const r2 = clockRadius * 0.94;
		const x1 = clockCenterX + r1 * Math.cos(rad);
		const y1 = clockCenterY + r1 * Math.sin(rad);
		const x2 = clockCenterX + r2 * Math.cos(rad);
		const y2 = clockCenterY + r2 * Math.sin(rad);

		const strokeColor = isMajor ? '#38bdf8' : isHour ? '#60a5fa' : '#334155';
		const strokeW = isMajor ? 3.5 : isHour ? 2.2 : 1.2;
		ticksSvg.push(
			`<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${strokeColor}" stroke-width="${strokeW}" stroke-linecap="round"/>`
		);
	}

	// Hour numerals (1-12)
	const numerals = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
	const numRadius = clockRadius * 0.73;
	const numeralSvg = numerals
		.map((num, i) => {
			const rad = (i * 30 - 90) * (Math.PI / 180);
			const nx = clockCenterX + numRadius * Math.cos(rad);
			const ny = clockCenterY + numRadius * Math.sin(rad);
			return `<text x="${nx.toFixed(1)}" y="${(ny + 7).toFixed(1)}" text-anchor="middle" dominant-baseline="central" fill="#f8fafc" font-family="'Segoe UI', -apple-system, Roboto, Helvetica, Arial, sans-serif" font-size="${is1280 ? 21 : 19}" font-weight="800">${num}</text>`;
		})
		.join('\n    ');

	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#060a14"/>
      <stop offset="45%" stop-color="#0c1222"/>
      <stop offset="100%" stop-color="#141f38"/>
    </linearGradient>

    <!-- Glow Gradients -->
    <radialGradient id="cyanGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.28"/>
      <stop offset="60%" stop-color="#38bdf8" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="#38bdf8" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="amberGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fbbf24" stop-opacity="0.25"/>
      <stop offset="60%" stop-color="#fbbf24" stop-opacity="0.06"/>
      <stop offset="100%" stop-color="#fbbf24" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="purpleGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#818cf8" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#818cf8" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="emeraldGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#34d399" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#34d399" stop-opacity="0"/>
    </radialGradient>

    <!-- Card Background Gradient -->
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e293b" stop-opacity="0.92"/>
      <stop offset="100%" stop-color="#0f172a" stop-opacity="0.96"/>
    </linearGradient>

    <!-- Clock Face Gradient -->
    <radialGradient id="clockDial" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#19243a"/>
      <stop offset="75%" stop-color="#121a2d"/>
      <stop offset="100%" stop-color="#0c1322"/>
    </radialGradient>

    <!-- Tempo Text Gradient -->
    <linearGradient id="tempoGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="50%" stop-color="#60a5fa"/>
      <stop offset="100%" stop-color="#38bdf8"/>
    </linearGradient>

    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fde68a"/>
      <stop offset="50%" stop-color="#fbbf24"/>
      <stop offset="100%" stop-color="#d97706"/>
    </linearGradient>

    <!-- Drop Shadows -->
    <filter id="heroShadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
    <filter id="cardShadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.45"/>
    </filter>
    <filter id="handShadow" x="-40%" y="-40%" width="180%" height="180%">
      <feDropShadow dx="2" dy="4" stdDeviation="4" flood-color="#000000" flood-opacity="0.5"/>
    </filter>
    <filter id="starGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="#fbbf24" flood-opacity="0.8"/>
    </filter>
  </defs>

  <!-- Background Base -->
  <rect width="${width}" height="${height}" fill="url(#bgGrad)"/>

  <!-- Ambient Glowing Orbs -->
  <circle cx="${clockCenterX}" cy="${clockCenterY}" r="340" fill="url(#cyanGlow)"/>
  <circle cx="${clockCenterX + 170}" cy="${clockCenterY + 140}" r="260" fill="url(#amberGlow)"/>
  <circle cx="200" cy="140" r="280" fill="url(#purpleGlow)"/>
  <circle cx="480" cy="500" r="220" fill="url(#emeraldGlow)"/>

  <!-- Background Subtle Grid -->
  <g opacity="0.035" stroke="#ffffff" stroke-width="1">
    <line x1="0" y1="${height * 0.25}" x2="${width}" y2="${height * 0.25}"/>
    <line x1="0" y1="${height * 0.5}" x2="${width}" y2="${height * 0.5}"/>
    <line x1="0" y1="${height * 0.75}" x2="${width}" y2="${height * 0.75}"/>
    <line x1="${width * 0.25}" y1="0" x2="${width * 0.25}" y2="${height}"/>
    <line x1="${width * 0.5}" y1="0" x2="${width * 0.5}" y2="${height}"/>
    <line x1="${width * 0.75}" y1="0" x2="${width * 0.75}" y2="${height}"/>
  </g>

  <!-- Starfield Dust Particles -->
  <g fill="#ffffff" opacity="0.25">
    <circle cx="90" cy="90" r="1.5"/>
    <circle cx="340" cy="65" r="1"/>
    <circle cx="580" cy="120" r="1.5"/>
    <circle cx="160" cy="320" r="1"/>
    <circle cx="680" cy="280" r="1.5"/>
    <circle cx="720" cy="90" r="1"/>
    <circle cx="${width - 100}" cy="80" r="1.5"/>
    <circle cx="${width - 60}" cy="300" r="1"/>
    <circle cx="${width - 120}" cy="${height - 80}" r="1.5"/>
    <circle cx="620" cy="${height - 80}" r="1"/>
    <circle cx="70" cy="${height - 60}" r="1.5"/>
  </g>

  <!-- Left Column: Branding, Title, Features -->
  <g transform="translate(${leftX}, 0)">
    <!-- Top Pill Badge -->
    <g transform="translate(0, ${is1280 ? 68 : 60})">
      <rect width="280" height="34" rx="17" fill="#38bdf8" fill-opacity="0.12" stroke="#38bdf8" stroke-width="1.5"/>
      <!-- Sparkle Icon -->
      <path d="M18 17L20 11L22 17L28 19L22 21L20 27L18 21L12 19Z" fill="#38bdf8"/>
      <text x="36" y="22" fill="#38bdf8" font-family="'Segoe UI', -apple-system, Roboto, Helvetica, Arial, sans-serif" font-size="12" font-weight="800" letter-spacing="1.2">MONTESSORI TIME LEARNING</text>
    </g>

    <!-- Brand Header (Logo Icon + Wordmark + Star) -->
    <g transform="translate(0, ${is1280 ? 175 : 160})">
      <!-- App Name -->
      <text x="0" y="0" fill="url(#tempoGrad)" font-family="'Segoe UI', -apple-system, Roboto, Helvetica, Arial, sans-serif" font-size="${is1280 ? 76 : 70}" font-weight="900" letter-spacing="-1">Tempo</text>
      
      <!-- Sparkling Gold Star Accent -->
      <g transform="translate(${is1280 ? 275 : 255}, -42)" filter="url(#starGlow)">
        <path d="M16 2.5L20 12.5L30.5 13.5L22.5 20.5L25 31L16 25.5L7 31L9.5 20.5L1.5 13.5L12 12.5Z" fill="url(#goldGrad)"/>
      </g>
    </g>

    <!-- Tagline -->
    <text x="0" y="${is1280 ? 232 : 216}" fill="#f8fafc" font-family="'Segoe UI', -apple-system, Roboto, Helvetica, Arial, sans-serif" font-size="${is1280 ? 27 : 25}" font-weight="800">
      Time-Telling Learning App for Kids
    </text>

    <!-- Subtitle Description -->
    <text x="0" y="${is1280 ? 272 : 254}" fill="#94a3b8" font-family="'Segoe UI', -apple-system, Roboto, Helvetica, Arial, sans-serif" font-size="${is1280 ? 17 : 16}" font-weight="400">
      <tspan x="0" dy="0">A playful, interactive web app &amp; PWA designed</tspan>
      <tspan x="0" dy="25">specifically for preschoolers and young learners.</tspan>
    </text>

    <!-- Feature Grid / Chips: Row 1 -->
    <g transform="translate(0, ${is1280 ? 350 : 330})">
      <!-- Chip 1: Analog & Digital -->
      <g transform="translate(0, 0)">
        <rect width="${is1280 ? 176 : 166}" height="42" rx="12" fill="url(#cardGrad)" stroke="#38bdf8" stroke-width="1.5" stroke-opacity="0.6"/>
        <circle cx="24" cy="21" r="10" fill="#38bdf8" fill-opacity="0.18"/>
        <circle cx="24" cy="21" r="7" stroke="#38bdf8" stroke-width="1.6" fill="none"/>
        <path d="M24 17.5V21H27.5" stroke="#38bdf8" stroke-width="1.6" stroke-linecap="round"/>
        <text x="43" y="26" fill="#e2e8f0" font-family="'Segoe UI', -apple-system, Roboto, Helvetica, Arial, sans-serif" font-size="13.5" font-weight="700">Analog &amp; Digital</text>
      </g>

      <!-- Chip 2: 5 Game Modes -->
      <g transform="translate(${is1280 ? 186 : 176}, 0)">
        <rect width="${is1280 ? 176 : 166}" height="42" rx="12" fill="url(#cardGrad)" stroke="#2dd4bf" stroke-width="1.5" stroke-opacity="0.6"/>
        <circle cx="24" cy="21" r="10" fill="#2dd4bf" fill-opacity="0.18"/>
        <!-- Gamepad icon -->
        <rect x="18" y="16" width="12" height="10" rx="3" stroke="#2dd4bf" stroke-width="1.5" fill="none"/>
        <path d="M21 21H23M22 20V22M26 21H27" stroke="#2dd4bf" stroke-width="1.5" stroke-linecap="round"/>
        <text x="43" y="26" fill="#e2e8f0" font-family="'Segoe UI', -apple-system, Roboto, Helvetica, Arial, sans-serif" font-size="13.5" font-weight="700">5 Game Modes</text>
      </g>

      <!-- Chip 3: Star Rewards -->
      <g transform="translate(${is1280 ? 372 : 352}, 0)">
        <rect width="${is1280 ? 166 : 156}" height="42" rx="12" fill="url(#cardGrad)" stroke="#fbbf24" stroke-width="1.5" stroke-opacity="0.6"/>
        <circle cx="24" cy="21" r="10" fill="#fbbf24" fill-opacity="0.18"/>
        <path d="M24 14.5L25.8 18.2L29.8 18.8L26.9 21.6L27.6 25.5L24 23.6L20.4 25.5L21.1 21.6L18.2 18.8L22.2 18.2Z" fill="#fbbf24"/>
        <text x="43" y="26" fill="#e2e8f0" font-family="'Segoe UI', -apple-system, Roboto, Helvetica, Arial, sans-serif" font-size="13.5" font-weight="700">Star Rewards</text>
      </g>
    </g>

    <!-- Feature Grid / Chips: Row 2 -->
    <g transform="translate(0, ${is1280 ? 404 : 382})">
      <!-- Chip 4: Spoken Audio -->
      <g transform="translate(0, 0)">
        <rect width="${is1280 ? 176 : 166}" height="42" rx="12" fill="url(#cardGrad)" stroke="#fb7185" stroke-width="1.5" stroke-opacity="0.6"/>
        <circle cx="24" cy="21" r="10" fill="#fb7185" fill-opacity="0.18"/>
        <path d="M19 18H21L24 15V27L21 24H19V18Z" fill="#fb7185"/>
        <path d="M26 18C27 19 27 23 26 24" stroke="#fb7185" stroke-width="1.6" stroke-linecap="round" fill="none"/>
        <text x="43" y="26" fill="#e2e8f0" font-family="'Segoe UI', -apple-system, Roboto, Helvetica, Arial, sans-serif" font-size="13.5" font-weight="700">Spoken Audio</text>
      </g>

      <!-- Chip 5: Bilingual EN / FR -->
      <g transform="translate(${is1280 ? 186 : 176}, 0)">
        <rect width="${is1280 ? 176 : 166}" height="42" rx="12" fill="url(#cardGrad)" stroke="#a78bfa" stroke-width="1.5" stroke-opacity="0.6"/>
        <circle cx="24" cy="21" r="10" fill="#a78bfa" fill-opacity="0.18"/>
        <!-- Globe icon -->
        <circle cx="24" cy="21" r="6" stroke="#a78bfa" stroke-width="1.5" fill="none"/>
        <ellipse cx="24" cy="21" rx="3" ry="6" stroke="#a78bfa" stroke-width="1.2" fill="none"/>
        <line x1="18" y1="21" x2="30" y2="21" stroke="#a78bfa" stroke-width="1.2"/>
        <text x="43" y="26" fill="#e2e8f0" font-family="'Segoe UI', -apple-system, Roboto, Helvetica, Arial, sans-serif" font-size="13.5" font-weight="700">Bilingual EN / FR</text>
      </g>

      <!-- Chip 6: Offline PWA -->
      <g transform="translate(${is1280 ? 372 : 352}, 0)">
        <rect width="${is1280 ? 166 : 156}" height="42" rx="12" fill="url(#cardGrad)" stroke="#38bdf8" stroke-width="1.5" stroke-opacity="0.6"/>
        <circle cx="24" cy="21" r="10" fill="#38bdf8" fill-opacity="0.18"/>
        <path d="M20 20L24 16L28 20M24 16V25M19 26H29" stroke="#38bdf8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        <text x="43" y="26" fill="#e2e8f0" font-family="'Segoe UI', -apple-system, Roboto, Helvetica, Arial, sans-serif" font-size="13.5" font-weight="700">Offline PWA</text>
      </g>
    </g>

    <!-- Bottom Footer Tagline -->
    <g transform="translate(0, ${is1280 ? 495 : 465})">
      <path d="M6 10L7 6L8 10L12 11L8 12L7 16L6 12L2 11Z" fill="#38bdf8" opacity="0.8"/>
      <text x="20" y="15" fill="#64748b" font-family="'Segoe UI', -apple-system, Roboto, Helvetica, Arial, sans-serif" font-size="${is1280 ? 14 : 13}" font-weight="600">
        Open Source · Montessori Method · No Ads · Privacy First
      </text>
    </g>
  </g>

  <!-- Right Column: Hero Montessori Analog Clock -->
  <g filter="url(#heroShadow)">
    <!-- Outer Decorative Glow Ring -->
    <circle cx="${clockCenterX}" cy="${clockCenterY}" r="${clockRadius + 14}" fill="none" stroke="#38bdf8" stroke-width="2" stroke-opacity="0.3" stroke-dasharray="6 8"/>

    <!-- Clock Outer Rim Bezel -->
    <circle cx="${clockCenterX}" cy="${clockCenterY}" r="${clockRadius}" fill="url(#clockDial)" stroke="#38bdf8" stroke-width="9"/>

    <!-- Inner Track Ring -->
    <circle cx="${clockCenterX}" cy="${clockCenterY}" r="${(clockRadius * 0.88).toFixed(1)}" fill="none" stroke="#334155" stroke-width="1.8" stroke-dasharray="3 5"/>

    <!-- 60 Minute & 12 Hour Ticks -->
    ${ticksSvg.join('\n    ')}

    <!-- Hour Numerals 1 to 12 -->
    ${numeralSvg}

    <!-- Clock Hands (with hand drop shadows) -->
    <g filter="url(#handShadow)">
      <!-- Hour Hand (Sky Blue, pointing to 10) -->
      <line x1="${clockCenterX}" y1="${clockCenterY}" x2="${hx.toFixed(1)}" y2="${hy.toFixed(1)}" stroke="#38bdf8" stroke-width="12" stroke-linecap="round"/>

      <!-- Minute Hand (Sunny Amber, pointing to 2) -->
      <line x1="${clockCenterX}" y1="${clockCenterY}" x2="${mx.toFixed(1)}" y2="${my.toFixed(1)}" stroke="#fbbf24" stroke-width="8" stroke-linecap="round"/>

      <!-- Center Hub & Cap -->
      <circle cx="${clockCenterX}" cy="${clockCenterY}" r="12" fill="#38bdf8"/>
      <circle cx="${clockCenterX}" cy="${clockCenterY}" r="6" fill="#0c1222"/>
      <circle cx="${clockCenterX}" cy="${clockCenterY}" r="3" fill="#fbbf24"/>
    </g>
  </g>

  <!-- Floating Companion Badges (Framed cleanly around the clock) -->

  <!-- 1. Floating Streak Pill (Top Right) -->
  <g transform="translate(${clockCenterX + (is1280 ? 60 : 50)}, ${clockCenterY - clockRadius - 28})" filter="url(#cardShadow)">
    <rect width="${is1280 ? 180 : 170}" height="50" rx="15" fill="#0f172a" stroke="#fbbf24" stroke-width="2"/>
    <circle cx="25" cy="25" r="13" fill="#fbbf24" fill-opacity="0.2"/>
    <!-- Trophy / Flame icon -->
    <path d="M20 18H30V22C30 24.8 27.8 27 25 27C22.2 27 20 24.8 20 22V18Z" fill="#fbbf24"/>
    <path d="M18 19C17 19 16 20 16 21C16 22.5 17.5 23 18.5 23" stroke="#fbbf24" stroke-width="1.4" stroke-linecap="round" fill="none"/>
    <path d="M32 19C33 19 34 20 34 21C34 22.5 32.5 23 31.5 23" stroke="#fbbf24" stroke-width="1.4" stroke-linecap="round" fill="none"/>
    <path d="M23 27V30H27V27M21 30H29" stroke="#fbbf24" stroke-width="1.4" stroke-linecap="round"/>
    
    <text x="46" y="24" fill="#fbbf24" font-family="'Segoe UI', -apple-system, Roboto, Helvetica, Arial, sans-serif" font-size="13" font-weight="800">5-Day Streak!</text>
    <text x="46" y="39" fill="#94a3b8" font-family="'Segoe UI', -apple-system, Roboto, Helvetica, Arial, sans-serif" font-size="10.5" font-weight="600">Level 3 Master</text>
  </g>

  <!-- 2. Floating Game Mode Badge (Top Left) -->
  <g transform="translate(${clockCenterX - (is1280 ? 230 : 215)}, ${clockCenterY - clockRadius - 20})" filter="url(#cardShadow)">
    <rect width="${is1280 ? 165 : 155}" height="46" rx="14" fill="#0f172a" stroke="#2dd4bf" stroke-width="2"/>
    <circle cx="23" cy="23" r="11" fill="#2dd4bf" fill-opacity="0.2"/>
    <!-- Magnifying Glass / Clock read icon -->
    <circle cx="21" cy="21" r="5.5" stroke="#2dd4bf" stroke-width="1.6" fill="none"/>
    <line x1="25" y1="25" x2="29" y2="29" stroke="#2dd4bf" stroke-width="1.8" stroke-linecap="round"/>
    <text x="42" y="28" fill="#2dd4bf" font-family="'Segoe UI', -apple-system, Roboto, Helvetica, Arial, sans-serif" font-size="12.5" font-weight="800">Read the Clock</text>
  </g>

  <!-- 3. Floating Digital Time Display (Bottom Left) -->
  <g transform="translate(${clockCenterX - (is1280 ? 190 : 175)}, ${clockCenterY + clockRadius - 35})" filter="url(#cardShadow)">
    <rect width="${is1280 ? 165 : 150}" height="56" rx="16" fill="#0f172a" stroke="#38bdf8" stroke-width="2.5"/>
    <!-- Live Green Pulse Dot -->
    <circle cx="26" cy="28" r="4.5" fill="#34d399"/>
    <circle cx="26" cy="28" r="8" fill="#34d399" fill-opacity="0.3"/>
    <text x="46" y="35" fill="#38bdf8" font-family="'Segoe UI', -apple-system, Roboto, Helvetica, Arial, sans-serif" font-size="26" font-weight="900" letter-spacing="1.5">10:10</text>
  </g>

  <!-- 4. Floating Leave By / Countdown Badge (Bottom Right) -->
  <g transform="translate(${clockCenterX + (is1280 ? 70 : 55)}, ${clockCenterY + clockRadius - 20})" filter="url(#cardShadow)">
    <rect width="${is1280 ? 165 : 155}" height="46" rx="14" fill="#0f172a" stroke="#fb7185" stroke-width="2"/>
    <circle cx="22" cy="23" r="11" fill="#fb7185" fill-opacity="0.2"/>
    <!-- Runner / Leave By icon -->
    <circle cx="22" cy="17" r="2.2" fill="#fb7185"/>
    <path d="M18 24L21 21L24 22L27 19M21 21V26L19 28M21 26L24 28" stroke="#fb7185" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="40" y="28" fill="#fb7185" font-family="'Segoe UI', -apple-system, Roboto, Helvetica, Arial, sans-serif" font-size="12.5" font-weight="800">Leave By: 10:30</text>
  </g>

  <!-- Ambient Golden and Cyan Sparkles -->
  <g fill="#38bdf8" opacity="0.85">
    <circle cx="${clockCenterX + 210}" cy="${clockCenterY + 110}" r="2.5"/>
    <circle cx="${clockCenterX - 210}" cy="${clockCenterY - 90}" r="2"/>
    <circle cx="${clockCenterX + 160}" cy="${clockCenterY - 140}" r="2.5"/>
    <circle cx="${clockCenterX - 60}" cy="${clockCenterY + clockRadius + 35}" r="3"/>
  </g>
  <g fill="#fbbf24" opacity="0.9">
    <circle cx="${clockCenterX + 230}" cy="${clockCenterY - 70}" r="3"/>
    <circle cx="${clockCenterX - 220}" cy="${clockCenterY + 70}" r="2.5"/>
    <circle cx="${clockCenterX + 40}" cy="${clockCenterY + clockRadius + 25}" r="2"/>
    <circle cx="${clockCenterX - 110}" cy="${clockCenterY - clockRadius - 25}" r="2.5"/>
  </g>
</svg>`;
}

// Generate 1280x640 (GitHub social preview & 2:1 social cards)
const svg1280 = createSvg(1280, 640);
// Generate 1200x630 (Standard OpenGraph card)
const svg1200 = createSvg(1200, 630);

await writeFile(path.join(staticDir, 'social-preview.svg'), svg1280, 'utf8');
await writeFile(path.join(staticDir, 'og-image.svg'), svg1200, 'utf8');

// Render PNGs with sharp
const previewBuffer = await sharp(Buffer.from(svg1280))
	.png({ quality: 95, compressionLevel: 9 })
	.toBuffer();
await writeFile(path.join(staticDir, 'social-preview.png'), previewBuffer);
await writeFile(path.join(githubDir, 'social-preview.png'), previewBuffer);
console.log('Generated static/social-preview.png and .github/social-preview.png (1280x640)');

const ogBuffer = await sharp(Buffer.from(svg1200))
	.png({ quality: 95, compressionLevel: 9 })
	.toBuffer();
await writeFile(path.join(staticDir, 'og-image.png'), ogBuffer);
console.log('Generated static/og-image.png (1200x630)');
