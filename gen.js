// "North" v4: cinematic Jon Snow style. Serif type, ice and crimson, snow, wind, ravens, aurora, a sword.
// Pure SVG + SMIL (no JavaScript). Run from the north4/ folder: node gen.js
const fs = require('fs');
fs.mkdirSync('assets', { recursive: true });
let seed = 21;
const r = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const f1 = n => +n.toFixed(1);

const BG1 = '#0b1426', BG2 = '#060b16', ICE = '#cfe3f5', WHITE = '#eaf3fb', MID = '#9fc3e0', DIM = '#7f97b3', LINE = '#2a3d5a', RED = '#d23a45';
const SERIF = `font-family="Georgia, 'Times New Roman', serif"`;
const MONO = `font-family="Consolas, 'Courier New', monospace"`;
const SANS = `font-family="'Segoe UI', Helvetica, Arial, sans-serif"`;
const W = 800;
const FOG = 'data:image/jpeg;base64,' + fs.readFileSync('fog.jpg').toString('base64');
const write = (n, s) => fs.writeFileSync('assets/' + n, s);
const corners = h => `<g stroke="${ICE}" stroke-width="1.5" fill="none" opacity=".7"><path d="M6 20V6H20M${W - 20} 6H${W - 6}V20M6 ${h - 20}V${h - 6}H20M${W - 20} ${h - 6}H${W - 6}V${h - 20}"/></g>`;
const svg = (h, body, defs = '', frame = true) => `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${h}" viewBox="0 0 ${W} ${h}">
<defs><linearGradient id="pbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${BG1}"/><stop offset="1" stop-color="${BG2}"/></linearGradient>
<filter id="rough"><feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="3" seed="4"/><feDisplacementMap in="SourceGraphic" scale="5"/></filter><filter id="rough2"><feTurbulence type="fractalNoise" baseFrequency=".09" numOctaves="2" seed="7"/><feDisplacementMap in="SourceGraphic" scale="1.6"/></filter>
<filter id="soft"><feGaussianBlur stdDeviation="1.1"/></filter><filter id="b8"><feGaussianBlur stdDeviation="8"/></filter><filter id="b20" x="-30%" y="-50%" width="160%" height="200%"><feGaussianBlur stdDeviation="20"/></filter>
<filter id="glow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<filter id="shadow" x="-10%" y="-50%" width="120%" height="200%"><feDropShadow dx="0" dy="1" stdDeviation="2" flood-color="#000" flood-opacity=".95"/></filter>${defs}</defs>
<rect width="${W}" height="${h}" fill="url(#pbg)"/>
<image href="${FOG}" x="-30" y="-30" width="${W + 60}" height="${h + 60}" preserveAspectRatio="none" opacity=".12" filter="url(#b8)"/>
${body}
<rect y="${h - 1}" width="${W}" height="1" fill="${LINE}"/>
</svg>
`;

