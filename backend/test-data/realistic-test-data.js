// test-data/realistic-test-data.js

const jobRoles = [
  {
    jobRoleId: "frontend_dev",
    version: 1,
    title: "Frontend Developer",
    minYearsOfExperience: 2,
    maxYearsOfExperience: 5,
    requiredSkills: [
      { name: "react", weight: 3 },
      { name: "javascript", weight: 3 },
      { name: "typescript", weight: 2 },
      { name: "css", weight: 2 },
      { name: "html", weight: 1 },
      { name: "git", weight: 1 }
    ]
  },
  {
    jobRoleId: "backend_dev",
    version: 1,
    title: "Backend Developer",
    minYearsOfExperience: 3,
    maxYearsOfExperience: 7,
    requiredSkills: [
      { name: "node.js", weight: 3 },
      { name: "postgresql", weight: 3 },
      { name: "python", weight: 2 },
      { name: "rest api", weight: 2 },
      { name: "mongodb", weight: 2 },
      { name: "docker", weight: 1 }
    ]
  },
  {
    jobRoleId: "devops_engineer",
    version: 1,
    title: "DevOps Engineer",
    minYearsOfExperience: 3,
    maxYearsOfExperience: 8,
    requiredSkills: [
      { name: "docker", weight: 3 },
      { name: "kubernetes", weight: 3 },
      { name: "aws", weight: 3 },
      { name: "terraform", weight: 2 },
      { name: "jenkins", weight: 2 },
      { name: "linux", weight: 2 }
    ]
  },
  {
    jobRoleId: "data_scientist",
    version: 1,
    title: "Data Scientist",
    minYearsOfExperience: 2,
    maxYearsOfExperience: 6,
    requiredSkills: [
      { name: "python", weight: 3 },
      { name: "machine learning", weight: 3 },
      { name: "sql", weight: 2 },
      { name: "pandas", weight: 2 },
      { name: "tensorflow", weight: 2 },
      { name: "statistics", weight: 2 }
    ]
  },
  {
    jobRoleId: "mobile_dev",
    version: 1,
    title: "Mobile Developer",
    minYearsOfExperience: 2,
    maxYearsOfExperience: 5,
    requiredSkills: [
      { name: "react native", weight: 3 },
      { name: "javascript", weight: 2 },
      { name: "swift", weight: 2 },
      { name: "kotlin", weight: 2 },
      { name: "ios", weight: 2 },
      { name: "android", weight: 2 }
    ]
  }
];

