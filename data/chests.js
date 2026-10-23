/* data/chests.js — типы сундуков + таблицы лута */
(function () {
  'use strict';
  // rarityWeights индексируются по позиции в RARITIES (common..legendary)
  window.CHESTS_DB = [
    {
      id: 'wooden', name: 'Деревянный сундук', color: 0x8a5a2b,
      xp: 15,
      rarityWeights: [55, 30, 12, 3, 0],
      lootPool: ['potion_hp', 'potion_mana', 'gem'],
    },
    {
      id: 'iron', name: 'Железный сундук', color: 0x9aa3ad,
      xp: 30,
      rarityWeights: [30, 35, 25, 8, 2],
      lootPool: ['potion_hp', 'potion_mana', 'gem', 'weapon'],
    },
    {
      id: 'arcane', name: 'Таинственный сундук', color: 0x7a4fd6,
      xp: 60,
      rarityWeights: [8, 20, 35, 27, 10],
      lootPool: ['gem', 'weapon', 'spell'],
    },
  ];
})();
