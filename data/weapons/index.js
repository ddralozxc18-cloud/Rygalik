/* data/weapons/index.js — собирает WEAPONS_DB из всех категорий */
(function () {
  'use strict';
  const all = [];
  (window.MELEE_DB || []).forEach((w) => all.push(Object.assign({ category: 'melee' }, w)));
  (window.STAVES_DB || []).forEach((w) => all.push(Object.assign({ category: 'staff' }, w)));
  (window.THROWN_DB || []).forEach((w) => all.push(Object.assign({ category: 'thrown' }, w)));
  (window.FIREARMS_DB || []).forEach((w) => all.push(Object.assign({ category: 'firearm' }, w)));
  window.WEAPONS_DB = all;
  window.getWeaponDef = function (id) {
    for (const w of window.WEAPONS_DB) if (w.id === id) return w;
    return null;
  };
})();
