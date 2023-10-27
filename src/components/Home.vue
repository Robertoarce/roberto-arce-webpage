<template >
  <div class="flex flex-col h-screen">
    <Navbar class="w-full z-50" />
    <div>
      <Drawer class=" z-50" @sent_page="change_vision" />
      <Diplomas v-if="vision === 'diplomas'" class="z-10" />
      <Cube v-if="vision === 'cube'" class="relative  " />
      <Typing v-if="vision === 'cube'" class="     z-40  " />
      <TimeLine v-if="vision === 'timeline'" class="       " />
      <Network v-if="vision === 'network'" class="        " />
      <Coliders v-if="vision === 'coliders'" class="        " />
      <Galaxy v-if="vision === 'galaxy'" class=" relative     " />

    </div>
  </div>
</template>
<script>

import Navbar from './Navbar.vue'
import Diplomas from './Diplomas.vue'
import TimeLine from './TimeLine.vue'
import Drawer from './Drawer.vue'
import Network from './art/Network.vue'
import Coliders from './art/Coliders.vue'
import Cube from './art/Cube.vue'
import Typing from './art/Typing.vue'
import Galaxy from './art/galaxy.vue'


export default {
  data() {

    return {
      vision: 'cube',

    }
  },
  components: {
    Navbar,
    Cube,
    Network,
    Coliders,
    Drawer,
    Diplomas,
    TimeLine,
    Typing,
    Galaxy
  },
  methods: {
    change_vision(page) {

      this.vision = page;
    }

  }
}

</script>
<style ></style>

