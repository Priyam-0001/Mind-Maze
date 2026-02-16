
import mongoose, { Schema, Document } from 'mongoose';
import type { ContentType, Hint } from './types.js';

// Team Schema
export interface ITeam extends Document {
  name: string;
  email: string;
  accessCode: string;
  score: number;
  solvedIds: string[];
}

const TeamSchema: Schema = new Schema({
  name: { type: String, required: true },
  accessCode: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  score: { type: Number, default: 0 },
  solvedIds: [{ type: String }]
});

// Quest Schema
export interface IQuest extends Document {
  id: string;
  title: string;
  type: ContentType;
  content: string;
  points: number;
  answer: string;
  hints: Hint[];
}

const QuestSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  type: { type: String, required: true },
  content: { type: String, required: true },
  points: { type: Number, required: true },
  answer: { type: String, required: true },
  hints: [{
    type: { type: String, required: true },
    content: { type: String, required: true }
  }]
});

export const TeamModel = mongoose.model<ITeam>('Team', TeamSchema);
export const QuestModel = mongoose.model<IQuest>('Quest', QuestSchema);
