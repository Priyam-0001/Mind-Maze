import dotenv from "dotenv";
dotenv.config();

import mongoose from 'mongoose';
import { QuestModel } from './models.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mindmaze';

const INITIAL_QUESTS = [
  {
    id: '1',
    title: 'The Silent Signal',
    type: 'text',
    content: 'In the valley of binary, the sequence 01001101 holds the key to the first gate. What character does it represent in ASCII?',
    points: 100,
    answer: 'M',
    hints: [
      { type: 'text', content: 'It is the first letter of MindMaze.' }
    ]
  },
  {
    id: '2',
    title: 'Visual Echo',
    type: 'image',
    content: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?q=80&w=800&auto=format&fit=crop',
    points: 200,
    answer: 'PARIS',
    hints: [
      { type: 'text', content: 'Think of the city of lights.' }
    ]
  }
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Seeding data...');
  
  await QuestModel.deleteMany({}); // Clear existing
  await QuestModel.insertMany(INITIAL_QUESTS);
  
  console.log('Database seeded successfully!');
  process.exit();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
