
import { Team, Quest, LeaderboardEntry } from '../types';

// Replace this with your actual Node.js backend URL
const API_BASE_URL = 'http://localhost:5000/api';

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network response was not ok' }));
    throw new Error(error.message || 'An error occurred');
  }
  return response.json();
};

export const api = {
  // Authentication / Registration
  login: async (email: string, accessCode: string) => {
    const res = await fetch('http://localhost:5000/api/teams/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, accessCode }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Login failed');
    }

    return res.json(); // { team, token }
  },


  // Get all quests (usually returns metadata, not the answers)
  getQuests: async (token: string): Promise<Quest[]> => {
    return handleResponse(await fetch(`${API_BASE_URL}/quests`, {
      headers: { 'Authorization': `Bearer ${token}` },
    }));
  },

  // Submit an answer for verification
  submitAnswer: async (token: string, questId: string, answer: string): Promise<{ success: boolean, points: number, solvedIds: string[] }> => {
    return handleResponse(await fetch(`${API_BASE_URL}/quests/${questId}/submit`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ answer }),
    }));
  },

  // Get current rankings
  getLeaderboard: async (): Promise<LeaderboardEntry[]> => {
    return handleResponse(await fetch(`${API_BASE_URL}/leaderboard`));
  }
};
