/* systems/spell_loot.js — выпадение скиллов из сундуков/врагов и
   пул выбора 5 карточек на левелапе. Зависимости: SPELLS_DB, RNG */
(function () {
  'use strict';
  const SpellLoot = {
    // Все доступные заклинания (с учётом врождённой школы: своя школа чаще)
    availablePool(schoolId) {
      const pool = (window.SPELLS_DB || []).slice();
      if (schoolId) {
        for (const s of pool) {
          s._weight = (s.school === schoolId) ? 3 : 1;
        }
      } else {
        for (const s of pool) s._weight = 1;
      }
      return pool;
    },

    // Предложить N карточек на выбор (не повторяя изученные пассивы)
    offerChoices(count, schoolId, learnedIds) {
      const learned = learnedIds || [];
      let pool = this.availablePool(schoolId).filter((s) => {
        // активные скиллы можно брать несколько раз? — нет, уникальны
        return learned.indexOf(s.id) === -1;
      });
      if (pool.length < count) {
        pool = this.availablePool(schoolId).slice();
      }
      const entries = pool.map((s) => ({ item: s, weight: s._weight }));
      const out = [];
      const copy = entries.slice();
      while (out.length < count && copy.length > 0) {
        const idx = Math.floor(window.RNG.random() * copy.length);
        out.push(copy.splice(idx, 1)[0].item);
      }
      return out;
    },

    // Шанс выбросить свиток заклинания из врага/сундука
    rollSpellDrop(chance) {
      if (!window.RNG.chance(chance !== undefined ? chance : 0.2)) return null;
      return window.RNG.pick(window.SPELLS_DB || []);
    },
  };
  window.SpellLoot = SpellLoot;
})();
