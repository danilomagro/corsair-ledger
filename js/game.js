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

// ─── INTERNATIONALISATION ─────────────────────────────────────────────────────

let currentLang = (function () {
  try { return localStorage.getItem('corsair_lang') || 'it'; } catch (_) { return 'it'; }
})();

function T(k) { return (STRINGS[currentLang] || STRINGS.it)[k] ?? k; }
function DL(level) { return T('danger' + level); }
function CL(k)     { return T('cargo_' + k); }
function statLabel(stat) {
  return { cargo: T('statCargo'), firepower: T('statFirepower'), hull: T('statHull'), speed: T('statSpeed') }[stat] || stat;
}

const STRINGS = {
  it: {
    langBtn: '🇬🇧 EN',   helpBtn: '?',
    resBarrels: 'Barili',
    danger0: 'Verde', danger1: 'Giallo', danger2: 'Arancione', danger3: 'Rosso',
    dangerDesc0: 'Acque sicure. Nessun ostacolo al commercio.',
    dangerDesc1: 'Qualche pericolo — raccomandata una scorta armata.',
    dangerDesc2: 'Rotta pericolosa. Prepara la flotta alla battaglia.',
    dangerDesc3: 'Zona di guerra. Solo le navi più forti sopravvivono.',
    cargo_tobacco: 'Tabacco', cargo_wine: 'Vino', cargo_cocoa: 'Cacao',
    fleetTitle: 'FLOTTA',
    btnBackup: '💾 Backup', btnImport: '📂 Import', btnReset: '⚠ Reset',
    btnMarket: '🏪 Mercato', btnLog: '📜 Log',
    logPanelTitle: 'LOG EVENTI',
    invLabel: 'Stiva ·',
    statusAtSea: '⛵ In missione', statusDamaged: '🔴 Danneggiata', statusDocked: '⚓ In porto',
    repairBtn: (cost) => `🔧 Ripara (${cost} ◆)`,
    upgradeBtn: '⚙ Upgrade',
    statCargo: '📦 Cargo', statFirepower: '💥 Potenza', statHull: '🛡 Scafo', statSpeed: '💨 Velocità',
    placeholder: 'Seleziona una rotta sulla mappa per iniziare.',
    missionsOnRoute: '🗝 Missioni completate su questa rotta:',
    routeUnlocked: 'Sbloccata', availableMissions: 'Missioni disponibili',
    noCargo: 'Nessun cargo', selectMission: 'Seleziona', insufficientCargo: '⚠ Cargo insufficiente',
    backBtn: '← Indietro',
    battleWarning: (s) => `⚔ Rotta pericolosa — si combatte prima di commerciare. Forza nemica: <strong>${s}</strong>`,
    extremeWarning: "⚠ Traversata estrema — si raccomandano Fregata o Man O'War. Possibile cattura di nave nemica.",
    selectShips: 'Seleziona le navi:', noShipsAvail: 'Nessuna nave disponibile in porto.',
    fleetVsEnemy: (fp, e) => `Potenza flotta: <strong>${fp}</strong> vs Nemico: <strong>${e}</strong>`,
    victoryPct: (p) => `${p}% di vittoria`,
    fireBarrelsLabel: '🔥 Fire Barrels:', youHave: 'hai',
    fbBonus: (n) => `+${n} potenza`,
    timeEst: (m) => `⏱ Tempo stimato: <strong>${m} min</strong>`,
    launchBtn: '⛵ Lancia Missione', selectShipFirst: 'Seleziona almeno una nave',
    damagedReason: (cost) => `🔴 Danneggiata — ripara prima (${cost} ◆)`,
    lockedBadge: '🔒 Bloccata',
    lockedDesc: 'Rotta inesplorata. Guadagna esperienza sulle rotte note per aprire nuovi orizzonti commerciali.',
    howToUnlock: '🗺 Come sbloccare',
    completeMissions: 'Completa', missionsWord: 'missioni su',
    stillNeed: 'mancano ancora', navalCost: 'di spesa navale', youHaveR: 'hai',
    unlockChainTitle: '🔗 Sblocca a sua volta',
    missionsCompletedOf: (d, n) => `${d} / ${n} missioni completate`,
    marketTitle: '🏪 Cantiere Navale', closeBtnTxt: '✕ Chiudi',
    buyShipSection: 'Acquista nave', sellShipSection: 'Vendi nave',
    docksFullBtn: '🚫 Moli pieni', buyBtn: 'Acquista', insufficientFunds: '⚠ Fondi insufficienti',
    noDockedShips: 'Nessuna nave ormeggiata disponibile per la vendita.',
    sellBtn: 'Vendi', lastShipBtn: 'Ultima nave',
    suppliesTitle: '🔥 Rifornimenti', barrelCost: 'Fire Barrel — <strong>5 ◆</strong> cad.',
    barrelStock: (n, g) => `Hai ${n} barili · ${g} ◆`,
    realesAvail: (r) => `⚜ Reales disponibili: <strong>${r}</strong>`,
    upgradeTitle: (name) => `⚙ Upgrade — ${name}`, statMax: '★ MAX',
    battleHeader: (route) => `⚔ Battaglia — ${route}`,
    battleVictory: '⚔ VITTORIA', battleDefeat: '💀 SCONFITTA', battleContinue: 'Continua',
    victoryBody: (l) => `Nemici respinti. Pericolo ridotto a <strong>${l}</strong>.<br>La missione è partita.`,
    defeatBody:  (s) => `<strong>${s}</strong> è stata colpita nel combattimento.<br>La flotta si ritira in porto.`,
    captureTitle: '⚓ Nave Catturata', captureOutcome: '⚓ PREDA!',
    captureBody: (n, t) => `Una nave nemica si è arresa durante la missione.<br><strong>${n}</strong> (${t}) ora batte la tua bandiera e<br>è ancorata al porto in attesa di ordini.`,
    toFleetBtn: 'Alla flotta',
    activeMissionsTitle: 'Missioni in corso',
    missionReady: '✅ Pronta al ritiro',
    timeRemaining: (m, s) => `${m}:${String(s).padStart(2, '0')} rimanenti`,
    collectBtn: 'Ritira bottino', readyLabel: '✓ PRONTA',
    logBattleWon:     (route, d)       => `⚔ Battaglia vinta su ${route}! Pericolo → ${d}.`,
    logBattleLost:    (route, ship)    => `⚔ Battaglia persa su ${route}. ${ship} è danneggiata!`,
    logMissionLaunch: (name, route, m) => `⛵ ${name} avviata su ${route} (${m} min).`,
    logMissionDone:   (name, loot)     => `✅ ${name} completata! Bottino: ${loot}`,
    logRouteUnlock:   (label)          => `🗺 Nuova rotta sbloccata: ${label}!`,
    logUnlockCost:    (cost)           => ` (−${cost.toLocaleString('it-IT')} R)`,
    logRepairOk:      (name, cost)     => `🔧 ${name} riparata per ${cost} ◆.`,
    logRepairFail:    (name, cost)     => `❌ Gemmes insufficienti per riparare ${name} (servono ${cost} ◆).`,
    logBuyOk:         (type, name, p)  => `🏪 ${type} acquistata: ${name} (−${p.toLocaleString('it-IT')} R).`,
    logBuyFail:       (type)           => `❌ Reales insufficienti per acquistare ${type}.`,
    logDocksFull:     ()               => `❌ Moli pieni — vendi o perde una nave prima.`,
    logSellOk:        (name, p)        => `🏪 ${name} venduta per ${p.toLocaleString('it-IT')} R.`,
    logSellFail:      ()               => `❌ Non puoi vendere l'ultima nave della flotta.`,
    logUpgradeOk:     (ship, s, lv, p) => `⚙ ${ship}: ${s} Liv.${lv} (−${p.toLocaleString('it-IT')} R).`,
    logUpgradeFail:   (cost)           => `❌ Reales insufficienti per upgrade (servono ${cost.toLocaleString('it-IT')} R).`,
    logBarrelsOk:     (qty, tot)       => `🔥 Acquistati ${qty} barili di fuoco (−${tot} ◆).`,
    logBarrelsFail:   (tot)            => `❌ Gemmes insufficienti (servono ${tot} ◆).`,
    logCaptureOk:     (name, type)     => `⚓ Nave nemica catturata: ${name} (${type})!`,
    logCaptureNoSlot: ()               => `⚓ Nave nemica sconfitta, ma i moli sono pieni — impossibile portarla in porto.`,
    resetConfirm: 'Sei sicuro? Tutti i progressi saranno cancellati.',
    importErrFile: 'File save non valido', importErrPrefix: 'Errore import: ',
    welcome: 'Benvenuto, Capitano. La flotta è in attesa dei tuoi ordini.',
    locale: 'it-IT',
  },
  en: {
    langBtn: '🇮🇹 IT',   helpBtn: '?',
    resBarrels: 'Barrels',
    danger0: 'Safe', danger1: 'Caution', danger2: 'Dangerous', danger3: 'Warzone',
    dangerDesc0: 'Safe waters. No obstacles to trade.',
    dangerDesc1: 'Some danger — armed escort recommended.',
    dangerDesc2: 'Dangerous route. Prepare your fleet for battle.',
    dangerDesc3: 'War zone. Only the strongest ships survive.',
    cargo_tobacco: 'Tobacco', cargo_wine: 'Wine', cargo_cocoa: 'Cocoa',
    fleetTitle: 'FLEET',
    btnBackup: '💾 Backup', btnImport: '📂 Import', btnReset: '⚠ Reset',
    btnMarket: '🏪 Market', btnLog: '📜 Log',
    logPanelTitle: 'EVENT LOG',
    invLabel: 'Hold ·',
    statusAtSea: '⛵ At sea', statusDamaged: '🔴 Damaged', statusDocked: '⚓ In port',
    repairBtn: (cost) => `🔧 Repair (${cost} ◆)`,
    upgradeBtn: '⚙ Upgrade',
    statCargo: '📦 Cargo', statFirepower: '💥 Firepower', statHull: '🛡 Hull', statSpeed: '💨 Speed',
    placeholder: 'Select a route on the map to begin.',
    missionsOnRoute: '🗝 Missions completed on this route:',
    routeUnlocked: 'Unlocked', availableMissions: 'Available missions',
    noCargo: 'No cargo', selectMission: 'Select', insufficientCargo: '⚠ Insufficient cargo',
    backBtn: '← Back',
    battleWarning: (s) => `⚔ Dangerous route — battle before trading. Enemy strength: <strong>${s}</strong>`,
    extremeWarning: "⚠ Extreme crossing — Frigate or Man O'War recommended. Enemy ship capture possible.",
    selectShips: 'Select ships:', noShipsAvail: 'No ships available in port.',
    fleetVsEnemy: (fp, e) => `Fleet power: <strong>${fp}</strong> vs Enemy: <strong>${e}</strong>`,
    victoryPct: (p) => `${p}% victory chance`,
    fireBarrelsLabel: '🔥 Fire Barrels:', youHave: 'you have',
    fbBonus: (n) => `+${n} power`,
    timeEst: (m) => `⏱ Estimated time: <strong>${m} min</strong>`,
    launchBtn: '⛵ Launch Mission', selectShipFirst: 'Select at least one ship',
    damagedReason: (cost) => `🔴 Damaged — repair first (${cost} ◆)`,
    lockedBadge: '🔒 Locked',
    lockedDesc: 'Uncharted route. Gain experience on known routes to open new trade horizons.',
    howToUnlock: '🗺 How to unlock',
    completeMissions: 'Complete', missionsWord: 'missions on',
    stillNeed: 'still need', navalCost: 'naval expenditure', youHaveR: 'you have',
    unlockChainTitle: '🔗 Also unlocks',
    missionsCompletedOf: (d, n) => `${d} / ${n} missions completed`,
    marketTitle: '🏪 Shipyard', closeBtnTxt: '✕ Close',
    buyShipSection: 'Buy ship', sellShipSection: 'Sell ship',
    docksFullBtn: '🚫 Docks full', buyBtn: 'Buy', insufficientFunds: '⚠ Insufficient funds',
    noDockedShips: 'No docked ships available for sale.',
    sellBtn: 'Sell', lastShipBtn: 'Last ship',
    suppliesTitle: '🔥 Supplies', barrelCost: 'Fire Barrel — <strong>5 ◆</strong> each.',
    barrelStock: (n, g) => `You have ${n} barrels · ${g} ◆`,
    realesAvail: (r) => `⚜ Reales available: <strong>${r}</strong>`,
    upgradeTitle: (name) => `⚙ Upgrade — ${name}`, statMax: '★ MAX',
    battleHeader: (route) => `⚔ Battle — ${route}`,
    battleVictory: '⚔ VICTORY', battleDefeat: '💀 DEFEAT', battleContinue: 'Continue',
    victoryBody: (l) => `Enemies repelled. Danger reduced to <strong>${l}</strong>.<br>Mission launched.`,
    defeatBody:  (s) => `<strong>${s}</strong> was hit in combat.<br>The fleet retreats to port.`,
    captureTitle: '⚓ Ship Captured', captureOutcome: '⚓ PRIZE!',
    captureBody: (n, t) => `An enemy ship surrendered during the mission.<br><strong>${n}</strong> (${t}) now flies your flag and<br>is anchored in port awaiting orders.`,
    toFleetBtn: 'To fleet',
    activeMissionsTitle: 'Active missions',
    missionReady: '✅ Ready to collect',
    timeRemaining: (m, s) => `${m}:${String(s).padStart(2, '0')} remaining`,
    collectBtn: 'Collect loot', readyLabel: '✓ READY',
    logBattleWon:     (route, d)       => `⚔ Battle won on ${route}! Danger → ${d}.`,
    logBattleLost:    (route, ship)    => `⚔ Battle lost on ${route}. ${ship} is damaged!`,
    logMissionLaunch: (name, route, m) => `⛵ ${name} launched on ${route} (${m} min).`,
    logMissionDone:   (name, loot)     => `✅ ${name} complete! Loot: ${loot}`,
    logRouteUnlock:   (label)          => `🗺 New route unlocked: ${label}!`,
    logUnlockCost:    (cost)           => ` (−${cost.toLocaleString('en-US')} R)`,
    logRepairOk:      (name, cost)     => `🔧 ${name} repaired for ${cost} ◆.`,
    logRepairFail:    (name, cost)     => `❌ Not enough Gems to repair ${name} (need ${cost} ◆).`,
    logBuyOk:         (type, name, p)  => `🏪 ${type} purchased: ${name} (−${p.toLocaleString('en-US')} R).`,
    logBuyFail:       (type)           => `❌ Not enough Reales to buy ${type}.`,
    logDocksFull:     ()               => `❌ Docks full — sell a ship first.`,
    logSellOk:        (name, p)        => `🏪 ${name} sold for ${p.toLocaleString('en-US')} R.`,
    logSellFail:      ()               => `❌ You cannot sell your last ship.`,
    logUpgradeOk:     (ship, s, lv, p) => `⚙ ${ship}: ${s} Lv.${lv} (−${p.toLocaleString('en-US')} R).`,
    logUpgradeFail:   (cost)           => `❌ Not enough Reales for upgrade (need ${cost.toLocaleString('en-US')} R).`,
    logBarrelsOk:     (qty, tot)       => `🔥 Bought ${qty} fire barrel(s) (−${tot} ◆).`,
    logBarrelsFail:   (tot)            => `❌ Not enough Gems (need ${tot} ◆).`,
    logCaptureOk:     (name, type)     => `⚓ Enemy ship captured: ${name} (${type})!`,
    logCaptureNoSlot: ()               => `⚓ Enemy ship defeated, but docks are full — cannot bring her to port.`,
    resetConfirm: 'Are you sure? All progress will be lost.',
    importErrFile: 'Invalid save file', importErrPrefix: 'Import error: ',
    welcome: 'Welcome, Captain. The fleet awaits your orders.',
    locale: 'en-US',
  },
};

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

