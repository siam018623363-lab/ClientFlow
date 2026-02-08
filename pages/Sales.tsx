
import React, { useState } from 'react';
import { useApp } from '../App';
import { Sale } from '../types';
import { supabase } from '../lib/supabase';
import { Trash2, Plus, DollarSign, Calendar, Edit2, X, Tag } from 'lucide-react';

const Sales: React.FC = () => {
  const { language, sales, clients, projects, refreshData } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<any>({ 
    status: 'পরিশোধিত', 
    amount: 0, 
    date: new Date().toISOString().split('T')[0],
    clientId: '',
    projectId: ''
  });

  const handleOpenModal = (sale: Sale | null = null) => {
    if (sale) {
      setEditingSale(sale);
      setFormData({
        clientId: sale.clientId,
        projectId: sale.projectId || '',
        amount: sale.amount,
        date: sale.date,
        status: sale.status
      });
    } else {
      setEditingSale(null);
      setFormData({ 
        status: 'পরিশোধিত', 
        amount: 0, 
        date: new Date().toISOString().split('T')[0],
        clientId: '',
        projectId: ''
      });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.clientId || !formData.amount) {
      alert(language === 'bn' ? 'অনুগ্রহ করে ক্লায়েন্ট এবং টাকার পরিমাণ দিন' : 'Please provide client and amount');
      return;
    }
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    setIsSaving(true);
    try {
      const payload = { 
        clientId: formData.clientId,
        projectId: formData.projectId || null,
        amount: Number(formData.amount),
        date: formData.date,
        status: formData.status,
        user_id: session.user.id
      };
      
      if (editingSale) {
        const { error } = await supabase.from('sales').update(payload).eq('id', editingSale.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('sales').insert([payload]);
        if (error) throw error;
      }
      
      await refreshData();
      setShowModal(false);
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm(language === 'bn' ? 'আপনি কি নিশ্চিত?' : 'Are you sure?')) {
      const { error } = await supabase.from('sales').delete().eq('id', id);
      if (error) {
        alert(error.message);
      } else {
        await refreshData();
      }
    }
  };

  return (
    <div className="p-6 md:p-10 lg:p-14 space-y-10 max-w-[1600px] mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-1">
          <h1 className={`text-3xl md:text-4xl font-black text-slate-800 tracking-tight ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
            {language === 'en' ? 'Sales Tracking' : 'বিক্রয় রেকর্ড'}
          </h1>
          <p className="text-slate-400 text-sm font-medium font-bengali">আপনার সব আয়ের হিসাব ও পেমেন্ট স্ট্যাটাস ট্র্যাকার</p>
        </div>
        <button onClick={() => handleOpenModal()} className="bg-[#007E6E] text-white px-8 py-3.5 rounded-2xl font-black shadow-2xl shadow-[#007E6E]/20 hover:brightness-110 active:scale-95 transition-all text-sm flex items-center gap-3">
          <Plus size={20} /> {language === 'bn' ? 'নতুন বিক্রয় যোগ' : 'Record New Sale'}
        </button>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[900px]">
            <thead className="bg-slate-50/50 text-slate-400 font-black uppercase text-[10px] tracking-[0.2em] font-english">
              <tr>
                <th className="px-10 py-6">Date</th>
                <th className="px-10 py-6">Client & Project</th>
                <th className="px-10 py-6 text-right">Amount</th>
                <th className="px-10 py-6 text-center">Status</th>
                <th className="px-10 py-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-english">
              {sales.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-10 py-20 text-center text-slate-300 font-bold uppercase tracking-widest">No sales records found.</td>
                </tr>
              ) : sales.map(s => {
                const client = clients.find(c => c.id === s.clientId);
                const project = projects.find(p => p.id === s.projectId);
                return (
                  <tr key={s.id} className="hover:bg-slate-50/30 transition-all group">
                    <td className="px-10 py-8 text-slate-500 font-medium">{s.date}</td>
                    <td className="px-10 py-8">
                       <div>
                          <div className={`font-black text-slate-800 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>{client?.name || 'Deleted Client'}</div>
                          <div className={`text-[10px] font-black text-[#007E6E] uppercase tracking-widest mt-1 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
                             {project?.name || 'General Sale'}
                          </div>
                       </div>
                    </td>
                    <td className="px-10 py-8 text-right font-black text-slate-800 text-lg">৳{s.amount.toLocaleString()}</td>
                    <td className="px-10 py-8 text-center">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ring-1 ${
                        s.status === 'পরিশোধিত' ? 'bg-emerald-50 text-emerald-600 ring-emerald-100' : 
                        s.status === 'পেন্ডিং' ? 'bg-amber-50 text-amber-600 ring-amber-100' : 
                        'bg-rose-50 text-rose-600 ring-rose-100'
                      } ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-10 py-8 text-center">
                       <div className="flex justify-center gap-2">
                          <button onClick={() => handleOpenModal(s)} className="p-2.5 text-slate-300 hover:text-[#007E6E] bg-slate-50 rounded-xl transition-all"><Edit2 size={16} /></button>
                          <button onClick={() => handleDelete(s.id)} className="p-2.5 text-slate-300 hover:text-rose-600 bg-slate-50 rounded-xl transition-all"><Trash2 size={16} /></button>
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
                 {editingSale ? 'বিক্রয় এডিট' : 'নতুন বিক্রয় রেকর্ড'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-3 text-slate-300 hover:text-rose-500 bg-slate-50 rounded-2xl transition-all"><X size={24} /></button>
            </div>
            
            <div className="space-y-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 block font-bengali">ক্লায়েন্ট সিলেক্ট করুন</label>
                  <select className={`w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-[#007E6E]/5 transition-all font-bold text-slate-700 ${language === 'bn' ? 'font-bengali' : 'font-english'}`} value={formData.clientId} onChange={e => setFormData({...formData, clientId: e.target.value})}>
                    <option value="">Select Client</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 block font-bengali">প্রজেক্ট (ঐচ্ছিক)</label>
                  <select className={`w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-[#007E6E]/5 transition-all font-bold text-slate-700 ${language === 'bn' ? 'font-bengali' : 'font-english'}`} value={formData.projectId} onChange={e => setFormData({...formData, projectId: e.target.value})}>
                    <option value="">General / No Project</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
               </div>
               
               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 block font-bengali">টাকার পরিমাণ (৳)</label>
                    <div className="relative">
                       <DollarSign size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" />
                       <input type="number" placeholder="5000" className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-[#007E6E]/5 transition-all font-english font-bold text-slate-700" value={formData.amount || ""} onChange={e => setFormData({...formData, amount: Number(e.target.value)})} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 block font-bengali">তারিখ</label>
                    <input type="date" value={formData.date} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white transition-all font-english font-bold text-slate-700" onChange={e => setFormData({...formData, date: e.target.value})} />
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 block font-bengali">পেমেন্ট স্ট্যাটাস</label>
                  <div className="grid grid-cols-3 gap-3">
                     {['পরিশোধিত', 'পেন্ডিং', 'বাকি'].map(st => (
                        <button 
                           key={st}
                           onClick={() => setFormData({...formData, status: st})}
                           className={`py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${
                              formData.status === st 
                              ? 'bg-[#007E6E] text-white border-[#007E6E] shadow-lg shadow-[#007E6E]/20' 
                              : 'bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100'
                           } ${language === 'bn' ? 'font-bengali' : 'font-english'}`}
                        >
                           {st}
                        </button>
                     ))}
                  </div>
               </div>
            </div>

            <div className="flex gap-5 mt-12 relative">
              <button onClick={() => setShowModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all font-bengali">বাতিল</button>
              <button 
                onClick={handleSave} 
                disabled={isSaving}
                className="flex-1 py-4 bg-gradient-to-r from-[#007E6E] to-[#00524a] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-[#007E6E]/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 font-bengali"
              >
                {isSaving ? <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"></div> : 'সংরক্ষণ করুন'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;
