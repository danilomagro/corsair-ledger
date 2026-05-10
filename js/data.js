// Static game data — ports, routes, missions, ship types.

export const PORTS = {
  nassau:     { id: 'nassau',     name: 'Nassau',     x: 378, y: 88,  desc: 'Cuore dei Caraibi — porto libero' },
  havana:     { id: 'havana',     name: 'Havana',     x: 228, y: 182, desc: 'Fortezza spagnola di Cuba' },
  tortuga:    { id: 'tortuga',    name: 'Tortuga',    x: 508, y: 168, desc: 'Covo dei corsari di Hispaniola' },
  port_royal: { id: 'port_royal', name: 'Port Royal', x: 390, y: 256, desc: 'Porto britannico della Giamaica' },
};

export const DANGER_COLOR = { 0: '#4a7c59', 1: '#b89a2a', 2: '#c87428', 3: '#8b2020' };
export const DANGER_LABEL = { 0: 'Verde', 1: 'Giallo', 2: 'Arancione', 3: 'Rosso' };

export const ROUTES = {
  nassau_havana: {
    id: 'nassau_havana',
    label: 'Nassau – Havana',
    ports: ['nassau', 'havana'],
    baseDanger: 0,
    enemyStrength: 8,
    missions: [
      {
        id: 'm_nh_1', name: 'Rum Run',
        requiredCargo: {},
        reward: { reales: 180, cargo: { wine: 3 } },
        baseMinutes: 6,
      },
      {
        id: 'm_nh_2', name: 'Tobacco Route',
        requiredCargo: { tobacco: 5 },
        reward: { reales: 320, gemmes: 2 },
        baseMinutes: 8,
      },
    ],
  },
  nassau_tortuga: {
    id: 'nassau_tortuga',
    label: 'Nassau – Tortuga',
    ports: ['nassau', 'tortuga'],
    baseDanger: 0,
    enemyStrength: 10,
    missions: [
      {
        id: 'm_nt_1', name: 'Island Crossing',
        requiredCargo: {},
        reward: { reales: 150, cargo: { tobacco: 4 } },
        baseMinutes: 5,
      },
      {
        id: 'm_nt_2', name: 'Cocoa Smuggle',
        requiredCargo: { cocoa: 3 },
        reward: { reales: 280, gemmes: 1 },
        baseMinutes: 7,
      },
    ],
  },
  havana_tortuga: {
    id: 'havana_tortuga',
    label: 'Havana – Tortuga',
    ports: ['havana', 'tortuga'],
    baseDanger: 1,
    enemyStrength: 18,
    missions: [
      {
        id: 'm_ht_1', name: 'Spanish Passage',
        requiredCargo: { wine: 3 },
        reward: { reales: 400, cargo: { cocoa: 5 } },
        baseMinutes: 12,
      },
      {
        id: 'm_ht_2', name: 'War Supplies',
        requiredCargo: {},
        reward: { reales: 350, gemmes: 3 },
        baseMinutes: 14,
      },
    ],
  },
  tortuga_port_royal: {
    id: 'tortuga_port_royal',
    label: 'Tortuga – Port Royal',
    ports: ['tortuga', 'port_royal'],
    baseDanger: 1,
    enemyStrength: 15,
    missions: [
      {
        id: 'm_tp_1', name: 'Merchant Run',
        requiredCargo: { tobacco: 8 },
        reward: { reales: 500, gemmes: 2 },
        baseMinutes: 10,
      },
      {
        id: 'm_tp_2', name: 'Contraband',
        requiredCargo: {},
        reward: { reales: 300, cargo: { wine: 4 } },
        baseMinutes: 11,
      },
    ],
  },
  havana_port_royal: {
    id: 'havana_port_royal',
    label: 'Havana – Port Royal',
    ports: ['havana', 'port_royal'],
    baseDanger: 2,
    enemyStrength: 28,
    missions: [
      {
        id: 'm_hp_1', name: 'Crown Jewels',
        requiredCargo: { wine: 5, cocoa: 3 },
        reward: { reales: 800, gemmes: 5, fireBarrels: 1 },
        baseMinutes: 20,
      },
      {
        id: 'm_hp_2', name: 'Trade Convoy',
        requiredCargo: { tobacco: 10 },
        reward: { reales: 650, gemmes: 4 },
        baseMinutes: 22,
      },
    ],
  },
};

export const SHIP_TYPES = {
  gunboat:  { name: 'Gunboat',  cargo: 10, firepower: 6,  hull: 8,  speed: 15, repairCost: 3 },
  schooner: { name: 'Schooner', cargo: 20, firepower: 8,  hull: 15, speed: 12, repairCost: 5 },
  brig:     { name: 'Brig',     cargo: 35, firepower: 14, hull: 22, speed: 9,  repairCost: 8 },
};

export const CARGO_LABELS = {
  tobacco: 'Tabacco',
  wine:    'Vino',
  cocoa:   'Cacao',
};

export const INITIAL_STATE = {
  version: '1.0',
  player: {
    reales: 500,
    gemmes: 20,
    cargo: { tobacco: 5, wine: 5, cocoa: 3 },
    fireBarrels: 1,
  },
  fleet: [
    { id: 'ship_001', name: 'La Speranza',   type: 'schooner', status: 'docked', damage: 0 },
    { id: 'ship_002', name: 'El Diablo',      type: 'gunboat',  status: 'docked', damage: 0 },
    { id: 'ship_003', name: 'San Cristóbal',  type: 'gunboat',  status: 'docked', damage: 0 },
  ],
  routes: {
    nassau_havana:      { dangerLevel: 0, unlocked: true },
    nassau_tortuga:     { dangerLevel: 0, unlocked: true },
    havana_tortuga:     { dangerLevel: 1, unlocked: true },
    tortuga_port_royal: { dangerLevel: 1, unlocked: true },
    havana_port_royal:  { dangerLevel: 2, unlocked: true },
  },
  activeMissions: [],
  unlockedPorts: ['nassau', 'havana', 'tortuga', 'port_royal'],
  dockSlots: 5,
  eventLog: ['Benvenuto, Capitano. La flotta è in attesa dei tuoi ordini.'],
};
