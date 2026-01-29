
import React, { useState } from 'react';
import { CartItem } from '../types';

interface CheckoutProps {
  items: CartItem[];
  onClose: () => void;
  onSuccess: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ items, onClose, onSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'paypal'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const total = items.reduce((acc, item) => acc + item.price, 0);

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button onClick={onClose} className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to Templates
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left: Payment Form */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 md:p-10">
            <h2 className="text-2xl font-outfit font-bold text-white mb-8">Payment Methods</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              <button 
                onClick={() => setPaymentMethod('card')}
                className={`flex flex-col items-center gap-3 p-6 rounded-3xl border transition-all ${paymentMethod === 'card' ? 'bg-pink-500/10 border-pink-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span className="font-bold text-sm">Credit Card</span>
              </button>
              
              <button 
                onClick={() => setPaymentMethod('upi')}
                className={`flex flex-col items-center gap-3 p-6 rounded-3xl border transition-all ${paymentMethod === 'upi' ? 'bg-pink-500/10 border-pink-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
              >
                <div className="h-8 flex items-center justify-center font-black italic text-xl">UPI</div>
                <span className="font-bold text-sm">UPI Payment</span>
              </button>

              <button 
                onClick={() => setPaymentMethod('paypal')}
                className={`flex flex-col items-center gap-3 p-6 rounded-3xl border transition-all ${paymentMethod === 'paypal' ? 'bg-pink-500/10 border-pink-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
              >
                <div className="h-8 flex items-center justify-center font-black italic text-xl">PayPal</div>
                <span className="font-bold text-sm">PayPal</span>
              </button>
            </div>

            <form onSubmit={handlePay} className="space-y-6">
              {paymentMethod === 'card' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Card Holder Name</label>
                    <input required type="text" placeholder="John Doe" className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-pink-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Card Number</label>
                    <input required type="text" placeholder="XXXX XXXX XXXX XXXX" className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-pink-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Expiry Date</label>
                      <input required type="text" placeholder="MM/YY" className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-pink-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">CVV</label>
                      <input required type="password" placeholder="***" className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-pink-500" />
                    </div>
                  </div>
                </>
              )}

              {paymentMethod === 'upi' && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">UPI ID</label>
                  <input required type="text" placeholder="username@upi" className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-pink-500" />
                </div>
              )}

              {paymentMethod === 'paypal' && (
                <div className="p-6 bg-slate-800/50 rounded-2xl text-center text-slate-400">
                  You will be redirected to PayPal to complete your purchase safely.
                </div>
              )}

              <button 
                disabled={isProcessing}
                className="w-full py-5 bg-gradient-to-r from-pink-500 to-violet-600 text-white font-bold rounded-2xl shadow-xl shadow-pink-500/20 hover:scale-[1.01] transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Processing Securely...
                  </>
                ) : (
                  `Pay $${total.toFixed(2)} Now`
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right: Summary */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8">
            <h3 className="text-xl font-outfit font-bold text-white mb-6">Order Summary</h3>
            <div className="space-y-4 mb-8">
              {items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-slate-400 font-light truncate max-w-[150px]">{item.name}</span>
                  <span className="text-white font-bold">${item.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="space-y-2 pt-6 border-t border-slate-800 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Subtotal</span>
                <span className="text-slate-200">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Platform Fee</span>
                <span className="text-slate-200">$0.00</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-2">
              <span className="text-white font-bold">Total Payable</span>
              <span className="text-3xl font-black font-outfit gradient-text">${total.toFixed(2)}</span>
            </div>
            
            <p className="text-[10px] text-slate-500 leading-tight">
              By clicking "Pay Now", you agree to our terms of service and digital distribution policy.
            </p>
          </div>

          <div className="glass rounded-3xl p-6 border border-slate-800 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center text-green-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <p className="text-white font-bold text-sm">Secure Checkout</p>
              <p className="text-slate-400 text-xs">256-bit SSL Encryption</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
