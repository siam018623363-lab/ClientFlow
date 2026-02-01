
import React, { useState } from 'react';
import { useApp } from '../App';
import { Service } from '../types';

const Services: React.FC = () => {
  const { language, services, setServices } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<Partial<Service>>({ price: 0 });

  const handleSave = () => {
    if (!formData.name) return;
    const service: Service = {
      ...formData as Service,
      id: Math.random().toString(36).substr(2, 9),
    };
    setServices([...services, service]);
    setShowModal(false);
  };

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-[1600px] mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className={`text-3xl font-bold text-slate-800 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>{language === 'en' ? 'Services' : 'সার্ভিস'}</h1>
          <p className="text-slate-500">Define what you offer</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-violet-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg">
          {language === 'bn' ? 'সার্ভিস যুক্ত করুন' : 'New Service'}
        </button>
      </div>

      {services.length === 0 ? (
        <div className="bg-white rounded-[3rem] border border-slate-100 p-20 flex flex-col items-center justify-center text-center">
           <div className="w-20 h-20 bg-violet-50 text-violet-200 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
           </div>
           <h3 className={`text-xl font-bold text-slate-800 mb-2 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
             {language === 'bn' ? 'কোনো সার্ভিস নেই' : 'No Services Defined'}
           </h3>
           <p className={`text-slate-500 mb-8 max-w-xs ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
             {language === 'bn' ? 'আপনি যেসব সেবা প্রদান করেন সেগুলো এখানে তালিকাভুক্ত করুন।' : 'List the services you offer to your clients here.'}
           </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(s => (
            <div key={s.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm hover:shadow-xl transition-all group">
               <div className="w-12 h-12 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.638.319a2 2 0 01-.894.223h-.547a2 2 0 01-1.32-.512l-2.01-1.73a2 2 0 010-3.04l2.01-1.73a2 2 0 011.32-.512h.547a2 2 0 01.894.223l.638.319a6 6 0 003.86.517l2.387-.477a2 2 0 001.022-.547l.348-.348a2 2 0 013.207 2.396l-.348.348z" /></svg>
               </div>
               <h3 className={`text-xl font-bold text-slate-800 mb-2 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>{language === 'bn' ? s.bnName : s.name}</h3>
               <p className={`text-slate-500 text-sm mb-6 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>{s.description}</p>
               <div className="flex justify-between items-center pt-6 border-t border-slate-50">
                  <span className="text-2xl font-bold text-slate-800 font-english">৳{s.price.toLocaleString()}</span>
                  <button onClick={() => setServices(services.filter(srv => srv.id !== s.id))} className="text-slate-300 hover:text-rose-500 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
               </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">New Service</h2>
            <div className="space-y-4">
               <input type="text" placeholder="Service Name (English)" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl" onChange={e => setFormData({...formData, name: e.target.value})} />
               <input type="text" placeholder="সার্ভিসের নাম (বাংলা)" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl font-bengali" onChange={e => setFormData({...formData, bnName: e.target.value})} />
               <input type="number" placeholder="Price" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl font-english" onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
               <textarea placeholder="Description" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl h-24" onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>
            <div className="flex gap-4 mt-8">
              <button onClick={() => setShowModal(false)} className="flex-1 py-3 bg-slate-100 rounded-xl font-bold">Cancel</button>
              <button onClick={handleSave} className="flex-1 py-3 bg-violet-600 text-white rounded-xl font-bold">Create Service</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