// ── Ship market buy/sell prices ───────────────────────────────────────────
const SHIP_MARKET = {
  gunboat:   { buyPrice:   600, sellPrice:  200 },
  schooner:  { buyPrice:  1200, sellPrice:  400 },
  brig:      { buyPrice:  2500, sellPrice:  900 },
  frigate:   { buyPrice:  6000, sellPrice: 2200 },
  man_o_war: { buyPrice: 12000, sellPrice: 4500 },
};

// ── Per-stat upgrade config (max SHIP_UPGRADE_MAX levels each) ────────────
const SHIP_UPGRADE_MAX  = 3;
const SHIP_UPGRADE_STAT = {
  cargo:     { label: '📦 Cargo',    delta: 5, baseCost: 300 },
  firepower: { label: '💥 Potenza',  delta: 4, baseCost: 500 },
  hull:      { label: '🛡 Scafo',    delta: 4, baseCost: 400 },
  speed:     { label: '💨 Velocità', delta: 1, baseCost: 450 },
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
  // Caraibi → Caraibi (libere, solo missioni)
  havana_tortuga:        { prereq: 'nassau_havana',         needed: 3 },
  tortuga_port_royal:    { prereq: 'nassau_tortuga',        needed: 3 },
  havana_port_royal:     { prereq: 'havana_tortuga',        needed: 3 },
  // Caraibi → Costa Americana (costo di espansione)
  nassau_charleston:     { prereq: 'havana_port_royal',     needed: 2, cost:   600 },
  port_royal_charleston: { prereq: 'tortuga_port_royal',    needed: 4, cost:   800 },
  // Costa Americana → nord
  charleston_boston:     { prereq: 'nassau_charleston',     needed: 3, cost:  1200 },
  // Traversata Atlantica (costosa)
  charleston_dakar:      { prereq: 'charleston_boston',     needed: 3, cost:  4000 },
  port_royal_dakar:      { prereq: 'port_royal_charleston', needed: 3, cost:  4000 },
  // Africa Occidentale
  dakar_cape_verde:      { prereq: 'charleston_dakar',      needed: 1, cost:  1500 },
  cape_verde_nassau:     { prereq: 'dakar_cape_verde',      needed: 3, cost:  2500 },
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
  eventLog: [], // populated at init with T('welcome')
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
  // Ensure ship upgrades exist
  state.fleet.forEach(ship => {
    if (!ship.upgrades) ship.upgrades = { cargo: 0, firepower: 0, hull: 0, speed: 0 };
  });
  // Ensure active missions have startedAt (fallback: 10 min before completesAt)
  state.activeMissions.forEach(am => {
    if (!am.startedAt) am.startedAt = am.completesAt - 600_000;
  });
}

