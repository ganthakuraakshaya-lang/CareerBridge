import React, { useState, useEffect } from 'react';
import { placementQuizQuestions } from '../data/mockData';
import { QuizQuestion } from '../types';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  RotateCcw, 
  Award, 
  ChevronRight, 
  ChevronLeft,
  AlertTriangle
} from 'lucide-react';

export const MockAssessment: React.FC = () => {
  const [questions] = useState<QuizQuestion[]>(placementQuizQuestions);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: number }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(15 * 60); // 15 mins
  const [isTestStarted, setIsTestStarted] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (!isTestStarted || isSubmitted) return;

    if (secondsRemaining <= 0) {
      setIsSubmitted(true);
      return;
    }

    const timer = setInterval(() => {
      setSecondsRemaining(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isTestStarted, isSubmitted, secondsRemaining]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (optionIdx: number) => {
    if (isSubmitted) return;
    const currentQ = questions[currentIdx];
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQ.id]: optionIdx,
    }));
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        score++;
      }
    });
    return score;
  };

  const score = calculateScore();
  const percentage = Math.round((score / questions.length) * 100);

  const resetTest = () => {
    setSelectedAnswers({});
    setCurrentIdx(0);
    setSecondsRemaining(15 * 60);
    setIsSubmitted(false);
    setIsTestStarted(true);
  };

  const currentQ = questions[currentIdx];

  // Landing / Intro Screen
  if (!isTestStarted && !isSubmitted) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-3 text-blue-400">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
              <Award className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                B.Tech Placement Screening Mock OA
              </h1>
              <p className="text-xs text-slate-400">
                15-Minute Timed Campus Recruitment Assessment
              </p>
            </div>
          </div>

          <div className="border-y border-slate-800 py-4 text-xs text-slate-300 space-y-2.5">
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">
              Test Syllabus & Distribution:
            </h4>
            <ul className="space-y-1.5 list-disc list-inside text-slate-400">
              <li><strong className="text-slate-300">Quantitative Aptitude:</strong> Time & Work, Speed Distance, Combinatorics.</li>
              <li><strong className="text-slate-300">Core CS Fundamentals:</strong> OS Deadlock conditions, DBMS Normalization (3NF/BCNF).</li>
              <li><strong className="text-slate-300">Computer Networks & OOPs:</strong> TCP 3-Way Handshake, Polymorphism.</li>
              <li><strong className="text-slate-300">Technical Code Tracing:</strong> C/C++ sequence points, syntax outputs.</li>
            </ul>
          </div>

          <div className="grid grid-cols-3 gap-3 bg-slate-800/60 p-3 rounded-xl border border-slate-800 text-center text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block">Total Questions</span>
              <span className="text-base font-bold text-white tabular-nums">{questions.length} MCQs</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Duration</span>
              <span className="text-base font-bold text-white tabular-nums">15 Minutes</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Marking Scheme</span>
              <span className="text-base font-bold text-emerald-400 font-mono">+1 / 0 (No Negatives)</span>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => {
                setIsTestStarted(true);
                setSecondsRemaining(15 * 60);
              }}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg transition-colors shadow-sm"
            >
              Start Timed Assessment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Test Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Question:</span>
          <span className="text-sm font-bold text-white font-mono">
            {currentIdx + 1} of {questions.length}
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-xs text-blue-400 font-semibold">{currentQ.category}</span>
        </div>

        <div className="flex items-center gap-3">
          {!isSubmitted ? (
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-xs font-bold tabular-nums ${
              secondsRemaining < 120 
                ? 'bg-rose-950/60 border-rose-600 text-rose-300 animate-pulse' 
                : 'bg-slate-800 border-slate-700 text-amber-300'
            }`}>
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTime(secondsRemaining)}</span>
            </div>
          ) : (
            <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Assessment Completed</span>
            </div>
          )}

          {!isSubmitted && (
            <button
              onClick={() => setIsSubmitted(true)}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Submit OA
            </button>
          )}
        </div>
      </div>

      {/* Result Card if Submitted */}
      {isSubmitted && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs text-blue-400 font-semibold block">Placement Readiness Report</span>
              <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">
                Assessment Results: {score} / {questions.length} ({percentage}%)
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {percentage >= 75 
                  ? 'Excellent! You are in the top 15% batch percentile, ready for Amazon & Tier-1 OAs.'
                  : percentage >= 50
                  ? 'Good foundation. Review your incorrect answers below to secure Day-1 digital tracks.'
                  : 'Needs targeted revision in Core CS and speed math before campus drives begin.'}
              </p>
            </div>

            <button
              onClick={resetTest}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Assessment</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Correct Answers</span>
              <span className="text-lg font-bold text-emerald-400 tabular-nums">{score}</span>
            </div>
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Incorrect / Unanswered</span>
              <span className="text-lg font-bold text-rose-400 tabular-nums">{questions.length - score}</span>
            </div>
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Batch Percentile</span>
              <span className="text-lg font-bold text-blue-400 tabular-nums">
                {percentage >= 80 ? '94th %ile' : percentage >= 60 ? '78th %ile' : '45th %ile'}
              </span>
            </div>
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Recommended Track</span>
              <span className="text-xs font-bold text-white truncate block mt-1">
                {percentage >= 70 ? 'Amazon / Qualcomm' : 'TCS Digital / Infosys'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Question View */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-200 space-y-6">
        {/* Question Text */}
        <div className="space-y-2">
          <div className="text-[11px] text-slate-400 font-mono">Question {currentIdx + 1}</div>
          <h3 className="text-base font-semibold text-white leading-relaxed whitespace-pre-line">
            {currentQ.question}
          </h3>
        </div>

        {/* Options */}
        <div className="space-y-2.5">
          {currentQ.options.map((opt, optIdx) => {
            const isSelected = selectedAnswers[currentQ.id] === optIdx;
            const isCorrect = isSubmitted && currentQ.correctAnswer === optIdx;
            const isWrongSelection = isSubmitted && isSelected && !isCorrect;

            let borderStyle = 'border-slate-800 bg-slate-800/40 text-slate-300 hover:border-slate-700 hover:bg-slate-800/80';
            if (isSubmitted) {
              if (isCorrect) {
                borderStyle = 'border-emerald-500 bg-emerald-950/40 text-emerald-200';
              } else if (isWrongSelection) {
                borderStyle = 'border-rose-500 bg-rose-950/40 text-rose-200';
              }
            } else if (isSelected) {
              borderStyle = 'border-blue-500 bg-blue-950/40 text-white font-medium';
            }

            return (
              <button
                key={optIdx}
                onClick={() => handleSelectOption(optIdx)}
                disabled={isSubmitted}
                className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all flex items-center justify-between gap-3 ${borderStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-md font-mono text-xs flex items-center justify-center shrink-0 border ${
                    isSelected ? 'bg-blue-600 text-white border-blue-400' : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}>
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span>{opt}</span>
                </div>

                {isSubmitted && isCorrect && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
                {isSubmitted && isWrongSelection && (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation Box (Visible if Submitted) */}
        {isSubmitted && (
          <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-4 text-xs text-slate-300 space-y-1.5">
            <div className="flex items-center gap-1.5 text-blue-400 font-semibold">
              <HelpCircle className="w-4 h-4" />
              <span>Detailed Solution & Analysis:</span>
            </div>
            <p className="text-slate-300 leading-relaxed">{currentQ.explanation}</p>
          </div>
        )}

        {/* Question Navigator Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
            disabled={currentIdx === 0}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 disabled:opacity-40 text-slate-300 text-xs rounded-lg hover:text-white"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          {/* Palette Dots */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-[200px] sm:max-w-none">
            {questions.map((q, idx) => {
              const isAnswered = selectedAnswers[q.id] !== undefined;
              const isCurrent = currentIdx === idx;
              let dotBg = 'bg-slate-800 text-slate-500';
              if (isCurrent) dotBg = 'bg-blue-600 text-white font-bold ring-2 ring-blue-400/40';
              else if (isAnswered) dotBg = 'bg-slate-700 text-slate-200';

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIdx(idx)}
                  className={`w-7 h-7 rounded text-[11px] font-mono transition-colors flex items-center justify-center shrink-0 ${dotBg}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setCurrentIdx(prev => Math.min(questions.length - 1, prev + 1))}
            disabled={currentIdx === questions.length - 1}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 disabled:opacity-40 text-slate-300 text-xs rounded-lg hover:text-white"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
