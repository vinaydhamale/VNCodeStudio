
import React, { useState } from 'react';
import { User, AuthMode } from '../types';

interface AuthModalProps {
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, onAuthSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    const isAdmin = formData.email === 'admin@vnstudio.com';
    
    if (mode === 'signup') {
        onAuthSuccess({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            mobile: formData.mobile,
            isAdmin: isAdmin
        });
    } else {
        onAuthSuccess({
            firstName: isAdmin ? 'Admin' : 'John',
            lastName: isAdmin ? 'User' : 'Doe',
            email: formData.email || 'demo@user.com',
            mobile: '1234567890',
            isAdmin: isAdmin
        });
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-md bg-slate-900 rounded-[2.5rem] p-8 md:p-10 shadow-2xl border border-slate-800">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-10">
          <h2 className="text-3xl font-outfit font-bold text-white mb-2">
            {mode === 'login' ? 'Welcome Back' : 'Join VN Studio'}
          </h2>
          <p className="text-slate-400 text-sm font-light">
            {mode === 'login' ? 'Enter your details to access your templates' : 'Create an account to start buying templates'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">First Name</label>
                <input 
                  required
                  type="text" 
                  placeholder="John" 
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all text-sm text-white"
                  value={formData.firstName}
                  onChange={e => setFormData({...formData, firstName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Last Name</label>
                <input 
                  required
                  type="text" 
                  placeholder="Doe" 
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all text-sm text-white"
                  value={formData.lastName}
                  onChange={e => setFormData({...formData, lastName: e.target.value})}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Email Address</label>
            <input 
              required
              type="email" 
              placeholder="name@company.com" 
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all text-sm text-white"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Mobile No</label>
              <input 
                required
                type="tel" 
                placeholder="+1 234 567 890" 
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all text-sm text-white"
                value={formData.mobile}
                onChange={e => setFormData({...formData, mobile: e.target.value})}
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Password</label>
            <input 
              required
              type="password" 
              placeholder="••••••••" 
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all text-sm text-white"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-pink-500 to-violet-600 text-white font-bold rounded-2xl shadow-xl shadow-pink-500/20 hover:scale-[1.02] transition-all active:scale-95 mt-4"
          >
            {mode === 'login' ? 'Login' : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm">
            {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
            <button 
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="ml-2 text-pink-500 font-bold hover:underline transition-all"
            >
              {mode === 'login' ? 'Sign Up' : 'Login'}
            </button>
          </p>
          <p className="text-slate-600 text-[10px] mt-4 uppercase tracking-widest">
            Hint: Use admin@vnstudio.com for Admin access
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
