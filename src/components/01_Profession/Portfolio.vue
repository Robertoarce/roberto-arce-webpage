<template> 
  <div class="bg-gray-700 p-10 overflow-auto">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-8 auto-rows-fr items-stretch ">
      <div v-for="(project, projectIndex) in projects" :key="projectIndex" 
      class="flex flex-col bg-white rounded-lg shadow-lg pb-5 px-5   ">
        
      <div class="text-center 1/6">
          <h3 class="font-semibold text-base md:text-xl m-5 line-clamp-2">{{ project.title }}</h3>
        </div>

        <div class="   justify-center   items-center  pt-5       ">
          <template v-if="imageModulesArray.length" >
            <template v-for="({ path, url }, index) in imageModulesArray" :key="index" class="">
               

                <img v-if="project.images.includes(path.split('/').pop())"
                :src="url"
                :alt="`Loaded image from ${path.split('/').pop()}`"
                class="rounded         h-max-5/6 ">
              
            </template>
          </template>
        </div>



       

          <div class="mt-3 flex flex-row flex-grow description-container  max-h-max " style="max-height: fit-content; overflow-y: auto;">
            <div class="text-gray-700    text-xs md:text-base m-5  " v-html="project.description"></div>
          </div>

          <div class="grow h-1/6 pt-2">
          
          <div class=" p-3 items-left justify-start space-y-4  ">
            <a v-if="project.git_link && project.git_link !== ''" :href="project.git_link" target="_blank" class="inline-flex items-center justify-center px-4 py-2 mr-4 border border-transparent text-xs font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700">
              Git Repository
            </a>
            <a v-if="project.notebook_url && project.notebook_url !== ''" :href="project.notebook_url" target="_blank" class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-xs font-medium rounded-md text-white bg-yellow-500 hover:bg-yellow-700">
              View Notebook
            </a>
          </div>
          
          <div class="items-end">
            <div class="p-3 flex flex-wrap">
              <img v-for="tech in project.technologies" :key="tech" :src="generateBadgeUrl(tech)" :alt="tech" class="h-6 mr-2 mt-2">
            </div>
          </div>
          
        </div>
      </div>
    </div>
  </div> 
</template>



<style>
/* Scrollbar styles */
.description-container ::-webkit-scrollbar {
  width: 2px;
}

.description-container ::-webkit-scrollbar-track {
  background: transparent; /* Optional: just in case you want a transparent track */
}

.description-container ::-webkit-scrollbar-thumb {
  background: #ff6347; /* A nice tomato color for the thumb */
  border-radius: 2px;
}

/* For other browsers that support scrollbar styling */
.description-container {
  scrollbar-width: thin;
  scrollbar-color: #ff6347 transparent; /* thumb and track color */
}
</style>

<script>
import fetchRepositoriesData from '@utils/repositories.js';  
const imageModules = import.meta.globEager('/src/assets/screenshots/*.*');
// const imageModules = import.meta.globEager('/src/assets/screenshots/*.jpg');

export default {
  data() {
    return {
      projects: [], // Projects data
    };
  },
  created() {
    fetchRepositoriesData().then((projectsData) => {
      this.projects = projectsData;
      console.log('Image Modules:', imageModules); 
    }).catch((error) => {
      console.error('Error fetching projects data:', error);
    });
  },
  methods: {
    getImage(imageName) { 
    // const imagePath = `./assets/screenshots/${imageName}`;
    const imagePath = `./src/assets/screenshots/${imageName}`;
      return imageModules[imagePath]?.default || '';
    },
    generateBadgeUrl(tech) {
      const base = "https://img.shields.io/badge/";
      const label = tech.replace(/\s+/g, '_');
      const color = 'blue';
      const style = "plastic";
      const logo = tech.toLowerCase();
    
      return `${base}${label}-${color}?style=${style}&logo=${logo}`;
    }
  },
  
  computed: {
  imageModulesArray() {
    return Object.entries(imageModules).map(([path, module]) => {
      return { path, url: module.default }; // Adjust this line if your module structure is different
    });
  }
},

}
</script>
 

