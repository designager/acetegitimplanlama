export const processLogoForDarkTheme = (base64: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        // Handle SVGs without intrinsic dimensions
        canvas.width = img.width || 800;
        canvas.height = img.height || 600;
        
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
          resolve(base64);
          return;
        }
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i+1];
          const b = data[i+2];
          const a = data[i+3];
          
          // Çok düşük görünürlüğü olan (neredeyse transparan) pikselleri direkt sil
          if (a < 5) {
            data[i+3] = 0;
            continue;
          }

          // Açık renkli pikselleri sil (beyaz arka planları yok et)
          if (r > 180 && g > 180 && b > 180) {
            data[i+3] = 0; 
          } 
          // Kalan tüm pikselleri (siyah, renkli) TAM BEYAZ yap (siluet)
          else {
            data[i] = 255;
            data[i+1] = 255;
            data[i+2] = 255;
            // Orijinal alpha korunuyor (a = a), sadece renk beyaza dönüyor.
            // Ancak aşırı saydamlık varsa biraz daha görünür yapabiliriz.
            if (a > 0 && a < 255) {
              data[i+3] = Math.min(255, a + 50); // anti-aliasing'i biraz güçlendir
            }
          }
        }
        
        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } catch (err) {
        console.error("Logo dönüştürme hatası:", err);
        resolve(base64);
      }
    };
    img.onerror = (err) => {
      console.error("Logo yükleme hatası:", err);
      resolve(base64);
    };
    img.src = base64;
  });
};
