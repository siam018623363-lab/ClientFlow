
import React, { useState } from 'react';
import { useApp } from '../App';
import { Sale } from '../types';

const Sales: React.FC = () => {
  const { language, sales, setSales, clients, projects } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [formData, setFormData] = useState<Partial<Sale>>({ status: 'পরিশোধিত', amount: 0 });

  const handleSave = () => {
    if (!formData.clientId || !formData.amount) return;
    if (editingSale) {
      setSales(sales.map(s => s.id === editingSale.id ? { ...s, ...formData } as Sale : s));
    } else {
      const sale: Sale = {
        ...formData as Sale,
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toISOString().split('T')[0],
      };
      setSales([...sales, sale]);
    }
    setShowModal(false);
    setEditingSale(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure?')) setSales(sales.filter(s => s.id !== id));
  };

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-[1600px] mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className={`text-3xl font-bold text-slate-800 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>{language === 'en' ? 'Sales' : 'বিক্রয়'}</h1>
          <p className="text-slate-500">Track all business revenue</p>
        </div>
        <button onClick={() => { setEditingSale(null); setFormData({ status: 'পরিশোধিত' }); setShowModal(true); }} className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg">
          {language === 'bn' ? 'বিক্রয় যোগ করুন' : 'New Sale'}
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-sm min-w-[800px]">
          <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px]">
            <tr>
              <th className="px-8 py-5">Date</th>
              <th className="px-8 py-5">Client</th>
              <th className="px-8 py-5">Project</th>
              <th className="px-8 py-5">Amount</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {sales.map(s => (
              <tr key={s.id} className="hover:bg-slate-50">
                <td className="px-8 py-5 text-slate-500 font-english">{s.date}</td>
                <td className="px-8 py-5 font-bold text-slate-700">{clients.find(c => c.id === s.clientId)?.name}</td>
                <td className="px-8 py-5 text-slate-500">{projects.find(p => p.id === s.projectId)?.name || 'General Sale'}</td>
                <td className="px-8 py-5 font-bold text-slate-800 font-english">৳{s.amount.toLocaleString()}</td>
                <td className="px-8 py-5">
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${s.status === 'পরিশোধিত' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>{s.status}</span>
                </td>
                <td className="px-8 py-5 text-center flex justify-center gap-2">
                   <button onClick={() => handleDelete(s.id)} className="p-1.5 text-slate-400 hover:text-rose-600 bg-slate-50 rounded-lg"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Record New Sale</h2>
            <div className="space-y-4">
               <select className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl" onChange={e => setFormData({...formData, clientId: e.target.value})}>
                 <option value="">Select Client</option>
                 {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
               </select>
               <select className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl" onChange={e => setFormData({...formData, projectId: e.target.value})}>
                 <option value="">Select Project (Optional)</option>
                 {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
               </select>
               <input type="number" placeholder="Sale Amount" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl" onChange={e => setFormData({...formData, amount: Number(e.target.value)})} />
            </div>
            <div className="flex gap-4 mt-8">
              <button onClick={() => setShowModal(false)} className="flex-1 py-3 bg-slate-100 rounded-xl font-bold">Cancel</button>
              <button onClick={handleSave} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold">Save Sale</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;
