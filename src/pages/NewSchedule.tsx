import { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { ScheduleTable } from '../components/ScheduleTable';
import { generateTimeSlots } from '../utils/timeHelpers';
import type { ScheduleConfig, ScheduleRow } from '../types';
import { Save, Download, SlidersHorizontal, ChevronDown, Target, MapPin } from 'lucide-react';

export const NewSchedule = () => {
  const { institutions, globalLogo, addSchedule } = useStore();

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
    
    try {
      const { exportScheduleToPDF } = await import('../utils/pdfGenerator');
      await exportScheduleToPDF({
      tableElementId: 'schedule-table-container',
      institutionName: selectedInstitution.name,
      institutionLogo: selectedInstitution.logoBase64,
      globalTarget,
      globalLogo: globalLogo || undefined,
    });
    
    // PDF başarıyla oluşturulunca, sisteme (Dashboard için) kaydet
    addSchedule({
      id: crypto.randomUUID(),
      institutionId: selectedInstitution.id,
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      rows: rows,
      globalTarget: globalTarget,
      config: config
      });
    } catch (error) {
      console.error('PDF Export Error:', error);
      alert('PDF oluşturulurken bir hata meydana geldi.');
    } finally {
      setIsPdfLoading(false);
    }
  };

  const handleSaveDraft = () => {
    if (!selectedInstitution) { alert('Lütfen önce bir kurum seçin.'); return; }
    addSchedule({
      id: crypto.randomUUID(),
      institutionId: selectedInstitution.id,
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      rows: rows,
      globalTarget: globalTarget,
      config: config
    });
    alert('Planlama sisteme kaydedildi!');
  };

  return (
    <div className="p-4 md:p-8 max-w-[1200px] mx-auto">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-6 md:mb-7 flex-wrap gap-4 md:gap-4">
        <div>
          <h1 className="font-display text-[1.5rem] md:text-[1.875rem] font-bold text-[#111C4E] mb-1">
            Kayıt Planı
          </h1>
          <p className="text-[#9CA3AF] text-xs md:text-sm">Genel planlama oluşturun ve PDF olarak kaydedin.</p>
        </div>
        <div className="flex w-full md:w-auto gap-2 md:gap-3 items-center">
          <button onClick={handleSaveDraft} className="btn-secondary flex-1 md:flex-none justify-center">
            <Save size={15} />
            <span className="whitespace-nowrap">Taslak Kaydet</span>
          </button>
          <button
            onClick={handleDownloadPDF}
            className="btn-primary flex-1 md:flex-none justify-center"
            disabled={isPdfLoading}
            style={{ opacity: isPdfLoading ? 0.7 : 1, cursor: isPdfLoading ? 'wait' : 'pointer' }}
          >
            <Download size={15} />
            <span className="whitespace-nowrap">{isPdfLoading ? 'Hazırlanıyor…' : 'PDF İndir'}</span>
          </button>
        </div>
      </div>

      {/* Control Strip */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 md:gap-4 mb-4 items-end">
        {/* Kurum */}
        <div>
          <label className="field-label">
            <MapPin size={10} className="inline mr-1" />
            Kurum
          </label>
          <div className="relative">
            <select
              value={selectedInstId}
              onChange={(e) => setSelectedInstId(e.target.value)}
              className="input pr-9"
              style={{ appearance: 'none' }}
            >
              <option value="" disabled>Kurum seçin…</option>
              {institutions.map(inst => (
                <option key={inst.id} value={inst.id}>{inst.name}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Hedef */}
        <div>
          <label className="field-label">
            <Target size={10} className="inline mr-1" />
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
          className={`flex items-center justify-center gap-2 px-4 rounded-xl font-semibold text-[0.82rem] transition-all duration-200 h-[42px] w-full md:w-auto ${
            showConfig 
              ? 'border border-[#B76E79]/40 bg-[#B76E79]/10 text-[#B76E79]' 
              : 'border border-[#1B2A6B]/10 bg-white/80 text-gray-500 hover:bg-white'
          }`}
        >
          <SlidersHorizontal size={15} />
          <span>Zaman</span>
          <span className={`px-2 py-0.5 rounded-md text-[0.7rem] font-bold ${
            showConfig ? 'bg-[#B76E79]/15 text-[#B76E79]' : 'bg-[#1B2A6B]/5 text-[#1B2A6B]'
          }`}>{config.intervalMinutes}dk</span>
        </button>
      </div>

      {/* Zaman Ayarları Panel */}
      {showConfig && (
        <div className="bg-gradient-to-br from-[#B76E79]/5 to-[#1B2A6B]/5 border border-[#B76E79]/20 rounded-[14px] p-4 md:p-5 mb-5 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
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
        <div className="flex items-center justify-between mb-3 px-1 md:px-0">
          <span className="text-[0.75rem] md:text-[0.78rem] text-[#9CA3AF]">
            <strong className="text-[#1B2A6B]">{rows.length}</strong> zaman dilimi
          </span>
          {globalTarget && (
            <span className="text-[0.75rem] md:text-[0.78rem] flex items-center gap-1 text-[#B76E79] bg-[#B76E79]/10 px-2.5 py-1 rounded-full">
              <Target size={11} />
              {globalTarget}
            </span>
          )}
        </div>
      )}

      {/* Table */}
      {selectedInstId ? (
        <div id="schedule-table-container" className="bg-white rounded-2xl shadow-sm border border-[#1B2A6B]/5">
          <ScheduleTable timeSlots={timeSlots} rows={rows} onRowsChange={setRows} />
        </div>
      ) : (
        <div className="py-12 md:py-16 px-6 text-center bg-white/60 rounded-2xl border-2 border-dashed border-[#1B2A6B]/10">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-[#1B2A6B]/5 flex items-center justify-center mx-auto mb-3 md:mb-4">
            <MapPin size={24} className="text-[#1B2A6B] opacity-40" />
          </div>
          <p className="text-[0.85rem] md:text-[0.9rem] text-[#9CA3AF] font-medium">Planlama oluşturmak için bir kurum seçin</p>
          <p className="text-[0.75rem] md:text-[0.8rem] text-[#C4C9D4] mt-1">Kurumlar sayfasından yeni kurum ekleyebilirsiniz</p>
        </div>
      )}
    </div>
  );
};

export default NewSchedule;
