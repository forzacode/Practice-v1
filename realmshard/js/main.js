'use strict';

// ─── Entry Point ──────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderTitle();
  showScreen('title');
  bindEvents();
});

// ─── Event Bindings ───────────────────────────────────────────────────────────
function bindEvents() {

  // ── Title ──
  on('btn-new-game', 'click', () => {
    G._selectedClass = null;
    renderCreate();
    showScreen('create');
  });

  on('btn-continue', 'click', () => {
    if (loadGame()) {
      G._activeChapter = G.player.unlockedChapters[G.player.unlockedChapters.length - 1] || 1;
      renderMap();
      showScreen('map');
      showToast(`Welcome back, ${G.player.name}!`);
    } else {
      showToast('No save data found.');
    }
  });

  // ── Create ──
  on('btn-start-adventure', 'click', () => {
    const nameInput = document.getElementById('hero-name');
    const name      = (nameInput?.value || '').trim() || 'Hero';
    const classId   = G._selectedClass;

    if (!classId) { showToast('Choose a class first!'); return; }

    initPlayer(name, classId);
    G._activeChapter = 1;
    renderMap();
    showScreen('map');
    showToast(`Welcome, ${name} the ${getClassName(classId)}!`);
  });

  on('btn-back-title', 'click', () => {
    showScreen('title');
    renderTitle();
  });

  // ── Map ──
  on('btn-open-inv', 'click', () => {
    renderInventory();
    showScreen('inventory');
    // Make close-inv return to map
    const backBtn = document.getElementById('btn-close-inv');
    if (backBtn) backBtn.onclick = () => { renderMap(); showScreen('map'); };
  });

  on('btn-save-quit', 'click', () => {
    saveGame();
    showToast('Saved! Returning to title…');
    setTimeout(() => { showScreen('title'); renderTitle(); }, 900);
  });

  // ── Level screen ──
  on('btn-map-from-level', 'click', handleReturnToMap);

  on('btn-inv-from-level', 'click', () => {
    renderInventory();
    showScreen('inventory');
    const backBtn = document.getElementById('btn-close-inv');
    if (backBtn) {
      backBtn.onclick = () => {
        const lvl = LEVEL_MAP[G.currentLevelId];
        if (lvl) renderLevel(G.currentLevelId);
        else { renderMap(); showScreen('map'); }
      };
    }
  });

  // ── Inventory (default back = map) ──
  on('btn-close-inv', 'click', () => { renderMap(); showScreen('map'); });

  // ── Game Over ──
  on('btn-go-title', 'click', () => {
    deleteSave();
    G.player = null;
    G.combat = null;
    renderTitle();
    showScreen('title');
  });

  on('btn-retry-chapter', 'click', () => {
    // Reset HP/MP to half and return to current chapter start
    if (G.player) {
      G.player.hp = Math.max(1, Math.floor(G.player.maxHp / 2));
      G.player.mp = Math.floor(G.player.maxMp / 2);
      const chStart = (Math.max(1, G.player.unlockedChapters[G.player.unlockedChapters.length - 1]) - 1) * 10 + 1;
      G._activeChapter = G.player.unlockedChapters[G.player.unlockedChapters.length - 1] || 1;
      saveGame();
      renderMap();
      showScreen('map');
      showToast('Returning to last chapter — fight on!');
    } else {
      showScreen('title');
      renderTitle();
    }
  });

  // ── Victory ──
  on('btn-play-again', 'click', () => {
    deleteSave();
    G.player = null;
    G.combat = null;
    renderTitle();
    showScreen('title');
  });

  // ── Level-Up Modal ──
  on('btn-close-levelup', 'click', closeLevelUpModal);
  const modal = document.getElementById('levelup-modal');
  if (modal) {
    modal.addEventListener('click', e => { if (e.target === modal) closeLevelUpModal(); });
  }
}

// ─── Helper ───────────────────────────────────────────────────────────────────
function on(id, event, handler) {
  const el = document.getElementById(id);
  if (el) el.addEventListener(event, handler);
}

// ─── Expose globals for inline onclick handlers ───────────────────────────────
Object.assign(window, {
  // screens
  showScreen, renderMap, renderInventory, renderCombat, renderTitle,
  renderCreate, renderLevel, renderVictory, renderGameOver,
  showToast, showLevelUpModal, closeLevelUpModal,

  // map / navigation
  setActiveChapter, enterLevel, handleReturnToMap,

  // level choices
  handleChoice, handlePostCombatChoice, selectClass,

  // combat actions
  playerAttack, playerSkill, playerUseItem, playerFlee,
  openSkillMenu, openItemMenu, closeSubMenu,

  // inventory
  handleEquip, handleUnequip, handleUseOutOfCombat,

  // game engine
  saveGame, loadGame, hasSave, deleteSave,
  initPlayer, gainXP, addItem, removeItem, equipItem, unequipItem,
  addFlag, hasFlag, checkCondition, completeLevel,
  checkSecretUnlocks, isLevelUnlocked, isLevelCompleted,
  getAvailableLevels, determineEnding, applyOutcome,
  startCombat, resolveVictory,
  getPlayerStats, getSkills, getClassName,
});
