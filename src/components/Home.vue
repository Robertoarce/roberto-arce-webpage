<template >
  <div class="flex flex-col h-screen">
    <Navbar class="w-full z-50" />
    <div>
      <Drawer class=" z-50" @sent_page="change_vision" />
      <Diplomas v-if="vision === 'diplomas'" class="z-10" />
      <Cube v-if="vision === 'cube'" class="relative inset-0" />

    </div>
  </div>
</template>
<script>

import Cube from './cube.vue'
import Navbar from './Navbar.vue'
import Breadcrumb from './bread.vue'
import Drawer from './drawer.vue'
import Diplomas from './Diplomas.vue'

export default {
  data() {

    return {
      vision: 'cube',

    }
  },
  components: {
    Cube,
    Navbar, Breadcrumb, Drawer,
    Diplomas
  },
  methods: {
    change_vision(page) {
      console.log('current vision', this.vision);
      this.vision = page;
      console.log('given vision to', page);
      console.log('changed vision to', this.vision);
    }

  }
}





</script>
<style ></style>

