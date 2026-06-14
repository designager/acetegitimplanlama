import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { CalendarDays, Lock, Mail, Loader2, LogIn } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message === 'Invalid login credentials') {
          setError('E-posta veya şifre hatalı.');
        } else {
          setError(error.message);
        }
      } else {
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }
      }
    } catch (err: any) {
      setError('Giriş yapılırken beklenmeyen bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EDEAE4] p-4 relative overflow-hidden"
         style={{
           background: 'linear-gradient(135deg, #111C4E 0%, #1B2A6B 40%, #B76E79 100%)'
         }}>
      
      {/* Dekoratif Arka Plan Çemberleri */}
      <div className="absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] rounded-full bg-[#B76E79]/20 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-[#111C4E]/40 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md card-glass p-8 md:p-10 relative z-10" style={{ background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(20px)' }}>
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg mb-4" style={{ background: 'linear-gradient(135deg, #B76E79 0%, #D4959E 100%)' }}>
            <CalendarDays size={28} color="white" strokeWidth={2} />
          </div>
          <h1 className="text-3xl font-display font-bold text-[#111C4E] text-center mb-1">
            Kayıt Planı
          </h1>
          <p className="text-[#6B7280] text-sm text-center">Yönetim Paneline Giriş Yapın</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-6 border border-red-100 flex items-start gap-2">
            <span className="shrink-0 mt-0.5">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-[#111C4E] uppercase tracking-wider mb-1.5 ml-1">E-posta</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/50 border border-gray-200 focus:border-[#B76E79] focus:ring-2 focus:ring-[#B76E79]/20 rounded-xl outline-none transition-all"
                placeholder="ornek@kurum.com"
                required
              />
              <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#111C4E] uppercase tracking-wider mb-1.5 ml-1">Şifre</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/50 border border-gray-200 focus:border-[#B76E79] focus:ring-2 focus:ring-[#B76E79]/20 rounded-xl outline-none transition-all"
                placeholder="••••••••"
                required
              />
              <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center justify-between mt-2">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className="relative flex items-center justify-center w-5 h-5">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-[6px] checked:border-[#B76E79] checked:bg-[#B76E79] transition-all cursor-pointer"
                />
                <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-600 group-hover:text-[#111C4E] transition-colors select-none">
                Beni Hatırla
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1B2A6B] hover:bg-[#111C4E] text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2 mt-4 disabled:opacity-70"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                <LogIn size={18} />
                <span>Giriş Yap</span>
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
