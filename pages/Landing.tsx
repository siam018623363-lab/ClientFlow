
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../App';
import { 
  Facebook, Instagram, Youtube, Music2, MessageSquare, 
  CheckCircle2, Target, Users2, Briefcase, Menu, X, 
  BarChart3, ShieldCheck, Zap, AlertTriangle, Lightbulb, 
  Settings, Clock, ArrowRight, Layers, FileText, Smartphone, Heart
} from 'lucide-react';

const Landing: React.FC = () => {
  const { isLoggedIn, language } = useApp();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const primaryColor = "#007E6E";

  const dashboardImages = [
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&q=80&w=1000"
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    const sliderTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % dashboardImages.length);
    }, 4000);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(sliderTimer);
    };
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementRect = element.getBoundingClientRect().top;
      const bodyRect = document.body.getBoundingClientRect().top;
      window.scrollTo({ top: elementRect - bodyRect - offset, behavior: 'smooth' });
    }
  };

  const navLinks = [
    { id: 'top', label: 'হোম' },
    { id: 'problems', label: 'সমস্যা' },
    { id: 'who', label: 'কাদের জন্য' },
    { id: 'why', label: 'কেন আমরা' },
    { id: 'features', label: 'ফিচার' },
    { id: 'pricing', label: 'মূল্য' },
    { id: 'faq', label: 'প্রশ্ন' }
  ];

  const featuresList = [
    'সব প্রিমিয়াম ফিচার এক্সেস',
    'আনলিমিটেড ক্লায়েন্ট ম্যানেজমেন্ট',
    'প্রজেক্ট ও টাস্ক ট্র্যাকিং',
    'আয় ও বকেয়া হিসাব',
    '১০০% বাংলা সাপোর্ট ও গাইড'
  ];

  return (
    <div className="min-h-screen bg-white font-bengali text-slate-800 selection:bg-[#007E6E]/10 selection:text-[#007E6E]">
      
      {/* 1. HEADER */}
      <header className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-md h-14 md:h-16' : 'bg-transparent h-16 md:h-20'}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3 cursor-pointer shrink-0" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="w-8 h-8 md:w-10 md:h-10 bg-[#007E6E] rounded-lg md:rounded-xl flex items-center justify-center text-white shadow-lg">
              <Zap size={18} className="md:w-[22px]" />
            </div>
            <span className="text-lg md:text-xl font-black text-slate-900 tracking-tight">ClientFlow Pro</span>
          </div>

          {/* Desktop Nav: Centered */}
          <nav className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {navLinks.map(link => (
              <button key={link.id} onClick={() => scrollToSection(link.id)} className="text-sm font-bold text-slate-600 hover:text-[#007E6E] transition-colors uppercase tracking-widest">
                {link.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden sm:flex items-center gap-4">
              {isLoggedIn ? (
                <button onClick={() => navigate('/dashboard')} className="bg-[#007E6E] text-white px-5 py-2 rounded-xl font-bold shadow-lg hover:brightness-110 transition-all text-sm">ড্যাশবোর্ড</button>
              ) : (
                <>
                  <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-[#007E6E] transition-colors">লগইন</Link>
                  <Link to="/register" className="bg-[#007E6E] text-white px-5 py-2 rounded-xl font-bold shadow-lg hover:brightness-110 transition-all text-sm">শুরু করুন</Link>
                </>
              )}
            </div>

            {/* Mobile Toggle */}
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-1.5 text-slate-900 hover:bg-slate-100 rounded-lg">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      <div className={`fixed inset-0 z-[2000] bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className={`absolute top-0 right-0 bottom-0 w-64 md:w-72 bg-white shadow-2xl transition-transform duration-300 transform ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} p-6 md:p-8 flex flex-col`}>
          <div className="flex justify-between items-center mb-8 md:mb-10">
             <span className="text-lg md:text-xl font-black text-[#007E6E]">মেনু</span>
             <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-slate-50 rounded-lg md:rounded-xl"><X size={20} /></button>
          </div>
          <nav className="flex flex-col gap-4 md:gap-6 text-sm md:text-base font-bold text-slate-600">
            {navLinks.map(link => (
              <button key={link.id} onClick={() => scrollToSection(link.id)} className="text-left py-2 border-b border-slate-50">{link.label}</button>
            ))}
            <div className="mt-auto pt-6 border-t border-slate-100 flex flex-col gap-3">
               <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full py-3 text-center rounded-xl bg-slate-50 font-bold">লগইন</Link>
               <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="w-full py-3 text-center rounded-xl bg-[#007E6E] text-white font-bold">শুরু করুন</Link>
            </div>
          </nav>
        </div>
      </div>

      {/* 2. HERO SECTION */}
      <section id="top" className="pt-24 pb-12 md:pt-40 md:pb-20 px-4 md:px-6 relative overflow-hidden bg-gradient-to-b from-[#007E6E]/5 to-white">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-8 md:gap-12">
          <div className="flex-1 text-center lg:text-left">
            <div className="flex flex-col gap-3 md:gap-4 mb-4 md:mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#007E6E]/20 rounded-full text-[10px] md:text-xs font-bold text-[#007E6E] shadow-sm uppercase tracking-widest w-fit mx-auto lg:mx-0">
                <CheckCircle2 size={12} /> বাংলাদেশি ব্যবসার জন্য বেস্ট সমাধান
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#007E6E]/10 border border-[#007E6E]/10 rounded-full text-[10px] md:text-xs font-black text-[#007E6E] shadow-sm uppercase tracking-widest w-fit mx-auto lg:mx-0 ring-1 ring-[#007E6E]/20">
                <Heart size={12} className="fill-[#007E6E]" /> Developed by Template Bazar BD
              </div>
            </div>
            <h1 className="text-3xl md:text-6xl font-black text-slate-900 leading-tight mb-4 md:mb-6 tracking-tight">
              ব্যবসা পরিচালনা করুন স্মার্ট ও <span className="text-[#007E6E]">সহজ</span> উপায়ে
            </h1>
            <p className="text-sm md:text-xl text-slate-500 mb-6 md:mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium px-2 md:px-0">
              Template Bazar BD-র তৈরি এই সফটওয়্যারে ক্লায়েন্ট, প্রজেক্ট এবং বিক্রয় ম্যানেজ করুন সব এক জায়গায়। সময় বাঁচান, আয় বাড়ান এবং পেশাদারিত্ব বজায় রাখুন।
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 justify-center lg:justify-start">
              <Link to="/register" className="w-full sm:w-auto px-8 py-3.5 md:px-10 md:py-4 bg-[#007E6E] text-white rounded-xl md:rounded-2xl font-bold text-base md:text-lg shadow-xl hover:scale-105 transition-all text-center">
                বিনামূল্যে শুরু করুন
              </Link>
              <a href="https://wa.me/8801843067118" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-8 py-3.5 md:px-10 md:py-4 bg-white text-emerald-600 rounded-xl md:rounded-2xl font-bold text-base md:text-lg border border-emerald-100 hover:bg-emerald-50 flex items-center justify-center gap-2 md:gap-3 transition-all shadow-sm">
                <MessageSquare size={18} /> হোয়াটসঅ্যাপ চ্যাট
              </a>
            </div>
          </div>
          <div className="flex-1 w-full max-w-lg lg:max-w-none relative px-4 md:px-0">
            <div className="bg-white p-2 md:p-3 rounded-[2rem] md:rounded-[2.5rem] border border-[#007E6E]/10 shadow-3xl relative z-10">
              <img src={dashboardImages[0]} className="w-full rounded-[1.8rem] md:rounded-[2.2rem]" alt="Dashboard" />
            </div>
            <div className="absolute -top-5 -right-5 md:-top-10 md:-right-10 w-32 h-32 md:w-48 md:h-48 bg-[#007E6E]/10 blur-3xl rounded-full"></div>
            <div className="absolute -bottom-5 -left-5 md:-bottom-10 md:-left-10 w-32 h-32 md:w-48 md:h-48 bg-[#007E6E]/10 blur-3xl rounded-full"></div>
          </div>
        </div>
      </section>

      {/* 3. STATS */}
      <section className="py-8 md:py-16 bg-white border-y border-slate-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { l: 'সক্রিয় ইউজার', v: '১,০০০+' },
            { l: 'প্রজেক্ট ম্যানেজড', v: '১০,০০০+' },
            { l: 'সন্তুষ্ট ক্লায়েন্ট', v: '৫০০+' },
            { l: 'সাপোর্ট', v: '২৪/৭' }
          ].map((s, i) => (
            <div key={i} className="bg-[#007E6E]/5 p-4 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-[#007E6E]/10 text-center hover:bg-white hover:shadow-xl transition-all group">
              <p className="text-xl md:text-3xl font-black text-[#007E6E] mb-1 group-hover:scale-110 transition-transform">{s.v}</p>
              <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. PROBLEM SECTION */}
      <section id="problems" className="py-12 md:py-24 bg-rose-50/50 px-4 md:px-6 md:rounded-[4rem] mx-0 md:mx-6 mb-8 md:mb-16 shadow-inner">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl md:text-5xl font-black text-slate-900 mb-8 md:mb-12 tracking-tight">
            ব্যবসা পরিচালনায় কি এই <span className="text-rose-500">সমস্যাগুলো</span> ফেস করছেন?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {[
              { t: 'তথ্য হারিয়ে যাওয়া', d: 'ম্যানুয়াল খাতায় হিসাব রাখলে ক্লায়েন্টের তথ্য বা পেমেন্টের হিসাব হারিয়ে যেতে পারে।', i: <AlertTriangle /> },
              { t: 'ডেডলাইন মিস করা', d: 'প্রজেক্ট ট্র্যাকিং না থাকায় কাজ সময়মতো ডেলিভারি দেওয়া কঠিন হয়ে পড়ে।', i: <Clock /> },
              { t: 'বকেয়া হিসাবের জটিলতা', d: 'কে কত টাকা পাবে আর কত পেমেন্ট হলো, তার সঠিক হিসাব থাকে না।', i: <FileText /> },
              { t: 'যোগাযোগের অভাব', d: 'ক্লায়েন্টের সাথে কখন কি কথা হয়েছে তার কোনো রেকর্ড থাকে না।', i: <MessageSquare /> },
              { t: 'হিসাবে ভুল হওয়া', d: 'হাতে ক্যালকুলেশন করতে গেলে ভুলের সম্ভাবনা অনেক বেশি থাকে যা ব্যবসায় ক্ষতি আনে।', i: <BarChart3 /> },
              { t: 'রিপোর্ট তৈরিতে দেরি', d: 'মাস শেষে ব্যবসার লাভ-ক্ষতির রিপোর্ট বের করতে অনেক সময় ও কষ্ট হয়।', i: <FileText /> }
            ].map((p, idx) => (
              <div key={idx} className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-rose-100 text-left shadow-sm hover:shadow-xl transition-all">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-rose-100 text-rose-500 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6">{p.i}</div>
                <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-2 md:mb-4">{p.t}</h3>
                <p className="text-sm md:text-base text-slate-500 leading-relaxed font-medium">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. WHO IT'S FOR */}
      <section id="who" className="py-12 md:py-24 px-4 md:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-5xl font-black text-slate-900 text-center mb-8 md:mb-16 tracking-tight">
            এই সফটওয়্যারটি <span className="text-[#007E6E]">কারা</span> ব্যবহার করবে?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
            {[
              { t: 'ফ্রিল্যান্সার', d: 'আপনার গ্লোবাল এবং লোকাল ক্লায়েন্ট ম্যানেজ করুন এক জায়গায়।', i: <Users2 size={24} className="md:w-[28px]" /> },
              { t: 'ডিজিটাল এজেন্সি', d: 'একাধিক প্রজেক্ট এবং টিমের কাজের নিখুঁত রিপোর্ট পান।', i: <Briefcase size={24} className="md:w-[28px]" /> },
              { t: 'ক্ষুদ্র ও মাঝারি ব্যবসা', d: 'প্রতিদিনের বিক্রয় এবং আয়ের হিসাব রাখুন পেশাদার উপায়ে।', i: <Target size={24} className="md:w-[28px]" /> }
            ].map((card, i) => (
              <div key={i} className="p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] bg-[#007E6E]/5 border border-transparent hover:border-[#007E6E]/20 hover:bg-white hover:shadow-xl transition-all text-center group">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-[#007E6E] text-white rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center mx-auto mb-4 md:mb-8 shadow-lg group-hover:rotate-6 transition-all">
                  {card.i}
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2 md:mb-4">{card.t}</h3>
                <p className="text-sm md:text-base text-slate-500 leading-relaxed font-medium">{card.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. WHY US */}
      <section id="why" className="py-12 md:py-24 bg-slate-50 px-4 md:px-6 md:rounded-[4rem] mx-0 md:mx-6 mb-8 md:mb-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-5xl font-black text-slate-900 text-center mb-8 md:mb-16 tracking-tight">কেন আপনি আমাদের <span className="text-[#007E6E]">বেছে নেবেন?</span></h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {[
              { t: '১০০% বাংলা ইন্টারফেস', d: 'পুরো সফটওয়্যারটি বাংলায় ডিজাইন করা, তাই ব্যবহার করা খুবই সহজ।', i: <Lightbulb /> },
              { t: 'রিয়েল-টাইম রিপোর্ট', d: 'ব্যবসায় প্রতিদিন কত আয় হলো আর কত বকেয়া রইলো তা তাৎক্ষণিক দেখতে পাবেন।', i: <BarChart3 /> },
              { t: 'নিরাপদ ক্লাউড স্টোরেজ', d: 'আপনার সব তথ্য নিরাপদ ক্লাউডে সুরক্ষিত থাকবে, যা যেকোনো জায়গা থেকে এক্সেসযোগ্য।', i: <ShieldCheck /> },
              { t: 'মোবাইল ফ্রেন্ডলি', d: 'ল্যাপটপের পাশাপাশি আপনার মোবাইলেও এটি অনায়াসে ব্যবহার করতে পারবেন।', i: <Smartphone /> },
              { t: 'স্বয়ংক্রিয় পেমেন্ট ট্র্যাকিং', d: 'বিকাশ, নগদ বা ব্যাংকের পেমেন্টগুলো নিখুঁতভাবে রেকর্ড রাখা সম্ভব।', i: <CheckCircle2 /> },
              { t: '২৪/৭ সাপোর্ট টিম', d: 'সফটওয়্যার ব্যবহারে যেকোনো সমস্যায় আমাদের বাংলা সাপোর্ট টিম সবসময় পাশে আছে।', i: <Users2 /> }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-4 md:gap-6 bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-slate-100 hover:border-[#007E6E]/30 hover:shadow-xl transition-all group">
                <div className="shrink-0 w-12 h-12 md:w-16 md:h-16 bg-[#007E6E] text-white rounded-xl md:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">{item.i}</div>
                <div>
                  <h4 className="text-lg md:text-2xl font-bold mb-2 md:mb-3 text-slate-800">{item.t}</h4>
                  <p className="text-sm md:text-base text-slate-500 leading-relaxed font-medium">{item.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FEATURES SECTION */}
      <section id="features" className="py-12 md:py-24 bg-[#007E6E]/10 px-4 md:px-6 md:rounded-[4rem] mx-0 md:mx-6 mb-8 md:mb-16 shadow-inner">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-5xl font-black text-slate-900 text-center mb-8 md:mb-16 tracking-tight">পাওয়ারফুল <span className="text-slate-700">ফিচারসমূহ</span></h2>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {[
              { t: 'ক্লায়েন্ট ডিরেক্টরি', d: 'সব ক্লায়েন্টের তথ্য ও কন্টাক্ট এক জায়গায়।', i: <Users2 /> },
              { t: 'প্রজেক্ট ট্র্যাকার', d: 'কাজের অগ্রগতি মনিটর করুন।', i: <Briefcase /> },
              { t: 'ইনভয়েস সিস্টেম', d: 'রশিদ এবং পেমেন্ট ট্র্যাকিং।', i: <FileText /> },
              { t: 'টার্গেট মনিটর', d: 'মাসিক লক্ষ্যমাত্রা দেখুন।', i: <Target /> },
              { t: 'সার্ভিস ক্যাটালগ', d: 'সার্ভিস ও মূল্য সেট করুন।', i: <Layers /> },
              { t: 'টাস্ক লিস্ট', d: 'কাজ ভাগ করে সম্পন্ন করুন।', i: <CheckCircle2 /> },
              { t: 'অটো ব্যাকআপ', d: 'ডাটা অটোমেটিক ব্যাকআপ।', i: <ShieldCheck /> },
              { t: 'ইউজার ম্যানেজমেন্ট', d: 'রোল ভিত্তিক এক্সেস কন্ট্রোল।', i: <Settings /> }
            ].map((f, i) => (
              <div key={i} className="bg-white p-4 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] shadow-sm border border-white hover:border-[#007E6E]/30 transition-all hover:shadow-lg">
                <div className="w-8 h-8 md:w-12 md:h-12 bg-[#007E6E]/10 text-[#007E6E] rounded-lg md:rounded-2xl flex items-center justify-center mb-3 md:mb-5">{f.i}</div>
                <h4 className="text-sm md:text-lg font-bold text-slate-800 mb-1 md:mb-3">{f.t}</h4>
                <p className="text-[10px] md:text-sm text-slate-500 leading-relaxed font-medium hidden sm:block">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. HOW IT WORKS */}
      <section className="py-12 md:py-24 px-4 md:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-5xl font-black text-slate-900 text-center mb-8 md:mb-16 tracking-tight">কিভাবে ব্যবহার শুরু করবেন?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[
              { t: 'অ্যাকাউন্ট খুলুন', d: 'রেজিস্ট্রেশন করুন।', i: <Users2 /> },
              { t: 'ক্লায়েন্ট যোগ করুন', d: 'সব ক্লায়েন্ট লিস্ট করুন।', i: <CheckCircle2 /> },
              { t: 'প্রজেক্ট শুরু করুন', d: 'কাজ ট্র্যাকিং করুন।', i: <Briefcase /> },
              { t: 'পেমেন্ট ম্যানেজ করুন', d: 'আয়ের হিসাব রাখুন।', i: <Zap /> }
            ].map((s, i) => (
              <div key={i} className="text-center group">
                 <div className="w-12 h-12 md:w-16 md:h-16 bg-[#007E6E]/10 text-[#007E6E] rounded-full flex items-center justify-center mx-auto mb-3 md:mb-6 border border-[#007E6E]/20 group-hover:bg-[#007E6E] group-hover:text-white transition-all shadow-md">
                   {s.i}
                 </div>
                 <h4 className="text-base md:text-xl font-bold text-slate-800 mb-1 md:mb-2">{s.t}</h4>
                 <p className="text-xs md:text-base text-slate-500 font-medium hidden sm:block">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. PRICING */}
      <section id="pricing" className="py-12 md:py-24 px-4 md:px-6 bg-[#007E6E]/5 md:rounded-[4rem] mx-0 md:mx-6 mb-8 md:mb-16 border border-[#007E6E]/10 shadow-inner">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl md:text-5xl font-black text-slate-900 mb-8 md:mb-16 tracking-tight">পছন্দের প্ল্যানটি বেছে নিন</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { name: 'ফ্রি ট্রায়াল', price: '৳০', dur: '৭ দিন', pop: false },
              { name: 'স্টার্টার', price: '৳১৯৯', dur: '২ মাস', pop: true },
              { name: 'প্রফেশনাল', price: '৳৪৯৯', dur: '৬ মাস', pop: false }
            ].map((p, i) => (
              <div key={i} className={`bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3.5rem] border-2 transition-all relative ${p.pop ? 'border-[#007E6E] shadow-2xl md:scale-105 z-10' : 'border-slate-100 shadow-sm'}`}>
                {p.pop && <span className="absolute -top-4 md:-top-5 left-1/2 -translate-x-1/2 bg-[#007E6E] text-white px-6 md:px-8 py-1.5 md:py-2 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest shadow-xl">সেরা ভ্যালু</span>}
                <h3 className="text-base md:text-lg font-black text-slate-400 mb-4 md:mb-8 uppercase tracking-widest">{p.name}</h3>
                <div className="mb-6 md:mb-10">
                  <span className="text-4xl md:text-6xl font-black text-slate-900">{p.price}</span>
                  <div className="mt-2 md:mt-4 text-[#007E6E] font-bold text-xs md:text-base bg-[#007E6E]/10 px-4 md:px-6 py-1 md:py-2 rounded-full inline-block">{p.dur} ব্যবহারের জন্য</div>
                </div>
                <ul className="space-y-3 md:space-y-4 mb-6 md:mb-10 text-left text-xs md:text-sm font-bold text-slate-600">
                  {featuresList.map((f, idx) => (
                    <li key={idx} className="flex items-center gap-3 md:gap-4">
                      <div className="w-5 h-5 md:w-6 md:h-6 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center shrink-0">✓</div>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/register" className={`w-full py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-base md:text-lg text-center block transition-all ${p.pop ? 'bg-[#007E6E] text-white shadow-xl hover:brightness-110' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>শুরু করুন</Link>
              </div>
            ))}
          </div>
          <p className="mt-6 md:mt-10 text-[10px] md:text-sm text-slate-400 font-bold">* সব প্ল্যানে একই ফিচার সুবিধা পাওয়া যাবে।</p>
        </div>
      </section>

      {/* 10. FAQ */}
      <section id="faq" className="py-12 md:py-24 px-4 md:px-6 max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-5xl font-black text-slate-900 text-center mb-8 md:mb-16 tracking-tight">প্রায়শই জিজ্ঞাসিত প্রশ্ন</h2>
        <div className="space-y-3 md:space-y-4">
          {[
            { q: 'সফটওয়্যারটি কি মোবাইলে ব্যবহার করা যাবে?', a: 'হ্যাঁ, আমাদের সফটওয়্যারটি সম্পূর্ণ রেসপন্সিভ। মোবাইল এবং ল্যাপটপ যেকোনো ডিভাইস থেকে এটি অনায়াসে ব্যবহার করা যাবে।' },
            { q: 'ফ্রি ট্রায়ালের পর কি ডেটা ডিলিট হয়ে যাবে?', a: 'না, আপনার ডেটা সুরক্ষিত থাকবে। মেয়াদের পর প্ল্যান রিনিউ করলে আপনি সব আবার এক্সেস করতে পারবেন।' },
            { q: 'আমার ডেটা কতটা নিরাপদ?', a: 'আমরা ব্যাংক-লেভেল সিকিউরিটি এবং এনক্রিপশন ব্যবহার করি। আপনার তথ্য সম্পূর্ণ গোপনীয় থাকবে।' },
            { q: 'পেমেন্ট কিভাবে করতে হবে?', a: 'আপনি বিকাশ, নগদ বা যেকোনো লোকাল ব্যাংক কার্ড দিয়ে পেমেন্ট করতে পারবেন।' }
          ].map((item, i) => (
            <div key={i} className="bg-white p-5 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-100 hover:border-[#007E6E]/40 hover:shadow-xl transition-all">
              <h4 className="font-bold text-slate-900 mb-2 md:mb-4 flex gap-3 md:gap-4 text-base md:text-lg">
                <span className="text-[#007E6E] font-black shrink-0">প্র:</span>
                {item.q}
              </h4>
              <p className="text-sm md:text-base text-slate-500 leading-relaxed pl-7 md:pl-10 font-medium">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 11. COMPACT FOOTER (Remains compact as requested) */}
      <footer className="bg-[#007E6E] pt-16 pb-8 px-6 text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-black/5"></div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 relative z-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#007E6E] shadow-2xl">
                <Zap size={22} />
              </div>
              <span className="text-xl font-black tracking-tight">ClientFlow Pro</span>
            </div>
            <p className="text-blue-50 text-sm font-medium opacity-80 leading-relaxed mb-6">বাংলাদেশি ব্যবসার জন্য সবচাইতে সহজ ও স্মার্ট ম্যানেজমেন্ট সিস্টেম।</p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all border border-white/10"><Facebook size={16} /></a>
              <a href="#" className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all border border-white/10"><Instagram size={16} /></a>
              <a href="#" className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all border border-white/10"><Youtube size={16} /></a>
              <a href="#" className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all border border-white/10"><Music2 size={16} /></a>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-8 md:col-span-2">
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-200 mb-6">দ্রুত লিঙ্ক</h4>
              <ul className="space-y-3 text-blue-50 text-xs font-bold opacity-90">
                {navLinks.slice(0, 4).map(link => (
                  <li key={link.id}><button onClick={() => scrollToSection(link.id)} className="hover:text-white transition-all">{link.label}</button></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-200 mb-6">কোম্পানি</h4>
              <ul className="space-y-3 text-blue-50 text-xs font-bold opacity-90">
                <li className="hover:text-white cursor-pointer">আমাদের সম্পর্কে</li>
                <li className="hover:text-white cursor-pointer">প্রাইভেসি পলিসি</li>
                <li className="hover:text-white cursor-pointer">টার্মস</li>
              </ul>
            </div>
          </div>

          <div className="bg-white/10 p-6 rounded-[2rem] border border-white/10 backdrop-blur-xl md:col-span-1">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-200 mb-4">যোগাযোগ</h4>
            <div className="space-y-2 mb-6">
              <p className="text-xs font-bold text-white">templatebazarbd@gmail.com</p>
              <p className="text-lg font-black text-white">+88 01843 067 118</p>
            </div>
            <a href="https://wa.me/8801843067118" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-white text-emerald-600 w-full py-2.5 rounded-xl font-black text-xs hover:scale-105 transition-all shadow-xl">
              <MessageSquare size={16} /> হোয়াটসঅ্যাপ চ্যাট
            </a>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-[0.1em] text-blue-100/60 border-t border-white/10 pt-8 text-center">
          <span>© 2025 ClientFlow Pro. সর্বস্বত্ব সংরক্ষিত।</span>
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <div className="flex items-center gap-1">
              <span>developed by</span>
              <span className="px-4 py-1.5 bg-white text-[#007E6E] rounded-full font-black text-[11px] shadow-lg">Template Bazar BD</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
