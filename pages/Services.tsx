
import React, { useState } from 'react';
import { useApp } from '../App';
import { Service } from '../types';
import { supabase } from '../lib/supabase';
import { Plus, Trash2, Layers, Tag, DollarSign, X, Briefcase } from 'lucide-react';

const Services: React.FC = () => {
  const { language, services, refreshData } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Service>>({ name: '', bnName: '', price: 0, description: '' });

  const handleSave = async () => {
    if (!formData.name) {
      alert("Please provide service name");
      return;
    }
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    setIsSaving(true);
    try {
      const payload = { 
        name: formData.name,
        bnName: formData.bnName || formData.name,
        price: Number(formData.price || 0),
        description: formData.description || '',
        user_id: session.user.id 
      };
      
      const { error } = await supabase.from('services').insert([payload]);
      if (error) throw error;
      
      await refreshData();
      setShowModal(false);
      setFormData({ name: '', bnName: '', price: 0, description: '' });
    } catch (err: any) {
      alert("Error saving service: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteService = async (id: string) => {
    if (confirm(language === 'bn' ? 'সার্ভিসটি কি ডিলিট করতে চান?' : 'Delete service?')) {
      await supabase.from('services').delete().eq('id', id);
      await refreshData();
    }
  };

  return (
    <div className="p-6 md:p-10 lg:p-14 space-y-10 max-w-[1600px] mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-800 font-bengali tracking-tight">সার্ভিস ক্যাটালগ</h1>
          <p className="text-slate-400 text-sm md:text-base font-medium mt-1">আপনার সব অফার করা সার্ভিস এবং প্যাকেজসমূহ</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-[#007E6E] text-white px-8 py-3.5 rounded-2xl font-black shadow-2xl shadow-[#007E6E]/20 hover:brightness-110 active:scale-95 transition-all text-sm flex items-center gap-3">
          <Plus size={20} /> নতুন সার্ভিস
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10">
        {services.length === 0 ? (
          <div className="col-span-full py-32 bg-white rounded-[3rem] border border-slate-100 flex flex-col items-center justify-center text-center shadow-sm">
             <div className="w-24 h-24 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mb-8"><Briefcase size={48} /></div>
             <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No services listed yet.</p>
          </div>
        ) : services.map(s => (
          <div key={s.id} className="bg-white p-10 rounded-[3rem] border border-slate-50 shadow-sm hover:shadow-premium transition-all duration-500 group relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-[#007E6E]/5 rounded-bl-full group-hover:scale-110 transition-transform"></div>
             <div className="w-16 h-16 bg-gradient-to-br from-[#007E6E] to-[#00524a] text-white rounded-[1.8rem] flex items-center justify-center mb-10 shadow-xl group-hover:rotate-6 transition-transform">
                <Layers size={28} />
             </div>
             <h3 className="text-2xl font-black text-slate-800 mb-4 font-bengali tracking-tight">{language === 'bn' ? s.bnName : s.name}</h3>
             <p className="text-slate-500 text-sm md:text-base mb-10 leading-relaxed font-medium line-clamp-3">{s.description || 'No description provided.'}</p>
             
             <div className="flex justify-between items-center pt-8 border-t border-slate-50 relative">
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] font-english">Price Start</p>
                   <span className="text-3xl font-black text-slate-800 font-english tabular-nums">৳{s.price.toLocaleString()}</span>
                </div>
                <button onClick={() => deleteService(s.id)} className="p-3 text-slate-300 hover:text-rose-500 bg-slate-50 hover:bg-rose-50 rounded-2xl transition-all">
                  <Trash2 size={20} />
                </button>
             </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl rounded-[3rem] p-10 md:p-14 shadow-premium relative">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl md:text-3xl font-black text-slate-800 font-bengali tracking-tight">নতুন সার্ভিস</h2>
              <button onClick={() => setShowModal(false)} className="p-3 text-slate-300 hover:text-rose-500 bg-slate-50 rounded-2xl transition-all"><X size={24} /></button>
            </div>
            
            <div className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 block">Service Name (EN)</label>
                    <input type="text" placeholder="Web Development" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-[#007E6E]/5 transition-all font-english font-bold text-slate-700" onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 block">সার্ভিসের নাম (বাংলা)</label>
                    <input type="text" placeholder="ওয়েব ডেভেলপমেন্ট" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-[#007E6E]/5 transition-all font-bengali font-bold text-slate-700" onChange={e => setFormData({...formData, bnName: e.target.value})} />
                  </div>
               </div>
               
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 block">Base Price (৳)</label>
                  <input type="number" placeholder="5000" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-[#007E6E]/5 transition-all font-english font-bold text-slate-700" onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 block">Description</label>
                  <textarea placeholder="Tell more about this service..." className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-[#007E6E]/5 transition-all font-english font-medium text-slate-700 h-32" onChange={e => setFormData({...formData, description: e.target.value})} />
               </div>
            </div>
            
            <div className="flex gap-5 mt-12 relative">
              <button onClick={() => setShowModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all">বাতিল</button>
              <button 
                onClick={handleSave} 
                disabled={isSaving}
                className="flex-1 py-4 bg-gradient-to-r from-[#007E6E] to-[#00524a] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-[#007E6E]/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {isSaving ? <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"></div> : 'তৈরি করুন'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
