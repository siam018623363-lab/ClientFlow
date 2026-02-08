
import React, { useState } from 'react';
import { useApp } from '../App';
import { Payment, PaymentMethod } from '../types';
import { supabase } from '../lib/supabase';
import { Plus, Trash2, FileText, Calendar, User, DollarSign, X } from 'lucide-react';

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
    <div className="p-4 md:p-10 lg:p-14 space-y-6 md:space-y-10 max-w-full mx-auto animate-fade-in overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className={`text-xl md:text-4xl font-black text-slate-800 tracking-tight ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
            {language === 'en' ? 'Financial Records' : 'পেমেন্ট ট্রানজ্যাকশন'}
          </h1>
          <p className="text-slate-400 text-[10px] md:text-sm font-medium font-bengali">সব ধরণের ইনকাম এবং পেমেন্ট ট্র্যাকিং</p>
        </div>
        <button onClick={() => { setEditingPayment(null); setFormData({ clientId: '', method: 'bKash', status: 'সম্পন্ন', amount: 0, date: new Date().toISOString().split('T')[0], details: '' }); setShowModal(true); }} className="w-full sm:w-auto bg-[#007E6E] text-white px-6 py-2.5 rounded-xl font-black shadow-lg hover:brightness-110 active:scale-95 transition-all text-xs flex items-center justify-center gap-2">
          <Plus size={16} /> {language === 'bn' ? 'পেমেন্ট রেকর্ড' : 'Record Payment'}
        </button>
      </div>

      <div className="bg-white rounded-[1.5rem] md:rounded-[3rem] border border-slate-50 shadow-premium overflow-hidden w-full">
        <div className="overflow-x-auto w-full scrollbar-hide">
          <table className="w-full text-left text-[11px] md:text-sm min-w-[650px]">
             <thead className="bg-slate-50/50 text-slate-400 font-black uppercase text-[8px] md:text-[10px] tracking-widest font-english">
               <tr>
                 <th className="px-6 md:px-10 py-4 md:py-6">Client Name</th>
                 <th className="px-6 md:px-10 py-4 md:py-6">Date</th>
                 <th className="px-6 md:px-10 py-4 md:py-6">Method</th>
                 <th className="px-6 md:px-10 py-4 md:py-6 text-right">Amount</th>
                 <th className="px-6 md:px-10 py-4 md:py-6 text-center">Status</th>
                 <th className="px-6 md:px-10 py-4 md:py-6 text-center">Action</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-50 font-english">
               {payments.length === 0 ? (
                 <tr><td colSpan={6} className="px-10 py-16 text-center text-slate-300 font-bold uppercase tracking-widest">No payments found.</td></tr>
               ) : payments.map(p => {
                 const client = clients.find(c => c.id === p.clientId);
                 return (
                   <tr key={p.id} className="hover:bg-slate-50/30 transition-all">
                     <td className="px-6 md:px-10 py-5 md:py-8">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 md:w-10 md:h-10 bg-[#007E6E]/5 text-[#007E6E] rounded-lg flex items-center justify-center font-black text-xs">{client?.name[0]}</div>
                           <div className={`font-black text-slate-700 truncate max-w-[120px] ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>{client?.name || 'Unknown'}</div>
                        </div>
                     </td>
                     <td className="px-6 md:px-10 py-5 md:py-8 text-slate-500 font-medium whitespace-nowrap">
                        {p.date}
                     </td>
                     <td className="px-6 md:px-10 py-5 md:py-8">
                        <span className="px-2 py-1 bg-slate-50 text-slate-500 rounded-lg text-[8px] md:text-[10px] font-black uppercase tracking-widest">{p.method}</span>
                     </td>
                     <td className="px-6 md:px-10 py-5 md:py-8 text-right font-black text-slate-800 text-sm md:text-lg">৳{p.amount.toLocaleString()}</td>
                     <td className="px-6 md:px-10 py-5 md:py-8 text-center">
                        <span className={`px-3 py-1 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest ${p.status === 'সম্পন্ন' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                           {p.status}
                        </span>
                     </td>
                     <td className="px-6 md:px-10 py-5 md:py-8">
                        <div className="flex justify-center gap-1.5 md:gap-2">
                           <button onClick={() => { setEditingPayment(p); setFormData(p); setShowModal(true); }} className="p-2 text-slate-300 hover:text-[#007E6E] bg-slate-50 rounded-lg transition-all"><FileText size={14} /></button>
                           <button onClick={() => handleDelete(p.id)} className="p-2 text-slate-300 hover:text-rose-600 bg-slate-50 rounded-lg transition-all"><Trash2 size={14} /></button>
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
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl rounded-[2rem] p-8 md:p-14 shadow-premium relative max-h-[90vh] overflow-y-auto scrollbar-hide">
            <div className="flex justify-between items-center mb-6 md:mb-10">
              <h2 className="text-xl md:text-2xl font-black text-slate-800 font-bengali">
                 {editingPayment ? 'পেমেন্ট এডিট' : 'নতুন পেমেন্ট রেকর্ড'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 text-slate-300 hover:text-rose-500 bg-slate-50 rounded-xl"><X size={20} /></button>
            </div>
            
            <div className="space-y-4 md:space-y-6">
               <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 block font-bengali">ক্লায়েন্ট</label>
                  <select value={formData.clientId} className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm font-bold text-slate-700" onChange={e => setFormData({...formData, clientId: e.target.value})}>
                     <option value="">Select Client</option>
                     {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
               </div>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 block font-bengali">টাকার পরিমাণ (৳)</label>
                    <input type="number" placeholder="0.00" value={formData.amount || ''} className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm font-bold text-slate-700 font-english" onChange={e => setFormData({...formData, amount: e.target.value})} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 block font-bengali">তারিখ</label>
                    <input type="date" value={formData.date} className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm font-bold text-slate-700" onChange={e => setFormData({...formData, date: e.target.value})} />
                  </div>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 block font-bengali">পেমেন্ট মেথড</label>
                    <select value={formData.method} className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm font-bold text-slate-700" onChange={e => setFormData({...formData, method: e.target.value})}>
                       {methods.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 block font-bengali">স্ট্যাটাস</label>
                    <select value={formData.status} className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm font-bold text-slate-700" onChange={e => setFormData({...formData, status: e.target.value})}>
                       <option value="সম্পন্ন">Done (সম্পন্ন)</option>
                       <option value="পেন্ডিং">Pending (পেন্ডিং)</option>
                    </select>
                  </div>
               </div>

               <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 block font-bengali">নোট / রেফারেন্স</label>
                  <input type="text" placeholder="Transaction ID..." value={formData.details} className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm font-bold text-slate-700" onChange={e => setFormData({...formData, details: e.target.value})} />
               </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 mt-8 md:mt-12">
              <button onClick={() => setShowModal(false)} className="w-full py-3 bg-slate-50 text-slate-500 rounded-xl font-black text-xs uppercase tracking-widest order-2 sm:order-1">বাতিল</button>
              <button 
                onClick={handleSave} 
                disabled={isSaving}
                className="w-full py-3 bg-[#007E6E] text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg order-1 sm:order-2 transition-all active:scale-95"
              >
                {isSaving ? 'Saving...' : 'সংরক্ষণ করুন'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
