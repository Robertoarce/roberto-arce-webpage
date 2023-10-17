<template>
  <div class="   flex flex-col  h-screen   bg-white      gradient-bg z-0   ">
    <div class="  flex-none h-10px ">

    </div>
    <div class="  flex flex-col h-2/3   items-center m-0 p-10 ">

      <!-- image -->
      <div class="flex bg-transparent h-2/3 pb-10 ">
        <img :src="items[currentIndex].image" class="object-cover w-full h-full rounded-lg shadow-lg">
      </div>

      <!-- description -->
      <div class="flex flex-col flex-shrink h-2/5 p-10 w-1/4 bg-indigo-100 rounded-lg shadow-lg">
        <h1 class="text-gray-900 font-bold text-2xl tracking-tight">{{ items[currentIndex].title }}</h1>
        <p class="flex-shrink-0 pt-10 text-gray-600 leading-6">{{ items[currentIndex].description }}</p>
      </div>
    </div>

    <!-- buttons -->
    <div class="flex justify-center w-1/5 mx-auto mt-5 mb-4">
      <button @click="prevItem"
        class="flex-grow px-5 py-1 bg-slate-700 hover:bg-emerald-500 text-gray-100 font-bold rounded-full">
        Preview
      </button>
      <div class="flex-grow"></div>
      <button @click="nextItem"
        class="flex-grow px-5 py-1 bg-slate-700 hover:bg-emerald-500 text-gray-100 font-bold rounded-full">
        Next
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentIndex: 0,
      ShowDiplomas: true,
      items: [
        {
          image: 'src/assets/diplomas/politecnico_milano.jpg',
          title: 'Msc Supply Chain - Achieve global perspective',
          description: "Supply Chain provided real-world context for data analysis, aiding in translating data insights into actionable strategies, and bridging the analytical and operational aspects of projects. \
          This was later enhanced with Data Science knowledge. ",
          isDiploma: true

        },  // Updated paths
        {
          image: 'src/assets/diplomas/upsa.jpg',
          title: 'Bachelor Industrial Engineering - Solid thinking foundations',
          description: 'The essence of engineering optimization, embodied in Industrial Engineering, acts as the cornerstone for my professional growth and innovation.',
          isDiploma: true

        },
        {
          image: 'src/assets/diplomas/imm.jpg',
          title: 'Msc Management - Business understanding',
          description: 'A solid framework to thrive in the ever-evolving business landscape.',
          isDiploma: true

        },
        {
          image: 'src/assets/diplomas/msc_finance_eng.jpg',
          title: 'Msc Finance - Quantitative financial management',
          description: 'Deepen my understanding of financial dynamics and strategies in corporate finance as well as market finance.',
          isDiploma: true

        },
        {
          image: 'src/assets/diplomas/disney.jpg',
          title: 'Internship - Disney Engineering',
          description: ' This is a 6 month program at World Disney Orlando. Key learnings engineering at Disney and premium customer service.',
          isDiploma: false

        },
      ]

    }
  },
  methods: {
    nextItem() {

      this.currentIndex = (this.currentIndex + 1) % this.items.length;
    },
    prevItem() {
      this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
    },
    ToggleDiplomas() {
      this.ShowDiplomas = !this.ShowDiplomas;
      this.currentIndex = 0;
    }
  },

}
</script>
 
<style>
.gradient-bg {
  background: radial-gradient(ellipse at center, #314b9e 10%, #02010e 80%);

  background-size: 140% 100%;
  background-position: center;
  background-repeat: no-repeat;

}
</style>

 