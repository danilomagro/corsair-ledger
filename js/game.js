// ═══════════════════════════════════════════════════════════════════════════
//  CORSAIR LEDGER — single-file bundle (no ES modules, works via file://)
// ═══════════════════════════════════════════════════════════════════════════

// ─── DATA ────────────────────────────────────────────────────────────────────

const PORTS = {
  nassau:     { id: 'nassau',     name: 'Nassau',     x: 378, y: 88,  desc: 'Cuore dei Caraibi — porto libero' },
  havana:     { id: 'havana',     name: 'Havana',     x: 228, y: 182, desc: 'Fortezza spagnola di Cuba' },
  tortuga:    { id: 'tortuga',    name: 'Tortuga',    x: 508, y: 168, desc: 'Covo dei corsari di Hispaniola' },
  port_royal: { id: 'port_royal', name: 'Port Royal', x: 390, y: 256, desc: 'Porto britannico della Giamaica' },
};

const DANGER_COLOR = { 0: '#4a7c59', 1: '#b89a2a', 2: '#c87428', 3: '#8b2020' };
const DANGER_LABEL = { 0: 'Verde', 1: 'Giallo', 2: 'Arancione', 3: 'Rosso' };

const ROUTES = {
  nassau_havana: {
    id: 'nassau_havana', label: 'Nassau – Havana', ports: ['nassau', 'havana'],
    baseDanger: 0, enemyStrength: 8,
    missions: [
      { id: 'm_nh_1', name: 'Rum Run',        requiredCargo: {},               reward: { reales: 180, cargo: { wine: 3 } }, baseMinutes: 6 },
      { id: 'm_nh_2', name: 'Tobacco Route',  requiredCargo: { tobacco: 5 },   reward: { reales: 320, gemmes: 2 },          baseMinutes: 8 },
    ],
  },
  nassau_tortuga: {
    id: 'nassau_tortuga', label: 'Nassau – Tortuga', ports: ['nassau', 'tortuga'],
    baseDanger: 0, enemyStrength: 10,
    missions: [
      { id: 'm_nt_1', name: 'Island Crossing', requiredCargo: {},             reward: { reales: 150, cargo: { tobacco: 4 } }, baseMinutes: 5 },
      { id: 'm_nt_2', name: 'Cocoa Smuggle',   requiredCargo: { cocoa: 3 },   reward: { reales: 280, gemmes: 1 },             baseMinutes: 7 },
    ],
  },
  havana_tortuga: {
    id: 'havana_tortuga', label: 'Havana – Tortuga', ports: ['havana', 'tortuga'],
    baseDanger: 1, enemyStrength: 18,
    missions: [
      { id: 'm_ht_1', name: 'Spanish Passage', requiredCargo: { wine: 3 },    reward: { reales: 400, cargo: { cocoa: 5 } }, baseMinutes: 12 },
      { id: 'm_ht_2', name: 'War Supplies',     requiredCargo: {},             reward: { reales: 350, gemmes: 3 },           baseMinutes: 14 },
    ],
  },
  tortuga_port_royal: {
    id: 'tortuga_port_royal', label: 'Tortuga – Port Royal', ports: ['tortuga', 'port_royal'],
    baseDanger: 1, enemyStrength: 15,
    missions: [
      { id: 'm_tp_1', name: 'Merchant Run', requiredCargo: { tobacco: 8 },    reward: { reales: 500, gemmes: 2 },           baseMinutes: 10 },
      { id: 'm_tp_2', name: 'Contraband',   requiredCargo: {},                 reward: { reales: 300, cargo: { wine: 4 } }, baseMinutes: 11 },
    ],
  },
  havana_port_royal: {
    id: 'havana_port_royal', label: 'Havana – Port Royal', ports: ['havana', 'port_royal'],
    baseDanger: 2, enemyStrength: 28,
    missions: [
      { id: 'm_hp_1', name: 'Crown Jewels',  requiredCargo: { wine: 5, cocoa: 3 }, reward: { reales: 800, gemmes: 5, fireBarrels: 1 }, baseMinutes: 20 },
      { id: 'm_hp_2', name: 'Trade Convoy',  requiredCargo: { tobacco: 10 },       reward: { reales: 650, gemmes: 4 },                 baseMinutes: 22 },
    ],
  },
};

const SHIP_TYPES = {
  gunboat:  { name: 'Gunboat',  cargo: 10, firepower: 6,  hull: 8,  speed: 15, repairCost: 3 },
  schooner: { name: 'Schooner', cargo: 20, firepower: 8,  hull: 15, speed: 12, repairCost: 5 },
  brig:     { name: 'Brig',     cargo: 35, firepower: 14, hull: 22, speed: 9,  repairCost: 8 },
};

const CARGO_LABELS = { tobacco: 'Tabacco', wine: 'Vino', cocoa: 'Cacao' };

// Route unlock prerequisites: complete N missions on the required route to unlock.
const UNLOCK_CONDITIONS = {
  havana_tortuga:     { prereq: 'nassau_havana',  needed: 3 },
  tortuga_port_royal: { prereq: 'nassau_tortuga', needed: 3 },
  havana_port_royal:  { prereq: 'havana_tortuga', needed: 3 },
};

