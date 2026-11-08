// Refreshes feed-data.json from the GitHub API. gen.js turns that file into the "Latest repositories" panel.
const fs = require('fs');
const crypto = require('crypto');
const assert = require('assert');

const OWNER = 'Ahany1440';
const SHOW = 9;
const SKIP = new Set([OWNER.toLowerCase(), 'daily_commits']); // public, but not projects
const NAMES = {
  'Spec-Ops-The-Line-Audio-fix': 'Spec Ops audio fix',
  'cryptotool-cli': 'Cryptotool CLI',
  'ESP32-Cyber-Radar-Interactive-BLE-Proximity-Signal-Tracker': 'ESP32 BLE Radar',
  'esp32-oled-clock': 'ESP32 OLED Clock',
  'Donut-python-render': 'Donut Renderer',
  'python-camera-movement-detection': 'Motion Detection',
  'Singly-Linked-List-CPP': 'Singly Linked List',
  'Python-Port-Scanner-Python': 'Port Scanner',
};
const MONTHS = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ');

const label = name => {
  const s = NAMES[name] || name;
  return s.length > 30 ? s.slice(0, 29) + '…' : s; // the column fits about 30 characters
};
const day = iso => `${MONTHS[+iso.slice(5, 7) - 1]} ${iso.slice(8, 10)}`;

function build(repos) {
  const own = repos.filter(r => !r.fork);
  const rows = own
    .filter(r => !SKIP.has(r.name.toLowerCase()))
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, SHOW)
    .map(r => ({ date: day(r.created_at), name: label(r.name), lang: r.language || 'Other' }));
  const counts = {};
  own.forEach(r => { if (r.language) counts[r.language] = (counts[r.language] || 0) + 1; });
  const langs = Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 5);
  const data = { total: own.length, rows, langs };
  // the file name changes with the data because GitHub keeps serving a cached image under an old name
  return { ...data, file: `feed-${crypto.createHash('sha1').update(JSON.stringify(data)).digest('hex').slice(0, 8)}.svg` };
}

async function main() {
  const headers = { 'User-Agent': 'profile-feed-update', Accept: 'application/vnd.github+json' };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  // shortcut: only reads the first 100 repos, add paging past that
  const res = await fetch(`https://api.github.com/users/${OWNER}/repos?per_page=100&type=owner`, { headers });
  if (!res.ok) throw new Error(`GitHub API returned ${res.status}`);
  const repos = await res.json();
  // a bad response must never blank the panel
  if (!Array.isArray(repos) || !repos.length) throw new Error('GitHub API returned no repositories');
  const data = build(repos);
  fs.writeFileSync('feed-data.json', JSON.stringify(data, null, 2) + '\n');
  console.log(`${data.total} public repos, newest: ${data.rows[0].name}, file: ${data.file}`);
}

function test() {
  const r = (name, created_at, language, fork = false) => ({ name, created_at, language, fork });
  const d = build([
    r('old', '2026-01-02T00:00:00Z', 'C'),
    r('newest', '2026-11-04T00:00:00Z', 'Python'),
    r('forked', '2026-12-01T00:00:00Z', 'Go', true),
    r('Ahany1440', '2026-11-20T00:00:00Z', null),
    r('daily_commits', '2026-11-21T00:00:00Z', null),
    r('x'.repeat(40), '2026-02-01T00:00:00Z', 'Python'),
  ]);
  assert.strictEqual(d.total, 5, 'forks are not counted');
  assert.deepStrictEqual(d.rows.map(x => x.date), ['Nov 04', 'Feb 01', 'Jan 02'], 'newest first, skips non-projects');
  assert.strictEqual(d.rows[1].name.length, 30, 'long names are cut');
  assert.deepStrictEqual(d.langs, [['Python', 2], ['C', 1]], 'counted and sorted');
  assert.strictEqual(build([r('a', '2026-01-01T00:00:00Z', 'C')]).file, build([r('a', '2026-01-01T00:00:00Z', 'C')]).file, 'same data, same file');
  console.log('update-feed tests passed');
}

if (process.argv[2] === '--test') test();
else main().catch(e => { console.error(e.message); process.exit(1); });
