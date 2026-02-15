
export type ContentType = 'text' | 'image' | 'video' | 'audio' | 'qr';

export interface Hint {
  type: ContentType;
  content: string;
}

export interface Quest {
  id: string;
  title: string;
  type: ContentType;
  content: string;
  points: number;
  answer: string;
  hints: Hint[];
}

export interface Team {
  name: string;
  email: string;
  score: number;
  solvedIds: string[];
}

export interface LeaderboardEntry {
  rank: number;
  teamName: string;
  score: number;
  solvedCount: number;
}