function saveState() {
  state.savedAt = new Date().toISOString();
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

function resetState() {
  if (!confirm(T('resetConfirm'))) return false;
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
  if (!parsed.version || !parsed.player) throw new Error(T('importErrFile'));
  state = parsed;
  saveState();
}

function addLog(msg) {
  const t = new Date().toLocaleTimeString(T('locale'), { hour: '2-digit', minute: '2-digit' });
  state.eventLog.unshift(`[${t}] ${msg}`);
  if (state.eventLog.length > 60) state.eventLog.length = 60;
}

function deepClone(obj) { return JSON.parse(JSON.stringify(obj)); }

// ─── GAME LOGIC ───────────────────────────────────────────────────────────────

function canAffordCargo(requiredCargo) {
  return Object.entries(requiredCargo).every(([t, a]) => (state.player.cargo[t] || 0) >= a);
}

// Returns a ship's effective stat value, including any upgrades applied.
function getEffectiveStat(ship, stat) {
  const base  = SHIP_TYPES[ship.type][stat];
  const level = ship.upgrades?.[stat] || 0;
  return base + level * (SHIP_UPGRADE_STAT[stat]?.delta || 0);
}

function fleetCombatPower(shipIds) {
  return shipIds.reduce((sum, id) => {
    const ship = state.fleet.find(s => s.id === id);
    return sum + getEffectiveStat(ship, 'firepower') + getEffectiveStat(ship, 'hull');
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
    return s + getEffectiveStat(ship, 'speed');
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
      battleResult = { outcome: 'victory', routeLabel: routeData.label, newDangerLabel: DL(routeState.dangerLevel) };
      addLog(T('logBattleWon')(routeData.label, battleResult.newDangerLabel));
    } else {
      const victimId = shipIds[Math.floor(Math.random() * shipIds.length)];
      const victim   = state.fleet.find(s => s.id === victimId);
      victim.status  = 'damaged';
      addLog(T('logBattleLost')(routeData.label, victim.name));
      saveState();
      return { success: false, battle: { outcome: 'defeat', routeLabel: routeData.label, damagedShip: victim.name } };
    }
  }

  shipIds.forEach(id => { state.fleet.find(s => s.id === id).status = 'at_sea'; });

  const minutes     = calcMissionMinutes(shipIds, mission.baseMinutes);
  const completesAt = Date.now() + minutes * 60 * 1000;

  state.activeMissions.push({
    id: `am_${Date.now()}`, routeId, missionId, shipIds,
    startedAt: Date.now(), completesAt,
    reward: mission.reward, missionName: mission.name, routeLabel: routeData.label,
  });

  addLog(T('logMissionLaunch')(mission.name, routeData.label, minutes));
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
    reward.cargo ? Object.entries(reward.cargo).map(([t, a]) => `${a} ${CL(t)}`).join(', ') : '',
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
      addLog(T('logCaptureOk')(captured.name, SHIP_TYPES[captured.type].name));
    } else {
      addLog(T('logCaptureNoSlot')());
    }
  }

  addLog(T('logMissionDone')(am.missionName, parts));
  saveState();
}

