// Knowledge Base for the personal website chatbot
// This contains structured information about Roberto's background, skills, and projects

export const knowledgeBase = {
  personalInfo: {
    name: "Roberto Arce",
    title: "Data Scientist & Machine Learning Engineer",
    location: "Based in France",
    background: "Experienced data scientist with expertise in machine learning, statistical analysis, and data visualization. Passionate about turning data into actionable insights and building intelligent systems."
  },

  education: [
    {
      degree: "MSc in Finance Engineering",
      institution: "Politecnico di Milano",
      year: "2020-2022",
      description: "Advanced studies in quantitative finance, risk management, and financial modeling"
    },
    {
      degree: "Bachelor's Degree",
      institution: "Universidad Privada de Santa Cruz de la Sierra (UPSA)",
      year: "2016-2020",
      description: "Foundation in computer science and data analysis"
    }
  ],

  certifications: [
    {
      name: "Disney Data Science Certification",
      issuer: "Disney",
      description: "Specialized training in data science methodologies and applications in entertainment industry"
    },
    {
      name: "Machine Learning Certification",
      issuer: "Instituto de Machine Learning",
      description: "Comprehensive machine learning techniques and applications"
    },
    {
      name: "Docker Certification",
      description: "Containerization and deployment strategies for data science applications"
    }
  ],

  skills: {
    programming: ["Python", "R", "JavaScript", "Vue.js", "SQL"],
    mlFrameworks: ["scikit-learn", "TensorFlow", "PyTorch", "Pandas", "NumPy"],
    dataVisualization: ["Plotly", "Matplotlib", "Seaborn", "D3.js", "P5.js"],
    tools: ["Docker", "Git", "Jupyter", "Tableau", "Power BI"],
    databases: ["PostgreSQL", "MongoDB", "Redis"],
    cloud: ["AWS", "Google Cloud Platform", "Azure"]
  },

  projects: [
    {
      name: "LeBonCoin Data Analysis",
      description: "Comprehensive analysis of real estate market data from LeBonCoin platform",
      technologies: ["Python", "Pandas", "Plotly", "Statistical Analysis"],
      highlights: [
        "Analyzed thousands of property listings",
        "Identified market trends and pricing patterns",
        "Created interactive visualizations",
        "Developed predictive models for property valuation"
      ]
    },
    {
      name: "Machine Learning Pipeline",
      description: "End-to-end ML pipeline for automated model training and deployment",
      technologies: ["Python", "Docker", "scikit-learn", "MLflow"],
      highlights: [
        "Automated data preprocessing",
        "Model selection and hyperparameter tuning",
        "Containerized deployment with Docker",
        "Performance monitoring and logging"
      ]
    },
    {
      name: "Interactive Data Visualizations",
      description: "Dynamic and interactive charts for data exploration and presentation",
      technologies: ["JavaScript", "Plotly.js", "D3.js", "Vue.js"],
      highlights: [
        "Real-time data updates",
        "Interactive filtering and zooming",
        "Responsive design for all devices",
        "Custom animation effects"
      ]
    },
    {
      name: "Linear Regression Analysis Tool",
      description: "Interactive tool for performing and visualizing linear regression analysis",
      technologies: ["JavaScript", "ML.js", "Plotly.js", "Vue.js"],
      highlights: [
        "Real-time model fitting",
        "Interactive parameter adjustment",
        "Statistical significance testing",
        "Visual model validation"
      ]
    }
  ],

  experience: [
    {
      company: "Data Science Consultant",
      role: "Freelance Data Scientist",
      period: "2022-Present",
      description: "Providing data science consulting services to various clients, focusing on machine learning solutions and data analysis"
    },
    {
      company: "Financial Services",
      role: "Quantitative Analyst",
      period: "2020-2022",
      description: "Developed quantitative models for risk assessment and financial forecasting"
    }
  ],

  interests: [
    "Machine Learning and AI",
    "Data Visualization",
    "Financial Modeling",
    "Web Development",
    "Creative Coding",
    "Interactive Art",
    "Statistical Analysis"
  ],

  contact: {
    email: "Available upon request",
    linkedin: "Professional networking",
    github: "Code repositories and projects"
  }
};

