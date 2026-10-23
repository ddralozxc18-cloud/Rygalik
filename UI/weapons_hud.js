/* UI/weapons_hud.js — HUD слотов рук (текущее оружие/скиллы).
   Обновляет иконки в #hud-active-1/#hud-active-2 и показывает текущую
   руку (костюм/оружие) рядом с прицелом. */
(function () {
  'use strict';
  const WeaponsHud = {
    els: null,

    init() {
      this.els = {
        a1: document.getElementById('hud-active-1-icon'),
        a2: document.getElementById('hud-active-2-icon'),
      };
    },

    update() {
      if (!this.els) this.init();
      const bridge = window.GameBridge;
      if (!bridge || !this.els.a1) return;
      const eq = bridge.getEquipment();
      const now = bridge.getTime ? bridge.getTime() : 0;

      const fill = (iconEl, item, keyLabel) => {
        const parent = iconEl.parentElement;
        if (item) {
          let label = item.icon || '?';
          // Кулдаун активных скиллов
          let cd = 0;
          if (window.Spells && item.id && window.Spells.find(item.id)) {
            const l = window.Spells.find(item.id);
            const def = window.getSpellDef(item.id);
            if (def && l.cooldownUntil > now) cd = l.cooldownUntil - now;
          }
          iconEl.textContent = cd > 0 ? Math.ceil(cd) : label;
          parent.classList.add('filled');
          parent.style.color = item.color || '#eae6da';
          parent.title = item.name || '';
        } else {
          iconEl.textContent = '';
          parent.classList.remove('filled');
          parent.style.color = '';
          parent.removeAttribute('title');
        }
      };
      fill(this.els.a1, eq.active1, 'Shift');
      fill(this.els.a2, eq.active2, 'C');
    },
  };
  window.WeaponsHud = WeaponsHud;
})();
