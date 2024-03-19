<template > 

  <div class="flex bg-gray-700 text-white h-screen"> 
  
    <!-- Left side -->
      <div class="flex flex-col h-screen w-2/6">
      
        <!-- First vertical split -->

        <div class=h-1/6></div>
        
        <div class="flex flex-col items-center  justify-end       ">
           
          <div class=" w-3/4 justify-center   ">
            <img class="    	 rounded-xl    	" src="./../../assets/roberto.jpg" alt="">
          </div>
        </div>

        <!-- Second vertical split -->
        <div class="flex flex-row    p-5  sm:text-base text-xs">
                <div class="w-1/5    "></div>
                  <div class="w-2/3 justify-start items-end">
                    <div class=" text-yellow-200  font-semibold tracking-wide  hover:text-blue-400">
                      Data Scientist | AI Engineer   
                    </div>
                    <div >
                      <div class=" pt-2  text-gray-400 hover:text-gray-900">
                      Statistical Modeling | Data Mining                    
                    </div>
                      <div class="text-gray-200 font-light "> Unleashing the Power of Data and AI
                      </div >
                    </div>
                    <p class=" text-white pt-1">
                      Currently based in <b> Paris</b>
                    </p>
            </div>
        </div>
   
      </div>
  
  <!-- Right side -->
  <div class="flex flex-col w-4/6 pr-5  pb-14  h-full overflow-scroll hide-scrollbar">
    <!-- Sticky container div -->
    <div class="sticky top-0 z-20 pb-4 bg-gray-700"> <!-- Adjust the background color as needed -->
      <h1 class="m-3 text-center text-2xl sm:text-5xl text-white-900 font-sans font-light">
        Latest Projects
         <!-- Selected Projects    -->
      </h1>
      <h1 class="m-0 sm:m-2 text-center text-lg md:text-3xl text-blue-400 font-extralight">
        Data Scientist | ML Engineer | AI developer <br>
      </h1>
      <div class="h-1/6 z-5 bg-gray-700 border-b-2 border-yellow-300">  
      </div>
    </div>
    <!-- End of Sticky container div -->
  
    <!-- Projects loop -->
    <div v-for="(repo, index) in repositories" class="relative flex flex-col p-5 md:justify-normal py-2">
      <div v-if="repo.in_startpage" class="relative flex flex-col p-5 md:justify-normal py-2">
    <!-- content -->
 
     
      <!-- Title -->
      <div  class="flex justify-start p-2 pl-0 md:text-xl color-1">{{ repo['title'] }}</div>
      
      <!-- Description -->
      <div class="text-sm md:text-base" v-html="repo.description"></div>
  
       <!-- GitHub Button -->
       <div v-if="repo.git_link" class="pt-2">
        <a :href="repo.git_link" target="_blank" 
        class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700">
          <svg class="github-icon mr-2 -ml-1 w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.86 2.33.66.07-.52.28-.86.51-1.06-1.8-.2-3.69-.9-3.69-4 0-.88.31-1.6.82-2.17-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.57.82 1.29.82 2.17 0 3.1-1.89 3.8-3.69 4 .29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
          </svg>
          Github Repository
        </a>
      </div>
      
      
      
      <!-- Badges display -->
  
        <div class="p-3 flex flex-wrap">
        <img v-for="tech in repo['technologies']" :key="tech" :src="generateBadgeUrl(tech)" :alt="tech" class="h-6 mr-2 mt-2 ">
            </div>
        
      
      <!-- Yellow Line -->
      <div class="flex justify-center pt-8"><hr /></div>
    </div>
  </div>
  </div>
    
  
  </div>
   
  </template>
  
  
  
  <script>
  import fetchRepositoriesData from '@utils/repositories.js'; 
  
  export default {
    data() {
      return {
        repositories: []
      };
    },
    created() {
      fetchRepositoriesData().then((repositoriesData) => {
        this.repositories = repositoriesData;
      }).catch((error) => {
        console.error('Error fetching repositories data:', error);
      });
    },
    methods: {
      generateBadgeUrl(tech, defaultColor) {
    // Dynamically generate a badge URL using Shields.io
    const base = "https://img.shields.io/badge/";
    const label = tech.replace(/\s+/g, '_'); // Replace spaces with underscores
    const message = "";
    const color = 'defaultColor';
    const style = "plastic";
    const logo = tech.toLowerCase(); // Use the badge's logo if defined, otherwise a generic one
  
    
    return `${base}${label}-${message}-${color}?style=${style}&logo=${logo}`;
  }
    }
  }
  </script>
  
  
  <style >
    
    hr {   
        border: 0.5px solid #FFDB5C;
        box-shadow: 0 0 5px 0 #DDA288;
        width: 25%;   
        overflow: visible; 
  } 
  
  /* Hide scrollbar for Chrome, Safari and Opera */
  .hide-scrollbar::-webkit-scrollbar {
    display: none; /* for Chrome, Safari, and Opera */
  }
  
  /* Hide scrollbar for IE, Edge, and Firefox */
  .hide-scrollbar {
    -ms-overflow-style: none;  /* for Internet Explorer, Edge */
    scrollbar-width: none;  /* for Firefox */
  }
  
  
  .color-1{
  
    color: #52b8fd
  }
  </style>