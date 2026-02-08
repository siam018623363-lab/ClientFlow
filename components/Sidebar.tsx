
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../App';
import { X, LayoutGrid, Users, Briefcase, DollarSign, CreditCard, Target, Layers, CheckSquare, Settings } from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (val: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) => {
  const { language, navItems } = useApp();

  const getIcon = (path: string) => {
    const iconClass = "w-5 h-5 md:w-6 md:h-6 shrink-0";
    switch (path) {
      case '/dashboard': return <LayoutGrid className={iconClass} />;
      case '/clients': return <Users className={iconClass} />;
      case '/projects': return <Briefcase className={iconClass} />;
      case '/sales': return <DollarSign className={iconClass} />;
      case '/payments': return <CreditCard className={iconClass} />;
      case '/targets': return <Target className={iconClass} />;
      case '/services': return <Layers className={iconClass} />;
      case '/tasks': return <CheckSquare className={iconClass} />;
      case '/settings': return <Settings className={iconClass} />;
      default: return <LayoutGrid className={iconClass} />;
    }
  };

  return (
    <>
      {/* Background Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] lg:hidden animate-in fade-in duration-300" onClick={() => setIsMobileOpen(false)} />
      )}

      {/* Sidebar Content */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen bg-white border-r border-slate-100 z-[70] transition-all duration-300 flex flex-col overflow-hidden ${isMobileOpen ? 'translate-x-0 w-[260px] md:w-[280px]' : '-translate-x-full lg:translate-x-0'} ${isCollapsed ? 'w-24' : 'w-72'}`}>
        <div className={`p-5 md:p-8 flex items-center justify-between shrink-0 ${isCollapsed ? 'flex-col gap-6' : ''}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#007E6E] rounded-xl flex items-center justify-center text-white shadow-lg shrink-0">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            {(!isCollapsed || isMobileOpen) && <span className="font-black text-lg text-[#007E6E] font-english tracking-tighter truncate">ClientFlow Pro</span>}
          </div>
          <button onClick={() => setIsCollapsed(!isCollapsed)} className="hidden lg:flex p-2 hover:bg-[#007E6E]/5 rounded-xl text-[#007E6E]/50">
            <svg className={`w-6 h-6 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
          </button>
          <button onClick={() => setIsMobileOpen(false)} className="lg:hidden p-2 text-slate-400 hover:text-rose-500 bg-slate-50 rounded-xl">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 px-3 md:px-4 py-4 space-y-1.5 overflow-y-auto scrollbar-hide">
          {navItems.filter(i => i.visible).map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              onClick={() => setIsMobileOpen(false)}
              className={({ isActive }) => `flex items-center gap-3 px-3 md:px-4 py-3 md:py-3.5 rounded-xl md:rounded-2xl transition-all group ${isActive ? 'bg-[#007E6E] text-white font-bold shadow-xl shadow-[#007E6E]/20' : 'text-slate-500 hover:bg-slate-50 hover:text-[#007E6E]'}`}
            >
              <span className={`shrink-0 flex items-center justify-center ${isCollapsed ? 'mx-auto' : ''}`}>
                {getIcon(item.path)}
              </span>
              {(!isCollapsed || isMobileOpen) && <span className={`truncate ${language === 'bn' ? 'font-bengali text-sm md:text-base' : 'text-xs md:text-sm font-english'}`}>{language === 'en' ? item.name : item.bnName}</span>}
            </NavLink>
          ))}
        </nav>

        {(!isCollapsed || isMobileOpen) && (
          <div className="p-4 md:p-6 border-t border-slate-50 shrink-0">
             <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <p className="text-[9px] font-black text-[#007E6E] uppercase tracking-widest mb-1.5">System Status</p>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                   <span className="text-[10px] font-bold text-slate-500">Secure Live Connection</span>
                </div>
             </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
