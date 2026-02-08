
import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useApp } from '../App';
import { Calendar, TrendingUp, Filter, ShoppingBag, Clock, Users, ArrowUpRight } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { language, clients, projects, tasks, sales } = useApp();
  const [dateFilter, setDateFilter] = useState('This Month');

  const stats = useMemo(() => {
    const totalRevenue = sales.reduce((acc, s) => acc + (s.amount || 0), 0);
    const activeProjects = projects.filter(p => p.status === 'চলমান').length;
    const pendingTasks = tasks.filter(t => t.status === 'todo').length;
    const totalClients = clients.length;

    const t = {
      en: ['Total Clients', 'Active Projects', 'Total Revenue', 'Pending Tasks'],
      bn: ['মোট ক্লায়েন্ট', 'চলমান প্রজেক্ট', 'মোট আয়', 'বকেয়া কাজ']
    }[language];

    return [
      { label: t[0], val: totalClients, color: 'text-indigo-600', bg: 'bg-indigo-50', icon: <Users size={16} />, trend: '+12%' },
      { label: t[1], val: activeProjects, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: <Clock size={16} />, trend: '+4' },
      { label: t[2], val: `৳${totalRevenue.toLocaleString()}`, color: 'text-[#007E6E]', bg: 'bg-[#007E6E]/10', icon: <TrendingUp size={16} />, trend: '+24%' },
      { label: t[3], val: pendingTasks, color: 'text-rose-600', bg: 'bg-rose-50', icon: <ShoppingBag size={16} />, trend: '-2' }
    ];
  }, [language, clients, projects, tasks, sales]);

  const chartData = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    let filteredSales = [...sales];

    if (dateFilter === 'Today') {
      filteredSales = sales.filter(s => s.date === todayStr);
    } else if (dateFilter === 'This Week') {
      const lastWeek = new Date();
      lastWeek.setDate(now.getDate() - 7);
      filteredSales = sales.filter(s => new Date(s.date) >= lastWeek);
    } else if (dateFilter === 'This Month') {
      filteredSales = sales.filter(s => {
        const d = new Date(s.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      });
    }

    if (filteredSales.length === 0) return [{ name: 'Empty', revenue: 0 }];

    const groups: { [key: string]: number } = {};
    filteredSales.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).forEach(s => {
      const dateKey = new Date(s.date).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', { day: 'numeric', month: 'short' });
      groups[dateKey] = (groups[dateKey] || 0) + s.amount;
    });

    return Object.keys(groups).map(key => ({ name: key, revenue: groups[key] }));
  }, [sales, dateFilter, language]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-md p-2.5 rounded-xl shadow-premium border border-slate-100 animate-in fade-in zoom-in duration-200">
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
          <p className="text-sm font-black text-[#007E6E]">৳{payload[0].value.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 md:p-8 lg:p-14 space-y-6 md:space-y-10 max-w-full mx-auto animate-fade-in overflow-x-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className={`text-xl md:text-4xl font-black text-slate-800 tracking-tight ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
            {language === 'bn' ? 'ব্যবসায়িক ড্যাশবোর্ড' : 'Insights Dashboard'}
          </h1>
          <p className={`text-slate-400 text-[10px] md:text-sm font-medium ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
            {language === 'bn' ? 'পারফরম্যান্স গ্রাফ' : 'Real-time performance metrics'}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-100 shadow-sm w-full sm:w-auto">
           <Filter size={14} className="text-[#007E6E]" />
           <select 
             value={dateFilter}
             onChange={(e) => setDateFilter(e.target.value)}
             className="bg-transparent text-[10px] md:text-xs font-black text-slate-600 outline-none cursor-pointer font-english appearance-none flex-1 sm:flex-none"
           >
              <option value="Today">Today</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
              <option value="Yearly">This Year</option>
           </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item, i) => (
          <div key={i} className="bg-white p-5 md:p-8 rounded-3xl border border-slate-50 shadow-sm hover:shadow-premium transition-all duration-300 group">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <div className={`w-10 h-10 md:w-14 md:h-14 ${item.bg} rounded-xl md:rounded-2xl flex items-center justify-center transition-all group-hover:scale-105 shadow-sm`}>
                <span className={item.color}>{item.icon}</span>
              </div>
              <span className="flex items-center gap-1 text-[8px] md:text-[9px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">
                {item.trend}
              </span>
            </div>
            <div>
              <p className={`text-slate-400 text-[9px] md:text-[10px] font-black uppercase tracking-widest ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>{item.label}</p>
              <p className={`text-lg md:text-2xl font-black text-slate-800 font-english tabular-nums tracking-tighter mt-1`}>{item.val}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-5 md:p-10 rounded-3xl md:rounded-[3.5rem] border border-slate-50 shadow-premium overflow-hidden">
        <div className="mb-6 md:mb-10">
           <h3 className={`text-lg md:text-2xl font-black text-slate-800 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
            {language === 'bn' ? 'ইনকাম গ্রাফ' : 'Income Analysis'}
          </h3>
          <p className="text-slate-400 text-[9px] md:text-[10px] font-black uppercase tracking-widest mt-1">Trend analysis for {dateFilter}</p>
        </div>
        
        <div className="h-[200px] md:h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#007E6E" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#007E6E" stopOpacity={0.01}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 8, fontWeight: 700}} 
                dy={10} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 8, fontWeight: 700}} 
                tickFormatter={(val) => `৳${val >= 1000 ? (val/1000).toFixed(0)+'k' : val}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#007E6E" 
                strokeWidth={2.5} 
                fillOpacity={1} 
                fill="url(#colorRev)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
