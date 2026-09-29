import React, { useState } from 'react';
import { useCareer } from '../context/CareerContext';
import { 
  Briefcase, 
  Layers, 
  BookOpen, 
  Award, 
  FileText, 
  Calculator, 
  MessageSquare, 
  UserCheck, 
  Menu, 
  X,
  GraduationCap,
  Bot
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenProfile: () => void;
  onOpenChat: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenProfile, onOpenChat }) => {
  const { profile, trackedApplications } = useCareer();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'jobs', label: 'Drives & Jobs', icon: Briefcase },
    { 
      id: 'tracker', 
      label: 'Placement Tracker', 
      icon: Layers,
      badge: trackedApplications.length > 0 ? trackedApplications.length : undefined
    },
    { id: 'prep', label: 'Roadmap & SDE Sheet', icon: BookOpen },
    { id: 'mock', label: 'Mock OA Test', icon: Award },
    { id: 'resume', label: 'ATS Resume Builder', icon: FileText },
    { id: 'ctc', label: 'CTC & In-Hand Calc', icon: Calculator },
    { id: 'insights', label: 'Senior Experiences', icon: MessageSquare },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900/95 backdrop-blur-md">
      {/* Top Bar Contract: Zone 1 (Wordmark), Zone 2 (Nav links), Zone 3 (Primary Action) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => setActiveTab('jobs')}
            className="flex items-center gap-2.5 text-left focus:outline-none group"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white block leading-tight">
                CareerBridge
              </span>
              <span className="text-[11px] font-medium text-slate-400 block leading-tight">
                B.Tech Placement Portal
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Clean typography with hover highlights) */}
        <nav className="hidden xl:flex items-center gap-1 overflow-x-auto py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className={`text-[10px] tabular-nums font-semibold px-1.5 py-0.2 rounded ${
                    isActive ? 'bg-blue-700 text-white' : 'bg-slate-800 text-blue-300 border border-slate-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action - AI Agent & Student Profile */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-sm transition-all border border-blue-400/30 group"
            title="Chat with n8n Placement AI Agent"
          >
            <Bot className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            <span className="hidden md:inline">AI Placement Agent</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </button>

          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-800 hover:border-slate-600 transition-colors text-left"
            title="Edit student profile and eligibility metrics"
          >
            <div className="w-7 h-7 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 text-xs font-bold">
              {profile.name.charAt(0)}
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-semibold text-slate-200 leading-none truncate max-w-[110px]">
                {profile.name}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5 tabular-nums">
                {profile.branch.split('/')[0].trim()} · CGPA {profile.cgpa.toFixed(2)}
              </div>
            </div>
            <UserCheck className="w-3.5 h-3.5 text-emerald-400 hidden sm:block" />
          </button>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-800 bg-slate-900 px-4 py-3 space-y-1">
          <div className="pb-2 mb-2 border-b border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
            <span>{profile.college}</span>
            <span className="text-blue-400 font-mono text-[11px]">Passout {profile.gradYear.slice(0, 4)}</span>
          </div>

          {/* AI Agent Quick Launcher in Mobile Menu */}
          <button
            onClick={() => {
              onOpenChat();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white mb-2 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <Bot className="w-4 h-4" />
              <span>AI Placement Agent (n8n)</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="text-xs tabular-nums px-2 py-0.5 rounded bg-blue-900/60 text-blue-200 border border-blue-700/50">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
