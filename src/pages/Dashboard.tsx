import { useState, useEffect } from 'react';
import { Sparkles, Calendar, Edit, Trash2, Download, Building2, ChevronRight, Archive, Search, X } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { institutions, schedules, deleteSchedule, globalLogo } = useStore();
  const [activeInstitutionId, setActiveInstitutionId] = useState<string>('all');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [isZipping, setIsZipping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const getInstitutionName = (id: string) => {
    return institutions.find(i => i.id === id)?.name || 'Bilinmeyen Kurum';
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bu planlamayı silmek istediğinize emin misiniz?')) {
      deleteSchedule(id);
    }
  };

  useEffect(() => {
    // Preload pdfGenerator to prevent user gesture timeouts on mobile sharing
    import('../utils/pdfGenerator');
  }, []);

  const handleDirectDownload = async (scheduleId: string) => {
    const schedule = schedules.find(s => s.id === scheduleId);
    if (!schedule) return;
    const institution = institutions.find(i => i.id === schedule.institutionId);
    if (!institution) return;

    setDownloadingId(scheduleId);
    try {
      const { exportScheduleFromData } = await import('../utils/pdfGenerator');
      await exportScheduleFromData({
        institutionName: institution.name,
        institutionLogo: institution.logoBase64,
        globalTarget: schedule.globalTarget,
        globalLogo: globalLogo || undefined,
        rows: schedule.rows || [],
      });
    } catch (error) {
      console.error('PDF indirme hatası:', error);
      alert('PDF oluşturulurken bir hata meydana geldi.');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleBulkZipDownload = async () => {
    if (filteredSchedules.length === 0) return;
    setIsZipping(true);

    try {
      const jszipModule = await import('jszip');
      const JSZip = jszipModule.default || jszipModule;
      // JSZip is a constructor, but depending on the module format, it might need to be called differently
      const zip = typeof JSZip === 'function' ? new JSZip() : new (JSZip as any).default();
      const { exportScheduleFromData } = await import('../utils/pdfGenerator');

      for (const schedule of filteredSchedules) {
        const institution = institutions.find(i => i.id === schedule.institutionId);
        if (!institution) continue;

        const blob = await exportScheduleFromData({
          institutionName: institution.name,
          institutionLogo: institution.logoBase64,
          globalTarget: schedule.globalTarget,
          globalLogo: globalLogo || undefined,
          rows: schedule.rows || [],
          returnBlob: true,
        });

        if (blob) {
          const fileName = `kayit-plani-${institution.name.toLowerCase().replace(/\s+/g, '-')}-${schedule.date}.pdf`;
          zip.file(fileName, blob);
        }
      }

      const zipContent = await zip.generateAsync({ type: 'blob' });
      const zipName = `Kayit-Planlari-${new Date().toISOString().split('T')[0]}.zip`;

      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      // Mobilde Paylaş veya İndir
      if (isMobile && navigator.share && navigator.canShare && navigator.canShare({ files: [new File([zipContent], zipName, { type: 'application/zip' })] })) {
        const file = new File([zipContent], zipName, { type: 'application/zip' });
        await navigator.share({
          title: 'Kayıt Planları ZIP',
          text: 'Seçili kayıt planları paketi',
          files: [file]
        });
      } else {
        const url = URL.createObjectURL(zipContent);
        const a = document.createElement('a');
        a.href = url;
        a.download = zipName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('ZIP oluşturma hatası:', error);
      alert('ZIP oluşturulurken bir hata meydana geldi.');
    } finally {
      setIsZipping(false);
    }
  };

  // Filter schedules by selected institution, search query, and date range
  const filteredSchedules = schedules.filter(s => {
    const instMatch = activeInstitutionId === 'all' || s.institutionId === activeInstitutionId;
    
    let searchMatch = true;
    if (searchQuery.trim()) {
      const instName = getInstitutionName(s.institutionId).toLowerCase();
      searchMatch = instName.includes(searchQuery.toLowerCase());
    }

    let dateMatch = true;
    if (startDate) {
      dateMatch = dateMatch && s.date >= startDate;
    }
    if (endDate) {
      dateMatch = dateMatch && s.date <= endDate;
    }

    return instMatch && searchMatch && dateMatch;
  });

  // Get unique institution IDs that have schedules
  const institutionsWithSchedules = institutions.filter(inst =>
    schedules.some(s => s.institutionId === inst.id)
  );

  return (
    <div className="p-4 md:p-8 max-w-[1200px] mx-auto">
      <div className="page-header mb-6 md:mb-8">
        <h1 className="text-2xl md:text-[2rem]">Cihat Acet, Hoşgeldiniz... 👋</h1>
        <p className="text-sm md:text-base">Sistemdeki genel durumunuza buradan ulaşabilirsiniz.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {[
          { label: 'Toplam Kurum', value: institutions.length.toString(), color: '#F2E0E2' },
          { label: 'Kayıtlı Planlama', value: schedules.length.toString(), color: '#B76E79' },
          { label: 'Aktif Kullanıcı', value: '1', color: '#D4959E' },
        ].map((item, i) => (
          <div key={i} className="card-glass p-5 md:p-6">
            <p className="text-xs uppercase tracking-widest font-semibold mb-1 md:mb-2 text-[#9CA3AF]">{item.label}</p>
            <p className="text-3xl md:text-4xl font-display font-bold" style={{ color: item.color }}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Start */}
      <div className="mt-6 md:mt-8 card p-4 md:p-6" style={{ background: 'linear-gradient(135deg, rgba(10,17,40,0.8) 0%, rgba(183,110,121,0.05) 100%)' }}>
        <div className="flex items-center gap-2 md:gap-3 mb-2">
          <Sparkles size={18} style={{ color: '#B76E79' }} />
          <span className="font-semibold text-sm md:text-base text-[#F2E0E2]">Hızlı Başlangıç</span>
        </div>
        <p className="text-xs md:text-sm leading-relaxed text-[#9CA3AF]">
          Yeni bir planlama oluşturmak için menüden <strong>Kayıt Planı</strong>'nı seçin. PDF çıktısı almadan önce Kurumlar bölümünden kurum bilgilerinizi ekleyin.
        </p>
      </div>

      {/* Kayıtlı Planlamalar */}
      <div className="mt-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <h2 className="text-xl font-display font-bold text-[#F2E0E2]">Kayıtlı Planlamalar</h2>
          
          <div className="flex flex-wrap items-center gap-3">
            {filteredSchedules.length > 0 && (
              <button
                onClick={handleBulkZipDownload}
                disabled={isZipping}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#F2E0E2' }}
              >
                {isZipping ? (
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <Archive size={15} />
                )}
                {isZipping ? 'Paketleniyor...' : 'Toplu İndir (ZIP)'}
              </button>
            )}
            
            <Link
              to="/schedule/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all"
              style={{ background: 'linear-gradient(135deg, #B76E79 0%, #D4959E 100%)', boxShadow: '0 4px 15px rgba(183,110,121,0.3)' }}
            >
              <Calendar size={15} />
              Yeni Planlama
            </Link>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col md:flex-row gap-3 mb-6 p-4 rounded-xl bg-[#0A1128]/50 border border-white/5 backdrop-blur-sm">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Kurum adına göre ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#B76E79]/50 transition-colors"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#B76E79]/50 transition-colors [color-scheme:dark]"
            />
            <span className="text-gray-500">-</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#B76E79]/50 transition-colors [color-scheme:dark]"
            />
            
            {(searchQuery || startDate || endDate) && (
              <button
                onClick={() => { setSearchQuery(''); setStartDate(''); setEndDate(''); }}
                className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                title="Filtreleri Temizle"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Institution Tabs */}
        {institutionsWithSchedules.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setActiveInstitutionId('all')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                activeInstitutionId === 'all'
                  ? 'bg-[#B76E79] text-white shadow-[0_4px_12px_rgba(183,110,121,0.4)]'
                  : 'bg-white/5 text-[#9CA3AF] border border-white/10 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Building2 size={12} />
              Tümü
              <span className={`px-1.5 py-0.5 rounded-full text-[0.65rem] font-bold ${
                activeInstitutionId === 'all' ? 'bg-white/20' : 'bg-white/10'
              }`}>
                {schedules.length}
              </span>
            </button>
            {institutionsWithSchedules.map(inst => {
              const count = schedules.filter(s => s.institutionId === inst.id).length;
              const isActive = activeInstitutionId === inst.id;
              return (
                <button
                  key={inst.id}
                  onClick={() => setActiveInstitutionId(inst.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-[#B76E79] text-white shadow-[0_4px_12px_rgba(183,110,121,0.4)]'
                      : 'bg-white/5 text-[#9CA3AF] border border-white/10 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <ChevronRight size={11} className={isActive ? 'opacity-100' : 'opacity-0'} />
                  {inst.name}
                  <span className={`px-1.5 py-0.5 rounded-full text-[0.65rem] font-bold ${
                    isActive ? 'bg-white/20' : 'bg-white/10'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Table */}
        {schedules.length > 0 ? (
          filteredSchedules.length > 0 ? (
            <div className="bg-[#0A1128]/50 rounded-xl shadow-sm border border-white/10 overflow-hidden backdrop-blur-md">
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white/5 text-[#F2E0E2] font-semibold text-xs uppercase tracking-wider border-b border-white/10">
                    <tr>
                      <th className="px-5 py-4">Tarih</th>
                      <th className="px-5 py-4">Kurum</th>
                      <th className="px-5 py-4">Hedef</th>
                      <th className="px-5 py-4 text-right">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {filteredSchedules.map((schedule) => (
                      <tr key={schedule.id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-5 py-3.5 whitespace-nowrap text-gray-400 flex items-center gap-2">
                          <Calendar size={13} className="text-[#B76E79] shrink-0" />
                          {new Date(schedule.createdAt).toLocaleDateString('tr-TR')}
                        </td>
                        <td className="px-5 py-3.5 font-medium text-[#F3F4F6]">
                          {getInstitutionName(schedule.institutionId)}
                        </td>
                        <td className="px-5 py-3.5 text-gray-400 max-w-[260px] truncate">
                          {schedule.globalTarget || <span className="text-gray-600 italic">—</span>}
                        </td>
                        <td className="px-5 py-3.5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Edit button */}
                            <Link
                              to={`/schedule/edit/${schedule.id}`}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/5 border border-white/10 text-[#F2E0E2] hover:bg-white/10 rounded-lg text-xs font-semibold transition-all"
                            >
                              <Edit size={13} />
                              Düzenle
                            </Link>
                            {/* Direct Download button */}
                            <button
                              onClick={() => handleDirectDownload(schedule.id)}
                              disabled={downloadingId === schedule.id}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all text-white disabled:opacity-60"
                              style={{ background: 'linear-gradient(135deg, #B76E79, #D4959E)', boxShadow: '0 2px 8px rgba(183,110,121,0.3)' }}
                            >
                              {downloadingId === schedule.id ? (
                                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              ) : (
                                <Download size={13} />
                              )}
                              {downloadingId === schedule.id ? 'Hazırlanıyor...' : 'İndir'}
                            </button>
                            {/* Delete button */}
                            <button
                              onClick={() => handleDelete(schedule.id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg text-xs font-semibold transition-colors"
                            >
                              <Trash2 size={13} />
                              Sil
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Mobile Card View */}
              <div className="md:hidden flex flex-col divide-y divide-white/10">
                {filteredSchedules.map((schedule) => (
                  <div key={schedule.id} className="p-4 flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-[#F3F4F6] mb-1.5 text-base">{getInstitutionName(schedule.institutionId)}</div>
                        <div className="text-xs text-gray-400 flex items-center gap-1.5">
                          <Calendar size={12} className="text-[#B76E79]"/>
                          {new Date(schedule.createdAt).toLocaleDateString('tr-TR')}
                        </div>
                      </div>
                    </div>
                    {schedule.globalTarget && (
                      <div className="text-sm text-gray-300 bg-white/5 p-2.5 rounded-lg border border-white/5 line-clamp-2">
                        {schedule.globalTarget}
                      </div>
                    )}
                    <div className="flex items-center gap-2 pt-2">
                      <Link
                        to={`/schedule/edit/${schedule.id}`}
                        className="flex-1 inline-flex justify-center items-center gap-1.5 px-3 py-2 bg-white/5 border border-white/10 text-[#F2E0E2] hover:bg-white/10 rounded-lg text-sm font-semibold transition-all"
                      >
                        <Edit size={14} />
                        Düzenle
                      </Link>
                      <button
                        onClick={() => handleDirectDownload(schedule.id)}
                        disabled={downloadingId === schedule.id}
                        className="flex-1 inline-flex justify-center items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all text-white disabled:opacity-60"
                        style={{ background: 'linear-gradient(135deg, #B76E79, #D4959E)', boxShadow: '0 2px 8px rgba(183,110,121,0.3)' }}
                      >
                        {downloadingId === schedule.id ? (
                          <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <Download size={14} />
                        )}
                        {downloadingId === schedule.id ? 'Bekleyin' : 'İndir'}
                      </button>
                      <button
                        onClick={() => handleDelete(schedule.id)}
                        className="inline-flex justify-center items-center gap-1 px-3 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg text-sm font-semibold transition-colors shrink-0"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white/5 border border-dashed border-white/20 rounded-xl p-10 text-center backdrop-blur-md">
              <Building2 size={32} className="mx-auto text-[#B76E79]/40 mb-3" />
              <p className="text-gray-400 font-medium text-sm">Bu kuruma ait planlama bulunmuyor.</p>
              <button
                onClick={() => setActiveInstitutionId('all')}
                className="text-[#B76E79] text-sm font-semibold hover:underline mt-2 inline-block"
              >
                Tüm planlamalara dön
              </button>
            </div>
          )
        ) : (
          <div className="bg-white/5 border border-dashed border-white/20 rounded-xl p-10 text-center backdrop-blur-md">
            <Calendar size={32} className="mx-auto text-gray-500 mb-3" />
            <p className="text-gray-400 font-medium text-sm">Henüz kaydedilmiş bir planlama bulunmuyor.</p>
            <Link to="/schedule/new" className="text-[#B76E79] text-sm font-semibold hover:underline mt-2 inline-block">
              İlk planlamanızı oluşturun
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
