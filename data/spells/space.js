/* data/spells/space.js — пространство */
(function () {
  'use strict';
  window.SPACE_SPELLS = [
    { id: 'teleportation', name: 'Телепорт', icon: '🌀', img: 'img/magical_blood/teleportation.webp',
      school: 'space', slot: 'active1', manaCost: 30, cooldown: 4,
      desc: 'Мгновенный рывок вперёд на 8 метров.',
      cast: (api) => api.blink(8) },
    { id: 'speedu', name: 'Ускорение', icon: '⚡', img: 'img/magical_blood/speedu.webp',
      school: 'space', slot: 'active2', manaCost: 15, cooldown: 6,
      desc: '+60% к скорости передвижения на 5 секунд.',
      cast: (api) => api.haste(0.6, 5) },
  ];
})();