const snowfall = (n, h, rmin, rmax, dmin, dmax, wind, blur) => {
  let o = '';
  for (let i = 0; i < n; i++) {
    const d = f1(dmin + r() * (dmax - dmin));
    o += `<circle cx="${f1(r() * (W + 100) - 50)}" cy="-8" r="${f1(rmin + r() * (rmax - rmin))}" fill="#fff" opacity="${f1(0.35 + r() * 0.65)}"${blur ? ' filter="url(#soft)"' : ''}><animateTransform attributeName="transform" type="translate" values="0 0;${wind} ${h + 16}" dur="${d}s" begin="${f1(-r() * d)}s" repeatCount="indefinite"/></circle>`;
  }
  return o;
};
// same density, speed and wind in every section, whatever its height, so the snow reads as one storm
const storm = h => { const k = h / 430; return snowfall(Math.round(40 * k), h, 0.6, 1.3, 6 * k, 11 * k, Math.round(-90 * k), false) + snowfall(Math.round(30 * k), h, 1.3, 2.6, 4 * k, 7 * k, Math.round(-140 * k), true); };
const stars = (n, maxY) => {
  let o = '';
  for (let i = 0; i < n; i++)
    o += `<circle cx="${f1(r() * W)}" cy="${f1(r() * maxY)}" r="${f1(0.4 + r())}" fill="#dff0ff"><animate attributeName="opacity" values=".15;1;.15" dur="${f1(2 + r() * 4)}s" begin="${f1(-r() * 6)}s" repeatCount="indefinite"/></circle>`;
  return o;
};
const pines = (n, x0, step, baseY, h, fill) => {
  let o = '';
  for (let i = 0; i < n; i++) {
    const x = x0 + i * step + r() * step * 0.5, s = h * (0.7 + r() * 0.6);
    o += `<path d="M${f1(x)} ${f1(baseY - s)} l${f1(s * 0.2)} ${f1(s * 0.3)} h-${f1(s * 0.08)} l${f1(s * 0.2)} ${f1(s * 0.3)} h-${f1(s * 0.1)} l${f1(s * 0.22)} ${f1(s * 0.4)} h-${f1(s * 1.08)} l${f1(s * 0.22)} -${f1(s * 0.4)} h-${f1(s * 0.1)} l${f1(s * 0.2)} -${f1(s * 0.3)} h-${f1(s * 0.08)}Z" fill="${fill}"/>`;
  }
  return o;
};
const raven = (y1, y2, dur, begin, s) => `<g><animateTransform attributeName="transform" type="translate" values="-60 ${y1};860 ${y2}" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/>
<g transform="scale(${s})"><ellipse rx="8" ry="3" fill="#02040a"/><circle cx="8" cy="-1" r="2.6" fill="#02040a"/><path d="M10 -1 L15 0 L10 1Z" fill="#02040a"/>
<path fill="#02040a"><animate attributeName="d" values="M-2 -1 Q-12 -14 -26 -9 Q-14 -5 -2 1Z;M-2 -1 Q-12 8 -26 12 Q-14 4 -2 1Z;M-2 -1 Q-12 -14 -26 -9 Q-14 -5 -2 1Z" dur="${f1(0.55 + r() * 0.3)}s" repeatCount="indefinite"/></path></g></g>`;
const windStreaks = (n, h) => {
  let o = '';
  for (let i = 0; i < n; i++) {
    const y = f1(r() * h), len = f1(14 + r() * 30), d = f1(2.4 + r() * 3);
    o += `<line x1="${W + 40}" y1="${y}" x2="${f1(W + 40 + len)}" y2="${f1(y - len * 0.2)}" stroke="#fff" stroke-width="1" opacity="${f1(0.12 + r() * 0.2)}" stroke-linecap="round"><animateTransform attributeName="transform" type="translate" values="0 0;${-W - 120} ${f1(30 + r() * 40)}" dur="${d}s" begin="${f1(-r() * d)}s" repeatCount="indefinite"/></line>`;
  }
  return o;
};
const sword = len => `<g>
<path d="M-8 88 L8 88 L8 ${88 + len - 28} L0 ${88 + len} L-8 ${88 + len - 28}Z" fill="url(#blade)"/>
<rect x="-1.5" y="92" width="3" height="${len - 36}" fill="#262e38" opacity=".9"/>
<rect x="-10" y="40" width="20" height="40" fill="url(#gleam)" clip-path="url(#bladeClip)"><animate attributeName="y" values="40;40;${88 + len}" keyTimes="0;.45;1" dur="5s" repeatCount="indefinite"/></rect>
<path d="M-42 80 Q0 72 42 80 L38 89 Q0 83 -38 89Z" fill="#5c6875"/>
<rect x="-4.5" y="43" width="9" height="34" rx="2" fill="#15191f"/>
<path d="M-4.5 48 L4.5 52 M-4.5 55 L4.5 59 M-4.5 62 L4.5 66 M-4.5 69 L4.5 73" stroke="#3a434e" stroke-width="1.3"/>
<circle cy="36" r="7.5" fill="#5c6875"/><circle cy="36" r="3.5" fill="#2a323c"/>
</g>`;
const swordDefs = len => `<linearGradient id="blade" x1="0" x2="1"><stop offset="0" stop-color="#3f4955"/><stop offset=".5" stop-color="#aeb9c4"/><stop offset="1" stop-color="#323b46"/></linearGradient>
<linearGradient id="gleam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".7"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<radialGradient id="halo"><stop offset="0" stop-color="${ICE}" stop-opacity=".5"/><stop offset="1" stop-color="${ICE}" stop-opacity="0"/></radialGradient>
<clipPath id="bladeClip"><path d="M-8 88 L8 88 L8 ${88 + len - 28} L0 ${88 + len} L-8 ${88 + len - 28}Z"/></clipPath>`;

