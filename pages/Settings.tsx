
import React, { useState } from 'react';
import { useApp } from '../App';
import { useNavigate } from 'react-router-dom';

const Settings: React.FC = () => {
  const { language, setLanguage, navItems, setNavItems, userProfile, setUserProfile, logout } = useApp();
  const [newMenuName, setNewMenuName] = useState('');
  const [showAddMenu, setShowAddMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleVisibility = (id: string) => {
    setNavItems(navItems.map(item => item.id === id ? {...item, visible: !item.visible} : item));
  };

  const updateBnName = (id: string, name: string) => {
    setNavItems(navItems.map(item => item.id === id ? {...item, bnName: name} : item));
  };

  const handleAddNewMenu = () => {
    if (!newMenuName) return;
    const newItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: newMenuName,
      bnName: newMenuName,
      path: '/custom-' + newMenuName.toLowerCase().replace(/\s+/g, '-'),
      iconName: 'Settings',
      visible: true
    };
    setNavItems([...navItems, newItem]);
    setNewMenuName('');
    setShowAddMenu(false);
  };

  return (
    <div className="p-6 lg:p-10 space-y-10 max-w-[1200px] mx-auto overflow-x-hidden">
      <div className="flex justify-between items-center">
        <h1 className={`text-3xl font-bold text-slate-800 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
          {language === 'en' ? 'Settings' : 'সেটিংস'}
        </h1>
        <button 
          onClick={handleLogout}
          className={`px-6 py-2.5 bg-rose-50 text-rose-600 rounded-xl font-bold border border-rose-100 hover:bg-rose-100 transition-all ${language === 'bn' ? 'font-bengali' : 'font-english'}`}
        >
          {language === 'bn' ? 'লগআউট' : 'Logout'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Settings */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
           <h3 className={`text-lg font-bold text-slate-800 border-b border-slate-50 pb-4 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
             {language === 'en' ? 'Profile Management' : 'প্রোফাইল সেটিংস'}
           </h3>
           <div className="flex items-center gap-4 mb-6">
              <img src={userProfile.avatar} className="w-16 h-16 rounded-2xl ring-4 ring-indigo-50" alt="avatar" />
              <button className="text-indigo-600 font-bold text-xs bg-indigo-50 px-3 py-1.5 rounded-lg">Change Photo</button>
           </div>
           <div className="space-y-4 font-english">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Full Name</label>
                <input type="text" value={userProfile.name} onChange={e => setUserProfile({...userProfile, name: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold text-slate-700" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Email Address</label>
                <input type="email" value={userProfile.email} onChange={e => setUserProfile({...userProfile, email: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold text-slate-700" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Phone</label>
                  <input type="text" value={userProfile.phone} onChange={e => setUserProfile({...userProfile, phone: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold text-slate-700" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Role</label>
                  <input type="text" value={userProfile.role} onChange={e => setUserProfile({...userProfile, role: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold text-slate-700" />
                </div>
              </div>
           </div>
        </div>

        {/* Language & Menu */}
        <div className="space-y-8">
           <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm h-fit">
              <h3 className={`text-lg font-bold text-slate-800 mb-6 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
                {language === 'en' ? 'Language Settings' : 'ভাষা সেটিংস'}
              </h3>
              <div className="flex gap-4">
                 <button onClick={() => setLanguage('en')} className={`flex-1 py-3 rounded-xl font-bold border transition-all font-english ${language === 'en' ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>English</button>
                 <button onClick={() => setLanguage('bn')} className={`flex-1 py-3 rounded-xl font-bold border font-bengali transition-all ${language === 'bn' ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>বাংলা</button>
              </div>
           </div>

           <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
              <h3 className={`text-lg font-bold text-slate-800 mb-6 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
                {language === 'en' ? 'Menu Customization' : 'মেনু কাস্টমাইজেশন'}
              </h3>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                {navItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                     <div className="flex items-center gap-4">
                       <button onClick={() => toggleVisibility(item.id)} className={`w-10 h-6 rounded-full transition-all relative ${item.visible ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${item.visible ? 'left-5' : 'left-1'}`}></div>
                       </button>
                       <input type="text" value={item.bnName} onChange={(e) => updateBnName(item.id, e.target.value)} className={`bg-transparent font-bold text-slate-700 outline-none w-32 border-b border-transparent focus:border-indigo-300 ${language === 'bn' ? 'font-bengali' : 'font-english'}`} />
                     </div>
                     <span className="text-[10px] font-bold text-slate-400 uppercase font-english">{item.name}</span>
                  </div>
                ))}
              </div>
              
              {!showAddMenu ? (
                <button onClick={() => setShowAddMenu(true)} className={`w-full mt-6 py-3 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-100 transition-all ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
                  {language === 'bn' ? '+ নতুন মেনু আইটেম যুক্ত করুন' : '+ Add New Menu Item'}
                </button>
              ) : (
                <div className="mt-6 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-4">
                   <input type="text" placeholder="Menu Name" value={newMenuName} onChange={e => setNewMenuName(e.target.value)} className={`w-full p-3 bg-white border border-indigo-100 rounded-xl outline-none ${language === 'bn' ? 'font-bengali' : 'font-english'}`} />
                   <div className="flex gap-2">
                      <button onClick={() => setShowAddMenu(false)} className="flex-1 py-2 bg-white text-slate-500 rounded-lg text-xs font-bold">Cancel</button>
                      <button onClick={handleAddNewMenu} className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold">Save</button>
                   </div>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
