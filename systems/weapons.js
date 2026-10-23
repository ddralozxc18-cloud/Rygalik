/* systems/weapons.js — генерация и параметры оружия.
   Зависимости: WEAPONS_DB, RARITIES, Items, RNG */
(function () {
  'use strict';
  const Weapons = {
    // Случайное оружие заданной редкости (через Items.create)
    spawnRandom(rarityId) {
      const pool = window.WEAPONS_DB || [];
      const def = window.RNG.pick(pool);
      if (!def) return null;
      const inst = window.Items.create(def.id, rarityId);
      if (!inst) return null;
      inst.slot = 'hand';
      return inst;
    },

    // Выкатить редкость по весам RARITIES (+бонус удачи)
    rollRarity(lootBonus) {
      const entries = (window.RARITIES || []).map((r) => ({ item: r.id, weight: r.weight }));
      if (lootBonus && entries.length > 1) {
        for (let i = 1; i < entries.length; i++) {
          entries[i].weight *= (1 + lootBonus * i);
        }
      }
      return window.RNG.weighted(entries) || 'common';
    },

    // Итоговый урон выстрела/удара с учётом крита
    computeDamage(weaponInst, stats) {
      let dmg = (weaponInst && weaponInst.damage) || 1;
      const crit = ((weaponInst && weaponInst.crit) || 0) + ((stats && stats.critChance) || 0);
      const isCrit = window.RNG.chance(crit);
      if (isCrit) dmg = Math.round(dmg * 2);
      if (stats && stats.fireDmg) dmg += stats.fireDmg;
      return { damage: Math.max(1, dmg), crit: isCrit };
    },
  };
  window.Weapons = Weapons;
})();