// ================= TITLE =================
{
  const H = 430;
  // Banner art on top (embedded so it renders inside the SVG on GitHub), name and lines underneath
  const IH = 240;
  const art = 'data:image/jpeg;base64,' + fs.readFileSync('banner.jpg').toString('base64');
  const body = `<image href="${art}" width="${W}" height="${IH}" preserveAspectRatio="xMidYMid slice" mask="url(#artFade)"/>
<rect width="${W}" height="${IH}" fill="#16325c" opacity=".28" mask="url(#artFade)"/>
${storm(H)}
<g transform="translate(0 86)">

<text x="38" y="214" ${SERIF} font-size="120" font-weight="bold" letter-spacing="18" fill="${RED}" opacity="0">NEX<animate attributeName="opacity" values="0;0;.7;0;.5;0" keyTimes="0;.9;.91;.93;.94;1" dur="7s" repeatCount="indefinite"/><animateTransform attributeName="transform" type="translate" values="0 0;0 0;-6 0;5 0;-3 0;0 0" keyTimes="0;.9;.91;.93;.94;1" dur="7s" repeatCount="indefinite"/></text>
<text x="38" y="214" ${SERIF} font-size="120" font-weight="bold" letter-spacing="18" fill="${ICE}" filter="url(#rough)">NEX<animateTransform attributeName="transform" type="translate" values="0 0;0 0;3 0;-2 0;0 0" keyTimes="0;.9;.92;.94;1" dur="7s" repeatCount="indefinite"/></text>
<line x1="44" y1="240" x2="364" y2="240" stroke="${ICE}" stroke-width="2" stroke-dasharray="320" stroke-dashoffset="320"><animate attributeName="stroke-dashoffset" values="320;0;0;320" keyTimes="0;.2;.85;1" dur="9s" repeatCount="indefinite"/></line>
<text x="44" y="278" ${SANS} font-size="22" font-weight="600" letter-spacing="3" fill="#fff" filter="url(#shadow)">FULL-STACK · AI · CYBERSECURITY</text>
<clipPath id="ty0"><rect x="44" y="292" height="26" width="0"><animate attributeName="width" values="0;0;281.6;281.6;0;0" keyTimes="0;0.000;0.120;0.323;0.333;1" dur="12s" repeatCount="indefinite"/></rect></clipPath><text x="44" y="310" ${MONO} font-size="16" fill="${MID}" clip-path="url(#ty0)"><tspan fill="${DIM}">&gt;</tspan> building hardware that listens</text><clipPath id="ty1"><rect x="44" y="292" height="26" width="0"><animate attributeName="width" values="0;0;396.0;396.0;0;0" keyTimes="0;0.333;0.453;0.657;0.667;1" dur="12s" repeatCount="indefinite"/></rect></clipPath><text x="44" y="310" ${MONO} font-size="16" fill="${MID}" clip-path="url(#ty1)"><tspan fill="${DIM}">&gt;</tspan> breaking things to learn how to secure them</text><clipPath id="ty2"><rect x="44" y="292" height="26" width="0"><animate attributeName="width" values="0;0;360.8;360.8;0" keyTimes="0;0.667;0.787;0.990;1.000" dur="12s" repeatCount="indefinite"/></rect></clipPath><text x="44" y="310" ${MONO} font-size="16" fill="${MID}" clip-path="url(#ty2)"><tspan fill="${DIM}">&gt;</tspan> shipping full-stack apps with AI inside</text><rect x="44" y="296" width="9" height="17" fill="${ICE}"><animate attributeName="x" values="44;327.6;327.6;44;44;442;442;44;44;406.8;406.8;44" keyTimes="0;0.12;0.3233;0.3332;0.3333;0.4533;0.6567;0.6666;0.6667;0.7867;0.99;1" dur="12s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0" dur="1s" calcMode="discrete" repeatCount="indefinite"/></rect></g>`;
  write('title.svg', svg(H, body, `${swordDefs(330)}
<linearGradient id="fade" x1="0" y1="0" x2="0" y2="1"><stop offset=".55" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient><mask id="artFade"><rect width="${W}" height="240" fill="url(#fade)"/></mask>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#06080c"/><stop offset=".6" stop-color="#121922"/><stop offset="1" stop-color="#1f2935"/></linearGradient>
<linearGradient id="rim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fc3e0" stop-opacity="0"/><stop offset="1" stop-color="#9fc3e0" stop-opacity=".12"/></linearGradient>
<linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a9bccd"/><stop offset=".12" stop-color="#5d7389"/><stop offset=".6" stop-color="#2c3b4c"/><stop offset="1" stop-color="#161f2a"/></linearGradient>
<linearGradient id="ground" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a4757"/><stop offset="1" stop-color="#0b1017"/></linearGradient>
<radialGradient id="fireGlow"><stop offset="0" stop-color="#ff9a3c" stop-opacity=".9"/><stop offset="1" stop-color="#ff6a1a" stop-opacity="0"/></radialGradient>
<linearGradient id="shine" gradientUnits="userSpaceOnUse" x1="-400" y1="0" x2="0" y2="0"><stop offset="0" stop-color="${ICE}"/><stop offset=".5" stop-color="#fff"/><stop offset="1" stop-color="${ICE}"/><animateTransform attributeName="gradientTransform" type="translate" values="0 0;1300 0" dur="6s" repeatCount="indefinite"/></linearGradient>
<linearGradient id="scrim" x1="0" x2="1"><stop offset="0" stop-color="#02050c" stop-opacity=".7"/><stop offset=".7" stop-color="#02050c" stop-opacity=".3"/><stop offset="1" stop-color="#02050c" stop-opacity="0"/></linearGradient>`));
}

