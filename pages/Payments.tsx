
import React, { useState } from 'react';
import { useApp } from '../App';
import { Payment, PaymentMethod } from '../types';

const Payments: React.FC = () => {
  const { language, payments, setPayments, clients } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [formData, setFormData] = useState<Partial<Payment>>({ method: 'bKash', status: 'সম্পন্ন', amount: 0 });

  const methods: PaymentMethod[] = ['bKash', 'Nagad', 'Rocket', 'Upay', 'Bank Account', 'Credit Card', 'Debit Card'];

  const handleSave = () => {
    if (!formData.clientId || !formData.amount) return;
    if (editingPayment) {
      setPayments(payments.map(p => p.id === editingPayment.id ? { ...p, ...formData } as Payment : p));
    } else {
      const payment: Payment = {
        ...formData as Payment,
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toISOString().split('T')[0],
      };
      setPayments([...payments, payment]);
    }
    setShowModal(false);
    setEditingPayment(null);
  };

  const handleEdit = (p: Payment) => {
    setEditingPayment(p);
    setFormData(p);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm(language === 'bn' ? 'নিশ্চিত?' : 'Are you sure?')) {
      setPayments(payments.filter(p => p.id !== id));
    }
  };

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-[1600px] mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className={`text-3xl font-bold text-slate-800 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
            {language === 'en' ? 'Payments' : 'পেমেন্ট'}
          </h1>
          <p className={`text-slate-500 text-sm ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
            {language === 'bn' ? 'সব পেমেন্ট ট্রানজ্যাকশন ম্যানেজ করুন' : 'Manage all payment transactions'}
          </p>
        </div>
        <button onClick={() => { setEditingPayment(null); setFormData({ method: 'bKash', status: 'সম্পন্ন' }); setShowModal(true); }} className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg hover:bg-emerald-700 transition-all">
          {language === 'bn' ? 'পেমেন্ট যুক্ত করুন' : 'Add Payment'}
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-sm min-w-[900px]">
           <thead className="bg-slate-50/50 text-slate-400 font-bold uppercase text-[10px] tracking-widest font-english">
             <tr>
               <th className="px-8 py-5">Client</th>
               <th className="px-8 py-5">Amount</th>
               <th className="px-8 py-5">Date</th>
               <th className="px-8 py-5">Method</th>
               <th className="px-8 py-5">Details</th>
               <th className="px-8 py-5">Status</th>
               <th className="px-8 py-5 text-center">Actions</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-slate-50">
             {payments.map(p => {
               const client = clients.find(c => c.id === p.clientId);
               return (
                 <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                   <td className="px-8 py-5">
                      <div className="font-bold text-slate-700">{client?.name || 'Unknown'}</div>
                      <div className="text-[10px] text-slate-400 font-english">{client?.phone}</div>
                   </td>
                   <td className="px-8 py-5 font-bold text-indigo-600 font-english">৳{p.amount.toLocaleString()}</td>
                   <td className="px-8 py-5 text-slate-500 font-english">{p.date}</td>
                   <td className="px-8 py-5">
                      <span className="px-2 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-600">{p.method}</span>
                   </td>
                   <td className="px-8 py-5 text-slate-500 font-english">{p.details}</td>
                   <td className="px-8 py-5">
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${p.status === 'সম্পন্ন' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{p.status}</span>
                   </td>
                   <td className="px-8 py-5 text-center flex justify-center gap-2">
                     <button onClick={() => handleEdit(p)} className="p-1.5 text-slate-400 hover:text-indigo-600 bg-slate-50 rounded-lg"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                     <button onClick={() => handleDelete(p.id)} className="p-1.5 text-slate-400 hover:text-rose-600 bg-slate-50 rounded-lg"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                   </td>
                 </tr>
               );
             })}
           </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl">
            <h2 className={`text-2xl font-bold mb-6 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>{editingPayment ? 'পেমেন্ট এডিট' : 'নতুন পেমেন্ট'}</h2>
            <div className="space-y-4">
               <select value={formData.clientId} className={`w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none ${language === 'bn' ? 'font-bengali' : 'font-english'}`} onChange={e => setFormData({...formData, clientId: e.target.value})}>
                 <option value="">Select Client</option>
                 {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
               </select>
               <input type="number" placeholder="Amount" value={formData.amount || ''} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none font-english" onChange={e => setFormData({...formData, amount: Number(e.target.value)})} />
               <select value={formData.method} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none font-english" onChange={e => setFormData({...formData, method: e.target.value as PaymentMethod, details: ''})}>
                 {methods.map(m => <option key={m} value={m}>{m}</option>)}
               </select>
               
               {/* Dynamic Fields Based on Method */}
               {(formData.method === 'bKash' || formData.method === 'Nagad' || formData.method === 'Rocket' || formData.method === 'Upay') && (
                 <input type="text" placeholder="Mobile Number" value={formData.details || ''} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none font-english" onChange={e => setFormData({...formData, details: e.target.value})} />
               )}
               {formData.method === 'Bank Account' && (
                 <div className="space-y-4">
                   <input type="text" placeholder="Bank Name & A/C No" value={formData.details || ''} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none font-english" onChange={e => setFormData({...formData, details: e.target.value})} />
                 </div>
               )}
               {(formData.method === 'Credit Card' || formData.method === 'Debit Card') && (
                 <div className="space-y-4">
                   <input type="text" placeholder="Card Number (Last 4 digits)" value={formData.details || ''} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none font-english" onChange={e => setFormData({...formData, details: e.target.value})} />
                 </div>
               )}

               <select value={formData.status} className={`w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none ${language === 'bn' ? 'font-bengali' : 'font-english'}`} onChange={e => setFormData({...formData, status: e.target.value as any})}>
                 <option value="সম্পন্ন">{language === 'bn' ? 'সম্পন্ন' : 'Success'}</option>
                 <option value="পেন্ডিং">{language === 'bn' ? 'পেন্ডিং' : 'Pending'}</option>
                 <option value="ব্যর্থ">{language === 'bn' ? 'ব্যর্থ' : 'Failed'}</option>
               </select>
            </div>
            <div className="flex gap-4 mt-8">
              <button onClick={() => setShowModal(false)} className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold">Cancel</button>
              <button onClick={handleSave} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold">Save Payment</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