const resumeSnapshots = [
  // Frontend Developers (5 resumes)
  {
    resumeSnapshotId: "frontend_senior_001",
    name: "Sarah Chen",
    skills: ["React", "TypeScript", "JavaScript", "CSS", "HTML", "Redux", "Git", "Webpack"],
    yearsOfExperience: 5,
    experience: "Senior Frontend Developer at TechCorp. Built scalable React applications serving 1M+ users. Led migration from JavaScript to TypeScript. Implemented CI/CD pipelines."
  },
  {
    resumeSnapshotId: "frontend_mid_001",
    name: "Alex Kumar",
    skills: ["React", "JavaScript", "CSS", "HTML", "Git", "REST APIs"],
    yearsOfExperience: 3,
    experience: "Frontend Developer at StartupXYZ. Developed responsive web applications using React. Collaborated with backend team to integrate RESTful APIs."
  },
  {
    resumeSnapshotId: "frontend_junior_001",
    name: "Emily Rodriguez",
    skills: ["React", "JavaScript", "HTML", "CSS", "Bootstrap"],
    yearsOfExperience: 1,
    experience: "Junior Frontend Developer. Created user interfaces with React. Worked on landing pages and component libraries."
  },
  {
    resumeSnapshotId: "frontend_fullstack_001",
    name: "Michael Zhang",
    skills: ["React", "TypeScript", "Node.js", "JavaScript", "CSS", "PostgreSQL", "Git"],
    yearsOfExperience: 4,
    experience: "Full-stack Developer with strong frontend focus. Built end-to-end features using React and Node.js. Managed PostgreSQL databases."
  },
  {
    resumeSnapshotId: "frontend_specialist_001",
    name: "Lisa Patel",
    skills: ["React", "JavaScript", "TypeScript", "CSS", "HTML", "Next.js", "GraphQL"],
    yearsOfExperience: 6,
    experience: "Frontend Specialist at FinTech company. Expert in React ecosystem including Next.js and GraphQL. Performance optimization specialist."
  },

  // Backend Developers (5 resumes)
  {
    resumeSnapshotId: "backend_senior_001",
    name: "David Johnson",
    skills: ["Node.js", "Python", "PostgreSQL", "MongoDB", "REST API", "Docker", "Redis"],
    yearsOfExperience: 6,
    experience: "Senior Backend Engineer. Designed microservices architecture handling 10K req/s. Expert in Node.js and Python. Implemented caching strategies with Redis."
  },
  {
    resumeSnapshotId: "backend_mid_001",
    name: "Priya Sharma",
    skills: ["Python", "PostgreSQL", "REST API", "Django", "Git"],
    yearsOfExperience: 3,
    experience: "Backend Developer at E-commerce platform. Built REST APIs with Django. Optimized database queries for better performance."
  },
  {
    resumeSnapshotId: "backend_junior_001",
    name: "James Wilson",
    skills: ["Node.js", "PostgreSQL", "REST API", "Express.js"],
    yearsOfExperience: 1,
    experience: "Junior Backend Developer. Developed REST APIs using Node.js and Express. Worked with PostgreSQL databases."
  },
  {
    resumeSnapshotId: "backend_architect_001",
    name: "Ananya Gupta",
    skills: ["Node.js", "Python", "PostgreSQL", "MongoDB", "Kafka", "Docker", "Kubernetes", "REST API"],
    yearsOfExperience: 8,
    experience: "Backend Architect. Designed distributed systems with Kafka. Led team of 10 engineers. Expert in scalable architecture patterns."
  },
  {
    resumeSnapshotId: "backend_specialist_001",
    name: "Tom Anderson",
    skills: ["Node.js", "PostgreSQL", "REST API", "GraphQL", "Docker", "TypeScript"],
    yearsOfExperience: 4,
    experience: "Backend Specialist. Built high-performance APIs with Node.js. Migrated REST to GraphQL. Containerized applications with Docker."
  },

  // DevOps Engineers (5 resumes)
  {
    resumeSnapshotId: "devops_senior_001",
    name: "Rachel Green",
    skills: ["AWS", "Docker", "Kubernetes", "Terraform", "Jenkins", "Linux", "Python"],
    yearsOfExperience: 7,
    experience: "Senior DevOps Engineer. Managed AWS infrastructure for 100+ microservices. Implemented GitOps with ArgoCD. Reduced deployment time by 80%."
  },
  {
    resumeSnapshotId: "devops_mid_001",
    name: "Carlos Martinez",
    skills: ["Docker", "Kubernetes", "AWS", "Jenkins", "Linux", "Bash"],
    yearsOfExperience: 4,
    experience: "DevOps Engineer. Set up CI/CD pipelines with Jenkins. Deployed applications to Kubernetes clusters. Automated infrastructure with scripts."
  },
  {
    resumeSnapshotId: "devops_junior_001",
    name: "Nina Patel",
    skills: ["Docker", "AWS", "Linux", "Git", "Jenkins"],
    yearsOfExperience: 2,
    experience: "Junior DevOps Engineer. Containerized applications with Docker. Deployed to AWS EC2. Maintained CI/CD pipelines."
  },
  {
    resumeSnapshotId: "devops_sre_001",
    name: "Kevin Lee",
    skills: ["Kubernetes", "AWS", "Docker", "Terraform", "Prometheus", "Grafana", "Linux"],
    yearsOfExperience: 6,
    experience: "Site Reliability Engineer. Managed production Kubernetes clusters. Implemented monitoring with Prometheus/Grafana. On-call rotation for critical systems."
  },
  {
    resumeSnapshotId: "devops_cloud_001",
    name: "Sophia Wang",
    skills: ["AWS", "Terraform", "Docker", "Kubernetes", "Python", "CloudFormation"],
    yearsOfExperience: 5,
    experience: "Cloud Engineer. Infrastructure as Code expert with Terraform. Managed multi-region AWS deployments. Cost optimization specialist."
  },

  // Data Scientists (5 resumes)
  {
    resumeSnapshotId: "datascience_senior_001",
    name: "Dr. Robert Kim",
    skills: ["Python", "Machine Learning", "TensorFlow", "SQL", "Pandas", "Statistics", "Deep Learning"],
    yearsOfExperience: 6,
    experience: "Senior Data Scientist. Built recommendation systems using deep learning. Published 3 papers on ML. Expert in TensorFlow and PyTorch."
  },
  {
    resumeSnapshotId: "datascience_mid_001",
    name: "Maya Singh",
    skills: ["Python", "Machine Learning", "SQL", "Pandas", "Scikit-learn", "Statistics"],
    yearsOfExperience: 3,
    experience: "Data Scientist at HealthTech startup. Developed predictive models for patient outcomes. Worked with large datasets using Pandas and SQL."
  },
  {
    resumeSnapshotId: "datascience_junior_001",
    name: "Chris Brown",
    skills: ["Python", "Pandas", "SQL", "Statistics", "Jupyter"],
    yearsOfExperience: 1,
    experience: "Junior Data Scientist. Performed data analysis and visualization. Built basic ML models. Worked with SQL databases."
  },
  {
    resumeSnapshotId: "datascience_ml_001",
    name: "Fatima Hassan",
    skills: ["Python", "Machine Learning", "TensorFlow", "Pandas", "SQL", "NLP", "Deep Learning"],
    yearsOfExperience: 5,
    experience: "ML Engineer. Specialized in NLP and computer vision. Deployed ML models to production. Optimized inference pipelines."
  },
  {
    resumeSnapshotId: "datascience_analyst_001",
    name: "Daniel Park",
    skills: ["Python", "SQL", "Pandas", "Statistics", "Tableau", "Excel"],
    yearsOfExperience: 2,
    experience: "Data Analyst transitioning to Data Science. Strong SQL and statistical analysis skills. Created dashboards with Tableau."
  },

  // Mobile Developers (5 resumes)
  {
    resumeSnapshotId: "mobile_senior_001",
    name: "Jennifer Liu",
    skills: ["React Native", "JavaScript", "TypeScript", "iOS", "Android", "Swift", "Kotlin"],
    yearsOfExperience: 5,
    experience: "Senior Mobile Developer. Built cross-platform apps with React Native. Also native iOS (Swift) and Android (Kotlin) experience. Published 10+ apps."
  },
  {
    resumeSnapshotId: "mobile_mid_001",
    name: "Ahmed Ali",
    skills: ["React Native", "JavaScript", "iOS", "Android", "Redux"],
    yearsOfExperience: 3,
    experience: "Mobile Developer. Developed React Native applications for startup. Integrated native modules. Managed app store deployments."
  },
  {
    resumeSnapshotId: "mobile_junior_001",
    name: "Emma Thompson",
    skills: ["React Native", "JavaScript", "Git"],
    yearsOfExperience: 1,
    experience: "Junior Mobile Developer. Built UI components in React Native. Fixed bugs and implemented features from designs."
  },
  {
    resumeSnapshotId: "mobile_ios_001",
    name: "Ryan Cooper",
    skills: ["Swift", "iOS", "Objective-C", "Xcode", "Git"],
    yearsOfExperience: 4,
    experience: "iOS Developer. Native Swift development. Built apps for 1M+ users. Expert in iOS SDK and UIKit."
  },
  {
    resumeSnapshotId: "mobile_android_001",
    name: "Zara Khan",
    skills: ["Kotlin", "Android", "Java", "Android Studio", "Git"],
    yearsOfExperience: 4,
    experience: "Android Developer. Native Android with Kotlin. Implemented Material Design. Optimized app performance and battery usage."
  }
];

module.exports = { jobRoles, resumeSnapshots };