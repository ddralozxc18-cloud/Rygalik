/* data/rarities.js — 5 редкостей (общая шкала для items/weapons/spells) */
(function () {
  'use strict';
  window.RARITIES = [
    { id: 'common',    name: 'Обычное',    color: '#b8c0cc', glow: 0x8a94a3, weight: 60, statMult: 1.0 },
    { id: 'uncommon',  name: 'Необычное',  color: '#57d95a', glow: 0x2ea52e, weight: 25, statMult: 1.25 },
    { id: 'rare',      name: 'Редкое',     color: '#4c8dfb', glow: 0x2f6ae0, weight: 10, statMult: 1.6 },
    { id: 'epic',      name: 'Эпическое',  color: '#b45cf5', glow: 0x8a2fd6, weight: 4,  statMult: 2.1 },
    { id: 'legendary', name: 'Легендарное',color: '#f0a12a', glow: 0xd67f10, weight: 1,  statMult: 3.0 },
  ];
  window.getRarity = function (id) {
    for (const r of window.RARITIES) if (r.id === id) return r;
    return window.RARITIES[0];
  };
})();
