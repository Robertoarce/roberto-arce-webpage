<template>
  <div class="carousel">
    <button @click="prev">Previous</button>
    <img :src="images[currentIndex]" alt="Diploma Image">
    <button @click="next">Next</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentIndex: 0,
      images: []
    }
  },
  created() {
    // Load all images from the 'diplomas' folder
    const requireContext = require.context('@/assets/diplomas', false, /\.(png|jpg|jpeg|gif)$/);
    this.images = requireContext.keys().map(requireContext);
  },
  methods: {
    next() {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    },
    prev() {
      this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    }
  }
}
</script>

<style scoped>
.carousel {
  display: flex;
  align-items: center;
}
</style>