const INITIAL_STATE = {
  version: '1.1',
  player: { reales: 500, gemmes: 20, cargo: { tobacco: 5, wine: 5, cocoa: 3 }, fireBarrels: 1 },
  fleet: [
    { id: 'ship_001', name: 'La Speranza',  type: 'schooner', status: 'docked', damage: 0 },
    { id: 'ship_002', name: 'El Diablo',     type: 'gunboat',  status: 'docked', damage: 0 },
    { id: 'ship_003', name: 'San Cristóbal', type: 'gunboat',  status: 'docked', damage: 0 },
  ],
  routes: {
    nassau_havana:      { dangerLevel: 0, unlocked: true,  missionsCompleted: 0 },
    nassau_tortuga:     { dangerLevel: 0, unlocked: true,  missionsCompleted: 0 },
    havana_tortuga:     { dangerLevel: 1, unlocked: false, missionsCompleted: 0 },
    tortuga_port_royal: { dangerLevel: 1, unlocked: false, missionsCompleted: 0 },
    havana_port_royal:  { dangerLevel: 2, unlocked: false, missionsCompleted: 0 },
  },
  activeMissions: [],
  unlockedPorts: ['nassau', 'havana', 'tortuga', 'port_royal'],
  dockSlots: 5,
  eventLog: ['Benvenuto, Capitano. La flotta è in attesa dei tuoi ordini.'],
};

// ─── STATE ────────────────────────────────────────────────────────────────────

const SAVE_KEY = 'corsair_ledger_v1';
let state = null;

function loadState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    state = raw ? JSON.parse(raw) : deepClone(INITIAL_STATE);
    migrateSave();
  } catch (_) {
    state = deepClone(INITIAL_STATE);
  }
}

// Forward-migrate older saves to add new fields without losing progress.
function migrateSave() {
  Object.keys(state.routes).forEach(id => {
    if (state.routes[id].missionsCompleted === undefined)
      state.routes[id].missionsCompleted = 0;
  });
}

