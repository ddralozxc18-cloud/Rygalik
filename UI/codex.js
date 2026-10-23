/* UI/codex.js — Кодекс: враги, предметы, оружие, редкости, школы магии. */
(function () {
  'use strict';
  const Codex = {
    root: null,
    tab: 'enemies',

    init() {
      if (this.root) return;
      this.root = document.createElement('div');
      this.root.id = 'codex-screen';
      this.root.style.cssText = 'position:fixed;inset:0;z-index:2400;display:none;' +
        'align-items:center;justify-content:center;background:rgba(6,8,14,0.85);' +
        'font-family:Inter,sans-serif;color:#eae6da;';
      this.root.innerHTML =
        '<div style="background:#0d1018;border:1px solid rgba(201,162,39,.4);border-radius:8px;' +
        'padding:20px;max-width:820px;width:94%;max-height:82vh;display:flex;flex-direction:column">' +
        '<div style="display:flex;justify-content:space-between;align-items:center">' +
        '<h2 style="color:#c9a227;letter-spacing:.15em;text-transform:uppercase;font-size:18px">Кодекс</h2>' +
        '<button id="codex-close" style="background:none;border:1px solid #555;color:#eae6da;border-radius:4px;padding:4px 12px;cursor:pointer">Закрыть [X]</button></div>' +
        '<div id="codex-tabs" style="display:flex;gap:8px;margin:12px 0"></div>' +
        '<div id="codex-body" style="overflow:auto;flex:1"></div></div>';
      document.body.appendChild(this.root);
      this.root.querySelector('#codex-close').addEventListener('click', () => this.close());
    },

    toggle() {
      this.init();
      if (this.root.style.display === 'flex') this.close();
      else this.open();
    },

    open() {
      this.renderTabs();
      this.renderBody();
      this.root.style.display = 'flex';
      if (window.GameBridge) window.GameBridge.setPausedForSpellChoice(true);
    },

    close() {
      if (this.root) this.root.style.display = 'none';
      if (window.GameBridge) window.GameBridge.setPausedForSpellChoice(false);
    },

    renderTabs() {
      const tabsEl = this.root.querySelector('#codex-tabs');
      tabsEl.innerHTML = '';
      const tabs = [
        ['enemies', 'Враги'], ['items', 'Предметы'], ['weapons', 'Оружие'],
        ['rarities', 'Редкости'], ['schools', 'Школы магии'],
      ];
      for (const [id, label] of tabs) {
        const b = document.createElement('button');
        b.textContent = label;
        b.style.cssText = 'padding:6px 14px;border-radius:4px;cursor:pointer;border:1px solid ' +
          (this.tab === id ? '#c9a227' : '#3a3f4a') + ';background:' +
          (this.tab === id ? '#1b2130' : 'transparent') + ';color:' +
          (this.tab === id ? '#c9a227' : '#aab');
        b.addEventListener('click', () => { this.tab = id; this.renderTabs(); this.renderBody(); });
        tabsEl.appendChild(b);
      }
    },

    entry(title, subtitle, color) {
      return '<div style="padding:10px;border-bottom:1px solid #22262f">' +
        '<b style="color:' + (color || '#eae6da') + '">' + title + '</b>' +
        '<div style="font-size:12px;opacity:.75;margin-top:4px">' + subtitle + '</div></div>';
    },

    renderBody() {
      const body = this.root.querySelector('#codex-body');
      let html = '';
      if (this.tab === 'enemies') {
        for (const k in (window.ENEMIES_DB || {})) {
          const e = window.ENEMIES_DB[k];
          html += this.entry(e.name,
            'HP ' + Math.min(e.maxHp, 99999) + ' • Реген ' + e.hpRegen + '/с • Мана ' + e.maxMana +
            (e.isImmortal ? ' • <b>Бессмертный</b>' : '') + ' • XP за убийство: ' + e.xp, '#ff6a5e');
        }
      } else if (this.tab === 'items') {
        for (const it of (window.ITEMS_DB || [])) {
          html += this.entry(it.name, (it.desc || it.slot || 'расходник') + ' (слот: ' + (it.slot || '—') + ')', it.color);
        }
      } else if (this.tab === 'weapons') {
        for (const w of (window.WEAPONS_DB || [])) {
          html += this.entry(w.name, 'Категория: ' + w.category + ' • Базовый урон: ' + w.baseDamage, '#9ecbff');
        }
      } else if (this.tab === 'rarities') {
        for (const r of (window.RARITIES || [])) {
          html += this.entry(r.name, 'Вес выпадения: ' + r.weight + ' • Множитель статов: ×' + r.statMult, r.color);
        }
      } else if (this.tab === 'schools') {
        for (const s of (window.SCHOOLS || [])) {
          html += this.entry(s.name + ' ' + s.icon, s.desc + ' Пассивка: ' + s.passive, s.color);
        }
      }
      body.innerHTML = html || '<div style="opacity:.6">Пусто.</div>';
    },
  };
  window.Codex = Codex;
})();
