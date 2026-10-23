/* data/items/consumables.js — зелья и расходники */
(function () {
  'use strict';
  window.CONSUMABLES_DB = [
    { id: 'potion_hp',   name: 'Зелье здоровья', icon: '♥', color: '#e0403a', slot: null,
      use: (s) => { s.hp = Math.min(s.maxHp, s.hp + 35); } },
    { id: 'potion_mana', name: 'Зелье маны',     icon: '✦', color: '#4c8dfb', slot: null,
      use: (s) => { s.mana = Math.min(s.maxMana, s.mana + 40); } },
    { id: 'gem',         name: 'Кристалл',       icon: '◆', color: '#7dd3fc', slot: null, currency: true,
      use: null },
    { id: 'elixir_wartorn', name: 'Эликсир войны', icon: '⚗', color: '#f0a12a', slot: null,
      use: (s) => { s.hp = Math.min(s.maxHp, s.hp + 15); s.mana = Math.min(s.maxMana, s.mana + 15); } },
  ];
})();