function saveState() {
  state.savedAt = new Date().toISOString();
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

function resetState() {
  if (!confirm('Sei sicuro? Tutti i progressi saranno cancellati.')) return false;
  state = deepClone(INITIAL_STATE);
  saveState();
  return true;
}

function exportSave() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = 'corsair-ledger-save.json'; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function importSave(file) {
  const text   = await file.text();
  const parsed = JSON.parse(text);
  if (!parsed.version || !parsed.player) throw new Error('File save non valido');
  state = parsed;
  saveState();
}

function addLog(msg) {
  const t = new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
  state.eventLog.unshift(`[${t}] ${msg}`);
  if (state.eventLog.length > 60) state.eventLog.length = 60;
}

function deepClone(obj) { return JSON.parse(JSON.stringify(obj)); }

// ─── GAME LOGIC ───────────────────────────────────────────────────────────────

function canAffordCargo(requiredCargo) {
  return Object.entries(requiredCargo).every(([t, a]) => (state.player.cargo[t] || 0) >= a);
}

function fleetCombatPower(shipIds) {
  return shipIds.reduce((sum, id) => {
    const ship = state.fleet.find(s => s.id === id);
    const st   = SHIP_TYPES[ship.type];
    return sum + st.firepower + st.hull;
  }, 0);
}

function calculateOdds(shipIds, routeId, fireBarrelsUsed) {
  if (state.routes[routeId].dangerLevel === 0) return 1;
  const playerPower = fleetCombatPower(shipIds) + (fireBarrelsUsed || 0) * 12;
  const enemyPower  = ROUTES[routeId].enemyStrength;
  return Math.min(0.98, playerPower / (playerPower + enemyPower));
}

function calcMissionMinutes(shipIds, baseMinutes) {
  if (!shipIds.length) return null;
  const avgSpeed = shipIds.reduce((s, id) => {
    const ship = state.fleet.find(sh => sh.id === id);
    return s + SHIP_TYPES[ship.type].speed;
  }, 0) / shipIds.length;
  return Math.max(1, Math.round(baseMinutes * (12 / avgSpeed)));
}

function launchMission({ routeId, missionId, shipIds, fireBarrelsUsed }) {
  const routeData  = ROUTES[routeId];
  const mission    = routeData.missions.find(m => m.id === missionId);
  const routeState = state.routes[routeId];

  Object.entries(mission.requiredCargo).forEach(([t, a]) => { state.player.cargo[t] -= a; });
  state.player.fireBarrels -= (fireBarrelsUsed || 0);

  let battleResult = null; // populated only if a battle was fought

  if (routeState.dangerLevel > 0) {
    const won = Math.random() < calculateOdds(shipIds, routeId, fireBarrelsUsed);
    if (won) {
      routeState.dangerLevel -= 1;
      battleResult = { outcome: 'victory', routeLabel: routeData.label, newDangerLabel: DANGER_LABEL[routeState.dangerLevel] };
      addLog(`⚔ Battaglia vinta su ${routeData.label}! Pericolo → ${battleResult.newDangerLabel}.`);
    } else {
      const victimId = shipIds[Math.floor(Math.random() * shipIds.length)];
      const victim   = state.fleet.find(s => s.id === victimId);
      victim.status  = 'damaged';
      addLog(`⚔ Battaglia persa su ${routeData.label}. ${victim.name} è danneggiata!`);
      saveState();
      return { success: false, battle: { outcome: 'defeat', routeLabel: routeData.label, damagedShip: victim.name } };
    }
  }

  shipIds.forEach(id => { state.fleet.find(s => s.id === id).status = 'at_sea'; });

  const minutes     = calcMissionMinutes(shipIds, mission.baseMinutes);
  const completesAt = Date.now() + minutes * 60 * 1000;

  state.activeMissions.push({
    id: `am_${Date.now()}`, routeId, missionId, shipIds, completesAt,
    reward: mission.reward, missionName: mission.name, routeLabel: routeData.label,
  });

  addLog(`⛵ ${mission.name} avviata su ${routeData.label} (${minutes} min).`);
  saveState();
  return { success: true, minutes, battle: battleResult };
}

function collectMission(activeMissionId) {
  const idx = state.activeMissions.findIndex(m => m.id === activeMissionId);
  if (idx === -1) return;
  const am = state.activeMissions[idx];
  const { reward } = am;

  if (reward.reales)      state.player.reales      += reward.reales;
  if (reward.gemmes)      state.player.gemmes      += reward.gemmes;
  if (reward.fireBarrels) state.player.fireBarrels += reward.fireBarrels;
  if (reward.cargo) {
    Object.entries(reward.cargo).forEach(([t, a]) => {
      state.player.cargo[t] = (state.player.cargo[t] || 0) + a;
    });
  }

  am.shipIds.forEach(id => {
    const ship = state.fleet.find(s => s.id === id);
    if (ship && ship.status === 'at_sea') ship.status = 'docked';
  });
  state.activeMissions.splice(idx, 1);

  const parts = [
    reward.reales      ? `${reward.reales} Reales`  : '',
    reward.gemmes      ? `${reward.gemmes} Gemmes`  : '',
    reward.fireBarrels ? `${reward.fireBarrels} 🔥` : '',
    reward.cargo ? Object.entries(reward.cargo).map(([t, a]) => `${a} ${CARGO_LABELS[t]}`).join(', ') : '',
  ].filter(Boolean).join(' + ');

  // Track progress and check for route unlocks
  const rs = state.routes[am.routeId];
  if (rs) rs.missionsCompleted = (rs.missionsCompleted || 0) + 1;
  checkRouteUnlocks();

  addLog(`✅ ${am.missionName} completata! Bottino: ${parts}`);
  saveState();
}

function checkRouteUnlocks() {
  Object.entries(UNLOCK_CONDITIONS).forEach(([routeId, { prereq, needed }]) => {
    const rs = state.routes[routeId];
    if (rs.unlocked) return;
    const done = state.routes[prereq]?.missionsCompleted || 0;
    if (done >= needed) {
      rs.unlocked = true;
      addLog(`🗺 Nuova rotta sbloccata: ${ROUTES[routeId].label}!`);
    }
  });
}

function repairShip(shipId) {
  const ship = state.fleet.find(s => s.id === shipId);
  if (!ship || ship.status !== 'damaged') return;
  const cost = SHIP_TYPES[ship.type].repairCost;
  if (state.player.gemmes < cost) {
    addLog(`❌ Gemmes insufficienti per riparare ${ship.name} (servono ${cost} ◆).`);
    return;
  }
  state.player.gemmes -= cost;
  ship.status = 'docked'; ship.damage = 0;
  addLog(`🔧 ${ship.name} riparata per ${cost} ◆.`);
  saveState();
}

function getActiveMissionsWithTime() {
  const now = Date.now();
  return state.activeMissions.map(m => ({
    ...m,
    msRemaining: Math.max(0, m.completesAt - now),
    ready: m.completesAt <= now,
  }));
}

// ─── RENDER ───────────────────────────────────────────────────────────────────

let selectedRouteId   = null;
let selectedMissionId = null;
let selectedShipIds   = new Set();
let fireBarrelsUsed   = 0;
let lastBattleResult  = null; // { outcome, routeLabel, damagedShip?, newDangerLabel? }

function setSelectedRoute(routeId) {
  selectedRouteId   = routeId;
  selectedMissionId = null;
  selectedShipIds.clear();
  fireBarrelsUsed   = 0;
}

function clearSelection() {
  selectedRouteId = null; selectedMissionId = null;
  selectedShipIds.clear(); fireBarrelsUsed = 0;
}

function renderAll() {
  renderHeader();
  renderMap();
  renderFleet();
  renderPanel();
  renderInventory();
}

function renderHeader() {
  document.getElementById('res-reales').textContent  = state.player.reales.toLocaleString('it-IT');
  document.getElementById('res-gemmes').textContent  = state.player.gemmes;
  document.getElementById('res-barrels').textContent = state.player.fireBarrels;
}

// SVG helpers
const SVG_NS = 'http://www.w3.org/2000/svg';
function svgEl(tag)         { return document.createElementNS(SVG_NS, tag); }
function svgAttr(el, attrs) { Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v)); }
function svgLine(parent, x1, y1, x2, y2, stroke, opacity) {
  const l = svgEl('line');
  svgAttr(l, { x1, y1, x2, y2, stroke, 'stroke-width': 1, opacity });
  parent.appendChild(l);
}
function svgText(parent, txt, x, y, attrs) {
  const t = svgEl('text'); svgAttr(t, { x, y, ...attrs }); t.textContent = txt;
  parent.appendChild(t); return t;
}

