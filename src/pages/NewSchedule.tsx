import { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { ScheduleTable } from '../components/ScheduleTable';
import { generateTimeSlots } from '../utils/timeHelpers';
import type { ScheduleConfig, ScheduleRow } from '../types';
import { Save, Download, SlidersHorizontal, ChevronDown, Target, MapPin } from 'lucide-react';
import { exportScheduleToPDF } from '../utils/pdfGenerator';

export const NewSchedule = () => {
  const { institutions, globalLogo } = useStore();

  const [selectedInstId, setSelectedInstId] = useState<string>(institutions[0]?.id || '');
  const selectedInstitution = useMemo(() => institutions.find(i => i.id === selectedInstId), [institutions, selectedInstId]);

  const [globalTarget, setGlobalTarget] = useState<string>('');

  const [config, setConfig] = useState<ScheduleConfig>({
    startTime: '08:30',
    endTime: '19:30',
    intervalMinutes: 30,
  });

  const [rows, setRows] = useState<ScheduleRow[]>([]);
  const [showConfig, setShowConfig] = useState(false);
  const [isPdfLoading, setIsPdfLoading] = useState(false);

  const timeSlots = useMemo(() => generateTimeSlots(config.startTime, config.endTime, config.intervalMinutes), [config]);

  const handleDownloadPDF = async () => {
    if (!selectedInstitution) { alert('Lütfen bir kurum seçin.'); return; }
    setIsPdfLoading(true);
    await exportScheduleToPDF({
      tableElementId: 'schedule-table-container',
      institutionName: selectedInstitution.name,
      institutionLogo: selectedInstitution.logoBase64,
      globalTarget,
      globalLogo: globalLogo || undefined,
    });
    setIsPdfLoading(false);
  };

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>

      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.875rem', fontWeight: 700, color: '#111C4E', marginBottom: '4px' }}>
            Kayıt Planı
          </h1>
          <p style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>Genel planlama oluşturun ve PDF olarak kaydedin.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button onClick={() => alert('Taslak kaydedildi! (Faz 2)')} className="btn-secondary">
            <Save size={15} />
            Taslak Kaydet
          </button>
          <button
            onClick={handleDownloadPDF}
            className="btn-primary"
            disabled={isPdfLoading}
            style={{ opacity: isPdfLoading ? 0.7 : 1, cursor: isPdfLoading ? 'wait' : 'pointer' }}
          >
            <Download size={15} />
            {isPdfLoading ? 'Hazırlanıyor…' : 'PDF İndir'}
          </button>
        </div>
      </div>

      {/* Control Strip */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr auto',
        gap: '12px',
        marginBottom: '16px',
        alignItems: 'end',
      }}>
        {/* Kurum */}
        <div>
          <label className="field-label">
            <MapPin size={10} style={{ display: 'inline', marginRight: '4px' }} />
            Kurum
          </label>
          <div style={{ position: 'relative' }}>
            <select
              value={selectedInstId}
              onChange={(e) => setSelectedInstId(e.target.value)}
              className="input"
              style={{ appearance: 'none', paddingRight: '36px' }}
            >
              <option value="" disabled>Kurum seçin…</option>
              {institutions.map(inst => (
                <option key={inst.id} value={inst.id}>{inst.name}</option>
              ))}
            </select>
            <ChevronDown size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', pointerEvents: 'none' }} />
          </div>
        </div>

        {/* Hedef */}
        <div>
          <label className="field-label">
            <Target size={10} style={{ display: 'inline', marginRight: '4px' }} />
            Genel Hedef
          </label>
          <input
            type="text"
            value={globalTarget}
            onChange={(e) => setGlobalTarget(e.target.value)}
            className="input"
            placeholder="Örn: 25 Öğrenci"
          />
        </div>

        {/* Zaman Ayarları butonu */}
        <button
          onClick={() => setShowConfig(!showConfig)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            borderRadius: '12px',
            border: showConfig ? '1px solid rgba(183,110,121,0.4)' : '1px solid rgba(27,42,107,0.12)',
            background: showConfig ? 'rgba(183,110,121,0.08)' : 'rgba(255,255,255,0.8)',
            cursor: 'pointer',
            fontSize: '0.82rem',
            fontWeight: 600,
            color: showConfig ? '#B76E79' : '#6B7280',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap',
            height: '42px',
          }}
        >
          <SlidersHorizontal size={15} />
          <span>Zaman</span>
          <span style={{
            background: showConfig ? 'rgba(183,110,121,0.15)' : 'rgba(27,42,107,0.08)',
            color: showConfig ? '#B76E79' : '#1B2A6B',
            padding: '2px 8px',
            borderRadius: '6px',
            fontSize: '0.7rem',
            fontWeight: 700,
          }}>{config.intervalMinutes}dk</span>
        </button>
      </div>

      {/* Zaman Ayarları Panel */}
      {showConfig && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(183,110,121,0.06) 0%, rgba(27,42,107,0.04) 100%)',
          border: '1px solid rgba(183,110,121,0.2)',
          borderRadius: '14px',
          padding: '20px',
          marginBottom: '20px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '16px',
        }}>
          <div>
            <label className="field-label">Başlangıç Saati</label>
            <input type="time" value={config.startTime} onChange={(e) => setConfig({ ...config, startTime: e.target.value })} className="input" />
          </div>
          <div>
            <label className="field-label">Bitiş Saati</label>
            <input type="time" value={config.endTime} onChange={(e) => setConfig({ ...config, endTime: e.target.value })} className="input" />
          </div>
          <div>
            <label className="field-label">Zaman Dilimi</label>
            <div style={{ position: 'relative' }}>
              <select
                value={config.intervalMinutes}
                onChange={(e) => setConfig({ ...config, intervalMinutes: Number(e.target.value) as any })}
                className="input"
                style={{ appearance: 'none', paddingRight: '36px' }}
              >
                <option value={15}>15 Dakika</option>
                <option value={20}>20 Dakika</option>
                <option value={30}>30 Dakika</option>
                <option value={45}>45 Dakika</option>
                <option value={60}>60 Dakika</option>
              </select>
              <ChevronDown size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', pointerEvents: 'none' }} />
            </div>
          </div>
        </div>
      )}

      {/* Row count badge */}
      {selectedInstId && rows.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontSize: '0.78rem', color: '#9CA3AF' }}>
            <strong style={{ color: '#1B2A6B' }}>{rows.length}</strong> zaman dilimi
          </span>
          {globalTarget && (
            <span style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px', color: '#B76E79', background: 'rgba(183,110,121,0.08)', padding: '3px 10px', borderRadius: '20px' }}>
              <Target size={11} />
              {globalTarget}
            </span>
          )}
        </div>
      )}

      {/* Table */}
      {selectedInstId ? (
        <div id="schedule-table-container" style={{ background: 'white', borderRadius: '16px' }}>
          <ScheduleTable timeSlots={timeSlots} rows={rows} onRowsChange={setRows} />
        </div>
      ) : (
        <div style={{
          padding: '64px 24px',
          textAlign: 'center',
          background: 'rgba(255,255,255,0.6)',
          borderRadius: '16px',
          border: '2px dashed rgba(27,42,107,0.12)',
        }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(27,42,107,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <MapPin size={24} color="#1B2A6B" opacity={0.4} />
          </div>
          <p style={{ fontSize: '0.9rem', color: '#9CA3AF', fontWeight: 500 }}>Planlama oluşturmak için bir kurum seçin</p>
          <p style={{ fontSize: '0.8rem', color: '#C4C9D4', marginTop: '4px' }}>Kurumlar sayfasından yeni kurum ekleyebilirsiniz</p>
        </div>
      )}
    </div>
  );
};

export default NewSchedule;
