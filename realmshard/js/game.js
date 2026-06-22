'use strict';

// ─── Global State ────────────────────────────────────────────────────────────
const G = {
  player: null,
  currentLevelId: null,
  combat: null,
  screen: 'title',
  pendingLevelUp: false,
  _selectedClass: null,
  _activeChapter: 1,
};

// ─── Save / Load ─────────────────────────────────────────────────────────────
const SAVE_KEY = 'realmshard_save';

function saveGame() {
  if (!G.player) return;
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({ player: G.player, currentLevelId: G.currentLevelId, v: 1 }));
  } catch (e) { console.warn('Save failed:', e); }
}

function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return false;
    const d = JSON.parse(raw);
    if (!d?.player) return false;
    G.player         = d.player;
    G.currentLevelId = d.currentLevelId;
    return true;
  } catch (e) { return false; }
}

function hasSave() {
  try { return !!localStorage.getItem(SAVE_KEY); } catch (e) { return false; }
}

function deleteSave() {
  try { localStorage.removeItem(SAVE_KEY); } catch (e) {}
}

// ─── Player Initialization ────────────────────────────────────────────────────
function initPlayer(name, classId) {
  const cls = CLASSES[classId];
  if (!cls) throw new Error('Unknown class: ' + classId);
  const s = cls.startStats;

  G.player = {
    name: name || 'Hero',
    classId,
    level: 1,
    xp: 0,
    xpToNext: 50,
    gold: 20,

    // Base stats (grow on level up)
    maxHp: s.maxHp, hp: s.maxHp,
    maxMp: s.maxMp, mp: s.maxMp,
    attack: s.attack, defense: s.defense, luck: s.luck,

    // Effective stats (base + equipment bonuses)
    effAttack: s.attack, effDefense: s.defense, effLuck: s.luck,

    equip: { weapon: null, armor: null, accessory: null },
    inventory: [],
    flags: [],
    completedLevels: [],
    unlockedChapters: [1],
    statusEffects: [],
  };

  if (cls.startEquip.weapon) equipItem(cls.startEquip.weapon, true);
  if (cls.startEquip.armor)  equipItem(cls.startEquip.armor,  true);
  cls.startItems.forEach(si => addItem(si.id, si.qty));

  recalcStats();
  G.currentLevelId = 1;
  saveGame();
}

// ─── Stat Recalculation ───────────────────────────────────────────────────────
function recalcStats() {
  const p = G.player;
  let atkB = 0, defB = 0, lckB = 0;
  Object.values(p.equip).forEach(id => {
    if (!id) return;
    const it = ITEMS[id];
    if (!it?.stats) return;
    atkB += it.stats.attack  || 0;
    defB += it.stats.defense || 0;
    lckB += it.stats.luck    || 0;
  });
  p.effAttack  = p.attack  + atkB;
  p.effDefense = p.defense + defB;
  p.effLuck    = p.luck    + lckB;
  p.hp = Math.min(p.hp, p.maxHp);
  p.mp = Math.min(p.mp, p.maxMp);
}

// ─── Inventory Management ─────────────────────────────────────────────────────
function addItem(id, qty = 1) {
  if (!ITEMS[id]) return false;
  const existing = G.player.inventory.find(i => i.id === id);
  if (existing) { existing.qty += qty; }
  else { G.player.inventory.push({ id, qty }); }
  return true;
}

function removeItem(id, qty = 1) {
  const idx = G.player.inventory.findIndex(i => i.id === id);
  if (idx === -1) return false;
  G.player.inventory[idx].qty -= qty;
  if (G.player.inventory[idx].qty <= 0) G.player.inventory.splice(idx, 1);
  return true;
}

function hasItem(id, qty = 1) {
  const slot = G.player.inventory.find(i => i.id === id);
  return slot ? slot.qty >= qty : false;
}

function equipItem(id, silent = false) {
  const item = ITEMS[id];
  if (!item) return false;
  const typeToSlot = { weapon: 'weapon', armor: 'armor', accessory: 'accessory' };
  const slot = typeToSlot[item.type];
  if (!slot) return false;
  if (G.player.equip[slot]) addItem(G.player.equip[slot]);
  G.player.equip[slot] = id;
  if (!silent) removeItem(id);
  recalcStats();
  return slot;
}

