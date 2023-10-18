<template >
  <div class="flex flex-col h-screen">
    <Navbar class="w-full z-50" />
    <div>
      <Drawer class=" z-50" @sent_page="change_vision" />
      <Diplomas v-if="vision === 'diplomas'" class="z-10" />
      <Cube v-if="vision === 'cube'" class="relative inset-0" />
      <TimeLine v-if="vision === 'timeline'" class="       " />

    </div>
  </div>
</template>
<script>

import Navbar from './Navbar.vue'
import Cube from './Cube.vue'
import Drawer from './Drawer.vue'
import Diplomas from './Diplomas.vue'
import TimeLine from './TimeLine.vue'


export default {
  data() {

    return {
      vision: 'timeline',

    }
  },
  components: {
    Navbar,
    Cube,
    Drawer,
    Diplomas,
    TimeLine
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

