
import React from 'react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: string) => void;
  onCheckout: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, items, onRemove, onCheckout }) => {
  const subtotal = items.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className={`absolute right-0 top-0 h-full w-full max-w-md bg-slate-900 shadow-2xl border-l border-slate-800 transition-transform duration-500 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-2xl font-bold font-outfit text-white">Your Cart</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-40">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className="text-lg">Your cart is empty</p>
              <button onClick={onClose} className="mt-4 text-pink-500 font-bold hover:underline">Continue Shopping</button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 group">
                <div className="w-20 h-28 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0">
                  <img src={item.thumbnailUrl} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold truncate">{item.name}</h3>
                  <p className="text-slate-500 text-xs mb-2">Category: {item.category}</p>
                  <p className="text-pink-500 font-bold font-outfit">${item.price.toFixed(2)}</p>
                </div>
                <button 
                  onClick={() => onRemove(item.id)}
                  className="p-2 h-fit text-slate-500 hover:text-red-500 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 bg-slate-800/50 border-t border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <span className="text-slate-400">Subtotal</span>
              <span className="text-2xl font-bold font-outfit text-white">${subtotal.toFixed(2)}</span>
            </div>
            <button 
              onClick={onCheckout}
              className="w-full py-4 bg-gradient-to-r from-pink-500 to-violet-600 text-white font-bold rounded-2xl shadow-xl shadow-pink-500/20 hover:scale-[1.02] transition-all active:scale-95"
            >
              Checkout Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
