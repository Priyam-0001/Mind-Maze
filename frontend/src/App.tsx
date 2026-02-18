
import React, { useState, useEffect } from 'react';
import { Team, Quest } from './types';
import Sidebar from './components/Sidebar';
import QuestGrid from './components/QuestGrid';
import QuestDetail from './components/QuestDetail';
import Leaderboard from './components/Leaderboard';
import { api } from './services/api';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'quests' | 'leaderboard'>('quests');
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(localStorage.getItem('mindmaze_token'));
  const [team, setTeam] = useState<Team>({
    name: '',
    email: '',
    score: 0,
    solvedIds: []
  });
  const [isContactModel, setisContactModel] = useState(false);

  // Fetch team info and quests if token exists
  useEffect(() => {
    const init = async () => {
      if (token) {
        try {
          setLoading(true);
          const savedTeam = localStorage.getItem('mindmaze_team');
          if (savedTeam) setTeam(JSON.parse(savedTeam));
          
          const questData = await api.getQuests(token);
          setQuests(questData);
          setIsAuthenticated(true);
        } catch (err) {
          console.error("Session expired or server unreachable", err);
          handleLogout();
        } finally {
          setLoading(false);
        }
      }
    };
    init();
  }, [token]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const email = formData.get('email') as string;
    const accessCode = formData.get('accessCode') as string;

    try {
      setLoading(true);
      const data = await api.login(email, accessCode);

      setTeam(data.team);
      setToken(data.token);
      localStorage.setItem('mindmaze_token', data.token);
      localStorage.setItem('mindmaze_team', JSON.stringify(data.team));
      setIsAuthenticated(true);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };


  const handleLogout = () => {
    setIsAuthenticated(false);
    setToken(null);
    localStorage.removeItem('mindmaze_token');
    localStorage.removeItem('mindmaze_team');
  };

  const handleSolveUpdate = (points: number, solvedIds: string[]) => {
    const updatedTeam = { ...team, solvedIds, score: team.score + points };
    setTeam(updatedTeam);
    localStorage.setItem('mindmaze_team', JSON.stringify(updatedTeam));
    setSelectedQuest(null);
  };

  if (!isAuthenticated) {
    return (
      <div style={{ backgroundImage: 'url(/login.jpg)'}}
      className={`min-h-screen flex items-center justify-center p-4
      bg-cover bg-center h-screen`}>
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none overflow-hidden">
            <div className="absolute top-10 left-10 text-zinc-700 select-none pixel-font text-8xl opacity-10 rotate-12">PUZZLE</div>
            <div className="absolute bottom-20 right-20 text-zinc-700 select-none pixel-font text-8xl opacity-10 -rotate-12">MAZE</div>
            <div className="absolute top-1/2 left-1/4 text-zinc-700 select-none pixel-font text-4xl opacity-10">SOLVE</div>
        </div>

        <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl relative z-10 backdrop-blur-sm">
          <div className="text-center mb-8">
            <h1 className="text-4xl pixel-font text-orange-500 orange-glow mb-2">MINDMAZE 3.0</h1>
            <p className="text-zinc-500 font-semibold tracking-widest uppercase text-sm brightness-150">Enter the Labyrinth</p>
            <p className="text-zinc-500 font-semibold tracking-widest text-md lg:mt-[2vh] brightness-150">Login with provided credentials</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-zinc-400 text-sm font-bold uppercase tracking-widest mb-2 px-1">
                Access Code
              </label>
              <input 
                name="accessCode"
                type="text" 
                required
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                placeholder="MMZ-XXXX-XX"
              />
            </div>

            <div>
              <label className="block text-zinc-400 text-sm font-bold uppercase tracking-widest mb-2 px-1">Email</label>
              <input 
                name="email"
                type="email" 
                required
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                placeholder="team@example.com"
              />
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-500 text-black font-bold py-4 rounded-xl 
              transition-all duration-300 transform active:scale-95 shadow-[0_0_20px_rgba(234,88,12,0.3)] 
              disabled:opacity-50 hover:text-[#FFFFF0]"
            >
              {loading ? 'SYNCHRONIZING...' : 'INITIALIZE CONNECTION'}
            </button>
          </form>
          <button onClick ={() => setisContactModel((v: boolean) => !v)}
          className="text-zinc-500 font-semibold tracking-widest text-md
          hover:underline brightness-150">
            Forgot password? Click here to call Admins!
          </button>
        </div>

        {isContactModel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* backdrop */}
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setisContactModel(false)}
            />

            {/* modal */}
            <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-[90%] max-w-md shadow-2xl">
              <h3 className="text-2xl font-bold text-orange-500 mb-3">
                Contact Admins
              </h3>

              <p className="text-zinc-400 mb-6 text-md">
                Please contact the following event administrators to recover your access:
              </p>
              <ul className="text-center">
                <li>{"<NUMBER 1>"}</li>
                <li>{"<NUMBER 2>"}</li>
              </ul>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setisContactModel(false)}
                  className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}


      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#111211] text-white">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        teamName={team.name}
        onLogout={handleLogout}
      />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold text-white mb-1">
              {activeTab === 'quests' ? 'Active Quests' : 'Competition Ranking'}
            </h2>
            <p className="text-zinc-500 text-2xl">
              {activeTab === 'quests' ? 'Decrypt and dominate the leaderboard' : 'Global standing of all teams'}
            </p>
          </div>
          
          <div className="flex gap-4">
             <div className="bg-zinc-900/50 border border-zinc-600 rounded-2xl px-6 py-3 text-right">
                <p className="text-zinc-400 text-md font-bold uppercase tracking-widest">Total Points</p>
                <p className="text-2xl font-bold text-orange-500">{team.score.toLocaleString()}</p>
             </div>
             <div className="bg-zinc-900/50 border border-zinc-600 rounded-2xl px-6 py-3 text-right">
                <p className="text-zinc-400 text-md font-bold uppercase tracking-widest">Solved</p>
                <p className="text-2xl font-bold text-white">{team.solvedIds.length} / {quests.length}</p>
             </div>
          </div>
        </header>

        {loading && activeTab === 'quests' ? (
           <div className="flex justify-center items-center h-64">
             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
           </div>
        ) : activeTab === 'quests' ? (
          selectedQuest ? (
            <QuestDetail 
              token={token!}
              quest={selectedQuest} 
              onBack={() => setSelectedQuest(null)} 
              onSolve={handleSolveUpdate}
              isSolved={team.solvedIds.includes(selectedQuest.id)}
            />
          ) : (
            <QuestGrid quests={quests} team={team} onSelectQuest={setSelectedQuest} />
          )
        ) : (
          <Leaderboard userTeam={team} />
        )}
      </main>
    </div>
  );
};

export default App;
