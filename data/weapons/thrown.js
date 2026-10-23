/* data/weapons/thrown.js — бумеранги, гранаты, метательные ножи */
(function () {
  'use strict';
  window.THROWN_DB = [
    { id: 'boomerang', name: 'Бумеранг', icon: '🪃', baseDamage: 6, projectileSpeed: 14, returns: true },
    { id: 'grenade',   name: 'Граната',  icon: '💣', baseDamage: 15, projectileSpeed: 9, aoeRadius: 3 },
    { id: 'knife',     name: 'Мет. нож', icon: '🔪', baseDamage: 4, projectileSpeed: 20 },
  ];
})();
