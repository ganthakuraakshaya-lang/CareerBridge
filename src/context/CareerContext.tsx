import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  JobPosting, 
  StudentProfile, 
  TrackedApplication, 
  DsaProblem, 
  ResumeData, 
  ApplicationStage,
  Branch
} from '../types';
import { 
  sampleJobPostings, 
  initialStudentProfile, 
  sampleTrackedApplications, 
  sdeDsaSheet, 
  defaultResumeData 
} from '../data/mockData';

interface CareerContextType {
  // Profile
  profile: StudentProfile;
  updateProfile: (updated: Partial<StudentProfile>) => void;
  
  // Jobs
  jobs: JobPosting[];
  savedJobIds: string[];
  toggleSaveJob: (jobId: string) => void;
  applyToJob: (job: JobPosting) => void;
  
  // Applications Tracker
  trackedApplications: TrackedApplication[];
  addApplication: (app: Omit<TrackedApplication, 'id'>) => void;
  updateApplicationStage: (id: string, stage: ApplicationStage) => void;
  updateApplicationNotes: (id: string, notes: string) => void;
  deleteApplication: (id: string) => void;
  
  // DSA Checklist
  dsaProblems: DsaProblem[];
  completedProblemIds: string[];
  toggleCompleteProblem: (problemId: string) => void;
  
  // Resume Data
  resumeData: ResumeData;
  updateResumeData: (data: Partial<ResumeData>) => void;
  
  // Helpers
  checkEligibility: (job: JobPosting) => { isEligible: boolean; reasons: string[] };
  
