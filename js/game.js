// ═══════════════════════════════════════════════════════════════════════════
//  CORSAIR LEDGER — single-file bundle (no ES modules, works via file://)
// ═══════════════════════════════════════════════════════════════════════════

// ─── DATA ────────────────────────────────────────────────────────────────────

// Port coordinates for procedural SVG map — viewBox 0 0 880 300.
// Americas strip x≈0-97, Caribbean cluster x≈140-260, Atlantic centre,
// Cape Verde x≈590, Africa coast x≈722-880.
const PORTS = {
  // ── Caraibi ──
  nassau:     { id: 'nassau',     name: 'Nassau',     x: 200, y: 145, desc: 'Cuore dei Caraibi — porto libero' },
  havana:     { id: 'havana',     name: 'Havana',     x: 152, y: 175, desc: 'Fortezza spagnola di Cuba' },
  tortuga:    { id: 'tortuga',    name: 'Tortuga',    x: 250, y: 162, desc: 'Covo dei corsari di Hispaniola' },
  port_royal: { id: 'port_royal', name: 'Port Royal', x: 205, y: 213, desc: 'Porto britannico della Giamaica' },
  // ── Costa Americana ──
  charleston: { id: 'charleston', name: 'Charleston', x:  75, y: 115, desc: 'Porto coloniale della Carolina del Sud' },
  boston:     { id: 'boston',     name: 'Boston',     x:  88, y:  58, desc: 'Capitale del commercio del New England' },
  // ── Africa Occidentale ──
  dakar:      { id: 'dakar',      name: 'Dakar',      x: 720, y: 192, desc: 'Porto senegalese sull\'Atlantico' },
  cape_verde: { id: 'cape_verde', name: 'Capo Verde', x: 590, y: 188, desc: 'Isole atlantiche — crocevia dei mari' },
};

const DANGER_COLOR = { 0: '#3aaa60', 1: '#d4b030', 2: '#e07820', 3: '#cc2424' };
const DANGER_LABEL = { 0: 'Verde', 1: 'Giallo', 2: 'Arancione', 3: 'Rosso' };

// Quadratic bezier control points for each route — one unique arc per route so
// overlapping routes in the Caribbean cluster are always visually separable.
// Format: [cx, cy]  →  SVG path: M x1 y1 Q cx cy x2 y2
// Bezier midpoint (t=0.5): bx = 0.25*x1 + 0.5*cx + 0.25*x2 (same for y)
// Control points redesigned for ~100px distance from chord midpoint (≈50px visual
// deviation). Opposite perpendicular directions on parallel/adjacent routes.
// Bezier deviation = 0.5 × dist(Pc, chord_midpoint).
const ROUTE_CURVES = {
  // Caribbean cluster — each edge fans hard outward from the diamond
  nassau_havana:         [123,  75],  // NW arc  (chord-mid≈176,160 → ~100px NW)
  nassau_tortuga:        [225,  54],  // N  arc  (chord-mid≈225,154 → ~100px N)
  havana_tortuga:        [265, 265],  // SE arc  (chord-mid≈201,169 → ~115px SE, clears PortRoyal)
  tortuga_port_royal:    [328, 188],  // E  arc  (chord-mid≈228,188 → ~100px E)
  havana_port_royal:     [ 78, 194],  // W  arc  (chord-mid≈179,194 → ~101px W)
  // American coast — upper N arc vs deep S arc, ~134px separation at midpoints
  nassau_charleston:     [137,  30],  // N  arc  (chord-mid≈138,130 → ~100px N)
  port_royal_charleston: [140, 264],  // S  arc  (chord-mid≈140,164 → ~100px S)
  charleston_boston:     [  2,  87],  // W  arc  (coastal hug)
  // Atlantic — opposing arcs form a clear X, ~126px vertical separation at centre
  charleston_dakar:      [395,  28],  // grand N arc  (chord-mid≈398,154 → ~126px N)
  port_royal_dakar:      [460, 295],  // deep  S arc  (chord-mid≈463,203 →  ~93px S)
  // West Africa
  dakar_cape_verde:      [655, 110],  // N  arc  (chord-mid≈655,190 →  ~80px N)
  cape_verde_nassau:     [395, 267],  // S  arc  (chord-mid≈395,167 → ~100px S)
};

