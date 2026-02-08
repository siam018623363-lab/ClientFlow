
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
    <div className="p-4 md:p-10 lg:p-14 space-y-6 md:space-y-10 max-w-[1600px] mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className={`text-xl md:text-4xl font-black text-slate-800 tracking-tight ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
            {language === 'en' ? 'Sales Tracking' : 'বিক্রয় রেকর্ড'}
          </h1>
          <p className="text-slate-400 text-[10px] md:text-sm font-medium font-bengali">আয়ের হিসাব ও পেমেন্ট স্ট্যাটাস ট্র্যাকার</p>
        </div>
        <button onClick={() => handleOpenModal()} className="w-full sm:w-auto bg-[#007E6E] text-white px-6 py-3 rounded-xl font-black shadow-lg hover:brightness-110 active:scale-95 transition-all text-xs flex items-center justify-center gap-2">
          <Plus size={16} /> {language === 'bn' ? 'নতুন বিক্রয় যোগ' : 'Record New Sale'}
        </button>
      </div>

      <div className="bg-white rounded-[2rem] md:rounded-[3rem] border border-slate-50 shadow-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm min-w-[650px]">
            <thead className="bg-slate-50/50 text-slate-400 font-black uppercase text-[8px] md:text-[10px] tracking-widest font-english">
              <tr>
                <th className="px-6 md:px-10 py-4 md:py-6">Date</th>
                <th className="px-6 md:px-10 py-4 md:py-6">Client & Project</th>
                <th className="px-6 md:px-10 py-4 md:py-6 text-right">Amount</th>
                <th className="px-6 md:px-10 py-4 md:py-6 text-center">Status</th>
                <th className="px-6 md:px-10 py-4 md:py-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-english">
              {sales.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-10 py-16 text-center text-slate-300 font-bold uppercase tracking-widest">No sales records found.</td>
                </tr>
              ) : sales.map(s => {
                const client = clients.find(c => c.id === s.clientId);
                const project = projects.find(p => p.id === s.projectId);
                return (
                  <tr key={s.id} className="hover:bg-slate-50/30 transition-all">
                    <td className="px-6 md:px-10 py-5 md:py-8 text-slate-500 font-medium whitespace-nowrap">{s.date}</td>
                    <td className="px-6 md:px-10 py-5 md:py-8">
                       <div className="max-w-[150px] md:max-w-none truncate">
                          <div className={`font-black text-slate-800 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>{client?.name || 'Deleted Client'}</div>
                          <div className={`text-[8px] md:text-[10px] font-black text-[#007E6E] uppercase tracking-widest mt-0.5 truncate ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
                             {project?.name || 'General Sale'}
                          </div>
                       </div>
                    </td>
                    <td className="px-6 md:px-10 py-5 md:py-8 text-right font-black text-slate-800 text-sm md:text-lg">৳{s.amount.toLocaleString()}</td>
                    <td className="px-6 md:px-10 py-5 md:py-8 text-center whitespace-nowrap">
                      <span className={`px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest ring-1 ${
                        s.status === 'পরিশোধিত' ? 'bg-emerald-50 text-emerald-600 ring-emerald-100' : 
                        s.status === 'পেন্ডিং' ? 'bg-amber-50 text-amber-600 ring-amber-100' : 
                        'bg-rose-50 text-rose-600 ring-rose-100'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-6 md:px-10 py-5 md:py-8 text-center">
                       <div className="flex justify-center gap-1.5 md:gap-2">
                          <button onClick={() => handleOpenModal(s)} className="p-2 text-slate-300 hover:text-[#007E6E] bg-slate-50 rounded-lg transition-all"><Edit2 size={14} /></button>
                          <button onClick={() => handleDelete(s.id)} className="p-2 text-slate-300 hover:text-rose-600 bg-slate-50 rounded-lg transition-all"><Trash2 size={14} /></button>
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
          <div className="bg-white w-full max-w-xl rounded-[2.5rem] p-8 md:p-14 shadow-premium relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl md:text-2xl font-black text-slate-800 font-bengali">
                 {editingSale ? 'বিক্রয় এডিট' : 'নতুন বিক্রয় রেকর্ড'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 text-slate-300 hover:text-rose-500 bg-slate-50 rounded-xl"><X size={20} /></button>
            </div>
            
            <div className="space-y-4">
               <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 block font-bengali">ক্লায়েন্ট</label>
                  <select className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm font-bold text-slate-700" value={formData.clientId} onChange={e => setFormData({...formData, clientId: e.target.value})}>
                    <option value="">Select Client</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
               </div>

               <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 block font-bengali">প্রজেক্ট (ঐচ্ছিক)</label>
                  <select className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm font-bold text-slate-700" value={formData.projectId} onChange={e => setFormData({...formData, projectId: e.target.value})}>
                    <option value="">General / No Project</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
               </div>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 block font-bengali">টাকার পরিমাণ (৳)</label>
                    <input type="number" placeholder="0.00" className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm font-bold text-slate-700 font-english" value={formData.amount || ""} onChange={e => setFormData({...formData, amount: Number(e.target.value)})} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 block font-bengali">তারিখ</label>
                    <input type="date" value={formData.date} className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm font-bold text-slate-700" onChange={e => setFormData({...formData, date: e.target.value})} />
                  </div>
               </div>

               <div className="space-y-2 pt-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 block font-bengali">পেমেন্ট স্ট্যাটাস</label>
                  <div className="grid grid-cols-3 gap-2">
                     {['পরিশোধিত', 'পেন্ডিং', 'বাকি'].map(st => (
                        <button 
                           key={st}
                           onClick={() => setFormData({...formData, status: st})}
                           className={`py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border ${
                              formData.status === st 
                              ? 'bg-[#007E6E] text-white border-[#007E6E] shadow-md' 
                              : 'bg-slate-50 text-slate-400 border-slate-100'
                           } ${language === 'bn' ? 'font-bengali' : 'font-english'}`}
                        >
                           {st}
                        </button>
                     ))}
                  </div>
               </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-10">
              <button onClick={() => setShowModal(false)} className="w-full py-3 bg-slate-100 text-slate-500 rounded-xl font-black text-xs uppercase tracking-widest order-2 sm:order-1">বাতিল</button>
              <button 
                onClick={handleSave} 
                disabled={isSaving}
                className="w-full py-3 bg-[#007E6E] text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg order-1 sm:order-2"
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

export default Sales;
