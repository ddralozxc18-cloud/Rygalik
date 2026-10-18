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
