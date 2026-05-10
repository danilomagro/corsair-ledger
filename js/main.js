import { loadState } from './state.js';
import { launchMission, collectMission, repairShip } from './game.js';
import {
  renderAll, renderLog,
  setCallbacks, setSelectedRoute, clearSelection,
} from './render.js';
import { exportSave, importSave, resetState } from './state.js';

function init() {
  loadState();

  setCallbacks({
    launch:  handleLaunch,
    collect: handleCollect,
    repair:  handleRepair,
  });

  renderAll();
  startTick();
  wireFooter();
}

function handleLaunch(params) {
  const result = launchMission(params);
  // On success reset to route overview; on defeat stay so player sees damage
  if (result.success) setSelectedRoute(params.routeId);
  renderAll();
}

function handleCollect(activeMissionId) {
  collectMission(activeMissionId);
  renderAll();
}

function handleRepair(shipId) {
  repairShip(shipId);
  renderAll();
}

// Re-render every second to keep timers and map indicators current.
// Rendering is pure DOM replacement so this is cheap enough for an MVP.
function startTick() {
  setInterval(renderAll, 1000);
}

function wireFooter() {
  document.getElementById('btn-save-export').addEventListener('click', exportSave);

  document.getElementById('import-file').addEventListener('change', async e => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      await importSave(file);
      clearSelection();
      renderAll();
    } catch (err) {
      alert('Errore import: ' + err.message);
    }
    e.target.value = '';
  });

  document.getElementById('btn-reset').addEventListener('click', () => {
    if (resetState()) {
      clearSelection();
      renderAll();
    }
  });

  const logPanel = document.getElementById('log-panel');
  document.getElementById('btn-log').addEventListener('click', () => {
    logPanel.classList.toggle('hidden');
    renderLog();
  });
  document.getElementById('btn-close-log').addEventListener('click', () => {
    logPanel.classList.add('hidden');
  });
}

document.addEventListener('DOMContentLoaded', init);