// ================= PROJECT PANELS =================
const H2 = 230;
const panel = (num, title, desc, tags, link, visual, defs = '') => {
  const left = `<text x="44" y="50" ${MONO} font-size="15" fill="${MID}">~/projects/${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}</text>
<text x="44" y="86" ${SERIF} font-size="32" font-weight="bold" fill="${WHITE}" filter="url(#rough2)">${title}</text>
${desc.map((l, i) => `<text x="44" y="${118 + i * 25}" ${SANS} font-size="18" fill="${MID}">${l}</text>`).join('')}
<text x="44" y="${H2 - 52}" ${SERIF} font-size="16" font-style="italic" fill="${DIM}">${tags}</text>
<text x="44" y="${H2 - 28}" ${SANS} font-size="15" ${link ? `letter-spacing="1" fill="${ICE}"` : `font-style="italic" fill="${DIM}"`}>${link === 'live' ? 'VIEW LIVE SITE  →' : link ? 'VIEW ON GITHUB  →' : 'Not public yet'}</text>`;
  return svg(H2, `${storm(H2)}${left}${visual}`, defs);
};

{ // I - BLE radar
  const cx = 612, cy = 115;
  let blips = '';
  [[40, 28], [75, 52], [140, 36], [205, 62], [300, 70], [255, 22]].forEach(([deg, rad]) => {
    const a = (deg * Math.PI) / 180;
    blips += `<circle cx="${f1(cx + rad * Math.cos(a))}" cy="${f1(cy + rad * Math.sin(a))}" r="3.4" fill="${RED}" opacity="0"><animate attributeName="opacity" values="0;0;1;.7;0" keyTimes="0;${f1(deg / 360 - 0.001)};${f1(deg / 360)};${f1(Math.min(deg / 360 + 0.35, 0.99))};1" dur="4s" repeatCount="indefinite"/></circle>`;
  });
  const vis = `<g stroke="${LINE}" fill="none"><circle cx="${cx}" cy="${cy}" r="30"/><circle cx="${cx}" cy="${cy}" r="60"/><circle cx="${cx}" cy="${cy}" r="90"/><path d="M${cx - 95} ${cy}H${cx + 95}M${cx} ${cy - 95}V${cy + 95}"/></g>
<g><animateTransform attributeName="transform" type="rotate" values="0 ${cx} ${cy};360 ${cx} ${cy}" dur="4s" repeatCount="indefinite"/>
<path d="M${cx} ${cy} L${cx + 90} ${cy} A90 90 0 0 0 ${f1(cx + 90 * Math.cos(-0.9))} ${f1(cy + 90 * Math.sin(-0.9))}Z" fill="url(#sweep)"/><line x1="${cx}" y1="${cy}" x2="${cx + 90}" y2="${cy}" stroke="${ICE}" stroke-width="1.5"/></g>
${blips}<circle cx="${cx}" cy="${cy}" r="3" fill="${WHITE}"/>`;
  write('p1.svg', panel('I', 'ESP32 BLE Radar', ['Finds nearby Bluetooth devices and', 'tracks one by its signal strength.'], 'C++ · ESP32 · Bluetooth LE', 'x', vis,
    `<linearGradient id="sweep" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="${ICE}" stop-opacity=".5"/><stop offset="1" stop-color="${ICE}" stop-opacity="0"/></linearGradient>`));
}

