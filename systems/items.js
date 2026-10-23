/* systems/items.js — генерация предметов с редкостью и аффиксами,
   экипировка в слоты. Зависимости: RARITIES, AFFIXES, ITEMS_DB, RNG */
(function () {
  'use strict';
  const Items = {
    nextInstanceId: 1,

    // Создать конкретный предмет (по id из ITEMS_DB/WEAPONS_DB) с редкостью
    create(itemId, rarityId) {
      const def = (window.getItemDef && window.getItemDef(itemId)) ||
                  (window.getWeaponDef && window.getWeaponDef(itemId));
      if (!def) return null;
      const rarity = window.getRarity(rarityId || 'common');
      const inst = Object.assign({}, def, {
        instanceId: this.nextInstanceId++,
        defId: def.id,
        rarity: rarity.id,
        rarityName: rarity.name,
        color: rarity.color,
        rarityMult: rarity.statMult,
        affixes: [],
        name: def.name,
      });
      // Перегенерируем статы с множителем редкости
      if (def.stats) {
        inst.stats = {};
        for (const k in def.stats) inst.stats[k] = +(def.stats[k] * rarity.statMult).toFixed(2);
      }
      if (typeof def.baseDamage === 'number') {
        inst.damage = Math.round(def.baseDamage * rarity.statMult);
      } else if (typeof def.damage === 'number') {
        inst.damage = Math.round(def.damage * rarity.statMult);
      }
      return inst;
    },

    // Случайный предмет указанной редкости
    createRandom(rarityId) {
      const pool = (window.ITEMS_DB || []).concat(window.WEAPONS_DB || []);
      const def = window.RNG.pick(pool);
      if (!def) return null;
      const inst = this.create(def.id, rarityId);
      if (!inst) return null;
      // Аффиксы: шанс зависит от редкости
      const affixCount = { common: 0, uncommon: 1, rare: 1, epic: 2, legendary: 3 }[inst.rarity] || 0;
      const chosen = window.RNG.pickMany(window.AFFIXES || [], affixCount);
      for (const ax of chosen) {
        if (!inst.stats) inst.stats = {};
        ax.apply(inst.stats);
        inst.affixes.push(ax.name);
      }
      if (inst.affixes.length) {
        inst.name = inst.affixes[0] + ' ' + inst.name.toLowerCase();
      }
      return inst;
    },

    // В какой слот экипируется предмет
    slotFor(item) {
      if (item.slot) return item.slot;
      if (item.category) return 'hand'; // оружие — в слот руки
      return null;
    },

    // Экипировать предмет; возвращает вынутый ранее предмет или null
    equip(equipmentState, item) {
      const slot = this.slotFor(item);
      if (!slot || !equipmentState.hasOwnProperty(slot)) return null;
      const prev = equipmentState[slot];
      equipmentState[slot] = item;
      return prev;
    },

    unequip(equipmentState, slot) {
      const prev = equipmentState[slot];
      if (slot === 'hand') equipmentState[slot] = window.DEFAULT_HAND_REF || null;
      else equipmentState[slot] = null;
      return prev;
    },
  };
  window.Items = Items;
})();