// Helper function to search through knowledge base
export function searchKnowledgeBase(query, maxResults = 3) {
  const results = [];
  const queryLower = query.toLowerCase();
  
  // Search through all sections
  const sections = [
    { name: 'personalInfo', data: knowledgeBase.personalInfo },
    { name: 'education', data: knowledgeBase.education },
    { name: 'certifications', data: knowledgeBase.certifications },
    { name: 'skills', data: knowledgeBase.skills },
    { name: 'projects', data: knowledgeBase.projects },
    { name: 'experience', data: knowledgeBase.experience },
    { name: 'interests', data: knowledgeBase.interests }
  ];

  sections.forEach(section => {
    const sectionData = section.data;
    
    if (Array.isArray(sectionData)) {
      sectionData.forEach((item, index) => {
        const itemText = JSON.stringify(item).toLowerCase();
        if (itemText.includes(queryLower)) {
          results.push({
            section: section.name,
            data: item,
            relevance: calculateRelevance(queryLower, itemText)
          });
        }
      });
    } else if (typeof sectionData === 'object') {
      Object.entries(sectionData).forEach(([key, value]) => {
        const valueText = Array.isArray(value) ? value.join(' ') : String(value);
        if (valueText.toLowerCase().includes(queryLower)) {
          results.push({
            section: section.name,
            key: key,
            data: value,
            relevance: calculateRelevance(queryLower, valueText.toLowerCase())
          });
        }
      });
    }
  });

  // Sort by relevance and return top results
  return results
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, maxResults);
}

function calculateRelevance(query, text) {
  const queryWords = query.split(' ').filter(word => word.length > 2);
  let score = 0;
  
  queryWords.forEach(word => {
    const regex = new RegExp(word, 'gi');
    const matches = text.match(regex);
    if (matches) {
      score += matches.length;
    }
  });
  
  return score;
}

// Generate context for the LLM
export function generateContext(query) {
  const searchResults = searchKnowledgeBase(query, 3); // Reduced to 3 most relevant results
  let context = "You are Roberto Arce's personal assistant. Here's the ONLY information you can use to answer questions:\n\n";
  
  if (searchResults.length === 0) {
    context += "No specific information found for this query. You should say you don't have that information.\n";
  } else {
    searchResults.forEach((result, index) => {
      context += `${index + 1}. `;
      
      if (result.section === 'personalInfo') {
        context += `Personal Info: ${JSON.stringify(result.data)}\n`;
      } else if (result.section === 'projects') {
        context += `Project: ${result.data.name} - ${result.data.description}\n`;
      } else if (result.section === 'skills') {
        context += `Skills (${result.key}): ${Array.isArray(result.data) ? result.data.join(', ') : result.data}\n`;
      } else if (result.section === 'education') {
        context += `Education: ${result.data.degree} from ${result.data.institution} (${result.data.year})\n`;
      } else if (result.section === 'certifications') {
        context += `Certification: ${result.data.name} - ${result.data.description}\n`;
      } else if (result.section === 'experience') {
        context += `Experience: ${result.data.role} at ${result.data.company} (${result.data.period})\n`;
      } else {
        context += `${result.section}: ${JSON.stringify(result.data)}\n`;
      }
    });
  }
  
  context += "\nRULES:\n";
  context += "- ONLY use the information provided above\n";
  context += "- Do NOT make up or assume any information\n";
  context += "- If you don't know something, say 'I don't have that information in my knowledge base'\n";
  context += "- Keep responses concise and factual\n";
  context += "- If asked about topics not related to Roberto, redirect to his background, skills, or projects\n";
  
  return context;
}