function checkRouteUnlocks() {
  Object.entries(UNLOCK_CONDITIONS).forEach(([routeId, { prereq, needed, cost }]) => {
    const rs = state.routes[routeId];
    if (rs.unlocked) return;
    const done = state.routes[prereq]?.missionsCompleted || 0;
    if (done < needed) return;
    if (cost && state.player.reales < cost) return; // missioni ok ma non abbastanza Reales
    if (cost) state.player.reales -= cost;
    rs.unlocked = true;
    const costStr = cost ? T('logUnlockCost')(cost) : '';
    addLog(T('logRouteUnlock')(ROUTES[routeId].label) + costStr);
  });
}

function repairShip(shipId) {
  const ship = state.fleet.find(s => s.id === shipId);
  if (!ship || ship.status !== 'damaged') return;
  const cost = SHIP_TYPES[ship.type].repairCost;
  if (state.player.gemmes < cost) {
    addLog(T('logRepairFail')(ship.name, cost));
    return;
  }
  state.player.gemmes -= cost;
  ship.status = 'docked'; ship.damage = 0;
  addLog(T('logRepairOk')(ship.name, cost));
  saveState();
}

// ─── MARKET & UPGRADE ACTIONS ────────────────────────────────────────────────

function buyShip(typeId) {
  const price = SHIP_MARKET[typeId]?.buyPrice;
  if (!price) return;
  if (state.player.reales < price) { addLog(T('logBuyFail')(SHIP_TYPES[typeId].name)); return; }
  if (state.fleet.length >= state.dockSlots) { addLog(T('logDocksFull')()); return; }
  state.player.reales -= price;
  const newShip = {
    id: `ship_${Date.now()}`,
    name: CAPTURED_NAMES[Math.floor(Math.random() * CAPTURED_NAMES.length)],
    type: typeId, status: 'docked', damage: 0,
    upgrades: { cargo: 0, firepower: 0, hull: 0, speed: 0 },
  };
  state.fleet.push(newShip);
  addLog(T('logBuyOk')(SHIP_TYPES[typeId].name, newShip.name, price));
  saveState();
}

function sellShip(shipId) {
  const ship = state.fleet.find(s => s.id === shipId);
  if (!ship || ship.status !== 'docked') return;
  if (state.fleet.length <= 1) { addLog(T('logSellFail')()); return; }
  const price = SHIP_MARKET[ship.type]?.sellPrice || 0;
  state.fleet = state.fleet.filter(s => s.id !== shipId);
  state.player.reales += price;
  addLog(T('logSellOk')(ship.name, price));
  saveState();
}

function upgradeShip(shipId, stat) {
  const ship = state.fleet.find(s => s.id === shipId);
  if (!ship || ship.status !== 'docked') return;
  if (!ship.upgrades) ship.upgrades = { cargo: 0, firepower: 0, hull: 0, speed: 0 };
  const level = ship.upgrades[stat] || 0;
  if (level >= SHIP_UPGRADE_MAX) return;
  const cost = SHIP_UPGRADE_STAT[stat].baseCost * (level + 1);
  if (state.player.reales < cost) { addLog(T('logUpgradeFail')(cost)); return; }
  state.player.reales -= cost;
  ship.upgrades[stat] = level + 1;
  addLog(T('logUpgradeOk')(ship.name, statLabel(stat), level + 1, cost));
  saveState();
}