{ // II - Threat-Pulse arcs
  let dots = '';
  for (let gx = 0; gx < 22; gx++) for (let gy = 0; gy < 12; gy++)
    if (r() < 0.55) dots += `<circle cx="${430 + gx * 16}" cy="${42 + gy * 14}" r="1.3" fill="${DIM}" opacity=".5"/>`;
  const pts = [[470, 80], [570, 130], [660, 70], [730, 150], [510, 170]];
  let a = '';
  [[0, 2], [1, 3], [4, 2], [3, 0], [2, 1]].forEach(([i, j], k) => {
    const [x1, y1] = pts[i], [x2, y2] = pts[j], mx = (x1 + x2) / 2, my = Math.min(y1, y2) - 40 - r() * 20;
    a += `<path d="M${x1} ${y1} Q${mx} ${f1(my)} ${x2} ${y2}" fill="none" stroke="#3a5070" stroke-width="1.2"/><path d="M${x1} ${y1} Q${mx} ${f1(my)} ${x2} ${y2}" fill="none" stroke="${RED}" stroke-width="2" stroke-dasharray="26 220" stroke-linecap="round"><animate attributeName="stroke-dashoffset" values="246;0" dur="${f1(2 + k * 0.4)}s" begin="${f1(k * 0.5)}s" repeatCount="indefinite"/></path>`;
  });
  const pulses = pts.map(([x, y], k) => `<circle cx="${x}" cy="${y}" r="3" fill="${WHITE}"/><circle cx="${x}" cy="${y}" r="3" fill="none" stroke="${ICE}"><animate attributeName="r" values="3;16" dur="2.4s" begin="${f1(k * 0.5)}s" repeatCount="indefinite"/><animate attributeName="opacity" values=".9;0" dur="2.4s" begin="${f1(k * 0.5)}s" repeatCount="indefinite"/></circle>`).join('');
  write('p2.svg', panel('II', 'Threat-Pulse', ['A live, simulated map of cyberattacks', 'around the world. Built to learn from.'], 'JavaScript · HTML · CSS', 'live', `${dots}${a}${pulses}`));
}

{ // III - Port scanner
  let cells = '';
  const cols = 20, rows = 8, open = new Set([2, 15, 27, 44, 71, 98, 120, 143]);
  for (let i = 0; i < cols * rows; i++) {
    const x = 430 + (i % cols) * 17, y = 38 + Math.floor(i / cols) * 19, t = f1((i / (cols * rows)) * 7), o = open.has(i);
    cells += `<rect x="${x}" y="${y}" width="12" height="12" rx="2" fill="${LINE}"><animate attributeName="fill" values="${LINE};${o ? RED : ICE};${o ? RED : LINE};${LINE}" keyTimes="0;.02;.8;1" dur="9s" begin="${t}s" repeatCount="indefinite"/></rect>`;
  }
  write('p3.svg', panel('III', 'Port Scanner', ['A Python scanner that maps open ports', 'using real TCP handshakes.'], 'Python · sockets', 'x', `${cells}<text x="430" y="${38 + rows * 19 + 16}" ${SANS} font-size="14" letter-spacing="2" fill="${DIM}">SCANNING</text><text x="${430 + cols * 17 - 5}" y="${38 + rows * 19 + 16}" text-anchor="end" ${SANS} font-size="14" fill="${RED}">8 open</text>`));
}

