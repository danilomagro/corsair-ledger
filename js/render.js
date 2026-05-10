import { PORTS, ROUTES, SHIP_TYPES, CARGO_LABELS, DANGER_COLOR, DANGER_LABEL } from './data.js';
import { state } from './state.js';
import {
  calculateOdds, fleetCombatPower, calcMissionMinutes,
  canAffordCargo, getActiveMissionsWithTime,
} from './game.js';

// ─── UI state (ephemeral — not persisted) ────────────────────────────────────
let selectedRouteId  = null;
let selectedMissionId = null;
let selectedShipIds  = new Set();
let fireBarrelsUsed  = 0;
let _callbacks       = {};

export function setCallbacks(cb) { _callbacks = cb; }

export function setSelectedRoute(routeId) {
  selectedRouteId   = routeId;
  selectedMissionId = null;
  selectedShipIds.clear();
  fireBarrelsUsed   = 0;
}

export function clearSelection() {
  selectedRouteId   = null;
  selectedMissionId = null;
  selectedShipIds.clear();
  fireBarrelsUsed   = 0;
}

// ─── Top-level ────────────────────────────────────────────────────────────────
export function renderAll() {
  renderHeader();
  renderMap();
  renderFleet();
  renderPanel();
  renderInventory();
}

// ─── Header ──────────────────────────────────────────────────────────────────
function renderHeader() {
  document.getElementById('res-reales').textContent  = state.player.reales.toLocaleString('it-IT');
  document.getElementById('res-gemmes').textContent  = state.player.gemmes;
  document.getElementById('res-barrels').textContent = state.player.fireBarrels;
}

