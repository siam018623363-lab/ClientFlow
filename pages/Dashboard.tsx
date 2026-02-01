
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useApp } from '../App';

const Dashboard: React.FC = () => {
  const { language, clients, projects } = useApp();
  const [timeRange, setTimeRange] = useState('Monthly');

  // Chart data defaults to empty if no revenue
  const hasData = clients.length > 0 || projects.length > 0;
  
  const chartData = hasData ? [
    { name: 'জানু', revenue: 0 },
    { name: 'ফেব্রু', revenue: 0 },
    { name: 'মার্চ', revenue: 0 },
  ] : [
    { name: 'জানু', revenue: 0 },
    { name: 'ফেব্রু', revenue: 0 },
    { name: 'মার্চ', revenue: 0 },
  ];

  const t = {
    en: { 
      title: 'Dashboard', 
      stats: ['Clients', 'Projects', 'Revenue', 'Tasks'],
      target: 'Monthly Target'
    },
    bn: { 
      title: 'ড্যাশবোর্ড', 
      stats: ['মোট ক্লায়েন্ট', 'চলমান প্রজেক্ট', 'মোট আয়', 'বকেয়া কাজ'],
      target: 'মাসিক টার্গেট'
    }
  }[language];

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-[1600px] mx-auto overflow-x-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className={`text-3xl font-bold text-slate-800 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>{t.title}</h1>
          <p className={`text-slate-500 text-sm ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
            {language === 'bn' ? 'আপনার ব্যবসার সারসংক্ষেপ' : 'Your business overview'}
          </p>
        </div>
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-100">
           {['Weekly', 'Monthly', 'Yearly'].map(range => (
             <button key={range} onClick={() => setTimeRange(range)} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${timeRange === range ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600 font-english'}`}>{range}</button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: t.stats[0], val: clients.length, color: 'indigo', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
          { label: t.stats[1], val: projects.filter(p => p.status === 'চলমান').length, color: 'emerald', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
          { label: t.stats[2], val: `৳${clients.reduce((acc, c) => acc + c.revenue, 0).toLocaleString()}`, color: 'violet', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
          { label: t.stats[3], val: '0', color: 'rose', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' }
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-50 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
               <p className={`text-slate-500 text-xs font-bold uppercase tracking-wider ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>{item.label}</p>
               <div className={`p-2 rounded-xl bg-slate-50 text-slate-400`}>
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} /></svg>
               </div>
            </div>
            <p className="text-3xl font-bold text-slate-800 font-english">{item.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm relative">
          <h3 className={`text-lg font-bold text-slate-800 mb-8 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
            {language === 'bn' ? 'বিক্রয় ওভারভিউ' : 'Sales Overview'} ({timeRange})
          </h3>
          <div className="h-80">
            {!hasData && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-[1px] z-10 rounded-[2.5rem]">
                <div className="text-center">
                   <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                     <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                   </div>
                   <p className={`text-slate-400 font-bold ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
                     {language === 'bn' ? 'কোনো ডাটা পাওয়া যায়নি' : 'No Sales Data Available'}
                   </p>
                </div>
              </div>
            )}
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                 <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontFamily: 'Poppins'}} dy={10} />
                 <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontFamily: 'Poppins'}} />
                 <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontFamily: 'Poppins'}} />
                 <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm flex flex-col items-center">
          <div className="w-full flex justify-between items-center mb-10">
            <h3 className={`text-lg font-bold text-slate-800 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>{t.target}</h3>
            <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          
          <div className="relative w-52 h-52 flex items-center justify-center">
             <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="#6366f1" strokeWidth="8" strokeDasharray="282.7" strokeDashoffset={282.7 * (1 - 0)} className="transition-all duration-1000" strokeLinecap="round" />
             </svg>
             <div className="absolute text-center">
                <p className="text-4xl font-bold text-slate-800 font-english">0%</p>
                <p className={`text-[10px] text-slate-400 font-bold uppercase tracking-widest ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
                   {language === 'bn' ? 'অগ্রগতি' : 'Progress'}
                </p>
             </div>
          </div>

          <div className="w-full mt-10 space-y-4">
             {[
               { label: language === 'bn' ? 'টার্গেট পরিমাণ' : 'Target', val: '৳০', color: 'slate' },
               { label: language === 'bn' ? 'অর্জিত পরিমাণ' : 'Achieved', val: '৳০', color: 'indigo' },
               { label: language === 'bn' ? 'বাকি' : 'Remaining', val: '৳০', color: 'rose' },
             ].map((item, idx) => (
               <div key={idx} className="flex justify-between items-center">
                  <span className={`text-sm text-slate-500 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>{item.label}</span>
                  <span className={`text-sm font-bold text-${item.color}-600 font-english`}>{item.val}</span>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