function unequipItem(slot) {
  if (!G.player.equip[slot]) return false;
  addItem(G.player.equip[slot]);
  G.player.equip[slot] = null;
  recalcStats();
  return true;
}

// ─── Story Flags ──────────────────────────────────────────────────────────────
function addFlag(flag) {
  if (!G.player.flags.includes(flag)) G.player.flags.push(flag);
}

function hasFlag(flag) {
  return G.player.flags.includes(flag);
}

// ─── XP & Leveling ───────────────────────────────────────────────────────────
const MAX_LEVEL = 20;

function gainXP(amount) {
  const p = G.player;
  if (p.level >= MAX_LEVEL) return false;
  p.xp += amount;
  let leveled = false;
  while (p.xp >= p.xpToNext && p.level < MAX_LEVEL) {
    p.xp -= p.xpToNext;
    levelUp();
    leveled = true;
  }
  return leveled;
}

function levelUp() {
  const p = G.player;
  p.level++;
  p.xpToNext = p.level * 50;
  const g = CLASSES[p.classId].statPerLevel;
  p.maxHp  += g.hp  || 0;
  p.hp      = Math.min(p.hp + (g.hp || 0), p.maxHp);
  p.maxMp  += g.mp  || 0;
  p.mp      = Math.min(p.mp + Math.floor((g.mp || 0) / 2), p.maxMp);
  p.attack  += g.attack  || 0;
  p.defense += g.defense || 0;
  p.luck    += g.luck    || 0;
  recalcStats();
  G.pendingLevelUp = { level: p.level, gains: g };
}

// ─── Damage Formula ───────────────────────────────────────────────────────────
function calcDamage(atk, def, luck, mult = 1.0, pen = 0) {
  const effDef = Math.max(0, def * (1 - pen));
  const base   = Math.max(1, atk * mult - effDef * 0.5);
  const roll   = 0.85 + Math.random() * 0.3;
  const crit   = Math.random() < Math.min(0.5, luck / 200);
  return { dmg: Math.max(1, Math.round(base * roll * (crit ? 1.75 : 1))), isCrit: crit };
}

// ─── Status Effects ───────────────────────────────────────────────────────────
function applyStatus(target, type, value, turns) {
  const ex = target.statusEffects.find(s => s.type === type);
  if (ex) { ex.turns = Math.max(ex.turns, turns); ex.value = Math.max(ex.value, value); }
  else target.statusEffects.push({ type, value, turns });
}

function tickStatus(target, logFn) {
  const rem = [];
  target.statusEffects.forEach((s, i) => {
    if (s.type === 'poison' || s.type === 'burn') {
      const d = Math.max(1, Math.round(s.value));
      target.hp = Math.max(0, target.hp - d);
      logFn(`${target.name} takes ${d} ${s.type} damage.`);
    }
    s.turns--;
    if (s.turns <= 0) rem.push(i);
  });
  rem.reverse().forEach(i => target.statusEffects.splice(i, 1));
}

function hasStatus(target, type) {
  return target.statusEffects.some(s => s.type === type);
}

function clearStatus(target, type) {
  target.statusEffects = target.statusEffects.filter(s => s.type !== type);
}

function getStatus(target, type) {
  return target.statusEffects.find(s => s.type === type);
}

// ─── Combat Initialization ────────────────────────────────────────────────────
function startCombat(levelId) {
  const lvl = LEVEL_MAP[levelId];
  if (!lvl?.enemy) return false;
  const e = lvl.enemy;
  G.combat = {
    levelId,
    enemy: {
      name: e.name, icon: e.icon || '👹',
      maxHp: e.hp, hp: e.hp,
      attack: e.attack, defense: e.defense,
      xp: e.xp, gold: e.gold,
      isBoss: !!e.isBoss,
      finalBoss: !!e.finalBoss,
      skills: e.skills || [],
      loot: e.loot || [],
      statusEffects: [],
      skillCooldowns: {},
      buffAtk: 0, buffDef: 0,
    },
    log: [],
    turn: 'player',
    round: 1,
    fled: false,
    won: false,
    showingSkills: false,
    showingItems: false,
  };
  return true;
}

function combatLog(msg) {
  if (G.combat) G.combat.log.push(msg);
}

