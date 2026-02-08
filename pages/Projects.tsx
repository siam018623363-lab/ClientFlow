
import React, { useState } from 'react';
import { useApp } from '../App';
import { Project } from '../types';
import { supabase } from '../lib/supabase';
import { Plus, Trash2, Edit2, Briefcase, Calendar, DollarSign, ChevronRight, X } from 'lucide-react';

const Projects: React.FC = () => {
  const { language, projects, clients, refreshData } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Project>>({ status: 'চলমান', priority: 'মাঝারি', budget: 0 });

  const handleSave = async () => {
    if (!formData.name || !formData.clientId) {
      alert(language === 'bn' ? 'প্রজেক্টের নাম এবং ক্লায়েন্ট নির্বাচন করুন' : 'Please provide project name and client');
      return;
    }
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    setIsSaving(true);
    try {
      const payload = { 
        name: formData.name,
        clientId: formData.clientId,
        deadline: formData.deadline,
        budget: Number(formData.budget || 0),
        status: formData.status || 'চলমান',
        priority: formData.priority || 'মাঝারি',
        description: formData.description || '',
        user_id: session.user.id 
      };

      if (editingProject) {
        await supabase.from('projects').update(payload).eq('id', editingProject.id);
      } else {
        await supabase.from('projects').insert([payload]);
      }
      await refreshData();
      setShowModal(false);
      setEditingProject(null);
      setFormData({ status: 'চলমান', priority: 'মাঝারি', budget: 0 });
    } catch (err: any) {
      alert("Error saving project: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(language === 'bn' ? 'আপনি কি নিশ্চিত?' : 'Are you sure?')) {
      await supabase.from('projects').delete().eq('id', id);
      await refreshData();
    }
  };

  return (
    <div className="p-6 md:p-10 lg:p-14 space-y-10 max-w-[1600px] mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className={`text-3xl md:text-4xl font-black text-slate-800 tracking-tight ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
            {language === 'en' ? 'Project Console' : 'প্রজেক্ট ম্যানেজমেন্ট'}
          </h1>
          <p className="text-slate-400 text-sm md:text-base font-medium mt-1">সব চলমান এবং সম্পন্ন প্রজেক্টের তালিকা</p>
        </div>
        <button onClick={() => { setEditingProject(null); setFormData({ status: 'চলমান', priority: 'মাঝারি', budget: 0 }); setShowModal(true); }} className="bg-[#007E6E] text-white px-8 py-3.5 rounded-2xl font-black shadow-2xl shadow-[#007E6E]/20 hover:brightness-110 active:scale-95 transition-all text-sm flex items-center gap-3">
          <Plus size={20} /> {language === 'bn' ? 'নতুন প্রজেক্ট' : 'Add Project'}
        </button>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[900px]">
             <thead className="bg-slate-50/50 text-slate-400 font-black uppercase text-[10px] tracking-[0.2em] font-english">
               <tr>
                 <th className="px-10 py-6">Project Details</th>
                 <th className="px-10 py-6">Timeline</th>
                 <th className="px-10 py-6">Financials</th>
                 <th className="px-10 py-6">Priority</th>
                 <th className="px-10 py-6 text-center">Actions</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-50">
               {projects.length === 0 ? (
                 <tr><td colSpan={5} className="px-10 py-20 text-center text-slate-400 font-bold uppercase tracking-widest">No active projects yet.</td></tr>
               ) : projects.map(p => {
                 const client = clients.find(c => c.id === p.clientId);
                 return (
                   <tr key={p.id} className="hover:bg-slate-50/50 transition-all group">
                     <td className="px-10 py-8">
                        <div className="flex items-center gap-5">
                           <div className="w-12 h-12 bg-[#007E6E]/5 text-[#007E6E] rounded-2xl flex items-center justify-center shadow-sm"><Briefcase size={20} /></div>
                           <div>
                              <div className={`font-black text-slate-800 text-base ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>{p.name}</div>
                              <div className="text-[10px] font-black text-[#007E6E] uppercase tracking-widest mt-1">{client?.name || 'Unknown Client'}</div>
                           </div>
                        </div>
                     </td>
                     <td className="px-10 py-8">
                        <div className="flex items-center gap-2 text-slate-500 font-english font-bold">
                           <Calendar size={14} className="text-[#007E6E]/40" />
                           {p.deadline || 'No Date'}
                        </div>
                        <div className="mt-2 text-[9px] font-black text-slate-300 uppercase tracking-widest">{p.status}</div>
                     </td>
                     <td className="px-10 py-8">
                        <div className="flex items-center gap-1 font-black text-slate-800 text-base font-english">
                           <DollarSign size={14} className="text-[#007E6E]" />
                           {p.budget?.toLocaleString()}
                        </div>
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Total Budget</div>
                     </td>
                     <td className="px-10 py-8">
                        <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${p.priority === 'বেশি' ? 'bg-rose-50 text-rose-500' : 'bg-[#007E6E]/5 text-[#007E6E]'}`}>
                           {p.priority}
                        </span>
                     </td>
                     <td className="px-10 py-8">
                        <div className="flex justify-center gap-3">
                           <button onClick={() => { setEditingProject(p); setFormData(p); setShowModal(true); }} className="p-2.5 text-slate-300 hover:text-[#007E6E] bg-slate-50 rounded-xl transition-all"><Edit2 size={16} /></button>
                           <button onClick={(e) => handleDelete(p.id, e)} className="p-2.5 text-slate-300 hover:text-rose-500 bg-slate-50 rounded-xl transition-all"><Trash2 size={16} /></button>
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
                 {editingProject ? 'প্রজেক্ট আপডেট' : 'নতুন প্রজেক্ট যুক্ত করুন'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-3 text-slate-300 hover:text-rose-500 bg-slate-50 rounded-2xl transition-all"><X size={24} /></button>
            </div>
            
            <div className="space-y-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 block">Project Name</label>
                  <input type="text" placeholder="E-commerce Development" value={formData.name || ''} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-[#007E6E]/5 transition-all font-english font-bold text-slate-700" onChange={e => setFormData({...formData, name: e.target.value})} />
               </div>
               
               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 block">Client</label>
                    <select value={formData.clientId || ''} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-[#007E6E]/5 transition-all font-english font-bold text-slate-700" onChange={e => setFormData({...formData, clientId: e.target.value})}>
                      <option value="">Select Client</option>
                      {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 block">Budget (৳)</label>
                    <input type="number" value={formData.budget || ''} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-[#007E6E]/5 transition-all font-english font-bold text-slate-700" onChange={e => setFormData({...formData, budget: Number(e.target.value)})} />
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 block">Deadline</label>
                    <input type="date" value={formData.deadline || ''} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white transition-all font-english font-bold text-slate-700" onChange={e => setFormData({...formData, deadline: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 block">Priority</label>
                    <select value={formData.priority || 'মাঝারি'} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white transition-all font-english font-bold text-slate-700" onChange={e => setFormData({...formData, priority: e.target.value as any})}>
                      <option value="কম">Low</option>
                      <option value="মাঝারি">Medium</option>
                      <option value="বেশি">High</option>
                    </select>
                  </div>
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

export default Projects;
