// Roberto Arce - CV data (single source of truth).
// Consumed by the Timeline page (TimeLine.vue) and the Chatbot's RAG corpus (ragSystem.js).
export const works = [
        {
          title: 'Data Scientist',
          company: "Sanofi",
          date: ' Jan 2023 - Present',
          duration: 'On going',
          city: 'Paris',
          country: 'France',
          description: " \
          <b><i>LLM for email feedback</i></b><br>\
          <ul>\
          Developed project from inception to completion.<br>\
          Using past email campaigns data, snowflake cortex and LLM models to create a\
          full email improvement feedback loop.\
          <br>This project is now being extended to website content.\
          </ul><br>\
          <b><i>Bot Detection - Supervised classification model</i></b><br>\
          Worked on mitigating bot activity in email campaigns with the use of classification algorithms.\
          <ul>\
          <li>Refactored pipeline to leverage Polars vectorization, improving processing efficiency by 22x passing from O(n*m) to O(n + m log m).</li>\
          <li>Improved ML pipeline: Fully configurable, added: hyper parameter tuning, cross validation, scaling, added Weight and Biases, class imbalance strategies, added more models for model selection and added model benchmarking.</li>\
          <li>Improved model accuracy (increase in F1 score by +3%)</li>\
          </ul><br>\
          <b><i>Recommendation Engine - Medical Content</i></b><br>\
          Worked on improving the recommendation engine model and pipeline for different websites and email campaigns.<br><br>\
          <b><i>Marketing Mix Model - Budget Allocation</i></b><br>\
          <ul>\
          <li>Optimised 11% multi-million country marketing budget allocation across diverse brands and marketing channels (media, television, web….) through the use of a Marketing Mix Model, specifically applying Bayesian regression techniques.</li>\
          <li>Co-developed and enhanced the model.</li>\
          <li>Refactored code and Implemented new features and capabilities within the model (halo effect).</li>\
          <li>Integrated MLFlow into the pipeline.</li>\
          <li>Developed unit and quality tests for inputs.</li>\
          <li>Established connections between AWS S3 buckets, Databricks and Tableaux.</li>\
          </ul><br>\
          <b><i>Slack Chat Bot (LLM)</i></b><br>\
          Developed an LLM chatbot with AWS Bedrock model, Pine VectorDB and Slack.<br><br>",

          utils: ['AWS', 'Snowflake', 'STAN', 'Databricks', 'Python', 'Pandas', 'numpy', 'Jupyter', 'Git', 'MLFlow', 'Terraform', 'Sagemaker', 'S3', 'Postman', 'github Actions', 'Tableaux', 'AWS Glue', 'AWS Lambda', 'AWS S3', 'Spark', 'JIRA'],
          study: false
        },

       {
          title: 'Pioneer Hacker',
          company: " Station F - Pioneer Program",
          date: ' Nov 2025 - Jan 2026',
          duration: '3 months',
          city: 'Paris',
          country: 'France',
          description: "\
          Pioneer is a 3-month pre-seed startup program based in Station F, designed to help ambitious founders turn their bold ideas into reality. <br><br>\
          The program looks for founders that fall in the genius zone: bold, unconventional, and ambitious behavior combined with relevant tech or operator experience.",
          utils: ['Claude','Figma', 'git', 'n8n', 'Python','JavaScript','React Native','Node.js'],
          study: false,
          entrepreneurship: true
        },
        {
          title: 'Co-Founder',
          company: "Stealth Startup ",
          date: ' Jun 2022 - Dec 2022',
          duration: '7 months',
          city: 'Full Remote',
          country: 'World Wide',
          description: "\
          Our company's foremost goal is to streamline access to Amazon's publicly available data for our clients.\
           By implementing cutting-edge web scraping methodologies, developing resilient data pipelines, and \
           performing rigorous testing on information sourced from Amazon's platforms and third-party sellers,\
            we deliver indispensable insights to sellers, private equity firms, and talent scouts.\
          Our diverse, global team thrives in a completely remote work setting, guaranteeing efficient communication and productivity throughout all time zones.",
          utils: ['Web Scraping', 'Data Engineering', 'Jupyter', 'developer - JavaScript '],
          study: false
        },
        {
          title: 'Data Analyst/Scientist',
          company: "Branded",
          date: ' May 2021 - May 2022',
          duration: '1 Year ',
          city: 'Paris',
          country: 'France',
          description: "\
          Working as the main data contact for the Marketing pillar.\
          <ul>\
          <li>Design, ingest and monitor data pipes from each new seller API ensuring requirements are met.</li>\
          <li>Performed data modeling with DBT for the creation of a comprehensive data lake that serves as foundation for all data related matters on DTC.</li>\
          <li>Established and maintained evolving data requirements with business.</li>\
          <li>Co-established/challenged key performance metrics for operational efficiency.</li>\
          <li>Creation of automated data accuracy tests/analysis/reports/alerts.</li>\
          <li>Built, developed and maintained dashboards for DTC.</li>\
          <li>Created ad hoc analysis on historical data.</li>\
          </ul>",
          utils: ['SQL', 'Google Cloud Platform', 'Jupyter', 'DBT', 'Airflow', 'Gsheets', 'Tableaux', 'G-studio', 'Python', 'Fivetran', 'Gitlab', 'Click-Up', 'Trello', 'bash'],
          study: false
        },
        {
          title: 'Developer [Student]',
          company: " School 42",
          date: ' Jan 2020 - Aug 2020',
          duration: '8 months',
          city: 'Paris',
          country: 'France',
          description: "\
           42 is a private and nonprofit computer programming school.\
           It adopts a rigorous project-based, student-driven pedagogy without traditional teachers or courses, \
           emphasizing peer-to-peer learning and fostering a unique educational experience.",
          utils: ['C', 'git', 'bash'],
          study: true
        },
        {
          title: 'Data Analyst',
          company: "BlaBlaCar",
          date: ' Mar 2019 - Nov 2019',
          duration: '9 months',
          city: 'Paris',
          country: 'France',
          description: "\
          • Working as a full stack Data Analyst within the Financial, Strategy and Product team.\n \
          • Working with product managers (developing analysis framework), developers (requesting probes) and Data engineers  \
          (creating tracking contracts) to ensure that the data arrives on time and that the analysis is ready to perform, at the launch of new features.\n \
          <<Other Topics:>> Monetization, Product redesign, Search performance, Pricing strategy, Data merge with Ouibus.",
          utils: ['Tableaux', 'Google Cloud Platform', 'Jupyter', 'Python', 'SQL', 'Pandas'],
          study: false
        },
        {
          title: 'Data Analyst',
          company: "Deezer",
          date: ' Jan 2017 - Mar 2019',
          duration: '2 year 3 months',
          city: 'Paris',
          country: 'France',
          description: "\
          The Job can be summarized in 4:\n \
            <<1) Insight researcher:>>\n \ With the objective to gain deep knowledge of the customer-app interaction.\n \
              \n➢ Improved general knowledge of the customers journey and insights by providing in-depth research on App usage and Customer journey.\n \
            \n<<2)  Country Adviser:>>\n The objective is to measure and inform each country's actions performance, by providing feedback based on deep forensic insights, as well as proposing possible action plans.\n \
            \n➢ Worked with internal global teams and global partnerships (B2B): analyzing their performances on: offers usage, price rates and promotions; detection and correction of technical issues impacting\n \ our partnership customers base and thus the billing figure.\n \
            \n<<3) Data Developer and Controller:>>\n The objective is to create, update and sustain all databases and codes- scripts that support our current metrics.\n \
            \n➢ Supported, created and updated databases and code - scripts for the regular follow up of the KPIs' and tableau visualizations workbooks.\n \
            \n<<4)  Budget analyst/ follower:>>\n The objective is to co - create the budget with the aid of the historic knowledge and to challenge the assumptions in the financial model presented by the financial team.\n \
            \n➢ Provided relevant consolidated metrics for the planning and follow up of the marketing campaigns.\n \
            ➢ Weekly, monthly and after campaign performance follow up.\n \
            \n<<Cross team topics: → >> Churn, conversion, lifetime cycle, customer value (B2B and B2C) and Business Budget.",
          utils: ['Google Cloud Platform', 'Hadoop Hive', 'Git', 'Jupyter', 'Tableaux', 'Python', 'SQL', 'Pandas', 'scikit-learn', 'numpy', 'matplotlib', 'fb - prophet'],
          study: false
        },
        {
          title: 'Digital Business Analyst / Financial Controller',
          company: "L'Oréal",
          date: ' Jul 2016 - Dec 2016',
          duration: '6 months',
          city: 'Paris',
          country: 'France',
          description: "\
          <<Digital Project manager assistant>> at <<MaBeautéLuxe.fr>> \n \
          Start-up with +200 K€ of turnover, 10 Luxury Brands and +600 products.\n \
          • Followed site KPI and content analysis to optimize media and CRM strategy.\n \
          • Monitoring the products performance, sources of traffic and email campaigns.\n \
          <<Financial Controller:>>\n \
          • Budget and forecast consolidation inside L'Oréal Digital (21 brands worldwide) with SAP magnitude tool, SAP BO and Compass.\n \
          • Monitoring the gap analysis, margin rates and budgetary control.",
          utils: ['Automation', 'VBA - Excel', 'Python', 'SQL'],
          study: false
        },

        {
          title: 'MSc in Finance [Student]',
          company: 'Grenoble Ecole de Management - Grand Ecole',
          date: ' Sept 2015 - Dec 2016',
          duration: '1 yr 4 months',
          city: 'Grenoble',
          country: 'France',
          description: "\
          The Master of Science (MSc) in Finance provides advanced financial knowledge within the finance sector,\
           specifically in banking, financial services, or corporate finance with global companies.\n \
            The curriculum covers fundamental finance principles and delves into advanced topics in corporate finance,\
             financial management, and financial markets.\n \
              The program also seeks to instill strong technical and analytical \
              skills in students, enabling them to understand the strategic impacts of financial decisions. ",
          utils: ['Quantitative methods', 'Financial management', 'Market Finance', 'Corporate Finance'],
          study: true
        },
        {
          title: 'Freelance Consultant',
          company: 'Upwork.com',
          date: ' Sep 2014 - Sep 2015',
          duration: '1 yr 1 month',
          city: 'Remote',
          country: 'France',
          description: "\
              Working on different porjects, mainly on Excel VBA and Python.\n \
              • Performing under a competitive environment with global competition. \n \
              > Last Project: (Excel VBA /Python) Data Base consolidation of an Italian Start-up (AM Sport).",
          utils: ['Automation', 'VBA - Excel', 'Python', 'SQL'],
          study: false
        },
        {
          title: 'Supply Chain Analyst',
          company: 'Shopshopdeco.com',
          date: ' Jun 2014 - Sep 2014',
          duration: '4 months',
          city: 'Lyon',
          country: 'France',
          description: "\
              Start-up furniture ecommerce company of 12 people, based on france, operations in DE, DK,ES, FR & UK. \n \
              • Procurement\n \
              • Client service (FR/ES/EN) \n \
              • Provider contact, orders expediting and follow up \n \
              • Logistics: expedition, exchange, warehousing follow up \n \
              • Process improvement.",
          utils: ['Customer Service', 'Automation', 'Forecasting', 'Demand Planning'],
          study: false
        },
        {
          title: 'Supply Chain Project Manager',
          company: 'Groupe SEB',
          date: ' Dec 2013 - Apr 2014',
          duration: '5 months',
          city: 'Lyon',
          country: 'France',
          description: "\
              • Ensured integration and consistency of demand inputs within SAP/GPS systems \n \
              • Validated demand alignment with outlined plan in the Commercial Industrial Plan, following the Standard Operating Procedures (SOP). \n \
              • Enage production capacity with global suppliers over 5 months scope. \n \
              • Consolidated requests pertaining to New Products/End of Life Products, streamlining the product transition process. \n \
              • Follow the product lifecycle by country, in consultation with the Heads of Global Markets Business Unit.",
          utils: ['Forecasting', 'SAP', 'VBA - Excel', 'Demand Planning'],
          study: false
        },
        {
          title: 'Supply Chain Project Manager',
          company: 'Groupe SEB',
          date: ' Jun 2013 - Dec 2013',
          duration: '7 months',
          city: 'Lyon',
          country: 'France',
          description: "\
          << Mission 1 - Supply Chain KPI follow-up>>  \n \
          • Propose new and review current KPI within the Corporate Logistics, based on the IT tool that is \n \
          shared throughout the whole company. \n \
          << Mission 2 - Product offering >> \n \
          • Analyze the level of communality of portfolios between markets and address recommendations.\n \
          << Mission 3 - Item creation process>> \n \
            • Reduce time to market lead-time for new item creation.\n \
            • Diagnosing the current situation with other Departments in order to reduce it.",
          utils: ['Forecasting', 'VBA - Excel', 'Internal Consulting'],
          study: false
        },
        {
          title: 'MSc in Supply Chain [Student]',
          company: 'Politecnico di Milano',
          date: ' Sept 2012 - Dec 2013',
          duration: '1 yr 4 months',
          city: 'Milano',
          country: 'Italy',
          description: "\
          The program aims to train professionals who can blend various technical and managerial skills necessary for operations \
          in this domain. \n The education in Supply Chain and Purchasing Management at POLIMI is updated to align with the needs of both Italian and international multinationals,\
           fostering a strong partnership between the university and these corporations. \
           It seeks to equip students with a blend of technical and managerial skills, \
           thus preparing them for the evolving demands in the fields of supply chain and procurement management.",
          utils: ['Forecasting', 'Demand Planning', 'SCM Strategy'],
          study: true
        },
        {
          title: 'Production optimisation Analyst',
          company: 'MADEPA S.A. GRUPO LA PAPELERA',
          date: 'Sep 2010 - Jun 2011',
          duration: '10 months',
          city: 'Santa Cruz',
          country: 'Bolivia',
          description: "• Supported operations according to procedures and instructions\n \
                • Maintained all safety rules in accordance with the company rules and policies\n \
                • Maintained appropriate files for tracking batch and lot records\n \
                • Coordinated and expedited work in the establishment, supporting over 120 operators\n \
                • Assisted in day-to-day department operations\n \
                • Assisted in the creation of the production master schedule\n \
                • Gave orders to workers, established priorities according to work order specifications and availability\n \
                • Ensured that the production is cost-effective\n \
                 Co-Created and established product specifications, Bill of Materials (BOM) and Costs, procedures and standards\n \
                 Improved overall communication, reducing machine idling and timeouts.",
          utils: ['Performance Optimization', 'safety management', 'cost efficiency', 'Scheduling', 'demand planning'],
          study: false
        },
        {
          title: 'Sales Executive',
          company: 'Synergy',
          date: 'Feb 2009 - Jul 2009',
          duration: '6 months',
          city: 'Santa Cruz',
          country: 'Bolivia',
          description: "• Introduced a new product to the market \n \
                        • Cold calling customers \n \
                        • Conducts telephone inquiries.\n \
                        • Follows up on all projects with operations \n \
                        • Assist customers with the right product for their needs",
          utils: ['Cold calling', 'product customization'],
          study: false
        },
        {
          title: 'Attraction Operator / Crowd Controller',
          company: 'Walt Disney World',
          date: 'Aug 2007 - Jan 2008',
          duration: '6 months',
          city: 'Orlando Florida',
          country: 'USA',

          description: "• Worked in an international environment \n \
                        • Gave service to more than 35 000 guests on a weekly basis\n \
                        • Followed the Disney Basics while attending Disney University\n \
                        > Coordinated task in a multicultural team to meet Disney standards",
          utils: ['Customer Service', 'Roller Coaster Engineering'],
          study: false
        },
        {
          title: 'Bachelor Industrial Optimisation [Student]',
          company: 'UPSA',
          date: 'Aug 2005 - Jan 2010',
          duration: '5 years',
          city: 'Santa Cruz',
          country: 'Bolivia',

          description: "The bachelor program emphasizes on \
          developing professionals capable of optimizing and improving production processes with a focus\
           on quality, safety, and environmental respect. \n \nThe main courses span basic sciences, mechanics, \
           manufacturing, industrial management, industrial processes, and systems analysis and optimization. \
           Some specific courses include Calculus, Technical Drawing, Statistics, Thermodynamics, and courses on \
           Production and Operations Management among others. \n \n Additionally, elective courses are offered in areas\
            like Business Management, Automation and Robotics, Systems Engineering, and Petroleum and Gas Engineering, \
            providing a broader perspective and specialization options",
          utils: ['Operations Research', 'Applied Mechanics', 'Advanced Algorithms in C++'],
          study: true
        },];

export default works;
