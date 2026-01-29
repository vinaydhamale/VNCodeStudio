
import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TemplateCard from './components/TemplateCard';
import TemplateModal from './components/TemplateModal';
import CartDrawer from './components/CartDrawer';
import AuthModal from './components/AuthModal';
import Checkout from './components/Checkout';
import GuideModal from './components/GuideModal';
import OrderHistory from './components/OrderHistory';
import AdminPanel from './components/AdminPanel';
import { TEMPLATES, FREE_TEMPLATES, CATEGORIES } from './constants';
import { Template, CartItem, User, Order, ViewMode } from './types';

const ITEMS_PER_PAGE = 8;

const Section: React.FC<{ id?: string; className?: string; children: React.ReactNode }> = ({ id, className = "", children }) => {
  const ref = useRef<HTMLElement>(null);
  // Default hero to visible to avoid loading flash
  const [isVisible, setIsVisible] = useState(id === 'hero');

  useEffect(() => {
    if (id === 'hero') return; // Hero visibility handled initially

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { 
        threshold: 0.05,
        rootMargin: "0px"
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [id]);

  return (
    <section 
      id={id} 
      ref={ref}
      className={`${className} ${isVisible ? 'is-visible' : ''}`}
      style={{ scrollMarginTop: '80px' }}
    >
      {children}
    </section>
  );
};

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('home');
  
  // Persistent State Initialization
  const [user, setUser] = useState<User | null>(() => {
    const saved = sessionStorage.getItem('vn_studio_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = sessionStorage.getItem('vn_studio_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [templates, setTemplates] = useState<Template[]>(() => {
    const saved = sessionStorage.getItem('vn_studio_templates');
    return saved ? JSON.parse(saved) : TEMPLATES;
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  const containerRef = useRef<HTMLDivElement>(null);

  // Persistence Effects
  useEffect(() => {
    if (user) {
      sessionStorage.setItem('vn_studio_user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('vn_studio_user');
    }
  }, [user]);

  useEffect(() => {
    sessionStorage.setItem('vn_studio_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    sessionStorage.setItem('vn_studio_templates', JSON.stringify(templates));
  }, [templates]);

  // Cart operations
  const addToCart = useCallback((template: Template) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === template.id);
      if (existing) return prev;
      return [...prev, { ...template, quantity: 1 }];
    });
    setIsCartOpen(true);
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const handleBuyNow = useCallback((template: Template) => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }
    setSelectedTemplate(null);
    setCart([{ ...template, quantity: 1 }]);
    setIsCheckoutOpen(true);
  }, [user]);

  const handleGetFree = useCallback((template: Template) => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }
    setSelectedTemplate(null);
    setCart([{ ...template, quantity: 1 }]);
    setIsCheckoutOpen(true);
  }, [user]);

  const handleProceedToCheckout = useCallback(() => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  }, [user]);

  const handleCheckoutSuccess = useCallback(() => {
    const newOrder: Order = {
      id: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      date: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
      }),
      items: cart.map(({ quantity, ...item }) => item),
      total: cart.reduce((acc, item) => acc + item.price, 0)
    };
    
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    setIsCheckoutOpen(false);
    setViewMode('orders');
    alert("Transaction complete! Your templates are now available in your Order History.");
  }, [cart, clearCart]);

  const handleAddTemplate = (t: Template) => {
    setTemplates(prev => [t, ...prev]);
    setSearchTerm('');
    setActiveCategory('All');
    setCurrentPage(1);
    setTimeout(() => {
        const element = document.getElementById('premium-library');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }, 100);
  };

  const handleRemoveTemplate = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
    removeFromCart(id);
  };

  const filteredTemplates = useMemo(() => {
    const query = searchTerm.toLowerCase();
    return templates.filter(t => {
      const matchesSearch = 
        t.name.toLowerCase().includes(query) || 
        t.tags.some(tag => tag.toLowerCase().includes(query)) ||
        t.category.toLowerCase().includes(query);
      
      const matchesCategory = activeCategory === 'All' || (t.tags && t.tags.includes(activeCategory.toLowerCase()));
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, templates, activeCategory]);

  const totalPages = Math.ceil(filteredTemplates.length / ITEMS_PER_PAGE);
  const paginatedTemplates = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTemplates.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredTemplates, currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    const element = document.getElementById('premium-library');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen selection:bg-pink-500/30 bg-slate-950">
      <Navbar 
        cartCount={cart.length} 
        onCartClick={() => setIsCartOpen(true)} 
        user={user} 
        onAuthClick={() => setIsAuthOpen(true)}
        onLogout={() => {
          setUser(null);
          setViewMode('home');
          setIsAdminOpen(false);
          sessionStorage.removeItem('vn_studio_user');
        }}
        onOrdersClick={() => setViewMode('orders')}
        onLogoClick={() => setViewMode('home')}
        onAdminClick={() => setIsAdminOpen(true)}
        currentView={viewMode}
      />

      {isCheckoutOpen ? (
        <div className="pt-20 min-h-screen bg-slate-950">
          <Checkout 
            items={cart} 
            onClose={() => setIsCheckoutOpen(false)} 
            onSuccess={handleCheckoutSuccess}
          />
        </div>
      ) : viewMode === 'orders' ? (
        <div className="pt-20 min-h-screen bg-slate-950">
          <OrderHistory 
            orders={orders} 
            onBack={() => setViewMode('home')} 
          />
        </div>
      ) : (
        <main ref={containerRef} className="snap-container no-scrollbar">
          
          <Section id="hero" className="snap-section">
            <Hero onShowGuide={() => setIsGuideOpen(true)} />
          </Section>
          
          <Section id="free-section" className="snap-section py-10 sm:py-16">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
               <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-8 sm:mb-12">
                <div className="max-w-xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full mb-3 sm:mb-4">
                    <span className="text-green-500 text-[10px] font-bold uppercase tracking-widest">Free for Everyone</span>
                  </div>
                  <h2 className="text-3xl sm:text-5xl font-outfit font-bold tracking-tight text-white mb-3 sm:mb-4">
                    Start with <span className="text-green-500">Free Assets</span>
                  </h2>
                  <p className="text-slate-400 text-sm sm:text-base font-light">
                    Level up your content without spending a dime. (Login required to download)
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                {FREE_TEMPLATES.map((template) => (
                  <div key={template.id} className="relative">
                    <TemplateCard 
                      template={template} 
                      onClick={() => setSelectedTemplate(template)}
                    />
                    <div className="absolute top-4 right-4 z-10">
                      <span className="bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg shadow-green-500/20">FREE</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          <Section id="premium-library" className="snap-section-long pt-12 pb-24 mt-8 sm:mt-12">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 sm:gap-8 mb-8 sm:mb-12">
                <div className="max-w-xl">
                  <h2 className="text-4xl sm:text-6xl font-outfit font-bold tracking-tight text-white mb-2 sm:mb-4">
                    Premium <span className="gradient-text">Library</span>
                  </h2>
                  <p className="text-slate-400 text-sm sm:text-base font-light">
                    Find the perfect aesthetic for your next viral hit.
                  </p>
                </div>
                
                <div className="relative w-full md:w-[400px] group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-violet-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-focus-within:opacity-100"></div>
                  <div className="relative flex items-center bg-slate-950 rounded-2xl border border-slate-800 focus-within:border-pink-500 transition-all shadow-2xl">
                     <span className="pl-6 text-slate-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </span>
                    <input 
                      type="text" 
                      placeholder="Search name or mood..." 
                      className="bg-transparent px-5 py-4 sm:py-5 w-full focus:outline-none text-white text-base font-medium placeholder:text-slate-600"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div className="mb-8 sm:mb-12">
                <div className="overflow-x-auto no-scrollbar pb-2 sm:pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
                  <div className="flex gap-2 sm:gap-3 whitespace-nowrap min-w-max">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setActiveCategory(cat);
                          setCurrentPage(1);
                        }}
                        className={`px-5 sm:px-7 py-2 sm:py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all border ${
                          activeCategory === cat 
                            ? 'bg-gradient-to-r from-pink-500 to-violet-600 text-white border-transparent shadow-xl shadow-pink-500/20' 
                            : 'bg-slate-900/50 text-slate-400 border-slate-800 hover:text-white hover:border-slate-600 hover:bg-slate-900'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-10">
                {paginatedTemplates.map((template) => (
                  <TemplateCard 
                    key={template.id} 
                    template={template} 
                    onClick={() => setSelectedTemplate(template)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 sm:mt-20 flex items-center justify-center gap-3">
                  <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-3 sm:p-4 glass rounded-2xl text-white disabled:opacity-20 disabled:cursor-not-allowed hover:bg-white/10 transition-all border border-slate-800"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 sm:w-14 sm:h-14 rounded-2xl font-bold transition-all border text-sm sm:text-base ${
                        currentPage === page 
                          ? 'bg-white text-slate-950 border-white shadow-xl shadow-white/5' 
                          : 'glass text-slate-400 border-slate-800 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-3 sm:p-4 glass rounded-2xl text-white disabled:opacity-20 disabled:cursor-not-allowed hover:bg-white/10 transition-all border border-slate-800"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            <footer className="mt-20 sm:mt-32 bg-slate-900 py-12 sm:py-20 border-t border-slate-800">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 sm:gap-12 mb-12 sm:mb-16 text-left">
                  <div className="col-span-1 md:col-span-2">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-violet-600 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold font-outfit text-lg italic">V</span>
                      </div>
                      <span className="text-xl font-bold font-outfit tracking-tight text-white uppercase">VN STUDIO</span>
                    </div>
                    <p className="text-slate-500 text-sm sm:text-base max-w-sm leading-relaxed">
                      The leading marketplace for high-performance VN reel templates. Helping creators go viral with professional grade editing tools since 2024.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-4 sm:mb-6">Marketplace</h4>
                    <ul className="space-y-3 sm:space-y-4 text-slate-500 text-sm">
                      <li><a href="#" className="hover:text-pink-500 transition-colors">Latest Templates</a></li>
                      <li><a href="#" className="hover:text-pink-500 transition-colors">Popular Packs</a></li>
                      <li><a href="#" className="hover:text-pink-500 transition-colors">Free Assets</a></li>
                      <li><a href="#" className="hover:text-pink-500 transition-colors">Creator Program</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-4 sm:mb-6">Connect</h4>
                    <ul className="space-y-3 sm:space-y-4 text-slate-500 text-sm">
                      <li><a href="#" className="hover:text-pink-500 transition-colors">Instagram</a></li>
                      <li><a href="#" className="hover:text-pink-500 transition-colors">TikTok</a></li>
                      <li><a href="#" className="hover:text-pink-500 transition-colors">Discord Community</a></li>
                      <li><a href="#" className="hover:text-pink-500 transition-colors">Support Center</a></li>
                    </ul>
                  </div>
                </div>
                <div className="pt-8 sm:pt-12 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-6">
                  <p className="text-slate-600 text-[10px] sm:text-xs text-center md:text-left">
                    © 2024 VN Reel Studio. All rights reserved. Designed for the next generation of creators.
                  </p>
                  <div className="flex gap-6 sm:gap-8">
                    <a href="#" className="text-slate-600 hover:text-white transition-colors text-[10px] sm:text-xs">Privacy Policy</a>
                    <a href="#" className="text-slate-600 hover:text-white transition-colors text-[10px] sm:text-xs">Terms of Service</a>
                  </div>
                </div>
              </div>
            </footer>
          </Section>
        </main>
      )}

      {selectedTemplate && (
        <TemplateModal 
          template={selectedTemplate} 
          onClose={() => setSelectedTemplate(null)} 
          onAddToCart={addToCart}
          onBuyNow={selectedTemplate.price === 0 ? handleGetFree : handleBuyNow}
        />
      )}

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart} 
        onRemove={removeFromCart}
        onCheckout={handleProceedToCheckout}
      />

      {isAuthOpen && (
        <AuthModal 
          onClose={() => setIsAuthOpen(false)} 
          onAuthSuccess={(u) => {
            setUser(u);
            setIsAuthOpen(false);
          }}
        />
      )}

      {isGuideOpen && (
        <GuideModal onClose={() => setIsGuideOpen(false)} />
      )}

      {isAdminOpen && (
        <AdminPanel 
          onClose={() => setIsAdminOpen(false)} 
          templates={templates} 
          onAddTemplate={handleAddTemplate} 
          onRemoveTemplate={handleRemoveTemplate}
        />
      )}
    </div>
  );
};

export default App;
