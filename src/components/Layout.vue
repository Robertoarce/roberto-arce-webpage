<template>
  <div class="flex flex-col">
    <Navbar class="w-full z-50" />
    <div>
      <Drawer class="z-50" />
      <!-- Router content will be displayed here -->
      <router-view class="h-screen" />
    </div>
  </div>
</template>

<script>
import Navbar from "./Navbar.vue";
import Drawer from "./drawer.vue";

export default {
  name: "Layout",
  components: {
    Navbar,
    Drawer,
  },
};
</script>

<style scoped></style>
