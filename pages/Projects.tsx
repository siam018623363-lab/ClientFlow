
import React, { useState } from 'react';
import { useApp } from '../App';
import { Project } from '../types';

const Projects: React.FC = () => {
  const { language, projects, setProjects, clients } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [showDetails, setShowDetails] = useState<Project | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<Partial<Project>>({ status: 'চলমান', priority: 'মাঝারি', budget: 0 });

  const handleSave = () => {
    if (!formData.name || !formData.clientId) return;
    if (editingProject) {
      setProjects(projects.map(p => p.id === editingProject.id ? { ...p, ...formData } as Project : p));
    } else {
      const project: Project = {
        ...formData as Project,
        id: Math.random().toString(36).substr(2, 9),
      };
      setProjects([...projects, project]);
    }
    setShowModal(false);
    setEditingProject(null);
    setFormData({ status: 'চলমান', priority: 'মাঝারি', budget: 0 });
  };

  const handleEdit = (p: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingProject(p);
    setFormData(p);
    setShowModal(true);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(language === 'bn' ? 'আপনি কি নিশ্চিত?' : 'Are you sure?')) {
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-[1600px] mx-auto overflow-x-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className={`text-3xl font-bold text-slate-800 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
            {language === 'en' ? 'Projects' : 'প্রজেক্ট'}
          </h1>
          <p className={`text-slate-500 text-sm ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
            {language === 'bn' ? 'আপনার প্রজেক্টগুলোর অগ্রগতি ট্র্যাক করুন' : 'Track and manage your ongoing work'}
          </p>
        </div>
        <button onClick={() => { setEditingProject(null); setFormData({ status: 'চলমান', priority: 'মাঝারি', budget: 0 }); setShowModal(true); }} className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg flex items-center gap-2 hover:bg-indigo-700 transition-all">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          <span className={language === 'bn' ? 'font-bengali' : 'font-english'}>{language === 'en' ? 'New Project' : 'প্রজেক্ট যোগ করুন'}</span>
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 p-20 flex flex-col items-center justify-center text-center">
           <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
           </div>
           <h3 className={`text-xl font-bold text-slate-800 mb-2 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
             {language === 'bn' ? 'কোনো প্রজেক্ট নেই' : 'No Projects Found'}
           </h3>
           <p className={`text-slate-500 mb-8 max-w-xs ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
             {language === 'bn' ? 'আপনার প্রথম প্রজেক্ট শুরু করতে ওপরের বাটনে ক্লিক করুন।' : 'Start your first project by clicking the button above.'}
           </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[800px]">
             <thead className="bg-slate-50/50 text-slate-400 font-bold uppercase text-[10px] tracking-widest font-english">
               <tr>
                 <th className="px-8 py-5">Project Name</th>
                 <th className="px-8 py-5">Client</th>
                 <th className="px-8 py-5">Deadline</th>
                 <th className="px-8 py-5">Priority</th>
                 <th className="px-8 py-5">Status</th>
                 <th className="px-8 py-5 text-right">Budget</th>
                 <th className="px-8 py-5 text-center">Actions</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-50">
               {projects.map(p => {
                 const client = clients.find(c => c.id === p.clientId);
                 return (
                   <tr key={p.id} onClick={() => setShowDetails(p)} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                     <td className={`px-8 py-5 font-bold text-slate-700 ${language === 'bn' ? 'font-bengali text-base' : 'font-english'}`}>{p.name}</td>
                     <td className={`px-8 py-5 text-slate-500 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>{client?.name || 'N/A'}</td>
                     <td className="px-8 py-5 text-slate-400 font-english">{p.deadline}</td>
                     <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-bold ${p.priority === 'বেশি' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'} ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>{p.priority}</span>
                     </td>
                     <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-bold bg-indigo-50 text-indigo-600 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>{p.status}</span>
                     </td>
                     <td className="px-8 py-5 font-bold text-slate-800 text-right font-english">৳{p.budget.toLocaleString()}</td>
                     <td className="px-8 py-5 text-center">
                        <div className="flex justify-center gap-2">
                           <button onClick={(e) => handleEdit(p, e)} className="p-1.5 text-slate-400 hover:text-indigo-600 bg-slate-50 rounded-lg transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                           <button onClick={(e) => handleDelete(p.id, e)} className="p-1.5 text-slate-400 hover:text-rose-600 bg-slate-50 rounded-lg transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                        </div>
                     </td>
                   </tr>
                 );
               })}
             </tbody>
          </table>
        </div>
      )}

      {showDetails && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600"></div>
             <button onClick={() => setShowDetails(null)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
             <div className="mb-8">
               <span className={`px-3 py-1 rounded-lg text-[10px] font-bold bg-indigo-50 text-indigo-600 mb-2 inline-block ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>{showDetails.status}</span>
               <h2 className={`text-3xl font-bold text-slate-800 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>{showDetails.name}</h2>
               <p className={`text-slate-500 mt-2 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>{showDetails.description}</p>
             </div>
             <div className="grid grid-cols-2 gap-8 mb-10">
               <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 font-english">Client</p>
                  <p className={`font-bold text-slate-800 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>{clients.find(c => c.id === showDetails.clientId)?.name || 'N/A'}</p>
               </div>
               <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 font-english">Deadline</p>
                  <p className="font-bold text-slate-800 font-english">{showDetails.deadline}</p>
               </div>
               <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 font-english">Priority</p>
                  <p className={`font-bold text-slate-800 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>{showDetails.priority}</p>
               </div>
               <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 font-english">Budget</p>
                  <p className="font-bold text-emerald-600 text-xl font-english">৳{showDetails.budget.toLocaleString()}</p>
               </div>
             </div>
             <button onClick={() => setShowDetails(null)} className={`w-full py-4 bg-slate-50 text-slate-600 rounded-2xl font-bold hover:bg-slate-100 transition-all ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
               {language === 'bn' ? 'বন্ধ করুন' : 'Close Details'}
             </button>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl">
            <h2 className={`text-2xl font-bold mb-6 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>{editingProject ? (language === 'bn' ? 'প্রজেক্ট এডিট' : 'Edit Project') : (language === 'bn' ? 'নতুন প্রজেক্ট যোগ করুন' : 'Add New Project')}</h2>
            <div className="space-y-4">
               <input type="text" placeholder="Project Name" value={formData.name || ''} className={`w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none ${language === 'bn' ? 'font-bengali' : 'font-english'}`} onChange={e => setFormData({...formData, name: e.target.value})} />
               <select value={formData.clientId} className={`w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none ${language === 'bn' ? 'font-bengali' : 'font-english'}`} onChange={e => setFormData({...formData, clientId: e.target.value})}>
                 <option value="">Select Client</option>
                 {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
               </select>
               <div className="grid grid-cols-2 gap-4 font-english">
                 <input type="date" value={formData.deadline || ''} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none" onChange={e => setFormData({...formData, deadline: e.target.value})} />
                 <input type="number" placeholder="Budget" value={formData.budget || ''} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none" onChange={e => setFormData({...formData, budget: Number(e.target.value)})} />
               </div>
               <textarea placeholder="Description" value={formData.description || ''} className={`w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none h-24 ${language === 'bn' ? 'font-bengali' : 'font-english'}`} onChange={e => setFormData({...formData, description: e.target.value})} />
               <div className="grid grid-cols-2 gap-4">
                  <select value={formData.status} className={`w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none ${language === 'bn' ? 'font-bengali' : 'font-english'}`} onChange={e => setFormData({...formData, status: e.target.value as any})}>
                    <option value="চলমান">Ongoing</option>
                    <option value="সম্পন্ন">Completed</option>
                    <option value="পেন্ডিং">Pending</option>
                  </select>
                  <select value={formData.priority} className={`w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none ${language === 'bn' ? 'font-bengali' : 'font-english'}`} onChange={e => setFormData({...formData, priority: e.target.value as any})}>
                    <option value="বেশি">High</option>
                    <option value="মাঝারি">Medium</option>
                    <option value="কম">Low</option>
                  </select>
               </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button onClick={() => setShowModal(false)} className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold">Cancel</button>
              <button onClick={handleSave} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold">Save Project</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
