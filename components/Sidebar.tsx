
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../App';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (val: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) => {
  const { language, navItems } = useApp();

  const getIcon = (path: string) => {
    switch (path) {
      case '/': return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />;
      case '/clients': return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />;
      case '/projects': return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />;
      case '/sales': return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />;
      case '/payments': return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />;
      case '/targets': return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />;
      case '/services': return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />;
      case '/tasks': return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />;
      case '/settings': return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />;
      default: return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />;
    }
  };

  return (
    <>
      {isMobileOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 lg:hidden" onClick={() => setIsMobileOpen(false)} />
      )}

      <aside className={`fixed lg:sticky top-0 left-0 h-screen bg-[#007E6E]/[0.02] border-r border-slate-100 z-40 transition-all duration-300 flex flex-col ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} ${isCollapsed ? 'w-24' : 'w-72'}`}>
        <div className={`p-8 flex items-center justify-between ${isCollapsed ? 'flex-col gap-6' : ''}`}>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#007E6E] rounded-xl flex items-center justify-center text-white shadow-lg shrink-0">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            {!isCollapsed && <span className="font-black text-xl text-[#007E6E] font-english tracking-tighter">ClientFlow Pro</span>}
          </div>
          <button onClick={() => setIsCollapsed(!isCollapsed)} className="hidden lg:flex p-2 hover:bg-[#007E6E]/5 rounded-xl text-[#007E6E]/50">
            <svg className={`w-6 h-6 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-hide">
          {navItems.filter(i => i.visible).map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              onClick={() => setIsMobileOpen(false)}
              className={({ isActive }) => `flex items-center gap-4 px-4 py-4 rounded-2xl transition-all group ${isActive ? 'bg-[#007E6E] text-white font-bold shadow-lg shadow-[#007E6E]/20' : 'text-slate-500 hover:bg-[#007E6E]/5 hover:text-[#007E6E]'}`}
            >
              <span className={`w-6 h-6 shrink-0 flex items-center justify-center ${isCollapsed ? 'mx-auto' : ''}`}>
                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">{getIcon(item.path)}</svg>
              </span>
              {!isCollapsed && <span className={language === 'bn' ? 'font-bengali text-lg' : 'text-base font-english'}>{language === 'en' ? item.name : item.bnName}</span>}
            </NavLink>
          ))}
        </nav>

        {!isCollapsed && (
          <div className="p-6 border-t border-slate-50">
             <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-[#007E6E] uppercase tracking-[0.2em] mb-2">System Status</p>
                <div className="flex items-center gap-3">
                   <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                   <span className="text-xs font-bold text-slate-600">Online & Secure</span>
                </div>
             </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
