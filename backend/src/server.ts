import dotenv from "dotenv";
dotenv.config();

import express from "express";
import type { Request, Response, NextFunction } from "express";
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { TeamModel, QuestModel } from './models.js';

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'maze_master_secret_key';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mindmaze';

// Fix: Cast cors() as any to bypass type mismatch with Express application overloads
app.use(cors() as any);
app.use(express.json());

// Middleware to verify JWT
// Fix: Changed res type to any to fix errors where status() and json() were not found
const authenticateToken = (req: any, res: any, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Missing token' });

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Routes

// 1. Team Login / Registration
// Fix: Used any for req and res to correctly access .body, .status(), and .json()
app.post('/api/teams/login', async (req: any, res: any) => {
  const { name, email } = req.body;
  try {
    let team = await TeamModel.findOne({ email });
    if (!team) {
      team = new TeamModel({ name, email, score: 0, solvedIds: [] });
      await team.save();
    }
    
    const token = jwt.sign({ id: team._id, email: team.email }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ team, token });
  } catch (err) {
    res.status(500).json({ message: 'Server error during login' });
  }
});

// 2. Get All Quests (Excludes answers for security)
// Fix: Changed req and res to any to satisfy TypeScript compiler
app.get('/api/quests', authenticateToken, async (req: any, res: any) => {
  try {
    const quests = await QuestModel.find({}, '-answer'); // Don't send the answer to client!
    res.json(quests);
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch quests' });
  }
});

// 3. Submit Quest Answer
// Fix: req and res are typed as any to handle custom user property and Express response methods
app.post('/api/quests/:id/submit', authenticateToken, async (req: any, res: any) => {
  const { id } = req.params;
  const { answer } = req.body;
  const teamId = req.user.id;

  try {
    const quest = await QuestModel.findOne({ id });
    if (!quest) return res.status(404).json({ message: 'Quest not found' });

    const team = await TeamModel.findById(teamId);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    // Check if already solved
    if (team.solvedIds.includes(id)) {
      return res.status(400).json({ message: 'Quest already solved' });
    }

    // Validate answer (case-insensitive)
    if (answer.trim().toUpperCase() === quest.answer.toUpperCase()) {
      team.solvedIds.push(id);
      team.score += quest.points;
      await team.save();
      
      return res.json({ 
        success: true, 
        points: quest.points, 
        solvedIds: team.solvedIds 
      });
    } else {
      return res.status(400).json({ success: false, message: 'Incorrect answer' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error processing answer' });
  }
});

// 4. Get Leaderboard
// Fix: res typed as any to access .json() and .status()
app.get('/api/leaderboard', async (req: any, res: any) => {
  try {
    const teams = await TeamModel.find().sort({ score: -1 });
    const leaderboard = teams.map((team, index) => ({
      rank: index + 1,
      teamName: team.name,
      score: team.score,
      solvedCount: team.solvedIds.length
    }));
    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch leaderboard' });
  }
});

// Database Connection and Server Start
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));
