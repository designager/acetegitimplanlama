
import { useStore } from '../store/useStore';
import { LogoUploader } from '../components/LogoUploader';
import { Image as ImageIcon, MonitorSmartphone } from 'lucide-react';

export const SettingsPage = () => {
  const { globalLogo, setGlobalLogo, siteTitle, setSiteTitle, siteFavicon, setSiteFavicon } = useStore();

  return (
    <div style={{ padding: '32px', maxWidth: '1100px', margin: '0 auto' }}>
      <div className="page-header">
        <h1>Sistem Ayarları</h1>
        <p>Genel görünüm, logolar ve tarayıcı ayarlarını yapılandırın.</p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', maxWidth: '800px' }}>
        
        {/* Şirket Logosu */}
        <div style={{
          background: 'rgba(10, 17, 40, 0.85)',
          borderRadius: '20px',
          padding: '28px',
          border: '1px solid rgba(183,110,121,0.25)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          backdropFilter: 'blur(12px)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ padding: '8px', background: 'rgba(183,110,121,0.15)', borderRadius: '10px' }}>
              <ImageIcon size={20} color="#B76E79" />
            </div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', color: '#F2E0E2', margin: 0 }}>Şirket Ana Logosu</h2>
          </div>
          <p style={{ fontSize: '0.875rem', color: '#9CA3AF', marginBottom: '24px', lineHeight: 1.5 }}>
            Bu logo (Örn: ACET Yönetim), PDF çıktılarında kurum logosunun üzerinde merkezde gösterilir. Kurumsal kimliğinizi yansıtan yüksek çözünürlüklü bir görsel tercih edin.
          </p>
          <LogoUploader 
            currentLogo={globalLogo || undefined} 
            onLogoSelect={setGlobalLogo} 
            onLogoRemove={() => setGlobalLogo(null)} 
          />
        </div>

        {/* Tarayıcı Ayarları */}
        <div style={{
          background: 'rgba(10, 17, 40, 0.85)',
          borderRadius: '20px',
          padding: '28px',
          border: '1px solid rgba(183,110,121,0.25)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          backdropFilter: 'blur(12px)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ padding: '8px', background: 'rgba(183,110,121,0.15)', borderRadius: '10px' }}>
              <MonitorSmartphone size={20} color="#B76E79" />
            </div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', color: '#F2E0E2', margin: 0 }}>Tarayıcı Görünümü</h2>
          </div>
          <p style={{ fontSize: '0.875rem', color: '#9CA3AF', marginBottom: '24px', lineHeight: 1.5 }}>
            Sitenin tarayıcı sekmesinde nasıl görüneçeğini ayarlayın. Sekme başlığı ve simgesi (favicon) sistem genelinde anında uygulanır.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
            <div>
              <label className="field-label">Sekme Başlığı (Title)</label>
              <input 
                type="text" 
                value={siteTitle}
                onChange={(e) => setSiteTitle(e.target.value)}
                className="input"
                placeholder="Örn: ACET Yönetim Sistemi"
              />
            </div>
            <div>
              <label className="field-label">Favicon (Sekme İkonu)</label>
              <LogoUploader 
                currentLogo={siteFavicon || undefined} 
                onLogoSelect={setSiteFavicon} 
                onLogoRemove={() => setSiteFavicon(null)} 
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SettingsPage;
