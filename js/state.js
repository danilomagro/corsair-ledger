import { INITIAL_STATE } from './data.js';

const SAVE_KEY = 'corsair_ledger_v1';

export let state = null;

export function loadState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    state = raw ? JSON.parse(raw) : deepClone(INITIAL_STATE);
  } catch {
    state = deepClone(INITIAL_STATE);
  }
}

export function saveState() {
  state.savedAt = new Date().toISOString();
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

export function resetState() {
  if (!confirm('Sei sicuro? Tutti i progressi saranno cancellati.')) return false;
  state = deepClone(INITIAL_STATE);
  saveState();
  return true;
}

export function exportSave() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'corsair-ledger-save.json';
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function importSave(file) {
  const text = await file.text();
  const parsed = JSON.parse(text);
  if (!parsed.version || !parsed.player) throw new Error('File save non valido');
  state = parsed;
  saveState();
}

export function addLog(msg) {
  const t = new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
  state.eventLog.unshift(`[${t}] ${msg}`);
  if (state.eventLog.length > 60) state.eventLog.length = 60;
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}
