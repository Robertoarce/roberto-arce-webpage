const repositoriesData = [
  {
    title: 'Fully Dynamic Table Creation process with Dbt', 
    description: "\
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
  // {
  //   title: 'Benchmarking Bayesian Frameworks', 
  //   description: "\
  //     Evaluating the performance of various Bayesian frameworks including Stan, PyMC3, TensorFlow Probability, and Julia \
  //     in terms of execution time and memory consumption. <br> This assessment utilizes synthetic data applied to Bayesian regression models.\
  //     The models are estimated using Hamiltonian Monte Carlo (HMC) methods, specifically leveraging the No-U-Turn Sampler (NUTS) for efficiency improvements.\
  //     <br> The primary objective is to identify the most time-efficient framework under these specific conditions.\
  //     This is followed by an evaluation of aspects critical for production, including potential deployment issues, as well as the availability and quality of community and documentation support.",
  //   technologies: ['amazon aws', 'Pymc3','stan', 'TensorFlow',  'Python', 'Pandas', 'numpy', 'jupyter', 'Git'],
  //   ongoing: false,
  //   images:['img_1.jpg'],  
  //   in_startpage:false,
  //   notebook_url:'dd',
  // },
  

];

export default function fetchRepositoriesData() {
  return new Promise((resolve) => {
    // Simulate delay for dynamic loading
    setTimeout(() => {
      resolve(repositoriesData);
    }, 1000);
  });
}