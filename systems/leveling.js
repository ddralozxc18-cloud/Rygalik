/* systems/leveling.js — опыт и уровни. Зависимости: window.RNG */
(function () {
  'use strict';
  const Leveling = {
    baseXp: 100,
    growth: 1.5,
    xpForLevel(level) { return Math.floor(this.baseXp * Math.pow(this.growth, level - 1)); },
    init(state) {
      state.level = state.level || 1;
      state.xp = state.xp || 0;
      state.xpToNextLevel = this.xpForLevel(state.level);
    },
    // Начисляет XP; возвращает массив событий уровня
    addXp(state, amount) {
      const events = [];
      state.xp += amount;
      while (state.xp >= state.xpToNextLevel) {
        state.xp -= state.xpToNextLevel;
        state.level++;
        state.maxHp += 20; state.hp = state.maxHp;
        state.maxMana += 15; state.mana = state.maxMana;
        state.xpToNextLevel = this.xpForLevel(state.level);
        events.push({ type: 'levelup', level: state.level });
      }
      return events;
    },
    grantKillXp(state, enemyDef) {
      const base = (enemyDef && enemyDef.xp) ? enemyDef.xp : 25;
      const bonus = window.RNG ? window.RNG.int(0, 10) : Math.floor(Math.random() * 11);
      return this.addXp(state, base + bonus);
    },
  };
  window.Leveling = Leveling;
})();
