import { useState } from 'react';
import { useStore } from '../store/useStore';
import { LogoUploader } from '../components/LogoUploader';
import { Plus, Trash2, Edit2, Check, X, Building2 } from 'lucide-react';

export const Institutions = () => {
  const { institutions, addInstitution, updateInstitution, deleteInstitution } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [logoBase64, setLogoBase64] = useState<string>('');

  const resetForm = () => { setName(''); setLogoBase64(''); setIsAdding(false); setEditingId(null); };

  const handleSave = () => {
    if (!name.trim()) return;
    if (editingId) {
      updateInstitution(editingId, { name, logoBase64 });
    } else {
      addInstitution({ id: crypto.randomUUID(), name, logoBase64, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    resetForm();
  };

  const startEdit = (inst: any) => { setEditingId(inst.id); setName(inst.name); setLogoBase64(inst.logoBase64 || ''); setIsAdding(true); };

  return (
    <div style={{ padding: '32px', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1>Kurum Yönetimi</h1>
          <p>Şirket bünyesindeki eğitim kurumlarını yönetin.</p>
        </div>
        {!isAdding && (
          <button onClick={() => setIsAdding(true)} className="btn-primary">
            <Plus size={15} />
            Yeni Kurum Ekle
          </button>
        )}
      </div>

      {isAdding && (
        <div style={{
          background: 'rgba(10, 17, 40, 0.85)',
          borderRadius: '20px',
          padding: '28px',
          marginBottom: '24px',
          border: '1px solid rgba(183,110,121,0.3)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          backdropFilter: 'blur(20px)'
        }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.2rem', color: '#F2E0E2', marginBottom: '20px' }}>
            {editingId ? 'Kurumu Düzenle' : 'Yeni Kurum'}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label className="field-label">Kurum Adı</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
                placeholder="Örn: X Eğitim Kurumu"
                autoFocus
              />
            </div>
            <div>
              <label className="field-label">Kurum Logosu (Opsiyonel)</label>
              <LogoUploader currentLogo={logoBase64} onLogoSelect={setLogoBase64} onLogoRemove={() => setLogoBase64('')} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(183,110,121,0.1)' }}>
            <button onClick={handleSave} className="btn-primary">
              <Check size={15} /> Kaydet
            </button>
            <button onClick={resetForm} className="btn-secondary">
              <X size={15} /> İptal
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
        {institutions.map(inst => (
          <div key={inst.id} style={{
            background: 'rgba(10, 17, 40, 0.6)',
            backdropFilter: 'blur(12px)',
            borderRadius: '18px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            border: '1px solid rgba(183,110,121,0.2)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            transition: 'all 0.2s ease',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(0,0,0,0.3)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)'; }}
          >
            {inst.logoBase64 ? (
              <img src={inst.logoBase64} alt={inst.name} style={{ height: '56px', objectFit: 'contain', marginBottom: '16px' }} />
            ) : (
              <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'linear-gradient(135deg, rgba(10, 17, 40, 0.8), rgba(183,110,121,0.15))', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Building2 size={24} color="#B76E79" opacity={0.6} />
              </div>
            )}
            <h3 style={{ fontWeight: 600, fontSize: '0.95rem', color: '#F3F4F6', marginBottom: '16px' }}>{inst.name}</h3>
            <div style={{ display: 'flex', gap: '8px', width: '100%', paddingTop: '16px', borderTop: '1px solid rgba(183,110,121,0.1)', marginTop: 'auto' }}>
              <button onClick={() => startEdit(inst)} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', background: 'rgba(183,110,121,0.1)', cursor: 'pointer', color: '#F2E0E2', display: 'flex', justifyContent: 'center', transition: 'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(183,110,121,0.2)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(183,110,121,0.1)')}>
                <Edit2 size={15} />
              </button>
              <button onClick={() => { if (window.confirm('Bu kurumu silmek istediğinize emin misiniz?')) deleteInstitution(inst.id); }}
                style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', background: 'rgba(239,68,68,0.06)', cursor: 'pointer', color: '#EF4444', display: 'flex', justifyContent: 'center', transition: 'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.12)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.06)')}>
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
        {institutions.length === 0 && !isAdding && (
          <div style={{ gridColumn: '1 / -1', padding: '64px 24px', textAlign: 'center', background: 'rgba(10, 17, 40, 0.5)', borderRadius: '16px', border: '2px dashed rgba(183,110,121,0.2)' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(183,110,121,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Building2 size={24} color="#B76E79" opacity={0.4} />
            </div>
            <p style={{ color: '#9CA3AF', fontWeight: 500 }}>Henüz kurum eklenmedi</p>
            <p style={{ fontSize: '0.8rem', color: '#C4C9D4', marginTop: '4px' }}>Sağ üstteki butonu kullanarak kurum ekleyebilirsiniz</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Institutions;
