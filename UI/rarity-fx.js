/* UI/rarity-fx.js — свечение и частицы по редкости (DOM + THREE). */
(function () {
  'use strict';
  const RarityFx = {
    applyToElement(el, rarityId) {
      const r = window.getRarity ? window.getRarity(rarityId) : null;
      if (!r) return;
      el.style.borderColor = r.color;
      el.style.boxShadow = '0 0 8px ' + r.color + '66, inset 0 0 6px ' + r.color + '33';
      if (r.id === 'legendary' || r.id === 'epic') {
        el.classList.add('rarity-pulse');
      }
    },

    // Создать THREE.PointLight для свечения предмета в мире
    worldGlow(rarityId) {
      if (!window.THREE) return null;
      const r = window.getRarity ? window.getRarity(rarityId) : null;
      const intensity = r ? { common: 0.2, uncommon: 0.35, rare: 0.55, epic: 0.8, legendary: 1.2 }[r.id] : 0.3;
      const light = new THREE.PointLight(r ? r.glow : 0xffffff, intensity, 4);
      return light;
    },
  };
  // CSS для пульсации эпика/легендарки
  const style = document.createElement('style');
  style.textContent = '@keyframes rarityPulse{0%,100%{filter:brightness(1)}50%{filter:brightness(1.35)}}' +
    '.rarity-pulse{animation:rarityPulse 1.6s ease-in-out infinite}';
  document.head.appendChild(style);
  window.RarityFx = RarityFx;
})();
