/* data/weapons/firearms.js — пистолеты, дробовики, винтовки */
(function () {
  'use strict';
  window.FIREARMS_DB = [
    { id: 'pistol',    name: 'Пистолет',   icon: '🔫', baseDamage: 7, pellets: 1, spread: 0.01 },
    { id: 'shotgun',   name: 'Дробовик',   icon: '💥', baseDamage: 4, pellets: 6, spread: 0.09 },
    { id: 'rifle',     name: 'Винтовка',   icon: '🎯', baseDamage: 12, pellets: 1, spread: 0.004 },
  ];
})();
