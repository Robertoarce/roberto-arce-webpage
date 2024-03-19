<template >
  <div class="flex flex-col  ">
    <Navbar class="w-full z-50" />
    <div >
      <Drawer class=" z-50" @sent_page="change_vision" />
      <Diplomas v-if="vision === 'diplomas'" class="z-10 h-screen" />
      <Cube v-if="vision === 'cube'" class="relative  " />
      <Typing v-if="vision === 'cube'" class="     z-40  " />
      <TimeLine v-if="vision === 'timeline'" class="       " />
      <Network v-if="vision === 'network'" class="   h-screen      " />
      <Coliders v-if="vision === 'coliders'" class="  h-screen       " />
      <Galaxy v-if="vision === 'galaxy'" class=" relative  h-screen    " />
      <Portfolio v-if="vision === 'portfolio'" class=" relative  h-screen    " />
      <Start v-if="vision === 'start'" class=" relative h-screen " />

    </div>
  </div>
</template>


<script>
import { defineAsyncComponent } from 'vue';

// Static import for components that are always visible or needed immediately
import Navbar from './Navbar.vue'
import Drawer from './Drawer.vue'

// Dynamic imports for other components
const Diplomas = defineAsyncComponent(() => import('./01_Profession/Diplomas.vue'));
const TimeLine = defineAsyncComponent(() => import('./01_Profession/TimeLine.vue'));
const Start = defineAsyncComponent(() => import('./01_Profession/StartPage.vue'));

const Network = defineAsyncComponent(() => import('./00_Art/Network.vue'));
const Coliders = defineAsyncComponent(() => import('./00_Art/Coliders.vue'));
const Cube = defineAsyncComponent(() => import('./00_Art/Cube.vue'));
const Typing = defineAsyncComponent(() => import('./00_Art/Typing.vue'));
const Galaxy = defineAsyncComponent(() => import('./00_Art/Galaxy.vue'));

const Portfolio = defineAsyncComponent(() => import('./01_Profession/Portfolio.vue'));

export default {
  data() {
    return {
      vision: 'start',
    }
  },
  components: {
    Navbar,
    Drawer,
    // Register dynamically imported components
    Diplomas,
    TimeLine,
    Start,
    Network,
    Coliders,
    Cube,
    Typing,
    Galaxy,
    Portfolio,
  },
  methods: {
    change_vision(page) {
      this.vision = page;
    }
  }
}
</script>

<style ></style>

./01_Profession/Portfolio.vue