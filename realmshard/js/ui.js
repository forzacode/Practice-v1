'use strict';

// ─── Screen Routing ───────────────────────────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById('screen-' + id);
  if (el) el.classList.add('active');
  G.screen = id;
}

// ─── Toast Notifications ──────────────────────────────────────────────────────
function showToast(msg) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  container.appendChild(t);
  setTimeout(() => t.remove(), 2800);
}

// ─── Level-Up Modal ───────────────────────────────────────────────────────────
function showLevelUpModal(levelInfo) {
  const modal = document.getElementById('levelup-modal');
  const sub   = document.getElementById('levelup-sub');
  const gains = document.getElementById('levelup-gains');
  if (!modal) return;

  if (sub) sub.textContent = `You have reached level ${levelInfo.level}!`;
  if (gains) {
    const g = levelInfo.gains;
    gains.innerHTML = [
      g.hp     ? `<span class="gain-chip" style="border-color:var(--hp2);color:var(--hp2)">+${g.hp} MaxHP</span>` : '',
      g.mp     ? `<span class="gain-chip" style="border-color:var(--mp2);color:var(--mp2)">+${g.mp} MaxMP</span>` : '',
      g.attack ? `<span class="gain-chip" style="border-color:var(--atk);color:var(--atk)">+${g.attack} ATK</span>` : '',
      g.defense? `<span class="gain-chip" style="border-color:var(--def);color:var(--def)">+${g.defense} DEF</span>` : '',
      g.luck   ? `<span class="gain-chip" style="border-color:var(--lck);color:var(--lck)">+${g.luck} LCK</span>` : '',
    ].join('');
  }
  modal.style.display = 'flex';
}

function closeLevelUpModal() {
  const modal = document.getElementById('levelup-modal');
  if (modal) modal.style.display = 'none';
  G.pendingLevelUp = false;
}

// ─── Title Screen ─────────────────────────────────────────────────────────────
function renderTitle() {
  const cont = document.getElementById('btn-continue');
  if (cont) {
    cont.disabled = !hasSave();
  }
}

// ─── Character Creation ───────────────────────────────────────────────────────
function renderCreate() {
  const container = document.getElementById('class-grid');
  if (!container) return;

  const classData = [
    {
      id: 'warden', icon: '🛡', name: 'Warden',
      tagline: 'Iron bark. Unbreakable root.',
      desc: 'A nature-sworn guardian who channels the forest\'s endurance. High HP and Defense, healing skills, steady damage.',
      stats: CLASSES.warden.startStats,
    },
    {
      id: 'spellblade', icon: '⚔', name: 'Spellblade',
      tagline: 'Steel and starlight.',
      desc: 'A warrior who weaves arcane power through each strike. Balanced offense and magic, penetrating attacks, mana surge.',
      stats: CLASSES.spellblade.startStats,
    },
    {
      id: 'trickster', icon: '🎲', name: 'Trickster',
      tagline: 'Fortune favors the bold thief.',
      desc: 'A rogue blessed by luck itself. Deadly first strikes, evasion, and the ability to steal from enemies.',
      stats: CLASSES.trickster.startStats,
    },
  ];

  container.innerHTML = classData.map(cls => `
    <div class="card class-card ${G._selectedClass === cls.id ? 'selected' : ''}" onclick="selectClass('${cls.id}')">
      <div class="class-icon" style="font-size:2.5rem;display:block;margin-bottom:.5rem">${cls.icon}</div>
      <h3>${cls.name}</h3>
      <p style="font-size:.8rem;color:var(--gold);margin-bottom:.3rem;font-style:italic">${cls.tagline}</p>
      <p style="font-size:.78rem;color:var(--text3);margin-bottom:.7rem">${cls.desc}</p>
      <div class="class-stats">
        <span class="stat-chip">HP ${cls.stats.maxHp}</span>
        <span class="stat-chip">MP ${cls.stats.maxMp}</span>
        <span class="stat-chip">ATK ${cls.stats.attack}</span>
        <span class="stat-chip">DEF ${cls.stats.defense}</span>
        <span class="stat-chip">LCK ${cls.stats.luck}</span>
      </div>
    </div>
  `).join('');
}