function renderMap() {
  const container = document.getElementById('map-container');
  const now       = Date.now();
  const svg       = svgEl('svg');
  svgAttr(svg, { viewBox: '0 0 760 310', id: 'map-svg', preserveAspectRatio: 'xMidYMid meet' });

  // ── Defs ──────────────────────────────────────────────────────────────────
  const defs = svgEl('defs');

  // Sea gradient (aged, desaturated blue)
  const seaGrad = svgEl('linearGradient');
  svgAttr(seaGrad, { id: 'sea-grad', x1: '10%', y1: '0%', x2: '90%', y2: '100%' });
  [['0%','#c0d2de'],['50%','#aec4d0'],['100%','#9ab4c4']].forEach(([off,clr]) => {
    const s = svgEl('stop'); svgAttr(s, { offset: off, 'stop-color': clr }); seaGrad.appendChild(s);
  });
  defs.appendChild(seaGrad);

  // Wave hatching pattern
  const wavePat = svgEl('pattern');
  svgAttr(wavePat, { id: 'wave-pat', x: 0, y: 0, width: 48, height: 18,
    patternUnits: 'userSpaceOnUse' });
  const wp = svgEl('path');
  svgAttr(wp, { d: 'M0,9 Q6,4 12,9 Q18,14 24,9 Q30,4 36,9 Q42,14 48,9',
    stroke: '#6a90a8', 'stroke-width': 0.55, fill: 'none' });
  wavePat.appendChild(wp);
  defs.appendChild(wavePat);

  svg.appendChild(defs);

  // ── Sea background ────────────────────────────────────────────────────────
  const bg = svgEl('rect');
  svgAttr(bg, { width: 760, height: 310, fill: 'url(#sea-grad)' });
  svg.appendChild(bg);

  // Wave overlay
  const waveRect = svgEl('rect');
  svgAttr(waveRect, { width: 760, height: 310, fill: 'url(#wave-pat)', opacity: 0.45 });
  svg.appendChild(waveRect);

  // ── Cartographic double-line border ──────────────────────────────────────
  const fr1 = svgEl('rect');
  svgAttr(fr1, { x: 4, y: 4, width: 752, height: 302, fill: 'none',
    stroke: '#30505e', 'stroke-width': 2.5, opacity: 0.45 });
  svg.appendChild(fr1);
  const fr2 = svgEl('rect');
  svgAttr(fr2, { x: 9, y: 9, width: 742, height: 292, fill: 'none',
    stroke: '#30505e', 'stroke-width': 0.8, opacity: 0.25 });
  svg.appendChild(fr2);

  // ── Navigation grid (latitude / longitude lines) ──────────────────────────
  for (let x = 76; x < 760; x += 76) svgLine(svg, x, 0, x, 310, '#305870', 0.15);
  for (let y = 62; y < 310; y += 62) svgLine(svg, 0, y, 760, y, '#305870', 0.15);

  // ── Land masses (SVG paths — stylised 1700s cartography) ──────────────────
  const lf = '#c8b068', ls = '#7a5c18';

  // Cuba — large elongated island (Havana at 228,182)
  const cuba = svgEl('path');
  svgAttr(cuba, {
    d: 'M118,180 C138,170 162,168 186,170 C206,171 224,174 244,176 C264,178 284,177 304,182 C318,187 320,194 308,198 C290,203 266,201 242,198 C218,195 194,191 170,188 C148,186 126,188 114,185 Z',
    fill: lf, stroke: ls, 'stroke-width': 1.2, opacity: 0.90,
  });
  svg.appendChild(cuba);

  // Hispaniola — near Tortuga (508,168)
  const hisp = svgEl('path');
  svgAttr(hisp, {
    d: 'M452,178 C465,170 482,168 500,169 C518,168 536,172 551,179 C558,187 551,197 534,200 C516,202 496,200 478,196 C462,192 448,190 446,185 Z',
    fill: lf, stroke: ls, 'stroke-width': 1.2, opacity: 0.90,
  });
  svg.appendChild(hisp);

  // Jamaica — Port Royal at (390,256)
  const jamaica = svgEl('path');
  svgAttr(jamaica, {
    d: 'M358,254 C368,248 381,246 395,248 C407,247 417,252 422,259 C415,268 400,270 386,268 C372,266 360,262 354,258 Z',
    fill: lf, stroke: ls, 'stroke-width': 1.2, opacity: 0.90,
  });
  svg.appendChild(jamaica);

  // New Providence / Bahamas — Nassau at (378,88)
  const nassauIsle = svgEl('path');
  svgAttr(nassauIsle, {
    d: 'M364,88 C371,82 382,80 394,82 C404,81 411,86 412,93 C404,99 392,99 380,97 C368,96 360,93 358,89 Z',
    fill: lf, stroke: ls, 'stroke-width': 1.2, opacity: 0.86,
  });
  svg.appendChild(nassauIsle);

  // Scatter of small cays and islets for atmosphere
  [
    'M330,118 Q337,114 343,116 Q347,119 344,123 Q337,124 331,121 Z',
    'M447,134 Q453,130 458,132 Q461,136 457,139 Q450,140 446,137 Z',
    'M568,197 Q574,193 580,195 Q583,199 578,202 Q571,202 566,199 Z',
    'M617,138 Q622,135 626,137 Q628,141 624,143 Q618,143 615,140 Z',
    'M160,237 Q165,233 169,235 Q171,238 167,241 Q161,241 158,238 Z',
    'M597,249 Q601,246 605,248 Q607,251 603,253 Q598,253 595,250 Z',
    'M680,190 Q684,187 688,189 Q689,192 686,194 Q681,194 679,191 Z',
  ].forEach(d => {
    const isle = svgEl('path');
    svgAttr(isle, { d, fill: lf, stroke: ls, 'stroke-width': 0.8, opacity: 0.62 });
    svg.appendChild(isle);
  });

  // ── Routes ────────────────────────────────────────────────────────────────
  Object.values(ROUTES).forEach(route => {
    const [p1id, p2id] = route.ports;
    const p1 = PORTS[p1id], p2 = PORTS[p2id];
    const routeState = state.routes[route.id];
    const mx = (p1.x + p2.x) / 2;
    const my = (p1.y + p2.y) / 2;

    if (!routeState.unlocked) {
      const cond   = UNLOCK_CONDITIONS[route.id];
      const done   = cond ? (state.routes[cond.prereq]?.missionsCompleted || 0) : 0;
      const needed = cond?.needed || 3;
      const lockedLine = svgEl('line');
      svgAttr(lockedLine, { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y,
        stroke: '#607888', 'stroke-width': 1.2, 'stroke-dasharray': '3,10', opacity: 0.28 });
      svg.appendChild(lockedLine);
      svgText(svg, `⚿ ${done}/${needed}`, mx, my + 4, {
        'text-anchor': 'middle', 'font-size': 10, fill: '#3a4a55',
        'font-family': 'Georgia, serif', 'font-style': 'italic', opacity: 0.55,
      });
      return;
    }

    const dl    = routeState.dangerLevel;
    const color = DANGER_COLOR[dl];
    const isSel = route.id === selectedRouteId;
    const active = state.activeMissions.some(m => m.routeId === route.id);
    const ready  = state.activeMissions.find(m => m.routeId === route.id && m.completesAt <= now);

    // Nautical dotted line (classic chart style)
    const line = svgEl('line');
    svgAttr(line, { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y,
      stroke: color, 'stroke-width': isSel ? 3.5 : 2.2,
      'stroke-dasharray': isSel ? '3,6' : '2,9',
      'stroke-linecap': 'round', opacity: isSel ? 1.0 : 0.68 });
    svg.appendChild(line);

    // Invisible hit zone
    const hit = svgEl('line');
    svgAttr(hit, { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y,
      stroke: 'transparent', 'stroke-width': 24,
      class: 'route-hit', 'data-route': route.id, cursor: 'pointer' });
    svg.appendChild(hit);

    if (active) {
      const pulse = svgEl('circle');
      svgAttr(pulse, { cx: mx, cy: my, r: 9, fill: '#f0e8c4', stroke: color,
        'stroke-width': 1.5, class: 'mission-pulse' });
      svg.appendChild(pulse);
      svgText(svg, '⛵', mx, my + 5, { 'text-anchor': 'middle', 'font-size': 11 });
    }

    if (ready) {
      svgText(svg, '✓ PRONTA', mx, my - (active ? 18 : 6), {
        'text-anchor': 'middle', 'font-size': 9.5, fill: '#3a6a48',
        'font-weight': 'bold', 'font-family': 'Georgia, serif', 'letter-spacing': 1,
      });
    }
  });

  // ── Port markers ──────────────────────────────────────────────────────────
  Object.values(PORTS).forEach(port => {
    if (!state.unlockedPorts.includes(port.id)) return;
    // Outer decorative ring
    const ring = svgEl('circle');
    svgAttr(ring, { cx: port.x, cy: port.y, r: 14, fill: 'none',
      stroke: '#2c1810', 'stroke-width': 0.8, opacity: 0.30 });
    svg.appendChild(ring);
    // Filled inner circle
    const c = svgEl('circle');
    svgAttr(c, { cx: port.x, cy: port.y, r: 9, fill: '#f0e8c4',
      stroke: '#2c1810', 'stroke-width': 1.8 });
    svg.appendChild(c);
    svgText(svg, '⚓', port.x, port.y + 4.5, { 'text-anchor': 'middle', 'font-size': 9 });
    svgText(svg, port.name.toUpperCase(), port.x, port.y + 27, {
      'text-anchor': 'middle', 'font-size': 9.5, fill: '#1a0e08',
      'font-weight': 'bold', 'font-family': 'Georgia, serif', 'letter-spacing': 1.5,
    });
  });

  // ── Compass Rose ──────────────────────────────────────────────────────────
  const ccx = 706, ccy = 56;
  // Background fill
  const cpBg = svgEl('circle');
  svgAttr(cpBg, { cx: ccx, cy: ccy, r: 30, fill: '#f0e8c4',
    stroke: '#8b6914', 'stroke-width': 0.8, opacity: 0.82 });
  svg.appendChild(cpBg);
  // Outer decorative ring
  const cpRing = svgEl('circle');
  svgAttr(cpRing, { cx: ccx, cy: ccy, r: 34, fill: 'none',
    stroke: '#8b6914', 'stroke-width': 0.8, opacity: 0.42 });
  svg.appendChild(cpRing);
  // Inner reference ring
  const cpMid = svgEl('circle');
  svgAttr(cpMid, { cx: ccx, cy: ccy, r: 15, fill: 'none',
    stroke: '#2c1810', 'stroke-width': 0.5, opacity: 0.22 });
  svg.appendChild(cpMid);
  // 8-point diamond star
  [0, 45, 90, 135, 180, 225, 270, 315].forEach(deg => {
    const isCard  = deg % 90 === 0;
    const rad     = (deg - 90) * Math.PI / 180;
    const perpR   = rad + Math.PI / 2;
    const tipLen  = isCard ? 26 : 16;
    const sw      = isCard ? 5.5 : 3.5;
    const tipX    = ccx + tipLen * Math.cos(rad);
    const tipY    = ccy + tipLen * Math.sin(rad);
    const s1x = ccx + sw * Math.cos(perpR), s1y = ccy + sw * Math.sin(perpR);
    const s2x = ccx - sw * Math.cos(perpR), s2y = ccy - sw * Math.sin(perpR);
    const poly = svgEl('polygon');
    svgAttr(poly, {
      points: `${tipX.toFixed(1)},${tipY.toFixed(1)} ${s1x.toFixed(1)},${s1y.toFixed(1)} ${ccx},${ccy} ${s2x.toFixed(1)},${s2y.toFixed(1)}`,
      fill: deg === 0 ? '#8b2020' : (isCard ? '#2c1810' : '#f0e8c4'),
      stroke: '#2c1810', 'stroke-width': 0.5, opacity: 0.88,
    });
    svg.appendChild(poly);
  });
  // Center dot
  const cd1 = svgEl('circle'); svgAttr(cd1, { cx: ccx, cy: ccy, r: 3.5, fill: '#8b6914' }); svg.appendChild(cd1);
  const cd2 = svgEl('circle'); svgAttr(cd2, { cx: ccx, cy: ccy, r: 1.5, fill: '#f0e8c4' }); svg.appendChild(cd2);
  // Cardinal labels
  [['N', ccx, ccy - 37], ['S', ccx, ccy + 43], ['E', ccx + 41, ccy + 4], ['W', ccx - 38, ccy + 4]].forEach(([lbl, lx, ly]) => {
    svgText(svg, lbl, lx, ly, {
      'text-anchor': 'middle', 'font-size': 9, 'font-weight': 'bold',
      fill: lbl === 'N' ? '#8b2020' : '#1a0e08',
      'font-family': 'Georgia, serif', opacity: 0.88,
    });
  });

  // ── Cartouche (map title box) ─────────────────────────────────────────────
  const cRect = svgEl('rect');
  svgAttr(cRect, { x: 14, y: 274, width: 250, height: 26, rx: 2,
    fill: '#f0e8c4', stroke: '#8b6914', 'stroke-width': 0.8, opacity: 0.82 });
  svg.appendChild(cRect);
  svgText(svg, 'MARE CARIBAEUM', 139, 284, {
    'text-anchor': 'middle', 'font-size': 8.5, fill: '#3a2808',
    'font-family': 'Georgia, serif', 'font-style': 'italic', 'letter-spacing': 2.5,
  });
  svgText(svg, 'Anno Domini MDCCXVIII', 139, 295, {
    'text-anchor': 'middle', 'font-size': 7.5, fill: '#5a3818',
    'font-family': 'Georgia, serif', 'font-style': 'italic',
  });

  container.innerHTML = '';
  container.appendChild(svg);

  svg.querySelectorAll('.route-hit').forEach(node => {
    node.addEventListener('click', e => {
      const rid = e.currentTarget.getAttribute('data-route');
      setSelectedRoute(rid === selectedRouteId ? null : rid);
      renderAll();
    });
  });
}

