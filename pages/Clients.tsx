
import React, { useState, useEffect } from 'react';
import { useApp } from '../App';
import { supabase } from '../lib/supabase';
import { Client } from '../types';

const Clients: React.FC = () => {
  const { language, clients, setClients, setTriggerAddClient, refreshData } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState<Partial<Client>>({ status: 'সক্রিয়', revenue: 0 });

  useEffect(() => {
    setTriggerAddClient(() => () => {
      setEditingClient(null);
      setFormData({ status: 'সক্রিয়', revenue: 0 });
      setShowModal(true);
    });
  }, []);

  const handleSave = async () => {
    if (!formData.name) return;
    try {
      if (editingClient) {
        const { error } = await supabase.from('clients').update(formData).eq('id', editingClient.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('clients').insert([formData]);
        if (error) throw error;
      }
      await refreshData();
      setShowModal(false);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm(language === 'bn' ? 'নিশ্চিত?' : 'Are you sure?')) {
      await supabase.from('clients').delete().eq('id', id);
      await refreshData();
    }
  };

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-[1600px] mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className={`text-3xl font-bold text-slate-800 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>{language === 'en' ? 'Clients' : 'ক্লায়েন্ট'}</h1>
          <p className={`text-slate-500 text-sm ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
            {language === 'bn' ? 'আপনার ব্যবসায়িক ক্লায়েন্টদের তালিকা' : 'Manage your business relationships'}
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg">
          {language === 'bn' ? 'ক্লায়েন্ট যোগ করুন' : 'Add Client'}
        </button>
      </div>

      {clients.length === 0 ? (
        <div className="bg-white rounded-[3rem] border border-slate-100 p-20 flex flex-col items-center justify-center text-center">
           <div className="w-20 h-20 bg-indigo-50 text-indigo-200 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
           </div>
           <h3 className={`text-xl font-bold text-slate-800 mb-2 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
             {language === 'bn' ? 'কোনো ক্লায়েন্ট নেই' : 'No Clients Yet'}
           </h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map(client => (
            <div key={client.id} className="bg-white p-8 rounded-[2rem] border border-slate-50 shadow-sm group hover:shadow-xl transition-all">
               <div className="flex justify-between items-start mb-6">
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl">{client.name[0]}</div>
                   <div>
                     <h3 className={`font-bold text-slate-800 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>{client.name}</h3>
                     <p className="text-[10px] text-slate-400 font-bold uppercase font-english">{client.company}</p>
                   </div>
                 </div>
                 <div className="flex gap-2">
                   <button onClick={() => { setEditingClient(client); setFormData(client); setShowModal(true); }} className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536" /></svg></button>
                   <button onClick={() => handleDelete(client.id)} className="p-2 text-slate-400 hover:text-rose-600 rounded-lg"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142" /></svg></button>
                 </div>
               </div>
               <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
                 <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${client.status === 'সক্রিয়' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'} ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>{client.status}</span>
                 <span className="font-bold text-slate-800 font-english">৳{client.revenue?.toLocaleString() || 0}</span>
               </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">{editingClient ? 'Edit Client' : 'New Client'}</h2>
            <div className="space-y-4">
               <input type="text" placeholder="Client Name" value={formData.name || ''} className="w-full p-3 bg-slate-50 rounded-xl" onChange={e => setFormData({...formData, name: e.target.value})} />
               <input type="text" placeholder="Company" value={formData.company || ''} className="w-full p-3 bg-slate-50 rounded-xl" onChange={e => setFormData({...formData, company: e.target.value})} />
               <input type="number" placeholder="Initial Revenue" value={formData.revenue || ''} className="w-full p-3 bg-slate-50 rounded-xl" onChange={e => setFormData({...formData, revenue: Number(e.target.value)})} />
            </div>
            <div className="flex gap-4 mt-8">
              <button onClick={() => setShowModal(false)} className="flex-1 py-3 bg-slate-100 rounded-xl font-bold">Cancel</button>
              <button onClick={handleSave} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;
