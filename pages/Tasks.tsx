
import React, { useState } from 'react';
import { useApp } from '../App';
import { Task } from '../types';
import { supabase } from '../lib/supabase';
import { Plus, Trash2, Edit2, Calendar, CheckSquare, Layers, X, Clock } from 'lucide-react';

const Tasks: React.FC = () => {
  const { language, tasks, projects, refreshData } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Task>>({ 
    title: '', 
    status: 'todo', 
    priority: 'মাঝারি', 
    dueDate: new Date().toISOString().split('T')[0] 
  });

  const handleSave = async () => {
    if (!formData.title) {
      alert(language === 'bn' ? 'টাস্ক টাইটেল লিখুন' : 'Please enter task title');
      return;
    }
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    setIsSaving(true);
    try {
      const payload = { 
        title: formData.title,
        status: formData.status || 'todo',
        priority: formData.priority || 'মাঝারি',
        dueDate: formData.dueDate,
        projectId: formData.projectId || null,
        user_id: session.user.id 
      };

      if (editingTask) {
        await supabase.from('tasks').update(payload).eq('id', editingTask.id);
      } else {
        await supabase.from('tasks').insert([payload]);
      }
      await refreshData();
      setShowModal(false);
      setEditingTask(null);
      setFormData({ title: '', status: 'todo', priority: 'মাঝারি', dueDate: new Date().toISOString().split('T')[0] });
    } catch (err: any) {
      alert("Error saving task: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteTask = async (id: string) => {
    if (confirm('Delete task?')) {
      await supabase.from('tasks').delete().eq('id', id);
      await refreshData();
    }
  };

  const moveTask = async (task: Task, newStatus: 'todo' | 'doing' | 'done') => {
    await supabase.from('tasks').update({ status: newStatus }).eq('id', task.id);
    await refreshData();
  };

  return (
    <div className="p-6 md:p-10 lg:p-14 space-y-10 max-w-[1600px] mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-800 font-bengali tracking-tight">টাস্ক ম্যানেজার</h1>
          <p className="text-slate-400 text-sm md:text-base font-medium mt-1">কাজের প্রগতি এবং ডেডলাইন মনিটর করুন</p>
        </div>
        <button onClick={() => { setEditingTask(null); setFormData({ title: '', status: 'todo', priority: 'মাঝারি', dueDate: new Date().toISOString().split('T')[0] }); setShowModal(true); }} className="bg-[#007E6E] text-white px-8 py-3.5 rounded-2xl font-black shadow-2xl shadow-[#007E6E]/20 hover:brightness-110 active:scale-95 transition-all text-sm flex items-center gap-3">
          <Plus size={20} /> নতুন টাস্ক
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
        {(['todo', 'doing', 'done'] as const).map(status => (
          <div key={status} className="bg-slate-100/40 p-8 rounded-[3rem] min-h-[700px] border border-slate-100 relative">
            <div className="flex items-center justify-between mb-8 px-2">
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{status}</h3>
               <span className="bg-white px-3 py-1 rounded-full text-[10px] font-black text-slate-400 shadow-sm border border-slate-100">
                  {tasks.filter(t => t.status === status).length}
               </span>
            </div>
            <div className="space-y-5">
               {tasks.filter(t => t.status === status).map(task => (
                 <div key={task.id} className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-transparent hover:border-[#007E6E]/20 hover:shadow-premium transition-all group relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#007E6E]/20 group-hover:bg-[#007E6E] transition-colors"></div>
                    <div className="absolute top-6 right-6 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button onClick={() => { setEditingTask(task); setFormData(task); setShowModal(true); }} className="p-2 text-slate-300 hover:text-[#007E6E] bg-slate-50 rounded-xl transition-all"><Edit2 size={12} /></button>
                       <button onClick={() => deleteTask(task.id)} className="p-2 text-slate-300 hover:text-rose-500 bg-slate-50 rounded-xl transition-all"><Trash2 size={12} /></button>
                    </div>
                    <p className="font-bold text-slate-800 mb-4 pr-10 font-bengali leading-snug">{task.title}</p>
                    
                    <div className="flex items-center gap-4 text-slate-400 mb-6">
                       <div className="flex items-center gap-1.5 text-[10px] font-bold font-english uppercase tracking-widest">
                          <Clock size={12} /> {task.dueDate}
                       </div>
                    </div>

                    <div className="pt-5 border-t border-slate-50 flex gap-2">
                       {status !== 'todo' && <button onClick={() => moveTask(task, 'todo')} className="flex-1 py-2 bg-slate-50 text-slate-400 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all">To Do</button>}
                       {status !== 'doing' && <button onClick={() => moveTask(task, 'doing')} className="flex-1 py-2 bg-[#007E6E]/5 text-[#007E6E] rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#007E6E]/10 transition-all">Doing</button>}
                       {status !== 'done' && <button onClick={() => moveTask(task, 'done')} className="flex-1 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-100 transition-all">Done</button>}
                    </div>
                 </div>
               ))}
               {tasks.filter(t => t.status === status).length === 0 && (
                 <div className="py-10 text-center text-slate-300 font-bold uppercase tracking-widest text-[10px]">Empty</div>
               )}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[3rem] p-10 md:p-14 shadow-premium relative">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-black text-slate-800 font-bengali tracking-tight">{editingTask ? 'এডিট টাস্ক' : 'নতুন টাস্ক'}</h2>
              <button onClick={() => setShowModal(false)} className="p-3 text-slate-300 hover:text-rose-500 bg-slate-50 rounded-2xl transition-all"><X size={24} /></button>
            </div>
            
            <div className="space-y-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 block">Task Title</label>
                  <input type="text" placeholder="Design UI Dashboard" value={formData.title} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-[#007E6E]/5 transition-all font-english font-bold text-slate-700" onChange={e => setFormData({...formData, title: e.target.value})} />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 block">Link to Project</label>
                  <select className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-[#007E6E]/5 transition-all font-english font-bold text-slate-700" value={formData.projectId || ''} onChange={e => setFormData({...formData, projectId: e.target.value})}>
                    <option value="">Link to Project (Optional)</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 block">Due Date</label>
                  <input type="date" value={formData.dueDate} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white transition-all font-english font-bold text-slate-700" onChange={e => setFormData({...formData, dueDate: e.target.value})} />
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

export default Tasks;