// ─── SVG Map ─────────────────────────────────────────────────────────────────
function renderMap() {
  const container = document.getElementById('map-container');
  const now = Date.now();

  const NS = 'http://www.w3.org/2000/svg';
  const svg = el(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 760 310');
  svg.setAttribute('id', 'map-svg');
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

  // Sea background
  const bg = el(NS, 'rect');
  attr(bg, { width: 760, height: 310, fill: '#b8d4e0', rx: 4 });
  svg.appendChild(bg);

  // Subtle grid (nautical chart lines)
  for (let x = 76; x < 760; x += 76) svgLine(svg, x, 0, x, 310, '#9ab8c8', 0.4);
  for (let y = 62; y < 310; y += 62) svgLine(svg, 0, y, 760, y, '#9ab8c8', 0.4);

  // Land masses (decorative blobs behind routes)
  appendLandMasses(svg, NS);

  // Routes
  Object.values(ROUTES).forEach(route => {
    if (!state.routes[route.id]?.unlocked) return;
    const [p1id, p2id] = route.ports;
    const p1 = PORTS[p1id], p2 = PORTS[p2id];
    const dLevel = state.routes[route.id].dangerLevel;
    const color  = DANGER_COLOR[dLevel];
    const active = state.activeMissions.some(m => m.routeId === route.id);
    const ready  = state.activeMissions.find(m => m.routeId === route.id && m.completesAt <= now);
    const isSel  = route.id === selectedRouteId;

    // Dashed route line
    const line = el(NS, 'line');
    attr(line, { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y,
      stroke: color, 'stroke-width': isSel ? 4 : 2.5,
      'stroke-dasharray': '9,6', opacity: isSel ? 1 : 0.85 });
    svg.appendChild(line);

    // Wide invisible hit area for easy clicking
    const hit = el(NS, 'line');
    attr(hit, { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y,
      stroke: 'transparent', 'stroke-width': 22,
      class: 'route-hit', 'data-route': route.id, cursor: 'pointer' });
    svg.appendChild(hit);

    const mx = (p1.x + p2.x) / 2;
    const my = (p1.y + p2.y) / 2;

    // Active mission ship icon
    if (active) {
      const pulse = el(NS, 'circle');
      attr(pulse, { cx: mx, cy: my, r: 9, fill: '#f4e8c1', stroke: color, 'stroke-width': 2,
        class: 'mission-pulse' });
      svg.appendChild(pulse);
      svg.appendChild(svgText(NS, '⛵', mx, my + 5, { 'text-anchor': 'middle', 'font-size': 11 }));
    }

    // "PRONTA" badge
    if (ready) {
      const badge = svgText(NS, '✓ PRONTA', mx, my - (active ? 16 : 5), {
        'text-anchor': 'middle', 'font-size': 10, fill: '#4a7c59',
        'font-weight': 'bold', 'font-family': 'Georgia, serif',
      });
      svg.appendChild(badge);
    }
  });

  // Ports
  Object.values(PORTS).forEach(port => {
    if (!state.unlockedPorts.includes(port.id)) return;

    const circ = el(NS, 'circle');
    attr(circ, { cx: port.x, cy: port.y, r: 11, fill: '#f4e8c1',
      stroke: '#2c1810', 'stroke-width': 2 });
    svg.appendChild(circ);

    svg.appendChild(svgText(NS, '⚓', port.x, port.y + 5,
      { 'text-anchor': 'middle', 'font-size': 10 }));

    svg.appendChild(svgText(NS, port.name.toUpperCase(), port.x, port.y + 25, {
      'text-anchor': 'middle', 'font-size': 10.5, fill: '#2c1810',
      'font-weight': 'bold', 'font-family': 'Georgia, serif',
      'letter-spacing': 1,
    }));
  });

  appendCompassRose(svg, NS, 706, 48);

  // Map title watermark
  svg.appendChild(svgText(NS, 'MARE CARIBAEUM — ANNO DOMINI MDCCXVIII', 50, 298, {
    'font-size': 8.5, fill: '#7a9eb0', 'font-family': 'Georgia, serif',
    'font-style': 'italic',
  }));

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

function appendLandMasses(svg, NS) {
  // Cuba — large tilted ellipse, west
  appendLand(svg, NS, 195, 202, 100, 24, -18, 0.55);
  // Hispaniola — medium ellipse, center-east
  appendLand(svg, NS, 498, 188, 60, 18, -10, 0.55);
  // Jamaica — small ellipse, south-center
  appendLand(svg, NS, 385, 260, 32, 12, 0, 0.55);
  // Bahamas — small cluster, north
  appendLand(svg, NS, 370, 98, 22, 8, 10, 0.5);
  appendLand(svg, NS, 400, 90, 14, 6, -5, 0.45);
}

function appendLand(svg, NS, cx, cy, rx, ry, rotate, opacity) {
  const e = el(NS, 'ellipse');
  attr(e, { cx, cy, rx, ry, fill: '#c8b56e', opacity,
    transform: `rotate(${rotate} ${cx} ${cy})` });
  svg.appendChild(e);
}

function appendCompassRose(svg, NS, cx, cy) {
  const g = el(NS, 'g');
  const oc = el(NS, 'circle');
  attr(oc, { cx, cy, r: 30, fill: 'none', stroke: '#2c1810', 'stroke-width': 0.8, opacity: 0.35 });
  g.appendChild(oc);

  [0, 45, 90, 135, 180, 225, 270, 315].forEach(deg => {
    const rad    = (deg - 90) * Math.PI / 180;
    const isCard = deg % 90 === 0;
    const inner  = isCard ? 5 : 9;
    const outer  = isCard ? 26 : 17;
    const l = el(NS, 'line');
    attr(l, {
      x1: cx + inner * Math.cos(rad), y1: cy + inner * Math.sin(rad),
      x2: cx + outer * Math.cos(rad), y2: cy + outer * Math.sin(rad),
      stroke: '#2c1810', 'stroke-width': isCard ? 1.4 : 0.7, opacity: 0.4,
    });
    g.appendChild(l);
  });

  g.appendChild(svgText(NS, 'N', cx, cy - 18, {
    'text-anchor': 'middle', 'font-size': 9, 'font-weight': 'bold',
    fill: '#8b2020', opacity: 0.55, 'font-family': 'Georgia, serif',
  }));

  svg.appendChild(g);
}

// ─── Fleet panel ─────────────────────────────────────────────────────────────
function renderFleet() {
  const container = document.getElementById('fleet-list');
  if (!container) return;

  const html = state.fleet.map(ship => {
    const st       = SHIP_TYPES[ship.type];
    const isAtSea  = ship.status === 'at_sea';
    const isDamaged = ship.status === 'damaged';
    const cls      = isAtSea ? 'at-sea' : isDamaged ? 'damaged' : 'docked';
    const statusLbl = isAtSea ? '⛵ In missione' : isDamaged ? '🔴 Danneggiata' : '⚓ In porto';

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
      <div class="ship-status ${cls}">${statusLbl}</div>
      ${isDamaged
        ? `<button class="btn-repair" data-ship="${ship.id}">🔧 Ripara (${st.repairCost} ◆)</button>`
        : ''}
    </div>`;
  }).join('');

  container.innerHTML = html;

  container.querySelectorAll('.btn-repair').forEach(btn => {
    btn.addEventListener('click', () => _callbacks.repair(btn.dataset.ship));
  });
}

// ─── Detail / mission panel ───────────────────────────────────────────────────
function renderPanel() {
  const container = document.getElementById('detail-content');
  if (!container) return;

  if (!selectedRouteId) {
    renderActiveMissionsPanel(container);
    return;
  }

  const route      = ROUTES[selectedRouteId];
  const routeState = state.routes[selectedRouteId];
  const dLevel     = routeState.dangerLevel;
  const color      = DANGER_COLOR[dLevel];
  const dlabel     = DANGER_LABEL[dLevel];

  if (!selectedMissionId) {
    renderRouteOverview(container, route, dLevel, color, dlabel);
  } else {
    renderMissionDetail(container, route, dLevel, color, dlabel);
  }
}

function renderRouteOverview(container, route, dLevel, color, dlabel) {
  const amList = getActiveMissionsWithTime().filter(m => m.routeId === route.id);

  let html = `
    <div class="panel-route-header">
      <h3>${route.label}</h3>
      <span class="danger-badge" style="--dc:${color}">${DANGER_DOT} ${dlabel}</span>
    </div>
    <p class="route-desc">${dangerDesc(dLevel)}</p>`;

  if (amList.length) {
    html += `<div class="active-missions-list">${amList.map(activeMissionCard).join('')}</div>`;
  }

  html += `<h4 class="missions-title">Missioni disponibili</h4>`;
  route.missions.forEach(m => {
    const ok     = canAffordCargo(m.requiredCargo);
    const reqStr = cargoString(m.requiredCargo) || 'Nessun cargo';
    const rewStr = rewardString(m.reward);
    html += `
      <div class="mission-card ${ok ? '' : 'unaffordable'}">
        <div class="mission-name">${m.name}</div>
        <div class="mission-info">🧳 ${reqStr}</div>
        <div class="mission-info">💰 ${rewStr}</div>
        <div class="mission-info">⏱ ~${m.baseMinutes} min (base)</div>
        <button class="btn-select-mission" data-mission="${m.id}" ${ok ? '' : 'disabled'}>
          ${ok ? 'Seleziona' : '⚠ Cargo insufficiente'}
        </button>
      </div>`;
  });

  container.innerHTML = html;

  container.querySelectorAll('.btn-select-mission').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedMissionId = btn.dataset.mission;
      selectedShipIds.clear();
      fireBarrelsUsed = 0;
      renderPanel();
    });
  });
  container.querySelectorAll('.btn-collect').forEach(btn => {
    btn.addEventListener('click', () => _callbacks.collect(btn.dataset.am));
  });
}

function renderMissionDetail(container, route, dLevel, color, dlabel) {
  const mission     = route.missions.find(m => m.id === selectedMissionId);
  const dangerous   = dLevel > 0;
  const dockedShips = state.fleet.filter(s => s.status === 'docked');
  const selArr      = [...selectedShipIds];
  const odds        = (selArr.length && dangerous)
    ? calculateOdds(selArr, route.id, fireBarrelsUsed) : null;
  const minutes     = selArr.length ? calcMissionMinutes(selArr, mission.baseMinutes) : null;

  const reqHtml = Object.entries(mission.requiredCargo).length === 0
    ? '—'
    : Object.entries(mission.requiredCargo).map(([t, a]) => {
        const has = state.player.cargo[t] || 0;
        return `${a} ${CARGO_LABELS[t]} <span class="${has >= a ? 'ok' : 'err'}">(hai ${has})</span>`;
      }).join(', ');

  let html = `
    <div class="panel-route-header">
      <button class="btn-back">← Indietro</button>
      <h3>${mission.name}</h3>
    </div>
    <div class="mission-meta">
      <span>${route.label}</span>
      <span class="danger-badge" style="--dc:${color}">${DANGER_DOT} ${dlabel}</span>
    </div>
    <div class="mission-req">🧳 ${reqHtml}</div>
    <div class="mission-req">💰 ${rewardString(mission.reward)}</div>`;

  if (dangerous) {
    html += `<div class="battle-warning">
      ⚔ Rotta pericolosa — si combatte prima di commerciare.
      Forza nemica: <strong>${route.enemyStrength}</strong>
    </div>`;
  }

  html += `<h4 class="ship-select-title">Seleziona le navi:</h4>`;

  if (!dockedShips.length) {
    html += `<p class="no-ships">Nessuna nave disponibile in porto.</p>`;
  } else {
    dockedShips.forEach(ship => {
      const st  = SHIP_TYPES[ship.type];
      const chk = selectedShipIds.has(ship.id) ? 'checked' : '';
      html += `
        <label class="ship-select ${chk ? 'selected' : ''}">
          <input type="checkbox" data-ship="${ship.id}" ${chk}>
          <span class="ship-name">${ship.name}</span>
          <span class="ship-type-badge">${st.name}</span>
          <span class="ship-mini-stats">💥${st.firepower} 🛡${st.hull} 💨${st.speed}</span>
        </label>`;
    });
  }

  if (dangerous && selArr.length) {
    const pct      = Math.round(odds * 100);
    const barColor = pct >= 70 ? '#4a7c59' : pct >= 45 ? '#b89a2a' : '#8b2020';
    const fp       = fleetCombatPower(selArr) + fireBarrelsUsed * 12;
    html += `
      <div class="odds-section">
        <div class="odds-label">
          Potenza flotta: <strong>${fp}</strong> vs Nemico: <strong>${route.enemyStrength}</strong>
        </div>
        <div class="odds-bar-wrap">
          <div class="odds-bar-fill" style="width:${pct}%;background:${barColor}"></div>
        </div>
        <div class="odds-pct" style="color:${barColor}">${pct}% di vittoria</div>
      </div>`;
  }

  if (dangerous) {
    html += `
      <div class="fire-barrel-row">
        🔥 Fire Barrels:
        <button class="btn-fb" data-act="minus">−</button>
        <span class="fb-val">${fireBarrelsUsed}</span>
        <button class="btn-fb" data-act="plus">+</button>
        <span class="fb-stock">(hai ${state.player.fireBarrels})</span>
        ${fireBarrelsUsed ? `<span class="fb-bonus">+${fireBarrelsUsed * 12} potenza</span>` : ''}
      </div>`;
  }

  if (minutes !== null) {
    html += `<div class="time-estimate">⏱ Tempo stimato: <strong>${minutes} min</strong></div>`;
  }

  html += `<button class="btn-launch" ${selArr.length ? '' : 'disabled'}>
    ${selArr.length ? '⛵ Lancia Missione' : 'Seleziona almeno una nave'}
  </button>`;

  container.innerHTML = html;

  container.querySelector('.btn-back')?.addEventListener('click', () => {
    selectedMissionId = null;
    renderPanel();
  });

  container.querySelectorAll('input[type=checkbox][data-ship]').forEach(cb => {
    cb.addEventListener('change', () => {
      cb.checked ? selectedShipIds.add(cb.dataset.ship)
                 : selectedShipIds.delete(cb.dataset.ship);
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
    _callbacks.launch({
      routeId: selectedRouteId,
      missionId: selectedMissionId,
      shipIds: [...selectedShipIds],
      fireBarrelsUsed,
    });
  });
}

function renderActiveMissionsPanel(container) {
  const missions = getActiveMissionsWithTime();
  if (!missions.length) {
    container.innerHTML = `<p class="placeholder">Seleziona una rotta sulla mappa per iniziare.</p>`;
    return;
  }
  container.innerHTML = `<h3>Missioni in corso</h3>
    <div class="active-missions-list">${missions.map(activeMissionCard).join('')}</div>`;
  container.querySelectorAll('.btn-collect').forEach(btn => {
    btn.addEventListener('click', () => _callbacks.collect(btn.dataset.am));
  });
}

function activeMissionCard(am) {
  const mins = Math.floor(am.msRemaining / 60000);
  const secs = Math.floor((am.msRemaining % 60000) / 1000);
  const timeHtml = am.ready
    ? `<span class="ready-text">✅ Pronta al ritiro</span>`
    : `<span class="countdown">${mins}:${String(secs).padStart(2, '0')} rimanenti</span>`;

  return `<div class="active-mission-card ${am.ready ? 'ready' : ''}">
    <div class="am-name">${am.missionName}</div>
    <div class="am-route">${am.routeLabel}</div>
    <div class="am-time">${timeHtml}</div>
    <div class="am-reward">💰 ${rewardString(am.reward)}</div>
    ${am.ready ? `<button class="btn-collect" data-am="${am.id}">Ritira bottino</button>` : ''}
  </div>`;
}

// ─── Inventory footer ─────────────────────────────────────────────────────────
function renderInventory() {
  const el = document.getElementById('inventory-display');
  if (!el) return;
  const { cargo } = state.player;
  const items = Object.entries(CARGO_LABELS)
    .map(([k, lbl]) => `<span class="cargo-item">${lbl}: <strong>${cargo[k] || 0}</strong></span>`)
    .join('');
  el.innerHTML = `<span class="inv-label">Stiva ·</span> ${items}`;
}

// ─── Event log (called externally) ───────────────────────────────────────────
export function renderLog() {
  const content = document.getElementById('log-content');
  if (!content) return;
  content.innerHTML = state.eventLog
    .map(e => `<div class="log-entry">${e}</div>`)
    .join('');
}

// ─── SVG helpers ─────────────────────────────────────────────────────────────
const DANGER_DOT = '●';

function el(ns, tag) { return document.createElementNS(ns, tag); }

function attr(node, attrs) {
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
}

function svgLine(svg, x1, y1, x2, y2, stroke, opacity) {
  const NS = 'http://www.w3.org/2000/svg';
  const l = el(NS, 'line');
  attr(l, { x1, y1, x2, y2, stroke, 'stroke-width': 1, opacity });
  svg.appendChild(l);
}

function svgText(NS, content, x, y, attrs) {
  const t = el(NS, 'text');
  attr(t, { x, y, ...attrs });
  t.textContent = content;
  return t;
}

// ─── String helpers ───────────────────────────────────────────────────────────
function cargoString(obj) {
  return Object.entries(obj)
    .map(([t, a]) => `${a} ${CARGO_LABELS[t]}`)
    .join(', ');
}

function rewardString(reward) {
  return [
    reward.reales      ? `${reward.reales} Reales`     : '',
    reward.gemmes      ? `${reward.gemmes} ◆`          : '',
    reward.fireBarrels ? `${reward.fireBarrels} 🔥`    : '',
    reward.cargo       ? cargoString(reward.cargo)     : '',
  ].filter(Boolean).join(' + ');
}

function dangerDesc(level) {
  return [
    'Acque sicure. Nessun ostacolo al commercio.',
    'Qualche pericolo — raccomandata una scorta armata.',
    'Rotta pericolosa. Prepara la flotta alla battaglia.',
    'Zona di guerra. Solo le navi più forti sopravvivono.',
  ][level] ?? '';
}
