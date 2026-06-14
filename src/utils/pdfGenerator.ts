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
      backgroundColor: '#0A1128', // Dark navy background for canvas
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
          div.style.color = '#F3F4F6';        // White text for dark background
          div.style.fontWeight = '500';
          div.style.fontFamily = "'Inter', sans-serif";
          div.style.width = '100%';
          div.style.boxSizing = 'border-box';
          div.style.whiteSpace = 'pre-wrap';
          div.style.wordBreak = 'break-word';
          div.style.lineHeight = '1.5';
          div.style.background = 'transparent';

          input.parentNode?.replaceChild(div, input);
        });

        // Tablo arka planı - koyu lacivert
        const table = clonedDoc.querySelector('.schedule-table') as HTMLElement;
        if (table) {
          table.style.width = '100%';
          table.style.border = '1px solid rgba(183,110,121,0.2)';
          table.style.borderCollapse = 'collapse';
          table.style.background = '#0A1128';
        }

        // Başlık satırı - rose gold
        const ths = clonedDoc.querySelectorAll('.schedule-table thead th');
        ths.forEach((th: any) => {
          th.style.padding = '16px 20px';
          th.style.background = '#B76E79';          // Rose gold header
          th.style.color = '#FFFFFF';               // White text
          th.style.fontSize = '0.8rem';
          th.style.fontWeight = '700';
          th.style.textTransform = 'uppercase';
          th.style.verticalAlign = 'middle';
          th.style.lineHeight = '1.5';
          th.style.border = '1px solid rgba(183,110,121,0.3)';
        });

        // Gövde satırları - dönüşümlü koyu tonlar
        const rows = clonedDoc.querySelectorAll('.schedule-table tbody tr');
        rows.forEach((row: any, i: number) => {
          row.style.borderBottom = '1px solid rgba(183,110,121,0.15)';
          row.style.background = i % 2 === 0 ? '#0A1128' : '#0D1535'; // Alternating dark navy rows
          row.style.height = '48px'; // Satır yüksekliğini sabitle
        });

        // Tüm TD hücreleri
        const tds = clonedDoc.querySelectorAll('.schedule-table td');
        tds.forEach((td: any) => {
          td.style.border = '1px solid rgba(183,110,121,0.2)';
          td.style.verticalAlign = 'middle';
          td.style.lineHeight = '1.5';
          td.style.color = '#F3F4F6';               // White body text
          td.style.background = 'inherit';
        });

        // Saat hücreleri - muted gray
        const timeCells = clonedDoc.querySelectorAll('.schedule-time-cell');
        timeCells.forEach((cell: any) => {
          cell.style.color = '#9CA3AF';             // Muted gray for time column
          cell.style.fontWeight = '600';
          cell.style.fontFamily = "'Inter', sans-serif";
          cell.style.lineHeight = '1.5';
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

    // ── Tam Sayfa Koyu Lacivert Arka Plan ──────────────────────────────────────
    // Dark navy: #050A1F → r=5, g=10, b=31
    pdf.setFillColor(5, 10, 31);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');

    // ── Rose Gold Üst Şerit ────────────────────────────────────────────────────
    // Rose gold: #B76E79 → r=183, g=110, b=121
    pdf.setFillColor(183, 110, 121);
    pdf.rect(0, 0, pageWidth, 6, 'F');

    // ── Sağ Üst: Ana Şirket Logosu ─────────────────────────────────────────────
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

    // ── Sol Üst: Kurum Logosu ──────────────────────────────────────────────────
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

    // ── Kurum Adı ve Alt Başlık ────────────────────────────────────────────────
    const textYOffset = headerBottomY + 8;
    const finalStartX = margin;
    const maxTextWidth = pageWidth - 2 * margin;

    // Kurum adı - beyaz (#F3F4F6 → r=243, g=244, b=246)
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(16);
    pdf.setTextColor(243, 244, 246);
    const splitTitle = pdf.splitTextToSize(normalizeTurkish(institutionName), maxTextWidth);
    pdf.text(splitTitle, finalStartX, textYOffset);
    const titleHeight = splitTitle.length * 6;

    // 'KAYIT PLANI' alt başlığı - rose gold (#B76E79 → r=183, g=110, b=121)
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(183, 110, 121);
    pdf.text(normalizeTurkish('KAYIT PLANI'), finalStartX, textYOffset + titleHeight);

    // Genel Hedef - hafif rose (#F2E0E2 → r=242, g=224, b=226)
    if (globalTarget) {
      pdf.setFontSize(10);
      pdf.setTextColor(242, 224, 226);
      pdf.text(normalizeTurkish(`Genel Hedef: ${globalTarget}`), finalStartX, textYOffset + titleHeight + 5);
    }

    headerBottomY = textYOffset + titleHeight + (globalTarget ? 8 : 4);

    // ── Rose Gold Yatay Ayırıcı Çizgi ─────────────────────────────────────────
    pdf.setDrawColor(183, 110, 121);
    pdf.setLineWidth(0.4);
    pdf.line(margin, headerBottomY + 4, pageWidth - margin, headerBottomY + 4);

    // ── Tablo Görseli ─────────────────────────────────────────────────────────
    const tableStartY = headerBottomY + 10;
    const imgWidth = pageWidth - 2 * margin;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let finalWidth = imgWidth;
    let finalHeight = imgHeight;
    const maxHeight = pageHeight - tableStartY - 12;

    if (imgHeight > maxHeight) {
      const ratio = maxHeight / imgHeight;
      finalHeight = maxHeight;
      finalWidth = imgWidth * ratio;
    }

    // Tabloyu yatayda ortala (küçüldüyse)
    const xOffset = margin + (imgWidth - finalWidth) / 2;
    pdf.addImage(imgData, 'JPEG', xOffset, tableStartY, finalWidth, finalHeight, undefined, 'FAST');

    // ── Rose Gold Alt Şerit ────────────────────────────────────────────────────
    pdf.setFillColor(183, 110, 121);
    pdf.rect(0, pageHeight - 4, pageWidth, 4, 'F');

    // ── Footer Metni ──────────────────────────────────────────────────────────
    // Muted gray: #6B7280 → r=107, g=114, b=128
    pdf.setFontSize(8);
    pdf.setTextColor(107, 114, 128);
    pdf.text(`Olusturma: ${new Date().toLocaleString('tr-TR')} | Kayit Plani Sistemi`, margin, pageHeight - 6);

    pdf.save(`kayit-plani.pdf`);
  } catch (error) {
    console.error('PDF oluşturulurken hata:', error);
    alert('PDF oluşturulurken bir hata meydana geldi.');
  } finally {
    // İşlem bitince PDF modunu kapat
    document.body.classList.remove('pdf-mode');
  }
};

