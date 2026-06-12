# Personel Çizelge Yönetim Sistemi — Ürün Gereksinim Belgesi (PRD)

**Versiyon:** 1.0  
**Tarih:** Haziran 2026  
**Durum:** Taslak

---

## 1. Genel Bakış

### 1.1 Proje Özeti

Şirket bünyesindeki eğitim kurumlarının günlük personel programlarını merkezi olarak yönetmelerine olanak tanıyan, logo entegrasyonlu PDF çıktısı üretebilen, mobil uyumlu bir web tabanlı panel uygulaması.

### 1.2 Problem Tanımı

Birden fazla eğitim kurumunu bünyesinde barındıran şirketlerin, her kuruma ait günlük personel çizelgelerini ayrı ayrı hazırlaması, paylaşması ve arşivlemesi zaman alıcı ve hata yaratıcı bir süreçtir. Mevcut çözümler (Excel, kâğıt çizelgeler) kurumsal kimliği yansıtmamakta ve mobil erişime olanak tanımamaktadır.

### 1.3 Hedef Kitle

- **Birincil kullanıcılar:** Şirket yöneticileri ve kurum müdürleri
- **İkincil kullanıcılar:** Eğitim kurumu koordinatörleri

---

## 2. Özellik Listesi

### 2.1 Kurum Yönetimi

- **Kurum ekleme:** Ad, adres, logo yükleme alanları ile yeni kurum kaydı
- **Kurum düzenleme:** Mevcut kurum bilgilerini güncelleme (ad, logo değiştirme)
- **Kurum silme:** Onay diyaloğu ile güvenli silme
- **Kurum listesi:** Tüm kayıtlı kurumlar listelenebilir ve hızlı seçim yapılabilir
- **Logo yönetimi:** Her kuruma ait logo ayrı olarak depolanır; PDF çıktısına otomatik eklenir

### 2.2 Çizelge (Program Tablosu)

#### 2.2.1 Zaman Aralığı Ayarları

- **Varsayılan aralık:** 08:30 – 19:30, 30 dakikalık dilimler (toplam 22 satır)
- **Özelleştirilebilir başlangıç/bitiş saati:** Kullanıcı başlangıç ve bitiş saatini serbest girebilir
- **Özelleştirilebilir dilim süresi:** 15, 20, 30, 45 veya 60 dakika seçilebilir
- **Anlık yeniden hesaplama:** Ayar değiştiğinde tablo otomatik yeniden oluşturulur

#### 2.2.2 Tablo Yapısı

| Sütun | Tür | Açıklama |
|---|---|---|
| Saat | Otomatik | Otomatik oluşturulan zaman dilimi (ör. 08:30 – 09:00) |
| Personel Adı | Serbest metin | Göreve atanan personelin adı |
| Görev / Eylem | Açılır liste / serbest metin | Yapılacak eylem veya aktivite |
| Hedefler | Serbest metin + sayısal alan | Hedeflenen öğrenci sayısı, kota veya nicel hedef (ör. "25 öğrenci", "Kayıt: 10 kişi") |
| Notlar | Serbest metin (opsiyonel) | Ek açıklama, hatırlatma |

**Hedefler alanı detayları:**
- Hem metin hem sayı girilebilir (ör. "Hedef: 30 öğrenci", "Minimum 15 kayıt")
- İsteğe bağlı olarak hedef türü seçilebilir: Öğrenci Sayısı / Kayıt / Deneme Dersi / Diğer
- Gerçekleşen değer *(v2)* ayrı alt alan olarak eklenebilir; hedef vs. gerçekleşen karşılaştırması PDF'e yansıtılır
- Boş bırakılabilir — zorunlu alan değil

- Satırlar çizelge görünümünde düzenlenebilir (inline editing)
- Hücreler tıklanarak düzenleme modu aktif olur
- Satır bazında renk etiketleme (ör. farklı departmanlar için)
- Sürükle-bırak ile satır sırası değiştirilebilir *(opsiyonel, v2)*

#### 2.2.3 Eylem Diyagramı

- Tablo doldurulduktan sonra **"Diyagram Oluştur"** butonu ile görsel bir zaman çizelgesi oluşturulur
- Diyagram türü: Yatay Gantt benzeri zaman şeridi
- Her personelin görevleri ayrı renk bloklarıyla gösterilir
- Blokların üzerinde personel adı ve görev etiketi görünür
- Diyagram interaktif: hover'da detay bilgisi açılır
- Diyagram PNG veya SVG olarak dışa aktarılabilir

