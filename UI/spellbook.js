/* UI/spellbook.js — книга заклинаний: все известные скиллы + апгрейды. */
(function () {
  'use strict';
  const SpellBook = {
    root: null,

    init() {
      if (this.root) return;
      this.root = document.createElement('div');
      this.root.id = 'spellbook-screen';
      this.root.style.cssText = 'position:fixed;inset:0;z-index:2400;display:none;' +
        'align-items:center;justify-content:center;background:rgba(6,8,14,0.85);' +
        'font-family:Inter,sans-serif;color:#eae6da;';
      this.root.innerHTML =
        '<div style="background:#0d1018;border:1px solid rgba(201,162,39,.4);border-radius:8px;' +
        'padding:24px;max-width:760px;width:92%;max-height:80vh;overflow:auto">' +
        '<div style="display:flex;justify-content:space-between;align-items:center">' +
        '<h2 style="color:#c9a227;letter-spacing:.15em;text-transform:uppercase;font-size:18px">Книга заклинаний</h2>' +
        '<button id="spellbook-close" style="background:none;border:1px solid #555;color:#eae6da;' +
        'border-radius:4px;padding:4px 12px;cursor:pointer">Закрыть [B]</button></div>' +
        '<div id="spellbook-list" style="margin-top:16px"></div></div>';
      document.body.appendChild(this.root);
      this.root.querySelector('#spellbook-close').addEventListener('click', () => this.close());
    },

    toggle() {
      this.init();
      if (this.root.style.display === 'flex') this.close();
      else this.open();
    },

    open() {
      this.render();
      this.root.style.display = 'flex';
      if (window.GameBridge) window.GameBridge.setPausedForSpellChoice(true);
    },

    close() {
      if (this.root) this.root.style.display = 'none';
      if (window.GameBridge) window.GameBridge.setPausedForSpellChoice(false);
    },

    render() {
      const list = this.root.querySelector('#spellbook-list');
      list.innerHTML = '';
      const learned = (window.Spells && window.Spells.learned) || [];
      if (!learned.length) {
        list.innerHTML = '<div style="opacity:.6">Пока не изучено ни одного заклинания.</div>';
        return;
      }
      for (const l of learned) {
        const def = window.getSpellDef(l.id);
        if (!def) continue;
        const row = document.createElement('div');
        row.style.cssText = 'display:flex;align-items:center;gap:12px;padding:10px;border-bottom:1px solid #22262f;';
        const dots = Array.from({ length: 5 }, (_, i) =>
          '<span style="color:' + (i < l.level ? '#c9a227' : '#3a3f4a') + '">●</span>').join('');
        row.innerHTML =
          '<div style="font-size:26px;width:40px;text-align:center">' + (def.icon || '✦') + '</div>' +
          '<div style="flex:1"><b>' + def.name + '</b><div style="font-size:12px;opacity:.7">' + (def.desc || '') + '</div></div>' +
          '<div style="letter-spacing:3px">' + dots + '</div>';
        if (l.level < 5) {
          const btn = document.createElement('button');
          btn.textContent = 'Улучшить';
          btn.style.cssText = 'background:#1b2130;border:1px solid #c9a227;color:#c9a227;border-radius:4px;padding:4px 10px;cursor:pointer';
          btn.addEventListener('click', () => {
            window.Spells.upgrade(l.id);
            this.render();
          });
          row.appendChild(btn);
        }
        list.appendChild(row);
      }
    },
  };
  window.SpellBook = SpellBook;
})();