const ROUTES = {
  // ── Caraibi (Zona 1) ────────────────────────────────────────────────────
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
    captureChance: 0.20, captureShipType: 'brig',
    missions: [
      { id: 'm_hp_1', name: 'Crown Jewels',  requiredCargo: { wine: 5, cocoa: 3 }, reward: { reales: 800, gemmes: 5, fireBarrels: 1 }, baseMinutes: 20 },
      { id: 'm_hp_2', name: 'Trade Convoy',  requiredCargo: { tobacco: 10 },       reward: { reales: 650, gemmes: 4 },                 baseMinutes: 22 },
    ],
  },
  // ── Costa Americana (Zona 2) ─────────────────────────────────────────────
  nassau_charleston: {
    id: 'nassau_charleston', label: 'Nassau – Charleston', ports: ['nassau', 'charleston'],
    baseDanger: 1, enemyStrength: 22,
    captureChance: 0.18, captureShipType: 'schooner',
    missions: [
      { id: 'm_nc_1', name: 'Cotton Run',       requiredCargo: {},               reward: { reales: 380, cargo: { cocoa: 4 } }, baseMinutes: 10 },
      { id: 'm_nc_2', name: 'Colonial Trade',   requiredCargo: { wine: 4 },      reward: { reales: 520, gemmes: 3 },           baseMinutes: 12 },
    ],
  },
  port_royal_charleston: {
    id: 'port_royal_charleston', label: 'Port Royal – Charleston', ports: ['port_royal', 'charleston'],
    baseDanger: 2, enemyStrength: 30,
    captureChance: 0.25, captureShipType: 'brig',
    missions: [
      { id: 'm_pc_1', name: 'Sugar Convoy',   requiredCargo: {},                  reward: { reales: 580, gemmes: 3 },           baseMinutes: 14 },
      { id: 'm_pc_2', name: 'Smuggler\'s Run', requiredCargo: { tobacco: 8 },     reward: { reales: 740, gemmes: 5 },           baseMinutes: 16 },
    ],
  },
  charleston_boston: {
    id: 'charleston_boston', label: 'Charleston – Boston', ports: ['charleston', 'boston'],
    baseDanger: 1, enemyStrength: 20,
    captureChance: 0.20, captureShipType: 'schooner',
    missions: [
      { id: 'm_cb_1', name: 'New England Cargo',   requiredCargo: { cocoa: 4 }, reward: { reales: 480, cargo: { wine: 6 } }, baseMinutes: 12 },
      { id: 'm_cb_2', name: 'Colonial Supplies',   requiredCargo: {},            reward: { reales: 600, gemmes: 3 },          baseMinutes: 14 },
    ],
  },
  // ── Traversata Atlantica (Zona 3) ────────────────────────────────────────
  charleston_dakar: {
    id: 'charleston_dakar', label: 'Charleston – Dakar', ports: ['charleston', 'dakar'],
    baseDanger: 3, enemyStrength: 58,
    captureChance: 0.35, captureShipType: 'man_o_war',
    missions: [
      { id: 'm_cd_1', name: 'Traversata Atlantica', requiredCargo: {},                          reward: { reales: 1800, gemmes: 10, fireBarrels: 2 }, baseMinutes: 30 },
      { id: 'm_cd_2', name: 'Carico Prezioso',       requiredCargo: { wine: 8, tobacco: 6 },    reward: { reales: 2400, gemmes: 15 },                 baseMinutes: 35 },
    ],
  },
  port_royal_dakar: {
    id: 'port_royal_dakar', label: 'Port Royal – Dakar', ports: ['port_royal', 'dakar'],
    baseDanger: 3, enemyStrength: 50,
    captureChance: 0.30, captureShipType: 'frigate',
    missions: [
      { id: 'm_pd_1', name: 'Rotta del Triangolo', requiredCargo: { tobacco: 10 }, reward: { reales: 1600, gemmes: 8 },                  baseMinutes: 28 },
      { id: 'm_pd_2', name: 'Oro Nero',             requiredCargo: {},              reward: { reales: 2000, gemmes: 12, fireBarrels: 1 }, baseMinutes: 32 },
    ],
  },
  // ── Africa Occidentale (Zona 4) ──────────────────────────────────────────
  dakar_cape_verde: {
    id: 'dakar_cape_verde', label: 'Dakar – Capo Verde', ports: ['dakar', 'cape_verde'],
    baseDanger: 2, enemyStrength: 36,
    captureChance: 0.25, captureShipType: 'frigate',
    missions: [
      { id: 'm_dc_1', name: 'Spezie Africane', requiredCargo: {},              reward: { reales: 900,  gemmes: 5 },                  baseMinutes: 18 },
      { id: 'm_dc_2', name: 'Rotta delle Isole', requiredCargo: { wine: 6 },  reward: { reales: 1100, gemmes: 7, fireBarrels: 1 },  baseMinutes: 20 },
    ],
  },
  cape_verde_nassau: {
    id: 'cape_verde_nassau', label: 'Capo Verde – Nassau', ports: ['cape_verde', 'nassau'],
    baseDanger: 2, enemyStrength: 32,
    captureChance: 0.22, captureShipType: 'brig',
    missions: [
      { id: 'm_cn_1', name: 'Ritorno ai Caraibi',    requiredCargo: {},              reward: { reales: 1200, gemmes: 6, fireBarrels: 1 }, baseMinutes: 22 },
      { id: 'm_cn_2', name: 'Circolo Triangolare',   requiredCargo: { cocoa: 8 },    reward: { reales: 1500, gemmes: 10 },                baseMinutes: 25 },
    ],
  },
};

const SHIP_TYPES = {
  gunboat:   { name: 'Gunboat',   cargo: 10, firepower: 6,  hull: 8,  speed: 15, repairCost: 3  },
  schooner:  { name: 'Schooner',  cargo: 20, firepower: 8,  hull: 15, speed: 12, repairCost: 5  },
  brig:      { name: 'Brig',      cargo: 35, firepower: 14, hull: 22, speed: 9,  repairCost: 8  },
  frigate:   { name: 'Fregata',   cargo: 45, firepower: 22, hull: 35, speed: 7,  repairCost: 12 },
  man_o_war: { name: "Man O' War", cargo: 60, firepower: 35, hull: 50, speed: 5, repairCost: 20 },
};

