import { ROUTES, SHIP_TYPES, CARGO_LABELS, DANGER_LABEL } from './data.js';
import { state, saveState, addLog } from './state.js';

export function getShipStats(ship) {
  return SHIP_TYPES[ship.type];
}

export function canAffordCargo(requiredCargo) {
  return Object.entries(requiredCargo).every(
    ([type, amt]) => (state.player.cargo[type] || 0) >= amt
  );
}

// Odds [0..1] of winning a battle on routeId with given ships + fire barrels.
export function calculateOdds(shipIds, routeId, fireBarrelsUsed = 0) {
  const dangerLevel = state.routes[routeId].dangerLevel;
  if (dangerLevel === 0) return 1;

  const playerPower = fleetCombatPower(shipIds) + fireBarrelsUsed * 12;
  const enemyPower  = ROUTES[routeId].enemyStrength;
  return Math.min(0.98, playerPower / (playerPower + enemyPower));
}

export function fleetCombatPower(shipIds) {
  return shipIds.reduce((sum, id) => {
    const ship = state.fleet.find(s => s.id === id);
    const st = SHIP_TYPES[ship.type];
    return sum + st.firepower + st.hull;
  }, 0);
}

// Returns adjusted mission duration in minutes based on fleet average speed.
// Baseline speed = 12 (Schooner). Faster ships shorten; slower ships extend.
export function calcMissionMinutes(shipIds, baseMinutes) {
  if (!shipIds.length) return null;
  const avgSpeed = shipIds.reduce((s, id) => {
    const ship = state.fleet.find(sh => sh.id === id);
    return s + SHIP_TYPES[ship.type].speed;
  }, 0) / shipIds.length;
  return Math.max(1, Math.round(baseMinutes * (12 / avgSpeed)));
}

export function launchMission({ routeId, missionId, shipIds, fireBarrelsUsed }) {
  const routeData  = ROUTES[routeId];
  const mission    = routeData.missions.find(m => m.id === missionId);
  const routeState = state.routes[routeId];

  // Deduct cargo entry cost
  Object.entries(mission.requiredCargo).forEach(([type, amt]) => {
    state.player.cargo[type] -= amt;
  });
  state.player.fireBarrels -= fireBarrelsUsed;

  // Resolve battle if route is dangerous
  if (routeState.dangerLevel > 0) {
    const odds = calculateOdds(shipIds, routeId, fireBarrelsUsed);
    const won  = Math.random() < odds;

    if (won) {
      if (routeState.dangerLevel > 0) routeState.dangerLevel -= 1;
      addLog(`⚔ Battaglia vinta su ${routeData.label}! Pericolo → ${DANGER_LABEL[routeState.dangerLevel]}.`);
    } else {
      // Damage one random ship; all ships retreat to port
      const victimId = shipIds[Math.floor(Math.random() * shipIds.length)];
      const victim   = state.fleet.find(s => s.id === victimId);
      victim.status  = 'damaged';
      addLog(`⚔ Battaglia persa su ${routeData.label}. ${victim.name} è danneggiata!`);
      saveState();
      return { success: false };
    }
  }

  // Mark ships as at sea
  shipIds.forEach(id => {
    const ship = state.fleet.find(s => s.id === id);
    ship.status = 'at_sea';
  });

  const minutes     = calcMissionMinutes(shipIds, mission.baseMinutes);
  const completesAt = Date.now() + minutes * 60 * 1000;

  state.activeMissions.push({
    id: `am_${Date.now()}`,
    routeId,
    missionId,
    shipIds,
    completesAt,
    reward:      mission.reward,
    missionName: mission.name,
    routeLabel:  routeData.label,
  });

  addLog(`⛵ ${mission.name} avviata su ${routeData.label} (${minutes} min).`);
  saveState();
  return { success: true, minutes };
}

export function collectMission(activeMissionId) {
  const idx = state.activeMissions.findIndex(m => m.id === activeMissionId);
  if (idx === -1) return;
  const am = state.activeMissions[idx];

  const { reward } = am;
  if (reward.reales)      state.player.reales      += reward.reales;
  if (reward.gemmes)      state.player.gemmes      += reward.gemmes;
  if (reward.fireBarrels) state.player.fireBarrels += reward.fireBarrels;
  if (reward.cargo) {
    Object.entries(reward.cargo).forEach(([type, amt]) => {
      state.player.cargo[type] = (state.player.cargo[type] || 0) + amt;
    });
  }

  // Return ships to port
  am.shipIds.forEach(id => {
    const ship = state.fleet.find(s => s.id === id);
    if (ship && ship.status === 'at_sea') ship.status = 'docked';
  });

  state.activeMissions.splice(idx, 1);

  const parts = [
    reward.reales      ? `${reward.reales} Reales`     : '',
    reward.gemmes      ? `${reward.gemmes} Gemmes`     : '',
    reward.fireBarrels ? `${reward.fireBarrels} 🔥`    : '',
    reward.cargo
      ? Object.entries(reward.cargo)
          .map(([t, a]) => `${a} ${CARGO_LABELS[t]}`)
          .join(', ')
      : '',
  ].filter(Boolean).join(' + ');

  addLog(`✅ ${am.missionName} completata! Bottino: ${parts}`);
  saveState();
}

export function repairShip(shipId) {
  const ship = state.fleet.find(s => s.id === shipId);
  if (!ship || ship.status !== 'damaged') return;
  const cost = SHIP_TYPES[ship.type].repairCost;
  if (state.player.gemmes < cost) {
    addLog(`❌ Gemmes insufficienti per riparare ${ship.name} (servono ${cost} ◆).`);
    return;
  }
  state.player.gemmes -= cost;
  ship.status = 'docked';
  ship.damage = 0;
  addLog(`🔧 ${ship.name} riparata per ${cost} ◆.`);
  saveState();
}

export function getActiveMissionsWithTime() {
  const now = Date.now();
  return state.activeMissions.map(m => ({
    ...m,
    msRemaining: Math.max(0, m.completesAt - now),
    ready: m.completesAt <= now,
  }));
}
