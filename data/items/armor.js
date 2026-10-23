/* data/items/armor.js — броня (пассивные слоты) */
(function () {
  'use strict';
  window.ARMOR_DB = [
    { id: 'leather_vest', name: 'Кожаный жилет', icon: '🛡', color: '#a5793d', slot: 'passive1', stats: { armor: 2 } },
    { id: 'mage_robe',    name: 'Мантия мага',   icon: '🥋', color: '#6f8fe8', slot: 'passive1', stats: { maxMana: 15 } },
    { id: 'iron_plate',   name: 'Железная кираса',icon: '🛡', color: '#9aa3ad', slot: 'passive1', stats: { armor: 5, moveBonus: -0.2 } },
    { id: 'lucky_charm_armor', name: 'Обмундирование удачливого', icon: '🍀', color: '#57d95a', slot: 'passive2', stats: { armor: 1, lootBonus: 0.1 } },
  ];
})();