const CARGO_LABELS = { tobacco: 'Tabacco', wine: 'Vino', cocoa: 'Cacao' };

// Nomi per navi nemiche catturate in battaglia
const CAPTURED_NAMES = [
  'Tigre del Mare', 'Vento di Ferro', 'La Vendetta', 'Il Predatore',
  'Stella del Nord', 'San Felipe', 'Aquila Nera', 'Spirito Libero',
  'Il Corsaro', 'Bocca di Fuoco', 'La Tempesta', 'Grifone Ardente',
  'Santo Domingo', 'Dente di Squalo', 'La Fortuna', 'Cuore di Ferro',
];

// Route unlock prerequisites: complete N missions on the required route to unlock.
const UNLOCK_CONDITIONS = {
  // Caraibi → Caraibi
  havana_tortuga:        { prereq: 'nassau_havana',        needed: 3 },
  tortuga_port_royal:    { prereq: 'nassau_tortuga',       needed: 3 },
  havana_port_royal:     { prereq: 'havana_tortuga',       needed: 3 },
  // Caraibi → Costa Americana
  nassau_charleston:     { prereq: 'havana_port_royal',    needed: 2 },
  port_royal_charleston: { prereq: 'tortuga_port_royal',   needed: 4 },
  // Costa Americana → nord
  charleston_boston:     { prereq: 'nassau_charleston',    needed: 3 },
  // Traversata Atlantica
  charleston_dakar:      { prereq: 'charleston_boston',    needed: 3 },
  port_royal_dakar:      { prereq: 'port_royal_charleston', needed: 3 },
  // Africa Occidentale
  dakar_cape_verde:      { prereq: 'charleston_dakar',     needed: 1 },
  cape_verde_nassau:     { prereq: 'dakar_cape_verde',     needed: 3 },
};

