
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../App';

const Verify: React.FC = () => {
  const { language, tempRegData, setStoredUser, setTempRegData } = useApp();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate network delay
    setTimeout(() => {
      setLoading(false);
      
      if (tempRegData && code === tempRegData.verificationCode) {
        // Success: Store user and clear temp
        localStorage.setItem('cf_user', JSON.stringify(tempRegData));
        setStoredUser(tempRegData);
        setTempRegData(null);
        alert(language === 'bn' ? 'ভেরিফিকেশন সফল হয়েছে!' : 'Verification successful!');
        navigate('/login');
      } else {
        setError(language === 'bn' ? 'ভুল কোড! আবার চেষ্টা করুন।' : 'Invalid code! Please try again.');
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-2xl border border-slate-100">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          </div>
          <h1 className={`text-2xl font-bold text-slate-800 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
            {language === 'bn' ? 'ইমেইল ভেরিফিকেশন' : 'Verify Your Email'}
          </h1>
          <p className={`text-slate-500 mt-2 text-sm ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
            {language === 'bn' ? `${tempRegData?.email || 'আপনার ইমেইল'} এড্রেসে একটি কোড পাঠানো হয়েছে` : `We've sent a 6-digit code to ${tempRegData?.email || 'your email'}`}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-bold text-center font-english">
            {error}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex justify-center">
            <input 
              type="text" 
              maxLength={6}
              required
              autoFocus
              className="w-full max-w-[240px] text-center text-4xl font-bold tracking-[0.5em] py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/10 font-english"
              placeholder="000000"
              value={code}
              onChange={e => setCode(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : (
              language === 'bn' ? 'কোড নিশ্চিত করুন' : 'Verify & Proceed'
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            type="button"
            onClick={() => alert(`Your new code is: ${tempRegData?.verificationCode}`)}
            className={`text-sm text-indigo-600 font-bold hover:underline ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
            {language === 'bn' ? 'কোড পাননি? আবার পাঠান' : "Didn't receive the code? Resend"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Verify;
