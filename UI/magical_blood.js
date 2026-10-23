/* UI/magical_blood.js — «магическая кровь»: эффекты на поле боя.
   Кровь/искры при попадании по цели (THREE-спрайты, затухают). */
(function () {
  'use strict';
  const MagicalBlood = {
    particles: [],

    spawnBurst(scene, position, opts) {
      if (!window.THREE || !scene) return;
      opts = opts || {};
      const count = opts.count || 8;
      const color = opts.color !== undefined ? opts.color : 0x8a1f1f;
      for (let i = 0; i < count; i++) {
        const mat = new THREE.SpriteMaterial({
          color: color, transparent: true, opacity: 0.9, depthWrite: false,
        });
        const sp = new THREE.Sprite(mat);
        const size = 0.06 + Math.random() * 0.1;
        sp.scale.set(size, size, 1);
        sp.position.copy(position);
        sp.renderOrder = 1500;
        scene.add(sp);
        this.particles.push({
          mesh: sp,
          vel: new THREE.Vector3(
            (Math.random() - 0.5) * 2.4,
            Math.random() * 2.2 + 0.5,
            (Math.random() - 0.5) * 2.4),
          life: 0.5 + Math.random() * 0.4,
          age: 0,
          gravity: -6,
        });
      }
    },

    update(dt) {
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.age += dt;
        if (p.age >= p.life) {
          p.mesh.material.dispose();
          if (p.mesh.parent) p.mesh.parent.remove(p.mesh);
          this.particles.splice(i, 1);
          continue;
        }
        p.vel.y += p.gravity * dt;
        p.mesh.position.addScaledVector(p.vel, dt);
        p.mesh.material.opacity = 0.9 * (1 - p.age / p.life);
      }
    },

    clear(scene) {
      for (const p of this.particles) {
        p.mesh.material.dispose();
        if (scene) scene.remove(p.mesh);
      }
      this.particles = [];
    },
  };
  window.MagicalBlood = MagicalBlood;
})();
