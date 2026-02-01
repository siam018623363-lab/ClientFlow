
import React from 'react';
import { useApp } from '../App';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { language, setLanguage, userProfile, triggerAddClient } = useApp();
  const navigate = useNavigate();

  const handleAddClientClick = () => {
    navigate('/clients');
    // Allow navigation to settle then trigger
    setTimeout(() => triggerAddClient(), 100);
  };

  return (
    <header className="h-16 lg:h-20 bg-white border-b border-slate-100 px-4 lg:px-10 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="lg:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-lg">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
        </button>
        <div className="hidden md:flex relative group w-64 lg:w-96">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 group-focus-within:text-indigo-500 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </span>
          <input
            type="text"
            placeholder={language === 'en' ? "Search for clients, projects..." : "খুঁজুন ক্লায়েন্ট, প্রজেক্ট..."}
            className={`pl-10 pr-4 py-2.5 w-full bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/10 focus:bg-white transition-all outline-none text-sm ${language === 'bn' ? 'font-bengali text-base' : 'font-english'}`}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 lg:gap-6">
        <button onClick={handleAddClientClick} className="bg-indigo-600 text-white px-3 lg:px-5 py-2 rounded-xl text-xs font-bold shadow-md hover:bg-indigo-700 transition-all flex items-center gap-2">
           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
           <span className={`hidden sm:inline ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
             {language === 'en' ? 'Add Client' : 'ক্লায়েন্ট যোগ করুন'}
           </span>
        </button>

        <div className="h-8 w-px bg-slate-100 mx-1 hidden sm:block"></div>

        <div className="flex items-center gap-3">
          <button className={`p-2 rounded-xl bg-slate-50 text-slate-500 hover:text-indigo-600 font-bold text-xs transition-all ${language === 'bn' ? 'font-bengali' : 'font-english'}`}
            onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}>
            {language === 'en' ? 'বাংলা' : 'English'}
          </button>
          
          <div className="flex items-center gap-3 pl-2 cursor-pointer group" onClick={() => navigate('/settings')}>
            <div className="hidden lg:block text-right">
              <p className="text-sm font-bold text-slate-800 leading-none font-english">{userProfile.name}</p>
              <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider mt-1 font-english">{userProfile.role}</p>
            </div>
            <img src={userProfile.avatar} className="w-9 h-9 lg:w-11 lg:h-11 rounded-xl ring-2 ring-slate-100 group-hover:ring-indigo-100 transition-all shadow-sm" alt="avatar" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
