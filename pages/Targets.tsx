
import React, { useState } from 'react';
import { useApp } from '../App';
import { Target } from '../types';

const Targets: React.FC = () => {
  const { language, targets, setTargets } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<Partial<Target>>({ goal: 0, current: 0 });

  const handleSave = () => {
    if (!formData.title || !formData.goal) return;
    const target: Target = {
      ...formData as Target,
      id: Math.random().toString(36).substr(2, 9),
    };
    setTargets([...targets, target]);
    setShowModal(false);
  };

  const deleteTarget = (id: string) => {
    if (confirm('Delete target?')) setTargets(targets.filter(t => t.id !== id));
  };

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-[1600px] mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className={`text-3xl font-bold text-slate-800 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>{language === 'en' ? 'Targets' : 'টার্গেট'}</h1>
          <p className="text-slate-500">Track your business milestones</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-amber-500 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg">
          {language === 'bn' ? 'টার্গেট যুক্ত করুন' : 'New Target'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {targets.map(t => {
          const progress = Math.min(100, (t.current / t.goal) * 100);
          return (
            <div key={t.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm relative group">
               <button onClick={() => deleteTarget(t.id)} className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 hover:text-rose-500">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
               </button>
               <h3 className={`text-lg font-bold text-slate-800 mb-6 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>{t.title}</h3>
               <div className="space-y-4">
                  <div className="flex justify-between text-xs font-bold text-slate-400 font-english">
                     <span>Progress</span>
                     <span>{progress.toFixed(0)}%</span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                     <div className="h-full bg-amber-500 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                  </div>
                  <div className="flex justify-between items-end pt-4 font-english">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Current</p>
                      <p className="text-xl font-bold text-slate-800">৳{t.current.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Goal</p>
                      <p className="text-xl font-bold text-slate-400">৳{t.goal.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="pt-4 flex items-center gap-2 text-xs font-bold text-slate-400 font-english">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    Deadline: {t.deadline}
                  </div>
               </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Create Target</h2>
            <div className="space-y-4">
               <input type="text" placeholder="Target Title" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl" onChange={e => setFormData({...formData, title: e.target.value})} />
               <input type="number" placeholder="Goal Amount" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl" onChange={e => setFormData({...formData, goal: Number(e.target.value)})} />
               <input type="number" placeholder="Starting Current" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl" onChange={e => setFormData({...formData, current: Number(e.target.value)})} />
               <input type="date" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl font-english" onChange={e => setFormData({...formData, deadline: e.target.value})} />
            </div>
            <div className="flex gap-4 mt-8">
              <button onClick={() => setShowModal(false)} className="flex-1 py-3 bg-slate-100 rounded-xl font-bold">Cancel</button>
              <button onClick={handleSave} className="flex-1 py-3 bg-amber-500 text-white rounded-xl font-bold shadow-lg shadow-amber-500/20">Save Target</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Targets;
