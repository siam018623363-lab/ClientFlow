
import React, { useState, useEffect } from 'react';
import { useApp } from '../App';
import { supabase } from '../lib/supabase';
import { Client, ContactLog } from '../types';
import { MessageSquare, Mail, Phone, Plus, Trash2, Edit2, Users2, X, Search, Building2, Calendar } from 'lucide-react';

const Clients: React.FC = () => {
  const { 
    language, clients, refreshData, 
    isClientModalOpen, setIsClientModalOpen, 
    clientToEdit, setClientToEdit 
  } = useApp();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<any>({ 
    name: '', company: '', email: '', phone: '', status: 'সক্রিয়', revenue: 0, 
    join_date: new Date().toISOString().split('T')[0] 
  });
  const [newLog, setNewLog] = useState({ note: '', action: '' });

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
    <div className="p-6 md:p-10 lg:p-14 space-y-10 max-w-[1600px] mx-auto min-h-screen animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-black text-slate-800 font-bengali tracking-tight">
            {language === 'en' ? 'Client Directory' : 'ক্লায়েন্ট ডিরেক্টরি'}
          </h1>
          <p className="text-slate-400 text-sm md:text-base font-medium font-bengali">
            {language === 'bn' ? 'সব ক্লায়েন্টদের লিস্ট এবং কন্টাক্ট ম্যানেজ করুন' : 'Centralized database of your business partners'}
          </p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#007E6E] transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search clients..." 
              className="w-full pl-12 pr-6 py-3.5 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#007E6E]/5 transition-all text-sm font-english shadow-sm"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={() => { setClientToEdit(null); setIsClientModalOpen(true); }} className="bg-[#007E6E] text-white px-6 py-3.5 rounded-2xl font-black shadow-2xl shadow-[#007E6E]/20 hover:brightness-110 active:scale-95 transition-all text-sm flex items-center gap-2 shrink-0">
            <Plus size={20} /> {language === 'bn' ? 'নতুন ক্লায়েন্ট' : 'New Client'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredClients.map(client => (
          <div key={client.id} onClick={() => setSelectedClient(client)} className={`bg-white p-8 rounded-[2.5rem] border transition-all cursor-pointer group hover:shadow-premium relative overflow-hidden ${selectedClient?.id === client.id ? 'border-[#007E6E] ring-4 ring-[#007E6E]/5' : 'border-slate-50 shadow-sm'}`}>
             <div className="flex justify-between items-start mb-8">
               <div className="flex items-center gap-5">
                 <div className="w-16 h-16 rounded-[1.8rem] bg-gradient-to-br from-[#007E6E] to-[#00524a] flex items-center justify-center text-white font-black text-2xl uppercase shadow-xl transform group-hover:scale-110 transition-transform">{client.name[0]}</div>
                 <div>
                   <h3 className="font-black text-slate-800 text-lg md:text-xl font-bengali tracking-tight leading-none">{client.name}</h3>
                   <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-widest text-[9px] mt-2 font-english">
                     <Building2 size={10} /> {client.company || 'N/A'}
                   </div>
                 </div>
               </div>
               <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button onClick={(e) => { e.stopPropagation(); setClientToEdit(client); setIsClientModalOpen(true); }} className="p-2.5 text-slate-400 hover:text-[#007E6E] bg-slate-50 rounded-xl"><Edit2 size={14} /></button>
               </div>
             </div>
             
             <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-50 group-hover:bg-white transition-colors">
                   <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#007E6E] shadow-sm"><Phone size={16} /></div>
                   <div className="text-sm font-bold text-slate-600 font-english">{client.phone}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-[#007E6E]/5 p-5 rounded-3xl border border-[#007E6E]/10">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 font-bengali">মোট আয়</p>
                      <p className="text-lg font-black text-slate-800 font-english">৳{client.revenue?.toLocaleString()}</p>
                   </div>
                   <div className="bg-emerald-50/50 p-5 rounded-3xl border border-emerald-100/50">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 font-bengali">তারিখ</p>
                      <p className="text-xs font-bold text-slate-600 font-english">{client.join_date}</p>
                   </div>
                </div>
             </div>
          </div>
        ))}
      </div>

      {isClientModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl rounded-[3rem] p-10 md:p-14 shadow-premium relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#007E6E]/5 rounded-bl-full"></div>
            <div className="flex justify-between items-center mb-10 relative">
              <div className="space-y-1">
                <h2 className="text-2xl md:text-3xl font-black text-slate-800 font-bengali tracking-tight">{clientToEdit ? 'ক্লায়েন্ট আপডেট' : 'নতুন ক্লায়েন্ট'}</h2>
                <p className="text-slate-400 text-sm font-medium">ব্যবসায়িক তথ্য সংরক্ষণ করুন</p>
              </div>
              <button onClick={() => setIsClientModalOpen(false)} className="p-3 text-slate-300 hover:text-rose-500 bg-slate-50 rounded-2xl transition-all"><X size={24} /></button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
               <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 block font-bengali">পুরো নাম</label>
                  <input type="text" placeholder="John Doe" value={formData.name} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-[#007E6E]/5 transition-all font-english font-bold text-slate-700" onChange={e => setFormData({...formData, name: e.target.value})} />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 block font-bengali">কোম্পানি</label>
                  <input type="text" placeholder="Google Inc." value={formData.company} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-[#007E6E]/5 transition-all font-english font-bold text-slate-700" onChange={e => setFormData({...formData, company: e.target.value})} />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 block font-bengali">ফোন নম্বর</label>
                  <input type="text" placeholder="017..." value={formData.phone} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-[#007E6E]/5 transition-all font-english font-bold text-slate-700" onChange={e => setFormData({...formData, phone: e.target.value})} />
               </div>
               <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 block font-bengali">ইমেইল</label>
                  <input type="email" placeholder="john@example.com" value={formData.email} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-[#007E6E]/5 transition-all font-english font-bold text-slate-700" onChange={e => setFormData({...formData, email: e.target.value})} />
               </div>
               <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 block font-bengali">যুক্ত হওয়ার তারিখ</label>
                  <input type="date" value={formData.join_date} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white transition-all font-english font-bold text-slate-700" onChange={e => setFormData({...formData, join_date: e.target.value})} />
               </div>
            </div>
            
            <div className="flex gap-5 mt-12 relative">
              <button onClick={() => setIsClientModalOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all">বাতিল</button>
              <button 
                onClick={handleSave} 
                disabled={isSaving}
                className="flex-1 py-4 bg-gradient-to-r from-[#007E6E] to-[#00524a] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-[#007E6E]/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {isSaving ? <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"></div> : (clientToEdit ? 'আপডেট' : 'সংরক্ষণ')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;
