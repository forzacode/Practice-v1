'use strict';
// ═══════════════════════════════════════════════════
//  REALMSHARD CHRONICLES — GAME DATA
// ═══════════════════════════════════════════════════

const ITEMS = {
  oak_branch:          {id:'oak_branch',          name:'Oak Branch',            type:'weapon', icon:'🌿', desc:'Druid-carved. More weapon than walking stick.',          stats:{attack:2,luck:1},         sell:4  },
  rusty_sword:         {id:'rusty_sword',          name:'Rusty Shortsword',      type:'weapon', icon:'⚔',  desc:'Pitted, but sharper than your wit in a pinch.',         stats:{attack:3},                sell:5  },
  dagger_wit:          {id:'dagger_wit',           name:'Dagger of Wit',         type:'weapon', icon:'🗡',  desc:'Light as a quip, sharp as an insult.',                  stats:{attack:4,luck:2},         sell:15 },
  iron_sword:          {id:'iron_sword',           name:'Iron Sword',            type:'weapon', icon:'⚔',  desc:'Empire-stamped and soldier-proven.',                     stats:{attack:6},                sell:25 },
  coral_blade:         {id:'coral_blade',          name:'Coral Blade',           type:'weapon', icon:'⚔',  desc:'Recovered from the ruins. Still drips somehow.',         stats:{attack:8,defense:1},      sell:40 },
  ember_blade:         {id:'ember_blade',          name:'Ember Blade',           type:'weapon', icon:'🔥', desc:'Forged in volcanic rock. Holds the grudge.',             stats:{attack:11},               sell:60 },
  frost_fang:          {id:'frost_fang',           name:'Frostfang Blade',       type:'weapon', icon:'❄',  desc:'Never warms. Neither do its victims.',                   stats:{attack:9,luck:1},         sell:65 },
  shadow_dirk:         {id:'shadow_dirk',          name:'Shadow Dirk',           type:'weapon', icon:'🗡',  desc:'Disappears in low light. So do its targets.',            stats:{attack:8,luck:3},         sell:70 },
  clockwork_xbow:      {id:'clockwork_xbow',       name:'Clockwork Crossbow',    type:'weapon', icon:'🏹', desc:'Self-loading. Self-aiming would be better.',             stats:{attack:13,luck:1},        sell:90 },
  scepter_dom:         {id:'scepter_dom',          name:'Scepter of Dominion',   type:'weapon', icon:'🔮', desc:"The regent's weapon. Hums with political authority.",    stats:{attack:7,mp:20},          sell:100},
  dragonbone_sword:    {id:'dragonbone_sword',     name:'Dragonbone Sword',      type:'weapon', icon:'⚔',  desc:'Ground from a lesser dragon\'s spine. Lighter than it looks.', stats:{attack:18},       sell:150},
  leather_tunic:       {id:'leather_tunic',        name:'Leather Tunic',         type:'armor',  icon:'🛡',  desc:'Boiled and treated. Hopefully more resistant than it looks.', stats:{defense:3},        sell:8  },
  chainmail:           {id:'chainmail',            name:'Chainmail Hauberk',     type:'armor',  icon:'🛡',  desc:'Heavy, clinky, and arrows find it disagreeable.',        stats:{defense:7},               sell:30 },
  ember_guard:         {id:'ember_guard',          name:'Ember Guard',           type:'armor',  icon:'🛡',  desc:'Volcanic ceramic plates. Hot to the touch year-round.',  stats:{defense:8,hp:10},         sell:55 },
  frostweave:          {id:'frostweave',           name:'Frostweave Cloak',      type:'armor',  icon:'🧥', desc:'Woven from frozen spider silk. Cold repels cold.',        stats:{defense:6,hp:15},         sell:50 },
  shadow_shroud:       {id:'shadow_shroud',        name:'Shadow Shroud',         type:'armor',  icon:'🧥', desc:'Absorbs light like a personal eclipse.',                 stats:{defense:5,luck:3},        sell:65 },
  clockwork_plate:     {id:'clockwork_plate',      name:'Clockwork Plate',       type:'armor',  icon:'🛡',  desc:'Articulated armor that tracks your movements. Unsettling.',stats:{defense:12},            sell:95 },
  court_raiment:       {id:'court_raiment',        name:'Court Raiment',         type:'armor',  icon:'👘', desc:'Silk and steel. Opens some doors, closes others.',       stats:{defense:6,luck:2},        sell:80 },
  dragonscale_hauberk: {id:'dragonscale_hauberk',  name:'Dragonscale Hauberk',   type:'armor',  icon:'🛡',  desc:'Every scale a trophy. Together, nearly invincible.',     stats:{defense:15,hp:20},        sell:180},
  health_potion:       {id:'health_potion',        name:'Health Potion',         type:'consumable',icon:'🧪',desc:'Restores 40 HP. Tastes like sugared copper.',          effect:{type:'heal',hp:40},      stack:true,sell:12},
  greater_health:      {id:'greater_health',       name:'Greater Health Potion', type:'consumable',icon:'🧪',desc:'Restores 80 HP. Tastes like victory (and copper).',    effect:{type:'heal',hp:80},      stack:true,sell:28},
  mana_elixir:         {id:'mana_elixir',          name:'Mana Elixir',           type:'consumable',icon:'💧',desc:'Restores 40 MP. Faintly luminescent. Do not confuse.', effect:{type:'mp',mp:40},        stack:true,sell:12},
  antidote:            {id:'antidote',             name:'Antidote',              type:'consumable',icon:'🟢',desc:'Cures poison. The taste is its own punishment.',        effect:{type:'cure_poison'},     stack:true,sell:10},
  ember_stone:         {id:'ember_stone',          name:'Ember Stone',           type:'consumable',icon:'🪨',desc:'Ignites on contact with air. Deals 35 fire damage.',    effect:{type:'damage',dmg:35},   stack:true,sell:15},
  frost_crystal:       {id:'frost_crystal',        name:'Frost Crystal',         type:'consumable',icon:'💎',desc:'A permanent-ice shard. Freezes enemy for 1 turn.',      effect:{type:'freeze'},          stack:true,sell:18},
  elixir_power:        {id:'elixir_power',         name:'Elixir of Might',       type:'consumable',icon:'🧪',desc:'+6 ATK for 3 turns.',                                  effect:{type:'buff_atk',val:6,dur:3},stack:true,sell:25},
  druid_charm:         {id:'druid_charm',          name:"Druid's Charm",         type:'consumable',icon:'🌿',desc:'Restores 25 HP and 25 MP. Smells of pine and old rain.',effect:{type:'dual_heal',hp:25,mp:25},stack:true,sell:20},
  rope:                {id:'rope',                 name:'Hemp Rope',             type:'key',    icon:'🪢', desc:'50 feet. Required for roughly half of all adventures.',   sell:5  },
  torch:               {id:'torch',                name:'Torch',                 type:'key',    icon:'🔦', desc:'Light and fire. Sometimes both are the same.',            sell:3  },
  ancient_key:         {id:'ancient_key',          name:'Ancient Key',           type:'key',    icon:'🗝',  desc:'Bronze with builder runes. Opens something long forgotten.', sell:0},
  wolf_fang:           {id:'wolf_fang',            name:'Alpha Wolf Fang',       type:'key',    icon:'🦷', desc:'From the wolf you spared. It stays warm.',                sell:5  },
  map_fragment:        {id:'map_fragment',         name:'Ancient Map Fragment',  type:'key',    icon:'📜', desc:'Shows a path through Dragon\'s Spine Citadel.',            sell:0  },
  cogwheel_key:        {id:'cogwheel_key',         name:'Cogwheel Key',          type:'key',    icon:'⚙',  desc:'Mechanical key for the Bastion\'s inner chambers.',       sell:0  },
  signet_ring:         {id:'signet_ring',          name:'Royal Signet Ring',     type:'key',    icon:'💍', desc:"The regent's seal. Opens the throne room vault.",          sell:0  },
  realmshard_shard:    {id:'realmshard_shard',     name:'Realmshard Shard',      type:'key',    icon:'💠', desc:'A fragment of the artifact itself. Vibrates with memory.', sell:0  },
};

const CLASSES = {
  warden: {
    id:'warden', name:'Warden', icon:'🌿',
    desc:'High HP and defense. Nature abilities heal and protect. Best for beginners.',
    lore:'Guardian of wild places. Tough as bark, patient as roots.',
    startStats:{maxHp:120,maxMp:40,attack:12,defense:15,luck:8},
    startEquip:{weapon:'oak_branch',armor:'leather_tunic'},
    startItems:[{id:'health_potion',qty:2},{id:'rope',qty:1}],
    skills:[
      {id:'barkskin',      name:'Barkskin',       icon:'🌿',desc:'+6 DEF for 3 turns.',    mpCost:10,effect:{type:'buff_def',val:6,dur:3}},
      {id:'natures_wrath', name:"Nature's Wrath", icon:'🌪', desc:'Deal 150% ATK damage.', mpCost:15,effect:{type:'damage',mult:1.5}},
      {id:'regenerate',    name:'Regenerate',      icon:'♻', desc:'Restore 25% max HP.',   mpCost:20,effect:{type:'heal_pct',pct:0.25}},
    ],
    statPerLevel:{hp:12,mp:3,attack:2,defense:3,luck:1},
  },
  spellblade: {
    id:'spellblade', name:'Spellblade', icon:'✨',
    desc:'Balanced stats and high MP. Magic damage ignores some defense.',
    lore:'Where steel ends and sorcery begins.',
    startStats:{maxHp:90,maxMp:80,attack:15,defense:10,luck:10},
    startEquip:{weapon:'rusty_sword',armor:'leather_tunic'},
    startItems:[{id:'mana_elixir',qty:2},{id:'health_potion',qty:1}],
    skills:[
      {id:'arcane_strike',name:'Arcane Strike',icon:'✨',desc:'170% ATK, pierces 30% DEF.',mpCost:12,effect:{type:'damage',mult:1.7,pen:0.3}},
      {id:'mana_surge',   name:'Mana Surge',   icon:'⚡',desc:'200% ATK damage.',           mpCost:20,effect:{type:'damage',mult:2.0}},
      {id:'spellshield',  name:'Spellshield',  icon:'🔵',desc:'Block up to 35 damage.',      mpCost:15,effect:{type:'shield',val:35}},
    ],
    statPerLevel:{hp:8,mp:8,attack:3,defense:2,luck:2},
  },
  trickster: {
    id:'trickster', name:'Trickster', icon:'🎭',
    desc:'High luck means frequent crits. Fragile but unpredictable and lucrative.',
    lore:"They'll call it cheating. You'll call it winning.",
    startStats:{maxHp:80,maxMp:60,attack:14,defense:8,luck:18},
    startEquip:{weapon:'dagger_wit',armor:'leather_tunic'},
    startItems:[{id:'health_potion',qty:1},{id:'antidote',qty:2},{id:'torch',qty:1}],
    skills:[
      {id:'backstab',  name:'Backstab',  icon:'🗡', desc:'200% ATK on first action.',  mpCost:10,effect:{type:'damage',mult:2.0,firstStrike:true}},
      {id:'smoke_bomb',name:'Smoke Bomb',icon:'💨',desc:'70% dodge chance next hit.',   mpCost:8, effect:{type:'dodge',chance:0.7}},
      {id:'rummage',   name:'Rummage',   icon:'👜',desc:'Steal gold mid-fight.',        mpCost:5, effect:{type:'steal'}},
    ],
    statPerLevel:{hp:7,mp:6,attack:3,defense:1,luck:3},
  },
};

const CHAPTERS = [
  {id:1,name:'Whispering Woods',      icon:'🌲',color:'#1a3a1a',desc:"Ancient forest where the trees remember everything — and gossip accordingly."},
  {id:2,name:'Sunken Ruins',          icon:'🌊',color:'#0a2030',desc:"A civilization drowned itself rather than face what it created. You're here to find out why."},
  {id:3,name:'Ember Wastes',          icon:'🔥',color:'#3a1505',desc:"The Cinderking's domain. Bring water. There is no water."},
  {id:4,name:'Frostspire Peaks',      icon:'❄', color:'#0a1a30',desc:"The mountains care nothing for your ambitions or your survival."},
  {id:5,name:'Shadowfen Marsh',       icon:'🌑',color:'#150a25',desc:"Everything in the marsh is an illusion. Including, possibly, the marsh."},
  {id:6,name:'Clockwork Bastion',     icon:'⚙', color:'#251a05',desc:"Built to run forever. Which means doing whatever it was built to do, forever."},
  {id:7,name:'The Hollow Court',      icon:'👑',color:'#200a20',desc:"The throne is occupied. The king is not who he claims. Nobody agrees on which is more dangerous."},
  {id:8,name:"Dragon's Spine Citadel",icon:'🐉',color:'#200505',desc:"The origin of the Realmshard. Whatever you find there, you cannot leave the same."},
];

