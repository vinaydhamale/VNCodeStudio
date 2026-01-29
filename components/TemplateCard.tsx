
import React from 'react';
import { Template } from '../types';

interface TemplateCardProps {
  template: Template;
  onClick: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="group relative glass rounded-3xl overflow-hidden cursor-pointer transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-pink-500/10 border border-slate-800"
    >
      <div className="aspect-[3/4] overflow-hidden relative">
        <img 
          src={template.thumbnailUrl} 
          alt={template.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
        
        {/* Play Icon Badge */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-pink-400 transition-colors">{template.name}</h3>
        <div className="flex items-center justify-between">
          <p className="text-slate-400 text-sm font-light">VN Studio Pro</p>
          <p className="text-xl font-bold font-outfit text-white">${template.price.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default TemplateCard;
