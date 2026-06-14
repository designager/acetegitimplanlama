import { Sparkles, Calendar, Edit, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { institutions, schedules, deleteSchedule } = useStore();

  const getInstitutionName = (id: string) => {
    return institutions.find(i => i.id === id)?.name || 'Bilinmeyen Kurum';
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bu planlamayı silmek istediğinize emin misiniz?')) {
      deleteSchedule(id);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-[1200px] mx-auto">
      <div className="page-header mb-6 md:mb-8">
        <h1 className="text-2xl md:text-[2rem]">Cihat Acet, Hoşgeldiniz... 👋</h1>
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

      {/* Kayıtlı Planlamalar */}
      <div className="mt-8">
        <h2 className="text-xl font-display font-bold text-[#111C4E] mb-4">Kayıtlı Planlamalar</h2>
        {schedules.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-[#1B2A6B]/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#1B2A6B]/5 text-[#1B2A6B] font-semibold text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Tarih</th>
                    <th className="px-6 py-4">Kurum</th>
                    <th className="px-6 py-4">Hedef</th>
                    <th className="px-6 py-4 text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {schedules.map((schedule) => (
                    <tr key={schedule.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600 flex items-center gap-2">
                        <Calendar size={14} className="text-gray-400" />
                        {new Date(schedule.createdAt).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-6 py-4 font-medium text-[#111C4E]">
                        {getInstitutionName(schedule.institutionId)}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {schedule.globalTarget || '-'}
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <Link
                          to={`/schedule/edit/${schedule.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1B2A6B]/10 text-[#1B2A6B] hover:bg-[#1B2A6B]/20 rounded-md text-xs font-semibold transition-colors mr-2"
                        >
                          <Edit size={14} />
                          Düzenle / İndir
                        </Link>
                        <button
                          onClick={() => handleDelete(schedule.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-md text-xs font-semibold transition-colors"
                        >
                          <Trash2 size={14} />
                          Sil
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white/50 border border-dashed border-gray-300 rounded-xl p-8 text-center">
            <Calendar size={32} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium text-sm">Henüz kaydedilmiş bir planlama bulunmuyor.</p>
            <Link to="/schedule/new" className="text-[#B76E79] text-sm font-semibold hover:underline mt-2 inline-block">
              İlk planlamanızı oluşturun
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
