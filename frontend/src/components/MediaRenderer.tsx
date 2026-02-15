
import React from 'react';
import { ContentType } from '../types';

interface MediaRendererProps {
  type: ContentType;
  content: string;
}

const MediaRenderer: React.FC<MediaRendererProps> = ({ type, content }) => {
  switch (type) {
    case 'text':
      return <p className="text-xl text-zinc-300 leading-relaxed font-light">{content}</p>;
    case 'image':
    case 'qr':
      return (
        <div className="flex justify-center bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
          <img src={content} alt="Puzzle" className="max-h-[400px] object-contain rounded shadow-lg" />
        </div>
      );
    case 'video':
      return (
        <div className="rounded-xl overflow-hidden border border-zinc-800">
          <video controls className="w-full max-h-[400px]">
            <source src={content} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    case 'audio':
      return (
        <div className="bg-zinc-900/50 p-8 rounded-xl border border-zinc-800 flex flex-col items-center">
          <div className="mb-4 text-orange-500 animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          </div>
          <audio controls className="w-full">
            <source src={content} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      );
    default:
      return null;
  }
};

export default MediaRenderer;
