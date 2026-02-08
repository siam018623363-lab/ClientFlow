
import React, { useState, useEffect } from 'react';
import { useApp } from '../App';
import { supabase } from '../lib/supabase';
import { Client } from '../types';
import { Phone, Plus, Trash2, Edit2, X, Search, Building2, Calendar } from 'lucide-react';

const Clients: React.FC = () => {
  const { 
    language, clients, refreshData, 
    isClientModalOpen, setIsClientModalOpen, 
    clientToEdit, setClientToEdit 
  } = useApp();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<any>({ 
    name: '', company: '', email: '', phone: '', status: 'সক্রিয়', revenue: 0, 
    join_date: new Date().toISOString().split('T')[0] 
  });

  useEffect(() => {
    if (clientToEdit) {
      setFormData(clientToEdit);
    } else {
      setFormData({ 
        name: '', company: '', email: '', phone: '', status: 'সক্রিয়', revenue: 0, 
        join_date: new Date().toISOString().split('T')[0] 
      });
    }
  }, [clientToEdit, isClientModalOpen]);

  const handleSave = async () => {
    if (!formData.name) return alert(language === 'bn' ? 'নাম লিখুন' : 'Name is required');
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    setIsSaving(true);
    try {
      const payload = { ...formData, user_id: session.user.id };
      if (clientToEdit) {
        await supabase.from('clients').update(payload).eq('id', clientToEdit.id);
      } else {
        await supabase.from('clients').insert([payload]);
      }
      await refreshData();
      setIsClientModalOpen(false);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-10 lg:p-14 space-y-6 md:space-y-10 max-w-[1600px] mx-auto animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-4xl font-black text-slate-800 font-bengali tracking-tight">
            {language === 'en' ? 'Client Directory' : 'ক্লায়েন্ট ডিরেক্টরি'}
          </h1>
          <p className="text-slate-400 text-[10px] md:text-sm font-medium font-bengali">
            {language === 'bn' ? 'সব ক্লায়েন্টদের লিস্ট ম্যানেজ করুন' : 'Centralized client database'}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-[#007E6E]/5 transition-all text-xs font-english"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={() => { setClientToEdit(null); setIsClientModalOpen(true); }} className="bg-[#007E6E] text-white px-5 py-2.5 rounded-xl font-black shadow-lg hover:brightness-110 active:scale-95 transition-all text-xs flex items-center justify-center gap-2">
            <Plus size={16} /> {language === 'bn' ? 'নতুন ক্লায়েন্ট' : 'New Client'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8">
        {filteredClients.map(client => (
          <div key={client.id} className="bg-white p-5 md:p-8 rounded-[2rem] border border-slate-50 shadow-sm hover:shadow-premium transition-all relative overflow-hidden group">
             <div className="flex justify-between items-start mb-6">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-[#007E6E] to-[#00524a] flex items-center justify-center text-white font-black text-xl uppercase shadow-md">{client.name[0]}</div>
                 <div className="max-w-[150px] md:max-w-none truncate">
                   <h3 className="font-black text-slate-800 text-base md:text-lg font-bengali truncate">{client.name}</h3>
                   <div className="flex items-center gap-1.5 text-slate-400 font-bold uppercase tracking-widest text-[8px] mt-1 font-english">
                     <Building2 size={8} /> {client.company || 'N/A'}
                   </div>
                 </div>
               </div>
               <button onClick={() => { setClientToEdit(client); setIsClientModalOpen(true); }} className="p-2 text-slate-300 hover:text-[#007E6E] bg-slate-50 rounded-xl transition-all"><Edit2 size={14} /></button>
             </div>
             
             <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-50">
                   <Phone size={14} className="text-[#007E6E]" />
                   <div className="text-xs font-bold text-slate-600 font-english">{client.phone}</div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                   <div className="bg-[#007E6E]/5 p-3 rounded-2xl border border-[#007E6E]/5">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5 font-bengali">মোট আয়</p>
                      <p className="text-sm font-black text-slate-800 font-english">৳{client.revenue?.toLocaleString()}</p>
                   </div>
                   <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5 font-bengali">তারিখ</p>
                      <p className="text-[10px] font-bold text-slate-600 font-english">{client.join_date}</p>
                   </div>
                </div>
             </div>
          </div>
        ))}
      </div>

      {isClientModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl rounded-[2.5rem] p-8 md:p-14 shadow-premium relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl md:text-2xl font-black text-slate-800 font-bengali">{clientToEdit ? 'আপডেট' : 'নতুন ক্লায়েন্ট'}</h2>
              <button onClick={() => setIsClientModalOpen(false)} className="p-2 text-slate-300 hover:text-rose-500 bg-slate-50 rounded-xl"><X size={20} /></button>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
               <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 block font-bengali">পুরো নাম</label>
                  <input type="text" placeholder="John Doe" value={formData.name} className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:bg-white transition-all font-english font-bold text-slate-700 text-sm" onChange={e => setFormData({...formData, name: e.target.value})} />
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 block font-bengali">কোম্পানি</label>
                    <input type="text" placeholder="Company Name" value={formData.company} className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm font-bold text-slate-700" onChange={e => setFormData({...formData, company: e.target.value})} />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 block font-bengali">ফোন নম্বর</label>
                    <input type="text" placeholder="017..." value={formData.phone} className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm font-bold text-slate-700" onChange={e => setFormData({...formData, phone: e.target.value})} />
                 </div>
               </div>
               <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 block font-bengali">ইমেইল</label>
                  <input type="email" placeholder="john@example.com" value={formData.email} className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm font-bold text-slate-700" onChange={e => setFormData({...formData, email: e.target.value})} />
               </div>
               <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 block font-bengali">যুক্ত হওয়ার তারিখ</label>
                  <input type="date" value={formData.join_date} className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm font-bold text-slate-700" onChange={e => setFormData({...formData, join_date: e.target.value})} />
               </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 mt-10">
              <button onClick={() => setIsClientModalOpen(false)} className="w-full py-3 bg-slate-100 text-slate-500 rounded-xl font-black text-xs uppercase tracking-widest order-2 sm:order-1">বাতিল</button>
              <button 
                onClick={handleSave} 
                disabled={isSaving}
                className="w-full py-3 bg-[#007E6E] text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg order-1 sm:order-2"
              >
                {isSaving ? 'Processing...' : (clientToEdit ? 'আপডেট' : 'সংরক্ষণ')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;
