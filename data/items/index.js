/* data/items/index.js — собирает ITEMS_DB из consumables/armor/trinkets */
(function () {
  'use strict';
  const all = [];
  (window.CONSUMABLES_DB || []).forEach((i) => all.push(Object.assign({ type: 'consumable' }, i)));
  (window.ARMOR_DB || []).forEach((i) => all.push(Object.assign({ type: 'armor' }, i)));
  (window.TRINKETS_DB || []).forEach((i) => all.push(Object.assign({ type: 'trinket' }, i)));
  window.ITEMS_DB = all;
  window.getItemDef = function (id) {
    for (const it of window.ITEMS_DB) if (it.id === id) return it;
    return null;
  };
})();
