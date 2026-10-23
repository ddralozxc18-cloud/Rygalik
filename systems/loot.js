/* systems/loot.js — таблицы дропа врагов и общих сборов.
   Зависимости: ENEMIES_DB, ITEMS_DB, RNG, Items, Weapons, SpellLoot */
(function () {
  'use strict';
  const Loot = {
    // Дроп с убитого врага: массив предметов-инстансов
    rollEnemyDrop(enemyDef, stats) {
      const out = [];
      if (!enemyDef || !enemyDef.dropTable) return out;
      const luckBonus = (stats && stats.lootBonus) || 0;
      for (const entry of enemyDef.dropTable) {
        const p = { gem: 0.6, potion_hp: 0.35, potion_mana: 0.35 }[entry] || 0.25;
        if (window.RNG.chance(Math.min(0.95, p * (1 + luckBonus)))) {
          const rarity = window.Weapons
            ? window.Weapons.rollRarity(luckBonus) : 'common';
          const inst = window.Items.create(entry, rarity);
          if (inst) out.push(inst);
        }
      }
      // Шанс свитка заклинания
      const spell = window.SpellLoot.rollSpellDrop(0.12 * (1 + luckBonus));
      if (spell) out.push(Object.assign({}, spell, { isSpellScroll: true, color: '#b45cf5' }));
      return out;
    },

    // Конвертировать выпавший предмет в «_collectible» для мира игры
    toWorldDrop(item, pos) {
      return { item, x: pos.x, z: pos.z };
    },
  };
  window.Loot = Loot;
})();
