<template > 

<div class="flex bg-gray-700 text-white h-screen  "> 

  <!-- Left side -->
    <div class="flex flex-col flex-grow w-2/6">
    
      <!-- First vertical split -->
      <div class="flex w-full h-2/5">

        <div class="w-1/3"></div>

        <div class="w-1/2 flex justify-center items-end   ">
          <img class="    	 rounded-xl    	" src="./../../assets/roberto.jpg" alt="">
        </div>
      </div>
      
      <!-- Second vertical split -->
      <div class="flex flex-row    p-5  sm:text-base text-xs">
              <div class="w-1/3    "></div>
                <div class="w-2/3 justify-start items-end">
                  <div class=" text-yellow-200  font-semibold tracking-wide  hover:text-blue-400">
                    Data Scientist | ML Engineer   
                  </div>
                  <div >
                    <div class=" pt-2  text-gray-400 hover:text-gray-900">
                    Statistical Modeling | Data Mining                    
                  </div>
                    <div class="text-gray-200 font-light "> Unleashing the Power of Data and AI
                    </div >
                  </div>
                  <p class=" text-white pt-1">
                    
                    Currently based in Paris

                  </p>
                
          </div>
      </div>

      

    </div>

<!-- Right side -->
<div class="flex flex-col w-4/6 pr-8 h-full overflow-scroll hide-scrollbar">
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
  <div v-for="(repo, index) in repositories" :key="index" class="relative flex flex-col p-5 md:justify-normal py-2">
    <div class="flex justify-start p-2 pl-0 md:text-xl color-1">{{ repo['title'] }}</div>
    <div class="text-sm md:text-base">{{ repo['description'] }}</div>
    <!-- Badges display -->

  <div class="p-3 flex flex-wrap">
  <img v-for="tech in repo['tecnologies']" :key="tech" :src="generateBadgeUrl(tech)" :alt="tech" class="h-6 mr-2 mt-2 ">
</div>
    
    <!-- Yellow Line -->
    <div class="flex justify-center"><hr /></div>
  </div>
</div>
  

</div>

</template>



<script>
export default {
  data() {
    return {
 
 
      repositories: [
        {
          title: 'Dynamic Tables Creation with Dbt', 
          description: "\
            Created a full dynamic table creation with just Dbt.",
          tecnologies: ['googlecloud', 'dbt','jinja'],
          images:[''],
          image_description:[''],
          git:true,
          git_link: ' ',
          ongoing: false
        },
        {
          title: 'Mix Marketing Modeling for Optimal Budget Allocation', 
          description: "\
          Optimising marketing budget allocation across diverse channels (media, television, web, etc.)\
           by employing a Marketing Mix Model (Bayesian regression). \n \n\
           Enhanced data quality, implemented new features within the model, provided in-depth analysis, refactored code, \
          visualisations to Tableaux among other tasks.",
          tecnologies: ['amazon aws', 'postgresql','stan', 'snowflake', 'databricks', 'Python', 'Pandas', 'numpy', 'jupyter', 'Git'],
          ongoing: false
        },
        
        
        ]
      }



      
    },
    methods: {
        generateBadgeUrl(tech) {
           
          
            // Dynamically generate a badge URL using Shields.io
            const base = "https://img.shields.io/badge/";
            const label = tech.replace(/\s+/g, '_'); // Replace spaces with underscores
            const message = "";
            const color =   this.defaultColor;
            const style = "plastic";
            const logo =   tech.toLowerCase(); // Use the badge's logo if defined, otherwise a generic one
            const logoColor = "white";
            
            // return `${base}${label}-${message}-${color}?style=${style}&logo=${logo}&logoColor=${logoColor}`;
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