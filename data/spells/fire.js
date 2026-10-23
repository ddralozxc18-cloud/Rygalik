/* data/spells/fire.js — огонь */
(function () {
  'use strict';
  window.FIRE_SPELLS = [
    { id: 'fireball', name: 'Огненный шар', icon: '🔥', img: 'img/magical_blood/fireball.webp',
      school: 'fire', slot: 'active2', manaCost: 20, cooldown: 1.5,
      desc: 'Запускает шар пламени по прямой.',
      cast: (api) => api.fireProjectile({ color: 0xff6a3a, damage: 18, speed: 16 }) },
    { id: 'fire_proj', name: 'Струя огня', icon: '☄', img: 'img/magical_blood/fire_proj.webp',
      school: 'fire', slot: 'active1', manaCost: 12, cooldown: 0.8,
      desc: 'Быстрая огненная стрела.',
      cast: (api) => api.fireProjectile({ color: 0xffb347, damage: 9, speed: 24 }) },
    { id: 'smoldering', name: 'Тление', icon: '♨', img: 'img/magical_blood/smoldering.webp',
      school: 'fire', slot: 'passive1', manaCost: 0, cooldown: 0, passive: true,
      desc: 'Ваши снаряды поджигают цели: +3 урона в секунду 3 сек.',
      stats: { fireDmg: 3 } },
  ];
})();
