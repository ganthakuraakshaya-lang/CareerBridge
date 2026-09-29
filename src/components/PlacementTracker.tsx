import React, { useState, useMemo } from 'react';
import { useCareer } from '../context/CareerContext';
import { ApplicationStage, TrackedApplication } from '../types';
import { 
  Plus, 
  Trash2, 
  Calendar, 
  ExternalLink, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Search,
  Building,
  Trophy,
  Edit3
} from 'lucide-react';

const STAGES: ApplicationStage[] = [
  'Bookmarked',
  'Applied',
  'OA Scheduled',
  'Technical Round 1',
  'Technical Round 2',
  'HR Round',
  'Offer Received',
  'Rejected',
];

export const PlacementTracker: React.FC = () => {
  const { 
    trackedApplications, 
    addApplication, 
    updateApplicationStage, 
    updateApplicationNotes, 
    deleteApplication 
  } = useCareer();

  const [activeFilterStage, setActiveFilterStage] = useState<string>('All');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState<string>('');

  // New Application Form State
  const [newCompany, setNewCompany] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newCtc, setNewCtc] = useState('₹12.0 LPA');
  const [newLocation, setNewLocation] = useState('Bangalore');
  const [newStage, setNewStage] = useState<ApplicationStage>('Applied');
  const [newDate, setNewDate] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // Stats calculation
  const stats = useMemo(() => {
    const total = trackedApplications.length;
    const offers = trackedApplications.filter(a => a.stage === 'Offer Received').length;
    const activeOas = trackedApplications.filter(a => a.stage === 'OA Scheduled').length;
    const activeInterviews = trackedApplications.filter(a => 
      a.stage === 'Technical Round 1' || a.stage === 'Technical Round 2' || a.stage === 'HR Round'
    ).length;
    return { total, offers, activeOas, activeInterviews };
  }, [trackedApplications]);

  const filteredApps = useMemo(() => {
    return trackedApplications.filter(app => {
      const matchesSearch = 
        app.company.toLowerCase().includes(searchFilter.toLowerCase()) ||
        app.role.toLowerCase().includes(searchFilter.toLowerCase()) ||
        app.location.toLowerCase().includes(searchFilter.toLowerCase());
      
      if (!matchesSearch) return false;
      if (activeFilterStage !== 'All' && app.stage !== activeFilterStage) return false;
      return true;
    });
  }, [trackedApplications, searchFilter, activeFilterStage]);

  const handleCreateApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.trim() || !newRole.trim()) return;

    addApplication({
      company: newCompany.trim(),
      role: newRole.trim(),
      ctc: newCtc.trim(),
      location: newLocation.trim(),
      stage: newStage,
      appliedDate: new Date().toISOString().split('T')[0],
      nextRoundDate: newDate ? newDate : undefined,
      notes: newNotes.trim() || 'Tracked off-campus/referral opportunity.',
    });

    // Reset
    setNewCompany('');
    setNewRole('');
    setNewCtc('₹12.0 LPA');
    setNewLocation('Bangalore');
    setNewStage('Applied');
    setNewDate('');
    setNewNotes('');
    setIsAddModalOpen(false);
  };

  const getStageBadgeStyle = (stage: ApplicationStage) => {
    switch (stage) {
      case 'Offer Received':
        return 'text-emerald-300 bg-emerald-950/60 border-emerald-500/40';
      case 'Rejected':
        return 'text-rose-300 bg-rose-950/60 border-rose-500/40';
      case 'OA Scheduled':
        return 'text-amber-300 bg-amber-950/60 border-amber-500/40';
      case 'Technical Round 1':
      case 'Technical Round 2':
      case 'HR Round':
        return 'text-blue-300 bg-blue-950/60 border-blue-500/40';
      default:
        return 'text-slate-300 bg-slate-800 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner and Summary Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Placement Application Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track and manage your on-campus placement drives, off-campus referrals, and test schedules.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Application</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 font-medium block">Total Applications</span>
          <div className="text-2xl font-bold text-white tabular-nums mt-1">{stats.total}</div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Active season records</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-amber-400 font-medium block flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Upcoming OAs</span>
          </span>
          <div className="text-2xl font-bold text-amber-300 tabular-nums mt-1">{stats.activeOas}</div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Coding tests pending</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-blue-400 font-medium block flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Active Tech / HR Rounds</span>
          </span>
          <div className="text-2xl font-bold text-blue-300 tabular-nums mt-1">{stats.activeInterviews}</div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">In interview progression</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-emerald-400 font-medium block flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5" />
            <span>Offers Received</span>
          </span>
          <div className="text-2xl font-bold text-emerald-400 tabular-nums mt-1">{stats.offers}</div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Confirmed placement offers</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 sm:p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search applied companies, roles, locations..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Quick Stage Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['All', 'Applied', 'OA Scheduled', 'Technical Round 1', 'Offer Received'].map((stg) => (
              <button
                key={stg}
                onClick={() => setActiveFilterStage(stg)}
                className={`px-2.5 py-1 rounded text-xs font-medium whitespace-nowrap transition-colors ${
                  activeFilterStage === stg
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {stg}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Applications List */}
      {filteredApps.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
          <Building className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-semibold text-slate-300">No applications in this view</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You can add off-campus drives directly or track any on-campus listing from the "Drives & Jobs" tab.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Add Your First Drive
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredApps.map((app) => (
            <div
              key={app.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Left Column: Company & Role Details */}
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-bold text-white truncate">{app.company}</h3>
                  <span className="text-slate-600">·</span>
                  <span className="text-xs font-medium text-slate-300">{app.role}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-xs font-semibold text-emerald-400 tabular-nums">{app.ctc}</span>
                </div>

                {/* Clean unboxed metadata with separators */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                  <span>Location: <strong className="text-slate-300">{app.location}</strong></span>
                  <span className="text-slate-600">·</span>
                  <span>Applied on <strong className="text-slate-300 font-mono">{app.appliedDate}</strong></span>
                  {app.nextRoundDate && (
                    <>
                      <span className="text-slate-600">·</span>
                      <span className="text-amber-400 flex items-center gap-1 font-medium">
                        <Calendar className="w-3 h-3" />
                        Next Event: {app.nextRoundDate} ({app.nextRoundType || 'Round'})
                      </span>
                    </>
                  )}
                </div>

                {/* Notes or OA link */}
                {editingNotesId === app.id ? (
                  <div className="pt-2 flex items-center gap-2">
                    <input
                      type="text"
                      value={tempNotes}
                      onChange={(e) => setTempNotes(e.target.value)}
                      placeholder="Add prep notes, question highlights, interviewer feedback..."
                      className="bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-xs text-white w-full focus:outline-none focus:border-blue-500"
                    />
                    <button
                      onClick={() => {
                        updateApplicationNotes(app.id, tempNotes);
                        setEditingNotesId(null);
                      }}
                      className="px-2.5 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-500 shrink-0 font-medium"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingNotesId(null)}
                      className="px-2 py-1 text-slate-400 text-xs hover:text-white shrink-0"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="pt-1 flex items-center gap-2 text-xs text-slate-400">
                    <p className="italic text-slate-400 truncate max-w-xl">
                      "{app.notes}"
                    </p>
                    <button
                      onClick={() => {
                        setEditingNotesId(app.id);
                        setTempNotes(app.notes);
                      }}
                      className="text-slate-500 hover:text-blue-400 transition-colors p-1"
                      title="Edit notes"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* Right Column: Stage Selector & Controls */}
              <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                {/* Stage dropdown selector */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-semibold uppercase block">
                    Current Stage:
                  </label>
                  <select
                    value={app.stage}
                    onChange={(e) => updateApplicationStage(app.id, e.target.value as ApplicationStage)}
                    className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border focus:outline-none transition-colors cursor-pointer ${getStageBadgeStyle(app.stage)}`}
                  >
                    {STAGES.map((stg) => (
                      <option key={stg} value={stg} className="bg-slate-900 text-white">
                        {stg}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Delete button */}
                <button
                  onClick={() => deleteApplication(app.id)}
                  className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors mt-3.5"
                  title="Remove from tracker"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Custom Application Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 text-slate-200 relative shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white">Track Custom Placement Drive</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateApplication} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Goldman Sachs, Cisco, Oracle"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Role / Job Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Software Engineer, Analyst"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Offered CTC / Stipend</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹16.0 LPA or ₹50k/mo"
                    value={newCtc}
                    onChange={(e) => setNewCtc(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Initial Pipeline Stage</label>
                  <select
                    value={newStage}
                    onChange={(e) => setNewStage(e.target.value as ApplicationStage)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    {STAGES.map((stg) => (
                      <option key={stg} value={stg}>{stg}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Work Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Bangalore, Hyderabad, Remote"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Next Event Date (Optional)</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Preparation Notes / Focus Areas</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Cleared resume screening via referral. Revise Graphs and Multithreading for Round 1."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-sm"
                >
                  Save Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
