<template>
  <div class="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
    <canvas ref="canvasRef" class="block h-full w-full"></canvas>
    <!-- vignette + film grain from the SIGNAL FIELD treatment -->
    <div class="absolute inset-0" style="background: radial-gradient(130% 120% at 50% 28%, transparent 52%, rgba(2,7,9,.62) 100%)"></div>
    <div class="grain absolute -inset-x-1/2 -inset-y-1/2 opacity-[0.05]"></div>
  </div>
</template>

<script>
import * as THREE from 'three';

/**
 * SIGNAL FIELD — reactive three.js background.
 * Ported from the "study 001" demo; text/HUD removed.
 *  - mouse move: soft dome bends the field toward the cursor + camera parallax
 *  - click:      expanding ripple waves + light flash + shards scatter
 *  - scroll:     camera sinks across the water, swell thickens, palette shifts cool→ember
 */
export default {
  name: 'Background3D',
  mounted() {
    this.init();
  },
  beforeUnmount() {
    this.destroy();
  },
  methods: {
    init() {
      const canvas = this.$refs.canvasRef;
      if (!canvas) return;

      const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const timeScale = RM ? 0.35 : 1;

      /* ---------- renderer / scene ---------- */
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);

      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x041518, 0.02);
      const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 400);

      /* ---------- palettes (cool shallow → warm deep) ---------- */
      const C = (h) => new THREE.Color(h);
      const PAL = {
        deepCool: C('#0b3f47'), midCool: C('#25d3b2'), crestCool: C('#dcfff3'), glowCool: C('#2fe0c8'),
        deepWarm: C('#47150d'), midWarm: C('#ff7a45'), crestWarm: C('#ffe6bd'), glowWarm: C('#ff8d4d'),
        bgTopCool: C('#03171c'), bgBotCool: C('#07262c'), bgTopWarm: C('#150507'), bgBotWarm: C('#2b0e07'),
        skyCool: C('#3d6d6a'), skyWarm: C('#6a4a3d'),
      };

      /* ---------- backdrop gradient plane ---------- */
      const bgMat = new THREE.ShaderMaterial({
        depthWrite: false,
        uniforms: {
          uTop: { value: new THREE.Color() }, uBot: { value: new THREE.Color() },
          uGlow: { value: new THREE.Color() }, uTime: { value: 0 },
        },
        vertexShader: `varying vec2 vUv;
          void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
        fragmentShader: `
          varying vec2 vUv; uniform vec3 uTop,uBot,uGlow; uniform float uTime;
          void main(){
            vec3 col = mix(uBot, uTop, pow(vUv.y, 1.3));
            float g = exp(-pow(length((vUv-vec2(.5,.30))*vec2(1.5,1.)),2.)*2.2);
            col += uGlow * g * (.26 + .07*sin(uTime*.25));
            col += uGlow * .012 * sin(vUv.y*60. - uTime*.4);
            gl_FragColor = vec4(col, 1.);
          }`,
      });
      const bg = new THREE.Mesh(new THREE.PlaneGeometry(460, 240), bgMat);
      bg.position.set(0, 18, -120);
      scene.add(bg);

      /* ---------- particle field ---------- */
      const geo = new THREE.PlaneGeometry(46, 30, 240, 150);
      geo.rotateX(-Math.PI / 2);
      const count = geo.attributes.position.count;
      const rand = new Float32Array(count);
      for (let i = 0; i < count; i++) rand[i] = Math.random();
      geo.setAttribute('aRand', new THREE.BufferAttribute(rand, 1));

      const pMat = new THREE.ShaderMaterial({
        transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 }, uPixelRatio: { value: renderer.getPixelRatio() },
          uMouse: { value: new THREE.Vector2() }, uMousePower: { value: 0 },
          uAmp: { value: 1 }, uOpacity: { value: 0 },
          uRipple: { value: [new THREE.Vector3(0, 0, -99), new THREE.Vector3(0, 0, -99), new THREE.Vector3(0, 0, -99), new THREE.Vector3(0, 0, -99)] },
          uDeep: { value: new THREE.Color() }, uMid: { value: new THREE.Color() }, uCrest: { value: new THREE.Color() },
          uYellow: { value: new THREE.Color('#ffd94d') },
        },
        vertexShader: `
          uniform float uTime,uMousePower,uAmp,uPixelRatio;
          uniform vec2 uMouse;
          uniform vec3 uRipple[4];
          attribute float aRand;
          varying float vH,vGlow,vRand;
          void main(){
            vec3 p = position;
            float t = uTime;
            float h = sin(p.x*.32 + t*.55)*.42
                    + sin(p.z*.46 - t*.40 + 1.7)*.36
                    + sin((p.x+p.z)*.18 + t*.30)*.30
                    + sin(p.x*1.15 + p.z*.85 - t*.85)*.10;
            h *= uAmp;

            float dm = distance(p.xz, uMouse);
            float dome = exp(-dm*dm*.10) * (.75 + uMousePower*1.5);
            h += dome;
            float glow = dome*.9;

            for(int i=0;i<4;i++){
              float age = t - uRipple[i].z;
              if(age>0. && age<5.){
                float d = distance(p.xz, uRipple[i].xy);
                float ring = exp(-pow(d - age*7.5, 2.)*.55) * exp(-age*.85);
                h += ring * sin(d*2.2 - age*10.) * 1.6;
                glow += ring*1.3;
              }
            }
            p.y += h;
            vH=h; vGlow=glow; vRand=aRand;
            vec4 mv = modelViewMatrix * vec4(p,1.);
            gl_Position = projectionMatrix*mv;
            float size = (1.1 + aRand*1.4 + glow*2.2) * uPixelRatio;
            gl_PointSize = size * (34. / max(.1, -mv.z));
          }`,
        fragmentShader: `
          uniform vec3 uDeep,uMid,uCrest,uYellow; uniform float uOpacity;
          varying float vH,vGlow,vRand;
          void main(){
            float d = length(gl_PointCoord-.5);
            float a = smoothstep(.5,.06,d);
            float hn = clamp(vH*.30+.5, 0., 1.);
            vec3 col = mix(uDeep,uMid,smoothstep(.12,.58,hn));
            col = mix(col,uCrest,smoothstep(.60,.95,hn));
            // the higher a mount grows, the more yellow it turns
            col = mix(col, uYellow, smoothstep(.55,.98,hn)*.85);
            col += uYellow * vGlow * .5;
            float alpha = a*((.30+.70*hn)*.85 + vGlow*.4)*uOpacity;
            if(alpha<.004) discard;
            gl_FragColor = vec4(col, alpha);
          }`,
      });
      scene.add(new THREE.Points(geo, pMat));

      /* ---------- floating shards ---------- */
      const SH_N = 110;
      const shardMat = new THREE.MeshStandardMaterial({
        color: 0x183238, roughness: 0.35, metalness: 0.2, flatShading: true,
        emissive: 0x0c2f2a, emissiveIntensity: 0.85,
      });
      const shards = new THREE.InstancedMesh(new THREE.OctahedronGeometry(0.42, 0), shardMat, SH_N);
      shards.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      scene.add(shards);
      const sd = [];
      for (let i = 0; i < SH_N; i++) {
        sd.push({
          home: new THREE.Vector3((Math.random() - 0.5) * 44, 1.2 + Math.random() * 6.3, -17 + Math.random() * 26),
          pos: new THREE.Vector3(),
          vel: new THREE.Vector3(),
          rot: new THREE.Euler(Math.random() * 6.28, Math.random() * 6.28, Math.random() * 6.28),
          spin: new THREE.Vector3((Math.random() - 0.5) * 0.7, (Math.random() - 0.5) * 0.7, (Math.random() - 0.5) * 0.7),
          scale: 0.5 + Math.random() * 1.1,
        });
      }
      for (const s of sd) s.pos.copy(s.home);
      const dummy = new THREE.Object3D();

      /* ---------- lights ---------- */
      const hemi = new THREE.HemisphereLight(0x3d6d6a, 0x05181a, 0.55);
      scene.add(hemi);
      const dirL = new THREE.DirectionalLight(0xbfeee2, 0.7);
      dirL.position.set(6, 14, 8);
      scene.add(dirL);
      const clickLight = new THREE.PointLight(0x8af5dd, 0, 40, 2);
      scene.add(clickLight);

      /* ---------- interaction state ---------- */
      const ray = new THREE.Raycaster();
      const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const _v2 = new THREE.Vector2();
      const hit = new THREE.Vector3();
      const lastNdc = new THREE.Vector2();
      const mouseWorld = new THREE.Vector2();
      const mouseTarget = new THREE.Vector2();
      let mousePower = 0, mousePowerT = 0, energy = 0, rippleIdx = 0;
      let parX = 0, parY = 0, parTX = 0, parTY = 0, scrollP = 0, scrollS = 0;

      function castToFloor(nx, ny, out) {
        _v2.set(nx, ny);
        ray.setFromCamera(_v2, camera);
        return ray.ray.intersectPlane(floorPlane, out);
      }

      /* ---------- input: MOVE ---------- */
      const onPointerMove = (e) => {
        const nx = (e.clientX / window.innerWidth) * 2 - 1;
        const ny = -(e.clientY / window.innerHeight) * 2 + 1;
        mousePowerT = Math.min(1.6, mousePowerT + Math.hypot(nx - lastNdc.x, ny - lastNdc.y) * 14);
        lastNdc.set(nx, ny);
        parTX = nx; parTY = ny;
        if (castToFloor(nx, ny, hit)) mouseTarget.set(hit.x, hit.z);
      };

      /* ---------- input: CLICK ---------- */
      let time = 0;
      const onPointerDown = (e) => {
        const nx = (e.clientX / window.innerWidth) * 2 - 1;
        const ny = -(e.clientY / window.innerHeight) * 2 + 1;
        if (castToFloor(nx, ny, hit)) {
          pMat.uniforms.uRipple.value[rippleIdx].set(hit.x, hit.z, time);
          rippleIdx = (rippleIdx + 1) % 4;
          clickLight.position.set(hit.x, 2.4, hit.z);
          clickLight.intensity = 90;
          energy = 1;
          if (!RM) {
            for (const s of sd) {
              const dx = s.pos.x - hit.x, dy = s.pos.y - 1.5, dz = s.pos.z - hit.z;
              const d = Math.hypot(dx, dy, dz) + 0.001;
              const f = Math.exp(-d * 0.16) * 9;
              s.vel.x += (dx / d) * f; s.vel.y += (dy / d) * f * 0.6 + 0.4; s.vel.z += (dz / d) * f;
            }
          }
        }
      };

      /* ---------- input: SCROLL ---------- */
      const onScroll = () => {
        const m = document.documentElement.scrollHeight - window.innerHeight;
        scrollP = m > 0 ? window.scrollY / m : 0;
      };

      const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        pMat.uniforms.uPixelRatio.value = renderer.getPixelRatio();
      };

      window.addEventListener('pointermove', onPointerMove, { passive: true });
      window.addEventListener('pointerdown', onPointerDown, { passive: true });
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onResize);

      /* ---------- palette mixing ---------- */
      const cDeep = new THREE.Color(), cMid = new THREE.Color(), cCrest = new THREE.Color(),
        cGlow = new THREE.Color(), cTop = new THREE.Color(), cBot = new THREE.Color(),
        cSky = new THREE.Color(), cEmiss = new THREE.Color();

      function mixPals(p) {
        cDeep.copy(PAL.deepCool).lerp(PAL.deepWarm, p);
        cMid.copy(PAL.midCool).lerp(PAL.midWarm, p);
        cCrest.copy(PAL.crestCool).lerp(PAL.crestWarm, p);
        cGlow.copy(PAL.glowCool).lerp(PAL.glowWarm, p);
        cTop.copy(PAL.bgTopCool).lerp(PAL.bgTopWarm, p);
        cBot.copy(PAL.bgBotCool).lerp(PAL.bgBotWarm, p);
        cSky.copy(PAL.skyCool).lerp(PAL.skyWarm, p);
        pMat.uniforms.uDeep.value.copy(cDeep);
        pMat.uniforms.uMid.value.copy(cMid);
        pMat.uniforms.uCrest.value.copy(cCrest);
        bgMat.uniforms.uTop.value.copy(cTop);
        bgMat.uniforms.uBot.value.copy(cBot);
        bgMat.uniforms.uGlow.value.copy(cGlow);
        scene.fog.color.copy(cBot);
        hemi.color.copy(cSky);
        dirL.color.copy(cCrest);
        clickLight.color.copy(cGlow);
        cEmiss.copy(cGlow).multiplyScalar(0.45);
        shardMat.emissive.copy(cEmiss);
      }

      /* ---------- dynamic connections (random, fading) ---------- */
      // Two pools of LineSegments: lines between shards, and tethers down to the floor.
      // Each segment lives a lifecycle: off -> fade in -> hold -> fade out -> off.
      const INTER_MAX = 34;
      const FLOOR_MAX = 20;

      function makeConnections(max, kind) {
        const positions = new Float32Array(max * 6);
        const alphas = new Float32Array(max * 2);
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('aAlpha', new THREE.BufferAttribute(alphas, 1));
        const material = new THREE.ShaderMaterial({
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          uniforms: { uColor: { value: new THREE.Color() }, uOpacity: { value: 0 } },
          vertexShader: `attribute float aAlpha; varying float vA;
            void main(){ vA = aAlpha; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,
          fragmentShader: `uniform vec3 uColor; uniform float uOpacity; varying float vA;
            void main(){ gl_FragColor = vec4(uColor, vA * uOpacity * 0.30); }`,
        });
        const lines = new THREE.LineSegments(geometry, material);
        scene.add(lines);
        const items = [];
        for (let i = 0; i < max; i++) {
          items.push({ a: 0, b: 0, state: 0, t: 0, hold: 1, delay: Math.random() * 3.5, alpha: 0 });
        }
        return { positions, alphas, geometry, material, lines, items, kind };
      }

      const connInter = makeConnections(INTER_MAX, 'inter');
      const connFloor = makeConnections(FLOOR_MAX, 'floor');
      const conns = [connInter, connFloor];
      let connFade = 0;

      // dev-only handle for automated checks (stripped from production builds)
      if (import.meta.env.DEV) {
        window.__BG3D__ = { connInter, connFloor, sd };
      }

      const updateConnections = (dt) => {
        connFade = Math.min(1, connFade + dt * 0.8);
        const FADE = 0.25; // fade in/out — total visible connection stays <= 1s
        for (const sys of conns) {
          const n = sys.items.length;
          for (let i = 0; i < n; i++) {
            const it = sys.items[i];
            if (it.state === 0) {
              it.delay -= dt;
              if (it.delay <= 0) {
                it.a = (Math.random() * SH_N) | 0;
                it.b = (Math.random() * SH_N) | 0;
                if (sys.kind === 'inter') {
                  while (it.b === it.a) it.b = (Math.random() * SH_N) | 0;
                }
                it.state = 1;
                it.t = 0;
                it.hold = 0.1 + Math.random() * 0.4; // 0.1-0.5s hold
              }
            } else {
              it.t += dt;
              if (it.state === 1) {
                it.alpha = Math.min(1, it.t / FADE);
                if (it.t >= FADE) { it.state = 2; it.t = 0; }
              } else if (it.state === 2) {
                it.alpha = 1;
                if (it.t >= it.hold) { it.state = 3; it.t = 0; }
              } else {
                it.alpha = Math.max(0, 1 - it.t / FADE);
                if (it.t >= FADE) { it.state = 0; it.delay = 0.4 + Math.random() * 2.6; it.alpha = 0; }
              }
            }

            const p = sys.positions;
            const a = sys.alphas;
            const i6 = i * 6;
            const i2 = i * 2;
            if (it.state !== 0) {
              const sA = sd[it.a];
              const sB = sd[it.b];
              p[i6] = sA.pos.x; p[i6 + 1] = sA.pos.y; p[i6 + 2] = sA.pos.z;
              if (sys.kind === 'floor') {
                p[i6 + 3] = sA.pos.x; p[i6 + 4] = 0; p[i6 + 5] = sA.pos.z;
              } else {
                p[i6 + 3] = sB.pos.x; p[i6 + 4] = sB.pos.y; p[i6 + 5] = sB.pos.z;
              }
              a[i2] = it.alpha; a[i2 + 1] = it.alpha;
            }
          }
          sys.geometry.attributes.position.needsUpdate = true;
          sys.geometry.attributes.aAlpha.needsUpdate = true;
          sys.material.uniforms.uOpacity.value = connFade;
          sys.material.uniforms.uColor.value.copy(cGlow);
        }
      };

      /* ---------- main loop ---------- */
      const clock = new THREE.Clock();
      let fade = 0;

      const tick = () => {
        this._raf = requestAnimationFrame(tick);
        const dt = Math.min(clock.getDelta(), 0.05);
        time += dt * timeScale;

        scrollS += (scrollP - scrollS) * Math.min(1, dt * 4);
        const p = scrollS;

        fade = Math.min(1, fade + dt * 0.7);
        pMat.uniforms.uOpacity.value = fade;
        pMat.uniforms.uTime.value = time;
        bgMat.uniforms.uTime.value = time;

        mousePower += (mousePowerT - mousePower) * Math.min(1, dt * 8);
        mousePowerT *= Math.exp(-dt * 2.2);
        mouseWorld.lerp(mouseTarget, Math.min(1, dt * 6));
        pMat.uniforms.uMouse.value.copy(mouseWorld);
        pMat.uniforms.uMousePower.value = mousePower;
        pMat.uniforms.uAmp.value = 0.9 + p * 0.55 + energy * 0.2;

        mixPals(p);

        /* camera rig: parallax + scroll dive */
        parX += (parTX - parX) * Math.min(1, dt * 3);
        parY += (parTY - parY) * Math.min(1, dt * 3);
        camera.position.set(
          parX * 2.1,
          THREE.MathUtils.lerp(7.0, 2.6, p) + parY * 0.9 + Math.sin(time * 0.4) * 0.1,
          THREE.MathUtils.lerp(17.5, 7.5, p)
        );
        camera.lookAt(0, 0.4 - p * 0.8, THREE.MathUtils.lerp(-1, -7, p));

        /* shards: spring home, flee cursor, scatter on click */
        energy *= Math.exp(-dt * 1.6);
        const spin = 1 + p * 1.5 + energy * 4;
        for (let i = 0; i < SH_N; i++) {
          const s = sd[i];
          s.vel.x += (s.home.x - s.pos.x) * 1.4 * dt;
          s.vel.y += (s.home.y - s.pos.y) * 1.4 * dt;
          s.vel.z += (s.home.z - s.pos.z) * 1.4 * dt;
          const mdx = s.pos.x - mouseWorld.x, mdz = s.pos.z - mouseWorld.y;
          const md = Math.hypot(mdx, mdz);
          if (md < 5 && md > 0.001) {
            const f = (1 - md / 5) * 10 * dt;
            s.vel.x += (mdx / md) * f; s.vel.z += (mdz / md) * f;
          }
          s.vel.multiplyScalar(Math.exp(-dt * 1.8));
          s.pos.addScaledVector(s.vel, dt);
          s.rot.x += s.spin.x * dt * spin; s.rot.y += s.spin.y * dt * spin; s.rot.z += s.spin.z * dt * spin;
          dummy.position.copy(s.pos);
          dummy.rotation.copy(s.rot);
          dummy.scale.setScalar(s.scale * (1 + energy * 0.15));
          dummy.updateMatrix();
          shards.setMatrixAt(i, dummy.matrix);
        }
        shards.instanceMatrix.needsUpdate = true;

        clickLight.intensity *= Math.exp(-dt * 3.0);

        updateConnections(dt);

        renderer.render(scene, camera);
      };
      tick();

      const onVisibility = () => {
        if (document.hidden) {
          if (this._raf) cancelAnimationFrame(this._raf);
        } else if (!this._raf && !RM) {
          tick();
        }
      };
      document.addEventListener('visibilitychange', onVisibility);

      this._state = {
        renderer, scene, camera, geometry: geo, particleMaterial: pMat,
        bgMat, shardMat, shards, conns, tick, onVisibility,
      };
      this._cleanup = () => {
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerdown', onPointerDown);
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onResize);
        document.removeEventListener('visibilitychange', onVisibility);
        if (this._raf) cancelAnimationFrame(this._raf);
      };
    },
    destroy() {
      if (this._cleanup) this._cleanup();
      const s = this._state;
      if (s) {
        s.geometry.dispose();
        s.particleMaterial.dispose();
        s.bgMat.dispose();
        s.shardMat.dispose();
        s.shards.dispose();
        for (const c of s.conns || []) {
          c.geometry.dispose();
          c.material.dispose();
        }
        s.renderer.dispose();
      }
      this._state = null;
    },
  },
};
</script>

<style scoped>
.grain {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='260' height='260'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='260' height='260' filter='url(%23n)'/%3E%3C/svg%3E");
  animation: grain 1.1s steps(4) infinite;
}
@keyframes grain {
  0% { transform: translate(0, 0); }
  25% { transform: translate(-2%, 3%); }
  50% { transform: translate(3%, -2%); }
  75% { transform: translate(-3%, -3%); }
  100% { transform: translate(2%, 2%); }
}
@media (prefers-reduced-motion: reduce) {
  .grain {
    animation: none;
  }
}
</style>