// ─── Enemy AI ─────────────────────────────────────────────────────────────────
function enemyTurn() {
  const c = G.combat;
  if (!c || c.won || c.fled) return;
  const enemy = c.enemy;
  const p = G.player;

  tickStatus(enemy, combatLog);
  if (enemy.hp <= 0) { resolveVictory(); if (window.renderCombat) renderCombat(); return; }

  if (hasStatus(enemy, 'stun')) {
    combatLog(`${enemy.name} is stunned and loses their turn!`);
    clearStatus(enemy, 'stun');
    endEnemyTurn();
    if (window.renderCombat) renderCombat();
    return;
  }

  // Pick a skill
  const available = enemy.skills.filter(sk => {
    const cd = enemy.skillCooldowns[sk.name] || 0;
    return cd <= 0 && Math.random() < sk.chance;
  });
  const chosen = available[0] || null;

  if (chosen) {
    enemy.skillCooldowns[chosen.name] = chosen.cooldown || 0;
    executeEnemySkill(chosen);
  } else {
    // Basic attack
    const armorBreakDef = getStatus(p, 'armor_break');
    const defUsed = armorBreakDef ? Math.max(0, p.effDefense - armorBreakDef.value) : p.effDefense;
    const { dmg, isCrit } = calcDamage(enemy.attack + (enemy.buffAtk || 0), defUsed, 0);
    // Check player dodge
    const pdodge = getStatus(p, 'dodge');
    if (pdodge && Math.random() < pdodge.value) {
      combatLog(`${enemy.name} attacks but you dodge!`);
    } else {
      p.hp = Math.max(0, p.hp - dmg);
      combatLog(`${enemy.name} attacks for ${dmg} damage${isCrit ? ' (CRIT!)' : ''}.`);
    }
  }

  tickStatus(p, combatLog);
  endEnemyTurn();
  if (window.renderCombat) renderCombat();
}

function executeEnemySkill(sk) {
  const { enemy } = G.combat;
  const p = G.player;

  const armorBreakDef = getStatus(p, 'armor_break');
  const defUsed = armorBreakDef ? Math.max(0, p.effDefense - armorBreakDef.value) : p.effDefense;
  const pdodge  = getStatus(p, 'dodge');

  const tryHit = (atkMult) => {
    if (pdodge && Math.random() < pdodge.value) { combatLog(`You dodge ${sk.name}!`); return 0; }
    const { dmg, isCrit } = calcDamage(enemy.attack + (enemy.buffAtk || 0), defUsed, 0, atkMult);
    p.hp = Math.max(0, p.hp - dmg);
    return dmg;
  };

  switch (sk.type) {
    case 'basic':  { const d = tryHit(1.0); if (d) combatLog(`${enemy.name} uses ${sk.name} for ${d} damage.`); break; }
    case 'heavy':  { const d = tryHit(1.8); if (d) combatLog(`${enemy.name} uses ${sk.name} for ${d} damage!`); break; }
    case 'multi': {
      const hits = 2 + Math.floor(Math.random() * 2);
      let tot = 0;
      for (let i = 0; i < hits; i++) { const { dmg } = calcDamage(enemy.attack * 0.55, defUsed, 0); p.hp = Math.max(0, p.hp - dmg); tot += dmg; }
      combatLog(`${enemy.name} uses ${sk.name} — ${hits} hits for ${tot} total!`);
      break;
    }
    case 'poison': {
      const d = tryHit(0.7);
      if (d >= 0) applyStatus(p, 'poison', Math.round(enemy.attack * 0.15), 3);
      combatLog(`${enemy.name} uses ${sk.name} — ${d || 0} dmg + poisoned 3t!`);
      break;
    }
    case 'burn': {
      const d = tryHit(0.8);
      if (d >= 0) applyStatus(p, 'burn', Math.round(enemy.attack * 0.12), 3);
      combatLog(`${enemy.name} uses ${sk.name} — ${d || 0} dmg + burning 3t!`);
      break;
    }
    case 'freeze': {
      const d = tryHit(0.6);
      if (d >= 0) applyStatus(p, 'freeze', 0, 2);
      combatLog(`${enemy.name} uses ${sk.name} — ${d || 0} dmg + frozen 2t!`);
      break;
    }
    case 'stun': applyStatus(p, 'stun', 0, 1); combatLog(`${enemy.name} uses ${sk.name} — you are stunned!`); break;
    case 'heal': {
      const h = Math.round(enemy.maxHp * 0.15);
      enemy.hp = Math.min(enemy.maxHp, enemy.hp + h);
      combatLog(`${enemy.name} uses ${sk.name} and heals ${h} HP!`);
      break;
    }
    case 'drain': {
      const d = tryHit(0.9);
      if (d > 0) { const h = Math.round(d * 0.5); enemy.hp = Math.min(enemy.maxHp, enemy.hp + h); combatLog(`${enemy.name} drains ${d} HP (healed ${h})!`); }
      break;
    }
    case 'buff_atk': {
      const v = Math.round(enemy.attack * 0.4);
      enemy.buffAtk = (enemy.buffAtk || 0) + v;
      applyStatus(enemy, 'buff_atk', v, 3);
      combatLog(`${enemy.name} uses ${sk.name} — attack boosted!`);
      break;
    }
    case 'buff_def': {
      const v = Math.round(enemy.defense * 0.4);
      enemy.buffDef = (enemy.buffDef || 0) + v;
      applyStatus(enemy, 'buff_def', v, 3);
      combatLog(`${enemy.name} uses ${sk.name} — defense boosted!`);
      break;
    }
    case 'dodge': applyStatus(enemy, 'dodge', 0.7, 2); combatLog(`${enemy.name} becomes evasive!`); break;
    case 'armor_break': {
      const v = Math.round(p.effDefense * 0.3);
      applyStatus(p, 'armor_break', v, 3);
      combatLog(`${enemy.name} uses ${sk.name} — armor weakened 3t!`);
      break;
    }
    default: { const d = tryHit(1.0); combatLog(`${enemy.name} uses ${sk.name} for ${d} damage.`); }
  }
}

