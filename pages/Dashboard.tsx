
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
      { label: t[0], val: totalClients, color: 'text-indigo-600', bg: 'bg-indigo-50', icon: <Users size={24} />, trend: '+12%' },
      { label: t[1], val: activeProjects, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: <Clock size={24} />, trend: '+4' },
      { label: t[2], val: `৳${totalRevenue.toLocaleString()}`, color: 'text-[#007E6E]', bg: 'bg-[#007E6E]/10', icon: <TrendingUp size={24} />, trend: '+24%' },
      { label: t[3], val: pendingTasks, color: 'text-rose-600', bg: 'bg-rose-50', icon: <ShoppingBag size={24} />, trend: '-2' }
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

    if (filteredSales.length === 0) return [{ name: 'Jan', revenue: 0 }, { name: 'Feb', revenue: 0 }];

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
        <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-premium border border-slate-100 animate-in fade-in zoom-in duration-200">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
          <p className="text-lg font-black text-[#007E6E]">৳{payload[0].value.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 md:p-10 lg:p-14 space-y-12 max-w-[1600px] mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8">
        <div>
          <h1 className={`text-3xl md:text-5xl font-black text-slate-800 tracking-tight ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
            {language === 'bn' ? 'ব্যবসায়িক ড্যাশবোর্ড' : 'Insights Dashboard'}
          </h1>
          <p className={`text-slate-400 text-sm md:text-lg mt-2 font-medium ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
            {language === 'bn' ? 'লাইভ ডাটা এবং পারফরম্যান্স গ্রাফ' : 'Real-time performance metrics and diagrams'}
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
           <Filter size={20} className="text-[#007E6E]" />
           <select 
             value={dateFilter}
             onChange={(e) => setDateFilter(e.target.value)}
             className="bg-transparent text-sm font-black text-slate-600 outline-none pr-4 cursor-pointer font-english appearance-none"
           >
              <option value="Today">Today</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
              <option value="Yearly">This Year</option>
           </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
        {stats.map((item, i) => (
          <div key={i} className="bg-white p-8 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] border border-slate-100 shadow-sm hover:shadow-premium transition-all duration-500 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-slate-50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className={`w-14 h-14 md:w-16 md:h-16 ${item.bg} rounded-2xl md:rounded-3xl flex items-center justify-center mb-6 md:mb-8 transition-all group-hover:scale-110 shadow-sm ring-4 ring-white`}>
               <span className={item.color}>{item.icon}</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className={`text-slate-400 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>{item.label}</p>
                <span className="flex items-center gap-1 text-[9px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <ArrowUpRight size={10} /> {item.trend}
                </span>
              </div>
              <p className={`text-2xl md:text-4xl font-black text-slate-800 font-english tabular-nums tracking-tighter`}>{item.val}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-8 md:p-12 rounded-[3rem] md:rounded-[4rem] border border-slate-100 shadow-premium">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
           <div className="space-y-1">
             <h3 className={`text-2xl md:text-3xl font-black text-slate-800 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
              {language === 'bn' ? 'ইনকাম ও গ্রোথ ডায়াগ্রাম' : 'Income Growth Diagram'}
            </h3>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 font-english">
              <Clock size={14} className="text-[#007E6E]" /> Trend analysis for {dateFilter}
            </p>
           </div>
          <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
             <div className="flex items-center gap-2 px-4">
                <div className="w-3 h-3 rounded-full bg-[#007E6E] shadow-glow"></div>
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest font-english">Revenue</span>
             </div>
          </div>
        </div>
        
        <div className="h-[350px] md:h-[500px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#007E6E" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#007E6E" stopOpacity={0.01}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700, fontFamily: 'Poppins'}} 
                dy={20} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700, fontFamily: 'Poppins'}} 
                dx={-10}
                tickFormatter={(val) => `৳${val > 999 ? (val/1000).toFixed(1)+'k' : val}`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{stroke: '#007E6E', strokeWidth: 1, strokeDasharray: '4 4'}} />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#007E6E" 
                strokeWidth={5} 
                fillOpacity={1} 
                fill="url(#colorRev)" 
                activeDot={{ r: 8, strokeWidth: 4, stroke: '#fff', fill: '#007E6E' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