function buyFireBarrels(qty) {
  const costEach = 5; // Gemmes per barrel
  const total = costEach * qty;
  if (state.player.gemmes < total) { addLog(T('logBarrelsFail')(total)); return; }
  state.player.gemmes -= total;
  state.player.fireBarrels += qty;
  addLog(T('logBarrelsOk')(qty, total));
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
let showMarket        = false; // market panel open
let upgradeShipId     = null;  // upgrade panel for this ship id

// ── Map zoom / pan state ──────────────────────────────────────────────────
let mapView = { x: 0, y: 0, w: 880, h: 300 }; // current viewBox
let mapDrag = null; // { startX, startY, startVX, startVY }

function clampMapView() {
  const MIN_W = 880 / 8, MIN_H = 300 / 8;
  mapView.w = Math.max(MIN_W, Math.min(880, mapView.w));
  mapView.h = mapView.w * 300 / 880;                       // keep aspect ratio
  mapView.x = Math.max(0, Math.min(880 - mapView.w, mapView.x));
  mapView.y = Math.max(0, Math.min(300 - mapView.h, mapView.y));
}

function setSelectedRoute(routeId) {
  selectedRouteId   = routeId;
  selectedMissionId = null;
  selectedShipIds.clear();
  fireBarrelsUsed   = 0;
}

function clearSelection() {
  selectedRouteId = null; selectedMissionId = null;
  selectedShipIds.clear(); fireBarrelsUsed = 0;
  lastCaptureResult = null; showMarket = false; upgradeShipId = null;
}

function renderAll() {
  renderHeader();
  renderMap();
  renderFleet();
  renderPanel();
  renderInventory();
}

function renderHeader() {
  document.getElementById('res-reales').textContent  = state.player.reales.toLocaleString(T('locale'));
  document.getElementById('res-gemmes').textContent  = state.player.gemmes;
  document.getElementById('res-barrels').textContent = state.player.fireBarrels;
  // Dynamic text that changes with language
  const btnLang = document.getElementById('btn-lang');
  if (btnLang) btnLang.textContent = T('langBtn');
  const fleetTitle = document.getElementById('fleet-title');
  if (fleetTitle) fleetTitle.textContent = T('fleetTitle');
  const logHeader = document.querySelector('#log-header span');
  if (logHeader) logHeader.textContent = T('logPanelTitle');
  const btnMarket = document.getElementById('btn-market');
  if (btnMarket) btnMarket.textContent = T('btnMarket');
  const btnLog = document.getElementById('btn-log');
  if (btnLog) btnLog.textContent = T('btnLog');
  const btnReset = document.getElementById('btn-reset');
  if (btnReset) btnReset.textContent = T('btnReset');
  const btnBackup = document.getElementById('btn-save-export');
  if (btnBackup) btnBackup.textContent = T('btnBackup');
  const resBarrelsLabel = document.getElementById('res-barrels-label');
  if (resBarrelsLabel) resBarrelsLabel.textContent = T('resBarrels');
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
  const vb = `${mapView.x.toFixed(2)} ${mapView.y.toFixed(2)} ${mapView.w.toFixed(2)} ${mapView.h.toFixed(2)}`;
  svgAttr(svg, { viewBox: vb, id: 'map-svg', preserveAspectRatio: 'xMidYMid meet' });

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
      // Animated ship: compute bezier position from mission progress
      const am     = state.activeMissions.find(m => m.routeId === route.id);
      const total  = am.completesAt - (am.startedAt ?? am.completesAt - 600_000);
      const t      = Math.max(0, Math.min(1, (now - (am.startedAt ?? am.completesAt - 600_000)) / total));
      const bx     = (1-t)*(1-t)*p1.x + 2*(1-t)*t*cx + t*t*p2.x;
      const by     = (1-t)*(1-t)*p1.y + 2*(1-t)*t*cy + t*t*p2.y;
      // Direction angle from bezier tangent
      const tdx    = 2*(1-t)*(cx-p1.x) + 2*t*(p2.x-cx);
      const tdy    = 2*(1-t)*(cy-p1.y) + 2*t*(p2.y-cy);
      const angle  = Math.atan2(tdy, tdx) * 180 / Math.PI;
      const shipG  = svgEl('g');
      svgAttr(shipG, { transform: `translate(${bx.toFixed(1)},${by.toFixed(1)})` });
      const shipBg = svgEl('circle');
      svgAttr(shipBg, { r: 9, fill: '#f0e8c4', stroke: color, 'stroke-width': 1.5, class: 'mission-pulse' });
      shipG.appendChild(shipBg);
      // Ship emoji doesn't rotate (looks odd); show direction via a tiny arrow instead
      const shipTxt = svgEl('text');
      svgAttr(shipTxt, { 'text-anchor': 'middle', 'dominant-baseline': 'central', 'font-size': 10 });
      shipTxt.textContent = '⛵';
      shipG.appendChild(shipTxt);
      svg.appendChild(shipG);
    }
    if (ready) {
      const am = state.activeMissions.find(m => m.routeId === route.id && m.completesAt <= now);
      svgText(svg, T('readyLabel'), p2.x, p2.y - 14, {
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
    const lbl     = ship.status === 'at_sea' ? T('statusAtSea') : ship.status === 'damaged' ? T('statusDamaged') : T('statusDocked');
    return `<div class="ship-card ${cls}">
      <div class="ship-header">
        <span class="ship-name">${ship.name}</span>
        <span class="ship-type-badge">${st.name}</span>
      </div>
      <div class="ship-stats">
        <span title="${T('statCargo')}">📦 ${getEffectiveStat(ship, 'cargo')}</span>
        <span title="${T('statFirepower')}">💥 ${getEffectiveStat(ship, 'firepower')}</span>
        <span title="${T('statHull')}">🛡 ${getEffectiveStat(ship, 'hull')}</span>
        <span title="${T('statSpeed')}">💨 ${getEffectiveStat(ship, 'speed')}</span>
      </div>
      <div class="ship-status ${cls}">${lbl}</div>
      ${ship.status === 'damaged'
        ? `<button class="btn-repair" data-ship="${ship.id}">${T('repairBtn')(st.repairCost)}</button>`
        : ship.status === 'docked'
          ? `<button class="btn-upgrade-ship" data-ship="${ship.id}">${T('upgradeBtn')}</button>`
          : ''}
    </div>`;
  }).join('');
  container.querySelectorAll('.btn-repair').forEach(btn => {
    btn.addEventListener('click', () => { repairShip(btn.dataset.ship); renderAll(); });
  });
  container.querySelectorAll('.btn-upgrade-ship').forEach(btn => {
    btn.addEventListener('click', () => {
      upgradeShipId = btn.dataset.ship; showMarket = false; selectedRouteId = null;
      renderAll();
    });
  });
}

function renderPanel() {
  const container = document.getElementById('detail-content');
  if (!container) return;
  if (lastBattleResult)  { renderBattleResult(container, lastBattleResult); return; }
  if (lastCaptureResult) { renderCaptureResult(container, lastCaptureResult); return; }
  if (upgradeShipId)     { renderShipUpgradePanel(container, state.fleet.find(s => s.id === upgradeShipId)); return; }
  if (showMarket)        { renderMarket(container); return; }
  if (!selectedRouteId)  { renderActiveMissionsPanel(container); return; }
  const route      = ROUTES[selectedRouteId];
  const routeState = state.routes[selectedRouteId];
  if (!routeState.unlocked) { renderLockedRoutePanel(container, route); return; }
  const dl         = routeState.dangerLevel;
  const color      = DANGER_COLOR[dl];
  const dlabel     = DL(dl);
  selectedMissionId ? renderMissionDetail(container, route, dl, color, dlabel)
                    : renderRouteOverview(container, route, dl, color, dlabel);
}

function renderRouteOverview(container, route, dl, color, dlabel) {
  const amList = getActiveMissionsWithTime().filter(m => m.routeId === route.id);
  const dangerDescText = T('dangerDesc' + dl);

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
      <div class="route-unlocks-title">${T('missionsOnRoute')} <strong>${done}</strong></div>`;
    unlocks.forEach(([rid, cond]) => {
      const pct      = Math.min(100, Math.round(done / cond.needed * 100));
      const barColor = pct >= 100 ? '#4a7c59' : pct >= 50 ? '#b89a2a' : '#5a6878';
      const isUnlocked = state.routes[rid].unlocked;
      html += `<div class="route-unlock-item ${isUnlocked ? 'already-unlocked' : ''}">
        <div class="route-unlock-row">
          <span class="route-unlock-name">${isUnlocked ? '✅' : '🔒'} ${ROUTES[rid].label}</span>
          <span class="route-unlock-req">${isUnlocked ? T('routeUnlocked') : `${done}/${cond.needed}`}</span>
        </div>
        ${!isUnlocked ? `<div class="odds-bar-wrap"><div class="odds-bar-fill" style="width:${pct}%;background:${barColor}"></div></div>` : ''}
      </div>`;
    });
    html += `</div>`;
  }

  html += `<h4 class="missions-title">${T('availableMissions')}</h4>`;
  route.missions.forEach(m => {
    const ok     = canAffordCargo(m.requiredCargo);
    const reqStr = Object.entries(m.requiredCargo).map(([t, a]) => `${a} ${CL(t)}`).join(', ') || T('noCargo');
    html += `<div class="mission-card ${ok ? '' : 'unaffordable'}">
      <div class="mission-name">${m.name}</div>
      <div class="mission-info">🧳 ${reqStr}</div>
      <div class="mission-info">💰 ${rewardStr(m.reward)}</div>
      <div class="mission-info">⏱ ~${m.baseMinutes} min (base)</div>
      <button class="btn-select-mission" data-mission="${m.id}" ${ok ? '' : 'disabled'}>
        ${ok ? T('selectMission') : T('insufficientCargo')}
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
        return `${a} ${CL(t)} <span class="${has >= a ? 'ok' : 'err'}">(${T('youHave')} ${has})</span>`;
      }).join(', ');

  let html = `<div class="panel-route-header">
    <button class="btn-back">${T('backBtn')}</button>
    <h3>${mission.name}</h3>
  </div>
  <div class="mission-meta">
    <span>${route.label}</span>
    <span class="danger-badge" style="--dc:${color}">● ${dlabel}</span>
  </div>
  <div class="mission-req">🧳 ${reqHtml}</div>
  <div class="mission-req">💰 ${rewardStr(mission.reward)}</div>`;

  if (dangerous) {
    html += `<div class="battle-warning">${T('battleWarning')(route.enemyStrength)}</div>`;
    if (dl === 3) html += `<div class="battle-warning" style="border-left-color:#8b6914;background:#f8f0e0;color:#4a3010">${T('extremeWarning')}</div>`;
  }

  html += `<h4 class="ship-select-title">${T('selectShips')}</h4>`;
  if (!available.length) {
    html += `<p class="no-ships">${T('noShipsAvail')}</p>`;
  } else {
    available.forEach(ship => {
      const st       = SHIP_TYPES[ship.type];
      const chk      = selectedShipIds.has(ship.id);
      const isDamaged = ship.status === 'damaged';
      html += `<label class="ship-select ${chk ? 'selected' : ''} ${isDamaged ? 'unavailable' : ''}">
        <input type="checkbox" data-ship="${ship.id}" ${chk ? 'checked' : ''} ${isDamaged ? 'disabled' : ''}>
        <span class="ship-name">${ship.name}</span>
        <span class="ship-type-badge">${st.name}</span>
        <span class="ship-mini-stats">💥${getEffectiveStat(ship,'firepower')} 🛡${getEffectiveStat(ship,'hull')} 💨${getEffectiveStat(ship,'speed')}</span>
        ${isDamaged ? `<span class="ship-unavail-reason">${T('damagedReason')(st.repairCost)}</span>` : ''}
      </label>`;
    });
  }

  if (dangerous && selArr.length) {
    const pct      = Math.round(odds * 100);
    const barColor = pct >= 70 ? '#4a7c59' : pct >= 45 ? '#b89a2a' : '#8b2020';
    const fp       = fleetCombatPower(selArr) + fireBarrelsUsed * 12;
    html += `<div class="odds-section">
      <div class="odds-label">${T('fleetVsEnemy')(fp, route.enemyStrength)}</div>
      <div class="odds-bar-wrap"><div class="odds-bar-fill" style="width:${pct}%;background:${barColor}"></div></div>
      <div class="odds-pct" style="color:${barColor}">${T('victoryPct')(pct)}</div>
    </div>`;
  }

  if (dangerous) {
    html += `<div class="fire-barrel-row">${T('fireBarrelsLabel')}
      <button class="btn-fb" data-act="minus">−</button>
      <span class="fb-val">${fireBarrelsUsed}</span>
      <button class="btn-fb" data-act="plus">+</button>
      <span class="fb-stock">(${T('youHave')} ${state.player.fireBarrels})</span>
      ${fireBarrelsUsed ? `<span class="fb-bonus">${T('fbBonus')(fireBarrelsUsed * 12)}</span>` : ''}
    </div>`;
  }

  if (minutes !== null) html += `<div class="time-estimate">${T('timeEst')(minutes)}</div>`;

  html += `<button class="btn-launch" ${selArr.length ? '' : 'disabled'}>
    ${selArr.length ? T('launchBtn') : T('selectShipFirst')}
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
      <div class="unlock-chain-title">${T('unlockChainTitle')}</div>
      ${chain.map(([rid]) => `<span class="unlock-chain-item">${ROUTES[rid].label}</span>`).join('')}
    </div>`;
  }

  container.innerHTML = `
    <div class="panel-route-header">
      <h3>${route.label}</h3>
      <span class="danger-badge" style="--dc:#5a6878">${T('lockedBadge')}</span>
    </div>
    <p class="route-desc">${T('lockedDesc')}</p>
    <div class="unlock-req-box">
      <div class="unlock-req-title">${T('howToUnlock')}</div>
      <div class="unlock-req-desc">${T('completeMissions')} <strong>${cond.needed}</strong> ${T('missionsWord')}
        <strong>${prereq.label}</strong>${remaining > 0 ? ` (${T('stillNeed')} <strong>${remaining}</strong>)` : ' ✅'}
        ${cond.cost ? `<br>+ <strong>${cond.cost.toLocaleString(T('locale'))} R</strong> ${T('navalCost')}
          <span class="${state.player.reales >= cond.cost ? 'ok' : 'err'}">(${T('youHaveR')} ${state.player.reales.toLocaleString(T('locale'))} R)</span>` : ''}</div>
      <div class="odds-bar-wrap" style="margin-top:8px">
        <div class="odds-bar-fill" style="width:${pct}%;background:${barColor}"></div>
      </div>
      <div class="unlock-progress-text" style="color:${barColor}">${T('missionsCompletedOf')(done, cond.needed)}</div>
    </div>
    ${chainHtml}`;
}