function endEnemyTurn() {
  const c = G.combat;
  Object.keys(c.enemy.skillCooldowns).forEach(k => {
    if (c.enemy.skillCooldowns[k] > 0) c.enemy.skillCooldowns[k]--;
  });
  c.round++;
  c.turn = G.player.hp <= 0 ? 'dead' : 'player';
}

// ─── Player Attack ────────────────────────────────────────────────────────────
function playerAttack() {
  const c = G.combat;
  const p = G.player;
  if (c?.turn !== 'player') return;

  if (hasStatus(p, 'stun')) {
    clearStatus(p, 'stun');
    combatLog('You are stunned and lose your turn!');
    c.turn = 'enemy';
    setTimeout(() => { enemyTurn(); }, 600);
    return;
  }
  if (hasStatus(p, 'freeze')) {
    clearStatus(p, 'freeze');
    combatLog('You are frozen solid and cannot act!');
    c.turn = 'enemy';
    setTimeout(() => { enemyTurn(); }, 600);
    return;
  }

  const enemy = c.enemy;
  const dodgeS = getStatus(enemy, 'dodge');
  if (dodgeS && Math.random() < dodgeS.value) {
    combatLog(`${enemy.name} dodges your attack!`);
    c.turn = 'enemy';
    setTimeout(() => { enemyTurn(); }, 600);
    if (window.renderCombat) renderCombat();
    return;
  }

  const armorBreakDef = getStatus(p, 'armor_break');
  const defToUse = armorBreakDef ? Math.max(0, p.effDefense - armorBreakDef.value) : p.effDefense;
  const { dmg, isCrit } = calcDamage(p.effAttack, enemy.defense + (enemy.buffDef || 0), p.effLuck);
  enemy.hp = Math.max(0, enemy.hp - dmg);
  combatLog(`You attack ${enemy.name} for ${dmg} damage${isCrit ? ' (CRITICAL!)' : ''}.`);

  if (enemy.hp <= 0) { resolveVictory(); if (window.renderCombat) renderCombat(); return; }

  c.turn = 'enemy';
  if (window.renderCombat) renderCombat();
  setTimeout(() => { enemyTurn(); if (window.renderCombat) renderCombat(); }, 600);
}

