<template >
  <div class="flex flex-col h-screen">
    <Navbar class="w-full z-50" />
    <div>
      <Drawer class=" z-50" />
      <Carousel class=" z-10" />

      <Cube v-if="vision == 'cube'" class="relative inset-0" />

    </div>
  </div>
</template>
<script>

import Cube from './cube.vue'
import Navbar from './Navbar.vue'
import Breadcrumb from './bread.vue'
import Drawer from './drawer.vue'
import Carousel from './carousel.vue'

export default {
  data() {

    return {
      vision: 'cubse',

    }
  },
  components: {
    Cube,
    Navbar, Breadcrumb, Drawer,
    Carousel
  }
}
</script>
<style ></style>

