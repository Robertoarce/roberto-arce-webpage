<template> 
  <div class="bg-gray-700 p-10 overflow-auto">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      <div
        v-for="(project, projectIndex) in projects"
        :key="projectIndex"
        class="flex flex-col bg-white rounded-lg shadow-lg   "
      >

       <!-- TTITLE -->
       <div class=" text-center">
         <h3 class="font-semibold text-xl m-5">{{ project.title }}</h3>
       </div>

         <!-- Images Display Start -->
          <div class="flex flex-auto justify-center   object-cover   ">
            <div v-for="(imageName, index) in project.images" :key="index" class="p-2">
              <img :src="`/src/assets/screenshots/${imageName}`" :alt="`Image for ${project.title}`" 
              class="  rounded-xl max-w-full max-h-full"  >
            </div>
          </div>
          <!-- Images Display End -->


        <!-- TEXT-->
        <div class="p-6 flex flex-col flex-grow overflow-auto  ">
         
          <!-- DESCRIPTION -->
          <p class="text-gray-700 text-base mb-4" v-html="project.description"></p>
        </div>

        <!-- Git NBviewer + badges --> 

        <div class="ml-5 pt-2  items-left justify-start space-y-4">

          <!-- GIT -->
          <a v-if="project.git_link && project.git_link !== ''" :href="project.git_link" target="_blank" 
            class="inline-flex  items-center justify-center px-4 py-2 mr-4 border border-transparent text-base font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700">
            <svg class="github-icon mr-2 -ml-1 w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.86 2.33.66.07-.52.28-.86.51-1.06-1.8-.2-3.69-.9-3.69-4 0-.88.31-1.6.82-2.17-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.57.82 1.29.82 2.17 0 3.1-1.89 3.8-3.69 4 .29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>  
            Git Repository
          </a>

          <!-- Notebook -->
          <a v-if="project.notebook_url && project.notebook_url !== ''" :href="project.notebook_url" target="_blank" 
            class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white
             bg-yellow-500 hover:bg-yellow-700">
            View Notebook
          </a>
        </div>

        <!-- Badges container -->
        <div class="items-end">

          <div class="p-3 flex flex-wrap">
            <img
            v-for="tech in project.technologies"
            :key="tech"
            :src="generateBadgeUrl(tech)"
            :alt="tech"
            class="h-6 mr-2 mt-2 "
            />
          </div>
        </div>
      </div>
    </div>
  </div> 
</template>


<script>
import fetchRepositoriesData from '@utils/repositories.js'; 
const imageModules = import.meta.globEager('@/src/assets/screenshots/*.jpg'); // Adjust the path as necessary
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
    }).catch((error) => {
      console.error('Error fetching projects data:', error);
    });
  },
  methods: {
    getImage(imageName) { 
    const imagePath = `./src/assets/screenshots/${imageName}`;
      return imageModules[imagePath]?.default;
    },
    generateBadgeUrl(tech) {
      const base = "https://img.shields.io/badge/";
      const label = tech.replace(/\s+/g, '_');
      const color = 'blue';
      const style = "plastic";
      const logo = tech.toLowerCase();
    
      return `${base}${label}-${color}?style=${style}&logo=${logo}`;
    }
  }
}
</script>
 

