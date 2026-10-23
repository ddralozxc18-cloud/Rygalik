/* UI/inventory.js — перенос сюда отрисовки инвентаря из game.js.
   Использует элементы #inventory-grid, #equipment-container и глобальный
   window.inventoryState (state), который устанавливает game.js через
   window.GameBridge.getInventory(). */
(function () {
  'use strict';
  const InventoryUI = {
    gridEl: null,
    equipEl: null,

    init() {
      this.gridEl = document.getElementById('inventory-grid');
      this.equipEl = document.getElementById('equipment-container');
      if (window.Tooltip) window.Tooltip.bind(document);
    },

    // Отрисовать слот экипировки
    createEquipmentSlot(slotName, item, tooltipText) {
      const slot = document.createElement('div');
      slot.className = 'equip-slot';
      slot.dataset.slot = slotName;
      if (item) {
        slot.classList.add('filled');
        slot.style.color = item.color || '#eae6da';
        slot.innerHTML = (item.icon || '?') +
          '<span class="equip-tooltip">' + (item.name || tooltipText) + '</span>';
        if (window.RarityFx && item.rarity) window.RarityFx.applyToElement(slot, item.rarity);
        slot.addEventListener('click', () => {
          if (window.GameBridge) window.GameBridge.unequipSlot(slotName);
        });
      } else {
        slot.innerHTML = '<span class="slot-empty">+</span>' +
          '<span class="equip-tooltip">' + tooltipText + '</span>';
      }
      return slot;
    },

    render() {
      if (!this.gridEl) this.init();
      const bridge = window.GameBridge;
      if (!bridge) return;
      const state = bridge.getInventory();
      const equipmentState = bridge.getEquipment();

      this.equipEl.innerHTML = '';
      this.gridEl.innerHTML = '';

      // ===== Секция экипировки =====
      const equipmentSection = document.createElement('div');
      equipmentSection.className = 'equipment-section';
      const mainRow = document.createElement('div');
      mainRow.className = 'equipment-row';

      const handWrapper = document.createElement('div');
      handWrapper.className = 'equip-slot-wrapper';
      handWrapper.appendChild(this.createEquipmentSlot('hand', equipmentState.hand, 'Рука'));
      mainRow.appendChild(handWrapper);

      const activeSlotsContainer = document.createElement('div');
      activeSlotsContainer.className = 'active-slots-container';
      activeSlotsContainer.appendChild(this.createEquipmentSlot('active1', equipmentState.active1, 'Активный 1 (Shift)'));
      activeSlotsContainer.appendChild(this.createEquipmentSlot('active2', equipmentState.active2, 'Активный 2 (C)'));
      mainRow.appendChild(activeSlotsContainer);

      const passiveSlotsContainer = document.createElement('div');
      passiveSlotsContainer.className = 'passive-slots-container';
      passiveSlotsContainer.appendChild(this.createEquipmentSlot('passive1', equipmentState.passive1, 'Пассивный 1'));
      passiveSlotsContainer.appendChild(this.createEquipmentSlot('passive2', equipmentState.passive2, 'Пассивный 2'));
      mainRow.appendChild(passiveSlotsContainer);

      equipmentSection.appendChild(mainRow);
      this.equipEl.appendChild(equipmentSection);

      // ===== Слоты предметов =====
      const order = ['gem', 'potion_hp', 'potion_mana', 'elixir_wartorn'];
      const totalSlots = 16;
      for (let i = 0; i < totalSlots; i++) {
        const slot = document.createElement('div');
        slot.className = 'inv-slot';
        const itemId = order[i];
        const entry = itemId ? state.inventory[itemId] : null;
        if (entry && entry.count > 0) {
          slot.classList.add('filled');
          slot.style.color = entry.def.color;
          const usable = entry.def.use ? ' — исп.' : '';
          slot.innerHTML = entry.def.icon +
            '<span class="inv-count">' + entry.count + '</span>' +
            '<span class="inv-tooltip">' + entry.def.name + usable + '</span>';
          if (entry.def.use) slot.addEventListener('click', () => bridge.useItem(itemId));
        }
        this.gridEl.appendChild(slot);
      }
    },
  };
  window.InventoryUI = InventoryUI;
})();