const INITIAL_STATE = {
  version: '2.0',
  player: { reales: 500, gemmes: 20, cargo: { tobacco: 5, wine: 5, cocoa: 3 }, fireBarrels: 1 },
  fleet: [
    { id: 'ship_001', name: 'La Speranza',  type: 'schooner', status: 'docked', damage: 0 },
    { id: 'ship_002', name: 'El Diablo',     type: 'gunboat',  status: 'docked', damage: 0 },
    { id: 'ship_003', name: 'San Cristóbal', type: 'gunboat',  status: 'docked', damage: 0 },
  ],
  routes: {
    nassau_havana:         { dangerLevel: 0, unlocked: true,  missionsCompleted: 0 },
    nassau_tortuga:        { dangerLevel: 0, unlocked: true,  missionsCompleted: 0 },
    havana_tortuga:        { dangerLevel: 1, unlocked: false, missionsCompleted: 0 },
    tortuga_port_royal:    { dangerLevel: 1, unlocked: false, missionsCompleted: 0 },
    havana_port_royal:     { dangerLevel: 2, unlocked: false, missionsCompleted: 0 },
    nassau_charleston:     { dangerLevel: 1, unlocked: false, missionsCompleted: 0 },
    port_royal_charleston: { dangerLevel: 2, unlocked: false, missionsCompleted: 0 },
    charleston_boston:     { dangerLevel: 1, unlocked: false, missionsCompleted: 0 },
    charleston_dakar:      { dangerLevel: 3, unlocked: false, missionsCompleted: 0 },
    port_royal_dakar:      { dangerLevel: 3, unlocked: false, missionsCompleted: 0 },
    dakar_cape_verde:      { dangerLevel: 2, unlocked: false, missionsCompleted: 0 },
    cape_verde_nassau:     { dangerLevel: 2, unlocked: false, missionsCompleted: 0 },
  },
  activeMissions: [],
  unlockedPorts: ['nassau', 'havana', 'tortuga', 'port_royal', 'charleston', 'boston', 'dakar', 'cape_verde'],
  dockSlots: 10,
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
  // Ensure all known routes exist in the save (handles v1 → v2 expansion)
  Object.keys(ROUTES).forEach(id => {
    if (!state.routes[id]) {
      const cond = UNLOCK_CONDITIONS[id];
      state.routes[id] = {
        dangerLevel: ROUTES[id].baseDanger,
        unlocked: !cond,
        missionsCompleted: 0,
      };
    }
    if (state.routes[id].missionsCompleted === undefined)
      state.routes[id].missionsCompleted = 0;
  });
  // Ensure all ports are visible
  Object.keys(PORTS).forEach(id => {
    if (!state.unlockedPorts.includes(id)) state.unlockedPorts.push(id);
  });
  // Bump dock slots for old saves
  if (!state.dockSlots || state.dockSlots < 10) state.dockSlots = 10;
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

  // Ship capture: chance to seize an enemy vessel after a successful mission
  const routeData = ROUTES[am.routeId];
  if (routeData.captureChance && routeData.captureShipType
      && Math.random() < routeData.captureChance) {
    if (state.fleet.length < state.dockSlots) {
      const captured = {
        id: `ship_${Date.now()}`,
        name: CAPTURED_NAMES[Math.floor(Math.random() * CAPTURED_NAMES.length)],
        type: routeData.captureShipType,
        status: 'docked',
        damage: 0,
      };
      state.fleet.push(captured);
      lastCaptureResult = { shipName: captured.name, shipType: SHIP_TYPES[captured.type].name };
      addLog(`⚓ Nave nemica catturata: ${captured.name} (${SHIP_TYPES[captured.type].name})!`);
    } else {
      addLog(`⚓ Nave nemica sconfitta, ma i moli sono pieni — impossibile portarla in porto.`);
    }
  }

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
let lastBattleResult  = null;  // { outcome, routeLabel, damagedShip?, newDangerLabel? }
let lastCaptureResult = null;  // { shipName, shipType } — set by collectMission

function setSelectedRoute(routeId) {
  selectedRouteId   = routeId;
  selectedMissionId = null;
  selectedShipIds.clear();
  fireBarrelsUsed   = 0;
}

function clearSelection() {
  selectedRouteId = null; selectedMissionId = null;
  selectedShipIds.clear(); fireBarrelsUsed = 0;
  lastCaptureResult = null;
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
  // Wide viewBox: Americas left, Caribbean centre-left, Atlantic, Africa right.
  svgAttr(svg, { viewBox: '0 0 880 300', id: 'map-svg', preserveAspectRatio: 'xMidYMid meet' });

  // ── Defs ──────────────────────────────────────────────────────────────────
  const defs = svgEl('defs');

  // Sea — aged parchment ocean (warm blue-grey)
  const sg = svgEl('linearGradient');
  svgAttr(sg, { id: 'sg', x1: '0%', y1: '0%', x2: '100%', y2: '100%' });
  [['0%','#bcccd8'],['50%','#a8bcc8'],['100%','#90a8bc']].forEach(([o,c]) => {
    const s = svgEl('stop'); svgAttr(s, { offset: o, 'stop-color': c }); sg.appendChild(s);
  });
  defs.appendChild(sg);

  // Wave hatching
  const wp = svgEl('pattern');
  svgAttr(wp, { id: 'wp', x: 0, y: 0, width: 44, height: 16, patternUnits: 'userSpaceOnUse' });
  const wpath = svgEl('path');
  svgAttr(wpath, { d: 'M0,8 Q5.5,3 11,8 Q16.5,13 22,8 Q27.5,3 33,8 Q38.5,13 44,8', stroke: '#5a7890', 'stroke-width': 0.5, fill: 'none' });
  wp.appendChild(wpath); defs.appendChild(wp);

  // Parchment-aging radial gradients (age spots)
  [['ag1','16%','18%','rgba(112,84,18,0.13)'],
   ['ag2','84%','80%','rgba(44,24,16,0.10)'],
   ['ag3','50%','8%', 'rgba(96,72,14,0.08)']].forEach(([id,cx,cy,clr]) => {
    const rg = svgEl('radialGradient');
    svgAttr(rg, { id, cx, cy, r: '38%' });
    [['0%',clr],['100%','rgba(0,0,0,0)']].forEach(([o,c]) => {
      const s = svgEl('stop'); svgAttr(s, { offset: o, 'stop-color': c }); rg.appendChild(s);
    });
    defs.appendChild(rg);
  });

  svg.appendChild(defs);

  // ── Sea background ────────────────────────────────────────────────────────
  const bg = svgEl('rect'); svgAttr(bg, { width: 880, height: 300, fill: 'url(#sg)' }); svg.appendChild(bg);
  const wr = svgEl('rect'); svgAttr(wr, { width: 880, height: 300, fill: 'url(#wp)', opacity: 0.32 }); svg.appendChild(wr);
  ['ag1','ag2','ag3'].forEach(id => {
    const r = svgEl('rect'); svgAttr(r, { width: 880, height: 300, fill: `url(#${id})` }); svg.appendChild(r);
  });

  // Double frame border
  const fr1 = svgEl('rect'); svgAttr(fr1, { x: 4, y: 4, width: 872, height: 292, fill: 'none', stroke: '#3a2808', 'stroke-width': 2.5, opacity: 0.50 }); svg.appendChild(fr1);
  const fr2 = svgEl('rect'); svgAttr(fr2, { x: 9, y: 9, width: 862, height: 282, fill: 'none', stroke: '#3a2808', 'stroke-width': 0.8, opacity: 0.28 }); svg.appendChild(fr2);
  // Faint graticule
  for (let x = 88; x < 880; x += 88) svgLine(svg, x, 0, x, 300, '#3a5068', 0.09);
  for (let y = 60; y < 300; y += 60) svgLine(svg, 0, y, 880, y, '#3a5068', 0.09);

  // ── Land masses ───────────────────────────────────────────────────────────
  const lf = '#c8a84b', ls = '#8b6914';

  // Americas seaboard — sinuous thin strip (coast edge ~x 90-97)
  const am = svgEl('path');
  svgAttr(am, {
    d: 'M0,0 L74,0 C80,14 86,28 92,46 C96,64 98,86 97,110 C95,134 91,158 85,180 C78,202 69,220 58,238 C46,256 34,270 22,284 L0,284 Z',
    fill: lf, stroke: ls, 'stroke-width': 1.2, opacity: 0.90,
  });
  svg.appendChild(am);
  svgText(svg, 'AMERICA', 40, 150, {
    'text-anchor': 'middle', 'font-size': 8, fill: '#3a2808',
    'font-family': 'Georgia, serif', 'font-style': 'italic', opacity: 0.48,
    transform: 'rotate(-90,40,150)',
  });

  // Africa coast — with westward Dakar bulge (tip ≈ x 720 at y 192)
  const af = svgEl('path');
  svgAttr(af, {
    d: 'M880,0 L762,0 C758,18 754,40 750,64 C746,90 742,118 738,144 C734,164 728,180 720,192 C728,206 736,222 742,242 C748,260 752,274 756,284 L880,284 Z',
    fill: lf, stroke: ls, 'stroke-width': 1.2, opacity: 0.90,
  });
  svg.appendChild(af);
  svgText(svg, 'AFRICA', 836, 150, {
    'text-anchor': 'middle', 'font-size': 8, fill: '#3a2808',
    'font-family': 'Georgia, serif', 'font-style': 'italic', opacity: 0.48,
    transform: 'rotate(90,836,150)',
  });

  // Cuba — elongated E-W (Havana 152,175 is W end)
  const cuba = svgEl('path');
  svgAttr(cuba, {
    d: 'M112,172 C124,164 140,162 155,163 C170,163 186,167 200,172 C212,175 220,179 222,185 C218,193 204,196 185,195 C165,192 143,188 126,185 C110,182 104,177 108,173 Z',
    fill: lf, stroke: ls, 'stroke-width': 1.0, opacity: 0.90,
  });
  svg.appendChild(cuba);

  // Hispaniola — Haiti (Tortuga 250,162 is NW corner)
  const hisp = svgEl('path');
  svgAttr(hisp, {
    d: 'M232,160 C242,153 256,151 270,153 C282,152 294,156 303,163 C307,171 303,180 290,183 C274,185 255,182 239,178 C224,174 218,168 222,161 Z',
    fill: lf, stroke: ls, 'stroke-width': 1.0, opacity: 0.90,
  });
  svg.appendChild(hisp);

  // Jamaica — Port Royal (205,213) is E harbour
  const jam = svgEl('path');
  svgAttr(jam, {
    d: 'M185,210 C193,203 206,201 218,203 C228,203 237,208 238,215 C232,222 218,224 204,222 C191,220 182,216 182,211 Z',
    fill: lf, stroke: ls, 'stroke-width': 1.0, opacity: 0.90,
  });
  svg.appendChild(jam);

  // Bahamas — Nassau (200,145) sits at centre
  const bah = svgEl('path');
  svgAttr(bah, {
    d: 'M188,143 C195,137 206,135 217,137 C225,137 231,142 229,148 C223,153 211,154 199,152 C189,150 184,146 186,142 Z',
    fill: lf, stroke: ls, 'stroke-width': 1.0, opacity: 0.85,
  });
  svg.appendChild(bah);

  // Cape Verde island cluster (590,188)
  ['M579,183 Q587,179 594,181 Q597,186 591,190 Q583,190 579,186 Z',
   'M595,191 Q601,188 607,190 Q610,195 606,198 Q598,198 595,194 Z',
   'M573,191 Q578,188 583,190 Q585,194 581,197 Q574,197 572,193 Z',
  ].forEach(d => { const e = svgEl('path'); svgAttr(e, { d, fill: lf, stroke: ls, 'stroke-width': 0.8, opacity: 0.82 }); svg.appendChild(e); });

  // Scattered decorative cays / shoals
  ['M312,196 Q317,192 323,194 Q325,199 321,202 Q314,202 312,198 Z',
   'M358,148 Q363,144 369,146 Q371,151 367,154 Q360,154 358,150 Z',
   'M440,232 Q445,228 451,230 Q453,235 449,238 Q442,238 440,234 Z',
   'M490,170 Q494,167 499,169 Q501,174 497,176 Q490,176 488,172 Z',
   'M382,258 Q387,254 392,256 Q394,261 390,264 Q383,264 381,260 Z',
  ].forEach(d => { const e = svgEl('path'); svgAttr(e, { d, fill: lf, stroke: ls, 'stroke-width': 0.7, opacity: 0.46 }); svg.appendChild(e); });

  // ── Sea decorations ───────────────────────────────────────────────────────
  // Sea serpent — coiled silhouette in upper mid-Atlantic
  const serp = svgEl('path');
  svgAttr(serp, {
    d: 'M352,80 C357,68 370,64 380,70 C390,76 392,90 385,98 C378,106 365,106 357,99 C349,92 347,80 353,72 C358,65 368,62 377,66',
    fill: 'none', stroke: '#3a5068', 'stroke-width': 2.2, 'stroke-linecap': 'round', opacity: 0.26,
  });
  svg.appendChild(serp);
  const serpH = svgEl('ellipse');
  svgAttr(serpH, { cx: 386, cy: 70, rx: 9, ry: 6, fill: '#8899aa', stroke: '#3a5068', 'stroke-width': 0.8, opacity: 0.24, transform: 'rotate(-25,386,70)' });
  svg.appendChild(serpH);
  // Serpent eye
  const serpE = svgEl('circle'); svgAttr(serpE, { cx: 389, cy: 68, r: 1.5, fill: '#3a2808', opacity: 0.30 }); svg.appendChild(serpE);

  // Whale — spouting leviathan in lower Atlantic
  const whale = svgEl('path');
  svgAttr(whale, {
    d: 'M560,244 Q572,232 590,230 Q610,230 618,240 Q620,252 610,260 Q594,268 574,262 Q556,256 554,246 Q553,238 560,236 M614,242 Q624,232 630,228',
    fill: '#8899aa', stroke: '#3a5068', 'stroke-width': 0.8, 'stroke-linejoin': 'round', opacity: 0.24,
  });
  svg.appendChild(whale);
  const spout = svgEl('path');
  svgAttr(spout, { d: 'M576,230 C572,218 576,210 581,216', fill: 'none', stroke: '#3a5068', 'stroke-width': 1.2, 'stroke-linecap': 'round', opacity: 0.20 });
  svg.appendChild(spout);

  // Galleon — small sailing ship mid-Atlantic
  const hull = svgEl('path');
  svgAttr(hull, { d: 'M447,148 Q454,154 461,148 L459,138 L449,138 Z', fill: '#c8a840', stroke: '#8b6914', 'stroke-width': 0.7, opacity: 0.26 });
  svg.appendChild(hull);
  const mast = svgEl('line'); svgAttr(mast, { x1: 454, y1: 138, x2: 454, y2: 122, stroke: '#6b4c10', 'stroke-width': 0.9, opacity: 0.26 }); svg.appendChild(mast);
  const sail = svgEl('path');
  svgAttr(sail, { d: 'M454,124 L444,134 L454,136 Z', fill: '#e8d890', stroke: '#8b6914', 'stroke-width': 0.5, opacity: 0.26 });
  svg.appendChild(sail);

  // ── Routes ────────────────────────────────────────────────────────────────
  Object.values(ROUTES).forEach(route => {
    const [p1id, p2id] = route.ports;
    const p1 = PORTS[p1id], p2 = PORTS[p2id];
    const routeState = state.routes[route.id];

    // Bezier control point and midpoint (t=0.5 on quadratic bezier)
    const [cx, cy] = ROUTE_CURVES[route.id] || [(p1.x + p2.x) / 2, (p1.y + p2.y) / 2];
    const mx = 0.25 * p1.x + 0.5 * cx + 0.25 * p2.x;
    const my = 0.25 * p1.y + 0.5 * cy + 0.25 * p2.y;
    const d  = `M ${p1.x} ${p1.y} Q ${cx} ${cy} ${p2.x} ${p2.y}`;

    if (!routeState.unlocked) {
      const lockedPath = svgEl('path');
      svgAttr(lockedPath, { d, fill: 'none',
        stroke: '#4a6070', 'stroke-width': 1.8, 'stroke-dasharray': '3,12', opacity: 0.38 });
      svg.appendChild(lockedPath);
      // Lock icon at bezier midpoint
      svgText(svg, '🔒', mx, my + 4, { 'text-anchor': 'middle', 'font-size': 9, opacity: 0.45 });
      // Clickable hit area — opens unlock info panel
      const lockedHit = svgEl('path');
      svgAttr(lockedHit, { d, fill: 'none',
        stroke: 'transparent', 'stroke-width': 24,
        class: 'route-hit', 'data-route': route.id, cursor: 'pointer' });
      svg.appendChild(lockedHit);
      return;
    }

    const dl    = routeState.dangerLevel;
    const color = DANGER_COLOR[dl];
    const isSel = route.id === selectedRouteId;
    const active = state.activeMissions.some(m => m.routeId === route.id);
    const ready  = state.activeMissions.find(m => m.routeId === route.id && m.completesAt <= now);

    // Dark halo underneath for contrast against the sea
    const halo = svgEl('path');
    svgAttr(halo, { d, fill: 'none',
      stroke: '#1a0e08', 'stroke-width': isSel ? 8.5 : 6.5,
      'stroke-linecap': 'round', opacity: 0.28 });
    svg.appendChild(halo);

    const line = svgEl('path');
    svgAttr(line, { d, fill: 'none',
      stroke: color, 'stroke-width': isSel ? 5.0 : 3.5,
      'stroke-dasharray': isSel ? '9,5' : '8,7',
      'stroke-linecap': 'round', opacity: 1.0 });
    svg.appendChild(line);

    const hit = svgEl('path');
    svgAttr(hit, { d, fill: 'none',
      stroke: 'transparent', 'stroke-width': 24,
      class: 'route-hit', 'data-route': route.id, cursor: 'pointer' });
    svg.appendChild(hit);

    if (active) {
      const pulse = svgEl('circle');
      svgAttr(pulse, { cx: mx, cy: my, r: 8, fill: '#f0e8c4', stroke: color, 'stroke-width': 1.4, class: 'mission-pulse' });
      svg.appendChild(pulse);
      svgText(svg, '⛵', mx, my + 4.5, { 'text-anchor': 'middle', 'font-size': 10 });
    }
    if (ready) {
      svgText(svg, '✓ PRONTA', mx, my - (active ? 16 : 5), {
        'text-anchor': 'middle', 'font-size': 8.5, fill: '#3a6a48',
        'font-weight': 'bold', 'font-family': 'Georgia, serif', 'letter-spacing': 0.8,
      });
    }
  });

  // ── Port markers ──────────────────────────────────────────────────────────
  const PORT_LABEL = {
    boston:     { dx:  18, dy:   3, anchor: 'start'  },  // right
    charleston: { dx:  18, dy:   3, anchor: 'start'  },  // right
    nassau:     { dx:   0, dy: -16, anchor: 'middle' },   // above
    havana:     { dx:   0, dy:  21, anchor: 'middle' },   // below
    tortuga:    { dx:   0, dy: -16, anchor: 'middle' },   // above
    port_royal: { dx:   0, dy:  21, anchor: 'middle' },   // below
    cape_verde: { dx:   0, dy: -16, anchor: 'middle' },   // above
    dakar:      { dx:  18, dy:   3, anchor: 'start'  },   // right (just off Africa coast)
  };

  Object.values(PORTS).forEach(port => {
    if (!state.unlockedPorts.includes(port.id)) return;
    const ring = svgEl('circle');
    svgAttr(ring, { cx: port.x, cy: port.y, r: 12, fill: 'none', stroke: '#2c1810', 'stroke-width': 0.7, opacity: 0.22 });
    svg.appendChild(ring);
    const c = svgEl('circle');
    svgAttr(c, { cx: port.x, cy: port.y, r: 7, fill: '#f0e8c4', stroke: '#2c1810', 'stroke-width': 1.6 });
    svg.appendChild(c);
    svgText(svg, '⚓', port.x, port.y + 3.5, { 'text-anchor': 'middle', 'font-size': 7.5 });
    const lo = PORT_LABEL[port.id] || { dx: 0, dy: 21, anchor: 'middle' };
    svgText(svg, port.name.toUpperCase(), port.x + lo.dx, port.y + lo.dy, {
      'text-anchor': lo.anchor, 'font-size': 8.5, fill: '#1a0e08',
      'font-weight': 'bold', 'font-family': 'Georgia, serif', 'letter-spacing': 0.8,
    });
  });

  // ── Compass rose (bottom-right Atlantic, clear of Africa and Caribbean) ────
  const ccx = 700, ccy = 248;
  const cpBg = svgEl('circle'); svgAttr(cpBg, { cx: ccx, cy: ccy, r: 26, fill: '#f0e8c4', stroke: '#8b6914', 'stroke-width': 0.8, opacity: 0.82 }); svg.appendChild(cpBg);
  const cpRing = svgEl('circle'); svgAttr(cpRing, { cx: ccx, cy: ccy, r: 30, fill: 'none', stroke: '#8b6914', 'stroke-width': 0.7, opacity: 0.42 }); svg.appendChild(cpRing);
  [0, 45, 90, 135, 180, 225, 270, 315].forEach(deg => {
    const isCard = deg % 90 === 0;
    const rad = (deg - 90) * Math.PI / 180, perpR = rad + Math.PI / 2;
    const tl = isCard ? 22 : 13, sw = isCard ? 5 : 3;
    const tx = ccx + tl * Math.cos(rad), ty = ccy + tl * Math.sin(rad);
    const s1x = ccx + sw * Math.cos(perpR), s1y = ccy + sw * Math.sin(perpR);
    const s2x = ccx - sw * Math.cos(perpR), s2y = ccy - sw * Math.sin(perpR);
    const poly = svgEl('polygon');
    svgAttr(poly, {
      points: `${tx.toFixed(1)},${ty.toFixed(1)} ${s1x.toFixed(1)},${s1y.toFixed(1)} ${ccx},${ccy} ${s2x.toFixed(1)},${s2y.toFixed(1)}`,
      fill: deg === 0 ? '#8b2020' : (isCard ? '#2c1810' : '#f0e8c4'),
      stroke: '#2c1810', 'stroke-width': 0.5, opacity: 0.88,
    });
    svg.appendChild(poly);
  });
  const cd1 = svgEl('circle'); svgAttr(cd1, { cx: ccx, cy: ccy, r: 3, fill: '#8b6914' }); svg.appendChild(cd1);
  const cd2 = svgEl('circle'); svgAttr(cd2, { cx: ccx, cy: ccy, r: 1.2, fill: '#f0e8c4' }); svg.appendChild(cd2);
  [['N',ccx,ccy-32],['S',ccx,ccy+38],['E',ccx+36,ccy+4],['W',ccx-33,ccy+4]].forEach(([lbl,lx,ly]) => {
    svgText(svg, lbl, lx, ly, { 'text-anchor': 'middle', 'font-size': 8.5, 'font-weight': 'bold',
      fill: lbl === 'N' ? '#8b2020' : '#1a0e08', 'font-family': 'Georgia, serif', opacity: 0.88 });
  });

  // ── Cartouche (centre-bottom Atlantic) ────────────────────────────────────
  const cRect = svgEl('rect');
  svgAttr(cRect, { x: 354, y: 268, width: 182, height: 22, rx: 2,
    fill: '#f0e8c4', stroke: '#8b6914', 'stroke-width': 0.8, opacity: 0.82 });
  svg.appendChild(cRect);
  svgText(svg, 'OCEANUS ATLANTICUS', 445, 278, {
    'text-anchor': 'middle', 'font-size': 7.5, fill: '#3a2808',
    'font-family': 'Georgia, serif', 'font-style': 'italic', 'letter-spacing': 1.8,
  });
  svgText(svg, 'Anno Domini MDCCXVIII', 445, 286, {
    'text-anchor': 'middle', 'font-size': 6.5, fill: '#5a3818',
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
  if (lastBattleResult)  { renderBattleResult(container, lastBattleResult); return; }
  if (lastCaptureResult) { renderCaptureResult(container, lastCaptureResult); return; }
  if (!selectedRouteId)  { renderActiveMissionsPanel(container); return; }
  const route      = ROUTES[selectedRouteId];
  const routeState = state.routes[selectedRouteId];
  if (!routeState.unlocked) { renderLockedRoutePanel(container, route); return; }
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

  // ── Progression: what does completing this route unlock? ──────────────────
  const unlocks = Object.entries(UNLOCK_CONDITIONS)
    .filter(([, c]) => c.prereq === route.id);
  if (unlocks.length) {
    const done = (state.routes[route.id].missionsCompleted || 0);
    html += `<div class="route-unlocks-section">
      <div class="route-unlocks-title">🗝 Missioni completate su questa rotta: <strong>${done}</strong></div>`;
    unlocks.forEach(([rid, cond]) => {
      const pct      = Math.min(100, Math.round(done / cond.needed * 100));
      const barColor = pct >= 100 ? '#4a7c59' : pct >= 50 ? '#b89a2a' : '#5a6878';
      const isUnlocked = state.routes[rid].unlocked;
      html += `<div class="route-unlock-item ${isUnlocked ? 'already-unlocked' : ''}">
        <div class="route-unlock-row">
          <span class="route-unlock-name">${isUnlocked ? '✅' : '🔒'} ${ROUTES[rid].label}</span>
          <span class="route-unlock-req">${isUnlocked ? 'Sbloccata' : `${done}/${cond.needed}`}</span>
        </div>
        ${!isUnlocked ? `<div class="odds-bar-wrap"><div class="odds-bar-fill" style="width:${pct}%;background:${barColor}"></div></div>` : ''}
      </div>`;
    });
    html += `</div>`;
  }

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

  if (dangerous) {
    html += `<div class="battle-warning">⚔ Rotta pericolosa — si combatte prima di commerciare. Forza nemica: <strong>${route.enemyStrength}</strong></div>`;
    if (dl === 3) html += `<div class="battle-warning" style="border-left-color:#8b6914;background:#f8f0e0;color:#4a3010">⚠ Traversata estrema — si raccomandano Fregata o Man O'War. Possibile cattura di nave nemica.</div>`;
  }

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

function renderLockedRoutePanel(container, route) {
  const cond       = UNLOCK_CONDITIONS[route.id];
  const prereq     = ROUTES[cond.prereq];
  const done       = state.routes[cond.prereq].missionsCompleted || 0;
  const pct        = Math.min(100, Math.round(done / cond.needed * 100));
  const barColor   = pct >= 100 ? '#4a7c59' : pct >= 50 ? '#b89a2a' : '#5a6878';
  const remaining  = Math.max(0, cond.needed - done);

  // What does THIS route unlock in turn?
  const chain = Object.entries(UNLOCK_CONDITIONS)
    .filter(([, c]) => c.prereq === route.id);

  let chainHtml = '';
  if (chain.length) {
    chainHtml = `<div class="unlock-chain">
      <div class="unlock-chain-title">🔗 Sblocca a sua volta</div>
      ${chain.map(([rid]) => `<span class="unlock-chain-item">${ROUTES[rid].label}</span>`).join('')}
    </div>`;
  }

  container.innerHTML = `
    <div class="panel-route-header">
      <h3>${route.label}</h3>
      <span class="danger-badge" style="--dc:#5a6878">🔒 Bloccata</span>
    </div>
    <p class="route-desc">Rotta inesplorata. Guadagna esperienza sulle rotte note per aprire nuovi orizzonti commerciali.</p>
    <div class="unlock-req-box">
      <div class="unlock-req-title">🗺 Come sbloccare</div>
      <div class="unlock-req-desc">Completa <strong>${cond.needed}</strong> missioni su
        <strong>${prereq.label}</strong>${remaining > 0 ? ` (mancano ancora <strong>${remaining}</strong>)` : ' ✅'}</div>
      <div class="odds-bar-wrap" style="margin-top:8px">
        <div class="odds-bar-fill" style="width:${pct}%;background:${barColor}"></div>
      </div>
      <div class="unlock-progress-text" style="color:${barColor}">${done} / ${cond.needed} missioni completate</div>
    </div>
    ${chainHtml}`;
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

function renderCaptureResult(container, capture) {
  container.innerHTML = `
    <div class="battle-result victory">
      <div class="battle-result-header">⚓ Nave Catturata</div>
      <div class="battle-result-outcome">⚓ PREDA!</div>
      <div class="battle-result-body">
        Una nave nemica si è arresa durante la missione.<br>
        <strong>${capture.shipName}</strong> (${capture.shipType}) ora batte la tua bandiera e<br>
        è ancorata al porto in attesa di ordini.
      </div>
      <button class="btn-battle-continue">Alla flotta</button>
    </div>`;
  container.querySelector('.btn-battle-continue').addEventListener('click', () => {
    lastCaptureResult = null;
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
