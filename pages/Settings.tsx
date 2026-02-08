
import React, { useState, useEffect } from 'react';
import { useApp } from '../App';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const Settings: React.FC = () => {
  const { language, setLanguage, navItems, saveSettings, userProfile, setUserProfile, logout } = useApp();
  const [newMenuName, setNewMenuName] = useState('');
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Local state to manage form values before saving
  const [localProfile, setLocalProfile] = useState({ name: '', phone: '' });
  
  const navigate = useNavigate();

  useEffect(() => {
    setLocalProfile({
      name: userProfile.name,
      phone: userProfile.phone
    });
  }, [userProfile]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const toggleVisibility = async (id: string) => {
    const updated = navItems.map(item => item.id === id ? {...item, visible: !item.visible} : item);
    await saveSettings(updated);
  };

  const updateBnName = async (id: string, name: string) => {
    const updated = navItems.map(item => item.id === id ? {...item, bnName: name} : item);
    await saveSettings(updated);
  };

  const updateProfile = async () => {
    setIsSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session");
      
      const { error } = await supabase.auth.updateUser({
        data: { full_name: localProfile.name, phone: localProfile.phone }
      });
      if (error) throw error;

      // Update global context state
      setUserProfile({
        ...userProfile,
        name: localProfile.name,
        phone: localProfile.phone
      });

      alert(language === 'bn' ? 'প্রোফাইল আপডেট হয়েছে!' : 'Profile updated successfully!');
    } catch (err: any) {
      alert("Error updating profile: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddNewMenu = async () => {
    if (!newMenuName) return;
    const newItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: newMenuName,
      bnName: newMenuName,
      path: '/custom-' + newMenuName.toLowerCase().replace(/\s+/g, '-'),
      iconName: 'Settings',
      visible: true
    };
    await saveSettings([...navItems, newItem]);
    setNewMenuName('');
    setShowAddMenu(false);
  };

  return (
    <div className="p-6 lg:p-10 space-y-10 max-w-[1200px] mx-auto overflow-x-hidden">
      <div className="flex justify-between items-center">
        <h1 className={`text-3xl font-black text-slate-800 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
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
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
           <h3 className={`text-lg font-bold text-slate-800 border-b border-slate-50 pb-4 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
             {language === 'en' ? 'Profile Management' : 'প্রোফাইল সেটিংস'}
           </h3>
           <div className="flex items-center gap-4 mb-6">
              <img src={userProfile.avatar} className="w-16 h-16 rounded-2xl ring-4 ring-slate-100" alt="avatar" />
              <div className="text-xs text-slate-400 font-bold uppercase tracking-widest">Admin Account</div>
           </div>
           <div className="space-y-4 font-english">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Full Name</label>
                <input type="text" value={localProfile.name} onChange={e => setLocalProfile({...localProfile, name: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold text-slate-700 focus:bg-white transition-all" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Email Address (Read Only)</label>
                <input type="email" disabled value={userProfile.email} className="w-full p-3 bg-slate-100 border border-slate-100 rounded-xl outline-none font-bold text-slate-400" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Phone</label>
                <input type="text" value={localProfile.phone} onChange={e => setLocalProfile({...localProfile, phone: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold text-slate-700" />
              </div>
              <button onClick={updateProfile} disabled={isSaving} className="w-full py-3 bg-[#007E6E] text-white rounded-xl font-bold shadow-lg hover:brightness-110 transition-all">
                {isSaving ? 'Saving...' : 'Save Profile Info'}
              </button>
           </div>
        </div>

        <div className="space-y-8">
           <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm h-fit">
              <h3 className={`text-lg font-bold text-slate-800 mb-6 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
                {language === 'en' ? 'Language Settings' : 'ভাষা সেটিংস'}
              </h3>
              <div className="flex gap-4">
                 <button onClick={() => setLanguage('en')} className={`flex-1 py-3 rounded-xl font-bold border transition-all font-english ${language === 'en' ? 'bg-[#007E6E] text-white border-[#007E6E] shadow-lg' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>English</button>
                 <button onClick={() => setLanguage('bn')} className={`flex-1 py-3 rounded-xl font-bold border font-bengali transition-all ${language === 'bn' ? 'bg-[#007E6E] text-white border-[#007E6E] shadow-lg' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>বাংলা</button>
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
                       <button onClick={() => toggleVisibility(item.id)} className={`w-10 h-6 rounded-full transition-all relative ${item.visible ? 'bg-[#007E6E]' : 'bg-slate-300'}`}>
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${item.visible ? 'left-5' : 'left-1'}`}></div>
                       </button>
                       <input type="text" value={item.bnName} onChange={(e) => updateBnName(item.id, e.target.value)} className={`bg-transparent font-bold text-slate-700 outline-none w-32 border-b border-transparent focus:border-[#007E6E] ${language === 'bn' ? 'font-bengali' : 'font-english'}`} />
                     </div>
                     <span className="text-[10px] font-bold text-slate-400 uppercase font-english">{item.name}</span>
                  </div>
                ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