function selectClass(classId) {
  G._selectedClass = classId;
  renderCreate();
}

// ─── Map Screen ───────────────────────────────────────────────────────────────
function renderMap() {
  const p = G.player;
  if (!p) return;

  renderMiniStats();

  const chapter = G._activeChapter || 1;
  const chData  = CHAPTERS[chapter - 1];

  const nameEl = document.getElementById('map-chapter-name');
  if (nameEl) nameEl.textContent = chData ? `${chData.icon} ${chData.name}` : '';

  const titleEl = document.getElementById('map-ch-title');
  if (titleEl) titleEl.textContent = chData?.name || '';

  const descEl = document.getElementById('map-ch-desc');
  if (descEl) descEl.textContent = chData?.desc || '';

  // Chapter tabs
  const tabsEl = document.getElementById('chapter-tabs');
  if (tabsEl) {
    tabsEl.innerHTML = CHAPTERS.map((ch, i) => {
      const chNum    = i + 1;
      const unlocked = p.unlockedChapters.includes(chNum);
      const active   = chapter === chNum;
      return `<button class="ch-tab ${active ? 'active' : ''} ${unlocked ? 'unlocked' : 'locked'}"
        ${unlocked ? `onclick="setActiveChapter(${chNum})"` : ''}
        title="${ch.name}">${ch.icon} ${ch.name}</button>`;
    }).join('');
  }

  // Level nodes
  const trailEl = document.getElementById('level-trail');
  if (!trailEl) return;

  const chLevels    = LEVELS.filter(l => l.chapter === chapter && !l.secret);
  const secretLevels = LEVELS.filter(l => l.secret && hasFlag(l.secretFlag));

  trailEl.innerHTML = [...chLevels, ...secretLevels].map(lvl => {
    const completed = isLevelCompleted(lvl.id);
    const unlocked  = isLevelUnlocked(lvl.id);
    const isBoss    = lvl.type === 'boss';
    const isSecret  = !!lvl.secret;

    let cls = 'level-node';
    if (completed) cls += ' completed';
    else if (unlocked) cls += ' current';
    else cls += ' locked';
    if (isBoss)   cls += ' boss';
    if (isSecret) cls += ' secret';

    return `<div class="${cls}" ${unlocked ? `onclick="enterLevel(${lvl.id})"` : ''} title="${lvl.title}">
      <div class="node-num">${isSecret ? '★' : lvl.id}</div>
      <div class="node-icon">${lvl.icon || (isBoss ? '💀' : '⚔')}</div>
      <div class="node-title">${lvl.title}</div>
    </div>`;
  }).join('');

  // Secret hint
  const hintEl = document.getElementById('map-secret-hint');
  if (hintEl) {
    const available = secretLevels.length;
    hintEl.textContent = available > 0
      ? `✦ ${available} secret encounter${available > 1 ? 's' : ''} unlocked`
      : '';
  }
}

function setActiveChapter(chNum) {
  G._activeChapter = chNum;
  renderMap();
  requestAnimationFrame(drawConnectorLines);
}

function renderMiniStats() {
  const p  = G.player;
  if (!p) return;
  const el = document.getElementById('player-mini-stats');
  if (!el) return;
  const xpPct = Math.min(100, Math.round((p.xp / p.xpToNext) * 100));
  el.innerHTML = `
    <span class="mini-stat"><span>🧑</span>${p.name}</span>
    <span class="mini-stat"><span>Lv</span>${p.level}</span>
    <span class="mini-stat"><span>HP</span>${p.hp}/${p.maxHp}</span>
    <span class="mini-stat"><span>MP</span>${p.mp}/${p.maxMp}</span>
    <span class="mini-stat"><span>⬡</span>${p.gold}</span>
    <div class="xp-bar-wrap">
      <span class="xp-bar-label">XP ${p.xp}/${p.xpToNext}</span>
      <div class="xp-bar-track"><div class="xp-bar-fill" style="width:${xpPct}%"></div></div>
      <span class="xp-bar-label">${xpPct}%</span>
    </div>
  `;
}