function renderFleet() {
  const container = document.getElementById('fleet-list');
  if (!container) return;
  container.innerHTML = state.fleet.map(ship => {
    const st      = SHIP_TYPES[ship.type];
    const cls     = ship.status === 'at_sea' ? 'at-sea' : ship.status === 'damaged' ? 'damaged' : 'docked';
    const lbl     = ship.status === 'at_sea' ? '⛵ In missione' : ship.status === 'damaged' ? '🔴 Danneggiata' : '⚓ In porto';
    return `<div class="ship-card ${cls}">
      <div class="ship-header">
        <span class="ship-name">${ship.name}</span>
        <span class="ship-type-badge">${st.name}</span>
      </div>
      <div class="ship-stats">
        <span title="Cargo">📦 ${st.cargo}</span>
        <span title="Firepower">💥 ${st.firepower}</span>
        <span title="Hull">🛡 ${st.hull}</span>
        <span title="Speed">💨 ${st.speed}</span>
      </div>
      <div class="ship-status ${cls}">${lbl}</div>
      ${ship.status === 'damaged'
        ? `<button class="btn-repair" data-ship="${ship.id}">🔧 Ripara (${st.repairCost} ◆)</button>`
        : ''}
    </div>`;
  }).join('');
  container.querySelectorAll('.btn-repair').forEach(btn => {
    btn.addEventListener('click', () => { repairShip(btn.dataset.ship); renderAll(); });
  });
}

