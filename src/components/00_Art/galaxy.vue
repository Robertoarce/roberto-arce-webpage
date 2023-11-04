<template>
  
 <div ref="scene" @contextmenu.prevent class="relative " /> 
 
  
</template>

<script>
import p5 from 'p5';
import { Particle, ExplosionParticle, mousePressed } from './utils/Planet';

export default {
  data() {
    return {
      p5Instance: null,
    };
  },
  mounted() {
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
        p.createCanvas(p.windowWidth, p.windowHeight);
        for (let i = 0; i < p.width / 10; i++) {
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