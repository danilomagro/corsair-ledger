// ═══════════════════════════════════════════════════════════════════════════
//  CORSAIR LEDGER — single-file bundle (no ES modules, works via file://)
// ═══════════════════════════════════════════════════════════════════════════

// ─── DATA ────────────────────────────────────────────────────────────────────

// Port coordinates derived from real geography projected onto the map image:
// longitude range 100°W–30°E (130°→760 px), latitude range 65°N–5°S (70°→507 px)
const PORTS = {
  // ── Caraibi ──
  nassau:     { id: 'nassau',     name: 'Nassau',     x: 134, y: 290, desc: 'Cuore dei Caraibi — porto libero' },
  havana:     { id: 'havana',     name: 'Havana',     x: 105, y: 304, desc: 'Fortezza spagnola di Cuba' },
  tortuga:    { id: 'tortuga',    name: 'Tortuga',    x: 158, y: 326, desc: 'Covo dei corsari di Hispaniola' },
  port_royal: { id: 'port_royal', name: 'Port Royal', x: 134, y: 340, desc: 'Porto britannico della Giamaica' },
  // ── Costa Americana ──
  charleston: { id: 'charleston', name: 'Charleston', x: 117, y: 232, desc: 'Porto coloniale della Carolina del Sud' },
  boston:     { id: 'boston',     name: 'Boston',     x: 170, y: 167, desc: 'Capitale del commercio del New England' },
  // ── Africa Occidentale ──
  dakar:      { id: 'dakar',      name: 'Dakar',      x: 485, y: 365, desc: 'Porto senegalese sull\'Atlantico' },
  cape_verde: { id: 'cape_verde', name: 'Capo Verde', x: 450, y: 355, desc: 'Isole atlantiche — crocevia dei mari' },
};

const DANGER_COLOR = { 0: '#4a7c59', 1: '#b89a2a', 2: '#c87428', 3: '#8b2020' };
const DANGER_LABEL = { 0: 'Verde', 1: 'Giallo', 2: 'Arancione', 3: 'Rosso' };

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
  // viewBox matches the 3:2 image ratio (1536×1024 source).
  // preserveAspectRatio:slice fills the container while keeping proportions;
  // all 8 ports land in the visible vertical band (approx. y 130–390).
  svgAttr(svg, { viewBox: '0 0 760 507', id: 'map-svg', preserveAspectRatio: 'xMidYMid slice' });

  // ── Background: assets/map-background.jpg ────────────────────────────────
  const bgImg = svgEl('image');
  svgAttr(bgImg, { href: 'assets/map-background.jpg', x: 0, y: 0, width: 760, height: 507 });
  svg.appendChild(bgImg);

  // Thin vignette overlay — improves route/label legibility without hiding the art
  const vignette = svgEl('rect');
  svgAttr(vignette, { width: 760, height: 507, fill: '#0d0905', opacity: 0.08 });
  svg.appendChild(vignette);

  // ── Routes ────────────────────────────────────────────────────────────────
  Object.values(ROUTES).forEach(route => {
    const [p1id, p2id] = route.ports;
    const p1 = PORTS[p1id], p2 = PORTS[p2id];
    const routeState = state.routes[route.id];

    if (!routeState.unlocked) {
      // Locked: ghost line only — no label, very faint
      const lockedLine = svgEl('line');
      svgAttr(lockedLine, { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y,
        stroke: '#4a6070', 'stroke-width': 1.0, 'stroke-dasharray': '2,13', opacity: 0.18 });
      svg.appendChild(lockedLine);
      return;
    }

    const mx    = (p1.x + p2.x) / 2;
    const my    = (p1.y + p2.y) / 2;
    const dl    = routeState.dangerLevel;
    const color = DANGER_COLOR[dl];
    const isSel = route.id === selectedRouteId;
    const active = state.activeMissions.some(m => m.routeId === route.id);
    const ready  = state.activeMissions.find(m => m.routeId === route.id && m.completesAt <= now);

    const line = svgEl('line');
    svgAttr(line, { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y,
      stroke: color, 'stroke-width': isSel ? 3.5 : 2.2,
      'stroke-dasharray': isSel ? '3,6' : '2,9',
      'stroke-linecap': 'round', opacity: isSel ? 1.0 : 0.82 });
    svg.appendChild(line);

    // Wide transparent hit area for easy clicking
    const hit = svgEl('line');
    svgAttr(hit, { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y,
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
      // Parchment halo so "PRONTA" stays legible over the map image
      svgText(svg, '✓ PRONTA', mx, my - (active ? 16 : 5), {
        'text-anchor': 'middle', 'font-size': 8.5, fill: '#3a6a48', 'font-weight': 'bold',
        'font-family': 'Georgia, serif', 'letter-spacing': 0.8,
        'paint-order': 'stroke fill', stroke: '#f0e8c4', 'stroke-width': 2.5, 'stroke-linejoin': 'round',
      });
    }
  });

  // ── Port markers ──────────────────────────────────────────────────────────
  // Label direction chosen per-port to avoid route-line and neighbour overlap.
  const PORT_LABEL = {
    boston:     { dx:  18, dy:   3, anchor: 'start'  },  // right
    charleston: { dx:  18, dy:   3, anchor: 'start'  },  // right
    nassau:     { dx:  18, dy:   3, anchor: 'start'  },  // right
    havana:     { dx:   0, dy:  21, anchor: 'middle' },   // below (left of Nassau)
    tortuga:    { dx:  18, dy:   3, anchor: 'start'  },   // right
    port_royal: { dx:   0, dy:  21, anchor: 'middle' },   // below (same lon as Nassau)
    cape_verde: { dx:   0, dy: -16, anchor: 'middle' },   // above (near bottom of view)
    dakar:      { dx:  18, dy:   3, anchor: 'start'  },   // right
  };

  Object.values(PORTS).forEach(port => {
    if (!state.unlockedPorts.includes(port.id)) return;

    // Subtle halo ring
    const ring = svgEl('circle');
    svgAttr(ring, { cx: port.x, cy: port.y, r: 12, fill: 'none', stroke: '#f0e8c4', 'stroke-width': 0.8, opacity: 0.30 });
    svg.appendChild(ring);

    // Port dot
    const c = svgEl('circle');
    svgAttr(c, { cx: port.x, cy: port.y, r: 7, fill: '#f0e8c4', stroke: '#2c1810', 'stroke-width': 1.8 });
    svg.appendChild(c);

    svgText(svg, '⚓', port.x, port.y + 3.5, { 'text-anchor': 'middle', 'font-size': 7.5 });

    // Port name with parchment stroke-halo for readability over busy background
    const lo = PORT_LABEL[port.id] || { dx: 0, dy: 21, anchor: 'middle' };
    svgText(svg, port.name.toUpperCase(), port.x + lo.dx, port.y + lo.dy, {
      'text-anchor': lo.anchor, 'font-size': 8.5, fill: '#1a0e08',
      'font-weight': 'bold', 'font-family': 'Georgia, serif', 'letter-spacing': 0.8,
      'paint-order': 'stroke fill', stroke: '#f0e8c4', 'stroke-width': 3.0, 'stroke-linejoin': 'round',
    });
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
