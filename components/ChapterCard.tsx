import React from 'react';
import { Chapter } from '../types';
import { BookOpen, ChevronRight } from 'lucide-react';

interface ChapterCardProps {
  chapter: Chapter;
  onClick: (id: number) => void;
}

const ChapterCard: React.FC<ChapterCardProps> = ({ chapter, onClick }) => {
  return (
    <div 
      onClick={() => onClick(chapter.id)}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-krishna-100 cursor-pointer group relative"
    >
      {/* Decorative top border */}
      <div className="h-1 w-full bg-gradient-to-r from-krishna-800 to-peacock-600"></div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <span className="inline-block px-2 py-1 bg-peacock-50 text-peacock-800 text-xs font-bold rounded-full uppercase tracking-wide border border-peacock-100">
            Chapter {chapter.id}
          </span>
          <BookOpen className="w-5 h-5 text-gold-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        
        <h3 className="text-xl font-serif font-bold text-krishna-900 mb-1">
          {chapter.sanskritName}
        </h3>
        <h4 className="text-sm font-medium text-peacock-700 mb-3 italic">
          {chapter.englishName}
        </h4>
        <p className="text-krishna-800/80 text-sm line-clamp-3 leading-relaxed">
          {chapter.summary}
        </p>
        
        <div className="mt-4 flex items-center text-krishna-700 font-medium text-sm group-hover:underline">
          Read Summary <ChevronRight className="w-4 h-4 ml-1" />
        </div>
      </div>
    </div>
  );
};

export default ChapterCard;