{ // IV - Motion detection
  const vis = `<rect x="440" y="34" width="330" height="160" fill="#0e1a2e" stroke="${LINE}"/>
<g stroke="${LINE}">${[1, 2, 3, 4, 5, 6, 7].map(i => `<path d="M${440 + i * 41.25} 34V194"/>`).join('')}${[1, 2, 3].map(i => `<path d="M440 ${34 + i * 40}H770"/>`).join('')}</g>
<g><animateTransform attributeName="transform" type="translate" values="0 0;0 0;180 -10;180 -10;0 0" keyTimes="0;.15;.55;.8;1" dur="6s" repeatCount="indefinite"/>
<rect x="470" y="108" width="34" height="64" rx="4" fill="${ICE}" opacity=".85"/><circle cx="487" cy="98" r="11" fill="${ICE}" opacity=".85"/>
<rect x="462" y="80" width="50" height="100" fill="none" stroke="${RED}" stroke-width="1.8"><animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;.12;.2;.75;.85;1" dur="6s" repeatCount="indefinite"/></rect></g>
<path d="M448 50V42H456M762 42H754V50M448 178V186H456M762 186H754V178" stroke="${WHITE}" stroke-width="2" fill="none"/>
<circle cx="720" cy="58" r="4" fill="${RED}"><animate attributeName="opacity" values="1;0;1" dur="1.2s" repeatCount="indefinite"/></circle><text x="729" y="63" ${SANS} font-size="13" fill="${WHITE}" letter-spacing="1">REC</text>
<text x="470" y="63" ${SANS} font-size="14" letter-spacing="2" fill="${RED}"><animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;.12;.2;.75;.85;1" dur="6s" repeatCount="indefinite"/>MOTION DETECTED</text>`;
  write('p4.svg', panel('IV', 'Motion Detection', ['Reads a live webcam feed and sounds', 'an alarm when something moves.'], 'Python · computer vision', 'x', vis));
}

{ // V - MindSpace network
  const nodes = { ai: [610, 115, 'AI'], ui: [490, 70, 'React'], api: [490, 160, 'FastAPI'], db: [730, 70, 'Supabase'], au: [730, 160, 'Firebase'] };
  let e = '', p = '', n = '';
  [['ui', 'ai'], ['api', 'ai'], ['ai', 'db'], ['ai', 'au'], ['ui', 'api']].forEach(([a, b], i) => {
    const [x1, y1] = nodes[a], [x2, y2] = nodes[b];
    e += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${LINE}" stroke-width="1.5"/>`;
    p += `<circle r="3" fill="${i % 2 ? ICE : RED}"><animateMotion path="M${x1} ${y1} L${x2} ${y2}" dur="${f1(2 + i * 0.35)}s" begin="${f1(i * 0.4)}s" repeatCount="indefinite"/></circle>`;
  });
  Object.values(nodes).forEach(([x, y, t]) => {
    const big = t === 'AI';
    n += `<circle cx="${x}" cy="${y}" r="${big ? 30 : 34}" fill="#0b1426" stroke="${big ? ICE : DIM}" stroke-width="${big ? 2 : 1.2}"${big ? ' filter="url(#glow)"' : ''}/><text x="${x}" y="${y + (big ? 6 : 5)}" text-anchor="middle" ${SERIF} font-size="${big ? 18 : 13}" font-weight="bold" fill="${WHITE}">${t}</text>`;
    if (big) n += `<circle cx="${x}" cy="${y}" r="26" fill="none" stroke="${ICE}"><animate attributeName="r" values="26;48" dur="2.6s" repeatCount="indefinite"/><animate attributeName="opacity" values=".6;0" dur="2.6s" repeatCount="indefinite"/></circle>`;
  });
  write('p5.svg', panel('V', 'MindSpace', ['A full-stack AI web app. React front end,', 'FastAPI back end, Supabase and Firebase.'], 'React · FastAPI · Supabase · Firebase', 'live', `${e}${p}${n}`));
}

