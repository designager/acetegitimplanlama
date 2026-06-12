import { Sparkles } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Dashboard() {
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
}