// ─── Narrative Level Screen ───────────────────────────────────────────────────
function renderLevel(levelId) {
  const lvl = LEVEL_MAP[levelId];
  if (!lvl) return;
  G.currentLevelId = levelId;

  const badge = document.getElementById('lv-ch-badge');
  const title = document.getElementById('lv-title');
  const body  = document.getElementById('level-body');

  if (badge) badge.textContent = `Ch.${lvl.chapter} — ${CHAPTERS[lvl.chapter - 1]?.name || ''}`;
  if (title) title.textContent = lvl.title;

  if (!body) return;

  const alreadyDone = isLevelCompleted(lvl.id);
  const isPuzzle    = lvl.type === 'puzzle';

  const mainText = (lvl.text || lvl.preText || '').replace(/\n/g, '<br>');

  if (isPuzzle) {
    body.innerHTML = `
      <div class="puzzle-banner">
        <span class="puzzle-icon">${lvl.icon || '⚙'}</span>
        <div>
          <span class="puzzle-badge">⚙ Puzzle</span>
          <div class="puzzle-title">${lvl.title}</div>
        </div>
      </div>
      <div class="level-flavor">${lvl.flavor || ''}</div>
      <div class="puzzle-clue">${mainText}</div>
      ${alreadyDone ? '<p style="color:var(--text3);font-size:.8rem;margin-bottom:.8rem">✓ Previously solved</p>' : ''}
      <div class="choices" id="choices-container">${renderChoicesHtml(lvl)}</div>
    `;
  } else {
    body.innerHTML = `
      <div class="level-flavor">${lvl.flavor || ''}</div>
      <div class="level-title">${lvl.title}</div>
      <div class="level-text">${mainText}</div>
      ${alreadyDone ? '<p style="color:var(--text3);font-size:.8rem;margin-bottom:.8rem">✓ Previously visited</p>' : ''}
      <div class="choices" id="choices-container">${renderChoicesHtml(lvl)}</div>
    `;
  }

  showScreen('level');
}

function renderChoicesHtml(lvl) {
  if (!lvl.choices || lvl.choices.length === 0) {
    return `<button class="btn btn-gold" onclick="handleReturnToMap()">← Return to Map</button>`;
  }
  return lvl.choices.map((ch, idx) => {
    const condMet = checkCondition(ch.condition);
    const hint    = !condMet && ch.condition ? `<span class="choice-cond">${condHint(ch.condition)}</span>` : '';
    return `<button class="choice-btn ${condMet ? '' : 'disabled'}" ${condMet ? `onclick="handleChoice(${lvl.id},${idx})"` : 'disabled'}>
      <span class="choice-key">${idx + 1}</span>
      <span>${ch.text}${hint}</span>
    </button>`;
  }).join('');
}

function condHint(cond) {
  if (!cond) return '';
  switch (cond.type) {
    case 'flag':    return ` (requires: ${cond.key.replace(/_/g, ' ')})`;
    case 'no_flag': return ` (unavailable)`;
    case 'item':    return ` (requires: ${ITEMS[cond.key]?.name || cond.key})`;
    case 'stat':    return ` (need ${cond.key} ≥ ${cond.min})`;
    case 'class':   return ` (${getClassName(cond.key)} only)`;
    case 'level':   return ` (level ${cond.min}+)`;
    default: return '';
  }
}

