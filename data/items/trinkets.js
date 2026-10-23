/* data/items/trinkets.js — талисманы (активные и пассивные слоты) */
(function () {
  'use strict';
  window.TRINKETS_DB = [
    { id: 'hp_potion_trinket', name: 'Талисман исцеления', icon: '💧', color: '#e0403a', slot: 'active1',
      use: (s) => { s.hp = Math.min(s.maxHp, s.hp + 25); } },
    { id: 'mana_crystal', name: 'Кристалл маны', icon: '🔮', color: '#4c8dfb', slot: 'active2',
      use: (s) => { s.mana = Math.min(s.maxMana, s.mana + 30); } },
    { id: 'swift_boots_charm', name: 'Амулет скорости', icon: '👟', color: '#7dd3fc', slot: 'passive2', stats: { moveBonus: 0.4 } },
    { id: 'vamp_fang', name: 'Клык вампира', icon: '🦇', color: '#b45cf5', slot: 'passive2', stats: { lifesteal: 0.1 } },
  ];
})();
