
import React from 'react';
import { Quest, Team } from '../types';

interface QuestGridProps {
  quests: Quest[];
  team: Team;
  onSelectQuest: (quest: Quest) => void;
}

const QuestGrid: React.FC<QuestGridProps> = ({ quests, team, onSelectQuest }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {quests.map((quest) => {
        const isSolved = team.solvedIds.includes(quest.id);
        return (
          <div
            key={quest.id}
            onClick={() => onSelectQuest(quest)}
            className={`group cursor-pointer p-6 rounded-2xl border transition-all duration-300 transform hover:-translate-y-1 ${
              isSolved 
                ? 'bg-zinc-900/40 border-green-500/30' 
                : 'bg-zinc-900/40 border-zinc-800 hover:border-orange-500/50'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${
                isSolved ? 'bg-green-500/20 text-green-500' : 'bg-orange-500/20 text-orange-500'
              }`}>
                Sector {quest.id}
              </span>
              <span className="text-zinc-500 text-xs font-bold">{quest.points} PTS</span>
            </div>
            
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-orange-500 transition-colors">
              {quest.title}
            </h3>
            
            <div className="flex items-center gap-2 mt-4 text-zinc-500 text-xs">
              <span className="uppercase tracking-widest">{quest.type}</span>
              <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
              <span>{quest.hints.length} Intelligence Fragments</span>
            </div>

            {isSolved && (
              <div className="mt-4 flex items-center gap-2 text-green-500 text-xs font-bold uppercase tracking-widest">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                SECURED
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default QuestGrid;
