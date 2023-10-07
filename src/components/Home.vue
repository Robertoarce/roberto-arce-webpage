<template >
  <div>

    <div>

      <Navbar class="absolute top-0 left-0 right-0 z-10" />
    </div>
    <Drawer class="absolute top-40  left-0 right-0 z-113" />
    <Breadcrumb class="absolute pt-36 pl-4 left-0 right-0 z-12" />
    <div>

      <Cube class="relative inset-0" />
    </div>
  </div>
</template>
<script>

import Cube from './cube.vue'
import Navbar from './Navbar.vue'
import Breadcrumb from './bread.vue'
import Drawer from './drawer.vue'

export default {
  components: { Cube, Navbar, Breadcrumb, Drawer }
}
</script>
<style ></style>

