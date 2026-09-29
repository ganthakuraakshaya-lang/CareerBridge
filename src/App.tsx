import React, { useState } from 'react';
import { CareerProvider, useCareer } from './context/CareerContext';
import { Navbar } from './components/Navbar';
import { JobBoard } from './components/JobBoard';
import { PlacementTracker } from './components/PlacementTracker';
import { PrepHub } from './components/PrepHub';
import { MockAssessment } from './components/MockAssessment';
import { ResumeBuilder } from './components/ResumeBuilder';
import { CtcCalculator } from './components/CtcCalculator';
import { InterviewInsights } from './components/InterviewInsights';
import { ProfileModal } from './components/ProfileModal';
import { CheckCircle2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('jobs');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const { toastMessage } = useCareer();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Navigation */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenProfile={() => setIsProfileModalOpen(true)} 
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'jobs' && <JobBoard />}
        {activeTab === 'tracker' && <PlacementTracker />}
        {activeTab === 'prep' && <PrepHub />}
        {activeTab === 'mock' && <MockAssessment />}
        {activeTab === 'resume' && <ResumeBuilder />}
        {activeTab === 'ctc' && <CtcCalculator />}
        {activeTab === 'insights' && <InterviewInsights />}
      </main>

      {/* Profile Edit Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 border border-slate-700 text-white text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 max-w-md animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Quiet Footer (Clean, no pseudo-technical clutter) */}
      <footer className="no-print border-t border-slate-900 bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">CareerBridge</span>
            <span className="text-slate-700">·</span>
            <span>B.Tech Final-Year Placement & Job Portal</span>
            <span className="text-slate-700">·</span>
            <span className="font-mono text-slate-600">Batch of 2026</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setActiveTab('jobs')}
              className="hover:text-slate-200 transition-colors"
            >
              Job Drives
            </button>
            <button
              onClick={() => setActiveTab('prep')}
              className="hover:text-slate-200 transition-colors"
            >
              SDE Sheet
            </button>
            <button
              onClick={() => setActiveTab('ctc')}
              className="hover:text-slate-200 transition-colors"
            >
              CTC Calculator
            </button>
            <button
              onClick={() => setActiveTab('resume')}
              className="hover:text-slate-200 transition-colors"
            >
              ATS Resume
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <CareerProvider>
      <AppContent />
    </CareerProvider>
  );
}