function renderPanel() {
  const container = document.getElementById('detail-content');
  if (!container) return;
  if (lastBattleResult) { renderBattleResult(container, lastBattleResult); return; }
  if (!selectedRouteId) { renderActiveMissionsPanel(container); return; }
  const route      = ROUTES[selectedRouteId];
  const routeState = state.routes[selectedRouteId];
  const dl         = routeState.dangerLevel;
  const color      = DANGER_COLOR[dl];
  const dlabel     = DANGER_LABEL[dl];
  selectedMissionId ? renderMissionDetail(container, route, dl, color, dlabel)
                    : renderRouteOverview(container, route, dl, color, dlabel);
}

function renderRouteOverview(container, route, dl, color, dlabel) {
  const amList = getActiveMissionsWithTime().filter(m => m.routeId === route.id);
  const dangerDescText = ['Acque sicure. Nessun ostacolo al commercio.',
    'Qualche pericolo — raccomandata una scorta armata.',
    'Rotta pericolosa. Prepara la flotta alla battaglia.',
    'Zona di guerra. Solo le navi più forti sopravvivono.'][dl] || '';

  let html = `<div class="panel-route-header">
    <h3>${route.label}</h3>
    <span class="danger-badge" style="--dc:${color}">● ${dlabel}</span>
  </div>
  <p class="route-desc">${dangerDescText}</p>`;

  if (amList.length) html += `<div class="active-missions-list">${amList.map(activeMissionCardHtml).join('')}</div>`;

  html += `<h4 class="missions-title">Missioni disponibili</h4>`;
  route.missions.forEach(m => {
    const ok     = canAffordCargo(m.requiredCargo);
    const reqStr = Object.entries(m.requiredCargo).map(([t, a]) => `${a} ${CARGO_LABELS[t]}`).join(', ') || 'Nessun cargo';
    html += `<div class="mission-card ${ok ? '' : 'unaffordable'}">
      <div class="mission-name">${m.name}</div>
      <div class="mission-info">🧳 ${reqStr}</div>
      <div class="mission-info">💰 ${rewardStr(m.reward)}</div>
      <div class="mission-info">⏱ ~${m.baseMinutes} min (base)</div>
      <button class="btn-select-mission" data-mission="${m.id}" ${ok ? '' : 'disabled'}>
        ${ok ? 'Seleziona' : '⚠ Cargo insufficiente'}
      </button>
    </div>`;
  });

  container.innerHTML = html;
  container.querySelectorAll('.btn-select-mission').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedMissionId = btn.dataset.mission; selectedShipIds.clear(); fireBarrelsUsed = 0;
      renderPanel();
    });
  });
  container.querySelectorAll('.btn-collect').forEach(btn => {
    btn.addEventListener('click', () => { collectMission(btn.dataset.am); renderAll(); });
  });
}