  // Toast notifications
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const CareerContext = createContext<CareerContextType | undefined>(undefined);

export const CareerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial from localStorage if available
  const [profile, setProfile] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem('careerbridge_profile');
      return saved ? JSON.parse(saved) : initialStudentProfile;
    } catch {
      return initialStudentProfile;
    }
  });

  const [jobs] = useState<JobPosting[]>(sampleJobPostings);

  const [savedJobIds, setSavedJobIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('careerbridge_saved_jobs');
      return saved ? JSON.parse(saved) : ['job-amazon-sde1', 'job-qualcomm-vlsi'];
    } catch {
      return ['job-amazon-sde1', 'job-qualcomm-vlsi'];
    }
  });

  const [trackedApplications, setTrackedApplications] = useState<TrackedApplication[]>(() => {
    try {
      const saved = localStorage.getItem('careerbridge_applications');
      return saved ? JSON.parse(saved) : sampleTrackedApplications;
    } catch {
      return sampleTrackedApplications;
    }
  });

  const [completedProblemIds, setCompletedProblemIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('careerbridge_dsa_completed');
      return saved ? JSON.parse(saved) : ['dsa-1', 'dsa-2'];
    } catch {
      return ['dsa-1', 'dsa-2'];
    }
  });

  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    try {
      const saved = localStorage.getItem('careerbridge_resume');
      return saved ? JSON.parse(saved) : defaultResumeData;
    } catch {
      return defaultResumeData;
    }
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('careerbridge_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('careerbridge_saved_jobs', JSON.stringify(savedJobIds));
  }, [savedJobIds]);

  useEffect(() => {
    localStorage.setItem('careerbridge_applications', JSON.stringify(trackedApplications));
  }, [trackedApplications]);

  useEffect(() => {
    localStorage.setItem('careerbridge_dsa_completed', JSON.stringify(completedProblemIds));
  }, [completedProblemIds]);

  useEffect(() => {
    localStorage.setItem('careerbridge_resume', JSON.stringify(resumeData));
  }, [resumeData]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3200);
  };

  const updateProfile = (updated: Partial<StudentProfile>) => {
    setProfile(prev => ({ ...prev, ...updated }));
    showToast('Profile updated successfully!');
  };

  const toggleSaveJob = (jobId: string) => {
    setSavedJobIds(prev => {
      const exists = prev.includes(jobId);
      if (exists) {
        showToast('Removed from saved jobs');
        return prev.filter(id => id !== jobId);
      } else {
        showToast('Saved to your target jobs');
        return [...prev, jobId];
      }
    });
  };

  const checkEligibility = (job: JobPosting): { isEligible: boolean; reasons: string[] } => {
    const reasons: string[] = [];

    // CGPA check
    if (profile.cgpa < job.minCgpa) {
      reasons.push(`Minimum CGPA required is ${job.minCgpa.toFixed(1)} (Your CGPA: ${profile.cgpa.toFixed(2)})`);
    }

    // Backlog check
    if (profile.activeBacklogs > job.maxBacklogsAllowed) {
      reasons.push(`Max active backlogs allowed is ${job.maxBacklogsAllowed} (You have ${profile.activeBacklogs})`);
    }

    // Branch check
    const isBranchAllowed = 
      job.eligibleBranches.includes('All Engineering Branches') || 
      job.eligibleBranches.includes(profile.branch) ||
      (profile.branch === 'CSE / IT' && job.eligibleBranches.some(b => b.includes('CSE') || b.includes('IT')));

    if (!isBranchAllowed) {
      reasons.push(`Eligible for ${job.eligibleBranches.join(', ')} (Your branch: ${profile.branch})`);
    }

    return {
      isEligible: reasons.length === 0,
      reasons,
    };
  };

  const applyToJob = (job: JobPosting) => {
    // Check if already in applications
    const existing = trackedApplications.find(a => a.jobId === job.id || (a.company === job.company && a.role === job.title));
    if (existing) {
      showToast(`Already tracked under "${existing.stage}" status!`);
      return;
    }

    const newApp: TrackedApplication = {
      id: `app-${Date.now()}`,
      jobId: job.id,
      company: job.company,
      role: job.title,
      stage: 'Applied',
      appliedDate: new Date().toISOString().split('T')[0],
      ctc: job.ctcDisplay.split('(')[0].trim(),
      location: job.locations[0] || 'Multiple',
      notes: `Applied on ${new Date().toLocaleDateString()}. Min CGPA: ${job.minCgpa}. Test date expected around ${job.oaDate || 'TBD'}.`,
    };

    setTrackedApplications(prev => [newApp, ...prev]);
    showToast(`Successfully tracked application for ${job.company}!`);
  };

  const addApplication = (app: Omit<TrackedApplication, 'id'>) => {
    const newApp: TrackedApplication = {
      ...app,
      id: `app-${Date.now()}`,
    };
    setTrackedApplications(prev => [newApp, ...prev]);
    showToast(`Added ${app.company} to Placement Tracker`);
  };

  const updateApplicationStage = (id: string, stage: ApplicationStage) => {
    setTrackedApplications(prev => prev.map(app => app.id === id ? { ...app, stage } : app));
    showToast(`Updated status to: ${stage}`);
  };

  const updateApplicationNotes = (id: string, notes: string) => {
    setTrackedApplications(prev => prev.map(app => app.id === id ? { ...app, notes } : app));
    showToast('Saved interview notes');
  };

  const deleteApplication = (id: string) => {
    setTrackedApplications(prev => prev.filter(app => app.id !== id));
    showToast('Removed from tracker');
  };

  const toggleCompleteProblem = (problemId: string) => {
    setCompletedProblemIds(prev => {
      if (prev.includes(problemId)) {
        return prev.filter(id => id !== problemId);
      } else {
        return [...prev, problemId];
      }
    });
  };

  const updateResumeData = (updated: Partial<ResumeData>) => {
    setResumeData(prev => ({ ...prev, ...updated }));
  };

  return (
    <CareerContext.Provider
      value={{
        profile,
        updateProfile,
        jobs,
        savedJobIds,
        toggleSaveJob,
        applyToJob,
        trackedApplications,
        addApplication,
        updateApplicationStage,
        updateApplicationNotes,
        deleteApplication,
        dsaProblems: sdeDsaSheet,
        completedProblemIds,
        toggleCompleteProblem,
        resumeData,
        updateResumeData,
        checkEligibility,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </CareerContext.Provider>
  );
};

export const useCareer = () => {
  const context = useContext(CareerContext);
  if (!context) {
    throw new Error('useCareer must be used within a CareerProvider');
  }
  return context;
};
