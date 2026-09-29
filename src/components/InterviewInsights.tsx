import React, { useState } from 'react';
import { sampleInterviewExperiences } from '../data/mockData';
import { InterviewExperience } from '../types';
import { 
  MessageSquare, 
  Search, 
  PlusCircle, 
  Building, 
  GraduationCap, 
  CheckCircle, 
  HelpCircle, 
  Calendar,
  Share2
} from 'lucide-react';

export const InterviewInsights: React.FC = () => {
  const [experiences, setExperiences] = useState<InterviewExperience[]>(sampleInterviewExperiences);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState('All');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // New Experience Form
  const [authorName, setAuthorName] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [packageOffered, setPackageOffered] = useState('');
  const [round1Desc, setRound1Desc] = useState('');
  const [round1Questions, setRound1Questions] = useState('');
  const [round2Desc, setRound2Desc] = useState('');
  const [round2Questions, setRound2Questions] = useState('');
  const [juniorAdvice, setJuniorAdvice] = useState('');

  const companiesList = ['All', 'Amazon', 'Qualcomm', 'TCS', 'Microsoft', 'Atlassian'];

  const filteredExperiences = experiences.filter(exp => {
    const matchesSearch = 
      exp.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.roundsSummary.some(r => r.keyQuestions.some(q => q.toLowerCase().includes(searchQuery.toLowerCase())));

    if (!matchesSearch) return false;
    if (selectedCompanyFilter !== 'All' && !exp.company.toLowerCase().includes(selectedCompanyFilter.toLowerCase())) {
      return false;
    }
    return true;
  });

  const handleShareSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !roleTitle.trim()) return;

    const newExp: InterviewExperience = {
      id: `exp-${Date.now()}`,
      studentName: authorName.trim() || 'Anonymous Engineer',
      college: collegeName.trim() || 'Engineering College',
      company: companyName.trim(),
      role: roleTitle.trim(),
      packageOffered: packageOffered.trim() || 'Competitive LPA',
      result: 'Selected',
      date: 'September 2026',
      difficulty: 'Challenging',
      roundsSummary: [
        {
          roundName: 'Round 1: Screening & Coding OA',
          description: round1Desc.trim() || 'Online test on college campus network.',
          keyQuestions: round1Questions.split('\n').filter(Boolean)
        },
        {
          roundName: 'Round 2: Technical Interview',
          description: round2Desc.trim() || 'Discussion with lead engineer.',
          keyQuestions: round2Questions.split('\n').filter(Boolean)
        }
      ],
      adviceForJuniors: juniorAdvice.trim() || 'Stay calm, focus on writing working code first, and explain your thought process out loud.'
    };

    setExperiences(prev => [newExp, ...prev]);
    setIsShareModalOpen(false);

    // Reset
    setAuthorName('');
    setCollegeName('');
    setCompanyName('');
    setRoleTitle('');
    setPackageOffered('');
    setRound1Desc('');
    setRound1Questions('');
    setRound2Desc('');
    setRound2Questions('');
    setJuniorAdvice('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Senior Interview Archives & Peer Debriefs
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real questions asked in technical and HR rounds, OA hurdles, and actionable preparation tips from placed seniors.
          </p>
        </div>

        <button
          onClick={() => setIsShareModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Share Your Drive Experience</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by company, question keywords (e.g. 'volatile', 'LCA', 'binary tree')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-lg pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {companiesList.map(comp => (
              <button
                key={comp}
                onClick={() => setSelectedCompanyFilter(comp)}
                className={`px-3 py-1 rounded text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCompanyFilter === comp
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {comp}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Experiences Feed */}
      <div className="space-y-5">
        {filteredExperiences.map((exp) => (
          <div
            key={exp.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 hover:border-slate-700 transition-all"
          >
            {/* Top metadata */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">{exp.company}</h3>
                  <span className="text-slate-600">·</span>
                  <span className="text-xs font-medium text-slate-300">{exp.role}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-xs font-semibold text-emerald-400 tabular-nums">{exp.packageOffered}</span>
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                  <span className="text-slate-300 font-medium">{exp.studentName}</span>
                  <span className="text-slate-600">·</span>
                  <span>{exp.college}</span>
                  <span className="text-slate-600">·</span>
                  <span>{exp.date}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-700/50 text-emerald-300 font-medium flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{exp.result}</span>
                </span>
                <span className={`text-xs px-2.5 py-1 rounded-md border font-medium ${
                  exp.difficulty === 'Tough' ? 'bg-rose-950/40 text-rose-300 border-rose-800' :
                  exp.difficulty === 'Challenging' ? 'bg-amber-950/40 text-amber-300 border-amber-800' :
                  'bg-blue-950/40 text-blue-300 border-blue-800'
                }`}>
                  {exp.difficulty}
                </span>
              </div>
            </div>

            {/* Rounds details */}
            <div className="space-y-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                Interview Rounds Breakdown:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {exp.roundsSummary.map((round, rIdx) => (
                  <div key={rIdx} className="bg-slate-800/40 border border-slate-800 rounded-xl p-3.5 space-y-2 text-xs">
                    <h4 className="font-semibold text-white flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">
                        {rIdx + 1}
                      </span>
                      <span>{round.roundName}</span>
                    </h4>
                    <p className="text-slate-400 leading-relaxed text-[11px]">{round.description}</p>
                    
                    {round.keyQuestions.length > 0 && (
                      <div className="pt-1.5 border-t border-slate-800/80 space-y-1">
                        <span className="text-[10px] text-blue-400 font-semibold block">Key Questions Asked:</span>
                        <ul className="space-y-0.5 text-slate-300 list-disc list-inside text-[11px]">
                          {round.keyQuestions.map((q, qIdx) => (
                            <li key={qIdx} className="truncate">{q}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Advice for Juniors */}
            <div className="bg-blue-950/30 border border-blue-900/40 rounded-xl p-3.5 text-xs text-slate-300">
              <span className="text-blue-400 font-semibold block mb-1">
                Senior Advice for Final-Year Batch:
              </span>
              <p className="italic text-slate-300 leading-relaxed">
                "{exp.adviceForJuniors}"
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Share Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 text-slate-200 relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white">Share Your Placement Experience</h3>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleShareSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Your Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Aryan or Anonymous"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">College / Institute</label>
                  <input
                    type="text"
                    placeholder="e.g. NIT Trichy, State Tech Univ"
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Company *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Amazon, Cisco"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Job Role *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SDE-1, GET"
                    value={roleTitle}
                    onChange={(e) => setRoleTitle(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Package Offered</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹18.0 LPA"
                    value={packageOffered}
                    onChange={(e) => setPackageOffered(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Round 1 (OA / Coding) Description & Questions</label>
                <textarea
                  rows={2}
                  placeholder="e.g. 2 coding questions on HackerRank. One was dynamic programming on grid, one was string anagrams."
                  value={round1Desc}
                  onChange={(e) => setRound1Desc(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Technical Interview Questions (one per line)</label>
                <textarea
                  rows={2}
                  placeholder="Explain ACID properties&#10;Invert binary tree&#10;Difference between TCP and UDP"
                  value={round2Questions}
                  onChange={(e) => setRound2Questions(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Key Advice for Juniors</label>
                <textarea
                  rows={2}
                  placeholder="What would you tell someone preparing for this company?"
                  value={juniorAdvice}
                  onChange={(e) => setJuniorAdvice(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsShareModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg"
                >
                  Publish Experience
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
