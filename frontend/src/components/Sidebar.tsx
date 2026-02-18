
import React from 'react';
import { ICONS } from '../constants';

interface SidebarProps {
  activeTab: 'quests' | 'leaderboard';
  setActiveTab: (tab: 'quests' | 'leaderboard') => void;
  teamName: string;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, teamName, onLogout }) => {
  return (
    <div className="w-64 flex flex-col h-screen border-zinc-800 bg-[#161616] 
    sticky top-0 border-[#696969] border-r-4 rounded-xl">
      <div className="p-6">
        <h1 className="text-2xl pixel-font text-orange-500 orange-glow mb-2">MINDMAZE</h1>
        <p className="text-zinc-500 font-bold text-md tracking-widest">VERSION 3.0</p>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        <button
          onClick={() => setActiveTab('quests')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
            activeTab === 'quests' ? 'bg-orange-500/10 text-orange-500' : 'text-zinc-400 hover:text-orange-500 hover:bg-zinc-900'
          }`}
        >
          <ICONS.Puzzle />
          <span className="font-semibold uppercase text-sm tracking-wider">Quests</span>
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
            activeTab === 'leaderboard' ? 'bg-orange-500/10 text-orange-500' : 'text-zinc-400 hover:text-orange-500 hover:bg-zinc-900'
          }`}
        >
          <ICONS.Trophy />
          <span className="font-semibold uppercase text-sm tracking-wider">Leaderboard</span>
        </button>
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-zinc-900 rounded-xl p-4 mb-4 border border-zinc-800">
          <p className="text-zinc-400 text-lg font-bold uppercase mb-1">Signed in as</p>
          <p className="text-zinc-200 text-md font-bold truncate">{teamName}</p>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-500 hover:text-red-500 transition-colors"
        >
          <ICONS.Logout />
          <span className="font-semibold uppercase text-md tracking-wider">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
