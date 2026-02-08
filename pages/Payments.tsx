
import React, { useState } from 'react';
import { useApp } from '../App';
import { Payment, PaymentMethod } from '../types';
import { supabase } from '../lib/supabase';
import { Plus, Trash2, FileText, CreditCard, Calendar, User, DollarSign, X } from 'lucide-react';

const Payments: React.FC = () => {
  const { language, payments, clients, refreshData } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<any>({ 
    clientId: '',
    method: 'bKash', 
    status: 'সম্পন্ন', 
    amount: 0, 
    date: new Date().toISOString().split('T')[0],
    details: ''
  });

  const methods: PaymentMethod[] = ['bKash', 'Nagad', 'Rocket', 'Upay', 'Bank Account', 'Credit Card', 'Debit Card'];

  const handleSave = async () => {
    if (!formData.clientId || !formData.amount) {
      alert(language === 'bn' ? 'অনুগ্রহ করে ক্লায়েন্ট এবং টাকার পরিমাণ দিন' : 'Please select a client and amount');
      return;
    }
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    setIsSaving(true);
    try {
      const payload = { 
        clientId: formData.clientId,
        amount: Number(formData.amount),
        date: formData.date,
        method: formData.method,
        status: formData.status,
        details: formData.details || '',
        user_id: session.user.id
      };

      if (editingPayment) {
        const { error } = await supabase.from('payments').update(payload).eq('id', editingPayment.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('payments').insert([payload]);
        if (error) throw error;
      }

      await refreshData();
      setShowModal(false);
      setEditingPayment(null);
    } catch (err: any) {
      alert("Error saving payment: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm(language === 'bn' ? 'আপনি কি নিশ্চিত?' : 'Are you sure?')) {
      await supabase.from('payments').delete().eq('id', id);
      await refreshData();
    }
  };

  return (
    <div className="p-6 md:p-10 lg:p-14 space-y-10 max-w-[1600px] mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-1">
          <h1 className={`text-3xl md:text-4xl font-black text-slate-800 tracking-tight ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
            {language === 'en' ? 'Financial Records' : 'পেমেন্ট ট্রানজ্যাকশন'}
          </h1>
          <p className="text-slate-400 text-sm font-medium font-bengali">সব ধরণের ইনকাম এবং পেমেন্ট ট্র্যাকিং</p>
        </div>
        <button onClick={() => { setEditingPayment(null); setFormData({ clientId: '', method: 'bKash', status: 'সম্পন্ন', amount: 0, date: new Date().toISOString().split('T')[0], details: '' }); setShowModal(true); }} className="bg-[#007E6E] text-white px-8 py-3.5 rounded-2xl font-black shadow-2xl shadow-[#007E6E]/20 hover:brightness-110 active:scale-95 transition-all text-sm flex items-center gap-3">
          <Plus size={20} /> {language === 'bn' ? 'পেমেন্ট রেকর্ড করুন' : 'Record Payment'}
        </button>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[900px]">
             <thead className="bg-slate-50/50 text-slate-400 font-black uppercase text-[10px] tracking-[0.2em] font-english">
               <tr>
                 <th className="px-10 py-6">Client Name</th>
                 <th className="px-10 py-6">Transaction Date</th>
                 <th className="px-10 py-6">Method</th>
                 <th className="px-10 py-6 text-right">Amount</th>
                 <th className="px-10 py-6 text-center">Status</th>
                 <th className="px-10 py-6 text-center">Action</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-50 font-english">
               {payments.length === 0 ? (
                 <tr><td colSpan={6} className="px-10 py-20 text-center text-slate-300 font-bold uppercase tracking-widest">No payments recorded yet.</td></tr>
               ) : payments.map(p => {
                 const client = clients.find(c => c.id === p.clientId);
                 return (
                   <tr key={p.id} className="hover:bg-slate-50/30 transition-all group">
                     <td className="px-10 py-8">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center font-black">{client?.name[0]}</div>
                           <div className={`font-black text-slate-700 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>{client?.name || 'Unknown'}</div>
                        </div>
                     </td>
                     <td className="px-10 py-8 text-slate-500 font-medium">
                        <div className="flex items-center gap-2">
                           <Calendar size={14} className="text-[#007E6E]/40" />
                           {p.date}
                        </div>
                     </td>
                     <td className="px-10 py-8">
                        <span className="px-3 py-1.5 bg-slate-50 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest">{p.method}</span>
                     </td>
                     <td className="px-10 py-8 text-right font-black text-[#007E6E] text-lg">৳{p.amount.toLocaleString()}</td>
                     <td className="px-10 py-8 text-center">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${p.status === 'সম্পন্ন' ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100' : 'bg-amber-50 text-amber-600 ring-1 ring-amber-100'}`}>
                           {p.status}
                        </span>
                     </td>
                     <td className="px-10 py-8">
                        <div className="flex justify-center gap-2">
                           <button onClick={() => { setEditingPayment(p); setFormData(p); setShowModal(true); }} className="p-2.5 text-slate-300 hover:text-[#007E6E] bg-slate-50 rounded-xl transition-all"><FileText size={16} /></button>
                           <button onClick={() => handleDelete(p.id)} className="p-2.5 text-slate-300 hover:text-rose-500 bg-slate-50 rounded-xl transition-all"><Trash2 size={16} /></button>
                        </div>
                     </td>
                   </tr>
                 );
               })}
             </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl rounded-[3rem] p-10 md:p-14 shadow-premium relative">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl md:text-3xl font-black text-slate-800 font-bengali tracking-tight">
                 {editingPayment ? 'পেমেন্ট এডিট' : 'নতুন পেমেন্ট রেকর্ড'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-3 text-slate-300 hover:text-rose-500 bg-slate-50 rounded-2xl transition-all"><X size={24} /></button>
            </div>
            
            <div className="space-y-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 block">Client</label>
                  <select value={formData.clientId} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-[#007E6E]/5 transition-all font-english font-bold text-slate-700" onChange={e => setFormData({...formData, clientId: e.target.value})}>
                     <option value="">Select Client</option>
                     {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
               </div>
               
               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 block">Amount (৳)</label>
                    <input type="number" placeholder="0.00" value={formData.amount || ''} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-[#007E6E]/5 transition-all font-english font-bold text-slate-700" onChange={e => setFormData({...formData, amount: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 block">Payment Date</label>
                    <input type="date" value={formData.date} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white transition-all font-english font-bold text-slate-700" onChange={e => setFormData({...formData, date: e.target.value})} />
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 block">Payment Method</label>
                    <select value={formData.method} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white transition-all font-english font-bold text-slate-700" onChange={e => setFormData({...formData, method: e.target.value})}>
                       {methods.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 block">Status</label>
                    <select value={formData.status} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white transition-all font-english font-bold text-slate-700" onChange={e => setFormData({...formData, status: e.target.value})}>
                       <option value="সম্পন্ন">Done (সম্পন্ন)</option>
                       <option value="পেন্ডিং">Pending (পেন্ডিং)</option>
                    </select>
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 block">Notes / Reference</label>
                  <input type="text" placeholder="Transaction ID, Bill Ref..." value={formData.details} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white transition-all font-english font-bold text-slate-700" onChange={e => setFormData({...formData, details: e.target.value})} />
               </div>
            </div>
            
            <div className="flex gap-5 mt-12 relative">
              <button onClick={() => setShowModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all">বাতিল</button>
              <button 
                onClick={handleSave} 
                disabled={isSaving}
                className="flex-1 py-4 bg-gradient-to-r from-[#007E6E] to-[#00524a] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-[#007E6E]/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {isSaving ? <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"></div> : 'সংরক্ষণ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
