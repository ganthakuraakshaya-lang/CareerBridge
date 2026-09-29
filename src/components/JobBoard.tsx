import React, { useState, useMemo } from 'react';
import { useCareer } from '../context/CareerContext';
import { JobPosting, Branch, DriveType } from '../types';
import { 
  Search, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Bookmark, 
  ExternalLink, 
  PlusCircle, 
  Building2, 
  Sparkles,
  ChevronRight,
  Filter
} from 'lucide-react';

export const JobBoard: React.FC = () => {
  const { 
    jobs, 
    profile, 
    savedJobIds, 
    toggleSaveJob, 
    applyToJob, 
    checkEligibility, 
    trackedApplications 
  } = useCareer();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<string>('All');
  const [selectedDriveType, setSelectedDriveType] = useState<string>('All');
  const [onlyEligible, setOnlyEligible] = useState(false);
  const [minCtcFilter, setMinCtcFilter] = useState<number>(0);
  const [selectedJobForModal, setSelectedJobForModal] = useState<JobPosting | null>(null);

  const branchesList: string[] = ['All', 'CSE / IT', 'ECE', 'EEE', 'Mechanical', 'All Engineering Branches'];
  const driveTypesList: string[] = ['All', 'On-Campus Placement', 'Off-Campus Hiring', 'National Qualifier / NQT', 'Pooled Campus Drive'];

  // Filter jobs logic
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Search
      const matchesSearch = 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
        job.locations.some(l => l.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      // Branch
      if (selectedBranch !== 'All') {
        const matchesBranch = 
          job.eligibleBranches.includes('All Engineering Branches') ||
          job.eligibleBranches.some(b => b.toLowerCase().includes(selectedBranch.toLowerCase()));
        if (!matchesBranch) return false;
      }

      // Drive Type
      if (selectedDriveType !== 'All' && job.driveType !== selectedDriveType) {
        return false;
      }

      // CTC
      if (job.ctcNumber < minCtcFilter) {
        return false;
      }

      // Eligibility
      if (onlyEligible) {
        const { isEligible } = checkEligibility(job);
        if (!isEligible) return false;
      }

      return true;
    });
  }, [jobs, searchQuery, selectedBranch, selectedDriveType, minCtcFilter, onlyEligible, profile]);

  const activeApplicationIds = useMemo(() => {
    return new Set(trackedApplications.map(a => a.jobId));
  }, [trackedApplications]);

  return (
    <div className="space-y-6">
      {/* Hero Announcement Banner for Final Year Placements */}
      <div className="bg-gradient-to-r from-blue-950/80 via-slate-900 to-slate-900 border border-blue-900/40 rounded-xl p-5 sm:p-6 text-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-400">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Campus Recruitment Season 2025–2026 Active</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              B.Tech Placement & Internship Drives
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              Curated drives for final-year engineering students across Software Engineering, Hardware/VLSI, 
              Embedded Systems, and Core Engineering. Verified eligibility criteria & test dates.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-lg px-4 py-2.5 text-center">
              <span className="block text-[11px] text-slate-400 font-medium">Eligible Drives</span>
              <span className="text-lg font-bold text-white tabular-nums">
                {jobs.filter(j => checkEligibility(j).isEligible).length} / {jobs.length}
              </span>
            </div>
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-lg px-4 py-2.5 text-center">
              <span className="block text-[11px] text-slate-400 font-medium">Top CTC Available</span>
              <span className="text-lg font-bold text-emerald-400 tabular-nums">
                ₹52.0 LPA
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by company (Amazon, Qualcomm), role, skills (DSA, C++, Java), or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/70 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Eligibility Toggle */}
          <button
            onClick={() => setOnlyEligible(!onlyEligible)}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border ${
              onlyEligible
                ? 'bg-emerald-950/50 border-emerald-500/60 text-emerald-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white hover:border-slate-600'
            }`}
          >
            <CheckCircle2 className={`w-3.5 h-3.5 ${onlyEligible ? 'text-emerald-400' : 'text-slate-400'}`} />
            <span>Eligible for My Profile (CGPA ≥ {profile.cgpa.toFixed(1)})</span>
          </button>
        </div>

        {/* Segmented Controls for Branch & Drive Filters */}
        <div className="flex flex-col lg:flex-row gap-4 pt-1 border-t border-slate-800/60">
          {/* Branch Filter Buttons */}
          <div className="space-y-1.5 flex-1">
            <span className="text-[11px] font-semibold text-slate-400 block">Filter by Branch:</span>
            <div className="flex flex-wrap gap-1.5">
              {branchesList.map((branch) => {
                const isSelected = selectedBranch === branch;
                return (
                  <button
                    key={branch}
                    onClick={() => setSelectedBranch(branch)}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-750'
                    }`}
                  >
                    {branch}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Drive Type Filter */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-400 block">Drive Type:</span>
            <div className="flex flex-wrap gap-1.5">
              {driveTypesList.map((type) => {
                const isSelected = selectedDriveType === type;
                return (
                  <button
                    key={type}
                    onClick={() => setSelectedDriveType(type)}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      isSelected
                        ? 'bg-slate-200 text-slate-900 shadow-sm'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Minimum CTC Segment */}
          <div className="space-y-1.5 shrink-0">
            <span className="text-[11px] font-semibold text-slate-400 block">Min Package:</span>
            <div className="flex items-center gap-1.5">
              {[0, 6, 12, 25].map((ctc) => (
                <button
                  key={ctc}
                  onClick={() => setMinCtcFilter(ctc)}
                  className={`px-2.5 py-1 rounded text-xs font-medium tabular-nums transition-colors ${
                    minCtcFilter === ctc
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {ctc === 0 ? 'All' : `≥ ${ctc} LPA`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>Showing <strong className="text-white tabular-nums">{filteredJobs.length}</strong> active campus & off-campus opportunities</span>
        <span>Sorted by Recruitment Urgency & Deadline</span>
      </div>

      {/* Job Cards Grid */}
      {filteredJobs.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
          <Building2 className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-semibold text-slate-300">No matching recruitment drives found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try resetting your branch filter or lowering the minimum CTC requirement to view all opportunities.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedBranch('All');
              setSelectedDriveType('All');
              setMinCtcFilter(0);
              setOnlyEligible(false);
            }}
            className="px-4 py-2 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredJobs.map((job) => {
            const eligibility = checkEligibility(job);
            const isSaved = savedJobIds.includes(job.id);
            const isTracked = activeApplicationIds.has(job.id);

            return (
              <div
                key={job.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top line: Drive Type, Company Logo Text, Bookmark */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-lg bg-gradient-to-br ${job.companyColor} flex items-center justify-center text-white font-bold text-sm tracking-wider shadow-sm`}>
                        {job.companyLogoText}
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors leading-tight">
                          {job.title}
                        </h2>
                        <div className="text-xs font-medium text-slate-300 flex items-center gap-1.5 mt-0.5">
                          <span>{job.company}</span>
                          <span className="text-slate-600">·</span>
                          <span className="text-slate-400">{job.driveType}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleSaveJob(job.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        isSaved 
                          ? 'text-amber-400 bg-amber-950/40 hover:bg-amber-950/60' 
                          : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                      }`}
                      title={isSaved ? 'Remove from saved' : 'Save job'}
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  {/* Clean unboxed metadata with dot separators (Zero-Pill Compliance) */}
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-slate-400 my-3 py-2 border-y border-slate-800/80">
                    <span className="text-emerald-400 font-semibold tabular-nums">{job.ctcDisplay.split('(')[0].trim()}</span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {job.locations.slice(0, 2).join(', ')} ({job.workMode})
                    </span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span>Min CGPA: <strong className="text-slate-200 tabular-nums">{job.minCgpa.toFixed(1)}</strong></span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span>{job.maxBacklogsAllowed === 0 ? '0 Backlogs' : `≤ ${job.maxBacklogsAllowed} Backlogs`}</span>
                  </div>

                  {/* Skills required - subtle inline text */}
                  <div className="text-xs text-slate-400 mb-3">
                    <span className="text-slate-500 font-medium">Key Focus: </span>
                    <span>{job.skills.join(', ')}</span>
                  </div>

                  {/* Eligibility Banner */}
                  <div className={`p-2.5 rounded-lg text-xs flex items-start gap-2 mb-4 ${
                    eligibility.isEligible 
                      ? 'bg-emerald-950/30 border border-emerald-900/40 text-emerald-300' 
                      : 'bg-rose-950/30 border border-rose-900/40 text-rose-300'
                  }`}>
                    {eligibility.isEligible ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <div className="leading-tight">
                      <span className="font-semibold">
                        {eligibility.isEligible ? 'You are fully eligible' : 'Eligibility Restriction:'}
                      </span>
                      {eligibility.isEligible ? (
                        <p className="text-[11px] text-emerald-400/80 mt-0.5">
                          Matches your branch ({profile.branch.split('/')[0].trim()}) and CGPA ({profile.cgpa.toFixed(2)})
                        </p>
                      ) : (
                        <p className="text-[11px] text-rose-300/80 mt-0.5">
                          {eligibility.reasons.join(' · ')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>Deadline: <strong className="text-slate-300 font-mono">{job.deadline}</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedJobForModal(job)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      Rounds & Details
                    </button>

                    <button
                      onClick={() => applyToJob(job)}
                      disabled={isTracked}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        isTracked
                          ? 'bg-slate-800 text-slate-400 cursor-default'
                          : 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm'
                      }`}
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>{isTracked ? 'Tracked' : 'Quick Track'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Job Details Modal */}
      {selectedJobForModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 text-slate-200 relative my-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${selectedJobForModal.companyColor} flex items-center justify-center text-white font-bold text-base`}>
                  {selectedJobForModal.companyLogoText}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">{selectedJobForModal.title}</h2>
                  <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                    <span className="font-semibold text-slate-300">{selectedJobForModal.company}</span>
                    <span>·</span>
                    <span>{selectedJobForModal.driveType}</span>
                    <span>·</span>
                    <span className="text-emerald-400 font-semibold">{selectedJobForModal.ctcDisplay.split('(')[0]}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedJobForModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Content Body */}
            <div className="py-4 space-y-5 text-xs text-slate-300 leading-relaxed">
              {/* Job Overview */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Drive Overview & Description
                </h4>
                <p className="text-slate-300">{selectedJobForModal.description}</p>
              </div>

              {/* Key Placement Parameters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-800/60 p-3 rounded-xl border border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-400 block">Min CGPA</span>
                  <span className="text-sm font-bold text-white tabular-nums">{selectedJobForModal.minCgpa.toFixed(1)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Max Backlogs</span>
                  <span className="text-sm font-bold text-white tabular-nums">{selectedJobForModal.maxBacklogsAllowed}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Tentative OA Date</span>
                  <span className="text-sm font-bold text-blue-400 font-mono">{selectedJobForModal.oaDate || 'TBD'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Estimated Openings</span>
                  <span className="text-sm font-bold text-white tabular-nums">{selectedJobForModal.openingsCount}</span>
                </div>
              </div>

              {/* Eligible Branches */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Eligible B.Tech Engineering Disciplines
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedJobForModal.eligibleBranches.map((br) => (
                    <span key={br} className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-md text-xs text-slate-200">
                      {br}
                    </span>
                  ))}
                </div>
              </div>

              {/* Selection Process / Rounds */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Recruitment & Interview Stages
                </h4>
                <div className="space-y-2">
                  {selectedJobForModal.selectionProcess.map((round, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-800/40 border border-slate-800">
                      <span className="w-5 h-5 rounded-full bg-blue-900/60 text-blue-300 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="text-slate-200 text-xs">{round}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Required Technical Skills */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Recommended Technical Proficiency
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedJobForModal.skills.map((skill) => (
                    <span key={skill} className="px-2 py-0.5 bg-blue-950/40 border border-blue-800/40 text-blue-300 rounded text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
              <a
                href={selectedJobForModal.applyUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 underline font-medium"
              >
                <span>Official Careers Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    applyToJob(selectedJobForModal);
                    setSelectedJobForModal(null);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Track in Placement Pipeline</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
