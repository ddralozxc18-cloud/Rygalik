/* data/enemies.js — враги, дроп, поведение */
(function () {
  'use strict';
  window.ENEMIES_DB = {
    bob: {
      id: 'bob', name: 'Bob', hp: 100, maxHp: 100, hpRegen: 2,
      mana: 100, maxMana: 100, manaRegen: 2, isImmortal: false,
      xp: 25, color: 0xff4444, behavior: 'idle_regen',
      dropTable: ['gem', 'potion_hp', 'potion_mana'],
    },
    superbob: {
      id: 'superbob', name: 'SuperBob', hp: 999999, maxHp: 999999, hpRegen: 50,
      mana: 500, maxMana: 500, manaRegen: 10, isImmortal: true,
      xp: 0, color: 0xff00ff, behavior: 'idle_regen',
      dropTable: [],
    },
  };
})();
