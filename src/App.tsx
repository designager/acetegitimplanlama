import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { CalendarDays, Building2, LayoutDashboard, Settings, Sparkles } from 'lucide-react';
import Institutions from './pages/Institutions';
import NewSchedule from './pages/NewSchedule';
import SettingsPage from './pages/Settings';
import { useStore } from './store/useStore';

const Dashboard = () => {
  const { institutions, schedules } = useStore();

  return (
    <div className="p-4 md:p-8">
      <div className="page-header mb-6 md:mb-8">
        <h1 className="text-2xl md:text-[2rem]">Dashboard</h1>
        <p className="text-sm md:text-base">Sistemdeki genel durumunuza buradan ulaşabilirsiniz.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {[
          { label: 'Toplam Kurum', value: institutions.length.toString(), color: '#1B2A6B' },
          { label: 'Kayıtlı Planlama', value: schedules.length.toString(), color: '#B76E79' },
          { label: 'Aktif Kullanıcı', value: '1', color: '#2E3F8F' }, // Gelecekte auth olunca dinamik olacak
        ].map((item, i) => (
          <div key={i} className="card-glass p-5 md:p-6" style={{ background: 'rgba(255,255,255,0.7)' }}>
            <p className="text-xs uppercase tracking-widest font-semibold mb-1 md:mb-2" style={{ color: '#9CA3AF' }}>{item.label}</p>
            <p className="text-3xl md:text-4xl font-display font-bold" style={{ color: item.color }}>{item.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 md:mt-8 card p-4 md:p-6" style={{ background: 'linear-gradient(135deg, rgba(27,42,107,0.04) 0%, rgba(183,110,121,0.04) 100%)' }}>
        <div className="flex items-center gap-2 md:gap-3 mb-2">
          <Sparkles size={18} style={{ color: '#B76E79' }} />
          <span className="font-semibold text-sm md:text-base" style={{ color: '#1B2A6B' }}>Hızlı Başlangıç</span>
        </div>
        <p className="text-xs md:text-sm leading-relaxed" style={{ color: '#6B7280' }}>
          Yeni bir planlama oluşturmak için menüden <strong>Kayıt Planı</strong>'nı seçin. PDF çıktısı almadan önce Kurumlar bölümünden kurum bilgilerinizi ekleyin.
        </p>
      </div>
    </div>
  );
};

const NAV_ITEMS = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/schedule/new', icon: CalendarDays, label: 'Kayıt Planı' },
  { to: '/institutions', icon: Building2, label: 'Kurumlar' },
  { to: '/settings', icon: Settings, label: 'Ayarlar' },
];

const NavLink = ({ to, icon: Icon, label }: { to: string; icon: React.ElementType; label: string }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={`flex items-center gap-2 md:gap-3 px-3 md:px-3.5 py-2 md:py-2.5 rounded-lg md:rounded-xl text-sm font-medium transition-all duration-200 shrink-0 ${
        isActive
          ? 'bg-gradient-to-br from-[#B76E79]/25 to-[#B76E79]/10 text-[#F2E0E2] border-b-2 md:border-b-0 md:border-l-2 border-[#B76E79] md:-ml-[2px]'
          : 'bg-transparent text-white/55 border-b-2 md:border-b-0 md:border-l-2 border-transparent hover:bg-white/5 hover:text-white/85'
      }`}
    >
      <Icon size={18} strokeWidth={1.8} />
      <span className="whitespace-nowrap">{label}</span>
    </Link>
  );
};

function AppContent() {
  const { siteTitle, siteFavicon } = useStore();

  useEffect(() => {
    document.title = siteTitle || 'Kayıt Planı';
    if (siteFavicon) {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = siteFavicon;
    }
  }, [siteTitle, siteFavicon]);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#EDEAE4] overflow-hidden">
      {/* Sidebar / Top Nav */}
      <aside className="w-full md:w-[240px] shrink-0 flex flex-col relative z-10" style={{
        background: 'linear-gradient(175deg, #111C4E 0%, #1B2A6B 60%, #151f54 100%)',
        boxShadow: '4px 0 32px rgba(17, 28, 78, 0.25)',
      }}>
        {/* Decorative glow */}
        <div style={{
          position: 'absolute',
          top: '-60px',
          right: '-40px',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(183,110,121,0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Logo area */}
        <div className="px-4 py-3 md:px-5 md:pt-7 md:pb-5 border-b border-white/5 md:mb-2 flex items-center justify-between md:justify-start">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg md:rounded-[10px] flex items-center justify-center shrink-0 shadow-[0_4px_12px_rgba(183,110,121,0.4)]" style={{ background: 'linear-gradient(135deg, #B76E79 0%, #D4959E 100%)' }}>
              <CalendarDays size={16} className="md:w-[18px] md:h-[18px]" color="white" strokeWidth={2} />
            </div>
            <div>
              <div className="font-display text-[0.9rem] md:text-[1rem] font-bold text-[#F2E0E2] leading-tight">Kayıt</div>
              <div className="font-display text-[0.9rem] md:text-[1rem] font-bold text-[#F2E0E2]/60 leading-tight">Planı</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 md:px-3 py-2 md:py-2 flex flex-row md:flex-col gap-1 md:gap-1 overflow-x-auto md:overflow-visible items-center md:items-stretch scrollbar-none">
          <p className="hidden md:block text-[0.65rem] font-semibold tracking-widest uppercase text-white/25 px-3 pt-2 pb-1">MENÜ</p>
          {NAV_ITEMS.map(item => (
            <NavLink key={item.to} to={item.to} icon={item.icon} label={item.label} />
          ))}
        </nav>

        {/* Footer */}
        <div className="hidden md:block px-5 py-4 border-t border-white/5 text-[0.7rem] text-white/25 text-center">
          © 2026 ACET Yönetim Sistemi
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/schedule/new" element={<NewSchedule />} />
          <Route path="/institutions" element={<Institutions />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
