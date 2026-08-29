const repositoriesData = [
  {
    title: 'On-device CV Chatbot — Fine-tune & Quantize Pipeline',
    description: "\
    <b>Making a small LLM answer only about my CV — entirely in the browser.</b><br><br>\
    End-to-end pipeline that LoRA-fine-tunes Llama-3.2-3B/1B on a synthetic CV dataset on an RTX 5080,\
    then quantizes them to q4f16_1 with MLC for WebLLM. The CV knowledge lives <b>in the weights</b>: grounded answers for every role, and off-topic questions get a trained refusal.<br><br>\
    <b>What's inside:</b><br>\
    • Completion-only LoRA training (loss on the assistant turn only)<br>\
    • MLC q4f16_1 quantization (source-built TVM — no wasm compile needed)<br>\
    • ~250 grounded Q&A + refusal pairs generated from the CV<br>\
    • WebLLM/WebGPU runtime, zero backend, zero API keys<br>\
    • Archify dataflow diagram of the full pipeline<br><br>\
    <b>Live at:</b> the /chatbot page of this portfolio.",
    technologies: ['Python', 'PyTorch', 'LoRA', 'Transformers', 'MLC-LLM', 'TVM', 'WebLLM', 'WebGPU', 'Vue.js'],
    images: ['finetune-pipeline.png'],
    git_link: 'https://github.com/Robertoarce/roberto-cv-finetune',
    ongoing: false,
    in_startpage: true,
    notebook_url: ''
  },
  {
    title: 'Wakatto: AI Characters That Think Differently',
    description: "\
    <b>Your Thoughts Deserve More Than a Blank Page</b><br><br>\
     <b> Wakatto:</b> Need to reflect? Brainstorm? Decide? Vent? Prepare for something?<br><br>\
    I built Wakatto because I wanted AI conversations with actual variety. The app<br>\
    features animated 3D characters—psychologists, philosophers, a pirate, a sarcastic<br>\
    tutorial guy—each with their own way of thinking. Pick who fits your mood, or<br>\
    create your own character from 50 temperament types.<br><br>\
      <b>What makes this special:</b><br>\
      • Multi-AI backend (Claude, GPT, Gemini) with streaming responses<br>\
      • Cross-platform: Web, iOS, Android via Expo<br>\
      • Three.js characters with 7 procedural animation states<br>\
      • Edge Functions proxy eliminating CORS and securing API keys<br>\
      • Streaming AI responses from Claude, GPT, or Gemini<br>\
      • Custom character system with 50 temperament combinations<br>\
      • Single codebase deploying to Web, iOS, and Android<br>\
      • Animated 3D avatars that react to conversations<br>\
      • Conversation history saved to your personal library<br>\
      • Privacy-first: conversations stored in your Supabase account<br>\
      • Voice profile configuration for text-to-speech (in progress) <br>\
      • Full control over AI behavior via system prompts<br>\
      • Your conversations stay private in your account<br>\
      • Multi-character conversation orchestration<br>\
      • Secure AI backend via Supabase Edge Functions<br>\
      • 80+ pre-built characters with unique system prompts<br><br>\
    <b>The goal:</b><br>\ Sometimes you want to talk to a pirate about life, or hear Nietzsche roast your comfort zone, or have Bob negotiate a fake app price. <br>This app needs no purpose other than the one given.<br>\
    <b>Live at:</b> <a href='https://www.wakatto.com'>wakatto.com</a><br><br>",
    technologies: ['React Native', 'Expo', 'TypeScript', 'Three.js', '@react-three/fiber', 'Redux', 'Supabase', 'PostgreSQL', 'Edge Functions', 'Anthropic Claude API', 'OpenAI API', 'Webpack'],
    images: ['wakatto.png'],
    git_link: 'https://github.com/Robertoarce/wakatto',
    ongoing: true,
    in_startpage: true,
    notebook_url: ''
  },
  {
    title: 'Configurable ML Pipeline: From Configuration to Production-Ready Models', 
    description: "\
    <b>A Complete ML Workflow That Adapts to Any Use Case Through Configuration Alone</b><br><br>\
    Tired of rebuilding machine learning pipelines from scratch for every project? <br><br>\
    I created a comprehensive ML system that handles everything from data preprocessing to model deployment through simple YAML configuration files. No more copy-pasting code between projects or maintaining multiple pipeline versions.<br><br>\
    <b>What makes this special:</b><br>\
    • Switch between datasets, target variables, and models without touching code<br>\
    • Built-in support for 6 ML algorithms with automatic hyperparameter tuning<br>\
    • Complete preprocessing pipeline handling scaling, encoding, and class imbalance<br>\
    • Integrated W&B experiment tracking and model persistence<br>\
    • Synthetic data generation for testing and prototyping<br>\
    • Production-ready with comprehensive evaluation and validation<br><br>\
    Perfect for teams working on multiple ML projects who want consistency, reproducibility, and faster iteration cycles.<br><br>",
    technologies: ['Python', 'Scikit-learn', 'XGBoost', 'LightGBM', 'Pandas', 'NumPy', 'YAML', 'Weights & Biases', 'SMOTE', 'Imbalanced-learn'],
    images: ['ml_pipeline.png'], 
    git_link: 'https://github.com/Robertoarce/ML_Pipeline', 
    ongoing: false,
    in_startpage: true,
    notebook_url: ''
  },
  {
    title: 'Benchmark: Testing different Pipeline Performance for Feature creation', 
    description: "\
    <b>Why I Benchmarked 6 Different Pipeline Approaches (And You Should Too)</b><br><br>\
    Ever wondered if your data pipeline is actually fast, or just <i>feels</i> fast? 🤔 <br><br>\
    I dove deep into this question by testing 6 different implementations for a real-world problem: calculating time-series web events that occur within 5 minutes of email marketing campaigns. <br><br>\
    <b>The results were eye-opening:</b><br>\
    • Traditional Pandas approaches? Painfully slow ⏱️<br>\
    • Modern columnar processing with Polars? Game changer 🚀<br>\
    • Streaming implementations? We're talking 10-100x performance gains!<br><br>\
    This is all about unlocking the true potential of your ML feature engineering pipelines.<br><br>",
    technologies: ['Python', 'Polars', 'Pandas', 'Apache Arrow', 'Parquet', 'Concurrent Futures'],
    images: ['benchmark.png'], 
    git_link: 'https://github.com/Robertoarce/Pipeline-Benchmark', 
    ongoing: false,
    in_startpage: true,
    notebook_url: '',
  },
  {
    title: 'LLM Scrapper using Browser_use',
    description: "\
    <b>TLDR:</b> An intelligent web scraper that uses LLM-powered browser automation to extract real estate listings from LebonCoin.fr. The script uses Google's Gemini AI as main LLM but any other can be used for scrapping, parsing and extracting structured data from real estate listings. <br> <br> \
    The scraper automatically extracts property prices, surface areas in m², and Paris districts (arrondissements 1-20) from web pages, converting them to clean numeric formats. It provides robust error handling, data validation, and outputs results in both CSV and JSON formats. <br> <br> \
    This project demonstrates the power of combining Large Language Models with browser automation for intelligent data extraction, making web scraping more accurate and adaptable than traditional methods.\
    ",
    technologies: ['Python', 'Browser-use', 'Google Gemini', 'Playwright', 'AsyncIO', 'JSON', 'CSV'],
    images: ['leboncoin.png', 'leboncoin2.png'],
    git_link: 'https://github.com/Robertoarce/Scrapper---LLM-based-with-browser_use/',
    ongoing: false,
    in_startpage: true,
    notebook_url: null, // No notebook found in this project
  },
  {
    title: 'Churn model for bevarage distributor.', 
    description: "\
    <b>TLDR:</b> The data consists of time-series records for a beverage distributor. The model successfully identifies revenue patterns, churn risk, and segment trends. <br> <br> \
    Personalized recommendations for sales reps are proposed, using machine learning modeling to align with individual strengths and improve sales effectiveness.\
    The analysis is geared toward driving actionable insights. <br>  <br> ",
    technologies: ['jupyter','XGBoost', 'Pandas','numpy','ScikitLearn'],
    images:['ds_1.jpg'],  
    git_link: 'https://github.com/Robertoarce/Data-Science-Challenge-1/',
    ongoing: false,
    in_startpage: true,
    notebook_url:'https://nbviewer.org/github/Robertoarce/Data-Science-Challenge-1/blob/master/report.ipynb',
  },
  {
    title: 'Fully Dynamic Table Creation process with Dbt', 
    description: "\
    <b>TLDR:</b>  It reads database structure in compilation time, and adjusts the SQL querie to the structure, avoiding missing datasets/tables/values errors. <br><br> \
      This approach addresses errors arising from missing tables, misnaming sources,\
      or neglecting to add new tables, all while dynamically aggregating tables during the repository building process.<br><br>\
      This DBT script showcases an advanced use case of dynamically building SQL queries based on the availability of certain datasets and columns.\
      By using Jinja templating within DBT, the script handles variability in\
      data availability across different Datasets, ensuring that the final\
      dataset is as complete and error-free as possible.  This approach is particularly useful in scenarios where data\
      schema may vary significantly across different entities within the same data warehouse environment.",
    technologies: ['googlecloud', 'dbt','jinja'],
    images:['shopify.jpg'],  
    git_link: 'https://github.com/Robertoarce/dbt-dynamic-sourcing/',
    ongoing: false,
    in_startpage: true,
    notebook_url:'',
  },
  {
    title: 'Fast-Learning Challenge: Learn Docker in 5 days.', 
    description: "\
    <b>TLDR:</b>  I had to learn and apply Docker for a technical test in less than 5 days. <br><br> \
      Your mission is to provide insights on sales.\
      The challenge consists in creating a docker image so that the users will be able to quick use.<br>\
      <br><h1> <b>Guidelines: </b></h3>\
      There are four datasets :<br>\
      <ul> \
        <b>* Products:</b> a list of available products.<br>\
        <b>* Items:</b> a list of items.<br>\
        <b>* Orders:</b> a list of customer orders on the website.<br>\
        <b>* Customers:</b> a list of customers.<br>\
        </ul><br>\
        <h2><b>TO DO:</b></h2>\
        <ul> \
        <li> - Create and insert data in PostgreSQL.</li> \
        <li> - Each day we want to compute summary statistics by customers (spending, orders etc.)</li> \
        <li> - Create a script to compute for a given day these summary statistics.</li>\
        <li> - Query directly the dbt</li> \
        <li> - Have premaid queries</li> \
        <li> - Run that script over the necessary period to inject historic data. </li>\
        <li> - Then, identify the top customers</li>\
        <li> - How many customers are repeaters ?</li>\
        <li> - Package your script in Docker container so that it can be run each day. </li>\
        </ul>\
        <br>A docker-compose.yml and a CLI is expected to get stats for a specific day.\
            ",
    technologies: ['docker', 'postgresql', 'pandas'],
    images:['docker.png'],  
    git_link: 'https://github.com/Robertoarce/free2move-Test-technique',
    ongoing: false,
    in_startpage: true, 
  },
  {
    title: 'EDA of Sales Funnel Data', 
    description: "\
    <b>TLDR:</b>  A generic EDA on Sales funnel data, it goes through several points on data from missing data to drop on values. <br><br> \
    The EDA involves analyzing: <br>\
    - Sales funnel data <br>\
    - Paid marketing channel performance <br><br>\
    Actionable insights and recommendations for marketing strategy optimization are provided in the report.pdf.",
    technologies: ['matplotlib', 'git','pandas', 'python'],
    images:['eda_sales.png'],  
    git_link: 'https://github.com/Robertoarce/EDA---Growth-Analytics-Challenge/',
    ongoing: false,
    in_startpage: true,
    notebook_url:'https://nbviewer.org/github/Robertoarce/EDA---Growth-Analytics-Challenge/tree/main/notebooks/',
  }, 
  {
    title: 'Density Estimation', 
    description: "\
    <b>TLDR:</b>  This repository contains Python code demonstrating various techniques for density estimation. \
    Density estimation is a technique employed to estimate the probability density function (PDF) of a random variable based on observed data.\
     Essentially, it involves constructing a function that represents the underlying distribution of the data.<br><br>\
    The repository allows you to play and combine 2 different distributions and see the results separately.<br>\
    The repository also shows how 3 different distributions would look after being combined <br>\
    to finally be estimated by several techniques demonstrated..",
    
    technologies: ['matplotlib', 'git','ScikitLearn', 'python'],
    images:['KernelDensity.png'],  
    git_link: 'https://github.com/Robertoarce/Density-Estimation/',
    ongoing: false,
    in_startpage: true,
    notebook_url:'https://nbviewer.org/github/Robertoarce/Density-Estimation/blob/main/main.ipynb',
  }, 

];

export default function fetchRepositoriesData() {
  return new Promise((resolve) => {
    // Simulate delay for dynamic loading
    setTimeout(() => {
      resolve(repositoriesData);
    }, 1000);
  });
} 
