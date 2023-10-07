<template >
  <div>

    <div>
      <Navbar class="absolute top-0 left-0 right-0 z-10" />
    </div>
    <Breadcrumb class="absolute top-16 left-0 right-0 z-12" />
    <div>

      <Cube class="relative inset-0" />
    </div>
  </div>
</template>
<script>

import Cube from './cube.vue'
import Navbar from './Navbar.vue'
import Breadcrumb from './bread.vue'

export default {
  components: { Cube, Navbar, Breadcrumb }
}
</script>
<style ></style>

 
 