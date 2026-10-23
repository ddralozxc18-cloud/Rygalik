/* data/spells/luck.js — удача/казино */
(function () {
  'use strict';
  window.LUCK_SPELLS = [
    { id: 'kill_mana', name: 'Жатва маны', icon: '💠', img: 'img/magical_blood/kill_mana.webp',
      school: 'luck', slot: 'passive1', manaCost: 0, cooldown: 0, passive: true,
      desc: 'Убийство цели возвращает 15 маны.',
      onKill: (api) => api.restoreMana(15) },
    { id: 'mana_recovery', name: 'Восстановление', icon: '✳', img: 'img/magical_blood/mana_recovery.webp',
      school: 'luck', slot: 'active2', manaCost: 0, cooldown: 12,
      desc: 'Мгновенно восполняет 40 маны (шанс 25% — вдвое больше).',
      cast: (api) => api.luckyMana(40) },
    { id: 'boomerang_spell', name: 'Бумеранг судьбы', icon: '🪃', img: 'img/magical_blood/boomerang.webp',
      school: 'luck', slot: 'active1', manaCost: 10, cooldown: 1,
      desc: 'Метаете бумеранг, который возвращается к вам.',
      cast: (api) => api.throwBoomerang({ damage: 10, speed: 15 }) },
  ];
})();