function handleChoice(levelId, choiceIdx) {
  const lvl    = LEVEL_MAP[levelId];
  const choice = lvl?.choices?.[choiceIdx];
  if (!choice) return;

  applyOutcome(choice.outcome);

  if (!G.player.completedLevels.includes(levelId)) {
    G.player.completedLevels.push(levelId);
    if (lvl.type === 'boss') {
      const next = lvl.chapter + 1;
      if (next <= 8 && !G.player.unlockedChapters.includes(next))
        G.player.unlockedChapters.push(next);
    }
  }
  checkSecretUnlocks();
  saveGame();

  if (G.pendingLevelUp) showLevelUpModal(G.pendingLevelUp);

  const cont = document.getElementById('choices-container');
  if (!cont) return;

  const out = choice.outcome || {};
  const rewards = [];
  if (out.hp   > 0) rewards.push(`+${out.hp} HP`);
  if (out.mp   > 0) rewards.push(`+${out.mp} MP`);
  if (out.xp)       rewards.push(`+${out.xp} XP`);
  if (out.gold)     rewards.push(`+${out.gold} Gold`);
  if (out.items)    out.items.forEach(it => rewards.push(`+${ITEMS[it.id || it]?.name || it}`));

  const next = out.nextLevel;
  const btnHtml = (next && next !== 'map')
    ? `<button class="btn btn-gold" onclick="enterLevel(${next})">Continue →</button>`
    : `<button class="btn btn-gold" onclick="handleReturnToMap()">← Return to Map</button>`;

  cont.innerHTML = `
    <div class="outcome-box">${out.text || ''}</div>
    ${rewards.length ? `<div class="outcome-rewards">${rewards.map(r => `<span class="reward-chip">${r}</span>`).join('')}</div>` : ''}
    ${btnHtml}
  `;
}

function handleReturnToMap() {
  if (G.pendingLevelUp) { showLevelUpModal(G.pendingLevelUp); return; }
  G._activeChapter = G._activeChapter || 1;
  renderMap();
  showScreen('map');
  requestAnimationFrame(drawConnectorLines);
}

// ─── Combat Screen ────────────────────────────────────────────────────────────
function renderCombat() {
  const c = G.combat;
  const p = G.player;
  if (!c) return;

  const enemy = c.enemy;

  // Enemy panel
  const ePct = enemy.maxHp > 0 ? Math.max(0, Math.min(100, (enemy.hp / enemy.maxHp) * 100)) : 0;
  setId('enemy-name', enemy.name + (enemy.isBoss ? ' 👑' : ''));
  setId('enemy-desc', '');
  setFill('enemy-hp-fill', ePct);
  setId('enemy-hp-val', `${enemy.hp} / ${enemy.maxHp}`);
  const eStatusEl = document.getElementById('enemy-status');
  if (eStatusEl) eStatusEl.innerHTML = enemy.statusEffects.map(statusChip).join('');

  // Player panel
  const hPct = p.maxHp > 0 ? Math.max(0, Math.min(100, (p.hp / p.maxHp) * 100)) : 0;
  const mPct = p.maxMp > 0 ? Math.max(0, Math.min(100, (p.mp / p.maxMp) * 100)) : 0;
  setId('combat-player-name', `${p.name} · Lv.${p.level}`);
  setFill('c-hp-fill', hPct);
  setId('c-hp-val', `${p.hp} / ${p.maxHp}`);
  setFill('c-mp-fill', mPct);
  setId('c-mp-val', `${p.mp} / ${p.maxMp}`);
  const pStatusEl = document.getElementById('player-status');
  if (pStatusEl) pStatusEl.innerHTML = p.statusEffects.map(statusChip).join('');

  renderCombatLog();
  renderCombatActions();

  if (c.won) {
    showCombatResolution('victory');
  } else if (c.fled) {
    showCombatResolution('fled');
  } else if (c.turn === 'dead' || p.hp <= 0) {
    showCombatResolution('defeat');
  }
}