// ─── Player Skill ─────────────────────────────────────────────────────────────
function playerSkill(skillIdx) {
  const c = G.combat;
  const p = G.player;
  if (c?.turn !== 'player') return;

  const skill = CLASSES[p.classId]?.skills?.[skillIdx];
  if (!skill) return;
  if (p.mp < skill.mpCost) { combatLog(`Not enough MP! Need ${skill.mpCost} MP.`); return; }

  p.mp -= skill.mpCost;
  const eff   = skill.effect || {};
  const enemy = c.enemy;

  c.showingSkills = false;

  switch (eff.type) {
    case 'damage': {
      const dodgeS = getStatus(enemy, 'dodge');
      if (dodgeS && Math.random() < dodgeS.value) { combatLog(`${enemy.name} dodges ${skill.name}!`); break; }
      const { dmg, isCrit } = calcDamage(p.effAttack, enemy.defense, p.effLuck, eff.mult || 1.5, eff.pen || 0);
      enemy.hp = Math.max(0, enemy.hp - dmg);
      combatLog(`You use ${skill.name} for ${dmg} damage${isCrit ? ' (CRIT!)' : ''}.`);
      if (enemy.hp <= 0) { resolveVictory(); if (window.renderCombat) renderCombat(); return; }
      break;
    }
    case 'buff_def': {
      const v = eff.val || 6;
      applyStatus(p, 'buff_def', v, eff.dur || 3);
      combatLog(`You use ${skill.name} — DEF +${v} for ${eff.dur || 3} turns.`);
      break;
    }
    case 'heal_pct': {
      const h = Math.round(p.maxHp * (eff.pct || 0.25));
      p.hp = Math.min(p.maxHp, p.hp + h);
      combatLog(`You use ${skill.name} and restore ${h} HP.`);
      break;
    }
    case 'shield': {
      applyStatus(p, 'block', eff.val || 30, 1);
      combatLog(`You use ${skill.name} — blocking up to ${eff.val || 30} damage.`);
      break;
    }
    case 'dodge': {
      applyStatus(p, 'dodge', eff.chance || 0.7, 1);
      combatLog(`You use ${skill.name} — ${Math.round((eff.chance || 0.7) * 100)}% dodge chance.`);
      break;
    }
    case 'steal': {
      if (enemy.loot?.length && Math.random() < 0.55) {
        const drop = enemy.loot[Math.floor(Math.random() * enemy.loot.length)];
        if (drop && ITEMS[drop.id]) { addItem(drop.id); combatLog(`You use ${skill.name} and steal a ${ITEMS[drop.id].name}!`); }
        else { const g = 5 + Math.floor(Math.random() * 15); p.gold += g; combatLog(`You use ${skill.name} and steal ${g} gold!`); }
      } else {
        combatLog(`You use ${skill.name} but find nothing to steal!`);
      }
      break;
    }
    default:
      combatLog(`You use ${skill.name}.`);
  }

  c.turn = 'enemy';
  if (window.renderCombat) renderCombat();
  setTimeout(() => { enemyTurn(); if (window.renderCombat) renderCombat(); }, 600);
}

// ─── Player Use Item (in combat) ──────────────────────────────────────────────
function playerUseItem(itemId) {
  const c = G.combat;
  const p = G.player;
  if (c?.turn !== 'player') return;

  const item = ITEMS[itemId];
  if (!item || !hasItem(itemId)) return;
  if (!item.effect) return;

  removeItem(itemId);
  c.showingItems = false;

  const eff   = item.effect;
  const enemy = c.enemy;

  switch (eff.type) {
    case 'heal':
      p.hp = Math.min(p.maxHp, p.hp + (eff.hp || 0));
      combatLog(`You use ${item.name} and restore ${eff.hp || 0} HP.`);
      break;
    case 'mp':
      p.mp = Math.min(p.maxMp, p.mp + (eff.mp || 0));
      combatLog(`You use ${item.name} and restore ${eff.mp || 0} MP.`);
      break;
    case 'dual_heal':
      p.hp = Math.min(p.maxHp, p.hp + (eff.hp || 0));
      p.mp = Math.min(p.maxMp, p.mp + (eff.mp || 0));
      combatLog(`You use ${item.name} — +${eff.hp || 0} HP, +${eff.mp || 0} MP.`);
      break;
    case 'damage': {
      const dmg = eff.dmg || 30;
      enemy.hp = Math.max(0, enemy.hp - dmg);
      combatLog(`You use ${item.name} on ${enemy.name} for ${dmg} damage!`);
      if (enemy.hp <= 0) { resolveVictory(); if (window.renderCombat) renderCombat(); return; }
      break;
    }
    case 'freeze':
      applyStatus(enemy, 'freeze', 0, 1);
      combatLog(`You use ${item.name} — ${enemy.name} is frozen!`);
      break;
    case 'buff_atk':
      applyStatus(p, 'buff_atk', eff.val || 6, eff.dur || 3);
      combatLog(`You use ${item.name} — ATK +${eff.val || 6} for ${eff.dur || 3} turns.`);
      break;
    case 'cure_poison':
      clearStatus(p, 'poison');
      clearStatus(p, 'burn');
      combatLog(`You use ${item.name} — ailments cured!`);
      break;
    default:
      combatLog(`You use ${item.name}.`);
  }

  c.turn = 'enemy';
  if (window.renderCombat) renderCombat();
  setTimeout(() => { enemyTurn(); if (window.renderCombat) renderCombat(); }, 600);
}

