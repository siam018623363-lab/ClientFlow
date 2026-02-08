
import React from 'react';
import { useApp } from '../App';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Menu, Globe, User as UserIcon } from 'lucide-react';

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
    <header className="h-16 lg:h-24 bg-white border-b border-slate-100 px-4 md:px-8 lg:px-12 flex items-center justify-between sticky top-0 z-30 w-full overflow-hidden">
      <div className="flex items-center gap-2 md:gap-6">
        <button onClick={onMenuClick} className="lg:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-lg">
          <Menu size={20} />
        </button>
        
        <button 
          onClick={() => navigate('/')} 
          className="p-2 md:p-3 rounded-xl bg-slate-50 text-slate-400 hover:text-[#007E6E] hover:bg-[#007E6E]/5 transition-all border border-slate-100 flex items-center gap-2 group"
          title="Return to Public Site"
        >
          <Globe size={16} className="md:w-5 md:h-5" />
          <span className="hidden sm:inline text-[9px] font-black uppercase tracking-widest">{language === 'en' ? 'Site' : 'সাইট'}</span>
        </button>

        <div className="hidden md:flex relative group w-64 lg:w-[400px]">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-[#007E6E] transition-colors">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder={language === 'en' ? "Search..." : "খুঁজুন..."}
            className={`pl-12 pr-6 py-3 w-full bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-[#007E6E]/5 focus:bg-white transition-all outline-none text-sm font-medium ${language === 'bn' ? 'font-bengali' : 'font-english'}`}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4 lg:gap-8">
        <button onClick={handleAddClientClick} className="bg-[#007E6E] text-white p-2 md:px-5 md:py-2.5 rounded-xl text-xs md:text-sm font-black shadow-lg hover:brightness-110 transition-all flex items-center gap-2">
           <Plus size={16} />
           <span className={`hidden sm:inline ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
             {language === 'en' ? 'New Client' : 'নতুন ক্লায়েন্ট'}
           </span>
        </button>

        <div className="h-6 w-px bg-slate-100 hidden sm:block"></div>

        <div className="flex items-center gap-2 md:gap-4">
          <button className={`px-2.5 py-1.5 md:px-4 md:py-2 rounded-lg bg-slate-50 text-slate-500 hover:text-[#007E6E] font-black text-[9px] md:text-xs transition-all border border-transparent hover:border-[#007E6E]/10 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}
            onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}>
            {language === 'en' ? 'BN' : 'EN'}
          </button>
          
          <div className="flex items-center gap-2 md:gap-4 cursor-pointer group" onClick={() => navigate('/settings')}>
            <div className="hidden lg:block text-right">
              <p className="text-xs font-black text-slate-800 leading-none font-english">{userProfile.name}</p>
              <p className="text-[9px] text-[#007E6E] font-black uppercase tracking-widest mt-1 font-english">{userProfile.role}</p>
            </div>
            <img src={userProfile.avatar} className="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-2xl ring-2 ring-slate-100 shadow-sm" alt="avatar" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
