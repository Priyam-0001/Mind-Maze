
import React, { useState, useEffect } from 'react';
import { LeaderboardEntry } from '../types';
import { api } from '../services/api';

const Leaderboard: React.FC<{ userTeam: { name: string, score: number, solvedIds: string[] } }> = ({ userTeam }) => {
  const [rankings, setRankings] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await api.getLeaderboard();
        setRankings(data);
      } catch (err) {
        console.error("Failed to fetch leaderboard", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#161616] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-[#696969] text-md text-zinc-400">
            <th className="px-6 py-4 font-bold uppercase tracking-widest">Rank</th>
            <th className="px-6 py-4 font-bold uppercase tracking-widest">Team Name</th>
            <th className="px-6 py-4 font-bold uppercase tracking-widest">Sectors Cleared</th>
            <th className="px-6 py-4 font-bold uppercase tracking-widest">Total XP</th>
          </tr>
        </thead>
        <tbody>
          {rankings.map((entry) => (
            <tr 
              key={entry.teamName} 
              className={`border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors text-xl ${
                entry.teamName === userTeam.name ? 'bg-orange-500/10' : ''
              }`}
            >
              <td className="px-6 py-6">
                <span className={`w-8 h-8 inline-flex items-center justify-center rounded-lg font-bold ${
                  entry.rank === 1 ? 'bg-orange-500 text-black' : 
                  entry.rank === 2 ? 'bg-zinc-400 text-black' : 
                  entry.rank === 3 ? 'bg-orange-900 text-white' : 'text-zinc-500 border border-zinc-800'
                }`}>
                  {entry.rank}
                </span>
              </td>
              <td className="px-6 py-6 font-bold text-white">
                <div className="flex items-center gap-3">
                  {entry.teamName}
                  {entry.teamName === userTeam.name && (
                    <span className="text-md text-orange-500 bg-orange-500/10 px-2 py-0.5 
                    rounded border border-orange-500/30 uppercase tracking-tighter">
                      Current Team
                    </span>
                  )}
                </div>
              </td>
              <td className="px-6 py-6 text-zinc-400 font-mono">{entry.solvedCount}</td>
              <td className="px-6 py-6 text-orange-500 font-bold text-xl">{entry.score.toLocaleString()}</td>
            </tr>
          ))}
          {rankings.length === 0 && (
            <tr>
              <td colSpan={4} className="px-6 py-12 text-center text-zinc-600 uppercase tracking-widest font-bold">
                No telemetry data received yet...
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