// ─── Player Flee ──────────────────────────────────────────────────────────────
function playerFlee() {
  const c = G.combat;
  const p = G.player;
  if (c?.turn !== 'player') return;
  if (c.enemy.isBoss) { combatLog("You cannot flee from a boss!"); return; }

  if (Math.random() < 0.4 + p.effLuck / 200) {
    c.fled = true;
    p.hp = Math.max(1, p.hp - Math.round(p.maxHp * 0.1));
    combatLog("You escape! (Lost 10% HP fleeing.)");
    saveGame();
    if (window.renderCombat) renderCombat();
  } else {
    combatLog("Escape failed! The enemy strikes!");
    const { dmg } = calcDamage(c.enemy.attack, p.effDefense, 0);
    p.hp = Math.max(0, p.hp - dmg);
    combatLog(`${c.enemy.name} hits for ${dmg} damage as you retreat!`);
    c.turn = 'enemy';
    if (window.renderCombat) renderCombat();
    setTimeout(() => { enemyTurn(); if (window.renderCombat) renderCombat(); }, 600);
  }
}

// ─── Victory Resolution ───────────────────────────────────────────────────────
function resolveVictory() {
  const c = G.combat;
  const p = G.player;
  c.won  = true;
  c.turn = 'victory';

  combatLog(`\n⚔ ${c.enemy.name} defeated!`);
  gainXP(c.enemy.xp);
  p.gold += c.enemy.gold;
  combatLog(`+${c.enemy.xp} XP  +${c.enemy.gold} Gold`);

  c.enemy.loot.forEach(drop => {
    if (Math.random() < drop.chance) {
      addItem(drop.id);
      combatLog(`Found: ${ITEMS[drop.id]?.name || drop.id}`);
    }
  });

  if (!p.completedLevels.includes(c.levelId)) {
    p.completedLevels.push(c.levelId);
    const lvl = LEVEL_MAP[c.levelId];
    if (lvl?.chapter && c.levelId % 10 === 0) {
      const next = lvl.chapter + 1;
      if (next <= 8 && !p.unlockedChapters.includes(next)) p.unlockedChapters.push(next);
    }
  }
  checkSecretUnlocks();
  saveGame();
}

// ─── Level Completion & Outcomes ─────────────────────────────────────────────
function applyOutcome(outcome) {
  if (!outcome) return;
  const p = G.player;
  if (outcome.hp)          p.hp    = Math.min(p.maxHp, Math.max(0, p.hp    + outcome.hp));
  if (outcome.mp)          p.mp    = Math.min(p.maxMp, Math.max(0, p.mp    + outcome.mp));
  if (outcome.xp)          gainXP(outcome.xp);
  if (outcome.gold)        p.gold += outcome.gold;
  if (outcome.flags)       outcome.flags.forEach(addFlag);
  if (outcome.items)       outcome.items.forEach(it => addItem(it.id || it, it.qty || 1));
  if (outcome.removeItems) outcome.removeItems.forEach(it => removeItem(it.id || it, it.qty || 1));
}

function completeLevel(levelId, outcomeIdx) {
  const p   = G.player;
  const lvl = LEVEL_MAP[levelId];
  if (!p.completedLevels.includes(levelId)) p.completedLevels.push(levelId);
  if (outcomeIdx >= 0 && lvl?.choices?.[outcomeIdx]) applyOutcome(lvl.choices[outcomeIdx].outcome);
  if (lvl?.chapter && levelId % 10 === 0) {
    const next = lvl.chapter + 1;
    if (next <= 8 && !p.unlockedChapters.includes(next)) p.unlockedChapters.push(next);
  }
  checkSecretUnlocks();
  saveGame();
}

