/* UI/spell_choice.js — экран выбора 1 из 5 скиллов при левелапе. */
(function () {
  'use strict';
  const SpellChoice = {
    root: null,

    init() {
      if (this.root) return;
      this.root = document.createElement('div');
      this.root.id = 'spell-choice-screen';
      this.root.style.cssText = 'position:fixed;inset:0;z-index:2500;display:none;' +
        'align-items:center;justify-content:center;background:rgba(6,8,14,0.82);' +
        'font-family:Inter,sans-serif;color:#eae6da;';
      this.root.innerHTML =
        '<div style="text-align:center;max-width:980px;width:95%">' +
        '<h2 style="letter-spacing:.18em;text-transform:uppercase;color:#c9a227">Новый уровень — выберите заклинание</h2>' +
        '<div id="spell-choice-cards" style="display:flex;gap:14px;justify-content:center;margin-top:24px;flex-wrap:wrap"></div>' +
        '</div>';
      document.body.appendChild(this.root);
    },

    // Открыть выбор: cards — массив defs заклинаний
    open(cards, onPick) {
      this.init();
      const wrap = this.root.querySelector('#spell-choice-cards');
      wrap.innerHTML = '';
      for (const def of cards) {
        const card = document.createElement('div');
        card.className = 'spell-card';
        const school = window.getSchool ? window.getSchool(def.school) : null;
        const borderColor = school ? school.color : '#c9a227';
        card.style.cssText = 'width:170px;padding:16px;border:1px solid ' + borderColor +
          ';border-radius:8px;background:rgba(14,17,26,0.95);cursor:pointer;' +
          'transition:transform .12s ease, box-shadow .12s ease;text-align:center;';
        const imgHtml = def.img
          ? '<img src="' + def.img + '" alt="" style="width:64px;height:64px;object-fit:contain">'
          : '<div style="font-size:44px">' + (def.icon || '✦') + '</div>';
        card.innerHTML = imgHtml +
          '<div style="margin-top:8px;font-weight:600;color:' + borderColor + '">' + def.name + '</div>' +
          '<div style="margin-top:6px;font-size:12px;opacity:.85">' + (def.desc || '') + '</div>' +
          (def.manaCost ? '<div style="margin-top:6px;font-size:11px;opacity:.6">Мана: ' + def.manaCost + '</div>' : '');
        card.addEventListener('mouseenter', () => { card.style.transform = 'scale(1.05)'; });
        card.addEventListener('mouseleave', () => { card.style.transform = ''; });
        card.addEventListener('click', () => {
          self.close();
          if (onPick) onPick(def);
        });
        wrap.appendChild(card);
      }
      var self = this;
      this.root.style.display = 'flex';
      if (window.GameBridge) window.GameBridge.setPausedForSpellChoice(true);
    },

    close() {
      if (this.root) this.root.style.display = 'none';
      if (window.GameBridge) window.GameBridge.setPausedForSpellChoice(false);
    },
  };
  window.SpellChoice = SpellChoice;
})();