function setId(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function setFill(id, pct) {
  const el = document.getElementById(id);
  if (el) el.style.width = pct + '%';
}

function statusChip(s) {
  const icons = { poison:'☠', burn:'🔥', freeze:'❄', stun:'⭐', block:'🛡', dodge:'💨', buff_atk:'⚡', buff_def:'🔰', armor_break:'💔' };
  return `<span class="status-chip status-${s.type}" title="${s.type} (${s.turns}t)">${icons[s.type] || '?'} ${s.turns}t</span>`;
}

function renderCombatLog() {
  const el = document.getElementById('combat-log');
  if (!el || !G.combat) return;
  el.innerHTML = G.combat.log.slice(-10).map(l => `<div class="log-line">${l}</div>`).join('');
  el.scrollTop = el.scrollHeight;
}

function renderCombatActions() {
  const c  = G.combat;
  const el = document.getElementById('combat-actions');
  if (!el || !c) return;

  const isPlayerTurn = c.turn === 'player' && !c.won && !c.fled && G.player.hp > 0;

  if (!isPlayerTurn) {
    if (!c.won && !c.fled && c.turn !== 'dead' && G.player.hp > 0) {
      el.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:var(--text3);padding:.8rem">Enemy is acting…</div>`;
    }
    return;
  }

  if (c.showingSkills) { renderSkillMenu(el); return; }
  if (c.showingItems)  { renderItemMenu(el);  return; }

  const bossLocked = c.enemy.isBoss ? 'disabled style="opacity:.4"' : '';
  el.innerHTML = `
    <button class="btn" onclick="playerAttack()"><span class="btn-icon">⚔</span>Attack</button>
    <button class="btn" onclick="openSkillMenu()"><span class="btn-icon">✨</span>Skills</button>
    <button class="btn" onclick="openItemMenu()"><span class="btn-icon">🎒</span>Items</button>
    <button class="btn btn-danger" onclick="playerFlee()" ${bossLocked}><span class="btn-icon">💨</span>Flee</button>
  `;
}

function openSkillMenu() {
  if (!G.combat) return;
  G.combat.showingSkills = true;
  G.combat.showingItems  = false;
  renderCombatActions();
}

function openItemMenu() {
  if (!G.combat) return;
  G.combat.showingItems  = true;
  G.combat.showingSkills = false;
  renderCombatActions();
}

function closeSubMenu() {
  if (!G.combat) return;
  G.combat.showingSkills = false;
  G.combat.showingItems  = false;
  renderCombatActions();
}

function renderSkillMenu(container) {
  const skills = getSkills();
  const p      = G.player;
  let html     = '<div style="grid-column:1/-1">';
  html += '<div style="font-size:.78rem;color:var(--text3);margin-bottom:.5rem">Choose a Skill:</div>';
  html += skills.map((sk, i) => {
    const ok = p.mp >= sk.mpCost;
    return `<button class="btn" style="width:100%;margin-bottom:.4rem;text-align:left;${ok ? '' : 'opacity:.4'}"
      ${ok ? `onclick="playerSkill(${i})"` : 'disabled'}>
      ${sk.name} <span style="color:var(--mp2);font-size:.75rem;margin-left:.4rem">${sk.mpCost}MP</span>
      <br><span style="font-size:.72rem;color:var(--text3)">${sk.desc}</span>
    </button>`;
  }).join('');
  html += `<button class="btn" style="width:100%;margin-top:.3rem" onclick="closeSubMenu()">← Back</button>`;
  html += '</div>';
  container.innerHTML = html;
}

function renderItemMenu(container) {
  const p       = G.player;
  const usable  = p.inventory.filter(slot => {
    const item = ITEMS[slot.id];
    return item?.type === 'consumable' && item.effect;
  });
  let html = '<div style="grid-column:1/-1">';
  html += '<div style="font-size:.78rem;color:var(--text3);margin-bottom:.5rem">Use an Item:</div>';
  if (usable.length === 0) {
    html += '<div style="color:var(--text3);font-size:.82rem;padding:.3rem 0">No usable items.</div>';
  } else {
    html += usable.map(slot => {
      const item = ITEMS[slot.id];
      return `<button class="btn" style="width:100%;margin-bottom:.4rem;text-align:left" onclick="playerUseItem('${slot.id}')">
        ${item.icon || '?'} ${item.name} ×${slot.qty}
        <br><span style="font-size:.72rem;color:var(--text3)">${item.desc}</span>
      </button>`;
    }).join('');
  }
  html += `<button class="btn" style="width:100%;margin-top:.3rem" onclick="closeSubMenu()">← Back</button>`;
  html += '</div>';
  container.innerHTML = html;
}

function showCombatResolution(state) {
  const c  = G.combat;
  const p  = G.player;
  const el = document.getElementById('combat-actions');
  if (!el) return;

  if (state === 'victory') {
    const postChoices = getPostCombatChoices(c.levelId);
    const lvl = LEVEL_MAP[c.levelId];

    let html = `<div style="grid-column:1/-1">
      <div style="font-size:1.1rem;color:var(--gold2);font-family:var(--serif);margin-bottom:.5rem">⚔ Victory!</div>
      <div style="font-size:.82rem;color:var(--text2);margin-bottom:.8rem">+${c.enemy.xp} XP · +${c.enemy.gold} Gold</div>`;

    if (G.pendingLevelUp) {
      html += `<button class="btn btn-gold" style="width:100%;margin-bottom:.4rem" onclick="showLevelUpModal(G.pendingLevelUp)">⬆ Level Up!</button>`;
    }

    if (postChoices && postChoices.length > 0) {
      html += `<div style="font-size:.88rem;color:var(--text);font-family:var(--serif);margin:0.8rem 0;line-height:1.7">${lvl.postText || ''}</div>`;
      html += postChoices.map((ch, idx) => {
        const ok = checkCondition(ch.condition);
        return `<button class="choice-btn ${ok ? '' : 'disabled'}" style="margin-bottom:.4rem" ${ok ? `onclick="handlePostCombatChoice(${c.levelId},${idx})"` : 'disabled'}>
          ${ch.text}
        </button>`;
      }).join('');
    } else {
      html += `<button class="btn btn-gold" style="width:100%" onclick="handleReturnToMap()">← Continue</button>`;
    }

    html += '</div>';
    el.innerHTML = html;

  } else if (state === 'fled') {
    el.innerHTML = `<div style="grid-column:1/-1;text-align:center">
      <div style="color:var(--warn);margin-bottom:.8rem">You escaped!</div>
      <button class="btn btn-gold" onclick="handleReturnToMap()">← Return to Map</button>
    </div>`;

  } else if (state === 'defeat') {
    p.hp = 0;
    saveGame();
    setTimeout(() => { showScreen('gameover'); renderGameOver(); }, 1200);
  }
}

function handlePostCombatChoice(levelId, idx) {
  const lvl    = LEVEL_MAP[levelId];
  const choice = lvl?.postChoices?.[idx];
  if (!choice) return;

  applyOutcome(choice.outcome);
  checkSecretUnlocks();
  saveGame();

  if (G.pendingLevelUp) showLevelUpModal(G.pendingLevelUp);

  const el = document.getElementById('combat-actions');
  if (el) {
    const out  = choice.outcome || {};
    const next = out.nextLevel;
    el.innerHTML = `<div style="grid-column:1/-1">
      <div class="outcome-box">${out.text || ''}</div>
      ${(next && next !== 'map')
        ? `<button class="btn btn-gold" onclick="enterLevel(${next})">Continue →</button>`
        : `<button class="btn btn-gold" onclick="handleReturnToMap()">← Return to Map</button>`}
    </div>`;
  }
}

// ─── Inventory Screen ─────────────────────────────────────────────────────────
function renderInventory() {
  const p = G.player;
  if (!p) return;

  // Stats panel
  const statsEl = document.getElementById('stats-panel');
  if (statsEl) {
    const s = getPlayerStats();
    statsEl.innerHTML = [
      ['Name', p.name],
      ['Class', getClassName(p.classId)],
      ['Level', `${p.level}`],
      ['XP', `${p.xp} / ${p.xpToNext}`],
      ['HP', `${p.hp} / ${p.maxHp}`],
      ['MP', `${p.mp} / ${p.maxMp}`],
      ['Attack', p.effAttack],
      ['Defense', p.effDefense],
      ['Luck', p.effLuck],
      ['Gold', `⬡ ${p.gold}`],
      ['Chapters', `${p.unlockedChapters.length} / 8`],
      ['Levels done', p.completedLevels.length],
    ].map(([k, v]) => `<div class="stat-row"><span class="s-label">${k}</span><span class="s-val">${v}</span></div>`).join('');
  }

  // Equipment
  const equipEl = document.getElementById('equip-slots');
  if (equipEl) {
    equipEl.innerHTML = ['weapon', 'armor', 'accessory'].map(slot => {
      const itemId = p.equip[slot];
      const item   = itemId ? ITEMS[itemId] : null;
      return `<div class="equip-slot">
        <span class="slot-label">${slot}</span>
        ${item
          ? `<span class="slot-item">${item.icon || ''} ${item.name}</span>
             <button class="btn btn-sm" style="margin-left:auto" onclick="handleUnequip('${slot}')">✕</button>`
          : `<span class="slot-empty">— empty —</span>`}
      </div>`;
    }).join('');
  }

  // Inventory grid
  const gridEl  = document.getElementById('inv-grid');
  const emptyEl = document.getElementById('inv-empty');
  if (!gridEl) return;

  if (p.inventory.length === 0) {
    gridEl.innerHTML = '';
    if (emptyEl) emptyEl.style.display = 'block';
    return;
  }
  if (emptyEl) emptyEl.style.display = 'none';

  gridEl.innerHTML = p.inventory.map(slot => {
    const item      = ITEMS[slot.id];
    if (!item) return '';
    const isEquip   = ['weapon', 'armor', 'accessory'].includes(item.type);
    const isCons    = item.type === 'consumable';
    const equipped  = Object.values(p.equip).includes(slot.id);
    return `<div class="inv-item ${equipped ? 'equipped' : ''}" title="${item.desc || ''}">
      <div class="item-icon">${item.icon || '?'}</div>
      <div class="item-name">${item.name}</div>
      ${slot.qty > 1 ? `<div class="item-qty">×${slot.qty}</div>` : ''}
      ${isEquip && !equipped ? `<button class="btn btn-sm btn-gold" onclick="handleEquip('${slot.id}')" style="font-size:.65rem;padding:.2rem .4rem;margin-top:.2rem">Equip</button>` : ''}
      ${isCons ? `<button class="btn btn-sm" onclick="handleUseOutOfCombat('${slot.id}')" style="font-size:.65rem;padding:.2rem .4rem;margin-top:.2rem">Use</button>` : ''}
    </div>`;
  }).join('');
}

function handleEquip(itemId) {
  const slot = equipItem(itemId);
  if (slot) showToast(`Equipped to ${slot} slot.`);
  renderInventory();
  saveGame();
}

function handleUnequip(slot) {
  if (unequipItem(slot)) showToast('Unequipped.');
  renderInventory();
  saveGame();
}

function handleUseOutOfCombat(itemId) {
  if (G.screen === 'combat') {
    showToast('Use items from the combat menu during battle.');
    return;
  }
  const result = useItemOutOfCombat(itemId);
  showToast(result.msg);
  renderInventory();
}

// ─── Game Over Screen ─────────────────────────────────────────────────────────
function renderGameOver() {
  const el = document.getElementById('go-text');
  if (!el) return;
  const p = G.player;
  el.innerHTML = `${p?.name || 'Hero'} has fallen at level ${p?.level || 1}, after clearing ${p?.completedLevels?.length || 0} encounters.<br><br>The darkness claims another would-be champion.`;
}

// ─── Victory Screen ───────────────────────────────────────────────────────────
function renderVictory() {
  const p = G.player;
  const ending = determineEnding();

  const endings = {
    hero: {
      title: 'The True Hero',
      text: 'The Realmshard shatters not into ruin, but into a thousand motes of golden light that drift across the land. You bound allies to your cause, gave freely when you could have taken, and faced the Dragon Citadel without flinching.',
      epilogue: 'Songs will be sung of your name until the mountains themselves forget how to stand.',
    },
    guardian: {
      title: 'The Eternal Guardian',
      text: 'The Realmshard is sealed beyond mortal reach. You understood that some powers exist not to be wielded, but to be contained.',
      epilogue: 'You walk the Spine of the world as its last warden — neither triumphant nor broken, simply necessary.',
    },
    power: {
      title: 'The New Sovereign',
      text: 'The Realmshard\'s power flows through your veins like wildfire through dry grass. Vaeltharion\'s ashes settle at your feet.',
      epilogue: 'Whether this is salvation or damnation, only the coming centuries will tell.',
    },
    survivor: {
      title: 'The Survivor',
      text: 'You clawed through eight chapters of nightmare and emerged on the other side. The Realmshard is destroyed. The Dragon is slain.',
      epilogue: 'You sit in the ruins of the Citadel as dawn breaks, and for the first time in a very long while, there is nothing left to fight.',
    },
  };

  const end = endings[ending] || endings.survivor;

  setId('victory-title', end.title);
  setId('victory-text',  end.text);
  setId('victory-epilogue', end.epilogue);

  const statsEl = document.getElementById('victory-stats');
  if (statsEl && p) {
    statsEl.innerHTML = [
      `<span class="gain-chip" style="border-color:var(--gold)">Level ${p.level}</span>`,
      `<span class="gain-chip" style="border-color:var(--xp2)">${p.completedLevels.length} Encounters</span>`,
      `<span class="gain-chip" style="border-color:var(--mp2)">${p.flags.length} Story Choices</span>`,
    ].join('');
  }
}

// ─── Constellation Connector Lines ───────────────────────────────────────────
function drawConnectorLines() {
  const trail = document.getElementById('level-trail');
  if (!trail) return;

  const old = trail.querySelector('.connector-svg');
  if (old) old.remove();

  const nodes = [...trail.querySelectorAll('.level-node:not(.secret)')];
  if (nodes.length < 2) return;

  const trailRect = trail.getBoundingClientRect();
  const positions = nodes.map(n => {
    const r = n.getBoundingClientRect();
    return { x: r.left - trailRect.left + r.width / 2, y: r.top - trailRect.top + r.height / 2 };
  });

  const NS  = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.classList.add('connector-svg');
  // Size to actual scroll dimensions of the trail
  svg.setAttribute('width',  trail.scrollWidth);
  svg.setAttribute('height', trail.scrollHeight);

  for (let i = 0; i < positions.length - 1; i++) {
    const p1 = positions[i];
    const p2 = positions[i + 1];

    // Dim glow line (wide, blurred)
    const glow = document.createElementNS(NS, 'line');
    glow.setAttribute('x1', p1.x); glow.setAttribute('y1', p1.y);
    glow.setAttribute('x2', p2.x); glow.setAttribute('y2', p2.y);
    glow.setAttribute('stroke', '#4a3880');
    glow.setAttribute('stroke-width', '3');
    glow.setAttribute('stroke-opacity', '0.35');
    svg.appendChild(glow);

    // Dashed foreground line
    const line = document.createElementNS(NS, 'line');
    line.setAttribute('x1', p1.x); line.setAttribute('y1', p1.y);
    line.setAttribute('x2', p2.x); line.setAttribute('y2', p2.y);
    line.setAttribute('stroke', '#6a4faa');
    line.setAttribute('stroke-width', '1');
    line.setAttribute('stroke-dasharray', '5 5');
    svg.appendChild(line);
  }

  // Small star dots at each node center
  positions.forEach(p => {
    const dot = document.createElementNS(NS, 'circle');
    dot.setAttribute('cx', p.x); dot.setAttribute('cy', p.y);
    dot.setAttribute('r', '2.5');
    dot.setAttribute('fill', '#8a6acc');
    dot.setAttribute('fill-opacity', '0.5');
    svg.appendChild(dot);
  });

  trail.insertBefore(svg, trail.firstChild);
}

// ─── About Modal ─────────────────────────────────────────────────────────────
function showAboutModal() {
  const el = document.getElementById('about-modal');
  if (el) el.style.display = 'flex';
}

function closeAboutModal() {
  const el = document.getElementById('about-modal');
  if (el) el.style.display = 'none';
}

// ─── Entering a Level ─────────────────────────────────────────────────────────
function enterLevel(levelId) {
  const lvl = LEVEL_MAP[levelId];
  if (!lvl) return;
  G.currentLevelId = levelId;

  if (lvl.type === 'combat' || lvl.type === 'boss') {
    startCombat(levelId);

    // Put pre-combat text in the log
    if (lvl.preText || lvl.flavor) {
      G.combat.log.push(lvl.flavor || '');
      if (lvl.preText) G.combat.log.push(lvl.preText);
    }

    showScreen('combat');
    renderCombat();
  } else {
    renderLevel(levelId);
  }
}