// ── Data-driven PDF Export ───────────────────────────────────────────────────
// Dashboard'dan DOM'a ihtiyaç duymadan doğrudan veri ile PDF indirmek için
interface DataPDFExportParams {
  institutionName: string;
  institutionLogo?: string;
  globalTarget?: string;
  globalLogo?: string;
  rows: { timeSlot: string; action: string; notes?: string }[];
}

export const exportScheduleFromData = async ({
  institutionName,
  institutionLogo,
  globalTarget,
  globalLogo,
  rows,
}: DataPDFExportParams) => {
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

  // ── Tam Sayfa Koyu Lacivert Arka Plan
  pdf.setFillColor(5, 10, 31);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');

  // ── Rose Gold Üst Şerit
  pdf.setFillColor(183, 110, 121);
  pdf.rect(0, 0, pageWidth, 6, 'F');

  // ── Sağ Üst: Ana Şirket Logosu
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
      console.warn('Global logo eklenemedi.', e);
    }
  }

  // ── Sol Üst: Kurum Logosu
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
      console.warn('Kurum logosu eklenemedi.', e);
    }
  }

  // ── Kurum Adı ve Alt Başlık
  const textYOffset = headerBottomY + 8;
  const finalStartX = margin;
  const maxTextWidth = pageWidth - 2 * margin;

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(16);
  pdf.setTextColor(243, 244, 246);
  const splitTitle = pdf.splitTextToSize(normalizeTurkish(institutionName), maxTextWidth);
  pdf.text(splitTitle, finalStartX, textYOffset);
  const titleHeight = splitTitle.length * 6;

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(183, 110, 121);
  pdf.text(normalizeTurkish('KAYIT PLANI'), finalStartX, textYOffset + titleHeight);

  if (globalTarget) {
    pdf.setFontSize(10);
    pdf.setTextColor(242, 224, 226);
    pdf.text(normalizeTurkish(`Genel Hedef: ${globalTarget}`), finalStartX, textYOffset + titleHeight + 5);
  }

  headerBottomY = textYOffset + titleHeight + (globalTarget ? 8 : 4);

  // ── Rose Gold Ayırıcı Çizgi
  pdf.setDrawColor(183, 110, 121);
  pdf.setLineWidth(0.4);
  pdf.line(margin, headerBottomY + 4, pageWidth - margin, headerBottomY + 4);

  // ── Tablo başlığı + veri satırları
  const tableStartY = headerBottomY + 10;
  const colWidths = [32, (pageWidth - 2 * margin - 32) * 0.55, (pageWidth - 2 * margin - 32) * 0.45];
  const rowHeight = 9;
  const headerHeight = 10;
  let curY = tableStartY;

  // Başlık satırı (rose gold)
  pdf.setFillColor(183, 110, 121);
  pdf.rect(margin, curY, pageWidth - 2 * margin, headerHeight, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  pdf.setTextColor(255, 255, 255);
  const headers = ['SAAT', 'GOREV / EYLEM', 'NOTLAR'];
  let colX = margin;
  headers.forEach((h, i) => {
    pdf.text(h, colX + 3, curY + 6.5);
    colX += colWidths[i];
  });
  curY += headerHeight;

  // Veri satırları
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);

  rows.forEach((row, index) => {
    // Sayfa sonu kontrolü
    if (curY + rowHeight > pageHeight - 14) {
      // Alt şerit + footer
      pdf.setFillColor(183, 110, 121);
      pdf.rect(0, pageHeight - 4, pageWidth, 4, 'F');
      pdf.setFontSize(7);
      pdf.setTextColor(107, 114, 128);
      pdf.text(`Olusturma: ${new Date().toLocaleString('tr-TR')} | Kayit Plani Sistemi`, margin, pageHeight - 6);

      // Yeni sayfa
      pdf.addPage();
      pdf.setFillColor(5, 10, 31);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');
      pdf.setFillColor(183, 110, 121);
      pdf.rect(0, 0, pageWidth, 3, 'F');
      curY = 10;

      // Yeni sayfa başlık satırı
      pdf.setFillColor(183, 110, 121);
      pdf.rect(margin, curY, pageWidth - 2 * margin, headerHeight, 'F');
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8);
      pdf.setTextColor(255, 255, 255);
      let hX = margin;
      headers.forEach((h, i) => {
        pdf.text(h, hX + 3, curY + 6.5);
        hX += colWidths[i];
      });
      curY += headerHeight;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
    }

    // Dönüşümlü arka plan
    const bgR = index % 2 === 0 ? 10 : 13;
    const bgG = index % 2 === 0 ? 17 : 21;
    const bgB = index % 2 === 0 ? 40 : 53;
    pdf.setFillColor(bgR, bgG, bgB);
    pdf.rect(margin, curY, pageWidth - 2 * margin, rowHeight, 'F');

    // Satır kenarlıkları
    pdf.setDrawColor(183, 110, 121);
    pdf.setLineWidth(0.1);
    colX = margin;
    colWidths.forEach((w) => {
      pdf.rect(colX, curY, w, rowHeight);
      colX += w;
    });

    // Hücre verileri
    colX = margin;
    // Saat hücresi
    pdf.setTextColor(156, 163, 175); // muted gray
    pdf.setFont('helvetica', 'bold');
    pdf.text(normalizeTurkish(row.timeSlot || ''), colX + 3, curY + 6);
    colX += colWidths[0];

    // Görev hücresi
    pdf.setTextColor(243, 244, 246); // white
    pdf.setFont('helvetica', 'normal');
    const actionText = pdf.splitTextToSize(normalizeTurkish(row.action || ''), colWidths[1] - 6);
    pdf.text(actionText[0] || '', colX + 3, curY + 6);
    colX += colWidths[1];

    // Notlar hücresi
    pdf.setTextColor(156, 163, 175);
    const notesText = pdf.splitTextToSize(normalizeTurkish(row.notes || ''), colWidths[2] - 6);
    pdf.text(notesText[0] || '', colX + 3, curY + 6);

    curY += rowHeight;
  });

  // ── Rose Gold Alt Şerit
  pdf.setFillColor(183, 110, 121);
  pdf.rect(0, pageHeight - 4, pageWidth, 4, 'F');

  // ── Footer
  pdf.setFontSize(7);
  pdf.setTextColor(107, 114, 128);
  pdf.text(`Olusturma: ${new Date().toLocaleString('tr-TR')} | Kayit Plani Sistemi`, margin, pageHeight - 6);

  pdf.save(`kayit-plani-${normalizeTurkish(institutionName).toLowerCase().replace(/\s+/g, '-')}.pdf`);
};