function renderMissionDetail(container, route, dl, color, dlabel) {
  const mission   = route.missions.find(m => m.id === selectedMissionId);
  const dangerous = dl > 0;
  const docked    = state.fleet.filter(s => s.status === 'docked');
  const available = state.fleet.filter(s => s.status !== 'at_sea'); // docked + damaged
  const selArr    = [...selectedShipIds];
  const odds      = (selArr.length && dangerous) ? calculateOdds(selArr, route.id, fireBarrelsUsed) : null;
  const minutes   = selArr.length ? calcMissionMinutes(selArr, mission.baseMinutes) : null;

  const reqHtml = Object.entries(mission.requiredCargo).length === 0 ? '—'
    : Object.entries(mission.requiredCargo).map(([t, a]) => {
        const has = state.player.cargo[t] || 0;
        return `${a} ${CARGO_LABELS[t]} <span class="${has >= a ? 'ok' : 'err'}">(hai ${has})</span>`;
      }).join(', ');

  let html = `<div class="panel-route-header">
    <button class="btn-back">← Indietro</button>
    <h3>${mission.name}</h3>
  </div>
  <div class="mission-meta">
    <span>${route.label}</span>
    <span class="danger-badge" style="--dc:${color}">● ${dlabel}</span>
  </div>
  <div class="mission-req">🧳 ${reqHtml}</div>
  <div class="mission-req">💰 ${rewardStr(mission.reward)}</div>`;

  if (dangerous) html += `<div class="battle-warning">⚔ Rotta pericolosa — si combatte prima di commerciare. Forza nemica: <strong>${route.enemyStrength}</strong></div>`;

  html += `<h4 class="ship-select-title">Seleziona le navi:</h4>`;
  if (!available.length) {
    html += `<p class="no-ships">Nessuna nave disponibile in porto.</p>`;
  } else {
    available.forEach(ship => {
      const st       = SHIP_TYPES[ship.type];
      const chk      = selectedShipIds.has(ship.id);
      const isDamaged = ship.status === 'damaged';
      html += `<label class="ship-select ${chk ? 'selected' : ''} ${isDamaged ? 'unavailable' : ''}">
        <input type="checkbox" data-ship="${ship.id}" ${chk ? 'checked' : ''} ${isDamaged ? 'disabled' : ''}>
        <span class="ship-name">${ship.name}</span>
        <span class="ship-type-badge">${st.name}</span>
        <span class="ship-mini-stats">💥${st.firepower} 🛡${st.hull} 💨${st.speed}</span>
        ${isDamaged ? `<span class="ship-unavail-reason">🔴 Danneggiata — ripara prima (${st.repairCost} ◆)</span>` : ''}
      </label>`;
    });
  }

  if (dangerous && selArr.length) {
    const pct      = Math.round(odds * 100);
    const barColor = pct >= 70 ? '#4a7c59' : pct >= 45 ? '#b89a2a' : '#8b2020';
    const fp       = fleetCombatPower(selArr) + fireBarrelsUsed * 12;
    html += `<div class="odds-section">
      <div class="odds-label">Potenza flotta: <strong>${fp}</strong> vs Nemico: <strong>${route.enemyStrength}</strong></div>
      <div class="odds-bar-wrap"><div class="odds-bar-fill" style="width:${pct}%;background:${barColor}"></div></div>
      <div class="odds-pct" style="color:${barColor}">${pct}% di vittoria</div>
    </div>`;
  }

  if (dangerous) {
    html += `<div class="fire-barrel-row">🔥 Fire Barrels:
      <button class="btn-fb" data-act="minus">−</button>
      <span class="fb-val">${fireBarrelsUsed}</span>
      <button class="btn-fb" data-act="plus">+</button>
      <span class="fb-stock">(hai ${state.player.fireBarrels})</span>
      ${fireBarrelsUsed ? `<span class="fb-bonus">+${fireBarrelsUsed * 12} potenza</span>` : ''}
    </div>`;
  }

  if (minutes !== null) html += `<div class="time-estimate">⏱ Tempo stimato: <strong>${minutes} min</strong></div>`;

  html += `<button class="btn-launch" ${selArr.length ? '' : 'disabled'}>
    ${selArr.length ? '⛵ Lancia Missione' : 'Seleziona almeno una nave'}
  </button>`;

  container.innerHTML = html;

  container.querySelector('.btn-back')?.addEventListener('click', () => { selectedMissionId = null; renderPanel(); });
  container.querySelectorAll('input[type=checkbox][data-ship]').forEach(cb => {
    cb.addEventListener('change', () => {
      cb.checked ? selectedShipIds.add(cb.dataset.ship) : selectedShipIds.delete(cb.dataset.ship);
      renderPanel();
    });
  });
  container.querySelectorAll('.btn-fb').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.act === 'plus'  && fireBarrelsUsed < state.player.fireBarrels) fireBarrelsUsed++;
      if (btn.dataset.act === 'minus' && fireBarrelsUsed > 0) fireBarrelsUsed--;
      renderPanel();
    });
  });
  container.querySelector('.btn-launch')?.addEventListener('click', () => {
    if (!selArr.length) return;
    const result = launchMission({ routeId: selectedRouteId, missionId: selectedMissionId, shipIds: [...selectedShipIds], fireBarrelsUsed });
    if (result.battle) {
      lastBattleResult = result.battle;
      // On defeat keep selectedRoute so the "Continua" button can return to it;
      // on victory same — user sees the result, then goes back to route overview.
      if (result.success) setSelectedRoute(selectedRouteId);
    } else if (result.success) {
      setSelectedRoute(selectedRouteId);
    }
    renderAll();
  });
}

