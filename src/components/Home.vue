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
      <Portfolio v-if="vision === 'portfolio'" class=" relative     " />

    </div>
  </div>
</template>
<script>

//------------------
//--- Components ---
//------------------


//--- Home Page ----

import Navbar from './Navbar.vue'
import Drawer from './drawer.vue'

//--- Profession ---

import Diplomas from './01_Profession/Diplomas.vue'
import TimeLine from './01_Profession/TimeLine.vue'

//--- Art ----------


import Network from './00_Art/Network.vue'
import Coliders from './00_Art/Coliders.vue'
import Cube from './00_Art/Cube.vue'
import Typing from './00_Art/Typing.vue'
import Galaxy from './00_Art/galaxy.vue'

//--- Data Science -

import Portfolio from './02_DataScience/Portfolio.vue' 



export default {
  data() {

    return {
      vision: 'timeline',

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
    Galaxy,
    Portfolio
  },
  methods: {
    change_vision(page) {

      this.vision = page;
    }

  }
}

</script>
<style ></style>

