
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useApp } from '../App';

const Dashboard: React.FC = () => {
  const { language, clients, projects } = useApp();
  const [timeRange, setTimeRange] = useState('Monthly');

  const hasData = clients.length > 0 || projects.length > 0;
  const chartData = [
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 3000 },
    { name: 'Mar', revenue: 5000 },
    { name: 'Apr', revenue: 4500 },
    { name: 'May', revenue: 6000 },
  ];

  const t = {
    en: { title: 'Dashboard', stats: ['Total Clients', 'Active Projects', 'Revenue', 'Pending Tasks'] },
    bn: { title: 'ড্যাশবোর্ড', stats: ['মোট ক্লায়েন্ট', 'চলমান প্রজেক্ট', 'মোট আয়', 'বকেয়া কাজ'] }
  }[language];

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className={`text-3xl font-bold text-slate-800 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>{t.title}</h1>
          <p className={`text-slate-500 text-sm mt-1 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
            {language === 'bn' ? 'আপনার ব্যবসায়িক অগ্রগতির সারসংক্ষেপ' : 'Overview of your business performance'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: t.stats[0], val: clients.length, color: 'indigo' },
          { label: t.stats[1], val: projects.filter(p => p.status === 'চলমান').length, color: 'emerald' },
          { label: t.stats[2], val: `৳${clients.reduce((acc, c) => acc + c.revenue, 0).toLocaleString()}`, color: 'violet' },
          { label: t.stats[3], val: '12', color: 'rose' }
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <p className={`text-slate-400 text-[11px] font-bold uppercase tracking-widest mb-3 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>{item.label}</p>
            <p className="text-3xl font-bold text-slate-800 font-english">{item.val}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <h3 className={`text-lg font-bold text-slate-800 mb-8 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
          {language === 'bn' ? 'আয় ও ইনকাম গ্রাফ' : 'Revenue Growth Chart'}
        </h3>
        <div className="h-80 w-full">
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
              <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', fontFamily: 'Poppins'}} />
              <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
