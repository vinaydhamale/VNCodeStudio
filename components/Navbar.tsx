
import React, { useState, useRef, useEffect } from 'react';
import { User, ViewMode } from '../types';

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
  user: User | null;
  onAuthClick: () => void;
  onLogout: () => void;
  onOrdersClick: () => void;
  onLogoClick: () => void;
  onAdminClick: () => void;
  currentView: ViewMode;
}

const Navbar: React.FC<NavbarProps> = ({ 
  cartCount, 
  onCartClick, 
  user, 
  onAuthClick, 
  onLogout, 
  onOrdersClick, 
  onLogoClick,
  onAdminClick,
  currentView 
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDropdownAction = (action: () => void) => {
    action();
    setIsDropdownOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-slate-800/50 px-4 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={onLogoClick}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/20 group-hover:scale-105 transition-transform">
            <span className="text-white font-bold font-outfit text-xl italic">V</span>
          </div>
          <span className="text-xl font-bold font-outfit hidden sm:block tracking-tight text-white uppercase">VN STUDIO</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-6">
          {user?.isAdmin && (
            <button 
              onClick={onAdminClick}
              className="text-[10px] sm:text-xs font-bold text-pink-500 hover:text-pink-400 transition-colors px-2 sm:px-3 py-1 bg-pink-500/10 rounded-lg border border-pink-500/20 uppercase tracking-widest"
            >
              Admin
            </button>
          )}

          <button 
            onClick={onCartClick}
            className="relative p-2 text-slate-300 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 h-5 w-5 bg-pink-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          {user ? (
            <div className="relative flex items-center gap-3 sm:gap-4" ref={dropdownRef}>
              <div className="text-sm font-semibold text-white whitespace-nowrap hidden sm:block opacity-70">
                Hi {user.firstName}!
              </div>
              
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-10 h-10 rounded-full border border-slate-700 bg-slate-800 flex items-center justify-center overflow-hidden transition-all hover:border-pink-500 group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-violet-600/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-3 w-56 glass border border-slate-700/50 rounded-2xl shadow-2xl py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-slate-800 mb-2">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Signed in as</p>
                    <p className="text-sm font-bold text-white truncate">{user.email}</p>
                  </div>
                  
                  <button 
                    onClick={() => handleDropdownAction(onOrdersClick)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-pink-500/10 transition-colors text-left"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Order History
                  </button>

                  <div className="h-px bg-slate-800 my-2"></div>
                  
                  <button 
                    onClick={() => handleDropdownAction(onLogout)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-left font-bold"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={onAuthClick}
              className="bg-white text-slate-950 px-6 py-2 rounded-full font-bold text-sm hover:bg-slate-200 transition-all shadow-lg shadow-white/5 active:scale-95"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
