<template> 
  <div class="bg-gray-700 p-2 sm:p-4 md:p-6 lg:p-10 overflow-auto">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 auto-rows-fr items-stretch">
      <div v-for="(project, projectIndex) in projects" :key="projectIndex" 
      class="flex flex-col bg-white rounded-lg shadow-lg pb-3 sm:pb-4 lg:pb-5 px-3 sm:px-4 lg:px-5">
        
      <div class="text-center 1/6">
          <h3 class="font-semibold text-sm sm:text-base lg:text-xl m-2 sm:m-3 lg:m-5 line-clamp-2">{{ project.title }}</h3>
        </div>

        <div class="justify-center items-center pt-3 sm:pt-4 lg:pt-5">
          <template v-if="imageModulesArray.length" >
            <template v-for="({ path, url }, index) in imageModulesArray" :key="index" class="">
                <img v-if="project.images.includes(path.split('/').pop())"
                :src="url"
                :alt="`Loaded image from ${path.split('/').pop()}`"
                class="rounded w-full h-auto max-h-48 sm:max-h-56 lg:max-h-64 object-cover">
            </template>
          </template>
        </div>

          <div class="mt-2 sm:mt-3 flex flex-row flex-grow description-container max-h-max" style="max-height: fit-content; overflow-y: auto;">
            <div class="text-gray-700 text-xs sm:text-sm lg:text-base m-2 sm:m-3 lg:m-5" v-html="project.description"></div>
          </div>

          <div class="grow h-1/6 pt-1 sm:pt-2">
          
          <div class="p-2 sm:p-3 items-left justify-start space-y-2 sm:space-y-4">
            <a v-if="project.git_link && project.git_link !== ''" :href="project.git_link" target="_blank" class="inline-flex items-center justify-center px-2 sm:px-3 lg:px-4 py-1 sm:py-2 mr-2 sm:mr-4 border border-transparent text-xs font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700">
              Git Repository
            </a>
            <a v-if="project.notebook_url && project.notebook_url !== ''" :href="project.notebook_url" target="_blank" class="inline-flex items-center justify-center px-2 sm:px-3 lg:px-4 py-1 sm:py-2 border border-transparent text-xs font-medium rounded-md text-white bg-yellow-500 hover:bg-yellow-700">
              View Notebook
            </a>
          </div>
          
          <div class="items-end">
            <div class="p-2 sm:p-3 flex flex-wrap">
              <img v-for="tech in project.technologies" :key="tech" :src="generateBadgeUrl(tech)" :alt="tech" class="h-4 sm:h-5 lg:h-6 mr-1 sm:mr-2 mt-1 sm:mt-2">
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
import fetchRepositoriesData from '/src/data/repositories.js';  
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
 

