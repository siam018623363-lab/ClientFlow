
import React, { useState } from 'react';
import { useApp } from '../App';
import { Target } from '../types';
import { supabase } from '../lib/supabase';
import { Plus, Trash2, Target as TargetIcon, X, ArrowRight, Trophy } from 'lucide-react';

const Targets: React.FC = () => {
  const { language, targets, refreshData } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Target>>({ 
    title: '', 
    goal: 0, 
    current: 0, 
    deadline: new Date().toISOString().split('T')[0] 
  });

  const handleSave = async () => {
    if (!formData.title || !formData.goal) {
      alert(language === 'bn' ? 'টাইটেল এবং লক্ষ্যমাত্রা দিন' : 'Please provide title and goal');
      return;
    }
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    setIsSaving(true);
    try {
      const payload = { 
        title: formData.title,
        goal: Number(formData.goal),
        current: Number(formData.current || 0),
        deadline: formData.deadline,
        user_id: session.user.id 
      };
      
      const { error } = await supabase.from('targets').insert([payload]);
      if (error) throw error;
      
      await refreshData();
      setShowModal(false);
      setFormData({ title: '', goal: 0, current: 0, deadline: new Date().toISOString().split('T')[0] });
    } catch (err: any) {
      alert("Error saving target: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteTarget = async (id: string) => {
    if (confirm(language === 'bn' ? 'টার্গেটটি কি ডিলিট করতে চান?' : 'Delete target?')) {
      await supabase.from('targets').delete().eq('id', id);
      await refreshData();
    }
  };

  return (
    <div className="p-6 md:p-10 lg:p-14 space-y-10 max-w-[1600px] mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className={`text-3xl md:text-4xl font-black text-slate-800 tracking-tight ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
            {language === 'en' ? 'Growth Goals' : 'ব্যবসায়িক লক্ষ্যমাত্রা'}
          </h1>
          <p className="text-slate-400 text-sm md:text-base font-medium mt-1">আপনার আয়ের লক্ষ্যমাত্রা এবং প্রগতি ট্র্যাক করুন</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-[#007E6E] text-white px-8 py-3.5 rounded-2xl font-black shadow-2xl shadow-[#007E6E]/20 hover:brightness-110 active:scale-95 transition-all text-sm flex items-center gap-3">
          <Plus size={20} /> {language === 'bn' ? 'টার্গেট যোগ করুন' : 'Create Target'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10">
        {targets.length === 0 ? (
          <div className="col-span-full py-32 bg-white rounded-[3rem] border border-slate-100 flex flex-col items-center justify-center text-center shadow-sm">
             <div className="w-24 h-24 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mb-8"><TargetIcon size={48} /></div>
             <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No growth targets set yet.</p>
          </div>
        ) : targets.map(t => {
          const progress = Math.min(100, (t.current / t.goal) * 100);
          return (
            <div key={t.id} className="bg-white p-8 md:p-10 rounded-[3rem] border border-slate-50 shadow-sm relative group hover:shadow-premium transition-all duration-500 overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#007E6E]/5 rounded-bl-full group-hover:scale-110 transition-transform"></div>
               <button onClick={() => deleteTarget(t.id)} className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-500 transition-all p-2 bg-slate-50 rounded-xl">
                 <Trash2 size={18} />
               </button>
               
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm"><Trophy size={24} /></div>
                  <div>
                    <h3 className="text-xl font-black text-slate-800 font-bengali tracking-tight leading-none">{t.title}</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 font-english">Due: {t.deadline}</p>
                  </div>
               </div>

               <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 font-english">
                       <span>Progress</span>
                       <span className="text-[#007E6E]">{progress.toFixed(1)}%</span>
                    </div>
                    <div className="h-4 bg-slate-100 rounded-full overflow-hidden p-1 ring-1 ring-slate-100">
                       <div className="h-full bg-gradient-to-r from-[#007E6E] to-[#40b0a5] rounded-full transition-all duration-1000 shadow-glow" style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>

                  <div className="flex justify-between items-end pt-6 border-t border-slate-50">
                    <div>
                      <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Current</p>
                      <p className="text-2xl font-black text-[#007E6E] font-english">৳{t.current.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase font-black text-slate-300 tracking-widest mb-1">Goal</p>
                      <p className="text-lg font-bold text-slate-300 font-english">৳{t.goal.toLocaleString()}</p>
                    </div>
                  </div>
               </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[3rem] p-10 md:p-14 shadow-premium relative">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl md:text-3xl font-black text-slate-800 font-bengali tracking-tight">নতুন লক্ষ্যমাত্রা</h2>
              <button onClick={() => setShowModal(false)} className="p-3 text-slate-300 hover:text-rose-500 bg-slate-50 rounded-2xl transition-all"><X size={24} /></button>
            </div>
            
            <div className="space-y-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 block">Target Title</label>
                  <input type="text" placeholder="Monthly Sales Target" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-[#007E6E]/5 transition-all font-english font-bold text-slate-700" onChange={e => setFormData({...formData, title: e.target.value})} />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 block">Goal Amount (৳)</label>
                  <input type="number" placeholder="50000" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-[#007E6E]/5 transition-all font-english font-bold text-slate-700" onChange={e => setFormData({...formData, goal: Number(e.target.value)})} />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 block">Starting Balance</label>
                  <input type="number" placeholder="0" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-[#007E6E]/5 transition-all font-english font-bold text-slate-700" onChange={e => setFormData({...formData, current: Number(e.target.value)})} />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 block">Deadline</label>
                  <input type="date" value={formData.deadline} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white transition-all font-english font-bold text-slate-700" onChange={e => setFormData({...formData, deadline: e.target.value})} />
               </div>
            </div>
            
            <div className="flex gap-5 mt-12">
              <button onClick={() => setShowModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all">বাতিল</button>
              <button 
                onClick={handleSave} 
                disabled={isSaving}
                className="flex-1 py-4 bg-gradient-to-r from-[#007E6E] to-[#00524a] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-[#007E6E]/20 hover:brightness-110 transition-all flex items-center justify-center gap-2"
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

export default Targets;
