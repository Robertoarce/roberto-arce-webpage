<template>
  <div class="pointer-events-none absolute top-24 left-4 z-40 w-4/5 sm:top-1/4 sm:left-8 sm:w-96">
    <div
      v-for="(line, i) in animatedLines"
      :key="i"
      class="cursor-blink font-display"
      :class="line.weight"
    >
      <span>{{ line.text }}</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      lines: [
        { key: 'a', text: 'Drag to rotate the camera', weight: 'font-semibold text-base sm:text-lg text-white/90', delay: 400, speed: 45, stay: 2600 },
        { key: 'b', text: 'Click the cube to restore gravity', weight: 'font-medium text-sm sm:text-base text-accent-soft', delay: 3400, speed: 40, stay: 3000 },
        { key: 'c', text: 'Watch the spheres collide', weight: 'font-medium text-sm sm:text-base text-white/80', delay: 7200, speed: 45, stay: 2800 },
        { key: 'd', text: 'A 3D physics playground', weight: 'font-light text-sm sm:text-base text-white/60', delay: 10400, speed: 45, stay: 2600 },
      ],
      animatedLines: [
        { text: '', weight: '' },
        { text: '', weight: '' },
        { text: '', weight: '' },
        { text: '', weight: '' },
      ],
      cursors: [false, false, false, false],
    };
  },
  created() {
    this.lines.forEach((line, index) => {
      this.animateLine(line, index);
    });
  },
  methods: {
    animateLine(line, index) {
      const text = line.text;
      setTimeout(() => {
        this.cursors[index] = true;
        let current = 0;
        const typeTimer = setInterval(() => {
          if (current < text.length) {
            this.animatedLines[index].text += text[current];
            current += 1;
          } else {
            clearInterval(typeTimer);
            setTimeout(() => {
              const deleteTimer = setInterval(() => {
                if (this.animatedLines[index].text.length > 0) {
                  this.animatedLines[index].text = this.animatedLines[index].text.slice(0, -1);
                } else {
                  clearInterval(deleteTimer);
                  this.cursors[index] = false;
                }
              }, line.speed / 2);
            }, line.stay);
          }
        }, line.speed);
      }, line.delay);
    },
  },
};
</script>

<style scoped>
.cursor-blink span::after {
  content: '|';
  animation: blink 1s step-end infinite;
  margin-left: 2px;
  color: var(--accent);
}

@keyframes blink {
  0%, 100% { opacity: 0; }
  50% { opacity: 1; }
}
</style>