{ // VI - Cryptotool
  const states = [['PLAIN', 'winter'], ['ROT13', 'jvagre'], ['BASE64', 'd2ludGVy'], ['HEX', '77 69 6e 74 65 72'], ['BINARY', '01110111 01101001']];
  const dur = 15, seg = 1 / states.length;
  const vis = states.map(([label, txt], i) => {
    const a = i * seg, b = a + seg, raw = [[0, 0], [a, 0], [a + 0.02, 1], [b - 0.03, 1], [b, 0], [1, 0]];
    const kt = [], vs = [];
    raw.forEach(([k, v]) => { k = Math.round(Math.min(Math.max(k, 0), 1) * 1000) / 1000; if (!kt.length || k > kt[kt.length - 1]) { kt.push(k); vs.push(v); } });
    return `<g opacity="0"><animate attributeName="opacity" values="${vs.join(';')}" keyTimes="${kt.join(';')}" dur="${dur}s" repeatCount="indefinite"/><text x="450" y="78" ${SANS} font-size="12" fill="${RED}" letter-spacing="4">${label}</text><text x="450" y="${txt.length > 12 ? 140 : 148}" ${SERIF} font-size="${txt.length > 12 ? 26 : 52}" font-style="italic" fill="${WHITE}">${txt}</text></g>`;
  }).join('');
  const bar = `<rect x="450" y="176" width="310" height="2" fill="${LINE}"/><rect x="450" y="176" width="0" height="2" fill="${RED}"><animate attributeName="width" values="0;310" dur="${dur / states.length}s" repeatCount="indefinite"/></rect>`;
  write('p6.svg', panel('VI', 'Cryptotool CLI', ['A terminal tool that converts text between', 'ROT13, Base64, hex and binary.'], 'Shell · Linux', 'x', vis + bar));
}

// ================= RECENT REPOS =================
// data comes from feed-data.json, which update-feed.js refreshes from GitHub
const feed = JSON.parse(fs.readFileSync('feed-data.json', 'utf8'));
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const langColor = l => ({ Python: '#7aa7ff', 'C++': ICE, JavaScript: '#4fd1c5', C: '#a78bfa', Shell: RED, HTML: '#e8a87c', TypeScript: '#5b9bd5' })[l] || DIM;
{
  const rows = feed.rows.map(x => [x.date, esc(x.name), esc(x.lang), langColor(x.lang)]);
  const H = 96 + rows.length * 34 + 24, dur = 14;
  let body = `<text x="44" y="44" ${MONO} font-size="13" fill="${MID}">$ git log --recent</text><text x="44" y="76" ${SERIF} font-size="26" font-weight="bold" fill="${WHITE}" filter="url(#rough2)">Latest repositories</text>`;
  rows.forEach(([d, name, lang, col], i) => {
    const y = 120 + i * 34, t = 0.25 + i * 0.35;
    body += `<g opacity="0"><animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;${(t / dur).toFixed(3)};${((t + 0.4) / dur).toFixed(3)};0.93;1" dur="${dur}s" repeatCount="indefinite"/>
<text x="44" y="${y}" ${SANS} font-size="15" letter-spacing="1" fill="${DIM}">${d.toUpperCase()}</text>
<text x="140" y="${y}" ${SERIF} font-size="19" font-style="italic" fill="${i === 0 ? WHITE : ICE}">${name}</text>
<circle cx="440" cy="${y - 5}" r="4.5" fill="${col}"/><text x="454" y="${y}" ${SANS} font-size="15" fill="${DIM}">${lang}</text>
<line x1="44" y1="${y + 12}" x2="500" y2="${y + 12}" stroke="${LINE}"/></g>`;
  });
  const langs = feed.langs.map(([n, c]) => [esc(n), c, langColor(n)]);
  body += `<text x="560" y="120" ${SANS} font-size="14" letter-spacing="3" fill="${DIM}">LANGUAGES</text>`;
  langs.forEach(([n, c, col], i) => {
    const y = 150 + i * 36;
    body += `<text x="560" y="${y}" ${SERIF} font-size="16" fill="${ICE}">${n}</text><rect x="560" y="${y + 8}" width="200" height="4" rx="2" fill="${LINE}"/><rect x="560" y="${y + 8}" width="0" height="4" rx="2" fill="${col}"><animate attributeName="width" values="0;${f1((c / feed.langs[0][1]) * 200)};${f1((c / feed.langs[0][1]) * 200)};0" keyTimes="0;.1;.9;1" dur="${dur}s" repeatCount="indefinite"/></rect><text x="760" y="${y}" text-anchor="end" ${SANS} font-size="15" fill="${DIM}">${c}</text>`;
  });
  fs.readdirSync('assets').filter(f => /^feed.*\.svg$/.test(f)).forEach(f => fs.unlinkSync('assets/' + f));
  write(feed.file, svg(H, `${storm(H)}${body}`));
}

