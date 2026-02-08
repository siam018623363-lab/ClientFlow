
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../App';
import { supabase } from '../../lib/supabase';
import { UserPlus, Mail, Phone, Lock, ChevronRight } from 'lucide-react';

const Register: React.FC = () => {
  const { language } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: { full_name: formData.name, phone: formData.phone },
          emailRedirectTo: `${window.location.origin}/#/login`,
        }
      });

      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          setError(language === 'bn' 
            ? 'এই ইমেইলটি ইতিমধ্যে নিবন্ধিত। অনুগ্রহ করে লগইন করুন।' 
            : 'This email is already registered. Please try logging in.');
        } else {
          throw signUpError;
        }
        return;
      }

      if (data.user) {
        alert(language === 'bn' 
          ? 'আপনার ইমেইলে একটি ভেরিফিকেশন লিঙ্ক পাঠানো হয়েছে। অনুগ্রহ করে ইমেইল কনফার্ম করুন।' 
          : 'A verification link has been sent to your email. Please confirm it.');
        navigate('/login');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#007E6E]/5 via-white to-indigo-50/30 p-4 md:p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#007E6E]/5 rounded-full blur-[80px] md:blur-[100px]"></div>

      <div className="w-full max-w-lg bg-white/90 backdrop-blur-xl rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 shadow-premium border border-white relative z-10 animate-fade-in mx-auto">
        <div className="text-center mb-6 md:mb-10">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-[#007E6E]/10 text-[#007E6E] rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-sm">
            <UserPlus size={28} className="md:w-9 md:h-9" />
          </div>
          <h1 className={`text-2xl md:text-4xl font-black text-slate-800 tracking-tight ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
            {language === 'bn' ? 'রেজিস্ট্রেশন' : 'Create Account'}
          </h1>
          <p className={`text-slate-400 mt-2 text-xs md:text-base font-medium ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
            {language === 'bn' ? 'ব্যবসা ম্যানেজ করতে নতুন অ্যাকাউন্ট তৈরি করুন' : 'Start your management journey today'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 md:p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4 md:space-y-5">
          <div className="grid grid-cols-1 gap-4 md:gap-5">
            <div className="space-y-1.5 md:space-y-2">
              <label className={`block text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 md:ml-2 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
                {language === 'bn' ? 'আপনার নাম' : 'Full Name'}
              </label>
              <input type="text" required className="w-full px-4 md:px-6 py-3 md:py-4 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl outline-none font-english font-bold focus:bg-white focus:ring-4 focus:ring-[#007E6E]/5 focus:border-[#007E6E]/30 transition-all text-sm" placeholder="Tanvir Ahmed" onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            
            <div className="space-y-1.5 md:space-y-2">
              <label className={`block text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 md:ml-2 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
                {language === 'bn' ? 'মোবাইল' : 'Mobile Number'}
              </label>
              <input type="text" required className="w-full px-4 md:px-6 py-3 md:py-4 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl outline-none font-english font-bold focus:bg-white focus:ring-4 focus:ring-[#007E6E]/5 focus:border-[#007E6E]/30 transition-all text-sm" placeholder="01700000000" onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>

            <div className="space-y-1.5 md:space-y-2">
              <label className={`block text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 md:ml-2 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
                {language === 'bn' ? 'ইমেইল' : 'Email Address'}
              </label>
              <input type="email" required className="w-full px-4 md:px-6 py-3 md:py-4 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl outline-none font-english font-bold focus:bg-white focus:ring-4 focus:ring-[#007E6E]/5 focus:border-[#007E6E]/30 transition-all text-sm" placeholder="name@example.com" onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>

            <div className="space-y-1.5 md:space-y-2">
              <label className={`block text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 md:ml-2 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
                {language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
              </label>
              <input type="password" required className="w-full px-4 md:px-6 py-3 md:py-4 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl outline-none font-english font-bold focus:bg-white focus:ring-4 focus:ring-[#007E6E]/5 focus:border-[#007E6E]/30 transition-all text-sm" placeholder="••••••••" onChange={e => setFormData({...formData, password: e.target.value})} />
            </div>
          </div>

          <button type="submit" disabled={loading} className={`w-full py-4 md:py-5 bg-[#007E6E] text-white rounded-xl md:rounded-2xl font-black text-base md:text-lg shadow-xl hover:brightness-110 transition-all flex items-center justify-center gap-2 mt-4 md:mt-6 active:scale-[0.98] ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
            {loading ? 'Processing...' : (language === 'bn' ? 'নিবন্ধন করুন' : 'Sign Up Free')}
            {!loading && <ChevronRight size={18} className="md:w-5 md:h-5" />}
          </button>
        </form>

        <div className="mt-8 md:mt-10 text-center">
          <Link to="/login" className={`text-sm md:text-base text-[#007E6E] font-black hover:underline decoration-2 underline-offset-4 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
            {language === 'bn' ? 'ইতিমধ্যেই অ্যাকাউন্ট আছে? লগইন করুন' : 'Already have an account? Login'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