### 2.3 PDF Çıktısı

- **Logo entegrasyonu:** Seçili kurumun logosu PDF'in üst kısmına otomatik eklenir
- **Başlık bloğu:** Kurum adı, tarih, hazırlayan kişi bilgisi
- **Tablo çıktısı:** Tüm doldurulmuş çizelge satırları
- **Eylem diyagramı:** Gantt diyagramı PDF'e gömülü şekilde yer alır
- **Sayfa düzeni:** A4, yatay (landscape) — tablo okunabilirliği için
- **Kurumsal altbilgi:** Şirket adı ve oluşturma tarihi/saati
- **Tek tıkla indirme:** "PDF İndir" butonu ile tarayıcıdan direkt indirme

### 2.4 Panel (Dashboard)

- Son oluşturulan çizelgeler listesi (tarih, kurum adı)
- Hızlı kurum seçimi
- Zaman aralığı hızlı ayar kısayolları (ör. "Standart Gün", "Sabah Vardiyası")
- Kaydetme/yükleme: Tarayıcı yerel deposu veya backend ile çizelge taslakları saklanabilir

---

## 3. Tasarım Gereksinimleri

### 3.1 Renk Paleti

| Token | Renk | Hex | Kullanım Alanı |
|---|---|---|---|
| `--royal-navy` | Kraliyet Laciverti | `#1B2A6B` | Ana arka plan, başlıklar, header |
| `--navy-dark` | Derin Lacivert | `#111C4E` | Sidebar, footer |
| `--navy-light` | Açık Lacivert | `#2E3F8F` | Hover durumları, aktif satır |
| `--rose-gold` | Rose Gold | `#B76E79` | Aksan rengi, butonlar, vurgular |
| `--rose-gold-light` | Açık Rose Gold | `#D4959E` | İkincil butonlar, etiketler |
| `--rose-gold-pale` | Soluk Rose Gold | `#F2E0E2` | Tablo başlık arka planı |
| `--cream` | Krem | `#FAF7F5` | İçerik alanı arka planı |
| `--text-primary` | Koyu Metin | `#1A1A2E` | Ana metin |
| `--text-muted` | Soluk Metin | `#6B7280` | Yardımcı metin |

### 3.2 Tipografi

| Rol | Yazı Tipi | Ağırlık | Kullanım |
|---|---|---|---|
| Display | Playfair Display | 700 | Sayfa başlıkları, kurum adı |
| Body | Inter | 400/500 | Tablo içerikleri, formlar |
| Data | JetBrains Mono | 400 | Saat sütunu, teknik değerler |

### 3.3 Görsel Kimlik İlkeleri

- **Lüks ve kurumsal hava:** Geniş iç boşluklar, ince border'lar, yumuşatılmış köşeler (8px radius)
- **Altın oran boşlukları:** 8px / 16px / 24px / 40px / 64px ızgara sistemi
- **Gölgeler:** Tek düze düz gölgeler yerine yumuşak, çok katmanlı box-shadow
- **İkonlar:** Lucide Icons seti, 20px, stroke tabanlı
- **Animasyonlar:** Minimal; sadece geçiş ve hover — `transition: 200ms ease`
- **Tabloda satır hover:** `--rose-gold-pale` arka plan ile hafif vurgu

### 3.4 Mobil Uyumluluk

- **Breakpoint'ler:** 375px / 768px / 1280px / 1440px
- Mobilde tablo yatay kaydırılabilir (horizontal scroll container)
- Butonlar minimum 44px dokunma hedefi
- Zaman aralığı ayarları mobilde açılır drawer olarak sunar
- PDF oluşturma butonu her ekranda erişilebilir sabit alt çubukta

---

## 4. Teknik Mimari

### 4.1 Önerilen Tech Stack

#### Frontend
```
Framework     : React 18 + TypeScript
Styling       : Tailwind CSS + CSS değişkenleri (özel tokenlar)
State         : Zustand (kurum ve çizelge state'i)
Tablo         : TanStack Table v8
PDF üretimi   : react-pdf / @react-pdf/renderer  —VEYA—  jsPDF + html2canvas
Diyagram      : D3.js (Gantt çizimi için özel SVG render)
İkonlar       : Lucide React
Tarih/saat    : date-fns
```

