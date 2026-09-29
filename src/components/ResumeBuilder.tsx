import React, { useState, useMemo } from 'react';
import { useCareer } from '../context/CareerContext';
import { ResumeData } from '../types';
import { 
  Printer, 
  CheckCircle, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  Sparkles, 
  ExternalLink,
  Eye,
  FileEdit,
  Download
} from 'lucide-react';

export const ResumeBuilder: React.FC = () => {
  const { resumeData, updateResumeData } = useCareer();
  const [activeView, setActiveView] = useState<'edit' | 'preview'>('preview');

  // ATS Score Calculator & Feedback
  const atsAnalysis = useMemo(() => {
    let score = 50;
    const suggestions: string[] = [];
    const strengths: string[] = [];

    // Contact checks
    if (resumeData.email && resumeData.phone && resumeData.github && resumeData.linkedin) {
      score += 10;
      strengths.push('Complete contact info with GitHub and LinkedIn URLs');
    } else {
      suggestions.push('Add both GitHub and LinkedIn profile links for technical credibility');
    }

    // Education
    if (resumeData.education.length >= 2) {
      score += 10;
      strengths.push('B.Tech degree, intermediate, and school details formatted properly');
    }

    // Projects metric check
    let hasMetricsInProjects = false;
    resumeData.projects.forEach(p => {
      p.bullets.forEach(b => {
        if (/\d+%|\d+\+|sub-\d+|\d+ms|\d+ concurrent/i.test(b)) {
          hasMetricsInProjects = true;
        }
      });
    });

    if (hasMetricsInProjects) {
      score += 15;
      strengths.push('Includes quantified impact metrics (%, latency, users) in project bullets');
    } else {
      suggestions.push('Add numerical metrics to project bullets (e.g., "Reduced latency by 35%", "Served 500+ users")');
    }

    // Action verbs check
    const actionVerbs = ['architected', 'spearheaded', 'engineered', 'optimized', 'implemented', 'designed', 'refactored'];
    let hasActionVerbs = false;
    const allText = JSON.stringify(resumeData).toLowerCase();
    const foundVerbs = actionVerbs.filter(v => allText.includes(v));
    if (foundVerbs.length >= 3) {
      score += 10;
      strengths.push(`Uses strong engineering action verbs (${foundVerbs.slice(0, 3).join(', ')})`);
    } else {
      suggestions.push('Start project and internship bullet points with strong verbs (Engineered, Architected, Optimized)');
    }

    // Core CS keywords
    const coreKeywords = ['data structures', 'algorithms', 'dbms', 'operating systems', 'sql', 'system design'];
    const foundKeywords = coreKeywords.filter(k => allText.includes(k));
    if (foundKeywords.length >= 3) {
      score += 5;
      strengths.push('Mentions core CS fundamentals (OS, DBMS, Data Structures)');
    } else {
      suggestions.push('List core CS subjects (OS, DBMS, Computer Networks) under Technical Skills');
    }

    return {
      score: Math.min(100, score),
      suggestions,
      strengths,
    };
  }, [resumeData]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner and Controls */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            ATS-Optimized B.Tech Fresher Resume
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Engineered for high parsing accuracy through Workday, Taleo, and campus recruitment ATS filters.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Toggle Edit / Preview */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
            <button
              onClick={() => setActiveView('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeView === 'preview'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
            <button
              onClick={() => setActiveView('edit')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeView === 'edit'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileEdit className="w-3.5 h-3.5" />
              <span>Edit Details</span>
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-lg transition-colors"
            title="Print or export as PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* ATS Score & Feedback Box (Hidden on Print) */}
      <div className="no-print bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center font-mono font-bold text-lg text-blue-400 tabular-nums">
              {atsAnalysis.score}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">Placement ATS Score</span>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                  atsAnalysis.score >= 90 ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                  atsAnalysis.score >= 75 ? 'bg-blue-950 text-blue-300 border border-blue-800' :
                  'bg-amber-950 text-amber-300 border border-amber-800'
                }`}>
                  {atsAnalysis.score >= 90 ? 'Tier-1 Ready' : atsAnalysis.score >= 75 ? 'Good Foundation' : 'Optimization Recommended'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Evaluated against campus hiring criteria, action verbs, and quantifiable metric density.
              </p>
            </div>
          </div>
        </div>

        {/* Strengths & Suggestions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-800/80 text-xs">
          <div className="space-y-1.5">
            <span className="text-emerald-400 font-semibold flex items-center gap-1 text-[11px]">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>ATS Strengths:</span>
            </span>
            <ul className="space-y-1 text-slate-300">
              {atsAnalysis.strengths.map((str, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-400">✓</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-1.5">
            <span className="text-amber-400 font-semibold flex items-center gap-1 text-[11px]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Recommendations to Boost Score:</span>
            </span>
            <ul className="space-y-1 text-slate-300">
              {atsAnalysis.suggestions.length > 0 ? (
                atsAnalysis.suggestions.map((sug, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-400">•</span>
                    <span>{sug}</span>
                  </li>
                ))
              ) : (
                <li className="text-slate-400 italic">No critical issues found! Your resume passes all major ATS filters.</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Editor View */}
      {activeView === 'edit' && (
        <div className="no-print bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-6 text-xs text-slate-200">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Edit Resume Content
          </h3>

          {/* Personal Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                value={resumeData.fullName}
                onChange={(e) => updateResumeData({ fullName: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Email</label>
              <input
                type="email"
                value={resumeData.email}
                onChange={(e) => updateResumeData({ email: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Phone</label>
              <input
                type="text"
                value={resumeData.phone}
                onChange={(e) => updateResumeData({ phone: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">GitHub URL</label>
              <input
                type="text"
                value={resumeData.github}
                onChange={(e) => updateResumeData({ github: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">LinkedIn URL</label>
              <input
                type="text"
                value={resumeData.linkedin}
                onChange={(e) => updateResumeData({ linkedin: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Location</label>
              <input
                type="text"
                value={resumeData.location}
                onChange={(e) => updateResumeData({ location: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
              />
            </div>
          </div>

          {/* Professional Summary */}
          <div>
            <label className="block text-slate-400 mb-1">Professional Summary / Objective</label>
            <textarea
              rows={2}
              value={resumeData.summary}
              onChange={(e) => updateResumeData({ summary: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
            />
          </div>

          {/* Skills Categorization */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <h4 className="font-semibold text-white">Technical Skills Categorization</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Programming Languages</label>
                <input
                  type="text"
                  value={resumeData.skills.languages}
                  onChange={(e) => updateResumeData({
                    skills: { ...resumeData.skills, languages: e.target.value }
                  })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Frameworks & Libraries</label>
                <input
                  type="text"
                  value={resumeData.skills.frameworks}
                  onChange={(e) => updateResumeData({
                    skills: { ...resumeData.skills, frameworks: e.target.value }
                  })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Core CS Fundamentals</label>
                <input
                  type="text"
                  value={resumeData.skills.coreCs}
                  onChange={(e) => updateResumeData({
                    skills: { ...resumeData.skills, coreCs: e.target.value }
                  })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Developer Tools & Databases</label>
                <input
                  type="text"
                  value={resumeData.skills.tools}
                  onChange={(e) => updateResumeData({
                    skills: { ...resumeData.skills, tools: e.target.value }
                  })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => setActiveView('preview')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg"
            >
              Done Editing – Switch to Preview
            </button>
          </div>
        </div>
      )}

      {/* Resume Document Layout (Standard Harvard / Stanford Engineering Single-Column ATS Format) */}
      <div className="bg-white text-neutral-900 rounded-2xl shadow-xl p-8 sm:p-12 max-w-4xl mx-auto border border-neutral-200 font-sans print:shadow-none print:border-none print:p-0 print:m-0">
        {/* Header */}
        <div className="text-center pb-4 border-b border-neutral-300">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950 uppercase">
            {resumeData.fullName}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-xs text-neutral-700 mt-2">
            <span>{resumeData.email}</span>
            <span>|</span>
            <span>{resumeData.phone}</span>
            <span>|</span>
            <span>{resumeData.location}</span>
            {resumeData.github && (
              <>
                <span>|</span>
                <span className="text-blue-700">{resumeData.github.replace('https://', '')}</span>
              </>
            )}
            {resumeData.linkedin && (
              <>
                <span>|</span>
                <span className="text-blue-700">{resumeData.linkedin.replace('https://', '')}</span>
              </>
            )}
          </div>
        </div>

        {/* Education Section */}
        <div className="mt-5">
          <h2 className="text-xs font-bold text-neutral-900 uppercase tracking-widest border-b border-neutral-300 pb-0.5 mb-2.5">
            Education
          </h2>
          <div className="space-y-2">
            {resumeData.education.map((edu, idx) => (
              <div key={idx} className="flex justify-between items-start text-xs">
                <div>
                  <div className="font-bold text-neutral-900">{edu.institution}</div>
                  <div className="text-neutral-700">{edu.degree} ({edu.branch})</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-neutral-800">{edu.year}</div>
                  <div className="text-neutral-700 font-medium">{edu.score}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Skills */}
        <div className="mt-5">
          <h2 className="text-xs font-bold text-neutral-900 uppercase tracking-widest border-b border-neutral-300 pb-0.5 mb-2.5">
            Technical Skills
          </h2>
          <div className="text-xs text-neutral-800 space-y-1">
            <div>
              <strong className="text-neutral-950">Languages: </strong>
              <span>{resumeData.skills.languages}</span>
            </div>
            <div>
              <strong className="text-neutral-950">Frameworks & Technologies: </strong>
              <span>{resumeData.skills.frameworks}</span>
            </div>
            <div>
              <strong className="text-neutral-950">Core Computer Science: </strong>
              <span>{resumeData.skills.coreCs}</span>
            </div>
            <div>
              <strong className="text-neutral-950">Developer Tools & Platforms: </strong>
              <span>{resumeData.skills.tools}</span>
            </div>
          </div>
        </div>

        {/* Academic & Engineering Projects */}
        <div className="mt-5">
          <h2 className="text-xs font-bold text-neutral-900 uppercase tracking-widest border-b border-neutral-300 pb-0.5 mb-2.5">
            Projects
          </h2>
          <div className="space-y-3.5">
            {resumeData.projects.map((proj) => (
              <div key={proj.id} className="text-xs">
                <div className="flex justify-between items-baseline font-bold text-neutral-900">
                  <div>
                    <span>{proj.title}</span>
                    <span className="font-normal text-neutral-600 italic ml-2">| {proj.techStack}</span>
                  </div>
                  {proj.githubLink && (
                    <span className="text-[11px] font-normal text-blue-700 underline">
                      {proj.githubLink.replace('https://', '')}
                    </span>
                  )}
                </div>
                <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5 text-neutral-700 leading-relaxed">
                  {proj.bullets.map((b, bIdx) => (
                    <li key={bIdx}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Experience / Internships */}
        {resumeData.internships.length > 0 && (
          <div className="mt-5">
            <h2 className="text-xs font-bold text-neutral-900 uppercase tracking-widest border-b border-neutral-300 pb-0.5 mb-2.5">
              Work Experience & Internships
            </h2>
            <div className="space-y-3">
              {resumeData.internships.map((intern) => (
                <div key={intern.id} className="text-xs">
                  <div className="flex justify-between items-baseline font-bold text-neutral-900">
                    <div>
                      <span>{intern.role}</span>
                      <span className="font-normal text-neutral-700"> – {intern.company}</span>
                    </div>
                    <div className="font-semibold text-neutral-700 text-[11px]">
                      {intern.duration} | {intern.location}
                    </div>
                  </div>
                  <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5 text-neutral-700 leading-relaxed">
                    {intern.bullets.map((b, bIdx) => (
                      <li key={bIdx}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Honors & Achievements */}
        <div className="mt-5">
          <h2 className="text-xs font-bold text-neutral-900 uppercase tracking-widest border-b border-neutral-300 pb-0.5 mb-2.5">
            Honors & Achievements
          </h2>
          <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5 text-xs text-neutral-700">
            {resumeData.achievements.map((ach, idx) => (
              <li key={idx}>{ach}</li>
            ))}
          </ul>
        </div>

        {/* Certifications */}
        <div className="mt-5">
          <h2 className="text-xs font-bold text-neutral-900 uppercase tracking-widest border-b border-neutral-300 pb-0.5 mb-2.5">
            Certifications
          </h2>
          <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5 text-xs text-neutral-700">
            {resumeData.certifications.map((cert, idx) => (
              <li key={idx}>{cert}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
