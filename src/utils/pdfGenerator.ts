import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface PDFExportParams {
  tableElementId: string;
  institutionName: string;
  institutionLogo?: string;
  date?: string;
  globalTarget?: string;
  globalLogo?: string;
}

const normalizeTurkish = (text: string) => {
  if (!text) return '';
  return text
    .replace(/İ/g, 'I').replace(/ı/g, 'i')
    .replace(/Ş/g, 'S').replace(/ş/g, 's')
    .replace(/Ğ/g, 'G').replace(/ğ/g, 'g')
    .replace(/Ç/g, 'C').replace(/ç/g, 'c')
    .replace(/Ö/g, 'O').replace(/ö/g, 'o')
    .replace(/Ü/g, 'U').replace(/ü/g, 'u');
};

const getImageDimensions = (base64: string): Promise<{ width: number, height: number }> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = () => resolve({ width: 0, height: 0 });
    img.src = base64;
  });
};

export const exportScheduleToPDF = async ({ tableElementId, institutionName, institutionLogo, globalTarget, globalLogo }: PDFExportParams) => {
  const element = document.getElementById(tableElementId);
  if (!element) {
    alert('Tablo bulunamadı!');
    return;
  }

  // Geçici olarak PDF moduna geçir (placeholder'ları gizle, input görünümlerini düz metin yap)
  document.body.classList.add('pdf-mode');

  try {
    // İşlem bitince layout kırılmalarını önlemek için ufak bir bekleme ekle
    await new Promise(resolve => setTimeout(resolve, 100));

    // Canvas'a dönüştür (3x ölçek ile ultra yüksek çözünürlük)
    const canvas = await html2canvas(element, { 
      scale: 3, 
      useCORS: true, 
      backgroundColor: '#ffffff',
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      onclone: (clonedDoc) => {
        // Inputları div'e çevir (Kesilmeleri ve placeholder sorununu kökten çözer)
        const inputs = clonedDoc.querySelectorAll('.schedule-input');
        inputs.forEach((input: any) => {
           const div = clonedDoc.createElement('div');
           div.innerText = input.value || '';
           
           div.style.padding = '8px 12px';
           div.style.fontSize = '0.85rem';
           div.style.color = '#111827';
           div.style.fontWeight = '500';
           div.style.fontFamily = "'Inter', sans-serif";
           div.style.width = '100%';
           div.style.boxSizing = 'border-box';
           div.style.whiteSpace = 'pre-wrap';
           div.style.wordBreak = 'break-word';
           div.style.lineHeight = '1.5';
           
           input.parentNode?.replaceChild(div, input);
        });
        
        // Tablo içi daha net ve resmi sınırlar çiz
        const rows = clonedDoc.querySelectorAll('.schedule-table tbody tr');
        rows.forEach((row: any, i: number) => {
           row.style.borderBottom = '1px solid #E5E7EB';
           row.style.background = i % 2 === 0 ? '#FFFFFF' : '#F9FAFB'; // Çok hafif gri şerit
           row.style.height = '48px'; // Satır yüksekliğini sabitle, sıkışmayı önle
        });

        const timeCells = clonedDoc.querySelectorAll('.schedule-time-cell');
        timeCells.forEach((cell: any) => {
          cell.style.color = '#374151';
          cell.style.fontWeight = '600';
          cell.style.fontFamily = "'Inter', sans-serif"; // Custom fontlarda html2canvas kesme yapabilir, standartlaştır.
          cell.style.lineHeight = '1.5';
        });

        const table = clonedDoc.querySelector('.schedule-table') as HTMLElement;
        if (table) {
          table.style.width = '100%';
          table.style.border = '1px solid #E5E7EB';
          table.style.borderCollapse = 'collapse';
        }

        const ths = clonedDoc.querySelectorAll('.schedule-table thead th');
        ths.forEach((th: any) => {
           th.style.padding = '16px 20px';
           th.style.background = '#1B2A6B'; // Net, koyu lacivert düz renk daha temiz çıkar
           th.style.color = '#FFFFFF';
           th.style.fontSize = '0.8rem';
           th.style.fontWeight = '700';
           th.style.textTransform = 'uppercase';
           th.style.verticalAlign = 'middle';
           th.style.lineHeight = '1.5';
           th.style.border = '1px solid #1B2A6B'; // Başlık sınırları
        });

        const tds = clonedDoc.querySelectorAll('.schedule-table td');
        tds.forEach((td: any) => {
           td.style.border = '1px solid #E5E7EB';
           td.style.verticalAlign = 'middle';
           td.style.lineHeight = '1.5';
        });
      }
    });
    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    // A4 dikey (portrait) PDF oluştur
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 8;
    const startY = 12;
    let headerBottomY = startY;

    // Sağ Üst: Ana Şirket Logosu
    if (globalLogo) {
      try {
        const dims = await getImageDimensions(globalLogo);
        if (dims.width > 0) {
          const maxLogoWidth = 100;
          const maxLogoHeight = 50;
          const ratio = Math.min(maxLogoWidth / dims.width, maxLogoHeight / dims.height);
          const logoWidth = dims.width * ratio;
          const logoHeight = dims.height * ratio;
          
          pdf.addImage(globalLogo, 'PNG', pageWidth - margin - logoWidth, startY, logoWidth, logoHeight, undefined, 'FAST');
          headerBottomY = Math.max(headerBottomY, startY + logoHeight);
        }
      } catch (e) {
        console.warn('Global logo PDF e eklenemedi.', e);
      }
    }

    // Sol Üst: Kurum Logosu
    if (institutionLogo) {
      try {
        const dims = await getImageDimensions(institutionLogo);
        if (dims.width > 0) {
          const maxInstWidth = 80;
          const maxInstHeight = 50;
          const ratio = Math.min(maxInstWidth / dims.width, maxInstHeight / dims.height);
          const logoWidth = dims.width * ratio;
          const logoHeight = dims.height * ratio;
          
          pdf.addImage(institutionLogo, 'PNG', margin, startY, logoWidth, logoHeight, undefined, 'FAST');
          headerBottomY = Math.max(headerBottomY, startY + logoHeight);
        }
      } catch (e) {
        console.warn('Kurum Logosu PDF e eklenemedi.', e);
      }
    }

    // Kurum Bilgileri - Logoların altında, tam genişliğe yayılacak şekilde
    const textYOffset = headerBottomY + 8;
    const finalStartX = margin; // Sol kenardan başla

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(16);
    pdf.setTextColor(20, 28, 78); // Lacivert tonu
    
    // Uzun isimlerin logoyla çakışmaması ve sığması için metni kırp/alt satıra al
    const maxTextWidth = pageWidth - 2 * margin;
    const splitTitle = pdf.splitTextToSize(normalizeTurkish(institutionName), maxTextWidth);
    pdf.text(splitTitle, finalStartX, textYOffset);
    
    // Başlığın kaç satır sürdüğüne göre Y ofsetini kaydır
    const titleHeight = splitTitle.length * 6;
    
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    pdf.text(normalizeTurkish(`KAYIT PLANI`), finalStartX, textYOffset + titleHeight);

    if (globalTarget) {
      pdf.setFontSize(10);
      pdf.setTextColor(150, 100, 100); // Hedef için hafif kiremit/kırmızımsı ton
      pdf.text(normalizeTurkish(`Genel Hedef: ${globalTarget}`), finalStartX, textYOffset + titleHeight + 5);
    }

    headerBottomY = textYOffset + titleHeight + (globalTarget ? 8 : 4);

    // Yatay Ayırıcı Çizgi
    pdf.setDrawColor(220, 220, 220);
    pdf.setLineWidth(0.5);
    pdf.line(margin, headerBottomY + 4, pageWidth - margin, headerBottomY + 4);

    // Tabloyu Yerleştirme
    const tableStartY = headerBottomY + 10;
    const imgWidth = pageWidth - 2 * margin;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // En boy oranını koruyarak sığdır
    let finalWidth = imgWidth;
    let finalHeight = imgHeight;
    const maxHeight = pageHeight - tableStartY - 10;

    if (imgHeight > maxHeight) {
      const ratio = maxHeight / imgHeight;
      finalHeight = maxHeight;
      finalWidth = imgWidth * ratio;
    }

    // Tabloyu yatayda ortala (küçüldüyse)
    const xOffset = margin + (imgWidth - finalWidth) / 2;
    pdf.addImage(imgData, 'PNG', xOffset, tableStartY, finalWidth, finalHeight, undefined, 'FAST');

    // Footer
    pdf.setFontSize(8);
    pdf.setTextColor(150);
    pdf.text(`Olusturma: ${new Date().toLocaleString('tr-TR')} | Kayit Plani Sistemi`, margin, pageHeight - 5);

    pdf.save(`kayit-plani.pdf`);
  } catch (error) {
    console.error('PDF oluşturulurken hata:', error);
    alert('PDF oluşturulurken bir hata meydana geldi.');
  } finally {
    // İşlem bitince PDF modunu kapat
    document.body.classList.remove('pdf-mode');
  }
};
