// systems/spell_loot.js

// options: { innateCount: 2, total: 5 }
function rollSpellChoices(player, options = {}) {
  const total = options.total ?? 5;
  const innateCount = options.innateCount ?? 2;

  const innateSchools = [player.innateSchool, player.innateSchool2].filter(Boolean);
  const innatePool = innateSchools.flatMap(s => SPELLS_BY_SCHOOL[s] || []);

  const choices = [];
  const usedIds = new Set();

  // 1. Гарантированные карточки из врождённой школы
  const shuffledInnate = shuffle(innatePool);
  for (const spell of shuffledInnate) {
    if (choices.length >= innateCount) break;
    if (usedIds.has(spell.id)) continue;
    usedIds.add(spell.id);
    choices.push({ kind: 'new', spell });
  }

  // 2. Остальные — из всех школ
  const allSpells = Object.values(SPELLS_DB);
  const shuffledAll = shuffle(allSpells);
  for (const spell of shuffledAll) {
    if (choices.length >= total) break;
    if (usedIds.has(spell.id)) continue;
    usedIds.add(spell.id);
    choices.push({ kind: 'new', spell });
  }

  // 3. Опции апгрейда (отдельный список)
  const upgrades = [];
  for (const spellId in player.learnedSpells) {
    if (canUpgrade(spellId)) {
      upgrades.push({ kind: 'upgrade', spell: SPELLS_DB[spellId] });
    }
  }

  return { choices: shuffle(choices), upgrades };
}

// Ролл скилла конкретной редкости (для сундуков)
function rollSpellOfRarity(rarityId, options = {}) {
  const pool = SPELLS_BY_RARITY[rarityId] || [];
  if (pool.length === 0) return null;
  const filtered = pool.filter(id => {
    const s = SPELLS_DB[id];
    return options.allowHidden || !s.hidden;
  });
  if (filtered.length === 0) return null;
  return { ...SPELLS_DB[pick(filtered)], isSpell: true };
}

window.rollSpellChoices = rollSpellChoices;
window.rollSpellOfRarity = rollSpellOfRarity;
