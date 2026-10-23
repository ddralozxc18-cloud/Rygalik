/* data/affixes.js — пул аффиксов для предметов и оружия */
(function () {
  'use strict';
  // prefix — ставится перед названием, suffix — после
  window.AFFIXES = [
    { id: 'sturdy',   kind: 'prefix', name: 'Крепкий',    apply: (s) => { s.armor = (s.armor || 0) + 2; } },
    { id: 'vital',    kind: 'prefix', name: 'Живучий',    apply: (s) => { s.maxHp = (s.maxHp || 0) + 15; } },
    { id: 'arcane',   kind: 'prefix', name: 'Таинственный',apply:(s) => { s.maxMana = (s.maxMana || 0) + 12; } },
    { id: 'swift',    kind: 'prefix', name: 'Проворный',  apply: (s) => { s.moveBonus = (s.moveBonus || 0) + 0.3; } },
    { id: 'burning',  kind: 'suffix', name: 'Горения',    apply: (s) => { s.fireDmg = (s.fireDmg || 0) + 3; } },
    { id: 'thunder',  kind: 'suffix', name: 'Грозы',      apply: (s) => { s.critChance = (s.critChance || 0) + 0.05; } },
    { id: 'vampiric', kind: 'suffix', name: 'Вампира',    apply: (s) => { s.lifesteal = (s.lifesteal || 0) + 0.08; } },
    { id: 'lucky',    kind: 'suffix', name: 'Удачи',      apply: (s) => { s.lootBonus = (s.lootBonus || 0) + 0.1; } },
  ];
})();
