
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
  login: async (name: string, email: string): Promise<{ team: Team, token: string }> => {
    return handleResponse(await fetch(`${API_BASE_URL}/teams/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    }));
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
