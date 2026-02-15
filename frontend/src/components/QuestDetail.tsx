
import React, { useState } from 'react';
import { Quest } from '../types';
import MediaRenderer from './MediaRenderer';
import { getIntelligentHint } from '../services/gemini';
import { api } from '../services/api';

interface QuestDetailProps {
  token: string;
  quest: Quest;
  onBack: () => void;
  onSolve: (points: number, solvedIds: string[]) => void;
  isSolved: boolean;
}

const QuestDetail: React.FC<QuestDetailProps> = ({ token, quest, onBack, onSolve, isSolved }) => {
  const [answer, setAnswer] = useState('');
  const [showHints, setShowHints] = useState(false);
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [aiHint, setAiHint] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    
    try {
      setSubmitting(true);
      const result = await api.submitAnswer(token, quest.id, answer);
      if (result.success) {
        onSolve(result.points, result.solvedIds);
        setError(false);
      } else {
        throw new Error('Incorrect');
      }
    } catch (err) {
      setError(true);
      setTimeout(() => setError(false), 2000);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRequestAiHint = async () => {
    if (loadingAi) return;
    setLoadingAi(true);
    const hint = await getIntelligentHint(quest.title, quest.content);
    setAiHint(hint);
    setLoadingAi(false);
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-zinc-500 hover:text-orange-500 transition-colors mb-6 group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span className="font-bold uppercase tracking-widest text-xs">Return to Grid</span>
      </button>

      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-zinc-800 flex justify-between items-center">
          <div>
            <span className="text-orange-500 font-bold text-xs uppercase tracking-[0.3em] mb-2 block">Mission Objective</span>
            <h1 className="text-4xl font-black text-white">{quest.title}</h1>
          </div>
          <div className="text-right">
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Potential</p>
            <p className="text-2xl font-mono text-orange-500">+{quest.points} XP</p>
          </div>
        </div>

        <div className="p-8 space-y-8">
          <div className="min-h-[200px] flex flex-col justify-center">
             <MediaRenderer type={quest.type} content={quest.content} />
          </div>

          <div className="space-y-4">
            <h3 className="text-zinc-400 font-bold text-xs uppercase tracking-widest">Submit Findings</h3>
            <form onSubmit={handleSubmit} className="flex gap-4">
              <input
                disabled={isSolved || submitting}
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder={isSolved ? "SECTOR CLEARED" : "ENTER DECRYPTION KEY..."}
                className={`flex-1 bg-black border ${error ? 'border-red-500 animate-shake' : 'border-zinc-800'} rounded-xl px-6 py-4 text-white focus:outline-none focus:border-orange-500 transition-all font-mono uppercase tracking-widest disabled:opacity-50 disabled:bg-zinc-900`}
              />
              {!isSolved && (
                <button 
                  type="submit"
                  disabled={submitting}
                  className="bg-orange-600 hover:bg-orange-500 text-black font-black px-10 py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(234,88,12,0.2)] disabled:opacity-50"
                >
                  {submitting ? 'VALIDATING...' : 'DECRYPT'}
                </button>
              )}
            </form>
            {error && <p className="text-red-500 text-xs font-bold animate-pulse uppercase tracking-widest">Error: Access Denied. Key rejected.</p>}
            {isSolved && <p className="text-green-500 text-xs font-bold uppercase tracking-widest">Signal Authenticated: XP Transferred.</p>}
          </div>

          <div className="pt-8 border-t border-zinc-900 flex flex-col gap-6">
             <div className="flex justify-between items-center">
                <button 
                  onClick={() => setShowHints(!showHints)}
                  className="text-zinc-500 hover:text-zinc-200 text-xs font-bold uppercase tracking-widest flex items-center gap-2"
                >
                  {showHints ? 'Hide' : 'Reveal'} Intelligence Fragments ({quest.hints.length})
                </button>
                <button 
                   onClick={handleRequestAiHint}
                   disabled={loadingAi}
                   className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500/5 border border-orange-500/20 text-orange-500 hover:bg-orange-500/10 transition-colors text-xs font-bold uppercase tracking-widest disabled:opacity-50"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.364-6.364l-.707-.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M12 7a5 5 0 015 5 5 5 0 01-5 5 5 5 0 01-5-5 5 5 0 015-5z" />
                   </svg>
                   {loadingAi ? 'Decoding...' : 'Query Neural AI'}
                </button>
             </div>

             {showHints && (
               <div className="space-y-4 animate-slide-down">
                 {quest.hints.map((hint, idx) => (
                   <div key={idx} className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                     <p className="text-[10px] text-zinc-600 font-bold uppercase mb-2">Fragment #{idx + 1}</p>
                     <MediaRenderer type={hint.type} content={hint.content} />
                   </div>
                 ))}
               </div>
             )}

             {aiHint && (
               <div className="bg-orange-500/10 p-6 rounded-2xl border border-orange-500/30 relative">
                  <div className="absolute -top-3 left-6 bg-black px-2 text-[10px] text-orange-500 font-black tracking-widest border border-orange-500/30 rounded">AI_DECRYPTOR_LOG</div>
                  <p className="text-orange-200 italic font-medium leading-relaxed">
                    "{aiHint}"
                  </p>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestDetail;
