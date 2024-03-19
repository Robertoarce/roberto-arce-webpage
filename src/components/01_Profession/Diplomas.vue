<template>
  <div class="   flex flex-col     bg-white      gradient-bg z-0   ">
    <div class="    ">

    </div>
    <div class="  flex flex-col h-4/5   items-center m-0 p-10 ">

      <!-- image -->
      <div class="flex bg-transparent h-2/3 pb-10 ">
        <img :src="items[currentIndex].image" class="object-cover w-full h-full rounded-lg shadow-lg">
      </div>

      <!-- description -->
      <div class="flex flex-col w-5/6   h-4/6 p-7 overflow-auto hide-scrollbar bg-indigo-100 rounded-lg shadow-lg    ">
        <!-- title -->
        <h1 class="text-gray-900 font-bold  text-sm sm:text-base md:text-xl lg:text-2xl  tracking-tight">{{ items[currentIndex].title }}</h1>
        <!-- text description -->
        <p class="flex-shrink-0  py-3 sm:p-6  text-xs  sm:text-base md:text-base lg:text-base text-gray-700 leading-6" v-html="formatNewlines(items[currentIndex].description)">
        </p>

      </div>
    </div>

    <!-- buttons -->
    <div class="flex justify-center w-1/5 mx-auto mb-4">
  <button @click="prevItem"
    class="flex-grow px-4 py-2 text-xs sm:px-6 sm:py-3 sm:text-sm md:px-8 md:py-4 md:text-base lg:px-10 lg:py-5 lg:text-lg bg-slate-700 hover:bg-emerald-500 text-gray-100 font-bold rounded-full">
    Preview
  </button>
  <button @click="ToggleDiplomas" v-if="!ShowDiplomas"
    class="flex-grow px-4 py-2 text-xs mx-4 sm:px-6 sm:py-3 sm:text-sm md:px-8 md:py-4 md:text-base md:mx-6 lg:px-10 lg:py-5 lg:text-lg lg:mx-8 bg-blue-700 hover:bg-amber-500 text-gray-100 font-bold rounded-md">
    Show Diplomas
  </button>
  <button @click="ToggleDiplomas" v-if="ShowDiplomas"
    class="flex-grow px-4 py-2 text-xs mx-4 sm:px-6 sm:py-3 sm:text-sm md:px-8 md:py-4 md:text-base md:mx-6 lg:px-10 lg:py-5 lg:text-lg lg:mx-8 bg-blue-700 hover:bg-amber-500 text-gray-100 font-bold rounded-md">
    Show Certificates
  </button>
  <div class="flex-grow"></div>
  <button @click="nextItem"
    class="flex-grow px-4 py-2 text-xs sm:px-6 sm:py-3 sm:text-sm md:px-8 md:py-4 md:text-base lg:px-10 lg:py-5 lg:text-lg bg-slate-700 hover:bg-emerald-500 text-gray-100 font-bold rounded-full">
    Next
  </button>
</div>
  </div>
</template>

<script>

import politecnico_milano from '@/politecnico_milano.jpg';
import upsa from '@/upsa.jpg';
import imm from '@/imm.jpg';
import msc_finance_eng from '@/msc_finance_eng.jpg';
import disney from '@/disney.jpg';
import ml from '@/ml.png';

export default {
  data() {
    return {
      currentIndex: 0,
      ShowDiplomas: true,

      diplomas: [
        {
          image: politecnico_milano,
          title: 'Msc Supply Chain - Global Perspective Framework',
          description: "Supply Chain provided real-world context for data analysis, aiding in translating data insights into actionable strategies,\
          \n and bridging the analytical and operational aspects of projects. \n \
           This knowledge was significantly enriched with subsequent knowledge acquired in Data Science "

        },  // Updated paths
        {
          image: upsa,
          title: 'Bachelor Industrial Engineering - Solid thinking foundations',
          description: 'The essence of engineering optimization, embodied in Industrial Engineering, \n acts as the cornerstone for my professional growth and innovation.'

        },
        {
          image: imm,
          title: 'Msc Management - Business understanding',
          description: 'A solid framework to thrive in the ever-evolving business landscape.'

        },
        {
          image: msc_finance_eng,
          title: 'Msc Finance - Quantitative financial management',
          description: 'Deepen my understanding of financial dynamics and strategies \n in corporate finance, as well as in market finance.'

        }],

      certificates: [
        {
          image: ml,
          title: 'Machine Learning Specialization - Andrew Ng - Standford (RENEWED since first course in 2018)',
          description: 'This course covers several machine learning techniques and applications, including \n <b>  Supervised Learning </b>(like linear and logistic regression,\
           neural networks, and decision trees)   <b> Unsupervised Learning </b>(such as clustering and anomaly detection) and best practices for ML development. \n  \
           It also delves into advanced topics like building <b> recommender systems </b> through collaborative filtering and content-based methods, as well as <b> constructing deep reinforcement learning models</b>.',
        },
        {
          image: disney,
          title: 'Internship - Disney Engineering',
          description: ' This is a 6 month program at World Disney Orlando.\n Studying roller coasters engineering and premium customer service at Disney University.'

        }
      ]

    }
  },
  created() {
    if (this.ToggleDiplomas) {
      this.items = this.diplomas
    }
    else {
      this.items = this.certificates
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
      this.items = this.ShowDiplomas ? this.diplomas : this.certificates;  // Update this line
      this.currentIndex = 0;

    },
    formatNewlines(text) {
      return text.replace(/\n/g, '<br>');
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

 