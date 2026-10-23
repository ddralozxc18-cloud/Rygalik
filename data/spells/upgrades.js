/* data/spells/upgrades.js — таблицы апгрейдов каждого скилла (ур. 1→5) */
(function () {
  'use strict';
  // Множители параметров заклинания по уровням 1..5
  window.SPELL_UPGRADES = {
    default:     [1.0, 1.15, 1.3, 1.5, 1.75],
    fireball:    [1.0, 1.2, 1.4, 1.65, 2.0],
    fire_proj:   [1.0, 1.15, 1.3, 1.5, 1.7],
    teleportation:[1.0, 1.1, 1.2, 1.35, 1.5],
    speedu:      [1.0, 1.1, 1.25, 1.4, 1.6],
    kill_mana:   [1.0, 1.2, 1.4, 1.6, 1.8],
    mana_recovery:[1.0, 1.25, 1.5, 1.75, 2.0],
    boomerang_spell:[1.0, 1.2, 1.4, 1.6, 1.85],
    minor_heal:  [1.0, 1.3, 1.6, 2.0, 2.5],
  };
  window.getSpellUpgradeMult = function (spellId, level) {
    const t = window.SPELL_UPGRADES[spellId] || window.SPELL_UPGRADES.default;
    return t[Math.max(0, Math.min(t.length - 1, (level || 1) - 1))];
  };
})();
