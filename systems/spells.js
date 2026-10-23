/* systems/spells.js — изученные заклинания, кулдауны, применение.
   Зависимости: SPELLS_DB, getSpellUpgradeMult, RNG.
   game.js передаёт в cast() объект api с игровыми действиями. */
(function () {
  'use strict';
  const Spells = {
    // Список изученных: [{ id, level, cooldownUntil }]
    learned: [],

    learn(spellId) {
      const def = window.getSpellDef(spellId);
      if (!def) return false;
      if (this.find(spellId)) return false;
      this.learned.push({ id: spellId, level: 1, cooldownUntil: 0 });
      // Пассивные скиллы сразу идут в пассивный слот экипировки
      if (def.passive && def.slot && window.equipmentStateRef) {
        window.equipmentStateRef[def.slot] = Object.assign({}, def);
      }
      return true;
    },

    find(spellId) {
      for (const l of this.learned) if (l.id === spellId) return l;
      return null;
    },

    upgrade(spellId) {
      const l = this.find(spellId);
      if (!l || l.level >= 5) return false;
      l.level++;
      return true;
    },

    isReady(spellId, now) {
      const l = this.find(spellId);
      const def = window.getSpellDef(spellId);
      if (!l || !def) return false;
      return now >= (l.cooldownUntil || 0);
    },

    // Применить заклинание; now — время в секундах (clock elapsed)
    cast(spellId, now, api) {
      const l = this.find(spellId);
      const def = window.getSpellDef(spellId);
      if (!l || !def || def.passive) return false;
      if (now < (l.cooldownUntil || 0)) return false;
      if (api.state.mana < def.manaCost) return false;
      api.state.mana -= def.manaCost;
      l.cooldownUntil = now + def.cooldown;
      const mult = window.getSpellUpgradeMult(spellId, l.level);
      if (def.cast) def.cast(api, mult);
      return true;
    },

    // Активация из слота экипировки (Shift/C): item имеет id скилла
    castFromSlot(slotItem, now, api) {
      if (!slotItem || !slotItem.id) return false;
      return this.cast(slotItem.id, now, api);
    },

    reset() {
      this.learned = [];
    },
  };
  window.Spells = Spells;
})();
