/* systems/chests.js — спавн и открытие сундуков.
   Зависимости: CHESTS_DB, RARITIES, RNG, Items, Weapons */
(function () {
  'use strict';
  const Chests = {
    pickType() {
      return window.RNG.pick(window.CHESTS_DB || []);
    },

    // Роль редкости по весам сундука
    rollRarity(chestDef, luckBonus) {
      const weights = (chestDef.rarityWeights || [100]).slice();
      if (luckBonus) {
        for (let i = 1; i < weights.length; i++) weights[i] *= (1 + luckBonus * i);
      }
      const entries = weights.map((w, i) => ({
        item: (window.RARITIES[i] || window.RARITIES[0]).id, weight: w,
      }));
      return window.RNG.weighted(entries) || 'common';
    },

    // Открыть сундук: вернуть { items:[], xp }
    open(chestDef, stats) {
      const luckBonus = (stats && stats.lootBonus) || 0;
      const items = [];
      const rolls = window.RNG.int(1, 3);
      for (let i = 0; i < rolls; i++) {
        const rarity = this.rollRarity(chestDef, luckBonus);
        const poolTag = window.RNG.pick(chestDef.lootPool || ['gem']);
        let inst = null;
        if (poolTag === 'weapon') inst = window.Weapons.spawnRandom(rarity);
        else if (poolTag === 'spell') inst = window.RNG.pick(window.SPELLS_DB || []);
        else inst = window.Items.create(poolTag, rarity);
        if (inst) items.push(inst);
      }
      return { items, xp: chestDef.xp || 10 };
    },
  };
  window.Chests = Chests;
})();
