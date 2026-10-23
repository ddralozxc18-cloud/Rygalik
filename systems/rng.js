/* systems/rng.js — детерминированный ГСЧ (mulberry32) + лут-рулетики.
   Экспортирует window.RNG. Подключать ПЕРВЫМ среди систем. */
(function () {
  'use strict';
  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const RNG = {
    _rand: mulberry32((Math.random() * 0xFFFFFFFF) >>> 0),
    setSeed(seed) { this._rand = mulberry32(seed >>> 0); },
    random() { return this._rand(); },
    float(min, max) { return min + this._rand() * (max - min); },
    int(min, max) { return Math.floor(this.float(min, max + 1)); },
    chance(p) { return this._rand() < p; },
    pick(arr) { return (arr && arr.length) ? arr[Math.floor(this._rand() * arr.length)] : null; },
    shuffle(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(this._rand() * (i + 1));
        const t = arr[i]; arr[i] = arr[j]; arr[j] = t;
      }
      return arr;
    },
    // Выбор из [{item, weight}, ...]
    weighted(entries) {
      let total = 0;
      for (const e of entries) total += (e.weight || 0);
      if (total <= 0) return null;
      let roll = this._rand() * total;
      for (const e of entries) {
        roll -= (e.weight || 0);
        if (roll <= 0) return e.item !== undefined ? e.item : e;
      }
      return entries[entries.length - 1].item;
    },
    // N уникальных элементов без повторов
    pickMany(arr, n) {
      const copy = arr.slice();
      const out = [];
      while (out.length < n && copy.length > 0) {
        out.push(copy.splice(Math.floor(this._rand() * copy.length), 1)[0]);
      }
      return out;
    },
  };
  window.RNG = RNG;
})();
