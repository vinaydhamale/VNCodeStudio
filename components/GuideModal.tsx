
import React from 'react';

interface GuideModalProps {
  onClose: () => void;
}

const GuideModal: React.FC<GuideModalProps> = ({ onClose }) => {
  const steps = [
    {
      title: "1. Choose Your Template",
      desc: "Browse our premium library and find the style that fits your video. Each template comes with unique transitions and color grading.",
      img: "https://picsum.photos/seed/step1/800/600"
    },
    {
      title: "2. Copy the Code",
      desc: "After purchase, you'll get a unique template code or link. Simply click to copy it to your clipboard.",
      img: "https://picsum.photos/seed/step2/800/600"
    },
    {
      title: "3. Import into VN Editor",
      desc: "Open the VN Video Editor app, go to templates, and paste the code. The app will automatically download all assets and transitions.",
      img: "https://picsum.photos/seed/step3/800/600"
    },
    {
      title: "4. Replace Media & Export",
      desc: "Tap on the placeholders to add your own videos and photos. Your masterpiece is ready to go viral! Export and share on Instagram.",
      img: "https://picsum.photos/seed/step4/800/600"
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={onClose}></div>
      
      <div className="relative w-full max-w-5xl bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl border border-slate-800 flex flex-col max-h-[90vh]">
        <div className="p-8 md:p-12 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900 z-10">
          <div>
            <h2 className="text-3xl font-outfit font-bold text-white mb-2">How to <span className="gradient-text">Use Templates</span></h2>
            <p className="text-slate-400 text-sm">Follow these 4 simple steps to level up your content.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {steps.map((step, idx) => (
              <div key={idx} className="space-y-6 group">
                <div className="aspect-video rounded-3xl overflow-hidden border border-slate-800 relative shadow-lg">
                  <img src={step.img} alt={step.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-6">
                    <span className="text-4xl font-black font-outfit text-white/20">0{idx + 1}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-pink-500/20 text-pink-500 flex items-center justify-center text-sm font-bold">{idx + 1}</span>
                    {step.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed font-light">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 p-8 rounded-[2.5rem] bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h4 className="text-white font-bold text-xl mb-1">Ready to start creating?</h4>
              <p className="text-slate-400 text-sm">Get access to premium templates and tutorials.</p>
            </div>
            <button 
              onClick={onClose}
              className="px-10 py-4 bg-white text-slate-950 rounded-full font-bold hover:bg-slate-200 transition-all shadow-xl shadow-white/5"
            >
              Get Started Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideModal;
