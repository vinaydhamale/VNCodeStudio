
import React from 'react';

interface HeroProps {
  onShowGuide: () => void;
}

const Hero: React.FC<HeroProps> = ({ onShowGuide }) => {
  const scrollToPremium = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById('premium-library');
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  };

  return (
    <div className="relative overflow-hidden w-full">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-pink-500 rounded-full mix-blend-screen filter blur-[128px] animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-600 rounded-full mix-blend-screen filter blur-[128px] animate-pulse"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-2 sm:pt-4 pb-8 sm:pb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/10 border border-pink-500/20 rounded-full mb-6 sm:mb-8 animate-bounce">
          <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
          <span className="text-pink-500 text-xs font-bold uppercase tracking-widest">New 2024 Templates Added</span>
        </div>
        
        <h1 className="text-5xl sm:text-8xl font-outfit font-black mb-6 sm:mb-8 leading-[1.1] sm:leading-[1.05] tracking-tight text-white max-w-5xl mx-auto">
          Create Viral <br /> 
          <span className="gradient-text">Masterpieces</span>
        </h1>
        <p className="max-w-2xl mx-auto text-base sm:text-xl text-slate-400 mb-8 sm:mb-12 font-light leading-relaxed px-4">
          Premium VN templates designed for creators who demand perfection. Seamless transitions, cinematic color grading, and trend-ready beats.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 px-6 sm:px-0">
          <a 
            href="#premium-library" 
            onClick={scrollToPremium}
            className="w-full sm:w-auto px-10 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-pink-500 to-violet-600 rounded-full font-bold text-white shadow-2xl shadow-pink-500/30 hover:scale-105 transition-all active:scale-95 text-base sm:text-lg text-center"
          >
            Browse Templates
          </a>
          <button 
            onClick={onShowGuide}
            className="w-full sm:w-auto px-10 sm:px-12 py-4 sm:py-5 glass text-white rounded-full font-bold hover:bg-white/10 transition-all border border-white/10 hover:border-white/20 text-base sm:text-lg group flex items-center justify-center gap-2"
          >
            How it Works
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>

        <div className="mt-12 sm:mt-20 flex flex-wrap items-center justify-center gap-6 sm:gap-10 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
          <img src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg" alt="Instagram" className="h-6 sm:h-8" />
          <span className="text-xl sm:text-2xl font-black font-outfit text-white">TIKTOK</span>
          <span className="text-xl sm:text-2xl font-bold font-outfit text-white">REELS</span>
          <span className="text-xl sm:text-2xl font-light font-outfit italic text-white">YouTube</span>
        </div>
      </div>
    </div>
  );
};

export default Hero;
