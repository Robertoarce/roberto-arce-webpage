<template>
  
 <div ref="scene" @contextmenu.prevent class="relative " /> 
 
  
</template>

<script>
import { Particle, ExplosionParticle, mousePressed } from './utils/Planet';

export default {
  data() {
    return {
      p5Instance: null,
    };
  },
  async mounted() {
    // Dynamically import p5.js only when this component is mounted
    const p5Module = await import('p5');
    const p5 = p5Module.default;
    this.p5Instance = new p5(this.sketch, this.$refs.scene);
  },
  beforeDestroy() {
    this.p5Instance.remove();
  },
  methods: {
    sketch(p) {
      let particles = [];
      let explosionParticles = [];

      p.setup = () => {
        const canvasHeight = window.innerWidth < 768 ? p.windowHeight * 0.8 : p.windowHeight;
        p.createCanvas(p.windowWidth, canvasHeight);
        const particleCount = window.innerWidth < 768 ? p.width / 20 : p.width / 10;
        for (let i = 0; i < particleCount; i++) {
          particles.push(new Particle(p));
        }
      };

      p.draw = () => {
        p.background('#000');
        for (let i = 0; i < particles.length; i++) {
          particles[i].createParticle();
          particles[i].moveParticle();
          particles[i].checkCollision(particles.slice(i + 1));
        }

        for (let i = explosionParticles.length - 1; i >= 0; i--) {
          explosionParticles[i].createParticle();
          explosionParticles[i].moveParticle();
          if (explosionParticles[i].alpha <= 0) {
            explosionParticles.splice(i, 1);  // remove faded particles
          }
        }
      };

      p.mousePressed = () => {
        mousePressed(p, particles, explosionParticles);
      };
    },
  },
};

</script>

<style scoped>
div {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>