// ================= TOOLS (static) =================
{
  const groups = [['LANGUAGES', ['Python', 'C++', 'C', 'JavaScript', 'SQL']], ['WEB', ['React', 'FastAPI', 'HTML', 'CSS', 'Firebase', 'Supabase']], ['SYSTEMS', ['Linux', 'Git', 'ESP32', 'Sockets', 'Win32 API', 'VMs']]];
  const H = 96 + groups.length * 46 + 20;
  let body = `<text x="44" y="44" ${MONO} font-size="13" fill="${MID}">$ which tools</text><text x="44" y="76" ${SERIF} font-size="26" font-weight="bold" fill="${WHITE}" filter="url(#rough2)">Tools</text>`;
  groups.forEach(([label, items], i) => {
    const y = 128 + i * 46;
    body += `<text x="44" y="${y}" ${SANS} font-size="14" letter-spacing="3" fill="${DIM}">${label}</text><text x="170" y="${y + 1}" ${SERIF} font-size="21" font-style="italic" xml:space="preserve">${items.map(t => `<tspan fill="${ICE}">${t}</tspan>`).join(`<tspan fill="${DIM}">   ·   </tspan>`)}</text>`;
    if (i < groups.length - 1) body += `<line x1="44" y1="${y + 20}" x2="756" y2="${y + 20}" stroke="${LINE}"/>`;
  });
  write('tools.svg', svg(H, `${storm(H)}${body}`));
}

if (fs.existsSync('../assets/footer.gif')) fs.copyFileSync('../assets/footer.gif', 'assets/footer.gif');

// ================= README + preview page =================
const U = 'https://github.com/Ahany1440/';
const links = { p1: 'ESP32-Cyber-Radar-Interactive-BLE-Proximity-Signal-Tracker', p3: 'Python-Port-Scanner-Python', p2: 'https://cyber-attacks-map.vercel.app/', p5: 'https://mindspace-eta-vert.vercel.app/', p4: 'python-camera-movement-detection', p6: 'cryptotool-cli' };
const alts = {
  title: 'Nex: full-stack, AI and cybersecurity. React, FastAPI, Python, C++, ESP32.',
  p1: 'ESP32 BLE Radar: finds nearby Bluetooth devices and tracks one by signal strength.',
  p2: 'Threat-Pulse: a live, simulated map of cyberattacks around the world.',
  p3: 'Port Scanner: a Python scanner that maps open ports using TCP handshakes.',
  p4: 'Motion Detection: reads a webcam feed and sounds an alarm when something moves.',
  p5: 'MindSpace: a full-stack AI web app with React, FastAPI, Supabase and Firebase.',
  p6: 'Cryptotool CLI: converts text between ROT13, Base64, hex and binary.',
  feed: `Latest repositories and the language split across ${feed.total} public repos.`,
  tools: 'Tools: Python, C++, C, JavaScript, SQL, React, FastAPI, HTML, CSS, Firebase, Supabase, Linux, Git, ESP32, sockets.',
};
const order = ['title', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'feed', 'tools'];
const img = k => `<img src="assets/${k === 'feed' ? feed.file : k + '.svg'}" width="100%" align="top" alt="${alts[k]}"/>`;
const tag = k => (links[k] ? `<a href="${links[k].startsWith('http') ? links[k] : U + links[k]}">${img(k)}</a>` : img(k));
const gif = `<div align="center"><img src="assets/footer.gif" width="420" alt="Game of Thrones GIF"/></div>`;
fs.writeFileSync('README.md', `<p align="center">\n${order.map(tag).join('')}\n</p>\n\n<br/>\n\n${gif}\n`);
fs.writeFileSync('index.html', `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Preview</title>
<style>body{background:#0d1117;margin:0;padding:24px 0;display:flex;justify-content:center}main{width:min(830px,100%);padding:0 16px;box-sizing:border-box}img{display:block;width:100%}.g{display:flex;justify-content:center;margin-top:28px}.g img{width:420px;max-width:100%}</style>
<main>${order.map(img).join('')}<div class="g"><img src="assets/footer.gif" alt=""></div></main>`);
console.log('built', order.length, 'panels + gif');
