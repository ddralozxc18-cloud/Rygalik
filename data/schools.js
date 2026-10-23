/* data/schools.js — врождённые магии: fire, space, luck */
(function () {
  'use strict';
  window.SCHOOLS = [
    {
      id: 'fire', name: 'Огонь', icon: '🔥', color: '#ff6a3a',
      img: 'img/abilitie/fire.webp',
      desc: 'Заклинания вспыхивают жаром: поджигают цели и наносят урон по площади.',
      passive: 'Урон огненных заклинаний +15%.',
    },
    {
      id: 'space', name: 'Пространство', icon: '🌀', color: '#7dd3fc',
      img: 'img/magical_blood/teleportation.webp',
      desc: 'Искажайте расстояние: рывки, телепорты и замедляющие поля.',
      passive: 'Стоимость ман активных навыков −10%.',
    },
    {
      id: 'luck', name: 'Удача', icon: '🎲', color: '#57d95a',
      img: 'img/abilitie/energy.webp',
      desc: 'Казино решает всё: криты, редкий лут и двойные награды.',
      passive: 'Шанс выпадения редкого лута +10%.',
    },
  ];
  window.getSchool = function (id) {
    for (const s of window.SCHOOLS) if (s.id === id) return s;
    return null;
  };
})();