function renderMarket(container) {
  const canBuy  = (typeId) => state.player.reales >= SHIP_MARKET[typeId].buyPrice && state.fleet.length < state.dockSlots;
  const canSell = (ship)   => ship.status === 'docked' && state.fleet.length > 1;

  let html = `<div class="market-header">
    <h3>${T('marketTitle')}</h3>
    <button class="btn-back market-close">${T('closeBtnTxt')}</button>
  </div>

  <h4 class="market-section-title">${T('buyShipSection')}</h4>
  <div class="market-buy-grid">`;

  Object.entries(SHIP_TYPES).forEach(([typeId, st]) => {
    const m   = SHIP_MARKET[typeId];
    const ok  = canBuy(typeId);
    html += `<div class="market-ship-card ${ok ? '' : 'unaffordable'}">
      <div class="market-ship-name">${st.name}</div>
      <div class="ship-stats">
        <span title="${T('statCargo')}">📦 ${st.cargo}</span>
        <span title="${T('statFirepower')}">💥 ${st.firepower}</span>
        <span title="${T('statHull')}">🛡 ${st.hull}</span>
        <span title="${T('statSpeed')}">💨 ${st.speed}</span>
      </div>
      <div class="market-price">⚜ ${m.buyPrice.toLocaleString(T('locale'))} R</div>
      <button class="btn-buy-ship" data-type="${typeId}" ${ok ? '' : 'disabled'}>
        ${state.fleet.length >= state.dockSlots ? T('docksFullBtn') : ok ? T('buyBtn') : T('insufficientFunds')}
      </button>
    </div>`;
  });
  html += `</div>

  <h4 class="market-section-title">${T('sellShipSection')}</h4>
  <div class="market-sell-list">`;

  const docked = state.fleet.filter(s => s.status === 'docked');
  if (!docked.length) {
    html += `<p class="no-ships">${T('noDockedShips')}</p>`;
  } else {
    docked.forEach(ship => {
      const m = SHIP_MARKET[ship.type];
      const ok = canSell(ship);
      html += `<div class="market-sell-row">
        <span class="market-sell-name">${ship.name}</span>
        <span class="ship-type-badge">${SHIP_TYPES[ship.type].name}</span>
        <span class="market-price">⚜ +${m.sellPrice.toLocaleString(T('locale'))} R</span>
        <button class="btn-sell-ship" data-ship="${ship.id}" ${ok ? '' : 'disabled'}>
          ${ok ? T('sellBtn') : T('lastShipBtn')}
        </button>
      </div>`;
    });
  }

  html += `</div>
  <h4 class="market-section-title">${T('suppliesTitle')}</h4>
  <div class="market-barrels-row">
    <span>${T('barrelCost')}</span>
    <span class="fb-stock">${T('barrelStock')(state.player.fireBarrels, state.player.gemmes)}</span>
    <button class="btn-buy-barrels" data-qty="1" ${state.player.gemmes >= 5 ? '' : 'disabled'}>+1</button>
    <button class="btn-buy-barrels" data-qty="3" ${state.player.gemmes >= 15 ? '' : 'disabled'}>+3</button>
    <button class="btn-buy-barrels" data-qty="5" ${state.player.gemmes >= 25 ? '' : 'disabled'}>+5</button>
  </div>`;

  container.innerHTML = html;
  container.querySelector('.market-close').addEventListener('click', () => { showMarket = false; renderAll(); });
  container.querySelectorAll('.btn-buy-ship').forEach(btn => {
    btn.addEventListener('click', () => { buyShip(btn.dataset.type); renderAll(); });
  });
  container.querySelectorAll('.btn-sell-ship').forEach(btn => {
    btn.addEventListener('click', () => { sellShip(btn.dataset.ship); renderAll(); });
  });
  container.querySelectorAll('.btn-buy-barrels').forEach(btn => {
    btn.addEventListener('click', () => { buyFireBarrels(Number(btn.dataset.qty)); renderAll(); });
  });
}

