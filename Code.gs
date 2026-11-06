/**
 * Jeu des puzzles : saisie des codes + classement
 * Les codes restent ici, côté serveur Google : les joueurs ne peuvent pas les voir.
 */

// ===== À PERSONNALISER =====
const TEAMS = {
  '5093911179': { name: 'Équipe Rouge', color: '#ff5c5c' },
  '9689174491': { name: 'Équipe Bleue', color: '#4da3ff' },
  '9453665102': { name: 'Équipe Verte', color: '#3ddc97' },
  '0635812064': { name: 'Équipe Jaune', color: '#ffcc33' }
};

// Clé secrète du back-office : ajoute ?admin=CETTE_CLE à l'adresse de la page
const ADMIN_KEY = 'Xsm7gR1kRgU';
// ===========================

const SHEET_NAME = 'Participations';

function doGet(e) {
  const isAdmin = e && e.parameter && e.parameter.admin === ADMIN_KEY;
  return HtmlService.createHtmlOutputFromFile(isAdmin ? 'Admin' : 'index')
    .setTitle(isAdmin ? 'Classement' : 'Code secret')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, viewport-fit=cover');
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(['Horodatage (ms)', 'Heure', 'Équipe', 'Code']);
    sh.setFrozenRows(1);
  }
  return sh;
}

/** Appelé par la page joueurs */
function submitCode(raw) {
  const code = String(raw || '').replace(/\D/g, '');
  const team = TEAMS[code];
  if (!team) return { ok: false };

  // Verrou : deux équipes qui valident à la même milliseconde sont enregistrées dans l'ordre
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const now = new Date();
    getSheet_().appendRow([
      now.getTime(),
      Utilities.formatDate(now, 'Europe/Paris', 'HH:mm:ss.SSS'),
      team.name,
      "'" + code // apostrophe : garde le 0 initial
    ]);
  } finally {
    lock.releaseLock();
  }
  return { ok: true, name: team.name, color: team.color };
}

/** Appelé par le back-office */
function getRanking(key) {
  if (key !== ADMIN_KEY) throw new Error('Accès refusé');
  const sh = getSheet_();
  const rows = sh.getLastRow() > 1
    ? sh.getRange(2, 1, sh.getLastRow() - 1, 4).getValues()
    : [];

  // Première participation de chaque équipe = son heure d'arrivée
  const firstByCode = {};
  rows.forEach(([ts, , , code]) => {
    code = String(code).replace(/^'/, '');
    if (TEAMS[code] && (!firstByCode[code] || ts < firstByCode[code])) firstByCode[code] = ts;
  });

  const finished = Object.keys(firstByCode)
    .map((code) => ({ code, ts: firstByCode[code], name: TEAMS[code].name, color: TEAMS[code].color }))
    .sort((a, b) => a.ts - b.ts);
  const pending = Object.keys(TEAMS)
    .filter((code) => !firstByCode[code])
    .map((code) => ({ code, name: TEAMS[code].name, color: TEAMS[code].color }));

  return { finished, pending };
}

function resetGame(key) {
  if (key !== ADMIN_KEY) throw new Error('Accès refusé');
  const sh = getSheet_();
  if (sh.getLastRow() > 1) sh.deleteRows(2, sh.getLastRow() - 1);
  return true;
}
