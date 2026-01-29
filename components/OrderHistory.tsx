
import React from 'react';
import { Order } from '../types';

interface OrderHistoryProps {
  orders: Order[];
  onBack: () => void;
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ orders, onBack }) => {
  const getBarcodeUrl = (code: string) => {
    // Using bwip-js API to generate a clean Code128 barcode
    return `https://bwipjs-api.metafloor.com/?bcid=code128&text=${encodeURIComponent(code)}&scale=3&rotate=N&includetext&backgroundcolor=ffffff`;
  };

  const downloadBarcode = (code: string, name: string) => {
    const url = getBarcodeUrl(code);
    const link = document.createElement('a');
    link.href = url;
    link.download = `VN-Barcode-${name.replace(/\s+/g, '-')}.png`;
    link.target = '_blank';
    link.click();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-4xl font-outfit font-bold text-white mb-2">Order <span className="gradient-text">History</span></h2>
          <p className="text-slate-400">View your purchased templates and scan barcodes to import.</p>
        </div>
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 glass text-white rounded-xl hover:bg-white/10 transition-all border border-slate-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Shop
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-24 glass rounded-[3rem] border-dashed border-2 border-slate-800">
          <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-white mb-2">No orders yet</p>
          <p className="text-slate-500 mb-8 max-w-xs mx-auto">Once you purchase templates, their barcodes will appear here.</p>
          <button 
            onClick={onBack}
            className="px-10 py-4 bg-gradient-to-r from-pink-500 to-violet-600 text-white font-bold rounded-2xl"
          >
            Start Browsing
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div key={order.id} className="glass rounded-[2rem] overflow-hidden border border-slate-800 hover:border-slate-700 transition-all">
              <div className="p-6 md:p-8 bg-slate-900/50 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Order ID: {order.id}</p>
                  <p className="text-white font-medium">{order.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total Amount</p>
                  <p className="text-2xl font-black font-outfit text-white">${order.total.toFixed(2)}</p>
                </div>
              </div>

              <div className="p-6 md:p-8 space-y-6">
                {order.items.map((item) => (
                  <div key={`${order.id}-${item.id}`} className="flex flex-col lg:flex-row lg:items-center gap-8 p-6 rounded-3xl bg-slate-950/50 border border-slate-800/50">
                    <div className="flex items-center gap-6 flex-1 min-w-0">
                      <div className="w-20 h-28 bg-slate-800 rounded-xl overflow-hidden flex-shrink-0 shadow-lg">
                        <img src={item.thumbnailUrl} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-bold text-xl mb-1 truncate">{item.name}</h4>
                        <p className="text-slate-400 text-sm font-light mb-2">Category: {item.category}</p>
                        <div className="flex flex-wrap gap-2">
                          {item.tags?.slice(0, 3).map(tag => (
                            <span key={tag} className="text-[9px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full uppercase font-bold">#{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center lg:items-end gap-4 flex-shrink-0">
                      <div className="text-center lg:text-right">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] block mb-3">Scan in VN Editor</span>
                        <div className="bg-white p-3 rounded-2xl shadow-2xl shadow-white/5 inline-block">
                           <img 
                            src={getBarcodeUrl(item.templateCode)} 
                            alt={`Barcode for ${item.name}`}
                            className="h-16 w-auto min-w-[180px] object-contain"
                          />
                        </div>
                      </div>
                      <button 
                        onClick={() => downloadBarcode(item.templateCode, item.name)}
                        className="flex items-center gap-2 text-xs font-bold text-pink-500 hover:text-pink-400 transition-colors bg-pink-500/10 px-4 py-2 rounded-xl border border-pink-500/20"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download Barcode
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