// ─── Secret Levels ────────────────────────────────────────────────────────────
function checkSecretUnlocks() {
  // Auto-called; secret levels become visible when their flag exists
}

function isLevelUnlocked(levelId) {
  const p   = G.player;
  const lvl = LEVEL_MAP[levelId];
  if (!lvl) return false;
  if (lvl.secret) return !!(lvl.secretFlag && hasFlag(lvl.secretFlag));
  if (levelId === 1) return true;
  if (!p.unlockedChapters.includes(lvl.chapter)) return false;
  return p.completedLevels.includes(levelId - 1) || levelId === (lvl.chapter - 1) * 10 + 1;
}

function isLevelCompleted(levelId) {
  return G.player.completedLevels.includes(levelId);
}

function getAvailableLevels(chapter) {
  return LEVELS.filter(lvl => {
    if (lvl.secret) return hasFlag(lvl.secretFlag);
    return lvl.chapter === chapter && isLevelUnlocked(lvl.id);
  });
}

// ─── Choice Conditions ────────────────────────────────────────────────────────
function checkCondition(cond) {
  if (!cond) return true;
  const p = G.player;
  switch (cond.type) {
    case 'flag':    return hasFlag(cond.key);
    case 'no_flag': return !hasFlag(cond.key);
    case 'item':    return hasItem(cond.key, cond.min || 1);
    case 'stat':    return (p[cond.key] || 0) >= (cond.min || 0);
    case 'class':   return p.classId === cond.key;
    case 'level':   return p.level >= (cond.min || 1);
    default: return true;
  }
}

// ─── Post-combat Choices ──────────────────────────────────────────────────────
function getPostCombatChoices(levelId) {
  return LEVEL_MAP[levelId]?.postChoices || null;
}

// ─── Out-of-combat Item Use ───────────────────────────────────────────────────
function useItemOutOfCombat(itemId) {
  const p    = G.player;
  const item = ITEMS[itemId];
  if (!item || !hasItem(itemId)) return { ok: false, msg: 'Item not found.' };
  if (item.type !== 'consumable')  return { ok: false, msg: 'Cannot use this outside combat.' };
  const eff = item.effect;
  if (!eff) return { ok: false, msg: 'No effect.' };

  let msg = `Used ${item.name}. `;
  switch (eff.type) {
    case 'heal':       { const h = Math.min(eff.hp || 0, p.maxHp - p.hp); p.hp = Math.min(p.maxHp, p.hp + (eff.hp || 0)); msg += `+${h} HP.`; break; }
    case 'mp':         { const m = Math.min(eff.mp || 0, p.maxMp - p.mp); p.mp = Math.min(p.maxMp, p.mp + (eff.mp || 0)); msg += `+${m} MP.`; break; }
    case 'dual_heal':  { p.hp = Math.min(p.maxHp, p.hp + (eff.hp || 0)); p.mp = Math.min(p.maxMp, p.mp + (eff.mp || 0)); msg += `+${eff.hp || 0} HP, +${eff.mp || 0} MP.`; break; }
    case 'cure_poison':{ p.statusEffects = []; msg += 'Ailments cured.'; break; }
    default: return { ok: false, msg: 'Must be used in combat.' };
  }

  removeItem(itemId);
  saveGame();
  return { ok: true, msg };
}

// ─── Ending ───────────────────────────────────────────────────────────────────
function determineEnding() {
  const f = G.player.flags;
  if (f.includes('zara_ally') && f.includes('helped_druid') && f.includes('given_not_taken')) return 'hero';
  if (f.includes('realmshard_sealed') && !f.includes('performed_ritual')) return 'guardian';
  if (f.includes('performed_ritual') && hasItem('realmshard_shard')) return 'power';
  return 'survivor';
}

// ─── Utility ──────────────────────────────────────────────────────────────────
function getPlayerStats() {
  const p = G.player;
  return {
    level: p.level, xp: p.xp, xpToNext: p.xpToNext,
    xpPct:  Math.round((p.xp / p.xpToNext) * 100),
    hpPct:  Math.round((p.hp / p.maxHp)    * 100),
    mpPct:  Math.round((p.mp / p.maxMp)    * 100),
  };
}

function getSkills() {
  return CLASSES[G.player?.classId]?.skills || [];
}

function getClassName(classId) {
  return { warden: 'Warden', spellblade: 'Spellblade', trickster: 'Trickster' }[classId] || classId;
}