#### Backend (Opsiyonel — Faz 2)
```
Runtime       : Node.js + Express  —VEYA—  Next.js API Routes
Veritabanı    : PostgreSQL (Supabase ile hızlı kurulum)
Depolama      : Supabase Storage (logo dosyaları)
Auth          : Supabase Auth (şirket yöneticisi girişi)
```

#### Faz 1 (MVP) — Sadece Frontend
- Kurum bilgileri ve logolar `localStorage`'da saklanır
- Çizelge taslakları JSON olarak `localStorage`'da tutulur
- PDF üretimi tamamen istemci taraflı (jsPDF)

### 4.2 Veri Modelleri

```typescript
// Kurum
interface Institution {
  id: string;
  name: string;
  logoBase64?: string;   // Base64 kodlanmış logo
  createdAt: string;
  updatedAt: string;
}

// Zaman Aralığı Ayarları
interface ScheduleConfig {
  startTime: string;     // "08:30"
  endTime: string;       // "19:30"
  intervalMinutes: 15 | 20 | 30 | 45 | 60;
}

// Hedef türü
type TargetType = "student_count" | "registration" | "trial_lesson" | "other";

// Çizelge Satırı
interface ScheduleRow {
  id: string;
  timeSlot: string;        // "08:30 – 09:00"
  staffName: string;
  action: string;
  target?: {
    type: TargetType;      // Hedef kategorisi
    label?: string;        // Serbest metin (ör. "Hedef: 30 öğrenci")
    value?: number;        // Sayısal hedef değeri (ör. 30)
    achieved?: number;     // Gerçekleşen değer — v2
  };
  notes?: string;
  colorTag?: string;       // Hex renk kodu
}

// Çizelge (Tüm kayıt)
interface Schedule {
  id: string;
  institutionId: string;
  date: string;          // ISO 8601
  config: ScheduleConfig;
  rows: ScheduleRow[];
  createdBy?: string;
  createdAt: string;
}
```

### 4.3 PDF Üretim Akışı

```
1. Kullanıcı "PDF İndir" butonuna basar
2. Seçili kurumun logosu Base64 olarak alınır
3. Çizelge verileri Schedule nesnesi üzerinden çekilir
4. react-pdf / jsPDF ile:
   a. A4 Landscape sayfa ayarlanır
   b. Header bloğu: Logo (sol) | Kurum adı + tarih (sağ)
   c. Çizelge tablosu oluşturulur (renk etiketleri korunur)
   d. Gantt diyagramı SVG → PNG dönüşümü ile sayfaya eklenir
   e. Footer: Şirket adı | Oluşturma tarihi
5. Tarayıcıya Blob olarak iletilir → otomatik indirme başlar
```

---

## 5. Kullanıcı Akışları

### 5.1 Ana Akış — Çizelge Oluşturma

```
[Panel açılır]
    ↓
[Kurum seç veya ekle]
    ↓
[Tarih seç]
    ↓
[Zaman aralığını ayarla — opsiyonel]
    ↓
[Tablo hücrelerini doldur]
    ↓
[Önizle → "Diyagram Oluştur"]
    ↓
[Diyagramı incele / düzelt]
    ↓
["PDF İndir" → Logolu PDF indirilir]
```

### 5.2 Kurum Yönetimi Akışı

```
[Ayarlar > Kurumlar]
    ↓
[Kurum Ekle → Ad gir, logo yükle → Kaydet]
    |
    ↓
[Kurum Düzenle → Mevcut kaydı güncelle]
    |
    ↓
[Kurum Sil → Onay → Kaldır]
```

---

## 6. Ekranlar ve Bileşenler

### 6.1 Sayfa / Ekran Listesi

| Ekran | Açıklama |
|---|---|
| `/` (Dashboard) | Son çizelgeler, hızlı başlat |
| `/schedule/new` | Yeni çizelge oluşturma (ana ekran) |
| `/schedule/:id` | Mevcut çizelgeyi görüntüle/düzenle |
| `/institutions` | Kurum listesi ve yönetimi |
| `/settings` | Genel uygulama ayarları |

### 6.2 Ana Bileşenler

