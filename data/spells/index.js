/* data/spells/index.js — собирает SPELLS_DB + индексы по школам */
(function () {
  'use strict';
  const all = [];
  (window.FIRE_SPELLS || []).forEach((s) => all.push(s));
  (window.SPACE_SPELLS || []).forEach((s) => all.push(s));
  (window.LUCK_SPELLS || []).forEach((s) => all.push(s));
  (window.NEUTRAL_SPELLS || []).forEach((s) => all.push(s));

  const bySchool = {};
  const byId = {};
  for (const s of all) {
    byId[s.id] = s;
    (bySchool[s.school] = bySchool[s.school] || []).push(s);
  }

  window.SPELLS_DB = all;
  window.SPELLS_BY_SCHOOL = bySchool;
  window.getSpellDef = function (id) { return byId[id] || null; };
})();