function renderBattleResult(container, battle) {
  const isVictory = battle.outcome === 'victory';
  container.innerHTML = `
    <div class="battle-result ${isVictory ? 'victory' : 'defeat'}">
      <div class="battle-result-header">
        <span class="battle-route">⚔ Battaglia — ${battle.routeLabel}</span>
      </div>
      <div class="battle-result-outcome">
        ${isVictory ? '⚔ VITTORIA' : '💀 SCONFITTA'}
      </div>
      <div class="battle-result-body">
        ${isVictory
          ? `Nemici respinti. Pericolo ridotto a <strong>${battle.newDangerLabel}</strong>.<br>La missione è partita.`
          : `<strong>${battle.damagedShip}</strong> è stata colpita nel combattimento.<br>La flotta si ritira in porto.`
        }
      </div>
      <button class="btn-battle-continue">Continua</button>
    </div>`;
  container.querySelector('.btn-battle-continue').addEventListener('click', () => {
    lastBattleResult = null;
    renderAll();
  });
}

function renderActiveMissionsPanel(container) {
  const missions = getActiveMissionsWithTime();
  if (!missions.length) {
    container.innerHTML = `<p class="placeholder">Seleziona una rotta sulla mappa per iniziare.</p>`;
    return;
  }
  container.innerHTML = `<h3>Missioni in corso</h3>
    <div class="active-missions-list">${missions.map(activeMissionCardHtml).join('')}</div>`;
  container.querySelectorAll('.btn-collect').forEach(btn => {
    btn.addEventListener('click', () => { collectMission(btn.dataset.am); renderAll(); });
  });
}

function activeMissionCardHtml(am) {
  const mins = Math.floor(am.msRemaining / 60000);
  const secs = Math.floor((am.msRemaining % 60000) / 1000);
  const timeHtml = am.ready
    ? `<span class="ready-text">✅ Pronta al ritiro</span>`
    : `<span class="countdown">${mins}:${String(secs).padStart(2, '0')} rimanenti</span>`;
  return `<div class="active-mission-card ${am.ready ? 'ready' : ''}">
    <div class="am-name">${am.missionName}</div>
    <div class="am-route">${am.routeLabel}</div>
    <div class="am-time">${timeHtml}</div>
    <div class="am-reward">💰 ${rewardStr(am.reward)}</div>
    ${am.ready ? `<button class="btn-collect" data-am="${am.id}">Ritira bottino</button>` : ''}
  </div>`;
}

function renderInventory() {
  const el = document.getElementById('inventory-display');
  if (!el) return;
  const { cargo } = state.player;
  el.innerHTML = `<span class="inv-label">Stiva ·</span>`
    + Object.entries(CARGO_LABELS)
        .map(([k, lbl]) => `<span class="cargo-item">${lbl}: <strong>${cargo[k] || 0}</strong></span>`)
        .join('');
}

function renderLog() {
  const c = document.getElementById('log-content');
  if (!c) return;
  c.innerHTML = state.eventLog.map(e => `<div class="log-entry">${e}</div>`).join('');
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function rewardStr(reward) {
  return [
    reward.reales      ? `${reward.reales} Reales`  : '',
    reward.gemmes      ? `${reward.gemmes} ◆`        : '',
    reward.fireBarrels ? `${reward.fireBarrels} 🔥`  : '',
    reward.cargo ? Object.entries(reward.cargo).map(([t, a]) => `${a} ${CARGO_LABELS[t]}`).join(', ') : '',
  ].filter(Boolean).join(' + ');
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  loadState();
  renderAll();
  setInterval(renderAll, 1000);

  document.getElementById('btn-save-export').addEventListener('click', exportSave);

  document.getElementById('import-file').addEventListener('change', async e => {
    const file = e.target.files[0]; if (!file) return;
    try { await importSave(file); clearSelection(); renderAll(); }
    catch (err) { alert('Errore import: ' + err.message); }
    e.target.value = '';
  });

  document.getElementById('btn-reset').addEventListener('click', () => {
    if (resetState()) { clearSelection(); renderAll(); }
  });

  const logPanel = document.getElementById('log-panel');
  document.getElementById('btn-log').addEventListener('click', () => {
    logPanel.classList.toggle('hidden'); renderLog();
  });
  document.getElementById('btn-close-log').addEventListener('click', () => {
    logPanel.classList.add('hidden');
  });
});
