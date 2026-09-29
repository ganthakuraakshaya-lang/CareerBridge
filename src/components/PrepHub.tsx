import React, { useState } from 'react';
import { useCareer } from '../context/CareerContext';
import { DsaProblem } from '../types';
import { 
  CheckSquare, 
  Square, 
  ExternalLink, 
  HelpCircle, 
  Code, 
  Cpu, 
  Terminal, 
  Layers, 
  BookMarked, 
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const PrepHub: React.FC = () => {
  const { dsaProblems, completedProblemIds, toggleCompleteProblem } = useCareer();
  const [activeSubTab, setActiveSubTab] = useState<'dsa' | 'roadmaps' | 'patterns'>('dsa');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [expandedProblemId, setExpandedProblemId] = useState<string | null>(null);

  const topics = [
    'All',
    'Arrays',
    'Two Pointers',
    'Sliding Window',
    'Linked List',
    'Binary Trees',
    'BST & Graphs',
    'Dynamic Programming',
    'Strings & Bit Manipulation',
  ];

  const filteredProblems = dsaProblems.filter(p => {
    if (selectedTopic === 'All') return true;
    return p.topic === selectedTopic;
  });

  const completionPercentage = Math.round((completedProblemIds.length / dsaProblems.length) * 100) || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            B.Tech Placement Preparation Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Curated SDE coding sheet, company OA test patterns, and branch-specific core technical roadmaps.
          </p>
        </div>

        {/* Sub Navigation Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg self-start sm:self-auto">
          <button
            onClick={() => setActiveSubTab('dsa')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeSubTab === 'dsa'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            SDE Problem Sheet
          </button>
          <button
            onClick={() => setActiveSubTab('roadmaps')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeSubTab === 'roadmaps'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Branch Roadmaps
          </button>
          <button
            onClick={() => setActiveSubTab('patterns')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeSubTab === 'patterns'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Company OA Patterns
          </button>
        </div>
      </div>

      {/* SDE Problem Sheet Tab */}
      {activeSubTab === 'dsa' && (
        <div className="space-y-4">
          {/* Progress Banner */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs text-blue-400 font-semibold block">Placement Coding Readiness</span>
              <div className="text-base font-bold text-white flex items-center gap-2">
                <span>Core SDE Placement Patterns Checklist</span>
                <span className="text-xs font-mono font-medium text-slate-400">
                  ({completedProblemIds.length} / {dsaProblems.length} Solved)
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Covers high-frequency problems asked in Amazon, Microsoft, Qualcomm, TCS Digital, and PhonePe.
              </p>
            </div>

            <div className="w-full sm:w-48 space-y-1.5 shrink-0">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Completion</span>
                <span className="font-mono text-emerald-400 font-bold">{completionPercentage}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-blue-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Topic Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {topics.map(t => {
              const isSelected = selectedTopic === t;
              return (
                <button
                  key={t}
                  onClick={() => setSelectedTopic(t)}
                  className={`px-3 py-1 rounded text-xs font-medium whitespace-nowrap transition-colors ${
                    isSelected
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>

          {/* Problems List */}
          <div className="space-y-2.5">
            {filteredProblems.map((prob) => {
              const isCompleted = completedProblemIds.includes(prob.id);
              const isExpanded = expandedProblemId === prob.id;

              return (
                <div
                  key={prob.id}
                  className={`bg-slate-900 border rounded-xl transition-all ${
                    isCompleted ? 'border-slate-800/60 bg-slate-900/60' : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="p-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        onClick={() => toggleCompleteProblem(prob.id)}
                        className="text-slate-400 hover:text-blue-400 transition-colors shrink-0"
                        title={isCompleted ? 'Mark uncompleted' : 'Mark completed'}
                      >
                        {isCompleted ? (
                          <CheckSquare className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-600" />
                        )}
                      </button>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className={`text-sm font-semibold truncate ${
                            isCompleted ? 'line-through text-slate-400' : 'text-white'
                          }`}>
                            {prob.title}
                          </h4>
                        </div>

                        {/* Unboxed metadata with separators */}
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-0.5">
                          <span className="text-slate-300 font-medium">{prob.topic}</span>
                          <span className="text-slate-600">·</span>
                          <span className={`font-semibold ${
                            prob.difficulty === 'Easy' ? 'text-emerald-400' :
                            prob.difficulty === 'Medium' ? 'text-amber-400' : 'text-rose-400'
                          }`}>
                            {prob.difficulty}
                          </span>
                          <span className="text-slate-600">·</span>
                          <span className="text-slate-400">{prob.frequency} Priority</span>
                          <span className="text-slate-600">·</span>
                          <span className="text-slate-400 truncate max-w-xs">
                            Companies: {prob.companies.join(', ')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={prob.practiceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-750 text-blue-400 text-xs font-medium rounded-lg transition-colors border border-slate-700"
                        title="Practice on LeetCode"
                      >
                        <span>Solve</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>

                      <button
                        onClick={() => setExpandedProblemId(isExpanded ? null : prob.id)}
                        className="p-1 text-slate-400 hover:text-white"
                        title="View approach hint & complexity"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Hint Box */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 border-t border-slate-800/80 text-xs text-slate-300 space-y-2">
                      <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-800">
                        <div className="flex items-center gap-1.5 text-blue-400 font-semibold mb-1">
                          <HelpCircle className="w-3.5 h-3.5" />
                          <span>Approach Hint:</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed">{prob.hint}</p>
                        <div className="mt-2 text-slate-400 font-mono text-[11px]">
                          Target Complexity: <span className="text-emerald-400">{prob.timeComplexity}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Branch Roadmaps Tab */}
      {activeSubTab === 'roadmaps' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* SDE / CSE Track */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2.5 text-blue-400">
                <Code className="w-5 h-5" />
                <h3 className="text-base font-bold text-white">01. Software Engineering (SDE) Track</h3>
              </div>
              <p className="text-xs text-slate-400">
                For B.Tech CSE, IT, and non-CS students targeting software development roles in product & tech firms.
              </p>

              <div className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
                <div>
                  <h4 className="font-semibold text-white">Phase 1: Language Mastery & Core DSA (Months 1–2)</h4>
                  <p className="text-slate-400 mt-0.5">
                    Choose C++ (STL) or Java (Collections Framework). Master Two Pointers, Sliding Window, Trees, and Dynamic Programming.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Phase 2: Core CS Subjects (Month 3)</h4>
                  <p className="text-slate-400 mt-0.5">
                    Operating Systems (Process synchronization, Deadlocks, Paging), DBMS (Normalization 1NF-3NF, ACID, Indexing, B-Trees), Computer Networks (TCP/IP, HTTP/HTTPS).
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Phase 3: High-Impact Capstone Projects (Month 4)</h4>
                  <p className="text-slate-400 mt-0.5">
                    Build 2 production-ready projects with live deployment, unit testing, and measurable metrics on GitHub (avoid generic clone tutorials).
                  </p>
                </div>
              </div>
            </div>

            {/* ECE & EEE Track */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2.5 text-cyan-400">
                <Cpu className="w-5 h-5" />
                <h3 className="text-base font-bold text-white">02. Core ECE / EEE (VLSI & Embedded) Track</h3>
              </div>
              <p className="text-xs text-slate-400">
                Targeting Qualcomm, Texas Instruments, Intel, Nvidia, MediaTek, and NXP Semiconductors.
              </p>

              <div className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
                <div>
                  <h4 className="font-semibold text-white">Phase 1: Advanced Embedded C & Pointers</h4>
                  <p className="text-slate-400 mt-0.5">
                    Bitwise operations, function pointers, volatile keyword, memory alignment, static variables, and inline assembly.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Phase 2: Digital Design & Verilog / VHDL</h4>
                  <p className="text-slate-400 mt-0.5">
                    Combinational & sequential circuit synthesis, Finite State Machines (Moore vs Mealy), Setup & Hold times, Metastability.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Phase 3: Protocols & Microcontrollers</h4>
                  <p className="text-slate-400 mt-0.5">
                    UART, SPI, I2C, CAN protocol timings. Hands-on RTOS or ARM Cortex-M debugging projects.
                  </p>
                </div>
              </div>
            </div>

            {/* Mechanical / Core Engineering */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2.5 text-amber-400">
                <Terminal className="w-5 h-5" />
                <h3 className="text-base font-bold text-white">03. Core Mechanical & Automation Track</h3>
              </div>
              <p className="text-xs text-slate-400">
                Targeting Tata Motors, L&T, Siemens, Mahindra, Bajaj Auto, and Schlumberger.
              </p>

              <div className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
                <div>
                  <h4 className="font-semibold text-white">Phase 1: Thermodynamics & Fluid Mechanics</h4>
                  <p className="text-slate-400 mt-0.5">
                    Otto/Diesel cycles, heat exchangers, Bernoulli equation, boundary layer theory.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Phase 2: CAD / FEA Software Competency</h4>
                  <p className="text-slate-400 mt-0.5">
                    SolidWorks, CATIA, ANSYS FEA simulation analysis, geometric dimensioning and tolerancing (GD&T).
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Phase 3: Python for Engineering Automation</h4>
                  <p className="text-slate-400 mt-0.5">
                    Scripting with NumPy/SciPy for automated stress simulation workflows and telemetry parsing.
                  </p>
                </div>
              </div>
            </div>

            {/* Placement Aptitude & Speed Math */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2.5 text-purple-400">
                <BookMarked className="w-5 h-5" />
                <h3 className="text-base font-bold text-white">04. Placement Aptitude & Speed Math</h3>
              </div>
              <p className="text-xs text-slate-400">
                Essential for clearing Round 1 screening in Day-1 IT companies (TCS, Infosys, Cognizant, Wipro).
              </p>

              <div className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
                <div>
                  <h4 className="font-semibold text-white">Quantitative Ability</h4>
                  <p className="text-slate-400 mt-0.5">
                    Time & Work, Speed Distance Time, Permutation & Combination, Probability, Percentages & Profit/Loss.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Logical Reasoning & Critical Thinking</h4>
                  <p className="text-slate-400 mt-0.5">
                    Seating arrangements, Blood relations, Syllogisms, Direction sense, Data sufficiency.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Verbal & Technical Communication</h4>
                  <p className="text-slate-400 mt-0.5">
                    Sentence correction, Reading comprehension, Vocabulary in context, Technical email writing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Company OA Patterns Tab */}
      {activeSubTab === 'patterns' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Amazon */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">Amazon SDE-1 Campus Drive</h3>
                <span className="text-xs text-amber-400 font-mono font-semibold">₹44.5 LPA</span>
              </div>
              <div className="text-xs text-slate-400 space-y-2">
                <div>
                  <strong className="text-slate-200">Online Assessment Format:</strong> 90 Mins on HackerRank.
                  2 Coding Questions (Medium-Hard DSA: Strings, Sliding Window, Trees, BFS/DFS, Heaps).
                </div>
                <div>
                  <strong className="text-slate-200">Work Style Assessment:</strong> 15 mins test rating your decision-making against Amazon 16 Leadership Principles (especially Customer Obsession and Ownership).
                </div>
                <div>
                  <strong className="text-slate-200">Key Tips:</strong> Amazon test cases test massive constraints (N = 10^5). Make sure your solution is at least O(N log N) or O(N). Avoid O(N^2) brute force.
                </div>
              </div>
            </div>

            {/* Qualcomm */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">Qualcomm Campus Recruitment</h3>
                <span className="text-xs text-blue-400 font-mono font-semibold">₹28.0 LPA</span>
              </div>
              <div className="text-xs text-slate-400 space-y-2">
                <div>
                  <strong className="text-slate-200">Online Assessment Format:</strong> 60 Mins.
                  30 MCQs on C pointers, Memory models, K-Maps, Setup/Hold time math + 2 Coding problems.
                </div>
                <div>
                  <strong className="text-slate-200">Technical Interviews:</strong> Focus on C internals. Write a program to detect if a machine is Big Endian or Little Endian. Implement malloc/free logic.
                </div>
                <div>
                  <strong className="text-slate-200">Key Tips:</strong> Brush up on Static Timing Analysis (STA) and flip-flop propagation delays.
                </div>
              </div>
            </div>

            {/* TCS NQT */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">TCS National Qualifier Test (NQT)</h3>
                <span className="text-xs text-emerald-400 font-mono font-semibold">₹3.6 - ₹9.0 LPA</span>
              </div>
              <div className="text-xs text-slate-400 space-y-2">
                <div>
                  <strong className="text-slate-200">Test Structure:</strong> Part A: Foundation Section (Aptitude, Verbal, Reasoning). Part B: Advanced Section (Advanced Quant & 2 Advanced Coding questions).
                </div>
                <div>
                  <strong className="text-slate-200">Tier Allocation:</strong>
                  Solving both coding questions with 100% test cases qualifies you for TCS Prime (₹9 LPA) or TCS Digital (₹7 LPA) interviews instead of Ninja (₹3.6 LPA).
                </div>
                <div>
                  <strong className="text-slate-200">Key Tips:</strong> Practicing string manipulation, matrix traversal, and basic dynamic programming is enough to crack both coding questions.
                </div>
              </div>
            </div>

            {/* Atlassian */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">Atlassian Graduate Engineer</h3>
                <span className="text-xs text-purple-400 font-mono font-semibold">₹52.0 LPA</span>
              </div>
              <div className="text-xs text-slate-400 space-y-2">
                <div>
                  <strong className="text-slate-200">Test Structure:</strong> 3 algorithmic problems on HackerRank. Extreme focus on edge cases and optimal space complexity.
                </div>
                <div>
                  <strong className="text-slate-200">Craftsmanship Round:</strong> Unique round where you pair with an engineer to refactor dirty code, write modular clean classes, and add unit tests.
                </div>
                <div>
                  <strong className="text-slate-200">Key Tips:</strong> They heavily prioritize clean code, meaningful variable naming, and DRY (Don’t Repeat Yourself) design principles over just passing test cases.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