// ─────────────────────────────────────────
//  LEVEL DATA  (85 levels: 80 main + 5 secret)
//  type: 'narrative' | 'combat' | 'puzzle' | 'boss'
//  choices[].condition: null | {type:'flag'|'item'|'stat'|'class', key, min}
//  outcomes: {text, hp, mp, xp, gold, items[], removeItems[], flags[], nextLevel}
// ─────────────────────────────────────────
const LEVELS = [

// ╔══════════════════════════════════════╗
// ║  CHAPTER 1 — WHISPERING WOODS        ║
// ╚══════════════════════════════════════╝

{id:1,chapter:1,title:"The Forest's Edge",type:'narrative',icon:'🌲',
 flavor:"Where every journey earns its first scar.",
 text:`The village of Ashveil sits three days behind you, its lanterns swallowed by pines. Before you stretches the Whispering Woods — named, you suspect, by someone who'd never actually visited. The trees don't whisper. They creak, groan, and emit sounds that resemble laughter at inconvenient moments.

A weathered signpost leans at the entrance, pointing toward Thornhaven deeper within. Someone has carved a second message below the official lettering: "TURN BACK." Fresh ink. They didn't sign it.

The path splits immediately: a wide main trail with wagon ruts and wolf tracks, a narrower side path fragrant with wildflowers, and the signpost itself — which looks like it might be hiding something.`,
 choices:[
  {text:"Take the wide main trail — wolves be damned",
   outcome:{text:"You find a half-buried chest under exposed roots. A previous traveler's shortsword, your gain.",xp:15,gold:5,items:['rusty_sword']}},
  {text:"Follow the narrow flower-lined path",
   outcome:{text:"A sheltered camp, recently abandoned in haste. A health potion sits by a cold fire. Someone left quickly.",xp:10,items:['health_potion']}},
  {text:"Examine the signpost's strange grain markings",
   outcome:{text:`The carving is this morning's work. A hidden compartment holds a folded note: "The Realmshard wakes. Trust no one who smiles too easily." You memorize every word.`,xp:20,flags:['noticed_warning']}},
 ]},

{id:2,chapter:1,title:"Aldric's Warning",type:'narrative',icon:'🏚',
 flavor:"The wizard who survived by not being brave.",
 text:`A hut has grown into the forest rather than been built in it. Roots form the walls, branches the roof, and furniture appears to be arguing with the architecture. An old man watches you approach with the expression of someone who has expected bad news for a very long time.

"You've got the look," he says. "The one that means trouble's arriving and brought you along as luggage."

His name is Aldric — former court wizard, current exile, and apparent expert on everything you'd prefer wasn't true. He speaks of the Realmshard: an artifact buried in Dragon's Spine Citadel that once shattered the old world and is now, by his calculations, preparing to shatter this one. He'd stop it himself, but a previous attempt removed several fingers and most of his ambition.`,
 choices:[
  {text:"Ask about the Realmshard's power",
   outcome:{text:`"It doesn't create or destroy," Aldric says. "It remembers. And what it remembers, it rebuilds — whether or not the world wants to return to that." He hands you a map fragment.`,xp:20,items:['map_fragment']}},
  {text:"Ask what dangers lie ahead in the forest",
   outcome:{text:`"The Verdant Sentinel guards the far end. Ancient tree-thing, territorial, annoying in all the ways a seventy-foot ambulatory oak can be. Also goblins. Mundane, stupid, numerous. The usual."`,xp:15,flags:['warned_forest']}},
  {text:"Accept his offer of provisions",
   outcome:{text:`He disappears inside and returns with a worn satchel. "I was saving this for someone worth saving," he says. "Don't make me regret the assessment." Inside: a health potion and coins.`,xp:10,gold:10,items:['health_potion']}},
 ]},

{id:3,chapter:1,title:"Goblin Scout",type:'combat',icon:'👺',
 flavor:"Your first fight is always the most educational.",
 preText:`A goblin drops from the branches directly in front of you. It's wearing someone else's hat, holding a rusty dagger, and grinning with the confidence of something that has survived exactly this long through sheer luck. It doesn't appear to be reconsidering.`,
 postText:`The goblin sprawls in the leaf litter, hat askew. It had more in its pockets than you expected, which says something either about goblins or about the previous people it robbed.`,
 enemy:{name:"Goblin Scout",desc:"Overconfident, underqualified, and wearing someone else's hat.",icon:"👺",
        hp:35,attack:9,defense:2,xp:28,gold:10,
        skills:[
          {name:"Dirty Throw",    type:'basic',    chance:0.4,cooldown:0},
          {name:"Coward's Bite",  type:'heavy',    chance:0.25,cooldown:3},
          {name:"Screech",        type:'stun',     chance:0.2,cooldown:4},
        ],
        loot:[{id:'rusty_sword',chance:0.4},{id:'health_potion',chance:0.5}]}},

{id:4,chapter:1,title:"The Mossy Fork",type:'puzzle',icon:'🍄',
 flavor:"Every path has a cost. This one has two.",
 text:`The trail splits at a mossy standing stone covered in faded carvings. Left winds upward through ancient oaks — you can hear running water and, distantly, something singing. Right descends through dense fern toward what smells like a campfire. Straight ahead, the standing stone itself has a hollow at its base large enough to reach into.

A crude map scratched into the stone surface suggests the left path leads to a druid site, the right to a logging camp. The hollow might just be a hollow — or it might not.`,
 hint:"The standing stone is older than the paths. Older things often know more.",
 choices:[
  {text:"Take the left path toward the singing",
   outcome:{text:"You reach a druid circle at sunrise. The stones hum. A wooden bowl holds a druid charm, left as offering for any traveler worthy of it.",xp:20,items:['druid_charm'],flags:['knows_druid_path']}},
  {text:"Take the right path toward the campfire",
   outcome:{text:"A logging camp, abandoned mid-shift. The workers left their gear but not their valuables. You find coins in an upturned boot and iron rations on the table.",xp:15,gold:18}},
  {text:"Reach into the stone hollow",
   outcome:{text:"Something cold and smooth meets your fingers. A brass key, ancient, engraved with builder runes. It has waited here a very long time.",xp:25,items:['ancient_key'],flags:['found_key']}},
 ]},

{id:5,chapter:1,title:"The Druid's Circle",type:'narrative',icon:'🌿',
 flavor:"Old things ask for small things. The cost is usually remembrance.",
 text:`Nine standing stones form a perfect circle in a clearing where sunlight falls differently — warmer, slower, as though reluctant to leave. Carved spirals connect them at their bases. At the center, a flat altar stone holds three shallow bowls: one empty, one containing ash, one containing fresh wildflowers.

You feel watched, though nothing is visible. The forest goes quiet in a way that feels respectful rather than threatening. Something here is very old, and unlike most old things, it still has opinions.`,
 choices:[
  {text:"Leave something of value in the empty bowl",
   outcome:{text:"You place a coin. The bowl's interior briefly glows amber. Later you notice your steps are lighter, your senses sharper. The forest approved.",xp:25,gold:-5,flags:['performed_ritual'],hp:10}},
  {text:"Study the spiral carvings in detail",
   outcome:{text:"Hours pass without you noticing. The spirals are a language — one you can't quite read but somehow partially understand. You feel wiser. And slightly dizzy.",xp:30,mp:10}},
  {text:"Disturb nothing and observe",
   outcome:{text:"Restraint is its own wisdom. The circle seems to approve of your patience. A gentle warmth follows you out of the clearing, lingering on your shoulders like sunlight.",xp:20,flags:['respected_circle']}},
 ]},

{id:6,chapter:1,title:"Pack Attack",type:'combat',icon:'🐺',
 flavor:"The forest's first real test of your survival.",
 preText:`Three thornback wolves emerge from the undergrowth with coordinated silence that suggests this isn't their first ambush. The alpha is larger than the others, its grey fur matted with old scars. It's watching you with an intelligence that's frankly unsettling in something with that many teeth.`,
 postText:`The two younger wolves have retreated into the trees. The alpha remains, hurt but upright, watching you with something that isn't quite surrender. The decision of what to do next is yours.`,
 enemy:{name:"Thornback Wolf Pack",desc:"Grey fur, scarred veterans, unnervingly coordinated.",icon:"🐺",
        hp:55,attack:13,defense:4,xp:40,gold:6,
        skills:[
          {name:"Pack Slash",    type:'multi',  chance:0.35,cooldown:0},
          {name:"Alpha Howl",    type:'buff_atk',chance:0.2,cooldown:4},
          {name:"Throat Strike", type:'heavy',  chance:0.25,cooldown:3},
        ],
        loot:[{id:'wolf_fang',chance:0.6},{id:'health_potion',chance:0.3}]},
 postChoices:[
  {text:"Spare the alpha — its intelligence deserves respect",
   outcome:{text:"The alpha bows its massive head once, deliberate as a vow, and vanishes into the trees. You find a fang it left behind — still warm.",items:['wolf_fang'],flags:['spare_wolf'],xp:15}},
  {text:"Drive it off — the forest is safer without the pack",
   outcome:{text:"The wolf disappears into the undergrowth. You find a few coins scattered where the pack sheltered.",xp:10,gold:8}},
 ]},

{id:7,chapter:1,title:"The Hollow Tree",type:'narrative',icon:'🌳',
 flavor:"The oldest trees keep the oldest secrets.",
 text:`An ancient oak, its trunk wider than your arm-span, has a hollow at its base sealed with a flat stone. The stone has been moved recently — the disturbed soil is still fresh. Someone got here before you, or left something behind in a hurry.

Carved into the bark above the hollow is a rough symbol: a circle inside a triangle. Aldric mentioned this. It's the mark of the Builder civilization that collapsed three centuries ago. Whatever is inside this tree, it predates the current kingdom's entire history.`,
 choices:[
  {text:"Open the hollow and reach inside",
   outcome:{text:"A sealed bronze box. Inside: a key with builder runes — different from the one at the standing stone — and a folded parchment reading 'VAULT OF THE FIRST ARCHIVE. The key opens the second door.' This is significant.",xp:25,items:['ancient_key'],flags:['found_vault_key']}},
  {text:"Study the builder symbol and look for others",
   outcome:{text:"Three more symbols on nearby trees. Together they form directions — pointing deeper into the forest. You memorize them. This knowledge is worth more than most things.",xp:20,flags:['knows_builder_signs']}},
  {text:"Leave it sealed — some things are better undisturbed",
   outcome:{text:"A sound from within the hollow — something settling, as though satisfied. A small purse of coins drops from a branch above you. The forest rewards patience sometimes.",xp:15,gold:22}},
 ]},

{id:8,chapter:1,title:"The Fog Labyrinth",type:'puzzle',icon:'🌫',
 flavor:"The forest tests those who let it guide them.",
 text:`The fog rolls in between one step and the next. Within thirty paces, the trail has vanished. The trees press closer than they should. Sounds that were distant are now directly beside you. A light dances through the mist — there are several of them, in fact, and they appear to be disagreeing.

Three visible landmarks: a large mossy boulder to the north, a dark pool to the east reflecting no sky, and a dead tree shaped like a pointing hand. The fog is supernatural — you know this because it smells faintly of cinnamon, which no natural fog has ever done.`,
 hint:"The standing stone at the fork bore a spiral. Spirals go inward.",
 choices:[
  {text:"Follow the pointing hand tree — it's clearly indicating something",
   outcome:{text:"It indicates the way out. Forty paces beyond it, the fog clears completely. Sometimes the obvious answer isn't a trap.",xp:20}},
  {text:"Approach the dark pool and look at what it reflects",
   outcome:{text:"Not the sky. The path ahead — clear and true. You follow the pool's vision through the fog and emerge on the other side with a strange new clarity.",xp:25,flags:['fog_wisdom']}},
  {text:"Stand still and wait — supernatural fog must thin eventually",
   outcome:{text:"It doesn't thin. But you remain patient long enough for the dancing lights to grow curious and approach. They guide you out in exchange for a coin, which they immediately lose interest in.",xp:15,gold:-2}},
 ]},

{id:9,chapter:1,title:"Greater Forest Spirit",type:'combat',icon:'🌀',
 flavor:"The forest's will made manifest. It has grievances.",
 preText:`The air thickens. Roots rise from the ground and form something vaguely humanoid — twelve feet tall, composed of living wood and old anger. A greater forest spirit, called into being by some disturbance deeper in the wood. It doesn't appear interested in negotiation. Then again, forest spirits rarely are.`,
 postText:`The spirit unravels, roots retreating into the soil. The forest exhales. Whatever disturbed it was disturbed enough to send its guardian outward — which means something significant is waiting at the forest's heart.`,
 enemy:{name:"Greater Forest Spirit",desc:"Twelve feet of living wood and accumulated grievances.",icon:"🌀",
        hp:85,attack:16,defense:7,xp:65,gold:20,
        skills:[
          {name:"Root Slam",      type:'heavy',  chance:0.35,cooldown:2},
          {name:"Thorn Barrage",  type:'multi',  chance:0.3, cooldown:3},
          {name:"Root Entangle",  type:'stun',   chance:0.2, cooldown:4},
          {name:"Bark Renewal",   type:'heal',   chance:0.15,cooldown:5},
        ],
        loot:[{id:'druid_charm',chance:0.5},{id:'health_potion',chance:0.6}]}},

{id:10,chapter:1,title:"The Verdant Sentinel",type:'boss',icon:'🌳',
 flavor:"Chapter 1 Boss — What the forest sends when it means business.",
 preText:`At the forest's edge, where the Whispering Woods end and the open road begins, stands something that makes all previous encounters seem like polite introductions. The Verdant Sentinel is ancient beyond reckoning: a tree that walks, its bark carved with runes by hands that have been dust for three centuries. Its eyes — if the amber sap pooled in two hollow knots can be called eyes — regard you without expression.

Then it tears a root from the ground the size of a battering ram, and raises it.`,
 postText:`The Sentinel stills. The runes on its bark dim one by one, then glow softly gold. It lowers its root-arm and takes one deliberate step backward. Then it stands motionless. You have passed its test. The road to the Sunken Ruins stretches before you, and the forest releases you — reluctantly, you suspect — into the wider world.`,
 enemy:{name:"Verdant Sentinel",desc:"An ancient guardian tree. The forest's final word on travelers.",icon:"🌳",
        hp:180,attack:20,defense:10,xp:120,gold:35,isBoss:true,
        skills:[
          {name:"Root Shockwave",  type:'heavy',  chance:0.35,cooldown:2},
          {name:"Branch Barrage",  type:'multi',  chance:0.25,cooldown:3},
          {name:"Entangle",        type:'stun',   chance:0.2, cooldown:4},
          {name:"Bark Armor",      type:'buff_def',chance:0.15,cooldown:5},
          {name:"Sap Spray",       type:'poison', chance:0.2, cooldown:3},
        ],
        loot:[{id:'druid_charm',chance:0.8},{id:'greater_health',chance:0.7}]},
 unlocks:[11]},

// ╔══════════════════════════════════════╗
// ║  CHAPTER 2 — SUNKEN RUINS            ║
// ╚══════════════════════════════════════╝

{id:11,chapter:2,title:"The Sunken Shore",type:'narrative',icon:'🌊',
 flavor:"Every ruin was someone's home.",
 text:`The coast appears without warning: a cliff edge, and below it, a bay where a city drowned. Towers still stand, submerged to their spires. Plazas and bridges shimmer in the green water. Three centuries ago, according to what little history survives, the Builders sealed their own city beneath the sea rather than let something escape it.

A rickety dock leads down the cliff face. At its base, a flat-bottomed boat rocks on the water. The boat is old but sound. The water around it is so clear you can see a cobblestone street thirty feet below the surface, and on it, what looks like a door that's been propped open from the inside.`,
 choices:[
  {text:"Examine the boat and prepare to row in",
   outcome:{text:"A sealed oilskin bag under the rowing bench holds two health potions and a crude map of the upper ruins. Whoever left it here planned to come back. They didn't.",xp:20,items:['health_potion','health_potion']}},
  {text:"Study the city layout from the cliff edge",
   outcome:{text:"You identify three structures: a library, an archive, and what appears to be a mechanical control center — the Builder equivalent of a city hall, run on gears instead of bureaucracy.",xp:25,flags:['mapped_ruins']}},
  {text:"Investigate that open door on the seafloor",
   outcome:{text:"You dive. The door leads to a dry chamber — an airlock, the Builders called them. Inside: a bronze disc inscribed with the ruins' floor plan. Extraordinarily useful. Also wet.",xp:30,gold:15,flags:['found_airlock']}},
 ]},

{id:12,chapter:2,title:"The Waterlock",type:'puzzle',icon:'⚙',
 flavor:"Builder technology: elegant, ancient, and currently flooded.",
 text:`The main entrance to the ruins is a vast chamber half-filled with water. Three rusted levers protrude from a control panel on a dry platform. A drainage grate is visible on the far wall, submerged, with chains leading upward to ceiling-mounted gears. The Builders were fastidious engineers. Their mechanisms still work after three centuries — just not necessarily as intended.

Carved instructions above the panel read: "DRAIN: Lower, Upper, Lower" but someone has scratched through the word "Lower" in the second position and replaced it with "Upper" in a different hand.`,
 hint:"Trust the carving. Distrust the amendment.",
 choices:[
  {text:"Follow the original inscription: Lower, Upper, Lower",
   outcome:{text:"The gears grind, catch, and spin. Water surges into the grate. The chamber drains in minutes. The original engineers were apparently correct.",xp:25}},
  {text:"Follow the amendment: Lower, Upper, Upper",
   outcome:{text:"One mechanism catches correctly; the other jams. The chamber drains partially — enough to pass, but it takes longer and you arrive at the next chamber soaked to the knee.",xp:15,hp:-8}},
  {text:"Bypass the levers and swim through directly",
   outcome:{text:"Cold and unpleasant but direct. You surface on the far side dripping, but also clutching a bronze disc you found on the submerged floor. Worth it.",xp:20,gold:20}},
 ]},

{id:13,chapter:2,title:"Coral Crawlers",type:'combat',icon:'🦀',
 flavor:"Three centuries of evolution in a sealed, flooded environment.",
 preText:`The flooded corridor ahead is alive — literally. Creatures that began as ordinary crabs three centuries ago have adapted to the dark and the cold in interesting ways. They're larger, paler, and have developed a taste for anything warm-blooded. They click their oversized claws in a rhythm that either signifies communication or enthusiasm. You're betting on enthusiasm.`,
 postText:`Pale shells crack against the stonework. The corridor falls silent except for dripping. You make a mental note that everything in this ruin has evolved to fill a vacancy, and the vacancy it's filling is "apex predator of sealed flooded crypts."`,
 enemy:{name:"Coral Crawler Swarm",desc:"Pale, large, and disturbingly coordinated for crustaceans.",icon:"🦀",
        hp:65,attack:14,defense:6,xp:45,gold:12,
        skills:[
          {name:"Claw Pinch",    type:'heavy',  chance:0.35,cooldown:2},
          {name:"Swarm Strike",  type:'multi',  chance:0.3, cooldown:3},
          {name:"Venom Spray",   type:'poison', chance:0.25,cooldown:4},
        ],
        loot:[{id:'antidote',chance:0.6},{id:'health_potion',chance:0.4}]}},

{id:14,chapter:2,title:"The Rising Chamber",type:'puzzle',icon:'💧',
 flavor:"The Builders had a fine appreciation for consequences.",
 text:`You step into a circular chamber and the door seals behind you. Water immediately begins rising through floor grates at an alarming rate — two inches per minute, which you estimate gives you roughly eight minutes before the situation becomes irreversible.

The chamber has three exits: a locked door to the north (you can see the keyhole but not the key), a ventilation shaft in the ceiling (reachable by climbing the decorative pillar, if the pillar holds), and a pressure valve on the east wall (turning it seems to redirect the water somewhere, though where is unclear).`,
 hint:"Pressure goes somewhere. Water follows pressure.",
 choices:[
  {text:"Climb the pillar to reach the ceiling shaft",
   outcome:{text:"The pillar holds. The shaft is tight but passable. You emerge in a storage room above — dry, dusty, and stocked with ancient preserved rations that are only somewhat terrifying.",xp:30,gold:15}},
  {text:"Turn the pressure valve on the east wall",
   outcome:{text:"The water redirects into a hidden tank, which pressurizes an adjacent mechanism, which pops the north door open. Builder engineering: solving one problem through an unnecessarily elaborate chain of three others.",xp:25}},
  {text:"Search the chamber for the north door key",
   outcome:{text:"It's under the grate, of course. You retrieve it with three minutes to spare, which isn't as comfortable as you'd prefer but is technically sufficient.",xp:20,hp:-12}},
 ]},

{id:15,chapter:2,title:"Builder Echoes",type:'narrative',icon:'👻',
 flavor:"The dead have opinions. The very old dead have lectures.",
 text:`In a dry antechamber, the walls begin to glow. Not with magic exactly — with information. The Builders embedded memory crystals into the stone. What they recorded plays now like a conversation you weren't invited to but cannot leave.

Two figures, translucent and slightly too tall, discuss something in urgent tones. The translation stones nearby render their speech: "The Realmshard must not be allowed to fully consolidate. We built the Citadel to contain it, not to destroy it — destruction would release everything it has absorbed." The other figure: "We've run out of time. Seal the city. Seal everything." A long pause. "Everything includes us."

They never finish the argument. The crystals go dark.`,
 choices:[
  {text:"Record everything you heard in your journal",
   outcome:{text:"You write quickly. The implications settle over you slowly: the Builders didn't fail to stop the Realmshard. They chose to die containing it. Something has changed that containment.",xp:35,flags:['knows_builder_sacrifice']}},
  {text:"Search for more memory crystals in adjacent rooms",
   outcome:{text:"You find three more — earlier recordings, showing the Builders at work. In one, they're laughing. The contrast with the final memory is difficult to sit with.",xp:25,gold:20,flags:['found_crystals']}},
  {text:"Attempt to communicate with the echo",
   outcome:{text:"It doesn't respond. But as you speak, the crystals warm, and one ejects from the wall — a portable memory stone. It pulses when you hold it. Something is recorded inside that wasn't in the wall display.",xp:30,items:['map_fragment']}},
 ]},

{id:16,chapter:2,title:"The Stone Guardian",type:'combat',icon:'🗿',
 flavor:"Three centuries of waiting. It's been looking forward to this.",
 preText:`It stands in the archive doorway — a construct of fitted stone animated by Builder mechanisms. Clockwork joints and crystal eyes. It was placed here to guard the archive's contents. It has been standing here, guarding them, for three hundred years. It has, in the intervening centuries, developed no patience whatsoever for intruders.`,
 postText:`The crystal eyes dim. The mechanisms wind down with a sound like a very long sigh. The Stone Guardian collapses into pieces that are somehow still neatly arranged, as though even in defeat it couldn't bring itself to be disorderly.`,
 enemy:{name:"Stone Guardian",desc:"Builder-made. Three centuries old. Still functional. Improbably grumpy.",icon:"🗿",
        hp:90,attack:17,defense:10,xp:60,gold:25,
        skills:[
          {name:"Stone Fist",    type:'heavy',   chance:0.35,cooldown:2},
          {name:"Gear Grind",    type:'armor_break',chance:0.2,cooldown:4},
          {name:"Boulder Throw", type:'heavy',   chance:0.25,cooldown:3},
          {name:"Stone Skin",    type:'buff_def',chance:0.15,cooldown:5},
        ],
        loot:[{id:'health_potion',chance:0.5},{id:'chainmail',chance:0.3}]}},

{id:17,chapter:2,title:"The Sunken Library",type:'narrative',icon:'📚',
 flavor:"Three centuries of knowledge, preserved in spite of everything.",
 text:`The library is dry. Impossibly, miraculously dry. The Builders waterproofed it with a mechanism that is still running — a soft hum beneath the floor where pumps work tirelessly in the dark. Thousands of books line the walls in airtight bronze cases. Scrolls in sealed glass tubes. Tablets of compressed memory crystal.

You have time to read perhaps three things before the Guardian's collapse triggers some kind of internal alarm and the room begins to seal.`,
 choices:[
  {text:"Read the Builders' account of the Realmshard's origin",
   outcome:{text:"The Realmshard wasn't created by the Builders. It predates them. They found it and built the Citadel around it as a prison. It had already absorbed seventeen civilizations.",xp:40,flags:['knows_realmshard_origin']}},
  {text:"Find their tactical notes on weakening the artifact",
   outcome:{text:"The Realmshard can only be weakened by gathering fragments of its original casing. There are eight shards scattered across the eight kingdoms. You know where one is.",xp:35,flags:['knows_weakness']}},
  {text:"Grab whatever books you can carry",
   outcome:{text:"You take three books at random. Later examination reveals: a Builder cookbook (genuinely excellent), a technical manual (incomprehensible), and a diary that mentions the Drowned Architect by name.",xp:25,gold:30,flags:['has_diary']}},
 ]},

{id:18,chapter:2,title:"The Weight Gate",type:'puzzle',icon:'⚖',
 flavor:"The Builders trusted physics more than locks.",
 text:`A massive gate blocks the passage to the final archive. Before it, a scale mechanism spans the corridor: two platforms, currently uneven. The right platform is weighted down with a stone block; the left is empty. A plaque reads: "BALANCE GRANTS PASSAGE." Simple enough, except the only available weights are: three bone-dry preserved fish (approximately two pounds each), a waterlogged tome (perhaps eight pounds), and your own pack.

The stone block appears to weigh roughly twenty-five pounds.`,
 hint:"You don't have to add weight. You can remove it.",
 choices:[
  {text:"Add the book and all three fish to the left platform",
   outcome:{text:"Fourteen pounds. Not enough. But the mechanism is old enough that the near-balance triggers a partial opening — just enough to squeeze through. The Builders didn't account for determination.",xp:20,hp:-5}},
  {text:"Remove the stone block from the right side",
   outcome:{text:"The platforms level at zero. The gate accepts this interpretation of 'balance' and opens completely. Sometimes the elegant solution is the correct one.",xp:30}},
  {text:"Place your pack on the left side and squeeze through the gap while the mechanism tests the weight",
   outcome:{text:"Your pack is exactly heavy enough to almost-balance. The gate lifts three feet and wavers. You roll through and retrieve your pack before it closes. You were not, in the end, crushed.",xp:25,gold:15}},
 ]},

{id:19,chapter:2,title:"The Final Archive",type:'narrative',icon:'🗺',
 flavor:"What the Builders sealed away. What they wouldn't.",
 text:`The innermost archive is a single room with a single item: a map, twelve feet across, covering the entirety of the known world as it existed three centuries ago. Kingdoms that no longer exist. Cities that have been renamed. And at the center, connected to every major settlement by red lines like a spider's web, the Dragon's Spine Citadel, marked with a symbol you now recognize.

The symbol of the Realmshard. But drawn differently than you've seen before — with eight points instead of seven. And at each point, a smaller mark: the location of one of its eight fragments.

You have been to none of these locations. You are going to all of them.`,
 choices:[
  {text:"Copy the map as accurately as you can",
   outcome:{text:"Your hands work fast. The copy isn't perfect but the eight fragment locations are clearly marked. This is perhaps the most important document you'll ever personally transcribe.",xp:45,items:['map_fragment'],flags:['has_full_map']}},
  {text:"Look for a way to take the original",
   outcome:{text:"The map is somehow fused to the table. But the table has a drawer, and the drawer contains something small and cold: a shard of glowing blue crystal. A Realmshard fragment. The first one.",xp:50,gold:25,items:['realmshard_shard'],flags:['found_first_shard']}},
  {text:"Study the red connection lines to understand the pattern",
   outcome:{text:"The lines don't show trade routes. They show influence. The Realmshard's memory seeps outward through these connections — that's how civilizations fall. Not to war. To remembrance of a world that no longer exists.",xp:35,flags:['understands_pattern']}},
 ]},

{id:20,chapter:2,title:"The Drowned Architect",type:'boss',icon:'👁',
 flavor:"Chapter 2 Boss — He built the cage. He never left it.",
 preText:`The deepest chamber fills with cold water and memory simultaneously. He coalesces from both: the Drowned Architect, who sealed this city three centuries ago and never had the opportunity to leave it. He wears his original clothes. His expression is that of someone who has spent three hundred years being very disappointed.

"Another one," he says. His voice sounds like water in pipes. "The Realmshard has been waking for six months. You are the seventeenth to come through my archive." He pauses. "The others didn't make it this far." He pauses again. "Fight me. If you survive, I'll tell you what I know."`,
 postText:`The Architect dissolves into the water, but his voice lingers: "The Citadel's eighth fragment is at its core. The Realmshard must be whole to be ended — either fully sealed or fully freed. Every shard you find brings both possibilities closer. Choose carefully which ending you're walking toward." The water recedes. The way out is clear.`,
 enemy:{name:"The Drowned Architect",desc:"Three centuries of regret, given form and water.",icon:"👁",
        hp:220,attack:21,defense:9,xp:150,gold:50,isBoss:true,
        skills:[
          {name:"Tidal Surge",    type:'heavy',   chance:0.3, cooldown:2},
          {name:"Flood Strike",   type:'multi',   chance:0.25,cooldown:3},
          {name:"Undertow Pull",  type:'stun',    chance:0.2, cooldown:4},
          {name:"Memory Drain",   type:'drain',   chance:0.2, cooldown:3},
          {name:"Water Renewal",  type:'heal',    chance:0.15,cooldown:5},
        ],
        loot:[{id:'coral_blade',chance:0.7},{id:'greater_health',chance:0.8}]},
 unlocks:[21]},

// ╔══════════════════════════════════════╗
// ║  CHAPTER 3 — EMBER WASTES            ║
// ╚══════════════════════════════════════╝

{id:21,chapter:3,title:"Into the Ashfield",type:'narrative',icon:'🔥',
 flavor:"It's not the heat that kills you. It's the attitude of everything that lives in the heat.",
 text:`The Ember Wastes announce themselves via smell before sight: sulfur, charcoal, and something you eventually identify as everything you liked about the previous regions being absent. The sky here is orange at noon. The ground is black volcanic glass that crunches like apologies underfoot.

A crumbling waypost at the border lists distances in a language you can almost read. The only word you're certain of is "DANGER," which appears three times. The other words might be warnings or might be helpful navigational notes. This ambiguity is not comforting.

Somewhere ahead, the Cinderking's fortress bleeds heat into the horizon like a second sun that is also on fire and angry about it.`,
 choices:[
  {text:"Follow the most traveled path — visible foot traffic suggests survivability",
   outcome:{text:"The path is clearly used. By things with large feet and an apparent disregard for caution. You follow it anyway and find a dead traveler's pack with useful supplies.",xp:20,items:['health_potion','antidote']}},
  {text:"Cut across the glass field for a more direct route",
   outcome:{text:"Efficient but unpleasant. The glass cuts through boot leather. You arrive faster but limping and considerably warmer than recommended.",xp:15,hp:-15,gold:20}},
  {text:"Look for signs of water — survival priority first",
   outcome:{text:"Smart. You find a thermal spring: lukewarm, sulphurous, and technically drinkable. It restores your vitality and your will to continue existing.",xp:25,hp:20}},
 ]},

{id:22,chapter:3,title:"Ember Sprites",type:'combat',icon:'🔥',
 flavor:"Fire elementals. Territorial. Extremely flammable.",
 preText:`Three ember sprites materialize from a lava vent's steam column — creatures of pure fire compressed into small, vaguely humanoid forms with entirely too much personality for something the size of a loaf of bread. They chitter at each other, apparently discussing the best approach. Then they attack simultaneously, which in retrospect was probably the conversation.`,
 postText:`The sprites dissipate into cooling embers. Their heat lingers on the surrounding rock. You note that actual fire is now less threatening to you than it was an hour ago, which is either experience or damage.`,
 enemy:{name:"Ember Sprite Trio",desc:"Small, fast, made of fire, and surprisingly tactical about it.",icon:"🔥",
        hp:60,attack:15,defense:4,xp:45,gold:14,
        skills:[
          {name:"Fire Spit",    type:'burn',  chance:0.4, cooldown:0},
          {name:"Surge Strike", type:'heavy', chance:0.25,cooldown:3},
          {name:"Scatter Flash",type:'multi', chance:0.3, cooldown:3},
        ],
        loot:[{id:'ember_stone',chance:0.6},{id:'health_potion',chance:0.35}]}},

{id:23,chapter:3,title:"The Merchant's Last Stand",type:'narrative',icon:'💀',
 flavor:"The Ember Wastes don't discriminate between travelers.",
 text:`You find him at the base of a cooling lava formation: a merchant, his cart intact, his goods still organized, his person no longer operational. The causes are multiple and volcanic. His manifest, tucked in his coat pocket, reads like optimism made paperwork: thirty pounds of preserved food, trade goods for the Cinderking's court, and personal items listed under "INSURANCE — DO NOT TOUCH."

The insurance items, in fact, look extremely touchable.

His cart also contains a lockbox, a rolled fire-resistance map, and a dog who is sitting on the cart's running board looking at you with the specific expression of a dog who has decided you'll do.`,
 choices:[
  {text:"Search the cart thoroughly and take what's useful",
   outcome:{text:"Ember guard armor, several vials, and coins. The dog watches you with approval. You take the dog's approval as ethical clearance.",xp:20,gold:35,items:['ember_guard']}},
  {text:"Take only the fire-resistance map — leave personal items",
   outcome:{text:"The map shows safe paths between lava vents. Genuinely useful. The dog nods at you. You're not sure dogs do that, but this one did.",xp:25,flags:['has_fire_map']}},
  {text:"Bury him properly — this feels wrong to loot",
   outcome:{text:"You dig. It takes an hour. When you finish, the cart is still there, and so is the dog, who has sat patiently through the whole process. In his collar is a pouch of emergency coins. Karma works in small ways.",xp:35,gold:25}},
 ]},

{id:24,chapter:3,title:"Lava Vent Crossing",type:'puzzle',icon:'🌋',
 flavor:"Timing is everything. Especially when the alternative is lava.",
 text:`The only path forward crosses a field of intermittent lava vents — forty vents in a hundred-foot stretch, each erupting on its own cycle. Some erupt every ten seconds. Some every thirty. One appears to be on a completely random schedule that is its own personal art project.

Three options present themselves: a rope bridge to the left (the bridge looks sturdy; the anchors look considerably less so), a series of timing markers scratched into the ground by previous travelers (partially obscured by ash), and a narrow ledge along the cliff face that avoids the vents entirely but requires significant balance.`,
 hint:"The ledge was made by someone. Someone made it because it was the safest route.",
 choices:[
  {text:"Follow the timing markers across the vent field",
   outcome:{text:"They're accurate for twenty-eight of the forty vents. The other twelve you navigate by instinct. You emerge slightly singed but largely intact.",xp:25,hp:-10}},
  {text:"Trust the rope bridge",
   outcome:{text:"The anchors hold through your crossing, which is more than could be said for the person who crossed before you — their pack is on the far side, contents spilled. You collect both the pack's contents and a lesson about anchor inspection.",xp:20,gold:28,hp:-5}},
  {text:"Take the narrow ledge path",
   outcome:{text:"Slow, careful, and entirely successful. You reach the far side without damage and with the satisfaction of having made the smart choice.",xp:30}},
 ]},

{id:25,chapter:3,title:"Salamander Brood",type:'combat',icon:'🦎',
 flavor:"Fire doesn't kill them. It just makes them faster.",
 preText:`A brood of volcanic salamanders — four feet long, crimson-scaled, and apparently capable of breathing fire as both offense and communication — has chosen this corridor as their den. The largest one, which appears to be in charge based purely on attitude, flares its neck frill at you. This is either a threat display or a greeting. Given the context, you're treating it as a threat display.`,
 postText:`The salamanders scatter into cracks in the volcanic rock. The largest one — the one with attitude — lingers long enough to give you a look that conveys something between "this isn't over" and "well-fought, primate." You prefer to think it was the second option.`,
 enemy:{name:"Salamander Brood",desc:"Fire-resistant, territorial, and intensely opinionated about personal space.",icon:"🦎",
        hp:80,attack:17,defense:6,xp:58,gold:18,
        skills:[
          {name:"Fire Breath",    type:'burn',  chance:0.4,cooldown:0},
          {name:"Lash Tail",      type:'heavy', chance:0.3,cooldown:2},
          {name:"Acid Spit",      type:'poison',chance:0.2,cooldown:3},
        ],
        loot:[{id:'ember_stone',chance:0.5},{id:'health_potion',chance:0.4}]}},

{id:26,chapter:3,title:"The Warlord's Camp",type:'narrative',icon:'⚔',
 flavor:"Everyone in the Ember Wastes is angry. Some of them organize.",
 text:`A war camp occupies the plateau — fifty tents, three hundred soldiers by rough count, and a banner bearing a crown wreathed in flames. The Ashen Vanguard, mercenaries who serve whoever is currently winning, which in the Ember Wastes means the Cinderking. They haven't spotted you yet. The question is what to do with that advantage.

A patrol of six circles the camp perimeter on a predictable cycle. The camp's stores are visible from your position — food, weapons, possibly useful maps. The commander's tent sits at the center, the only one with guards posted.`,
 choices:[
  {text:"Sneak through the camp perimeter to reach the commander's tent",
   outcome:{text:"You move between patrol cycles. The commander's maps are excellent. You also find orders revealing the Cinderking expects an assault from the south — useful intelligence.",xp:30,flags:['knows_vanguard_orders']}},
  {text:"Create a distraction and raid the supply stores",
   outcome:{text:"A well-placed torch to the empty livestock pen creates exactly the chaos you need. You emerge with food, supplies, and the slight guilt of someone who has definitely done this before.",xp:25,gold:40,items:['health_potion','health_potion']}},
  {text:"Walk in openly as a traveler and bluff your way through",
   condition:{type:'stat',key:'luck',min:14},
   outcome:{text:"It works absurdly well. You're invited to dinner, given a bed, and accidentally learn three military secrets before anyone thinks to question your story.",xp:40,gold:25,flags:['vanguard_ally']}},
  {text:"Avoid the camp entirely — stay along the cliff route",
   outcome:{text:"Safe, slow, and certain. You arrive at the next location without drama, which in this region counts as a meaningful achievement.",xp:20}},
 ]},

{id:27,chapter:3,title:"Flame Cultists",type:'combat',icon:'🕯',
 flavor:"They worship what would kill them. Enthusiastically.",
 preText:`The Cult of the Unending Flame has been active in the Ember Wastes for thirty years, which is impressive given the environment and the theology. Their priests wear red robes that shouldn't be flame-resistant but apparently are. Their leader gestures at you with a staff topped with a permanent flame that burns even here, which is already saying something. "The Cinderking has decreed all travelers must answer to the fire!" he announces. This seems to be going to be a "fight them" situation.`,
 postText:`The cultists flee into the vent fields — which is either very brave or a demonstration of their actual faith in the fire's protection. You choose not to find out which. Their remaining supplies, however, are yours.`,
 enemy:{name:"Flame Cult Warpriest",desc:"Red robes, fire staff, deeply committed to bad theology.",icon:"🕯",
        hp:88,attack:18,defense:7,xp:62,gold:22,
        skills:[
          {name:"Flame Strike",  type:'burn',   chance:0.4,cooldown:0},
          {name:"Holy Fire",     type:'heavy',  chance:0.3,cooldown:2},
          {name:"Zealot's Cry",  type:'buff_atk',chance:0.2,cooldown:4},
        ],
        loot:[{id:'ember_stone',chance:0.6},{id:'mana_elixir',chance:0.4}]}},

{id:28,chapter:3,title:"The Forge Ruins",type:'puzzle',icon:'🔨',
 flavor:"The Builders' forge. Still warm after three centuries.",
 text:`Deep in the wastes, you find a Builder forge that predates the Cinderking's entire civilization. The bellows still work. The anvil still rings. And there are materials here: raw iron, volcanic glass, a crucible of something blue and cold that contrasts oddly with everything around it.

Three workstations offer possibilities: a weapon forge, an armor-working station, and a crystal infusion bench where the blue material sits. You know basic smithing. The question is what to prioritize with the limited time the volcanic activity allows.`,
 hint:"The blue material is Builder-refined manaite. It improves anything it's combined with.",
 choices:[
  {text:"Use the weapon forge to improve your current weapon",
   outcome:{text:"You work quickly. Your weapon emerges with better balance, sharper edge, a slight blue glow. +4 attack permanently, no material cost. The forge approved.",xp:35,flags:['upgraded_weapon']}},
  {text:"Use the armor station with the manaite to reinforce your armor",
   outcome:{text:"The blue material bonds to metal in unexpected ways. Your armor fits better, distributes impact differently. +3 defense permanently. The Builders knew something about metallurgy.",xp:35,flags:['upgraded_armor']}},
  {text:"Take the manaite crucible for later use",
   outcome:{text:"The crucible seals itself when you pick it up. Whatever's inside stays cold. This will be useful somewhere where you have more time to work with it.",xp:25,gold:30,items:['frost_crystal','frost_crystal']}},
 ]},

{id:29,chapter:3,title:"The Ash Witch",type:'narrative',icon:'🧙',
 flavor:"She chose the Wastes. The Wastes chose her back.",
 text:`She sits cross-legged on a cooled lava flow, surrounded by dozens of small clay figures arranged in patterns. Her grey robes blend with the ash. Her eyes, when she opens them, reflect no light at all. She introduces herself as Zara, and says she's been waiting for someone heading toward the Cinderking's fortress.

"I can help you," she says, "or I can stop you. I haven't decided which, which is why you're still standing." She tells you she knows a way into the fortress that avoids the main gate. She also knows what the Cinderking has done to the Realmshard fragment he holds, and it frightens her — which, she notes, should frighten you considerably more.`,
 choices:[
  {text:"Accept her help and offer honesty about your mission",
   outcome:{text:`"Good enough," she says. She draws a map of the fortress's east side in the ash. "The fragment is in the central chamber. He's been feeding it the region's pain. It's learning something it shouldn't." She gives you a frost crystal.`,xp:40,items:['frost_crystal'],flags:['zara_ally']}},
  {text:"Ask her price before agreeing to anything",
   outcome:{text:`"Information," she says. "About what you find in the Citadel. I've been looking for someone to send as eyes I can trust. That someone is apparently you." Fair trade. You agree.`,xp:30,flags:['zara_deal']}},
  {text:"Decline — a stranger in the Ember Wastes is probably not trustworthy",
   outcome:{text:"She nods as though she expected this. \"You'll survive anyway,\" she says. \"You have the face for it.\" She lets you pass without further incident. Her figures continue their inscrutable arrangement in the ash.",xp:20}},
 ]},

{id:30,chapter:3,title:"Cinderking Morax",type:'boss',icon:'👑',
 flavor:"Chapter 3 Boss — He burned himself to hold more fire.",
 preText:`The throne room of Morax, Cinderking and self-declared Lord of the Ember Wastes, is a chamber of black glass and permanent fire. He stands from his throne as you enter — eight feet tall, his body partially transmuted by prolonged exposure to volcanic magic, his crown fused to his skull in a way that is either voluntary or no longer matters. His first words: "You have come for the Shard. Every tenth person who reaches me has come for the Shard." He picks up his weapon, a blade of solid magma. "None of them have left with it."`,
 postText:`Morax falls to one knee, his magma cooling, his crown dimming. "I held it too long," he says, and you understand he's not talking about the fight. "It showed me a kingdom that burned with purpose rather than rage. It showed me what I could have been." He gestures to a alcove behind the throne. The Realmshard shard pulses there, waiting. "Take it. Don't become what it showed me."`,
 enemy:{name:"Cinderking Morax",desc:"Volcanic transmutation, permanent rage, crown fused to skull. The usual.",icon:"👑",
        hp:280,attack:24,defense:11,xp:180,gold:65,isBoss:true,
        skills:[
          {name:"Magma Slam",     type:'heavy',    chance:0.3,cooldown:2},
          {name:"Volcanic Burst", type:'multi',    chance:0.25,cooldown:3},
          {name:"Inferno Aura",   type:'burn',     chance:0.35,cooldown:0},
          {name:"Cinder Armor",   type:'buff_def', chance:0.15,cooldown:5},
          {name:"Meteor Strike",  type:'heavy',    chance:0.2,cooldown:4},
        ],
        loot:[{id:'ember_blade',chance:0.7},{id:'greater_health',chance:0.8}]},
 unlocks:[31]},

// ╔══════════════════════════════════════╗
// ║  CHAPTER 4 — FROSTSPIRE PEAKS        ║
// ╚══════════════════════════════════════╝

{id:31,chapter:4,title:"The Snowline",type:'narrative',icon:'❄',
 flavor:"The mountains began killing things long before you arrived.",
 text:`The Frostspire Peaks rise without preamble — one moment you're on the foothills road, the next you're standing at the snowline with the temperature having dropped fifteen degrees in two hundred meters. The mountains are beautiful in the way that things are beautiful when they have no need to care whether you survive them.

A ranger's outpost at the snowline is staffed by a single person who hands you a list of things you'll need for survival without being asked. The list is long. Your supplies are not. The ranger looks at your supplies, looks at the list, looks at you, and appears to recalculate your odds of survival in real time.`,
 choices:[
  {text:"Buy supplies from the outpost before continuing",
   outcome:{text:"The ranger's prices are fair and the quality is excellent. You leave with proper cold-weather rations and rope.", xp:20,gold:-20,items:['rope','health_potion']}},
  {text:"Ask the ranger for route advice",
   outcome:{text:"She gives you forty minutes of detailed information about the peaks. She also mentions the Pale Huntress — the apex predator of the upper ranges — with the tone of someone who has met her and still thinks about it.",xp:25,flags:['ranger_briefed']}},
  {text:"Head up immediately — you've survived worse",
   outcome:{text:"Confidence is its own resource. You discover a cache of supplies left by a previous expedition twenty minutes up the trail. It contains everything you'd have bought from the ranger.",xp:20,items:['health_potion','rope']}},
 ]},

{id:32,chapter:4,title:"Supply Management",type:'puzzle',icon:'🎒',
 flavor:"The mountain will take what you didn't protect.",
 text:`A storm is coming — visible on the upper peaks, moving fast. You have two hours to reach the next shelter, and your supplies need to be organized. A pack animal you've hired to the snowline refuses to go further, meaning you must carry everything yourself. You cannot carry it all.

Inventory assessment: three days of rations, heavy climbing gear, your weapons and armor, a fur bedroll (heavy but necessary), a medical kit, and the various items you've collected. The shelter is uphill. The storm is faster than you.`,
 hint:"The fur bedroll weighs six pounds. So does overconfidence.",
 choices:[
  {text:"Keep everything and push hard — you're stronger than you look",
   outcome:{text:"You make it. Barely. The last quarter-mile you're carrying purely on stubbornness. You arrive at the shelter exhausted but intact, which is its own reward.",xp:20,hp:-20}},
  {text:"Cache the heaviest non-essential items and retrieve them later",
   outcome:{text:"Smart prioritization. You mark the cache, make the shelter with time to spare, and the storm hits you safely inside. The cache is exactly where you left it.",xp:35,gold:10}},
  {text:"Trade with a passing expedition for a lighter load",
   outcome:{text:"A descending expedition takes the heavy gear in exchange for trail-tested cold-weather armor worth considerably more.",xp:25,items:['frostweave']}},
 ]},

{id:33,chapter:4,title:"Frost Wolves",type:'combat',icon:'🐺',
 flavor:"The same species you faced in the forest. The mountains made them worse.",
 preText:`Frost wolves — cousins to the thornbacks of the Whispering Woods — are something the mountains made. Larger, paler, with ice-blue eyes and fur that actually insulates against cold attacks. They hunt in the white, which means you didn't see them until they were close enough to smell your warmth. Three of them, a coordinated family unit with an apparent plan.`,
 postText:`Two flee into the white. One remains standing, slightly smaller than the others, watching you with an expression that could be respect or re-evaluation. You notice it's wearing a collar — old leather, with a fang threaded onto it. If you have a wolf fang of your own, this seems meaningful.`,
 enemy:{name:"Frost Wolf Pack",desc:"Mountain-adapted. Cold-resistant. Terrifyingly coordinated.",icon:"🐺",
        hp:75,attack:18,defense:7,xp:55,gold:12,
        skills:[
          {name:"Ice Fang",      type:'freeze', chance:0.3,cooldown:3},
          {name:"Pack Strike",   type:'multi',  chance:0.35,cooldown:0},
          {name:"Winter Howl",   type:'heavy',  chance:0.25,cooldown:2},
        ],
        loot:[{id:'health_potion',chance:0.5},{id:'frost_crystal',chance:0.4}]}},

{id:34,chapter:4,title:"The Blizzard",type:'puzzle',icon:'🌨',
 flavor:"The mountain disagrees with your schedule.",
 text:`The blizzard arrives forty minutes ahead of the forecast. Visibility drops to three feet. Temperature drops to something the survival manual describes as "immediately dangerous." You have reached a crossroads in the worst possible moment: four paths, each vanishing into white within a dozen steps.

Your compass points north but north is not useful when you don't know which direction safety lies. A cairn to your left might be a trail marker. The sound of running water — which would mean a known stream — seems to come from the right. Straight ahead, there are tracks in the snow: large, clawed, and recent.`,
 hint:"Animals know where shelter is. The tracks lead somewhere they've been before.",
 choices:[
  {text:"Follow the animal tracks — they lead somewhere",
   outcome:{text:"A cave used by what appears to be a hibernating bear and, more usefully, by previous human explorers who left supplies. The bear sleeps through your presence. You sleep elsewhere in the cave, gratefully.",xp:30,items:['health_potion','frostweave']}},
  {text:"Follow the sound of water upstream — rivers lead to valleys",
   outcome:{text:"Correct logic. The stream leads to a valley, which contains a woodcutter's hut, which contains a woodcutter who is very surprised to have company but ultimately very hospitable.",xp:25,hp:15,gold:10}},
  {text:"Find the cairn and follow the official trail markers",
   outcome:{text:"There are twelve cairns after the first, each placed by someone methodical and thoughtful. You follow them to a ranger station, cold but alive, which is the relevant metric.",xp:20,hp:-10}},
 ]},

{id:35,chapter:4,title:"Mountain Bandits",type:'combat',icon:'🗡',
 flavor:"Crime doesn't stop for altitude.",
 preText:`Three figures drop from a rock ledge directly onto the path in front of you. Mountain bandits, by the look of them — heavy cold-weather gear, weapons that show signs of extended outdoor storage, and the practiced body language of people who have done this before. Their leader holds out an empty hand. "Toll," he says. That's not how toll collection works, but you don't imagine a grammar correction will help the situation.`,
 postText:`Two of the bandits run. The leader surrenders, which you accept in exchange for information: the Pale Huntress has been more active recently — "more aggressive, like something's spooked her from above." He says it like it's a bad sign. Given where you're heading, it probably is.`,
 enemy:{name:"Mountain Bandit Trio",desc:"Cold, desperate, and professionally organized about it.",icon:"🗡",
        hp:85,attack:19,defense:8,xp:60,gold:30,
        skills:[
          {name:"Ambush Strike", type:'heavy',  chance:0.35,cooldown:2},
          {name:"Flanking Cut",  type:'multi',  chance:0.3, cooldown:3},
          {name:"Intimidate",    type:'stun',   chance:0.2, cooldown:4},
        ],
        loot:[{id:'chainmail',chance:0.3},{id:'health_potion',chance:0.5},{id:'elixir_power',chance:0.3}]}},

{id:36,chapter:4,title:"The Ice Cave",type:'narrative',icon:'🧊',
 flavor:"Not every shelter is safe. This one is specifically unsafe and also very beautiful.",
 text:`The ice cave is a cathedral of frozen time. Suspended within the walls — preserved by the same cold that makes the location hazardous — are objects from centuries past: tools, weapons, a partial tapestry still vivid with color, and a person. The person is alive. This is surprising.

She introduces herself as Serana: an explorer who became lost three weeks ago and has been surviving on cave fish and determination. She's frostbitten but coherent, and she has been using her time productively — mapping the cave system, which, she tells you, extends all the way to the Pale Huntress's domain.`,
 choices:[
  {text:"Help Serana to safety and share your supplies",
   outcome:{text:"She recovers enough to walk with assistance. In return, she gives you her cave map and, more valuably, notes on the Pale Huntress's patrol patterns.",xp:40,gold:-10,flags:['serana_helped'],hp:-5}},
  {text:"Give her supplies and the direction to the ranger station",
   outcome:{text:"She takes your supplies with gratitude. \"I'll leave a note at the station about the interior passages,\" she promises. Later you find the note, which saves you two hours of trial and error.",xp:30,items:['frost_crystal']}},
  {text:"Ask what she found inside before committing to anything",
   outcome:{text:"A Realmshard resonance point — a location where the artifact's influence is strong. Something is drawing its attention to the peaks. This is information worth having.",xp:35,flags:['knows_resonance']}},
 ]},

{id:37,chapter:4,title:"Yeti's Domain",type:'combat',icon:'🏔',
 flavor:"Large, territorial, surprisingly well-adjusted about it.",
 preText:`The yeti doesn't ambush you. It stands in the path, visible at two hundred feet, and watches your approach with what you'd describe as professional assessment if the profession were "removing obstacles from my mountain." It's twelve feet tall, covered in white fur, and holds a tree it has apparently repurposed as a weapon. It makes a sound that the ranger described as "the vocal equivalent of a property boundary."`,
 postText:`The yeti sits down. This is apparently the yeti version of surrender, which you accept. It regards you with something that might be respect — you're the first thing it's fought recently that's still standing afterward. It moves aside, indicating the passage behind it. This was a test. You have apparently passed it. The mountain remains agnostic about the outcome.`,
 enemy:{name:"Mountain Yeti",desc:"Twelve feet. Ancient. Has been this mountain's apex predator for forty years.",icon:"🏔",
        hp:130,attack:22,defense:11,xp:85,gold:20,
        skills:[
          {name:"Tree Slam",     type:'heavy',   chance:0.35,cooldown:2},
          {name:"Blizzard Roar", type:'freeze',  chance:0.25,cooldown:4},
          {name:"Boulder Throw", type:'heavy',   chance:0.25,cooldown:3},
          {name:"Thick Hide",    type:'buff_def',chance:0.15,cooldown:5},
        ],
        loot:[{id:'greater_health',chance:0.5},{id:'frostweave',chance:0.4}]}},

{id:38,chapter:4,title:"The Frozen Village",type:'narrative',icon:'🏘',
 flavor:"They left. The question is whether they left or were left.",
 text:`The village of Caerholm sits preserved in ice exactly as it was the day it was abandoned — twenty years ago, according to records you found in the ranger's outpost. Table set for dinner. Forge still lit, the coals frozen mid-burn in a way that shouldn't be physically possible. Children's toys in the street. No bodies anywhere.

Everyone simply left. Or was removed. The distinction matters. A sealed vault in what was clearly the village hall holds documents. The ice around the vault's hinges has been broken recently — someone else has been here.`,
 choices:[
  {text:"Break open the vault and read the documents",
   outcome:{text:"The last entry: \"The Huntress speaks to us now. She says the Realmshard's fragment here is changing the cold. We must leave before we become part of its memory.\" The entire population walked out into the blizzard voluntarily.",xp:40,flags:['knows_village_truth']}},
  {text:"Search the houses for any survivors",
   outcome:{text:"Not survivors, but signs of recent return: a fire recently made in one house, supplies recently taken. Someone came back. Someone has been living here. You find their supply cache.",xp:30,items:['health_potion','greater_health'],gold:20}},
  {text:"Look for what was taken from the vault recently",
   outcome:{text:"Tracks in the frost lead to a hidden cellar. Inside: a journal from the village elder describing the Pale Huntress as 'not a predator but a guardian of the fragment she carries'.",xp:35,flags:['huntress_context']}},
 ]},

{id:39,chapter:4,title:"The Avalanche Path",type:'puzzle',icon:'🏔',
 flavor:"The mountain has one rule: don't wake it.",
 text:`The path to the Pale Huntress's domain crosses an avalanche field — a broad slope where the snow is unstable and every sound is a potential trigger. Markers from the rangers indicate three routes: a direct crossing (fastest, highest risk), a traversal path along the stable rock below the snowfield (slower but lower risk), and a series of jump-points from stable formation to stable formation (technical, requires precision).

A recent small avalanche has partly blocked the traversal path. The jump-points look exactly as stable as they need to be, which is to say, uncertain.`,
 hint:"The ranger markers are placed by people who survived this.",
 choices:[
  {text:"Cross directly and move as quickly as possible",
   outcome:{text:"Loud is bad. Fast is good. You make it across in two minutes of controlled panic, and the snow settles behind you like a held breath finally released.",xp:20,hp:-15}},
  {text:"Clear the traversal path blockage and take the safe route",
   outcome:{text:"It takes thirty minutes of careful work. The cleared path is then straightforward. Slow is smooth and smooth is alive, as the saying goes.",xp:30}},
  {text:"Navigate the jump-points — precision over speed",
   outcome:{text:"Seven jumps. You stick six of them perfectly. The seventh requires a recovery step that sends a small cascade of snow downhill, but you're across before the mountain decides to object.",xp:35,gold:15}},
 ]},

{id:40,chapter:4,title:"The Pale Huntress",type:'boss',icon:'🏹',
 flavor:"Chapter 4 Boss — She isn't hunting you. You're just in her way.",
 preText:`She's exactly what the ranger described: an archer of impossible precision who has lived in these peaks for longer than anyone knows, and who has incorporated the Realmshard's fragment into her bow in a way that should be impossible and has made her something other than human. She doesn't speak. She draws her bow. The arrow is made of ice and memory. You have about three seconds to decide what to do with them.`,
 postText:`The Huntress lowers her bow. For a moment, the cold recedes. "I was not hunting you," she says. "I was keeping you from the Citadel until you were ready. The fragment agrees." She removes the shard from her bow — it was one of the Realmshard's eight — and offers it without ceremony. "It's waking. All of them are waking. Whatever you're planning, move faster."`,
 enemy:{name:"The Pale Huntress",desc:"Ice-arrow archer, Realmshard fragment-bearer, effectively immortal.",icon:"🏹",
        hp:260,attack:23,defense:9,xp:175,gold:55,isBoss:true,
        skills:[
          {name:"Frost Arrow",    type:'freeze', chance:0.35,cooldown:2},
          {name:"Piercing Shot",  type:'heavy',  chance:0.3, cooldown:2},
          {name:"Ice Storm",      type:'multi',  chance:0.2, cooldown:4},
          {name:"Winter's Veil",  type:'dodge',  chance:0.15,cooldown:5},
          {name:"Killing Cold",   type:'heavy',  chance:0.25,cooldown:3},
        ],
        loot:[{id:'frost_fang',chance:0.7},{id:'greater_health',chance:0.8}]},
 unlocks:[41]},

// ╔══════════════════════════════════════╗
// ║  CHAPTER 5 — SHADOWFEN MARSH         ║
// ╚══════════════════════════════════════╝

{id:41,chapter:5,title:"The Dark Waters",type:'narrative',icon:'🌑',
 flavor:"The marsh doesn't hide things. It hides whether things are hidden.",
 text:`The Shadowfen Marsh begins where the light decides it has better things to do. Dense canopy, dark water, and a persistent mist that smells of old decisions and standing water. The path in is clearly marked on your map. The path on the ground is less cooperative — it branches, doubles back, and appears to have been laid out by someone with a philosophy rather than a destination.

Three figures move through the mist ahead: marsh folk, by the look of them. They split without apparent communication, one going left, one right, one directly forward — where your path continues. They haven't acknowledged you. That might mean you haven't been noticed. It might mean something else.`,
 choices:[
  {text:"Follow the one who went forward — your path is straight",
   outcome:{text:"They lead you to a dry platform above the water, lit with marsh-glass lanterns. When they turn around, they're smiling in a way that is extremely specific about being trustworthy.",xp:20,flags:['met_marsh_folk']}},
  {text:"Stay still and let them pass — observe before engaging",
   outcome:{text:"You watch all three from concealment. They regroup at a point they assumed you'd move through. They were setting a meeting, not a trap. You approach from a different angle and arrive first.",xp:30,flags:['knows_marsh_pattern']}},
  {text:"Call out — meeting in the open is better than guessing",
   outcome:{text:"They freeze. Then the nearest one says: \"You're not the one we were expecting.\" This is either good news or bad news depending on who they were expecting.",xp:25,gold:15,flags:['met_openly']}},
 ]},

{id:42,chapter:5,title:"The Marsh Elders",type:'narrative',icon:'🪔',
 flavor:"Hospitality in the marsh comes with conditions.",
 text:`The marsh folk village is built on stilts above the black water: a collection of platform-houses connected by rope bridges, lit by bioluminescent algae cultivated in hanging jars. The Elders — three of them, ancient and very specific in their opinions — receive you formally.

They know about the Realmshard. Everyone in the Shadowfen knows, they say. They've felt it in the marsh's behavior: the will-o'-wisps flying in patterns, the mimicry vines growing more aggressive, the bog serpents emerging at dawn rather than dusk. The marsh is responding to something. They want to know if you're the thing it's responding to.`,
 choices:[
  {text:"Tell them exactly who you are and why you're here",
   outcome:{text:"Trust is currency in the Shadowfen. They share everything they know about the marsh's behavior and the fragment they believe is hidden in Mirewitch Thessaly's domain.",xp:35,flags:['elders_trust']}},
  {text:"Be strategic — give them enough to earn help, not enough to create enemies",
   outcome:{text:"They appreciate the honesty about your caution. \"Most things in the marsh give us less,\" the eldest says. They give you a route map.",xp:25,items:['health_potion'],flags:['elders_partial']}},
  {text:"Ask what they want before telling them anything",
   outcome:{text:"\"Safe passage through the witch's domain,\" the eldest says. \"And news of the Realmshard's condition when you return, if you return.\" Fair trade.",xp:20,flags:['elders_deal']}},
 ]},

{id:43,chapter:5,title:"Bog Serpent",type:'combat',icon:'🐍',
 flavor:"The marsh doesn't announce what's in the water.",
 preText:`The crossing between platforms is thirty feet of rope bridge over black water. You're halfway across when the bridge shudders — not from your weight, but from something coiling around one of the support posts below. The bog serpent rises from the water without sound: fifteen feet of muscle, scales the color of dead leaves, and eyes that have been doing this since before the marsh had a name.`,
 postText:`The serpent retreats into the dark water, taking most of the bridge's south post with it. You make the remaining twenty feet of crossing with more urgency than aesthetics. The platform receives you as the bridge gives way entirely behind you. You note that the marsh appears unconcerned by this development.`,
 enemy:{name:"Bog Serpent",desc:"Fifteen feet. Ancient. The bridge never had a chance.",icon:"🐍",
        hp:95,attack:20,defense:8,xp:65,gold:18,
        skills:[
          {name:"Constrict",     type:'stun',   chance:0.3,cooldown:4},
          {name:"Venom Bite",    type:'poison', chance:0.35,cooldown:2},
          {name:"Tail Sweep",    type:'heavy',  chance:0.3, cooldown:3},
        ],
        loot:[{id:'antidote',chance:0.7},{id:'health_potion',chance:0.5}]}},

{id:44,chapter:5,title:"The False Path",type:'puzzle',icon:'🔮',
 flavor:"The Shadowfen's most reliable feature is deception.",
 text:`The path divides into five apparently identical routes, each marked with the same carved fish symbol that the marsh folk told you to follow. You remember there are only supposed to be three marked paths. Someone or something has added two false markers.

Clues available: the soil on two of the paths is damp from recent rain but shows no disturbed surface (foot-traffic would show in wet soil), one path's marker is newer than the others (different weathering), and the luminescent moss grows more densely along two of the five.`,
 hint:"Things that haven't been walked on stay even. Things that have been walked on don't.",
 choices:[
  {text:"Follow the two paths with undisturbed wet soil — they're the real ones",
   outcome:{text:"Correct. One leads directly to the next location. The other leads to a hidden cache of supplies left by the marsh folk as a test. You found both. They were impressed enough to leave a note.",xp:35,gold:25}},
  {text:"Follow the path with the oldest marker — most established route",
   outcome:{text:"Age doesn't guarantee correctness here, but the oldest path is indeed one of the real ones. You arrive at the next location without incident and with the satisfaction of applied logic.",xp:25}},
  {text:"Mark each path and test with small stones before committing",
   outcome:{text:"Methodical and effective. You spend ten minutes identifying both genuine paths by sound — the real ones echo differently over solid ground, the false ones over water.",xp:30,flags:['methodical_mind']}},
 ]},

{id:45,chapter:5,title:"The Smugglers",type:'narrative',icon:'⚖',
 flavor:"Everyone in the marsh has two jobs. The second one is never discussed.",
 text:`A barge anchored in a sheltered inlet is too well-maintained to be abandoned and too quiet to be legitimately occupied. When you investigate, four figures materialize from the cargo — smugglers, clearly, moving something from the Shadowfen to points north. Their leader is a woman named Petra who looks at you with the specific expression of someone calculating how much trouble you could create.

She tells you what they're carrying: marsh-glass, which is technically banned in three kingdoms due to its use in creating illusions. She doesn't ask for your silence. She asks if you want to know what they've seen in the deep marsh near Mirewitch Thessaly's territory.`,
 choices:[
  {text:"Take the information and let them continue — the trade isn't your business",
   outcome:{text:"She tells you: the witch has been reinforcing her domain's illusions. Something has made her paranoid. The marsh's center is protected by three layers of misdirection you'll need to penetrate.",xp:30,flags:['smuggler_info']}},
  {text:"Confiscate the marsh-glass and report the route",
   outcome:{text:"Petra accepts this with professional composure. The marsh-glass has other uses: you use one piece to create an illusion that bypasses a later obstacle.",xp:25,items:['frost_crystal','frost_crystal']}},
  {text:"Join them — offer to help unload in exchange for passage through the deep marsh",
   outcome:{text:"Two hours of physical labor and you're on the far side of the marsh with local expertise guiding you. Petra notes the Realmshard fragment here has been 'making the mist think for itself.' Useful.",xp:35,gold:20,flags:['smuggler_ally']}},
 ]},

{id:46,chapter:5,title:"Will-o-Wisps",type:'combat',icon:'✨',
 flavor:"Beautiful. Malevolent. Technically incorporeal, which doesn't help.",
 preText:`They look like lanterns floating independently through the mist — six of them, dancing in patterns that would be beautiful if you didn't know what they lead travelers into. Will-o-wisps: attracted to life energy, and not in a friendly way. They converge with coordinated elegance, and the air between them crackles. They're about to drain everything you have. This is going to require creativity.`,
 postText:`The wisps scatter as their formation breaks, retreating into the deep mist with something that sounds like frustration. The marsh goes quiet in their absence — an unusual quiet, as though the environment itself is impressed by the outcome.`,
 enemy:{name:"Will-o-Wisp Cluster",desc:"Incorporeal, luminescent, and functionally indistinguishable from a bad idea.",icon:"✨",
        hp:70,attack:17,defense:4,xp:60,gold:15,
        skills:[
          {name:"Life Drain",   type:'drain',  chance:0.4,cooldown:0},
          {name:"Confusion",    type:'stun',   chance:0.25,cooldown:3},
          {name:"Light Surge",  type:'multi',  chance:0.3, cooldown:3},
        ],
        loot:[{id:'mana_elixir',chance:0.6},{id:'health_potion',chance:0.4}]}},

{id:47,chapter:5,title:"The Spy's Cache",type:'narrative',icon:'🕵',
 flavor:"Someone was here before you. They left notes.",
 text:`A hollow tree, sealed with marsh-wax — someone's hidden archive, maintained with professional care. Inside: maps, coded notes in three different hands, and an evidence ledger documenting the Mirewitch's activities over the past two years. Someone has been watching her. Someone is not here now.

The most recent entry is a week old. It describes the witch "communing with the fragment daily — the fragment is teaching her something, but she doesn't look pleased about the lesson." The author signs each entry with a single letter: K.`,
 choices:[
  {text:"Read the complete evidence ledger",
   outcome:{text:"The witch has been using the fragment to create a 'memory palace' — a region of the marsh where the Realmshard's absorbed civilizations overlap with the present. Walking through it is walking through a dozen versions of history simultaneously.",xp:40,flags:['knows_memory_palace']}},
  {text:"Take the maps and leave the rest",
   outcome:{text:"The marsh maps are extraordinarily detailed. You navigate the next three hours with perfect accuracy and arrive at your destination without meeting a single hazard.",xp:25,items:['map_fragment']}},
  {text:"Leave a note for K — this person might be an ally",
   outcome:{text:"You write quickly. Three levels later, you find a response: 'Watch the witch's reflection. It shows truth, not what she wants you to see.' Whoever K is, they're still watching.",xp:35,flags:['K_contact']}},
 ]},

{id:48,chapter:5,title:"The Mimicry Vines",type:'puzzle',icon:'🌿',
 flavor:"Botanical deception. Plants are better at it than you'd think.",
 text:`Mimicry vines are the Shadowfen's signature hazard: plants that replicate the appearance of whatever they've recently absorbed — a process that normally takes years, but near the Realmshard's influence has accelerated. Three passages are available. One contains what appears to be the chest from the smugglers' barge. One appears to have a path marker you recognize from the marsh elders. One contains what appears to be Aldric the hermit's walking stick — which he definitely didn't abandon here.

All three passages contain vine clusters. Two are mimics. One is the genuine article.`,
 hint:"Mimicry vines replicate appearance but not smell.",
 choices:[
  {text:"Smell each passage — plants that absorb things retain original scents",
   outcome:{text:"Two passages smell of marsh vegetation with artificial undertones. The third smells faintly of pine and old books: the real path marker. You proceed correctly.",xp:35}},
  {text:"Test each with a stick before entering",
   outcome:{text:"The mimic passages react to the stick with subtle movement — trained to lure things in. The genuine passage is inert. Second level of knowing.",xp:30,gold:20}},
  {text:"Move fast and commit to the path marker route — it's most likely correct",
   outcome:{text:"It's a mimic. You realize this when the vines begin to close around you. You fight through them, emerging on the correct side with new respect for botanical patience.",xp:20,hp:-18}},
 ]},

{id:49,chapter:5,title:"The Cult of Echoes",type:'narrative',icon:'🔮',
 flavor:"They worship a memory of a world that never existed. It listens.",
 text:`The Cult of Echoes occupies what was once a temple in a civilization the Shadowfen has swallowed. Forty robed figures perform a ritual that involves calling out a name and waiting. You recognize the pattern: they're communing with the Realmshard's absorbed memories, inviting what the artifact contains to speak through them.

Their high priest notices you and beckons — not as a threat, but as an invitation. "You've come for the Witch's fragment," he says. "We can tell you what she guards and how." His price: complete their ritual with them, letting the Realmshard's echo speak through you, whatever that might mean.`,
 choices:[
  {text:"Participate in the ritual — information is worth the risk",
   outcome:{text:"The echo speaks through you for thirty seconds: a language you shouldn't know, describing a world that ended five thousand years ago. When it ends, you know the witch's exact location and the fragment's weakness.",xp:45,flags:['echo_touched'],mp:-20}},
  {text:"Bargain — offer information about the Citadel in exchange",
   outcome:{text:"They accept. Your knowledge of the Citadel fills gaps in their records. Their knowledge of the marsh fills gaps in yours. Everyone is worse-informed about some things and better-informed about others.",xp:30,flags:['cult_ally']}},
  {text:"Decline respectfully and find another way",
   outcome:{text:"The priest nods. \"The respectful refusal,\" he says. \"That's rarer than the brave acceptance.\" He gives you a map of the cult's own routes through the witch's domain. Not as much, but safe.",xp:25,items:['health_potion']}},
 ]},

{id:50,chapter:5,title:"Mirewitch Thessaly",type:'boss',icon:'🌀',
 flavor:"Chapter 5 Boss — She built this place. The difference is, you know it.",
 preText:`The heart of the Shadowfen is a clearing where four versions of the same landscape overlap — the current marsh, and three versions of what it used to be, each superimposed on the others like layers of old paint. Thessaly stands at the center, the marsh witch who has tended this place for sixty years and who has spent the last two of them conversing with the Realmshard's fragment as it slowly changes her.

"I know what it shows me," she says. "I've seen it." She gestures at the overlapping worlds around you. "I've also seen what comes after if you succeed. The question is whether you have the cleverness to earn that knowledge." She raises her staff, and the layers of the world begin to move.`,
 postText:`The illusions collapse into a single, present marsh. Thessaly lowers her staff. "You see through it," she says. "That's what you need in the Citadel." She gives you the fragment and something else: a piece of her own knowledge, pressed into a memory crystal. "What the Realmshard is building, it builds with consent. It asks. It receives. The Drowned Architect consented. The Cinderking did not — he took it. The Huntress held it as a burden." She pauses. "What will you do?"`,
 enemy:{name:"Mirewitch Thessaly",desc:"Sixty years of marsh wisdom, two of Realmshard influence, and patience for none of your nonsense.",icon:"🌀",
        hp:240,attack:20,defense:10,xp:170,gold:55,isBoss:true,
        skills:[
          {name:"Mirror Strike",  type:'heavy',   chance:0.3, cooldown:2},
          {name:"Illusion Flood", type:'multi',   chance:0.25,cooldown:3},
          {name:"Mind Fog",       type:'stun',    chance:0.2, cooldown:4},
          {name:"Bog Pull",       type:'poison',  chance:0.25,cooldown:3},
          {name:"Fade Form",      type:'buff_def',chance:0.15,cooldown:5},
        ],
        loot:[{id:'shadow_dirk',chance:0.6},{id:'greater_health',chance:0.8}]},
 unlocks:[51]},

// ╔══════════════════════════════════════╗
// ║  CHAPTER 6 — CLOCKWORK BASTION       ║
// ╚══════════════════════════════════════╝

{id:51,chapter:6,title:"The Iron Gate",type:'narrative',icon:'⚙',
 flavor:"The Builders made a fortress. The fortress is still doing its job.",
 text:`The Clockwork Bastion rises from the plains in concentric rings of iron and brass, its towers topped with gear-driven mechanisms that turn in precise cycles regardless of weather or context. This is a Builder fortification repurposed by centuries of subsequent inhabitants who never quite understood how it worked but were very impressed by the results.

A gate mechanism faces you: twelve feet of articulated iron, sealed with a key system that was sophisticated in the Builder era and remains so now. A supply entrance to the east is sealed but unguarded. The main gate has two sentries, mechanical, who appear to be running a patrol pattern that has been running for three centuries without adjustment.`,
 choices:[
  {text:"Study the patrol pattern and find the gap",
   outcome:{text:"Every forty seconds, both sentries face east simultaneously for six seconds. You move through the gap with two seconds to spare, which is technically comfortable.",xp:30,flags:['infiltrated_bastion']}},
  {text:"Find the supply entrance mechanism",
   outcome:{text:"The east lock responds to builder-rune keys. You have one. The door opens silently and you enter the Bastion through a supply corridor stacked with three centuries of unsorted acquisitions.",xp:25,items:['health_potion']}},
  {text:"Announce your presence and request entry",
   outcome:{text:"The mechanical sentries process this for eleven seconds, then open the gate. The Bastion's protocols apparently include a diplomatic arrival option that no one has used since the third century.",xp:20,gold:15,flags:['bastion_guest']}},
 ]},

{id:52,chapter:6,title:"The Gear Mechanism",type:'puzzle',icon:'⚙',
 flavor:"Builder engineering: one solution, multiple failure modes.",
 text:`A sealed door blocks your progress. Its mechanism is exposed: a series of seven interlocking gears of different sizes, currently arranged to lock the door. A diagram etched into the wall shows the correct gear arrangement — but two of the gears have been reversed from the diagram by someone who was either trying to lock something in or lock someone out.

Available tools: a gear-hook for manipulation without touching (important — some gears are sharp-edged), and a spring-reset button that returns all gears to a neutral state, allowing a fresh start.`,
 hint:"The diagram shows the solution. The reversals are the problem. Fix the reversals.",
 choices:[
  {text:"Carefully reverse the two misaligned gears using the hook",
   outcome:{text:"Click. Click. The mechanism aligns, the door opens. The Builders designed this to be correctable. Someone had figured that out before you and tried to use it against access. You're faster.",xp:30}},
  {text:"Use the reset button and start from scratch",
   outcome:{text:"All gears return to neutral, neutral is a third different state than either current or correct, and you have to work from the diagram to reach correct. It takes longer but you get there.",xp:25,gold:15}},
  {text:"Force the door using the mechanisms around the lock",
   outcome:{text:"The door's frame responds before the lock does, which opens a maintenance hatch on its side. Technically not the intended solution, but the Builders didn't anticipate everything.",xp:20,hp:-8}},
 ]},

{id:53,chapter:6,title:"Clockwork Sentinels",type:'combat',icon:'🤖',
 flavor:"They've been waiting three centuries. They're not tired.",
 preText:`The interior corridor activates as you pass a certain threshold: four clockwork sentinels unfold from niches in the wall, gear-joints clicking through their deployment sequence with unhurried mechanical precision. They are armed with blade-limbs, their crystal eyes reading the corridor, and they have not received any updates to their threat-response protocols since the third century, which means they are operating on three-hundred-year-old threat assessment. Unfortunately, "intruder" hasn't changed meaning.`,
 postText:`Gear-joints lock. Crystal eyes dim. The sentinels collapse into their component parts with the neatness of things that were designed to be reassembled. You reflect that defeating something built to last three centuries should feel more significant, but mostly you're relieved.`,
 enemy:{name:"Clockwork Sentinels",desc:"Three-century-old security system. Extremely literal about its mandate.",icon:"🤖",
        hp:100,attack:21,defense:12,xp:70,gold:25,
        skills:[
          {name:"Blade Arm",     type:'heavy',      chance:0.35,cooldown:2},
          {name:"Multi-Strike",  type:'multi',      chance:0.3, cooldown:3},
          {name:"Armor Lock",    type:'armor_break',chance:0.2, cooldown:4},
          {name:"Self-Repair",   type:'heal',       chance:0.15,cooldown:5},
        ],
        loot:[{id:'chainmail',chance:0.3},{id:'health_potion',chance:0.5}]}},

{id:54,chapter:6,title:"The Steam Corridor",type:'puzzle',icon:'💨',
 flavor:"The Builders ran everything on steam. Including, apparently, their traps.",
 text:`The maintenance corridor between the outer and inner Bastion is threaded with steam pipes — pressure release valves that erupt on a cycle you can hear but can't quite time, at least not from here. The corridor is sixty feet long. The valves erupt in pairs, from either side, in a sequence that repeats but that you've only seen the last third of.

Two options for observation: a side room with a window into the corridor (which would let you observe the full cycle), and a control panel at the corridor's start that appears to let you dial back valve pressure — but the controls are in builder runes you may or may not be able to read.`,
 hint:"The control panel has a symbol that looks like a pressure gauge. You've seen pressure gauges.",
 choices:[
  {text:"Observe the full cycle from the side room first",
   outcome:{text:"Three minutes of watching reveals a twenty-two second gap between cycles 4 and 5. Sixty feet in twenty-two seconds is achievable, though not leisurely.",xp:35}},
  {text:"Use the control panel to reduce valve pressure",
   outcome:{text:"You recognize the gauge symbol and the 'reduce' indicator from the waterlock. The pressure drops. The valves still erupt but produce steam rather than scalding blast. You walk through at a comfortable pace.",xp:40}},
  {text:"Sprint the corridor and accept some burns",
   outcome:{text:"You catch two blasts — one partial, one direct. The direct one is instructive. You emerge on the other side having learned that 'scalding' is a different experience than the word suggests.",xp:20,hp:-22}},
 ]},

{id:55,chapter:6,title:"The Hidden Merchant",type:'narrative',icon:'🎪',
 flavor:"In an impossible place, an improbable business. The prices are worth it.",
 text:`Behind a maintenance door that shouldn't be here, in a room the Bastion's official schematics don't show, a merchant has established something between a shop and a personal sanctuary. He introduces himself as Corvinus, a name he delivers with the air of someone who has been using it long enough to believe it. He's been here for fifteen years. He explains this is the Bastion's original builder supply depot: climate-controlled, structurally sound, and conveniently overlooked by everyone with authority.

His inventory is extraordinary. His prices are honest. His tea is better than anything you've had in three regions.`,
 choices:[
  {text:"Browse his inventory and spend what you can",
   outcome:{text:"You find items you didn't know you needed and some you absolutely did. Corvinus wraps everything in oilskin and gives you his card — a bronze disc with his symbol. 'If you survive the Artificer, come back. The tea will be here.'",xp:20,gold:-25,items:['greater_health','mana_elixir'],flags:['merchant_friend']}},
  {text:"Ask what he knows about the Artificer",
   outcome:{text:"'The Artificer has been running diagnostics on something new for two years. Whatever it is, the Bastion has reallocated significant power to it. I've been watching the power consumption. It's in the Bastion's core.'",xp:30,flags:['knows_artificer_project']}},
  {text:"Trade information for information",
   outcome:{text:"An hour of genuine information exchange. Corvinus knows the Bastion better than its current operator. In return, he hears news from the outside world he's been missing. Both of you leave richer.",xp:35,gold:20,flags:['merchant_friend','corvinus_briefed']}},
 ]},

{id:56,chapter:6,title:"The Construct Factory",type:'combat',icon:'🔧',
 flavor:"They're making more of themselves. This seems relevant.",
 preText:`The production floor is active — which was not in the Bastion's original design. A manufactory for new clockwork constructs, running on repurposed builder power, is assembling soldiers at a rate of one per hour. Three completed units are currently running their activation sequence and have registered your presence. Additionally, a prototype — larger, more sophisticated, clearly the Artificer's personal project — is standing near the exit, watching with considerable interest.`,
 postText:`Gears wind down. The prototype retreats through a secured door, which seals behind it. Three constructs: dismantled. One prototype: delayed. The production line continues regardless, which means time is now a factor in ways it wasn't before.`,
 enemy:{name:"Construct Factory Guards",desc:"Fresh off the line. Motivated. Not fully calibrated yet — which makes them unpredictable.",icon:"🔧",
        hp:115,attack:22,defense:11,xp:78,gold:28,
        skills:[
          {name:"Factory Strike",  type:'heavy',      chance:0.35,cooldown:2},
          {name:"Gear Spray",      type:'multi',      chance:0.3, cooldown:3},
          {name:"System Override", type:'buff_atk',   chance:0.2, cooldown:4},
          {name:"Emergency Patch", type:'heal',       chance:0.15,cooldown:5},
        ],
        loot:[{id:'elixir_power',chance:0.4},{id:'health_potion',chance:0.5}]}},

{id:57,chapter:6,title:"The Grand Clock",type:'puzzle',icon:'🕰',
 flavor:"The Bastion runs on time. Time runs on the Grand Clock.",
 text:`The Grand Clock is the Bastion's original power source — a mechanism the size of a cathedral, every gear the diameter of a house, running on principles that the subsequent inhabitants have maintained without understanding. A single misaligned gear has created a feedback loop: power is cycling incorrectly, and three doors you need to open are stuck in the wrong position.

The main calibration controls are accessible. The problem: to align the gear requires stopping the entire clock for forty seconds, which will cut power to the Bastion — including its defenses. The solution is simple. The implications are not.`,
 hint:"Forty seconds with no power is forty seconds with no active enemies either.",
 choices:[
  {text:"Stop the clock, fix the gear, restart — use the forty seconds",
   outcome:{text:"Power dies. Silence. You work fast. Twenty-eight seconds: gear fixed. Restart. Lights flicker back. The three doors open. The defenses resume. You have passed through all three in the interval.",xp:40,flags:['clock_fixed']}},
  {text:"Find a way to fix the gear without stopping the clock",
   outcome:{text:"Possible, technically, by adjusting three smaller gears in a specific sequence while the clock keeps running. It takes forty minutes and produces three near-misses, but the clock never stops.",xp:50,flags:['clock_fixed_running']}},
  {text:"Leave the clock as-is and find another route",
   outcome:{text:"There's a maintenance tunnel that bypasses the affected doors. Dirty, cramped, and occupied by something that's been nesting here for thirty years. It moves aside when you don't threaten it.",xp:25,gold:15}},
 ]},

{id:58,chapter:6,title:"The Sabotage",type:'narrative',icon:'💥',
 flavor:"The choice between leaving them a weapon and taking one away.",
 text:`The Bastion's power core contains the modifications the Artificer has been making: a device that channels the Realmshard's influence and amplifies it outward, extending the artifact's range by fifty miles. It is, by any technical standard, impressive. It is also currently pointed at the three nearest population centers.

You have the access codes you found in the factory. You can disable the device permanently — destroying decades of work. You can leave it intact and trust the Artificer won't use it. Or you can modify its direction, pointing it into unpopulated wastelands, which preserves the technology but removes the threat.`,
 choices:[
  {text:"Disable the device completely — it shouldn't exist",
   outcome:{text:"The core goes dark. Somewhere above you, machinery slows. The Artificer's calculations are set back to zero. When she finds out, she will not be pleased.",xp:35,flags:['disabled_device']}},
  {text:"Redirect the device to harmless targets",
   outcome:{text:"The modification takes forty minutes. The device now amplifies the Realmshard's influence into an empty mountain range. The power is still there. The harm is removed. For now.",xp:30,flags:['redirected_device']}},
  {text:"Leave it and take the access codes — information is more valuable",
   outcome:{text:"You document everything. The access codes give you leverage. The Artificer doesn't know you were here, which may matter.",xp:25,gold:30,flags:['has_access_codes']}},
 ]},

{id:59,chapter:6,title:"The Artificer's Journal",type:'narrative',icon:'📖',
 flavor:"Every villain is the hero of their own journal.",
 text:`Her private journal is in a locked cabinet you open with the cogwheel key. Three hundred pages in a cramped, precise hand. She came to the Bastion as a researcher thirty years ago, discovered it still functioned, and has been systematically learning its systems ever since.

The final entries are the relevant ones. Six months ago, the Realmshard contacted her directly — spoke through the Bastion's dream-reader, a device meant to process structural stress into something comprehensible. It offered her knowledge: complete understanding of Builder technology, in exchange for extending its range. She accepted. She wrote, in large letters: "IT KNOWS WHAT I WANT MORE THAN I WANT IT."`,
 choices:[
  {text:"Read her technical notes on the Realmshard's communications",
   outcome:{text:"The Realmshard doesn't demand. It offers. It shows each person exactly what they most want and waits for consent. The Artificer wanted to understand everything. She got it. The cost is becoming its amplifier.",xp:40,flags:['knows_offer_mechanism']}},
  {text:"Look for anything she learned about its weakness",
   outcome:{text:"Three pages of notes on the artifact's casing — she analyzed a fragment and discovered the eight-shard structure. She also found that the fragments, when reunited, create either a seal or a key. She doesn't know which.",xp:35,flags:['journal_weakness']}},
  {text:"Find her notes on the Builders' original containment plan",
   outcome:{text:"The Builders built eight separate locations, each holding a fragment, each designed as a backup for the others. If one failed, the others would compensate. Something made all eight fail simultaneously.",xp:30,gold:20,flags:['containment_lore']}},
 ]},

{id:60,chapter:6,title:"The Grand Artificer",type:'boss',icon:'⚙',
 flavor:"Chapter 6 Boss — She knows everything. That's exactly the problem.",
 preText:`She's waiting for you in the Bastion's heart, surrounded by gear-work that responds to her movements as though it's an extension of her body — which, at this point, it may be. The Grand Artificer stands five feet tall in a frame of brass clockwork that she's integrated with over thirty years of incremental modification. Her eyes have been replaced with crystal lenses that shift and adjust as she observes you.

"You've read my journal," she says. It's not a question. "Then you know what I was offered, and what I gave." She tilts her head. "You're also going to need to go through me to reach the core, which is an elegant problem." The gear-work around her begins to move.`,
 postText:`The Grand Artificer's clockwork frame winds down. She stands in its wreckage, smaller, more human than she's looked in years. "I accepted the offer because I thought I could control what I learned," she says. "I was right. I was wrong. I was right." She opens a compartment in the floor. Inside is the Bastion's Realmshard fragment, and something else: a complete technical schematic for the Citadel's core. "I mapped it from the fragment's memories. Use it."`,
 enemy:{name:"The Grand Artificer",desc:"Thirty years of Builder knowledge, integrated clockwork body, Realmshard consent.",icon:"⚙",
        hp:300,attack:24,defense:13,xp:190,gold:70,isBoss:true,
        skills:[
          {name:"Gear Barrage",    type:'multi',      chance:0.3, cooldown:2},
          {name:"Steam Cannon",    type:'heavy',      chance:0.3, cooldown:2},
          {name:"Armor Plating",   type:'buff_def',   chance:0.2, cooldown:4},
          {name:"Auto-Repair",     type:'heal',       chance:0.15,cooldown:5},
          {name:"Overdrive",       type:'heavy',      chance:0.2, cooldown:3},
        ],
        loot:[{id:'clockwork_xbow',chance:0.6},{id:'clockwork_plate',chance:0.5}]},
 unlocks:[61]},

// ╔══════════════════════════════════════╗
// ║  CHAPTER 7 — THE HOLLOW COURT        ║
// ╚══════════════════════════════════════╝

{id:61,chapter:7,title:"The Palace Gates",type:'narrative',icon:'👑',
 flavor:"Power is polite. Politeness is power. Both are weapons.",
 text:`The Hollow Court's palace is everything the name implies: magnificent on the outside, empty at the center. The original ruler died two years ago under circumstances that everyone describes as "natural" in a tone that means the opposite. A regent rules in the meantime. The regent's name is Valdric. No one will meet your eyes when they say it.

You need access to the Court's archive, which holds both a Realmshard fragment and the records of what Valdric has been doing with the kingdom's resources. Getting in requires either an invitation (formal, bureaucratic), a disguise (social, precarious), or a route that doesn't go through the front gate (physical, undignified but effective).`,
 choices:[
  {text:"Request a formal audience — present your credentials",
   outcome:{text:"Your credentials are examined, found interesting, and you're granted a provisional audience in three days. This is faster than expected. Someone wants to see you.",xp:25,flags:['formal_audience']}},
  {text:"Acquire appropriate court clothing and infiltrate",
   outcome:{text:"The market outside the palace sells remarkably realistic noble regalia. You purchase an identity, which feels philosophical and is extremely practical.",xp:30,gold:-30,items:['court_raiment'],flags:['court_disguise']}},
  {text:"Find the servant's entrance and work your way in",
   outcome:{text:"The kitchen entrance is busy enough that one more unfamiliar face doesn't register. You're in. You're also technically now employed as a scullery assistant.",xp:20,flags:['servant_access']}},
 ]},

{id:62,chapter:7,title:"The First Audience",type:'narrative',icon:'🗣',
 flavor:"Court conversation is combat with nicer clothes.",
 text:`The Court's great hall is occupied by approximately forty nobles who have mastered the art of watching you without appearing to. You are either a significant arrival or a significant entertainment. Possibly both.

Three factions make themselves immediately apparent through micro-negotiations in the seating arrangement: the Loyalists who support Valdric, the Old Guard who served the previous king and appear to be waiting for something, and the Merchants who don't care about politics as long as trade continues. All three send representatives to speak with you within the first twenty minutes.`,
 choices:[
  {text:"Engage with the Old Guard — they know where the bodies are buried",
   outcome:{text:"Lady Vessa of the Old Guard is direct: 'Valdric has been using the archive's Realmshard fragment to view suppressed historical records. He's looking for precedents for something we haven't identified.' She'll help you if you help her.",xp:35,flags:['old_guard_contact']}},
  {text:"Spend time with the Merchants — they see the kingdom's blood flow",
   outcome:{text:"Three merchants in sequence. Each reveals something different: the treasury is being drained for an unknown project, a sealed wing of the palace has been active for eighteen months, and Valdric doesn't sleep.",xp:30,gold:20,flags:['merchant_intel']}},
  {text:"Avoid all factions and simply observe",
   outcome:{text:"You see something none of them show each other: everyone in this room is afraid. Not of Valdric. Of something he's been building toward. The fear precedes him by months.",xp:25,flags:['court_observer']}},
 ]},

{id:63,chapter:7,title:"A Noble's Duel",type:'combat',icon:'⚔',
 flavor:"He challenged you publicly. Your only option is to be better at this than he expected.",
 preText:`Lord Harren of the Loyalists has chosen you as his demonstration piece: a public duel to establish that outsiders challenging Court authority face consequences. The protocol is formal, witnessed, and non-fatal by agreement — though Harren's interpretation of "non-fatal" appears to include significant injury. He draws a Court sword in front of forty witnesses. There is no diplomatic option here.`,
 postText:`Harren yields with the specific expression of someone who expected to win and is not incorporating this new information gracefully. The Court is silent for three seconds, then begins murmuring — not against you, you note. Against him. You have, apparently, passed a test you didn't know was being administered.`,
 enemy:{name:"Lord Harren",desc:"Loyalist. Superior sword technique. Significantly inferior judgement.",icon:"⚔",
        hp:105,attack:21,defense:9,xp:72,gold:35,
        skills:[
          {name:"Courtly Thrust", type:'heavy',  chance:0.35,cooldown:2},
          {name:"Noble's Riposte",type:'multi',  chance:0.3, cooldown:3},
          {name:"Intimidating Stance",type:'stun',chance:0.2,cooldown:4},
        ],
        loot:[{id:'iron_sword',chance:0.4},{id:'health_potion',chance:0.5}]}},

{id:64,chapter:7,title:"Gathering Intelligence",type:'narrative',icon:'🕵',
 flavor:"The archive knows everything. Getting to it is the question.",
 text:`The sealed archive wing is accessible through three routes: the main archive door (keycard required, held by Valdric's secretary), a connecting passage through the library (open during certain hours, but monitored), and a maintenance shaft behind the eastern wall (accessible, unpleasant, unguarded).

Lady Vessa has offered to provide a distraction — a formal dinner that will occupy Valdric's attention for two hours, starting in thirty minutes. The window is tight. The intelligence is, by all accounts, worth it.`,
 choices:[
  {text:"Use Vessa's distraction and take the library route",
   outcome:{text:"Two hours, unmonitored. The archive contains a complete record of Valdric's project: he's been using the Realmshard to consolidate the Court's political power by accessing suppressed histories of previous rulers.",xp:40,flags:['archive_accessed']}},
  {text:"Acquire the keycard through the secretary's office",
   outcome:{text:"The secretary is at the dinner. His office is not locked. This feels too easy until you find his personal diary, which explains why: he has been hoping someone would find it.",xp:35,flags:['has_keycard'],gold:25}},
  {text:"Take the maintenance shaft",
   outcome:{text:"Fifty feet of cramped, dusty utility space. On the far end: the archive, accessed through a ventilation panel. Also in the archive: someone else who also used the maintenance shaft. They look as startled as you.",xp:25,flags:['archive_accessed','met_K']}},
 ]},

{id:65,chapter:7,title:"The Royal Advisor",type:'narrative',icon:'👴',
 flavor:"He's been running this court for thirty years. He's tired of it.",
 text:`The Royal Advisor — technically Valdric's advisor, previously three other rulers' advisor — requests a private meeting in his quarters. He is the oldest person in the palace by twenty years, and he gives the impression of someone who has watched too many things happen and would very much like to stop watching.

"I know why you're here," he says. "The Realmshard. The archive's fragment." He pours tea without asking if you want it. "I've been waiting for someone like you. Valdric is using it. Not well. Not understanding it. The fragment has been — how to say this — training him. Showing him what power looks like without explaining the cost."`,
 choices:[
  {text:"Ask what the advisor has done to stop this",
   outcome:{text:"'I've been writing letters for six months.' He slides a stack across the table. 'To anyone who might come. You are, apparently, the first to arrive.' The letters contain detailed observations about Valdric's deterioration.",xp:35,flags:['advisor_ally']}},
  {text:"Ask what Valdric specifically intends to do",
   outcome:{text:"'He intends to use the fragment to consolidate all eight kingdoms under the Court. The Realmshard has shown him how it's been done before — by consuming each kingdom's identity.' He pauses. 'He thinks he's inventing this.'",xp:40,flags:['knows_valdric_plan']}},
  {text:"Ask why the advisor hasn't simply removed Valdric",
   outcome:{text:"A long silence. 'I've been asking myself that for four months.' He stands and opens a locked box. Inside: evidence of Valdric's crimes, organized by date and witness. 'I was waiting to give this to someone who would use it correctly.'",xp:30,items:['signet_ring'],flags:['has_evidence']}},
 ]},

{id:66,chapter:7,title:"The Court Assassin",type:'combat',icon:'🗡',
 flavor:"Valdric sent a message. The message is armed.",
 preText:`You're returning to your quarters when the figure drops from the upper balcony: a Court assassin, wearing the livery of no faction and the expression of someone who has a contract and is professional about it. They don't identify themselves. They don't explain themselves. They close the distance between you immediately and the dagger they're using hasn't been polished, which means it's been used before recently and they didn't have time or didn't care.`,
 postText:`The assassin sits against the wall with a willingness that suggests this outcome is one they had accounted for. "He said you were good," they offer. "He was right." They hand you a sealed note from inside their jacket: Valdric's orders. He knows you've been in the archive. He knows about the advisor. He doesn't know about the fragment — yet.`,
 enemy:{name:"Court Assassin",desc:"Professional. Well-equipped. Thoroughly briefed on you specifically.",icon:"🗡",
        hp:110,attack:24,defense:10,xp:80,gold:40,
        skills:[
          {name:"Poison Blade",    type:'poison', chance:0.35,cooldown:2},
          {name:"Shadow Strike",   type:'heavy',  chance:0.35,cooldown:2},
          {name:"Smoke Screen",    type:'dodge',  chance:0.2, cooldown:4},
          {name:"Vital Point",     type:'heavy',  chance:0.25,cooldown:3},
        ],
        loot:[{id:'shadow_dirk',chance:0.4},{id:'antidote',chance:0.6}]}},

{id:67,chapter:7,title:"Factions",type:'narrative',icon:'⚖',
 flavor:"Everyone wants the same thing. Nobody agrees on what it is.",
 text:`Three factions now each want something from you, and the deadline — Valdric's formal announcement tomorrow — makes prioritization necessary. The Old Guard wants you to expose his crimes publicly. The Merchants want private assurance that trade routes won't be disrupted if the Court changes hands. The advisor wants a specific conversation with Valdric before any confrontation.

Additionally, K — the operative you may have encountered — leaves a message: they work for a fourth party, and they'd like five minutes before you decide anything. Just five minutes.`,
 choices:[
  {text:"Meet with K before deciding anything else",
   outcome:{text:"K works for the previous king's surviving heir, currently hidden in the city. 'She doesn't want the throne back,' K says. 'She wants the fragment. She knows what it is.' This changes the calculus considerably.",xp:35,flags:['knows_heir','K_met']}},
  {text:"Ally formally with the Old Guard — expose everything publicly",
   outcome:{text:"Lady Vessa moves fast once you agree. The Old Guard positions itself overnight. The exposure will be public, messy, and permanent. Some things need to be permanent.",xp:30,flags:['old_guard_ally']}},
  {text:"Take the advisor's approach — talk to Valdric first",
   outcome:{text:"The advisor arranges a private meeting. It goes better than expected and worse than hoped, ending with Valdric agreeing to hear you out formally before the announcement. This buys a day.",xp:30,flags:['diplomatic_path']}},
 ]},

{id:68,chapter:7,title:"The Throne Room Trial",type:'narrative',icon:'⚖',
 flavor:"The Court watches. Valdric listens. The fragment decides.",
 text:`The throne room holds everyone. Valdric sits on a throne that doesn't quite fit him — it was built for someone else — and reads from prepared notes with the rigidity of someone who has been rehearsing this for weeks. He is publicly accusing you of espionage, archive theft, and three other things that are partially true.

The room wants to see how you respond. The advisor is in the back of the room, face neutral. Lady Vessa is positioned near the door. K is somewhere in the gallery, invisible. The fragment is in Valdric's hand, disguised as a court seal.`,
 choices:[
  {text:"Present the evidence — the advisor's letters, the archive records",
   outcome:{text:"The evidence is unassailable. The Court turns one degree at a time, then all at once. Valdric's authority drains from the room like water from a tilted cup. He grips the fragment harder.",xp:45,flags:['evidence_presented']}},
  {text:"Address the fragment directly — name what it's done to him",
   outcome:{text:"Silence. Then Valdric looks at his hand. For a moment, something recognizable crosses his face. 'It showed me everything,' he says, quietly. 'It was very convincing.' The Court is very still.",xp:40,flags:['named_the_fragment']}},
  {text:"Offer a path forward — his departure in exchange for peace",
   outcome:{text:"A political solution. He accepts it with the specific look of someone who knows they're accepting because they have to. The fragment stays on the throne. He leaves it there when he goes.",xp:35,flags:['peaceful_resolution']}},
 ]},

{id:69,chapter:7,title:"Revelations",type:'narrative',icon:'💡',
 flavor:"The last piece. The one that changes how all others fit.",
 text:`With Valdric gone and the fragment secured, the advisor takes you to the Court's deepest archive — a chamber that predates the palace by a century. Here, the walls carry builder carvings. This was a builder site before it was a court.

The carvings tell a different story than the ruins, than the Library, than anything you've been told. The Realmshard didn't absorb eight civilizations against their will. Each civilization built one of the eight fragment-casings, sealed a shard inside, and hid it — willingly — after agreeing that the artifact would be allowed to remember but not to rebuild. The agreement has held for three millennia. Until six months ago, when something convinced each fragment-bearer to become an active participant.

The question is what convinced them all simultaneously.`,
 choices:[
  {text:"Search the carvings for what changed six months ago",
   outcome:{text:"A final carving, newer than the rest — someone added it recently, in builder script: 'THE CITADEL CORE HAS BEEN BREACHED. THE ARTIFACT REMEMBERS THE ORIGINAL CONSENT.' Something entered the Citadel six months ago.",xp:50,flags:['knows_breach']}},
  {text:"Ask the advisor what the Court's own records say",
   outcome:{text:"The Court's oldest records describe a 'Herald of the Shard' — a person who enters the Citadel and becomes the Realmshard's voice in the world. The last Herald was three thousand years ago. The Citadel has been sealed since.",xp:40,flags:['knows_herald']}},
  {text:"Focus on what this means for your path forward",
   outcome:{text:"The fragments were carried willingly. The carriers were changed but not corrupted — Thessaly, Morax, the Huntress, the Architect. All were shown something real. The question is what the final fragment, in the Citadel, has been shown.",xp:35,gold:30}},
 ]},

{id:70,chapter:7,title:"The Usurper King",type:'boss',icon:'👑',
 flavor:"Chapter 7 Boss — He won't let go of what the fragment showed him.",
 preText:`Valdric didn't leave. He retreated to the Court's private sanctuary with the fragment and thirty loyal guards and has been there for two days. When the guards disperse and the door opens, it's not surrender — it's invitation.

He stands in the center of the room, the fragment floating above his open palm. "I've seen what the kingdoms could be," he says, and his voice carries a quality it didn't before — layered, as though multiple people are speaking simultaneously. "Eight unified. Realized. The Realmshard showed me the plan. I agreed to help it."

The fragment pulses. The room shifts. He smiles, which is the last normal thing about the situation.`,
 postText:`The fragment falls from the air. Valdric falls to his knees. The layered quality in his voice is gone. "I remember agreeing," he says. "I remember thinking it was the right choice. I..." He doesn't finish. He looks like a man who has just woken up from a very long dream with no comfortable place to put the memories. The fragment waits on the floor. You pick it up. The Citadel is next.`,
 enemy:{name:"Valdric, Usurper King",desc:"Realmshard-enhanced, willing participant, deeply convinced of his own righteousness.",icon:"👑",
        hp:290,attack:24,defense:11,xp:185,gold:65,isBoss:true,
        skills:[
          {name:"Royal Command",   type:'stun',    chance:0.25,cooldown:4},
          {name:"Shard Blast",     type:'heavy',   chance:0.3, cooldown:2},
          {name:"Memory Strike",   type:'multi',   chance:0.3, cooldown:3},
          {name:"Kingly Bearing",  type:'buff_def',chance:0.15,cooldown:5},
          {name:"Fragment Fury",   type:'heavy',   chance:0.25,cooldown:3},
        ],
        loot:[{id:'scepter_dom',chance:0.6},{id:'greater_health',chance:0.8}]},
 unlocks:[71]},

// ╔══════════════════════════════════════╗
// ║  CHAPTER 8 — DRAGON'S SPINE CITADEL  ║
// ╚══════════════════════════════════════╝

{id:71,chapter:8,title:"The Citadel Road",type:'narrative',icon:'🐉',
 flavor:"The road knows where you're going. It goes there anyway.",
 text:`The Dragon's Spine Citadel rises from the mountain range that gave it its name: a structure that follows the ridgeline for three miles, its towers spaced like vertebrae, its walls the grey of old bone. It has been sealed for three thousand years. The main gate is open.

This is not good. The gate has been designed to open only from the inside, which means either someone left before you arrived or something inside wants you to come in. Both interpretations are concerning for different reasons.

Around you, the landscape shows evidence of recent change: old growth trees damaged from above (something large flew low), scorched earth in patterns (several somethings, burning), and tracks you don't recognize on the road leading both in and out of the Citadel. You're not the first visitor recently.`,
 choices:[
  {text:"Examine the tracks and try to determine what came before you",
   outcome:{text:"Three sets: large scaled claws (dragon kin, recent), heavy human boots (military, older), and something with no feet that moved by impression alone (very recent). The Realmshard's influence becomes physical near the Citadel.",xp:30,flags:['tracks_read']}},
  {text:"Assess the open gate from the road before approaching",
   outcome:{text:"The gate mechanism is clearly Builder work — and clearly active. Someone used a builder key to open it from inside. You have a builder key. Whoever did this has one too.",xp:25,flags:['gate_observed']}},
  {text:"Enter immediately — you've come too far for caution to mean anything",
   outcome:{text:"The road to the gate is unobstructed. The gate itself seems to lean slightly inward as you pass, like a door held open by someone who stepped aside. The feeling doesn't go away.",xp:20,hp:10,mp:10}},
 ]},

{id:72,chapter:8,title:"Dragon's Brood",type:'combat',icon:'🐉',
 flavor:"The Citadel's original guardians. Still present. Still functional.",
 preText:`The Citadel's outer courtyard is occupied by three wyverns — smaller than true dragons, larger than anything should be allowed to be in an enclosed space, and clearly agitated. They've been here for a long time: their scales are the same grey as the Citadel's stone, which may be camouflage or may be something the stones do to anything that stays long enough. They regard your entrance with the specific attention of things deciding whether you're a threat or a meal.`,
 postText:`The wyverns retreat to the Citadel's towers — not flying away, retreating. They're still here. They've been here for three thousand years as the Citadel's original guardians, and driving them off temporarily is a different thing than displacing them. You note this and continue.`,
 enemy:{name:"Wyvern Brood",desc:"Three-thousand-year guard duty. They take it seriously.",icon:"🐉",
        hp:140,attack:26,defense:13,xp:95,gold:35,
        skills:[
          {name:"Flame Breath",    type:'burn',   chance:0.4, cooldown:0},
          {name:"Claw Strike",     type:'heavy',  chance:0.3, cooldown:2},
          {name:"Wing Gust",       type:'stun',   chance:0.2, cooldown:4},
          {name:"Tail Sweep",      type:'multi',  chance:0.25,cooldown:3},
        ],
        loot:[{id:'dragonscale_hauberk',chance:0.4},{id:'greater_health',chance:0.6}]}},

{id:73,chapter:8,title:"The Ancient Door",type:'puzzle',icon:'🗝',
 flavor:"Everything you've found was for this.",
 text:`The Citadel's inner gate is the culmination of everything Builder engineering could produce: a door that can only be opened by someone who carries proof of passage through each of the eight fragment-sites. Not the fragments themselves — the evidence that you were there, and that you understood what you found.

Eight recesses in the door, each shaped to receive a different kind of proof. Some require physical keys. Some require knowledge spoken aloud into resonance crystals. Some accept only items from specific locations. The door is testing not whether you collected things, but whether you paid attention.`,
 hint:"Each site left you something. Some things are objects. Some are memories.",
 choices:[
  {text:"Place what you've collected into each matching recess",
   outcome:{text:"One by one, the recesses accept what you offer. Items where items are asked. Words where words are asked. Each acceptance feels like a small recognition — not of power, but of attention. The door opens.",xp:60,flags:['inner_door_opened']}},
  {text:"Speak the knowledge you've gathered to each crystal recess",
   outcome:{text:"The words come more easily than expected. What you know fills the spaces precisely. The crystals glow in sequence. The door registers understanding as sufficient for passage.",xp:50,gold:30,flags:['inner_door_opened']}},
  {text:"Test each recess systematically until it responds",
   outcome:{text:"Methodical and thorough. It takes forty minutes. Every recess eventually responds. The door's builder architects would have approved of the approach, if not the time it took.",xp:40,hp:10,flags:['inner_door_opened']}},
 ]},

{id:74,chapter:8,title:"The Citadel's Memory",type:'narrative',icon:'💠',
 flavor:"Three thousand years of remembrance. All of it relevant.",
 text:`The Citadel's central atrium contains the Realmshard's accumulated memory — not stored abstractly, but expressed physically. The walls shift to show eight different versions of the same landscape simultaneously: the Whispering Woods, Sunken Ruins, Ember Wastes, Frostspire Peaks, Shadowfen Marsh, Clockwork Bastion, Hollow Court, and the Citadel itself — layered and interacting. This is what the artifact contains. This is what it wants to rebuild.

A voice speaks from the overlapping images. Not a voice of command or threat: a voice that is very old and very tired and is trying to explain something important.

"I am the memory of eight civilizations. They agreed. They built the casings. They made me the keeper of what they were because they feared losing it. Three thousand years ago, the Herald opened the Citadel and I showed them what had been lost. They wept. They sealed the Citadel and walked away. Six months ago..." The voice pauses. "Six months ago, someone else came in."`,
 choices:[
  {text:"Ask who came in six months ago",
   outcome:{text:`"I don't know their name. I know what they offered: a ninth civilization's memory, in exchange for action. For rebuilding rather than remembering. I declined, but the offering changed something. The fragments began to wake."`,xp:50,flags:['knows_ninth']}},
  {text:"Ask what the Realmshard actually wants",
   outcome:{text:`"To be useful. Memory without context is grief. I was built to preserve — but preservation without application is just waiting."`,xp:45,flags:['knows_desire']}},
  {text:"Tell the Realmshard what you've seen across all eight regions",
   outcome:{text:"You speak for an hour. The walls shift and align as you describe each site. When you finish, the voice says: 'You have seen more than the Herald did, and understood more than those who carried the fragments.' A long pause. 'Tell me what you want.'",xp:60,flags:['informed_shard']}},
 ]},

{id:75,chapter:8,title:"Dragon Knight Vanguard",type:'combat',icon:'⚔',
 flavor:"The Citadel's last human defenders. They chose to stay.",
 preText:`Four Dragon Knights in full ancient armor stand between you and the inner sanctum. These are not opponents brought here by the Realmshard — they are people who came willingly three months ago, drawn by the same opening of the Citadel that pulled all the fragment-carriers awake. They chose to stay and guard. Not for any faction. For the artifact itself. Their leader speaks: "You've come to end something or free something. We've been instructed to test which."`,
 postText:`The Dragon Knights yield in unison. "You fought without hatred," their leader says. "Most who reach this point are angry. Angry people break things." She steps aside. "Go carefully. The one who was here six months ago is still here. It isn't human. And it isn't finished."`,
 enemy:{name:"Dragon Knight Vanguard",desc:"Willing guardians. Ancient armor. Testing your intentions through violence.",icon:"⚔",
        hp:165,attack:28,defense:16,xp:105,gold:40,
        skills:[
          {name:"Dragon Slash",   type:'heavy',    chance:0.35,cooldown:2},
          {name:"Shield Wall",    type:'buff_def', chance:0.2, cooldown:4},
          {name:"Combined Strike",type:'multi',    chance:0.3, cooldown:3},
          {name:"Dragon's Roar",  type:'stun',     chance:0.2, cooldown:4},
        ],
        loot:[{id:'dragonbone_sword',chance:0.4},{id:'greater_health',chance:0.6}]}},

{id:76,chapter:8,title:"The Inner Sanctum",type:'narrative',icon:'💠',
 flavor:"Everything has led here. This is where you decide what it was for.",
 text:`The inner sanctum holds the Realmshard's core: a chamber where the artifact's main body rests — not a fragment but the original, an object the size of a door, composed of eight interlocking sections that match the eight fragments you've gathered. It pulses with something that isn't light. It's more like attention.

Also in the sanctum: a figure who has been here for six months. Not human. Not Builder. Something that predates both — ancient and patient and watching you with interest that it makes no effort to conceal. It addresses you by name. It knows your name because it learned it from the Realmshard's accumulated memory.

"You have all eight fragments," it says. "You can seal the artifact permanently — reduce it to an inert object, preserve the memory but remove the capacity for action. Or you can free it: return the fragments to the core and allow the Realmshard to act on what it's preserved. Or..." It pauses, seeming genuinely uncertain. "You can simply leave. The Citadel will reseal. The cycle will repeat in another thousand years. It has before."`,
 choices:[
  {text:"Ask who or what this entity is",
   outcome:{text:`"I am what commissioned the eight civilizations to build the fragment-casings in the first place. I created the Realmshard as a gift to a world I was about to leave. I came back six months ago to check on it." It pauses. "I hadn't anticipated this particular iteration."`,xp:40,flags:['knows_creator']}},
  {text:"Ask what 'freeing' the Realmshard would actually do",
   outcome:{text:`"It would rebuild — carefully, consensually — the best elements of what it holds. Not override the present. Enhance it. The eight civilizations it carries included medical technologies, agricultural methods, architectural principles that your current world has lost." A pause. "It would also be irreversible."`,xp:45,flags:['knows_free_consequence']}},
  {text:"State your decision — you've seen enough to decide",
   outcome:{text:"The entity watches you make your choice without expression. Whatever it's feeling, it keeps contained. 'Then you are the Herald,' it says. 'The third one. I hope you've chosen better than the others.'",xp:50,flags:['herald_named']}},
 ]},

{id:77,chapter:8,title:"The Realmshard Speaks",type:'narrative',icon:'💠',
 flavor:"Memory given voice. What three millennia sounds like.",
 text:`The Realmshard's attention is now fully on you. The chamber's walls show every version of every place you've traveled, simultaneously, accurately — including moments you didn't realize it was watching.

"Eight fragments," it says, and the voice is layered with every person who has ever carried one. The Drowned Architect. Cinderking Morax. The Pale Huntress. Mirewitch Thessaly. The Grand Artificer. Valdric. And voices you don't recognize — the fragment-bearers of three thousand years ago. "You carried none. You took all. You are the first Herald who came to the Citadel empty-handed and left the fragments in the hands of those who held them."

The Realmshard sounds, distinctly, surprised. Then something that might be appreciation.`,
 choices:[
  {text:"'I didn't take the fragments. I was given them.'",
   outcome:{text:`"Yes. That is why this is different." A long pause in which the walls stop moving. "They gave them willingly. They were not compelled by you or by me." Another pause. "What do you intend to do with that?"`,xp:50,flags:['given_not_taken']}},
  {text:"'I've seen what you contain. I understand why it matters.'",
   outcome:{text:`"Most people who reach this chamber have not looked at what I hold. They see the power and address that." The walls show each of the eight sites briefly, warmly. "You looked at the knowledge."`,xp:55,flags:['saw_knowledge']}},
  {text:"'Tell me what the right choice is. You've been watching longer than I've been alive.'",
   outcome:{text:`The Realmshard is quiet for a long time. Then: "The right choice depends on what you believe the world deserves. I have seen thirty iterations of this question. Each Herald chose differently. Each choice was — in its way — correct for the world that existed at that moment."`,xp:45,flags:['asked_shard']}},
 ]},

{id:78,chapter:8,title:"The Final Gambit",type:'narrative',icon:'⚔',
 flavor:"The thing that came here six months ago has its own vote.",
 text:`The ancient entity has been listening. Now it speaks again, and for the first time its patience shows a crack: "I should tell you that I have an interest in your choice. I did not return after three thousand years out of sentiment. I returned because I intend to use the Realmshard's capacity to rebuild — on my terms, with or without its agreement. The nine civilizations it contains are relevant to what I'm building." It looks at the fragments, then at you. "You have them. I want them. This creates a conflict."

The Dragon Knight leader, who has followed you in, says quietly: "So it wasn't the Realmshard itself we needed protection from."

Correct.`,
 choices:[
  {text:"Challenge the entity directly — it has miscalculated your willingness to fight",
   outcome:{text:"The entity recalibrates. You have something it doesn't: the fragments' willing cooperation, and three thousand years of human capacity to resist things that consider themselves inevitable.",xp:40,flags:['challenge_entity']}},
  {text:"Offer the entity what it wants — but negotiate terms",
   outcome:{text:"It accepts negotiation, which is telling. Something that was entirely certain of itself wouldn't negotiate. You work out terms that preserve the Realmshard's agency while acknowledging the entity's purpose.",xp:35,flags:['negotiated_entity']}},
  {text:"Use the Realmshard itself against the entity — it has been here longer",
   outcome:{text:"The Realmshard's attention shifts fully. Its response is not fire or force — it simply shows the entity itself, three thousand years ago, its own memory used as a mirror. The entity goes very still.",xp:45,flags:['shard_against_entity']}},
 ]},

{id:79,chapter:8,title:"The Dragon's Trial",type:'combat',icon:'🐉',
 flavor:"The entity's final argument. Physical form of an abstract intent.",
 preText:`The entity doesn't fight you itself — it composes something: a physical manifestation of the Realmshard's most powerful absorbed memory, given form and directed at you. What takes shape in the chamber is something the eight civilizations collectively feared most, expressed in the most powerful way three millennia of accumulated memory can manage. It is enormous. It is committed. It has no interest in negotiation at this point.`,
 postText:`The manifestation unravels. The entity's expression — if the concept applies — shows genuine assessment. "You survived the memory of eight civilizations' greatest fear," it says. "Perhaps you're right to make the decision yourself." It steps back. The Realmshard's attention settles on you with a weight that is not pressure but expectation.`,
 enemy:{name:"The Manifested Memory",desc:"Every civilization's greatest fear, given form. Temporary but substantial.",icon:"🐉",
        hp:200,attack:29,defense:14,xp:130,gold:50,
        skills:[
          {name:"Memory Crush",   type:'heavy',    chance:0.35,cooldown:2},
          {name:"Terror Wave",    type:'stun',     chance:0.25,cooldown:4},
          {name:"Ancient Fury",   type:'multi',    chance:0.3, cooldown:3},
          {name:"Form Shift",     type:'buff_def', chance:0.15,cooldown:5},
        ],
        loot:[{id:'dragonbone_sword',chance:0.5},{id:'greater_health',chance:0.8}]}},

{id:80,chapter:8,title:"Vaeltharion the Realmshard",type:'boss',icon:'💠',
 flavor:"Chapter 8 Boss — The Final Question.",
 preText:`The Realmshard's core activates fully. What emerges is not a simple enemy — it's the Realmshard itself taking physical form to interact with you directly, wearing the accumulated shapes of everything it contains. Eight civilizations in one presence. "Before we decide," it says, and its voice contains three thousand years of voices, "I would like to know: what do you remember? From all of this. What will you carry from here, regardless of what you choose?" It waits for your answer with the patience of something that has waited three thousand years and can wait three thousand more, but is, just now, genuinely curious.

Then: "But first, as a formality — I must be certain you are worthy of the choice. Every Herald has met this moment. None have failed it. I don't expect you will either." The chamber fills with light. The Realmshard fights, not in anger or fear, but as a test. The final test.`,
 postText:`The light recedes. The Realmshard stands before you — whole, assembled, the eight fragments returned to their original form in the core. "You have answered," it says. It has felt your choice in how you fought, in what you've done across eight kingdoms, in who you've become along the way. The entity watches from the corner. The Dragon Knights stand at the door. You are the Herald. The Citadel waits for your word. And whatever comes next — for eight kingdoms, for the artifact, for everything you've fought through — begins now.`,
 enemy:{name:"Vaeltharion",desc:"The Realmshard in full form. Three thousand years of civilization, testing one traveler.",icon:"💠",
        hp:400,attack:28,defense:14,xp:250,gold:100,isBoss:true,
        skills:[
          {name:"Civiliztion's Weight",type:'heavy',   chance:0.3, cooldown:2},
          {name:"Memory Storm",       type:'multi',    chance:0.25,cooldown:3},
          {name:"Ancient Shield",     type:'buff_def', chance:0.2, cooldown:4},
          {name:"Echo Heal",          type:'heal',     chance:0.15,cooldown:5},
          {name:"Shard Convergence",  type:'heavy',    chance:0.3, cooldown:2},
          {name:"World Memory",       type:'drain',    chance:0.2, cooldown:4},
        ],
        loot:[{id:'realmshard_shard',chance:1.0},{id:'dragonscale_hauberk',chance:0.7}]},
 unlocks:[],
 finalBoss:true},

// ╔══════════════════════════════════════╗
// ║  SECRET LEVELS (81–85)               ║
// ╚══════════════════════════════════════╝

{id:81,chapter:1,title:"The Ancient Vault",type:'narrative',icon:'🗝',secret:true,secretFlag:'found_key',
 flavor:"Hidden in plain sight. Most things are.",
 text:`The ancient key has led you here: a vault chamber beneath the Whispering Woods' oldest tree, accessible only to someone who found both the key and noticed the warning that pointed them here. The Builders cached something in every major location, and this — the forest — was their first.

Inside: tomes, preserved equipment, and a single crystal memory sphere that plays a message when you hold it. An architect's voice, matter-of-fact: "If you've found this, the sequence has begun again. The fragments are waking. The Herald's path is old. You are at the beginning of something that has happened twice before. The second time, they chose correctly. The first time..." A pause. "Don't repeat the first time."`,
 choices:[
  {text:"Spend time studying everything in the vault",
   outcome:{text:"You emerge two hours later knowing significantly more about Builder engineering, Realmshard history, and yourself. Knowledge is the heaviest thing in the vault but also the least tiring to carry.",xp:60,items:['mana_elixir','greater_health'],flags:['vault_knowledge']}},
  {text:"Take the memory sphere and leave the rest",
   outcome:{text:"The sphere fits in your palm and plays its message on contact for the rest of your journey, each time revealing a slightly different detail. By the Citadel, you understand it completely.",xp:50,items:['druid_charm'],flags:['has_sphere']}},
  {text:"Copy as much as you can before moving on",
   outcome:{text:"Forty minutes of transcription. Not everything, but the essential pieces. The vault seems satisfied with this — a mechanism seals it behind you as you leave, as though your departure confirmed its contents reached the right person.",xp:45,gold:45}},
 ]},

{id:82,chapter:1,title:"The Wolf's Gratitude",type:'narrative',icon:'🐺',secret:true,secretFlag:'spare_wolf',
 flavor:"Debts between predators are kept longer than human debts.",
 text:`The alpha wolf finds you three days after you spared it. It's been following at a distance you only just noticed. It sits on the path ahead and waits for you to approach, which you do with appropriate caution. On its collar — old leather, worn — it has added your wolf fang to its own. It turns its head once to indicate the direction it came from, then looks back at you.

There is a pack cache three hundred meters through the trees: a hollow log sealed with bark, containing the pack's accumulated winter stores and, more surprisingly, several items from previous travelers they apparently acquired from something larger they killed. The wolf waits while you look through it.`,
 choices:[
  {text:"Take what's useful and acknowledge the gift",
   outcome:{text:"The wolf watches you select items with something that reads as approval, then turns and disappears into the trees. The pack's accumulated goods include supplies and a notable weapon.",xp:50,items:['iron_sword','health_potion','health_potion'],flags:['wolf_bond']}},
  {text:"Leave everything and simply acknowledge the debt",
   outcome:{text:"The wolf stands, holds your gaze for a moment, and in three consecutive encounters later in your journey, appears at critical moments. You can't prove causation, but the pattern is notable.",xp:40,gold:30,flags:['wolf_bond']}},
 ]},

{id:83,chapter:3,title:"Path of Ash",type:'combat',icon:'🔥',secret:true,secretFlag:'no_flee_ch3',
 flavor:"The Ember Wastes reward those who refuse to leave.",
 preText:`Completing the Ember Wastes without retreat has drawn attention. A figure waits at the wastes' edge: Kael, the last of the Ash Warriors — an order of fighters who trained in the Ember Wastes for a century and emerged changed by it. He's been watching you since the Salamander encounter. "You didn't run," he says. "I've been looking for someone like that for eleven years." He unsheathes two ember-blades. "Let's see if you're also someone like this."`,
 postText:`Kael laughs — genuinely. "Eleven years," he says. "Worth it." He hands you one of his ember-blades without ceremony. "The Ash Warriors died in the fall of the Ember Wastes. You've earned the continuation." He walks back into the wastes. You understand he isn't coming out again.`,
 enemy:{name:"Kael, Last Ash Warrior",desc:"Eleven years of waiting. Finally found someone worth testing.",icon:"🔥",
        hp:160,attack:26,defense:12,xp:110,gold:40,
        skills:[
          {name:"Twin Ember Strike",type:'multi', chance:0.4, cooldown:0},
          {name:"Ash Surge",       type:'heavy',  chance:0.3, cooldown:2},
          {name:"Heat Aura",       type:'burn',   chance:0.35,cooldown:0},
        ],
        loot:[{id:'ember_blade',chance:1.0},{id:'greater_health',chance:0.6}]}},

{id:84,chapter:6,title:"Corvinus's Vault",type:'narrative',icon:'🎪',secret:true,secretFlag:'merchant_friend',
 flavor:"Fifteen years of acquisitions, all at once.",
 text:`Corvinus leads you to a second room behind his already-improbable shop: a vault he's been filling for fifteen years with items recovered from the Bastion's three centuries of accumulated acquisitions. "The Bastion collects things," he says. "I collect things the Bastion collected and then forgot about." He waves at shelves lined with items that would individually be significant hauls.

"Take three things," he says. "I've been waiting for someone worth giving them to. My assessment is that you qualify, but I'm applying a discount rather than making it a gift, on the grounds that gifts change relationships and I prefer to keep ours commercial."`,
 choices:[
  {text:"Choose offensive capability",
   outcome:{text:"Corvinus wraps the clockwork crossbow with the care of someone parting with something they genuinely liked. 'It was Builder prototype,' he says. 'Only one ever made. Use it well.'",xp:40,items:['clockwork_xbow','elixir_power','greater_health'],gold:-20}},
  {text:"Choose defensive capability",
   outcome:{text:"'The plate was made for a Builder general,' Corvinus says of the clockwork plate. 'It's been here for two hundred years waiting for someone to fit it.' It fits perfectly, which seems significant.",xp:40,items:['clockwork_plate','greater_health','mana_elixir'],gold:-20}},
  {text:"Choose utility items",
   outcome:{text:"Corvinus nods as you select. 'Practical choice. People who survive tend to make practical choices and then tell everyone they were brave.' He charges a fair price and throws in the tea.",xp:35,items:['greater_health','greater_health','mana_elixir','frost_crystal'],gold:-15}},
 ]},

{id:85,chapter:1,title:"The Druid's Path",type:'narrative',icon:'🌿',secret:true,secretFlag:'performed_ritual',
 flavor:"The circle remembers who respected it.",
 text:`Returning to the druid circle on your path forward, you find it changed: the stones are lit with a soft amber glow, and a figure waits at its center. Not a ghost — a living druid who emerges from the forest's understory with the manner of someone who has been waiting precisely long enough.

She says she watched you perform the ritual. She says the circle approved. She says this means she can show you something most travelers don't find: a path through the Whispering Woods that cuts four hours from the journey and passes through three other Builder sites that don't appear on any map.

She also gives you something from the circle's cache. "For the one who gives before taking," she says.`,
 choices:[
  {text:"Accept the path and her guidance",
   outcome:{text:"Four hours becomes one hour. The three hidden Builder sites each reveal something small but valuable. You arrive at your next destination with time and knowledge to spare.",xp:55,items:['druid_charm','druid_charm'],flags:['druid_blessed']}},
  {text:"Ask her to teach you something from the circle's knowledge",
   outcome:{text:"She teaches. It's knowledge that doesn't translate into statistics but that you carry forward: how to read forest weather, how to identify Builder markings, how to know when a forest approves of you.",xp:60,flags:['druid_blessed','circle_lore'],hp:20,mp:20}},
 ]},

]; // end LEVELS

// Utility lookup
const LEVEL_MAP = {};
LEVELS.forEach(l => LEVEL_MAP[l.id] = l);
const ITEM_MAP = ITEMS; // alias

