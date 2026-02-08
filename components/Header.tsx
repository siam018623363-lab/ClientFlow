
import React from 'react';
import { useApp } from '../App';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { language, setLanguage, userProfile, setIsClientModalOpen, setClientToEdit } = useApp();
  const navigate = useNavigate();

  const handleAddClientClick = () => {
    setClientToEdit(null);
    navigate('/clients');
    setIsClientModalOpen(true);
  };

  return (
    <header className="h-20 lg:h-24 bg-white border-b border-slate-100 px-6 lg:px-12 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-6">
        <button onClick={onMenuClick} className="lg:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-xl">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16m-7 6h7" /></svg>
        </button>
        
        <button 
          onClick={() => navigate('/')} 
          className="p-3 rounded-2xl bg-slate-50 text-slate-400 hover:text-[#007E6E] hover:bg-[#007E6E]/5 transition-all border border-slate-100 flex items-center gap-3 group"
          title="Return to Public Site"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          <span className="hidden sm:inline text-xs font-black uppercase tracking-widest">{language === 'en' ? 'View Site' : 'সাইট দেখুন'}</span>
        </button>

        <div className="hidden md:flex relative group w-72 lg:w-[400px]">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-[#007E6E] transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </span>
          <input
            type="text"
            placeholder={language === 'en' ? "Search everything..." : "খুঁজুন সবকিছু..."}
            className={`pl-12 pr-6 py-3.5 w-full bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-[#007E6E]/5 focus:bg-white focus:border-[#007E6E]/20 transition-all outline-none text-base font-medium ${language === 'bn' ? 'font-bengali' : 'font-english'}`}
          />
        </div>
      </div>

      <div className="flex items-center gap-4 lg:gap-8">
        <button onClick={handleAddClientClick} className="bg-[#007E6E] text-white px-5 lg:px-8 py-3 rounded-2xl text-sm font-black shadow-lg hover:brightness-110 transition-all flex items-center gap-3">
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
           <span className={`hidden sm:inline ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
             {language === 'en' ? 'New Client' : 'ক্লায়েন্ট যোগ'}
           </span>
        </button>

        <div className="h-10 w-px bg-slate-100 hidden sm:block"></div>

        <div className="flex items-center gap-4">
          <button className={`px-4 py-2.5 rounded-2xl bg-slate-50 text-slate-500 hover:text-[#007E6E] font-black text-xs transition-all border border-transparent hover:border-[#007E6E]/10 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}
            onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}>
            {language === 'en' ? 'বাংলা' : 'English'}
          </button>
          
          <div className="flex items-center gap-4 pl-2 cursor-pointer group" onClick={() => navigate('/settings')}>
            <div className="hidden lg:block text-right">
              <p className="text-base font-black text-slate-800 leading-none font-english">{userProfile.name}</p>
              <p className="text-[10px] text-[#007E6E] font-black uppercase tracking-widest mt-1 font-english">{userProfile.role}</p>
            </div>
            <img src={userProfile.avatar} className="w-11 h-11 lg:w-14 lg:h-14 rounded-2xl ring-4 ring-slate-100 group-hover:ring-[#007E6E]/20 transition-all shadow-md" alt="avatar" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