| Bileşen | Sorumluluk |
|---|---|
| `<InstitutionSelector>` | Kurum açılır listesi + hızlı ekle |
| `<ScheduleConfigPanel>` | Başlangıç/bitiş/aralık ayarları |
| `<ScheduleTable>` | Düzenlenebilir çizelge tablosu |
| `<GanttDiagram>` | D3 tabanlı eylem diyagramı |
| `<PDFPreview>` | PDF önizleme modalı |
| `<LogoUploader>` | Sürükle-bırak logo yükleme |
| `<ColorTagPicker>` | Satır renk etiketi seçici |

---

## 7. Geliştirme Fazları

### Faz 1 — MVP (Tahmini: 3–4 hafta)

- [ ] Proje iskeleti (React + Tailwind + TypeScript kurulumu)
- [ ] Tasarım token sistemi ve global stiller
- [ ] Kurum CRUD (`localStorage` tabanlı)
- [ ] Logo yükleme ve Base64 depolama
- [ ] Dinamik çizelge tablosu (ayarlanabilir zaman aralıkları)
- [ ] Tablo inline düzenleme
- [ ] Temel PDF çıktısı (logo + tablo)
- [ ] Mobil responsive düzen

### Faz 2 — Gelişmiş Özellikler (Tahmini: 3–4 hafta)

- [ ] Gantt eylem diyagramı (D3.js)
- [ ] Diyagram SVG/PNG dışa aktarımı
- [ ] PDF'e diyagram gömme
- [ ] Renk etiketleme sistemi
- [ ] Taslak kaydetme/yükleme
- [ ] Çizelge tarihi geçmişi

### Faz 3 — Backend & Çok Kullanıcı (Tahmini: 4–5 hafta)

- [ ] Supabase kurulumu (veritabanı + auth + storage)
- [ ] Kullanıcı kimlik doğrulama
- [ ] Kurum bazlı yetkilendirme
- [ ] Çizelge paylaşım linki
- [ ] E-posta ile PDF gönderme

---

## 8. Kabul Kriterleri

| Özellik | Kriter |
|---|---|
| Kurum yönetimi | Kurum ekleme, düzenleme ve silme işlemleri hatasız çalışmalı; logo yükleme en az JPG/PNG/SVG desteklemeli |
| Zaman aralığı | 08:30–19:30 varsayılan doğru oluşturulmalı; başlangıç/bitiş/dilim değiştirilince tablo anında güncellenmelidir |
| Tablo düzenleme | Her hücre tıklanabilir, boş bırakılabilir; değişiklikler kaybolmadan korunmalıdır |
| PDF çıktısı | Logo, kurum adı, tarih, tablo ve diyagram PDF'te eksiksiz yer almalı; dosya 5 saniyede indirilmeli |
| Diyagram | Her personelin görevleri ayrı renk bloklarıyla Gantt formatında görünmeli; hover'da detay gösterilmeli |
| Mobil uyumluluk | 375px genişlikte tüm işlevler erişilebilir olmalı; tablo yatay scroll yapabilmeli |
| Performans | Tablo 100 satıra kadar gecikme yaşatmadan render edilmeli |

---

## 9. Açık Sorular ve Kararlar

| # | Soru | Durum |
|---|---|---|
| 1 | MVP'de backend gerekli mi, yoksa localStorage yeterli mi? | ❓ Karar bekleniyor |
| 2 | Birden fazla yönetici kullanıcı desteği gerekiyor mu? | ❓ Karar bekleniyor |
| 3 | PDF dilimi: Türkçe mi yoksa çift dil desteği mi? | ❓ Karar bekleniyor |
| 4 | Çizelge şablonları (tekrar eden program yapıları) kaydedilecek mi? | ❓ Karar bekleniyor |
| 5 | Personel listesi sabit bir havuzdan mı seçilecek yoksa serbest metin mi? | ❓ Karar bekleniyor |

---

## 10. Referans Notlar

- **PDF kütüphane tercihi:** `@react-pdf/renderer` daha iyi CSS kontrolü sunar; `jsPDF + html2canvas` daha hızlı prototip için uygundur. Diyagram kalitesi önemliyse `@react-pdf/renderer` tercih edilmeli.
- **Gantt diyagramı:** D3.js öğrenme eğrisi yüksektir; MVP için `frappe-gantt` veya özel SVG render tercih edilebilir.
- **Logo boyutu:** Yüklenen logoların maksimum 2MB ve 1000x1000px ile sınırlandırılması önerilir; istemci taraflı sıkıştırma (browser-image-compression) uygulanabilir.

---

*Bu belge geliştirme sürecinde güncellenecektir. Son versiyon için proje deposuna başvurun.*
