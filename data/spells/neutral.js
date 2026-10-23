/* data/spells/neutral.js — универсальные заклинания (доступны всем школам) */
(function () {
  'use strict';
  window.NEUTRAL_SPELLS = [
    { id: 'flare', name: 'Вспышка', icon: '💫', img: 'img/abilitie/energy.webp',
      school: 'neutral', slot: null, manaCost: 18, cooldown: 0,
      desc: 'Базовая способность: выпустить сгусток энергии (ПКМ).',
      cast: (api) => api.castFlare() },
    { id: 'minor_heal', name: 'Малое исцеление', icon: '➕', img: 'img/abilitie/fire.webp',
      school: 'neutral', slot: 'passive2', manaCost: 0, cooldown: 0, passive: true,
      desc: 'Регенерация здоровья +0.5/сек.',
      stats: { hpRegenBonus: 0.5 } },
  ];
})();
