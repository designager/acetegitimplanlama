import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { CalendarDays, Building2, LayoutDashboard, Settings, LogOut } from 'lucide-react';
import { useStore } from './store/useStore';

// Lazy load pages for code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Institutions = lazy(() => import('./pages/Institutions'));
const NewSchedule = lazy(() => import('./pages/NewSchedule'));
const SettingsPage = lazy(() => import('./pages/Settings'));
const Login = lazy(() => import('./pages/Login'));

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
      <span className="whitespace-nowrap hidden md:block">{label}</span>
    </Link>
  );
};

// Mobile bottom nav link
const MobileNavLink = ({ to, icon: Icon, label }: { to: string; icon: React.ElementType; label: string }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl text-[0.65rem] font-semibold transition-all duration-200 flex-1 ${
        isActive
          ? 'text-[#F2E0E2]'
          : 'text-white/40 hover:text-white/70'
      }`}
    >
      <div className={`p-1.5 rounded-lg transition-all ${isActive ? 'bg-[#B76E79]/20' : ''}`}>
        <Icon size={20} strokeWidth={1.8} />
      </div>
      <span>{label}</span>
    </Link>
  );
};

function AppContent() {
  const { siteTitle, siteFavicon, fetchInitialData, isLoading, session, checkSession, signOut } = useStore();

  useEffect(() => {
    checkSession();
  }, []);

  useEffect(() => {
    if (session) {
      fetchInitialData();
    }
  }, [session]);

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

  if (isLoading && session) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#050A1F]">
        <div className="w-12 h-12 border-4 border-[#B76E79]/20 border-t-[#B76E79] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <Suspense fallback={
        <div className="flex h-screen items-center justify-center bg-[#050A1F]">
          <div className="w-12 h-12 border-4 border-[#B76E79]/20 border-t-[#B76E79] rounded-full animate-spin"></div>
        </div>
      }>
        <Login />
      </Suspense>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#050A1F] overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-[240px] shrink-0 flex-col relative z-10" style={{
        background: 'linear-gradient(175deg, #0A1128 0%, #02040A 100%)',
        boxShadow: '4px 0 32px rgba(0, 0, 0, 0.5)',
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
        <div className="px-5 pt-7 pb-5 border-b border-white/5 mb-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0 shadow-[0_4px_12px_rgba(183,110,121,0.4)]" style={{ background: 'linear-gradient(135deg, #B76E79 0%, #D4959E 100%)' }}>
              <CalendarDays size={18} color="white" strokeWidth={2} />
            </div>
            <div>
              <div className="font-display text-[1rem] font-bold text-[#F2E0E2] leading-tight">Kayıt</div>
              <div className="font-display text-[1rem] font-bold text-[#F2E0E2]/60 leading-tight">Planı</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 flex flex-col gap-1">
          <p className="text-[0.65rem] font-semibold tracking-widest uppercase text-white/25 px-3 pt-2 pb-1">MENÜ</p>
          {NAV_ITEMS.map(item => (
            <NavLink key={item.to} to={item.to} icon={item.icon} label={item.label} />
          ))}
        </nav>

        {/* Footer */}
        <div className="mt-auto border-t border-white/5">
          <button 
            onClick={signOut}
            className="w-full flex items-center gap-3 px-5 py-4 text-sm font-medium text-white/55 hover:text-white/85 hover:bg-white/5 transition-all text-left"
          >
            <LogOut size={18} strokeWidth={1.8} />
            <span className="whitespace-nowrap">Çıkış Yap</span>
          </button>
          <div className="px-5 pb-4 text-[0.7rem] text-white/25 text-center">
            © 2026 ACET Yönetim Sistemi
          </div>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-white/5 shrink-0" style={{ background: 'linear-gradient(90deg, #0A1128 0%, #02040A 100%)' }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #B76E79 0%, #D4959E 100%)' }}>
            <CalendarDays size={14} color="white" strokeWidth={2} />
          </div>
          <span className="font-display text-[0.95rem] font-bold text-[#F2E0E2]">Kayıt Planı</span>
        </div>
        <button onClick={signOut} className="p-2 text-white/40 hover:text-white/70 transition-colors">
          <LogOut size={18} strokeWidth={1.8} />
        </button>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin pb-20 md:pb-0">
        <Suspense fallback={
          <div className="flex h-full items-center justify-center">
            <div className="w-8 h-8 border-4 border-[#B76E79]/10 border-t-[#B76E79] rounded-full animate-spin"></div>
          </div>
        }>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/schedule/new" element={<NewSchedule />} />
            <Route path="/schedule/edit/:id" element={<NewSchedule />} />
            <Route path="/institutions" element={<Institutions />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </Suspense>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center px-2 py-1 border-t border-white/10" style={{ background: 'rgba(2, 4, 10, 0.95)', backdropFilter: 'blur(20px)' }}>
        {NAV_ITEMS.map(item => (
          <MobileNavLink key={item.to} to={item.to} icon={item.icon} label={item.label} />
        ))}
      </nav>
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
