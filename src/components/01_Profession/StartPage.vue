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
    <div class=" flex flex-col w-4/6 pr-8 h-full  overflow-scroll hide-scrollbar   ">
      <div class=" h-1/6    sticky top-0 z-10 bg-gray-700 border-b-2 border-yellow-300">  
        <h1 class=" m-5     text-center text-xs  sm:text-5xl text-white-900  font-sans font-light   ">
        Selected Projects   
      </h1>
        
        <h1 class=" m-5     text-center  text-xs md:text-3xl text-blue-400  font-extralight  ">
            Data Science | ML Engineering | Visualisations<br>
         
        </h1>
      </div>

      <div class="flex-row   h-5/6  text-xs  sm:text-base">
          <!-- Loop for projects -->
            <div v-for="(repos, index) in repositories" :key="index" 
          class="relative flex flex-col  p-5     md:justify-normal
          
          py-2">

                    <div class="flex justify-start p-2 pl-0 text-xl color-1">{{ repos['title'] }}</div>
                    <div class="">{{ repos['description'] }}</div>
                
                    <div class="p-3">{{ repos['tecnologies'] }}</div>
                    <div class="flex justify-center">
                      <hr /> 
                    </div>
          </div>
 
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
          title: 'Data Scientist', 
          description: "\
          Optimising marketing budget allocation across diverse channels (media, television, web, etc.)\
           by employing a Marketing Mix Model (Bayesian regression). \n \n\
           Enhanced data quality, implemented new features within the model, provided in-depth analysis, refactored code, \
          visualisations to Tableaux among other tasks.",
          tecnologies: ['Amazon Web Services', 'Bayesian Inference', 'Snowflake', 'Databricks', 'Python', 'Pandas', 'numpy', 'Jupyter', 'Git'],
          ongoing: false
        },
        {
          title: 'Data Scientist', 
          description: "\
          Optimising marketing budget allocation across diverse channels (media, television, web, etc.)\
           by employing a Marketing Mix Model (Bayesian regression). \n \n\
           Enhanced data quality, implemented new features within the model, provided in-depth analysis, refactored code, \
          visualisations to Tableaux among other tasks.",
          tecnologies: ['Amazon Web Services', 'Bayesian Inference', 'Snowflake', 'Databricks', 'Python', 'Pandas', 'numpy', 'Jupyter', 'Git'],
          ongoing: false
        },
        {
          title: 'Data Scientist', 
          description: "\
          Optimising marketing budget allocation across diverse channels (media, television, web, etc.)\
           by employing a Marketing Mix Model (Bayesian regression). \n \n\
           Enhanced data quality, implemented new features within the model, provided in-depth analysis, refactored code, \
          visualisations to Tableaux among other tasks.",
          tecnologies: ['Amazon Web Services', 'Bayesian Inference', 'Snowflake', 'Databricks', 'Python', 'Pandas', 'numpy', 'Jupyter', 'Git'],
          ongoing: false
        },
        {
          title: 'Data Scientist', 
          description: "\
          Optimising marketing budget allocation across diverse channels (media, television, web, etc.)\
           by employing a Marketing Mix Model (Bayesian regression). \n \n\
           Enhanced data quality, implemented new features within the model, provided in-depth analysis, refactored code, \
          visualisations to Tableaux among other tasks.",
          tecnologies: ['Amazon Web Services', 'Bayesian Inference', 'Snowflake', 'Databricks', 'Python', 'Pandas', 'numpy', 'Jupyter', 'Git'],
          ongoing: false
        },
        {
          title: 'Data Scientist', 
          description: "\
          Optimising marketing budget allocation across diverse channels (media, television, web, etc.)\
           by employing a Marketing Mix Model (Bayesian regression). \n \n\
           Enhanced data quality, implemented new features within the model, provided in-depth analysis, refactored code, \
          visualisations to Tableaux among other tasks.",
          tecnologies: ['Amazon Web Services', 'Bayesian Inference', 'Snowflake', 'Databricks', 'Python', 'Pandas', 'numpy', 'Jupyter', 'Git'],
          ongoing: false
        },
        {
          title: 'Data Scientist', 
          description: "\
          Optimising marketing budget allocation across diverse channels (media, television, web, etc.)\
           by employing a Marketing Mix Model (Bayesian regression). \n \n\
           Enhanced data quality, implemented new features within the model, provided in-depth analysis, refactored code, \
          visualisations to Tableaux among other tasks.",
          tecnologies: ['Amazon Web Services', 'Bayesian Inference', 'Snowflake', 'Databricks', 'Python', 'Pandas', 'numpy', 'Jupyter', 'Git'],
          ongoing: false
        },
        ]
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