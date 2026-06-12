import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { CalendarDays, Building2, LayoutDashboard, Settings, Sparkles } from 'lucide-react';
import Institutions from './pages/Institutions';
import NewSchedule from './pages/NewSchedule';
import SettingsPage from './pages/Settings';
import { useStore } from './store/useStore';

const Dashboard = () => (
  <div className="p-8">
    <div className="page-header">
      <h1>Dashboard</h1>
      <p>Son oluşturulan planlamalara buradan ulaşabilirsiniz.</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[
        { label: 'Toplam Kurum', value: '—', color: '#1B2A6B' },
        { label: 'Bu Ay Planlama', value: '—', color: '#B76E79' },
        { label: 'PDF Çıktısı', value: '—', color: '#2E3F8F' },
      ].map((item, i) => (
        <div key={i} className="card-glass p-6" style={{ background: 'rgba(255,255,255,0.7)' }}>
          <p className="text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: '#9CA3AF' }}>{item.label}</p>
          <p className="text-4xl font-display font-bold" style={{ color: item.color }}>{item.value}</p>
        </div>
      ))}
    </div>
    <div className="mt-8 card" style={{ background: 'linear-gradient(135deg, rgba(27,42,107,0.04) 0%, rgba(183,110,121,0.04) 100%)' }}>
      <div className="flex items-center gap-3 mb-2">
        <Sparkles size={18} style={{ color: '#B76E79' }} />
        <span className="font-semibold text-sm" style={{ color: '#1B2A6B' }}>Hızlı Başlangıç</span>
      </div>
      <p className="text-sm" style={{ color: '#6B7280' }}>
        Yeni bir planlama oluşturmak için sol menüden <strong>Kayıt Planı</strong>'nı seçin. PDF çıktısı almadan önce Kurumlar bölümünden kurum bilgilerinizi ekleyin.
      </p>
    </div>
  </div>
);

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
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '10px 14px',
        borderRadius: '10px',
        fontSize: '0.875rem',
        fontWeight: 500,
        textDecoration: 'none',
        transition: 'all 0.2s ease',
        background: isActive
          ? 'linear-gradient(135deg, rgba(183,110,121,0.25) 0%, rgba(183,110,121,0.1) 100%)'
          : 'transparent',
        color: isActive ? '#F2E0E2' : 'rgba(255,255,255,0.55)',
        borderLeft: isActive ? '2px solid #B76E79' : '2px solid transparent',
        marginLeft: '-2px',
      }}
      onMouseEnter={e => {
        if (!isActive) {
          (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)';
          (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.85)';
        }
      }}
      onMouseLeave={e => {
        if (!isActive) {
          (e.currentTarget as HTMLElement).style.background = 'transparent';
          (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.55)';
        }
      }}
    >
      <Icon size={18} strokeWidth={1.8} />
      <span>{label}</span>
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
    <div style={{ display: 'flex', height: '100vh', background: '#EDEAE4', overflow: 'hidden' }}>
      {/* Sidebar */}
      <aside style={{
        width: '240px',
        flexShrink: 0,
        background: 'linear-gradient(175deg, #111C4E 0%, #1B2A6B 60%, #151f54 100%)',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '4px 0 32px rgba(17, 28, 78, 0.25)',
        position: 'relative',
        zIndex: 10,
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
        <div style={{ padding: '28px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #B76E79 0%, #D4959E 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 4px 12px rgba(183,110,121,0.4)',
            }}>
              <CalendarDays size={18} color="white" strokeWidth={2} />
            </div>
            <div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1rem', fontWeight: 700, color: '#F2E0E2', lineHeight: 1.2 }}>Kayıt</div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1rem', fontWeight: 700, color: 'rgba(242,224,226,0.6)', lineHeight: 1.2 }}>Planı</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '8px 14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <p style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', padding: '8px 14px 4px', marginTop: '4px' }}>MENÜ</p>
          {NAV_ITEMS.map(item => (
            <NavLink key={item.to} to={item.to} icon={item.icon} label={item.label} />
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.07)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)', textAlign: 'center' }}>
          © 2026 ACET Yönetim Sistemi
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }} className="scrollbar-thin">
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