function renderShipUpgradePanel(container, ship) {
  if (!ship) { upgradeShipId = null; renderPanel(); return; }
  const st = SHIP_TYPES[ship.type];
  if (!ship.upgrades) ship.upgrades = { cargo: 0, firepower: 0, hull: 0, speed: 0 };

  let html = `<div class="market-header">
    <h3>${T('upgradeTitle')(ship.name)}</h3>
    <button class="btn-back upgrade-close">${T('closeBtnTxt')}</button>
  </div>
  <div class="upgrade-ship-badge"><span class="ship-type-badge">${st.name}</span></div>
  <div class="upgrade-grid">`;

  Object.entries(SHIP_UPGRADE_STAT).forEach(([stat, cfg]) => {
    const level    = ship.upgrades[stat] || 0;
    const maxed    = level >= SHIP_UPGRADE_MAX;
    const cost     = cfg.baseCost * (level + 1);
    const baseVal  = st[stat];
    const currVal  = baseVal + level * cfg.delta;
    const nextVal  = baseVal + (level + 1) * cfg.delta;
    const canAfford = state.player.reales >= cost;

    html += `<div class="upgrade-row">
      <div class="upgrade-stat-label">${statLabel(stat)}</div>
      <div class="upgrade-stat-val">${currVal}${!maxed ? ` → <strong>${nextVal}</strong>` : ` ${T('statMax')}`}</div>
      <div class="upgrade-stars">${'★'.repeat(level)}${'☆'.repeat(SHIP_UPGRADE_MAX - level)}</div>
      <button class="btn-do-upgrade" data-ship="${ship.id}" data-stat="${stat}"
        ${maxed || !canAfford ? 'disabled' : ''}>
        ${maxed ? T('statMax') : canAfford ? `${cost.toLocaleString(T('locale'))} R` : `⚠ ${cost.toLocaleString(T('locale'))} R`}
      </button>
    </div>`;
  });

  html += `</div>
  <div class="upgrade-reales">${T('realesAvail')(state.player.reales.toLocaleString(T('locale')))}</div>`;

  container.innerHTML = html;
  container.querySelector('.upgrade-close').addEventListener('click', () => { upgradeShipId = null; renderAll(); });
  container.querySelectorAll('.btn-do-upgrade').forEach(btn => {
    btn.addEventListener('click', () => { upgradeShip(btn.dataset.ship, btn.dataset.stat); renderAll(); });
  });
}

function renderBattleResult(container, battle) {
  const isVictory = battle.outcome === 'victory';
  container.innerHTML = `
    <div class="battle-result ${isVictory ? 'victory' : 'defeat'}">
      <div class="battle-result-header">
        <span class="battle-route">${T('battleHeader')(battle.routeLabel)}</span>
      </div>
      <div class="battle-result-outcome">
        ${isVictory ? T('battleVictory') : T('battleDefeat')}
      </div>
      <div class="battle-result-body">
        ${isVictory ? T('victoryBody')(battle.newDangerLabel) : T('defeatBody')(battle.damagedShip)}
      </div>
      <button class="btn-battle-continue">${T('battleContinue')}</button>
    </div>`;
  container.querySelector('.btn-battle-continue').addEventListener('click', () => {
    lastBattleResult = null;
    renderAll();
  });
}

function renderCaptureResult(container, capture) {
  container.innerHTML = `
    <div class="battle-result victory">
      <div class="battle-result-header">${T('captureTitle')}</div>
      <div class="battle-result-outcome">${T('captureOutcome')}</div>
      <div class="battle-result-body">${T('captureBody')(capture.shipName, capture.shipType)}</div>
      <button class="btn-battle-continue">${T('toFleetBtn')}</button>
    </div>`;
  container.querySelector('.btn-battle-continue').addEventListener('click', () => {
    lastCaptureResult = null;
    renderAll();
  });
}

