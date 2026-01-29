import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Template } from '../types';

interface AdminPanelProps {
  onClose: () => void;
  templates: Template[];
  onAddTemplate: (t: Template) => void;
  onRemoveTemplate: (id: string) => void;
}

type AdminTab = 'dashboard' | 'templates' | 'orders';
type TimeRange = '7days' | 'monthly' | 'yearly' | 'custom';

const TEMPLATES_PER_PAGE = 10;

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose, templates, onAddTemplate, onRemoveTemplate }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [templateSearchTerm, setTemplateSearchTerm] = useState('');
  const [templateCurrentPage, setTemplateCurrentPage] = useState(1);
  
  // Time Range States
  const [activeTimeRange, setActiveTimeRange] = useState<TimeRange>('7days');
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [customDates, setCustomDates] = useState({ start: '', end: '' });
  const timePickerRef = useRef<HTMLDivElement>(null);

  const [newTemplate, setNewTemplate] = useState({
    name: '',
    price: '',
    videoUrl: '',
    thumbnailUrl: '',
    category: 'Vibrant',
    description: '',
    templateCode: '',
    tags: ''
  });

  // Close time picker on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (timePickerRef.current && !timePickerRef.current.contains(event.target as Node)) {
        setIsTimePickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Mock data for dashboard & orders
  const stats = useMemo(() => {
    const multiplier = activeTimeRange === 'yearly' ? 12 : activeTimeRange === 'monthly' ? 4 : 1;
    
    // Dynamic Trend Data based on user request
    let trendData: { label: string; value: number }[] = [];
    
    if (activeTimeRange === '7days') {
      // Last 7 days - Date Wise
      const days = [];
      const now = new Date();
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        days.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      }
      trendData = days.map(day => ({ label: day, value: Math.floor(Math.random() * 50) + 30 }));
    } else if (activeTimeRange === 'monthly') {
      // Monthly - Week Wise
      trendData = [
        { label: 'Week 1', value: 240 },
        { label: 'Week 2', value: 310 },
        { label: 'Week 3', value: 195 },
        { label: 'Week 4', value: 285 }
      ];
    } else if (activeTimeRange === 'yearly') {
      // Yearly - Month Wise
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      trendData = months.map(month => ({ label: month, value: Math.floor(Math.random() * 500) + 700 }));
    } else {
      // Custom Range
      trendData = [
        { label: 'Period A', value: 150 },
        { label: 'Period B', value: 230 },
        { label: 'Period C', value: 180 }
      ];
    }

    return {
      totalEarnings: 12450.75 * multiplier,
      totalProfit: 9840.50 * multiplier,
      totalSales: Math.floor(1842 * multiplier),
      activeUsers: Math.floor(4209 * multiplier),
      categoryData: [
        { label: 'Travel', value: 35, color: '#ec4899' },
        { label: 'Retro', value: 25, color: '#8b5cf6' },
        { label: 'Urban', value: 20, color: '#06b6d4' },
        { label: 'Minimal', value: 20, color: '#10b981' },
      ],
      trendData,
      allSales: [
        { id: 'TXN-1001', user: 'alex@design.com', template: 'Cyberpunk Neon', price: 4.99, time: '2 mins ago', status: 'Completed' },
        { id: 'TXN-1002', user: 'sarah.k@vlog.tv', template: 'Soft Minimal', price: 3.50, time: '15 mins ago', status: 'Completed' },
        { id: 'TXN-1003', user: 'mike.ross@pro.com', template: 'Vintage Film', price: 5.99, time: '1 hour ago', status: 'Completed' },
        { id: 'TXN-1004', user: 'emily@creative.co', template: 'Fast Action', price: 6.99, time: '3 hours ago', status: 'Completed' },
        { id: 'TXN-1005', user: 'david.beck@media.uk', template: 'Urban Street', price: 4.25, time: '5 hours ago', status: 'Completed' },
        { id: 'TXN-1006', user: 'lisa.ray@style.com', template: 'Dreamy Pastel', price: 3.99, time: '12 hours ago', status: 'Completed' },
        { id: 'TXN-1007', user: 'chris.p@dev.io', template: 'Techno Glitch', price: 5.50, time: '1 day ago', status: 'Completed' },
        { id: 'TXN-1008', user: 'anna.j@photo.net', template: 'Golden Hour', price: 2.99, time: '1 day ago', status: 'Completed' },
      ]
    };
  }, [activeTimeRange]);

  const recentSales = useMemo(() => stats.allSales.slice(0, 5), [stats.allSales]);

  const filteredManagedTemplates = useMemo(() => {
    return templates.filter(t => 
      t.name.toLowerCase().includes(templateSearchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(templateSearchTerm.toLowerCase()) ||
      t.templateCode.toLowerCase().includes(templateSearchTerm.toLowerCase())
    );
  }, [templates, templateSearchTerm]);

  const totalTemplatePages = Math.ceil(filteredManagedTemplates.length / TEMPLATES_PER_PAGE);
  const paginatedManagedTemplates = useMemo(() => {
    const start = (templateCurrentPage - 1) * TEMPLATES_PER_PAGE;
    return filteredManagedTemplates.slice(start, start + TEMPLATES_PER_PAGE);
  }, [filteredManagedTemplates, templateCurrentPage]);

  const maxTrendValue = useMemo(() => Math.max(...stats.trendData.map(d => d.value)), [stats.trendData]);

  const getBarcodeUrl = (code: string) => {
    return `https://bwipjs-api.metafloor.com/?bcid=code128&text=${encodeURIComponent(code)}&scale=2&rotate=N&includetext&backgroundcolor=ffffff`;
  };

  const getTimeRangeLabel = () => {
    switch (activeTimeRange) {
      case '7days': return 'Last 7 Days';
      case 'monthly': return 'Monthly';
      case 'yearly': return 'Yearly';
      case 'custom': 
        if (customDates.start && customDates.end) return `${customDates.start} to ${customDates.end}`;
        return 'Custom Range';
      default: return 'Select Range';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const t: Template = {
      id: Math.random().toString(36).substr(2, 9),
      name: newTemplate.name,
      price: parseFloat(newTemplate.price),
      videoUrl: newTemplate.videoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-portrait-of-a-woman-in-a-neon-night-41221-large.mp4',
      thumbnailUrl: newTemplate.thumbnailUrl || 'https://picsum.photos/seed/' + Math.random() + '/400/600',
      category: newTemplate.category,
      description: newTemplate.description,
      templateCode: newTemplate.templateCode || 'VN-' + Math.random().toString(36).substr(2, 4).toUpperCase(),
      tags: newTemplate.tags.split(',').map(tag => tag.trim().toLowerCase()).filter(tag => tag !== '')
    };
    onAddTemplate(t);
    setNewTemplate({
      name: '',
      price: '',
      videoUrl: '',
      thumbnailUrl: '',
      category: 'Vibrant',
      description: '',
      templateCode: '',
      tags: ''
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={onClose}></div>
      
      <div className="relative w-full max-w-7xl bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl border border-slate-800 flex flex-col md:flex-row h-[90vh]">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-950/50 p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center shadow-lg shadow-pink-500/20">
              <span className="text-white font-black italic">V</span>
            </div>
            <h2 className="text-lg font-bold text-white uppercase tracking-tighter">Admin Panel</h2>
          </div>

          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'dashboard' ? 'bg-pink-500/10 text-pink-500 border border-pink-500/20' : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('templates')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'templates' ? 'bg-pink-500/10 text-pink-500 border border-pink-500/20' : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Manage Templates
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'orders' ? 'bg-pink-500/10 text-pink-500 border border-pink-500/20' : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              All Orders
            </button>
          </nav>

          <div className="mt-auto pt-6 border-t border-slate-800">
            <button onClick={onClose} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-500 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Exit Panel
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-900/50 p-6 md:p-10">
          
          {activeTab === 'dashboard' ? (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h1 className="text-3xl font-outfit font-black text-white">Business <span className="gradient-text">Overview</span></h1>
                  <p className="text-slate-400">Track your performance and sales metrics.</p>
                </div>

                {/* Range Selector Dropdown */}
                <div className="relative" ref={timePickerRef}>
                  <button 
                    onClick={() => setIsTimePickerOpen(!isTimePickerOpen)}
                    className="flex items-center gap-3 px-5 py-3 bg-slate-800 rounded-2xl text-xs font-bold text-white border border-slate-700 hover:border-pink-500/50 transition-all shadow-xl"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {getTimeRangeLabel()}
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 transition-transform duration-300 ${isTimePickerOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isTimePickerOpen && (
                    <div className="absolute top-full right-0 mt-3 w-64 glass border border-slate-700/50 rounded-3xl shadow-2xl py-3 z-[110] animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800/50 mb-2">Select View</div>
                      
                      <button 
                        onClick={() => { setActiveTimeRange('7days'); setIsTimePickerOpen(false); }}
                        className={`w-full px-5 py-3 text-left text-sm font-bold flex items-center justify-between hover:bg-pink-500/10 transition-colors ${activeTimeRange === '7days' ? 'text-pink-500' : 'text-slate-300'}`}
                      >
                        Last 7 Days
                        {activeTimeRange === '7days' && <span className="w-1.5 h-1.5 bg-pink-500 rounded-full"></span>}
                      </button>
                      
                      <button 
                        onClick={() => { setActiveTimeRange('monthly'); setIsTimePickerOpen(false); }}
                        className={`w-full px-5 py-3 text-left text-sm font-bold flex items-center justify-between hover:bg-pink-500/10 transition-colors ${activeTimeRange === 'monthly' ? 'text-pink-500' : 'text-slate-300'}`}
                      >
                        Monthly
                        {activeTimeRange === 'monthly' && <span className="w-1.5 h-1.5 bg-pink-500 rounded-full"></span>}
                      </button>

                      <button 
                        onClick={() => { setActiveTimeRange('yearly'); setIsTimePickerOpen(false); }}
                        className={`w-full px-5 py-3 text-left text-sm font-bold flex items-center justify-between hover:bg-pink-500/10 transition-colors ${activeTimeRange === 'yearly' ? 'text-pink-500' : 'text-slate-300'}`}
                      >
                        Yearly
                        {activeTimeRange === 'yearly' && <span className="w-1.5 h-1.5 bg-pink-500 rounded-full"></span>}
                      </button>

                      <div className="h-px bg-slate-800 my-2"></div>
                      
                      <div className="px-5 py-3">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Custom Range</p>
                        <div className="space-y-2">
                          <input 
                            type="date" 
                            className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:ring-1 focus:ring-pink-500 outline-none" 
                            value={customDates.start}
                            onChange={(e) => setCustomDates({...customDates, start: e.target.value})}
                          />
                          <input 
                            type="date" 
                            className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:ring-1 focus:ring-pink-500 outline-none" 
                            value={customDates.end}
                            onChange={(e) => setCustomDates({...customDates, end: e.target.value})}
                          />
                          <button 
                            onClick={() => { setActiveTimeRange('custom'); setIsTimePickerOpen(false); }}
                            className="w-full py-2 bg-gradient-to-r from-pink-500 to-violet-600 text-white text-xs font-bold rounded-xl mt-2 hover:scale-[1.02] transition-transform"
                          >
                            Apply Custom
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Earnings', val: `$${stats.totalEarnings.toLocaleString()}`, icon: '💰' },
                  { label: 'Net Profit', val: `$${stats.totalProfit.toLocaleString()}`, icon: '📈' },
                  { label: 'Templates Sold', val: stats.totalSales, icon: '🔥' },
                  { label: 'Site Visitors', val: stats.activeUsers.toLocaleString(), icon: '👤' },
                ].map((s, i) => (
                  <div key={i} className="glass p-6 rounded-[2rem] border border-slate-800 hover:border-pink-500/30 transition-all group">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl">{s.icon}</span>
                      <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-lg">+12.4%</span>
                    </div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{s.label}</p>
                    <h3 className="text-2xl font-black text-white group-hover:scale-105 transition-transform origin-left">{s.val}</h3>
                  </div>
                ))}
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Dynamic Trend Chart */}
                <div className="glass p-8 rounded-[2.5rem] border border-slate-800">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-bold text-white">Sales Distribution</h3>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{getTimeRangeLabel()}</span>
                  </div>
                  <div className="h-48 w-full flex items-end gap-2 sm:gap-3 px-2">
                    {stats.trendData.map((data, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-3">
                        <div 
                          className="w-full bg-gradient-to-t from-pink-500 to-violet-600 rounded-t-xl group relative transition-all duration-500"
                          style={{ height: `${(data.value / maxTrendValue) * 100}%` }}
                        >
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-slate-900 text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none shadow-xl">
                            {data.value} Sales
                          </div>
                        </div>
                        <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 truncate w-full text-center">
                          {data.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Category Distribution */}
                <div className="glass p-8 rounded-[2.5rem] border border-slate-800 flex flex-col sm:flex-row items-center gap-10">
                  <div className="relative w-40 h-40">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#1e293b" strokeWidth="20" />
                      {stats.categoryData.map((d, i) => {
                        let offset = 0;
                        for (let j = 0; j < i; j++) offset += stats.categoryData[j].value;
                        const dashArray = `${d.value * 2.51} 251.2`;
                        const dashOffset = `-${offset * 2.51}`;
                        return (
                          <circle 
                            key={i}
                            cx="50" cy="50" r="40" 
                            fill="transparent" 
                            stroke={d.color} 
                            strokeWidth="20"
                            strokeDasharray={dashArray}
                            strokeDashoffset={dashOffset}
                            className="transition-all duration-1000"
                          />
                        );
                      })}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xs font-bold text-slate-400">Total</span>
                      <span className="text-xl font-black text-white">100%</span>
                    </div>
                  </div>
                  <div className="flex-1 space-y-4">
                    <h3 className="text-lg font-bold text-white mb-2">Category Sales</h3>
                    {stats.categoryData.map((d, i) => (
                      <div key={i} className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></div>
                          <span className="text-sm font-medium text-slate-300">{d.label}</span>
                        </div>
                        <span className="text-sm font-bold text-white">{d.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Transactions list */}
              <div className="glass p-8 rounded-[2.5rem] border border-slate-800">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold text-white">Recent Transactions</h3>
                  <button 
                    onClick={() => setActiveTab('orders')}
                    className="text-pink-500 text-xs font-bold hover:underline"
                  >
                    View All Orders
                  </button>
                </div>
                <div className="space-y-4">
                  {recentSales.map((sale, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/40 border border-slate-800/50 hover:bg-slate-800 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-lg">👤</div>
                        <div>
                          <p className="text-sm font-bold text-white">{sale.user}</p>
                          <p className="text-xs text-slate-500">Purchased <span className="text-slate-300">{sale.template}</span></p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-green-500">+${sale.price.toFixed(2)}</p>
                        <p className="text-[10px] text-slate-500 uppercase font-bold">{sale.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : activeTab === 'orders' ? (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-outfit font-black text-white">All <span className="gradient-text">Orders</span></h1>
                  <p className="text-slate-400">Complete transaction history for your store.</p>
                </div>
              </div>
              <div className="glass rounded-[2.5rem] border border-slate-800 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-950/50 text-slate-500 text-[10px] uppercase font-bold tracking-widest border-b border-slate-800">
                    <tr>
                      <th className="px-8 py-5">Transaction ID</th>
                      <th className="px-8 py-5">User</th>
                      <th className="px-8 py-5">Template</th>
                      <th className="px-8 py-5">Amount</th>
                      <th className="px-8 py-5">Date</th>
                      <th className="px-8 py-5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {stats.allSales.map((sale) => (
                      <tr key={sale.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-8 py-6 text-sm font-bold text-white">{sale.id}</td>
                        <td className="px-8 py-6 text-sm text-slate-400">{sale.user}</td>
                        <td className="px-8 py-6 text-sm text-slate-300">{sale.template}</td>
                        <td className="px-8 py-6 text-sm font-bold text-green-500">${sale.price.toFixed(2)}</td>
                        <td className="px-8 py-6 text-sm text-slate-500">{sale.time}</td>
                        <td className="px-8 py-6 text-right">
                          <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-[10px] font-bold uppercase">
                            {sale.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Manage Templates View */
            <div className="flex flex-col md:flex-row gap-8 animate-in fade-in duration-500">
               {/* Left: Add Form */}
              <div className="w-full md:w-1/3 space-y-8">
                <div className="glass p-8 rounded-[2.5rem] border border-slate-800 sticky top-0">
                  <h2 className="text-2xl font-outfit font-bold text-white mb-6">Add <span className="gradient-text">New Template</span></h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Template Name</label>
                      <input 
                        required
                        type="text" 
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-pink-500 outline-none"
                        placeholder="Cyberpunk Glow"
                        value={newTemplate.name}
                        onChange={e => setNewTemplate({...newTemplate, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Price ($)</label>
                      <input 
                        required
                        type="number" 
                        step="0.01"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-pink-500 outline-none"
                        placeholder="4.99"
                        value={newTemplate.price}
                        onChange={e => setNewTemplate({...newTemplate, price: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">VN Import Code</label>
                      <input 
                        required
                        type="text" 
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-pink-500 outline-none"
                        placeholder="VN-XYZ-123"
                        value={newTemplate.templateCode}
                        onChange={e => setNewTemplate({...newTemplate, templateCode: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Tags (Comma separated)</label>
                      <input 
                        required
                        type="text" 
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-pink-500 outline-none"
                        placeholder="travel, nature, minimal"
                        value={newTemplate.tags}
                        onChange={e => setNewTemplate({...newTemplate, tags: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Description</label>
                      <textarea 
                        required
                        rows={2}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-pink-500 outline-none resize-none"
                        placeholder="Describe the aesthetic..."
                        value={newTemplate.description}
                        onChange={e => setNewTemplate({...newTemplate, description: e.target.value})}
                      />
                    </div>
                    <button 
                      type="submit"
                      className="w-full py-4 bg-gradient-to-r from-pink-500 to-violet-600 text-white font-bold rounded-2xl shadow-lg hover:scale-[1.02] transition-all active:scale-95"
                    >
                      Add Template
                    </button>
                  </form>
                </div>
              </div>

              {/* Right: Management List */}
              <div className="w-full md:w-2/3 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h2 className="text-2xl font-outfit font-bold text-white whitespace-nowrap">Inventory <span className="text-slate-500">Manager</span></h2>
                  
                  {/* Search Bar */}
                  <div className="relative flex-1 max-w-sm">
                    <input 
                      type="text"
                      placeholder="Search name or code..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-pink-500"
                      value={templateSearchTerm}
                      onChange={(e) => {
                        setTemplateSearchTerm(e.target.value);
                        setTemplateCurrentPage(1);
                      }}
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {paginatedManagedTemplates.map(t => (
                    <div key={t.id} className="flex flex-col sm:flex-row sm:items-center gap-6 p-5 bg-slate-950/40 border border-slate-800/50 rounded-2xl hover:bg-slate-800/60 transition-colors group">
                      <img src={t.thumbnailUrl} className="w-16 h-24 rounded-xl object-cover shadow-lg group-hover:scale-105 transition-transform" alt="" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-white font-bold text-lg truncate">{t.name}</h4>
                          <span className="text-pink-500 font-bold">${t.price.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="bg-white p-1 rounded-lg">
                            <img src={getBarcodeUrl(t.templateCode)} className="h-8 w-auto min-w-[100px]" alt="barcode" />
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {t.tags?.slice(0, 2).map(tag => (
                              <span key={tag} className="text-[8px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full uppercase tracking-widest font-black">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => onRemoveTemplate(t.id)}
                        className="p-3 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all self-end sm:self-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  {filteredManagedTemplates.length === 0 && (
                    <div className="text-center py-20 glass rounded-3xl text-slate-600 italic">
                      No matching templates found.
                    </div>
                  )}
                </div>

                {/* Template Pagination Controls */}
                {totalTemplatePages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-6 pb-4">
                    <button 
                      disabled={templateCurrentPage === 1}
                      onClick={() => setTemplateCurrentPage(p => p - 1)}
                      className="p-2 glass border border-slate-800 rounded-lg text-white disabled:opacity-30 transition-opacity"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <span className="text-xs font-bold text-slate-500 px-4">
                      Page {templateCurrentPage} of {totalTemplatePages}
                    </span>
                    <button 
                      disabled={templateCurrentPage === totalTemplatePages}
                      onClick={() => setTemplateCurrentPage(p => p + 1)}
                      className="p-2 glass border border-slate-800 rounded-lg text-white disabled:opacity-30 transition-opacity"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
