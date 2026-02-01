
import React, { useState } from 'react';
import { useApp } from '../App';
import { Task } from '../types';

const Tasks: React.FC = () => {
  const { language, tasks, setTasks, projects } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState<Partial<Task>>({ status: 'todo', priority: 'মাঝারি' });

  const handleSave = () => {
    if (!formData.title) return;
    if (editingTask) {
      setTasks(tasks.map(t => t.id === editingTask.id ? { ...t, ...formData } as Task : t));
    } else {
      const task: Task = {
        ...formData as Task,
        id: Math.random().toString(36).substr(2, 9)
      };
      setTasks([...tasks, task]);
    }
    setShowModal(false);
    setEditingTask(null);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormData(task);
    setShowModal(true);
  };

  const deleteTask = (id: string) => {
    if (confirm('Delete task?')) setTasks(tasks.filter(t => t.id !== id));
  };

  const moveTask = (task: Task, newStatus: 'todo' | 'doing' | 'done') => {
    setTasks(tasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
  };

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-[1600px] mx-auto overflow-x-hidden">
      <div className="flex justify-between items-center">
        <div>
          <h1 className={`text-3xl font-bold text-slate-800 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
            {language === 'en' ? 'Task Manager' : 'টাস্ক ম্যানেজার'}
          </h1>
          <p className="text-slate-500 text-sm">Organize your internal workflow</p>
        </div>
        <button onClick={() => { setEditingTask(null); setFormData({ status: 'todo', priority: 'মাঝারি' }); setShowModal(true); }} className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg">
          {language === 'bn' ? 'টাস্ক যুক্ত করুন' : 'New Task'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {(['todo', 'doing', 'done'] as const).map(status => (
          <div key={status} className="bg-slate-100/40 p-6 rounded-[2.5rem] min-h-[600px] border border-slate-100/50">
            <div className="flex justify-between items-center mb-6 px-2">
               <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{status}</h3>
               <span className="bg-white px-2 py-0.5 rounded-md text-[10px] font-bold text-slate-400 border border-slate-50">{tasks.filter(t => t.status === status).length}</span>
            </div>
            <div className="space-y-4">
               {tasks.filter(t => t.status === status).map(task => (
                 <div key={task.id} className="bg-white p-6 rounded-2xl shadow-sm border border-white hover:border-indigo-100 hover:shadow-xl transition-all group relative">
                    <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button onClick={() => handleEdit(task)} className="p-1 text-slate-300 hover:text-indigo-500"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                       <button onClick={() => deleteTask(task.id)} className="p-1 text-slate-300 hover:text-rose-500"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                    </div>
                    <p className={`font-bold text-slate-800 mb-3 pr-8 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>{task.title}</p>
                    <div className="flex flex-wrap gap-2 items-center text-[10px] font-bold font-english">
                       <span className={`px-2 py-0.5 rounded-md ${task.priority === 'বেশি' ? 'bg-rose-50 text-rose-500' : 'bg-slate-100 text-slate-400'}`}>{task.priority}</span>
                       <span className="text-slate-300 flex items-center gap-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" /></svg>{task.dueDate}</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-50 flex gap-2 overflow-x-auto scrollbar-hide">
                       {status !== 'todo' && <button onClick={() => moveTask(task, 'todo')} className="px-2 py-1 bg-slate-50 text-slate-400 rounded-lg text-[9px] font-bold hover:bg-indigo-50 hover:text-indigo-600">To Do</button>}
                       {status !== 'doing' && <button onClick={() => moveTask(task, 'doing')} className="px-2 py-1 bg-slate-50 text-slate-400 rounded-lg text-[9px] font-bold hover:bg-indigo-50 hover:text-indigo-600">Doing</button>}
                       {status !== 'done' && <button onClick={() => moveTask(task, 'done')} className="px-2 py-1 bg-slate-50 text-slate-400 rounded-lg text-[9px] font-bold hover:bg-emerald-50 hover:text-emerald-600">Done</button>}
                    </div>
                 </div>
               ))}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">{editingTask ? 'Edit Task' : 'New Task'}</h2>
            <div className="space-y-4">
               <input type="text" placeholder="Task Title" value={formData.title || ''} className={`w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none ${language === 'bn' ? 'font-bengali' : 'font-english'}`} onChange={e => setFormData({...formData, title: e.target.value})} />
               <select className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl" value={formData.projectId || ''} onChange={e => setFormData({...formData, projectId: e.target.value})}>
                 <option value="">Link to Project</option>
                 {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
               </select>
               <input type="date" value={formData.dueDate || ''} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl font-english" onChange={e => setFormData({...formData, dueDate: e.target.value})} />
               <div className="grid grid-cols-2 gap-4">
                  <select value={formData.status} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl font-english" onChange={e => setFormData({...formData, status: e.target.value as any})}>
                    <option value="todo">To Do</option>
                    <option value="doing">Doing</option>
                    <option value="done">Done</option>
                  </select>
                  <select value={formData.priority} className={`w-full p-3 bg-slate-50 border border-slate-100 rounded-xl ${language === 'bn' ? 'font-bengali' : 'font-english'}`} onChange={e => setFormData({...formData, priority: e.target.value as any})}>
                    <option value="বেশি">High</option>
                    <option value="মাঝারি">Medium</option>
                    <option value="কম">Low</option>
                  </select>
               </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button onClick={() => setShowModal(false)} className="flex-1 py-3 bg-slate-100 rounded-xl font-bold">Cancel</button>
              <button onClick={handleSave} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold">Save Task</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
