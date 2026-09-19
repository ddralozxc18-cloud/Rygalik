/* =========================================================
   ПУСТОШИ — низкополигональная 3D-бродилка от первого лица
   Чистый Three.js (r128), без сборщиков и модулей.
   ========================================================= */

(function () {
  'use strict';

  // ---------------------------------------------------------
  // Настройки баланса
  // ---------------------------------------------------------
  const CONFIG = {
    eyeHeight: 1.7,
    gravity: -22,
    jumpSpeed: 8,
    jumpStaminaCost: 10,

    walkSpeed: 4.2,
    runSpeed: 8.6,
    runStaminaDrain: 22,
    staminaRegenDelay: 0.9,
    staminaRegenRate: 14,

    manaRegenRate: 4,
    flareManaCost: 18,

    hpRegenRate: 1.6,
    hpRegenDelay: 4,
    fallDamageThreshold: 9,
    fallDamageMultiplier: 3.2,

    worldBound: 95,
    pickupRadius: 2.6,
    playerRadius: 0.4,
  };

  // Определения предметов инвентаря
  const ITEM_DEFS = {
    gem:            { name: 'Кристалл',           icon: '◆', color: '#7dd3fc', use: null },
    potion_hp:      { name: 'Зелье здоровья',      icon: '♥', color: '#e0403a', use: (s) => { s.hp = Math.min(s.maxHp, s.hp + 35); } },
    potion_mana:    { name: 'Зелье маны',          icon: '✦', color: '#4c8dfb', use: (s) => { s.mana = Math.min(s.maxMana, s.mana + 40); } },
    potion_stamina: { name: 'Зелье выносливости',  icon: '⚡', color: '#c3e05a', use: (s) => { s.stamina = Math.min(s.maxStamina, s.stamina + 50); } },
  };

  // ---------------------------------------------------------
  // Состояние игры
  // ---------------------------------------------------------
  const state = {
    started: false,
    paused: false,
    inventoryOpen: false,
    dead: false,

    hp: 100, maxHp: 100,
    mana: 100, maxMana: 100,
    stamina: 100, maxStamina: 100,

    level: 1,
    xp: 0,
    xpToNextLevel: 100,

    lastStaminaUseTime: -999,
    lastDamageTime: -999,

    onGround: true,
    velocityY: 0,
    bobTimer: 0,
    bobOffset: 0,

    keys: {},
    mouseSensitivity: 1,
    nearestPickup: null,

    inventory: {},
    gems: 0,
  };

  // ---------------------------------------------------------
  // Вспомогательные функции
  // ---------------------------------------------------------
  function rand(min, max) { return min + Math.random() * (max - min); }
  function randInt(min, max) { return Math.floor(rand(min, max + 1)); }
  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

  function randomPointInWorld(clearRadius) {
    let x = 0, z = 0, attempts = 0;
    do {
      x = rand(-CONFIG.worldBound + 6, CONFIG.worldBound - 6);
      z = rand(-CONFIG.worldBound + 6, CONFIG.worldBound - 6);
      attempts++;
    } while (Math.hypot(x, z) < clearRadius && attempts < 25);
    return { x, z };
  }

  // ---------------------------------------------------------
  // Ссылки на DOM
  // ---------------------------------------------------------
  const container = document.getElementById('game-container');
  const menuScreen = document.getElementById('menu-screen');
  const pauseScreen = document.getElementById('pause-screen');
  const deathScreen = document.getElementById('death-screen');
  const inventoryScreen = document.getElementById('inventory-screen');
  const hudEl = document.getElementById('hud');

  const startBtn = document.getElementById('start-btn');
  const resumeBtn = document.getElementById('resume-btn');
  const restartBtn = document.getElementById('restart-btn');
  const respawnBtn = document.getElementById('respawn-btn');
  const closeInventoryBtn = document.getElementById('close-inventory-btn');

  const sensSlider = document.getElementById('sensitivity-slider');
  const sensSliderPause = document.getElementById('sensitivity-slider-pause');

  const hpFillEl = document.getElementById('hp-fill');
  const hpValueEl = document.getElementById('hp-value');
  const hpRegenEl = document.getElementById('hp-regen');
  const manaFillEl = document.getElementById('mana-fill');
  const manaValueEl = document.getElementById('mana-value');
  const manaRegenEl = document.getElementById('mana-regen');
  const staminaFillEl = document.getElementById('stamina-fill');
  const staminaValueEl = document.getElementById('stamina-value');
  const staminaRegenEl = document.getElementById('stamina-regen');
  const gemCountEl = document.getElementById('gem-count');
  const levelValueEl = document.getElementById('level-value');
  const xpFillEl = document.getElementById('xp-fill');

  const pickupPromptEl = document.getElementById('pickup-prompt');
  const inventoryGridEl = document.getElementById('inventory-grid');
  const damageVignetteEl = document.getElementById('damage-vignette');
  const fpsCounterEl = document.getElementById('fps-counter');

  // ---------------------------------------------------------
  // Three.js — глобальные объекты сцены
  // ---------------------------------------------------------
  let scene, camera, renderer, clock;
  const collectibles = [];
  const obstacles = [];
  const flares = [];
  let damageFlashTimeout = null;
  let fpsAccum = 0, fpsFrames = 0, fpsTimer = 0;

  // ---------------------------------------------------------
  // Инициализация сцены, освещения и рендера
  // ---------------------------------------------------------
  function initScene() {
    scene = new THREE.Scene();
    const skyColor = 0x8fb4d9;
    scene.background = new THREE.Color(skyColor);
    scene.fog = new THREE.Fog(skyColor, 35, 155);

    camera = new THREE.PerspectiveCamera(72, window.innerWidth / window.innerHeight, 0.1, 300);
    camera.rotation.order = 'YXZ';
    camera.position.set(0, CONFIG.eyeHeight, 6);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const hemi = new THREE.HemisphereLight(0xbfe0ff, 0x3f5a2e, 0.8);
    scene.add(hemi);

    const sun = new THREE.DirectionalLight(0xfff1d0, 1.1);
    sun.position.set(55, 70, 35);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -90;
    sun.shadow.camera.right = 90;
    sun.shadow.camera.top = 90;
    sun.shadow.camera.bottom = -90;
    sun.shadow.camera.near = 10;
    sun.shadow.camera.far = 220;
    scene.add(sun);

    clock = new THREE.Clock();
  }

  // ---------------------------------------------------------
  // Построение низкополигонального мира
  // ---------------------------------------------------------
  function createGround() {
    const geo = new THREE.PlaneGeometry(220, 220, 44, 44);
    geo.rotateX(-Math.PI / 2);

    const posAttr = geo.attributes.position;
    const base = new THREE.Color(0x4a6b3a);
    const colors = [];
    for (let i = 0; i < posAttr.count; i++) {
      const shade = 0.82 + Math.random() * 0.34;
      const c = base.clone().multiplyScalar(shade);
      colors.push(c.r, c.g, c.b);
    }
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const mat = new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 1 });
    const ground = new THREE.Mesh(geo, mat);
    ground.receiveShadow = true;
    scene.add(ground);
  }

  function createTree(x, z) {
    const group = new THREE.Group();

    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5b4632, flatShading: true, roughness: 1 });
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.24, 1.7, 6), trunkMat);
    trunk.position.y = 0.85;
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    group.add(trunk);

    const leafColors = [0x3f6b34, 0x4a7a3c, 0x386028];
    const leafMat = new THREE.MeshStandardMaterial({
      color: leafColors[randInt(0, leafColors.length - 1)],
      flatShading: true,
      roughness: 0.9,
    });

    let y = 1.55;
    const tiers = 2 + randInt(0, 1);
    for (let i = 0; i < tiers; i++) {
      const s = 1 - i * 0.26;
      const cone = new THREE.Mesh(new THREE.ConeGeometry(1.05 * s, 1.5 * s, 6), leafMat);
      cone.position.y = y;
      cone.castShadow = true;
      cone.receiveShadow = true;
      group.add(cone);
      y += 0.9 * s;
    }

    const scale = 0.85 + Math.random() * 0.5;
    group.scale.setScalar(scale);
    group.position.set(x, 0, z);
    group.rotation.y = Math.random() * Math.PI * 2;
    scene.add(group);

    obstacles.push({ x, z, radius: 0.42 * scale });
  }

  function createRock(x, z) {
    const size = 0.5 + Math.random() * 0.9;
    const mat = new THREE.MeshStandardMaterial({ color: 0x757b82, flatShading: true, roughness: 1 });
    const rock = new THREE.Mesh(new THREE.IcosahedronGeometry(size, 0), mat);
    rock.position.set(x, size * 0.35, z);
    rock.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    rock.castShadow = true;
    rock.receiveShadow = true;
    scene.add(rock);
    obstacles.push({ x, z, radius: size * 0.75 });
  }

  function createBoundaryPillars() {
    const count = 28;
    const radius = CONFIG.worldBound + 3;
    const mat = new THREE.MeshStandardMaterial({ color: 0x4b4d55, flatShading: true, roughness: 1 });
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const h = 2.4 + Math.random() * 1.6;
      const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.9, h, 0.9), mat);
      pillar.position.set(Math.sin(angle) * radius, h / 2, Math.cos(angle) * radius);
      pillar.rotation.y = Math.random() * 0.3;
      pillar.castShadow = true;
      pillar.receiveShadow = true;
      scene.add(pillar);
    }
  }

  function createDistantMountains() {
    const mat = new THREE.MeshStandardMaterial({ color: 0x6b7aa0, flatShading: true, roughness: 1 });
    const count = 10;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.2;
      const dist = 140 + Math.random() * 40;
      const radius = 22 + Math.random() * 20;
      const height = 26 + Math.random() * 22;
      const mesh = new THREE.Mesh(new THREE.ConeGeometry(radius, height, 5), mat);
      mesh.position.set(Math.sin(angle) * dist, height / 2 - 4, Math.cos(angle) * dist);
      scene.add(mesh);
    }
  }

  function createWorld() {
    createGround();
    createBoundaryPillars();
    createDistantMountains();
    for (let i = 0; i < 55; i++) { const p = randomPointInWorld(5); createTree(p.x, p.z); }
    for (let i = 0; i < 28; i++) { const p = randomPointInWorld(5); createRock(p.x, p.z); }
  }

  function createCollectibles() {
    const types = [
      'gem', 'gem', 'gem', 'gem',
      'potion_hp', 'potion_hp', 'potion_hp',
      'potion_mana', 'potion_mana', 'potion_mana',
      'potion_stamina', 'potion_stamina', 'potion_stamina',
    ];
    const total = 20;
    for (let i = 0; i < total; i++) {
      const id = types[i % types.length];
      const def = ITEM_DEFS[id];
      const p = randomPointInWorld(8);
      const baseY = 1.0;

      const geo = id === 'gem'
        ? new THREE.OctahedronGeometry(0.32, 0)
        : new THREE.IcosahedronGeometry(0.3, 0);

      const mat = new THREE.MeshStandardMaterial({
        color: def.color,
        emissive: def.color,
        emissiveIntensity: 0.55,
        flatShading: true,
        roughness: 0.35,
        metalness: 0.2,
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(p.x, baseY, p.z);
      mesh.castShadow = true;
      scene.add(mesh);

      collectibles.push({ id, def, mesh, collected: false, baseY, phase: Math.random() * Math.PI * 2 });
    }
  }

  // ---------------------------------------------------------
  // Столкновения с деревьями/камнями (2D-круги в плоскости XZ)
  // ---------------------------------------------------------
  function resolveCollisions(pos) {
    for (const o of obstacles) {
      const dx = pos.x - o.x;
      const dz = pos.z - o.z;
      const dist = Math.hypot(dx, dz);
      const minDist = o.radius + CONFIG.playerRadius;
      if (dist > 0.0001 && dist < minDist) {
        const push = minDist - dist;
        pos.x += (dx / dist) * push;
        pos.z += (dz / dist) * push;
      }
    }
  }

  // ---------------------------------------------------------
  // HUD
  // ---------------------------------------------------------
  function updateHUD() {
    hpFillEl.style.width = (state.hp / state.maxHp * 100) + '%';
    hpValueEl.textContent = Math.ceil(state.hp) + '/' + state.maxHp;

    manaFillEl.style.width = (state.mana / state.maxMana * 100) + '%';
    manaValueEl.textContent = Math.ceil(state.mana) + '/' + state.maxMana;

    staminaFillEl.style.width = (state.stamina / state.maxStamina * 100) + '%';
    staminaValueEl.textContent = Math.ceil(state.stamina) + '/' + state.maxStamina;

    gemCountEl.textContent = state.gems;

    levelValueEl.textContent = state.level;
    xpFillEl.style.width = (state.xp / state.xpToNextLevel * 100) + '%';
  }

  function updateFpsCounter(dt) {
    fpsAccum += dt; fpsFrames++; fpsTimer += dt;
    if (fpsTimer > 0.5) {
      fpsCounterEl.textContent = Math.round(fpsFrames / fpsAccum) + ' fps';
      fpsAccum = 0; fpsFrames = 0; fpsTimer = 0;
    }
  }

  function flashDamage() {
    damageVignetteEl.classList.add('active');
    clearTimeout(damageFlashTimeout);
    damageFlashTimeout = setTimeout(() => damageVignetteEl.classList.remove('active'), 260);
  }

  function applyDamage(amount) {
    if (amount <= 0 || state.dead) return;
    state.hp = Math.max(0, state.hp - amount);
    state.lastDamageTime = clock.getElapsedTime();
    flashDamage();
    if (state.hp <= 0) die();
  }

  // ---------------------------------------------------------
  // Инвентарь
  // ---------------------------------------------------------
  function addToInventory(id) {
    const def = ITEM_DEFS[id];
    if (!state.inventory[id]) state.inventory[id] = { def, count: 0 };
    state.inventory[id].count++;
    if (id === 'gem') {
      state.gems++;
      addXp(10);
    } else {
      addXp(5);
    }
    renderInventoryGrid();
  }

  function addXp(amount) {
    state.xp += amount;
    if (state.xp >= state.xpToNextLevel) {
      state.xp -= state.xpToNextLevel;
      state.level++;
      state.xpToNextLevel = Math.floor(state.xpToNextLevel * 1.5);
      state.maxHp += 20;
      state.hp = state.maxHp;
      state.maxMana += 15;
      state.mana = state.maxMana;
      state.maxStamina += 15;
      state.stamina = state.maxStamina;
    }
    updateHUD();
  }

  function useItem(id) {
    const entry = state.inventory[id];
    if (!entry || entry.count <= 0) return;
    if (entry.def.use) entry.def.use(state);
    entry.count--;
    if (entry.count <= 0) delete state.inventory[id];
    updateHUD();
    renderInventoryGrid();
  }

  function renderInventoryGrid() {
    inventoryGridEl.innerHTML = '';
    const order = ['gem', 'potion_hp', 'potion_mana', 'potion_stamina'];
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
        if (entry.def.use) slot.addEventListener('click', () => useItem(itemId));
      }
      inventoryGridEl.appendChild(slot);
    }
  }

  function collectItem(item) {
    if (item.collected) return;
    item.collected = true;
    item.mesh.visible = false;
    addToInventory(item.id);
    state.nearestPickup = null;
    pickupPromptEl.classList.add('hidden');
  }

  // ---------------------------------------------------------
  // Способность: вспышка маны (ПКМ)
  // ---------------------------------------------------------
  function castFlare() {
    if (state.mana < CONFIG.flareManaCost) return;
    state.mana -= CONFIG.flareManaCost;

    camera.updateMatrixWorld();
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);

    const mat = new THREE.MeshBasicMaterial({ color: 0x8ec9ff, transparent: true, opacity: 0.95 });
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 6), mat);
    mesh.position.copy(camera.position).addScaledVector(dir, 0.8);

    const light = new THREE.PointLight(0x8ec9ff, 1.4, 8);
    mesh.add(light);
    scene.add(mesh);

    flares.push({ mesh, dir: dir.clone(), light, born: clock.getElapsedTime() });
  }

  function updateFlares(dt, elapsed) {
    for (let i = flares.length - 1; i >= 0; i--) {
      const f = flares[i];
      const age = elapsed - f.born;
      if (age > 1.1) {
        scene.remove(f.mesh);
        flares.splice(i, 1);
        continue;
      }
      f.mesh.position.addScaledVector(f.dir, dt * 9);
      const t = age / 1.1;
      f.mesh.material.opacity = 1 - t;
      f.light.intensity = 1.4 * (1 - t);
    }
  }

  // ---------------------------------------------------------
  // Анимация подбираемых предметов
  // ---------------------------------------------------------
  function updateCollectiblesAnim(dt, elapsed) {
    for (const item of collectibles) {
      if (item.collected) continue;
      item.mesh.rotation.y += dt * 1.4;
      item.mesh.position.y = item.baseY + Math.sin(elapsed * 2 + item.phase) * 0.15;
    }
  }

  function updateNearestPickup() {
    let nearest = null;
    let nearestDist = CONFIG.pickupRadius;
    for (const item of collectibles) {
      if (item.collected) continue;
      const dx = camera.position.x - item.mesh.position.x;
      const dz = camera.position.z - item.mesh.position.z;
      const dist = Math.hypot(dx, dz);
      if (dist < nearestDist) { nearestDist = dist; nearest = item; }
    }
    state.nearestPickup = nearest;
    if (nearest) {
      pickupPromptEl.textContent = 'E — поднять: ' + nearest.def.name;
      pickupPromptEl.classList.remove('hidden');
    } else {
      pickupPromptEl.classList.add('hidden');
    }
  }

  // ---------------------------------------------------------
  // Игрок: движение, физика, характеристики
  // ---------------------------------------------------------
  function isActive() {
    return state.started && !state.paused && !state.inventoryOpen && !state.dead;
  }

  function updatePlayer(dt, elapsed) {
    const forward = new THREE.Vector3(-Math.sin(camera.rotation.y), 0, -Math.cos(camera.rotation.y));
    const right = new THREE.Vector3(Math.cos(camera.rotation.y), 0, -Math.sin(camera.rotation.y));

    let moveX = 0, moveZ = 0;
    if (state.keys['KeyW']) moveZ += 1;
    if (state.keys['KeyS']) moveZ -= 1;
    if (state.keys['KeyD']) moveX += 1;
    if (state.keys['KeyA']) moveX -= 1;

    const isMoving = moveX !== 0 || moveZ !== 0;
    const wantsRun = !!state.keys['ShiftLeft'] || !!state.keys['ShiftRight'];
    const isRunning = wantsRun && isMoving && state.stamina > 0;
    const speed = isRunning ? CONFIG.runSpeed : CONFIG.walkSpeed;

    if (isMoving) {
      const len = Math.hypot(moveX, moveZ);
      moveX /= len; moveZ /= len;
      const dx = (forward.x * moveZ + right.x * moveX) * speed * dt;
      const dz = (forward.z * moveZ + right.z * moveX) * speed * dt;

      const next = new THREE.Vector3(camera.position.x + dx, 0, camera.position.z + dz);
      resolveCollisions(next);
      next.x = clamp(next.x, -CONFIG.worldBound, CONFIG.worldBound);
      next.z = clamp(next.z, -CONFIG.worldBound, CONFIG.worldBound);
      camera.position.x = next.x;
      camera.position.z = next.z;
    }

    // Выносливость
    if (isRunning) {
      state.stamina = Math.max(0, state.stamina - CONFIG.runStaminaDrain * dt);
      state.lastStaminaUseTime = elapsed;
    } else if (elapsed - state.lastStaminaUseTime > CONFIG.staminaRegenDelay) {
      state.stamina = Math.min(state.maxStamina, state.stamina + CONFIG.staminaRegenRate * dt);
    }

    // Мана и здоровье
    state.mana = Math.min(state.maxMana, state.mana + CONFIG.manaRegenRate * dt);
    if (elapsed - state.lastDamageTime > CONFIG.hpRegenDelay) {
      state.hp = Math.min(state.maxHp, state.hp + CONFIG.hpRegenRate * dt);
    }

    // Обновление показателей восстановления в HUD
    const staminaRegenDisplay = (elapsed - state.lastStaminaUseTime > CONFIG.staminaRegenDelay && !isRunning) ? CONFIG.staminaRegenRate : 0;
    const hpRegenDisplay = (elapsed - state.lastDamageTime > CONFIG.hpRegenDelay) ? CONFIG.hpRegenRate : 0;
    const manaRegenDisplay = CONFIG.manaRegenRate;
    
    hpRegenEl.textContent = '+' + hpRegenDisplay.toFixed(1) + '/сек';
    manaRegenEl.textContent = '+' + manaRegenDisplay.toFixed(1) + '/сек';
    staminaRegenEl.textContent = '+' + staminaRegenDisplay.toFixed(1) + '/сек';

    // Вертикальная физика (гравитация и прыжок)
    state.velocityY += CONFIG.gravity * dt;
    let newY = camera.position.y - state.bobOffset + state.velocityY * dt;
    if (newY <= CONFIG.eyeHeight) {
      if (!state.onGround) {
        const impact = Math.abs(state.velocityY);
        if (impact > CONFIG.fallDamageThreshold) {
          applyDamage((impact - CONFIG.fallDamageThreshold) * CONFIG.fallDamageMultiplier);
        }
      }
      newY = CONFIG.eyeHeight;
      state.velocityY = 0;
      state.onGround = true;
    } else {
      state.onGround = false;
    }

    // Покачивание камеры при ходьбе/беге
    if (state.onGround && isMoving) {
      state.bobTimer += dt * (isRunning ? 13 : 8.4);
      state.bobOffset = Math.sin(state.bobTimer) * (isRunning ? 0.085 : 0.05);
    } else {
      state.bobOffset += (0 - state.bobOffset) * Math.min(1, dt * 8);
    }
    camera.position.y = newY + state.bobOffset;

    updateNearestPickup();
  }

  function idleCameraUpdate(elapsed) {
    const angle = elapsed * 0.045;
    const radius = 34;
    camera.position.set(Math.sin(angle) * radius, 11, Math.cos(angle) * radius);
    camera.lookAt(0, 2.5, 0);
  }

  // ---------------------------------------------------------
  // Управление состояниями игры
  // ---------------------------------------------------------
  function resetPlayerPosition() {
    camera.position.set(0, CONFIG.eyeHeight, 6);
    camera.rotation.set(0, 0, 0);
    state.velocityY = 0;
    state.onGround = true;
    state.bobOffset = 0;
    state.bobTimer = 0;
    state.keys = {};
  }

  function beginGame() {
    state.started = true;
    state.dead = false;
    menuScreen.classList.add('hidden');
    hudEl.classList.remove('hidden');
    resetPlayerPosition();
    updateHUD();
    renderInventoryGrid();
  }

  function die() {
    state.dead = true;
    state.keys = {};
    document.exitPointerLock();
    deathScreen.classList.remove('hidden');
  }

  function respawn() {
    state.hp = state.maxHp;
    state.mana = state.maxMana;
    state.stamina = state.maxStamina;
    state.lastDamageTime = -999;
    resetPlayerPosition();
    state.dead = false;
    deathScreen.classList.add('hidden');
    updateHUD();
    container.requestPointerLock();
  }

  function fullReset() {
    state.hp = 100;
    state.maxHp = 100;
    state.mana = 100;
    state.maxMana = 100;
    state.stamina = 100;
    state.maxStamina = 100;
    state.level = 1;
    state.xp = 0;
    state.xpToNextLevel = 100;
    state.inventory = {};
    state.gems = 0;
    state.lastDamageTime = -999;
    state.lastStaminaUseTime = -999;
    collectibles.forEach((c) => { c.collected = false; c.mesh.visible = true; });
    resetPlayerPosition();
    state.dead = false;
    state.paused = false;
    deathScreen.classList.add('hidden');
    pauseScreen.classList.add('hidden');
    updateHUD();
    renderInventoryGrid();
    container.requestPointerLock();
  }

  function toggleInventory() {
    state.inventoryOpen = !state.inventoryOpen;
    if (state.inventoryOpen) {
      state.keys = {};
      renderInventoryGrid();
      inventoryScreen.classList.remove('hidden');
      document.exitPointerLock();
    } else {
      inventoryScreen.classList.add('hidden');
      container.requestPointerLock();
    }
  }

  // ---------------------------------------------------------
  // Обработчики ввода
  // ---------------------------------------------------------
  function onSensitivityChange(e) {
    state.mouseSensitivity = parseFloat(e.target.value);
    sensSlider.value = state.mouseSensitivity;
    sensSliderPause.value = state.mouseSensitivity;
  }

  function onMouseMove(e) {
    if (document.pointerLockElement !== container || !isActive()) return;
    const sens = 0.0022 * state.mouseSensitivity;
    camera.rotation.y -= e.movementX * sens;
    camera.rotation.x -= e.movementY * sens;
    camera.rotation.x = clamp(camera.rotation.x, -Math.PI / 2 + 0.05, Math.PI / 2 - 0.05);
  }

  function onMouseDown(e) {
    if (e.button === 2 && document.pointerLockElement === container && isActive()) {
      castFlare();
    }
  }

  function onPointerLockChange() {
    const locked = document.pointerLockElement === container;
    if (locked) {
      pauseScreen.classList.add('hidden');
      state.paused = false;
      if (!state.started) beginGame();
    } else if (state.started && !state.dead && !state.inventoryOpen) {
      state.paused = true;
      state.keys = {};
      pauseScreen.classList.remove('hidden');
    }
  }

  function onKeyDown(e) {
    if (e.code === 'KeyI') {
      e.preventDefault();
      if (state.inventoryOpen) { toggleInventory(); }
      else if (state.started && !state.dead && !state.paused) { toggleInventory(); }
      return;
    }
    if (e.code === 'Escape') {
      if (state.inventoryOpen) toggleInventory();
      return;
    }
    if (!isActive()) return;

    if (e.code === 'Space') {
      e.preventDefault();
      if (state.onGround) {
        state.velocityY = CONFIG.jumpSpeed;
        state.onGround = false;
      }
      return;
    }
    if (e.code === 'KeyE') {
      if (state.nearestPickup) collectItem(state.nearestPickup);
      return;
    }
    state.keys[e.code] = true;
  }

  function onKeyUp(e) {
    state.keys[e.code] = false;
  }

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function bindEvents() {
    startBtn.addEventListener('click', () => container.requestPointerLock());
    resumeBtn.addEventListener('click', () => container.requestPointerLock());
    restartBtn.addEventListener('click', fullReset);
    respawnBtn.addEventListener('click', respawn);
    closeInventoryBtn.addEventListener('click', toggleInventory);

    sensSlider.addEventListener('input', onSensitivityChange);
    sensSliderPause.addEventListener('input', onSensitivityChange);

    document.addEventListener('pointerlockchange', onPointerLockChange);
    document.addEventListener('pointerlockerror', () => console.warn('Не удалось захватить курсор'));
    document.addEventListener('contextmenu', (e) => e.preventDefault());

    window.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mousedown', onMouseDown);

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('resize', onResize);
  }

  // ---------------------------------------------------------
  // Главный цикл
  // ---------------------------------------------------------
  function animate() {
    requestAnimationFrame(animate);
    const dt = Math.min(clock.getDelta(), 0.1);
    const elapsed = clock.getElapsedTime();

    updateCollectiblesAnim(dt, elapsed);

    if (!state.started) {
      idleCameraUpdate(elapsed);
    } else if (isActive()) {
      updatePlayer(dt, elapsed);
      updateFlares(dt, elapsed);
      updateHUD();
    }

    updateFpsCounter(dt);
    renderer.render(scene, camera);
  }

  // ---------------------------------------------------------
  // Инициализация
  // ---------------------------------------------------------
  function init() {
    initScene();
    createWorld();
    createCollectibles();
    bindEvents();
    animate();
  }

  init();
})();