function renderActiveMissionsPanel(container) {
  const missions = getActiveMissionsWithTime();
  if (!missions.length) {
    container.innerHTML = `<p class="placeholder">${T('placeholder')}</p>`;
    return;
  }
  container.innerHTML = `<h3>${T('activeMissionsTitle')}</h3>
    <div class="active-missions-list">${missions.map(activeMissionCardHtml).join('')}</div>`;
  container.querySelectorAll('.btn-collect').forEach(btn => {
    btn.addEventListener('click', () => { collectMission(btn.dataset.am); renderAll(); });
  });
}

function activeMissionCardHtml(am) {
  const mins = Math.floor(am.msRemaining / 60000);
  const secs = Math.floor((am.msRemaining % 60000) / 1000);
  const timeHtml = am.ready
    ? `<span class="ready-text">${T('missionReady')}</span>`
    : `<span class="countdown">${T('timeRemaining')(mins, secs)}</span>`;
  return `<div class="active-mission-card ${am.ready ? 'ready' : ''}">
    <div class="am-name">${am.missionName}</div>
    <div class="am-route">${am.routeLabel}</div>
    <div class="am-time">${timeHtml}</div>
    <div class="am-reward">💰 ${rewardStr(am.reward)}</div>
    ${am.ready ? `<button class="btn-collect" data-am="${am.id}">${T('collectBtn')}</button>` : ''}
  </div>`;
}

function renderInventory() {
  const el = document.getElementById('inventory-display');
  if (!el) return;
  const { cargo } = state.player;
  el.innerHTML = `<span class="inv-label">${T('invLabel')}</span>`
    + Object.keys(CARGO_LABELS)
        .map(k => `<span class="cargo-item">${CL(k)}: <strong>${cargo[k] || 0}</strong></span>`)
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
    reward.cargo ? Object.entries(reward.cargo).map(([t, a]) => `${a} ${CL(t)}`).join(', ') : '',
  ].filter(Boolean).join(' + ');
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  loadState();
  // Seed welcome log for fresh saves
  if (!state.eventLog.length) { state.eventLog.push(T('welcome')); saveState(); }
  renderAll();
  setInterval(renderAll, 1000);

  document.getElementById('btn-save-export').addEventListener('click', exportSave);

  document.getElementById('import-file').addEventListener('change', async e => {
    const file = e.target.files[0]; if (!file) return;
    try { await importSave(file); clearSelection(); renderAll(); }
    catch (err) { alert(T('importErrPrefix') + err.message); }
    e.target.value = '';
  });

  // ── Language toggle ────────────────────────────────────────────────────────
  document.getElementById('btn-lang')?.addEventListener('click', () => {
    currentLang = currentLang === 'it' ? 'en' : 'it';
    try { localStorage.setItem('corsair_lang', currentLang); } catch (_) {}
    renderAll();
  });

  // ── Help / manual ──────────────────────────────────────────────────────────
  const helpPanel = document.getElementById('help-panel');
  document.getElementById('btn-help')?.addEventListener('click', () => {
    helpPanel?.classList.toggle('hidden');
  });
  document.getElementById('btn-close-help')?.addEventListener('click', () => {
    helpPanel?.classList.add('hidden');
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

  document.getElementById('btn-market').addEventListener('click', () => {
    showMarket = !showMarket;
    if (showMarket) { upgradeShipId = null; selectedRouteId = null; }
    renderAll();
  });

  // ── Map zoom / pan ─────────────────────────────────────────────────────────
  const mapContainer = document.getElementById('map-container');

  mapContainer.addEventListener('wheel', e => {
    e.preventDefault();
    const rect   = mapContainer.getBoundingClientRect();
    const svgX   = (e.clientX - rect.left) / rect.width  * mapView.w + mapView.x;
    const svgY   = (e.clientY - rect.top)  / rect.height * mapView.h + mapView.y;
    const factor = e.deltaY < 0 ? 0.8 : 1.25;
    mapView.w *= factor;
    mapView.h  = mapView.w * 300 / 880;
    mapView.x  = svgX - (e.clientX - rect.left) / rect.width  * mapView.w;
    mapView.y  = svgY - (e.clientY - rect.top)  / rect.height * mapView.h;
    clampMapView();
    renderMap();
  }, { passive: false });

  mapContainer.addEventListener('mousedown', e => {
    if (e.button !== 0) return;
    mapDrag = { startX: e.clientX, startY: e.clientY, startVX: mapView.x, startVY: mapView.y };
    mapContainer.classList.add('dragging');
  });
  window.addEventListener('mousemove', e => {
    if (!mapDrag) return;
    const rect = mapContainer.getBoundingClientRect();
    mapView.x  = mapDrag.startVX - (e.clientX - mapDrag.startX) / rect.width  * mapView.w;
    mapView.y  = mapDrag.startVY - (e.clientY - mapDrag.startY) / rect.height * mapView.h;
    clampMapView();
    renderMap();
  });
  window.addEventListener('mouseup', () => {
    mapDrag = null;
    mapContainer.classList.remove('dragging');
  });

  // Double-click resets zoom/pan
  mapContainer.addEventListener('dblclick', () => {
    mapView = { x: 0, y: 0, w: 880, h: 300 };
    renderMap();
  });

  // Touch support (pinch-zoom + pan)
  let lastTouches = null;
  mapContainer.addEventListener('touchstart', e => {
    lastTouches = Array.from(e.touches).map(t => ({ x: t.clientX, y: t.clientY }));
  }, { passive: true });
  mapContainer.addEventListener('touchmove', e => {
    e.preventDefault();
    const touches = Array.from(e.touches).map(t => ({ x: t.clientX, y: t.clientY }));
    const rect    = mapContainer.getBoundingClientRect();
    if (touches.length === 1 && lastTouches?.length === 1) {
      const dx = (touches[0].x - lastTouches[0].x) / rect.width  * mapView.w;
      const dy = (touches[0].y - lastTouches[0].y) / rect.height * mapView.h;
      mapView.x -= dx; mapView.y -= dy;
    } else if (touches.length === 2 && lastTouches?.length === 2) {
      const prevDist = Math.hypot(lastTouches[1].x - lastTouches[0].x, lastTouches[1].y - lastTouches[0].y);
      const currDist = Math.hypot(touches[1].x - touches[0].x, touches[1].y - touches[0].y);
      const factor   = prevDist / currDist;
      const cx       = (touches[0].x + touches[1].x) / 2;
      const cy       = (touches[0].y + touches[1].y) / 2;
      const svgX     = (cx - rect.left) / rect.width  * mapView.w + mapView.x;
      const svgY     = (cy - rect.top)  / rect.height * mapView.h + mapView.y;
      mapView.w *= factor; mapView.h = mapView.w * 300 / 880;
      mapView.x  = svgX - (cx - rect.left) / rect.width  * mapView.w;
      mapView.y  = svgY - (cy - rect.top)  / rect.height * mapView.h;
    }
    clampMapView();
    renderMap();
    lastTouches = touches;
  }, { passive: false });
  mapContainer.addEventListener('touchend', () => { lastTouches = null; });
});
