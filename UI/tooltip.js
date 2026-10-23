/* UI/tooltip.js — всплывающая подсказка при наведении на предметы,
   слоты экипировки и карточки (но НЕ на врагов). */
(function () {
  'use strict';
  const Tooltip = {
    el: null,

    ensure() {
      if (this.el) return this.el;
      const d = document.createElement('div');
      d.id = 'global-tooltip';
      d.style.cssText = 'position:fixed;z-index:3000;pointer-events:none;display:none;' +
        'background:rgba(12,14,20,0.95);border:1px solid rgba(201,162,39,0.45);' +
        'color:#eae6da;font:13px/1.45 Inter,sans-serif;padding:8px 12px;border-radius:4px;' +
        'max-width:260px;box-shadow:0 4px 18px rgba(0,0,0,0.6);';
      document.body.appendChild(d);
      this.el = d;
      return d;
    },

    // content — строка HTML; anchorEl — элемент-источник
    show(content, x, y) {
      const el = this.ensure();
      el.innerHTML = content;
      el.style.display = 'block';
      this.move(x, y);
    },

    move(x, y) {
      if (!this.el) return;
      const pad = 14;
      let left = x + pad, top = y + pad;
      const r = this.el.getBoundingClientRect();
      if (left + r.width > window.innerWidth - 8) left = x - r.width - pad;
      if (top + r.height > window.innerHeight - 8) top = y - r.height - pad;
      this.el.style.left = left + 'px';
      this.el.style.top = top + 'px';
    },

    hide() {
      if (this.el) this.el.style.display = 'none';
    },

    // Собрать HTML-подсказку из предмета
    itemHTML(item) {
      if (!item) return '';
      let html = '<b style="color:' + (item.color || '#eae6da') + '">' + (item.name || '') + '</b>';
      if (item.rarityName) html += '<div style="opacity:.7">' + item.rarityName + '</div>';
      if (item.desc) html += '<div>' + item.desc + '</div>';
      if (item.stats) {
        for (const k in item.stats) {
          html += '<div class="tt-stat">+' + item.stats[k] + ' ' + Tooltip.statName(k) + '</div>';
        }
      }
      if (typeof item.damage === 'number') html += '<div>Урон: ' + item.damage + '</div>';
      if (item.use) html += '<div style="opacity:.7">Клик — использовать</div>';
      return html;
    },

    statName(k) {
      const names = {
        armor: 'брони', maxHp: 'макс. HP', maxMana: 'макс. маны', moveBonus: 'скорости',
        fireDmg: 'огн. урона', critChance: 'крит-шанса', lifesteal: 'вампиризма',
        lootBonus: 'шанса лута', hpRegenBonus: 'регена HP', spellPower: 'силы закл.', damage: 'урона',
      };
      return names[k] || k;
    },

    // Автопривязка ко всем элементам с data-tip-item
    bind(rootEl) {
      const self = this;
      (rootEl || document).addEventListener('mouseover', function (e) {
        const t = e.target.closest('[data-tip-item]');
        if (t && t._tipItem) self.show(self.itemHTML(t._tipItem), e.clientX, e.clientY);
      });
      (rootEl || document).addEventListener('mousemove', function (e) {
        const t = e.target.closest('[data-tip-item]');
        if (t && self.el && self.el.style.display !== 'none') self.move(e.clientX, e.clientY);
        else if (!t) self.hide();
      });
      (rootEl || document).addEventListener('mouseout', function (e) {
        const t = e.target.closest('[data-tip-item]');
        if (t) self.hide();
      });
    },
  };
  window.Tooltip = Tooltip;
})();
