export type Branch = 
  | 'CSE / IT'
  | 'ECE'
  | 'EEE'
  | 'Mechanical'
  | 'Civil'
  | 'All Engineering Branches';

export type JobType = 'Full-time' | '6-Month Internship' | 'Summer Internship' | 'Internship + PPO';

export type DriveType = 'On-Campus Placement' | 'Off-Campus Hiring' | 'Pooled Campus Drive' | 'National Qualifier / NQT';

export type ApplicationStage = 
  | 'Bookmarked'
  | 'Applied'
  | 'OA Scheduled'
  | 'Technical Round 1'
  | 'Technical Round 2'
  | 'HR Round'
  | 'Offer Received'
  | 'Rejected';

export interface JobPosting {
  id: string;
  title: string;
  company: string;
  companyLogoText: string;
  companyColor: string;
  jobType: JobType;
  driveType: DriveType;
  eligibleBranches: Branch[];
  minCgpa: number;
  maxBacklogsAllowed: number;
  ctcDisplay: string;
  ctcNumber: number; // in LPA
  stipendDisplay?: string;
  locations: string[];
  workMode: 'On-site' | 'Hybrid' | 'Remote';
  deadline: string; // YYYY-MM-DD
  oaDate?: string;
  batchEligible: string[];
  skills: string[];
  description: string;
  selectionProcess: string[];
  applyUrl: string;
  openingsCount: number;
  featured?: boolean;
}

export interface StudentProfile {
  name: string;
  email: string;
  phone: string;
  college: string;
  rollNumber: string;
  branch: Branch;
  gradYear: string;
  cgpa: number;
  tenthPercentage: number;
  twelfthPercentage: number;
  activeBacklogs: number;
  clearedBacklogs: number;
  githubUrl: string;
  linkedinUrl: string;
  portfolioUrl: string;
  skills: string[];
  preferredLocations: string[];
  targetCtcMin: number;
}

export interface TrackedApplication {
  id: string;
  jobId?: string;
  company: string;
  role: string;
  stage: ApplicationStage;
  appliedDate: string;
  nextRoundDate?: string;
  nextRoundType?: string;
  ctc: string;
  location: string;
  notes: string;
  oaLink?: string;
}

export interface DsaProblem {
  id: string;
  title: string;
  topic: 'Arrays' | 'Two Pointers' | 'Sliding Window' | 'Linked List' | 'Binary Trees' | 'BST & Graphs' | 'Dynamic Programming' | 'Strings & Bit Manipulation';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  frequency: 'High' | 'Very High' | 'Crucial';
  hint: string;
  timeComplexity: string;
  companies: string[];
  practiceUrl: string;
}

export interface QuizQuestion {
  id: string;
  category: 'Aptitude & Speed Math' | 'Core CS (OS & DBMS)' | 'Computer Networks & OOPs' | 'Technical Code Output';
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface InterviewExperience {
  id: string;
  studentName: string;
  college: string;
  company: string;
  role: string;
  packageOffered: string;
  result: 'Selected' | 'Offered PPO' | 'Reached Final HR' | 'Rejected in Tech 2';
  date: string;
  roundsSummary: {
    roundName: string;
    description: string;
    keyQuestions: string[];
  }[];
  adviceForJuniors: string;
  difficulty: 'Moderate' | 'Challenging' | 'Tough';
}

export interface ResumeData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
  portfolio: string;
  summary: string;
  education: {
    institution: string;
    degree: string;
    branch: string;
    year: string;
    score: string;
  }[];
  skills: {
    languages: string;
    frameworks: string;
    coreCs: string;
    tools: string;
  };
  projects: {
    id: string;
    title: string;
    techStack: string;
    githubLink: string;
    liveDemo: string;
    bullets: string[];
  }[];
  internships: {
    id: string;
    role: string;
    company: string;
    duration: string;
    location: string;
    bullets: string[];
  }[];
  achievements: string[];
  certifications: string[];
}
