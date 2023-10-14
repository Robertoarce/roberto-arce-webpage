<template >
  <div>

    <div>

      <Navbar class="absolute top-0 left-0 right-0 z-10" />
    </div>
    <Drawer class="absolute top-40 z-13" />
    <!-- <Breadcrumb class="absolute pt-36 pl-4 left-0 right-0 z-12" /> -->
    <div>

      <Cube class="relative inset-0" />

      <!-- <Carousel class='absolute' top 30 z-133 /> -->

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
  components: {
    Cube,
    Navbar, Breadcrumb, Drawer,
    Carousel
  }
}
</script>
<style ></style>

