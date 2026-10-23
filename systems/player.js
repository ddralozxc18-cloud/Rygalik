/* systems/player.js — агрегатор статов от экипированных предметов,
   оружия и пассивных скиллов. Зависимости: данные data/* */
(function () {
  'use strict';
  const Player = {
    // Суммирует stats всех экипированных слотов + пассивных скиллов
    aggregateStats(equipmentState, learnedSpells) {
      const stats = {
        armor: 0, maxHp: 0, maxMana: 0, moveBonus: 0, fireDmg: 0,
        critChance: 0, lifesteal: 0, lootBonus: 0, hpRegenBonus: 0,
        spellPower: 1.0, damage: 0,
      };
      const applyStats = (obj) => {
        if (!obj || !obj.stats) return;
        for (const k in obj.stats) {
          stats[k] = (stats[k] || 0) + obj.stats[k];
        }
      };
      const slots = ['hand', 'active1', 'active2', 'passive1', 'passive2'];
      for (const slotName of slots) {
        const item = equipmentState[slotName];
        if (!item) continue;
        applyStats(item);
        if (typeof item.damage === 'number' && slotName === 'hand') stats.damage += item.damage;
        if (typeof item.spellPower === 'number') stats.spellPower += item.spellPower - 1;
      }
      for (const ls of (learnedSpells || [])) {
        const def = window.getSpellDef ? window.getSpellDef(ls.id) : null;
        if (def && def.passive) applyStats(def);
      }
      return stats;
    },
    // Итоговый урон руки: базовый урон оружия * множитель редкости + бонусы
    getHandDamage(equipmentState, stats) {
      const hand = equipmentState.hand;
      const base = (hand && typeof hand.damage === 'number') ? hand.damage : 1;
      const mult = (hand && hand.rarityMult) || 1;
      return Math.max(1, Math.round(base * mult + (stats ? stats.damage : 0)));
    },
  };
  window.Player = Player;
})();
