
import React from 'react';
import { Template } from '../types';

interface TemplateModalProps {
  template: Template;
  onClose: () => void;
  onAddToCart: (t: Template) => void;
  onBuyNow: (t: Template) => void;
}

const TemplateModal: React.FC<TemplateModalProps> = ({ template, onClose, onAddToCart, onBuyNow }) => {
  const isFree = template.price === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-4xl bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-800 flex flex-col md:flex-row max-h-[90vh]">
        {/* Video Side */}
        <div className="md:w-1/2 h-[300px] md:h-auto bg-black relative">
          <video 
            src={template.videoUrl} 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute top-6 left-6 flex items-center gap-2">
            <span className={`px-3 py-1 text-white text-[10px] font-bold uppercase rounded-full ${isFree ? 'bg-green-500' : 'bg-pink-500'}`}>
              {isFree ? 'Free Preview' : 'Premium Edit'}
            </span>
          </div>
        </div>

        {/* Info Side */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col overflow-y-auto custom-scrollbar">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="mb-auto">
            <h2 className="text-3xl font-outfit font-bold text-white mb-3 mt-2">{template.name}</h2>
            
            {/* Tags Display - Beautifully Styled */}
            {template.tags && template.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {template.tags.map(tag => (
                  <span key={tag} className="px-3 py-1.5 bg-pink-500/10 border border-pink-500/20 rounded-xl text-[10px] font-bold text-pink-400 uppercase tracking-widest shadow-lg shadow-pink-500/5">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <p className="text-slate-400 font-light leading-relaxed mb-8">
              {template.description}
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <div className="w-5 h-5 flex-shrink-0 bg-green-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <span>Instant Barcode Import</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <div className="w-5 h-5 flex-shrink-0 bg-green-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <span>VN Editor Mobile & PC</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <div className="w-5 h-5 flex-shrink-0 bg-green-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <span>High Quality Transitions</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <span className="text-slate-400">{isFree ? 'License' : 'Asset Price'}</span>
              <span className={`text-3xl font-bold font-outfit ${isFree ? 'text-green-500' : 'text-white'}`}>
                {isFree ? 'FREE' : `$${template.price.toFixed(2)}`}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {!isFree && (
                <button 
                  onClick={() => onAddToCart(template)}
                  className="flex-1 px-8 py-4 glass text-white font-bold rounded-2xl hover:bg-white/10 transition-all border border-slate-700 active:scale-95"
                >
                  Add to Cart
                </button>
              )}
              <button 
                onClick={() => onBuyNow(template)}
                className={`flex-1 px-8 py-4 text-white font-bold rounded-2xl shadow-xl transition-all active:scale-95 ${
                  isFree 
                  ? 'bg-green-600 hover:bg-green-500 shadow-green-500/20' 
                  : 'bg-gradient-to-r from-pink-500 to-violet-600 shadow-pink-500/20 hover:scale-[1.02]'
                }`}
              >
                {isFree ? 'Get for Free' : 'Buy Now'}
              </button>
            </div>
            {isFree && (
              <p className="text-center text-[10px] text-slate-500 mt-4 uppercase tracking-widest font-bold">
                Login Required to view Barcode
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateModal;
