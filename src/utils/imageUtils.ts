export const processLogoForDarkTheme = (base64: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
          resolve(base64);
          return;
        }
        
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i+1];
          const b = data[i+2];
          const a = data[i+3];
          
          if (a === 0) continue;

          // Eğer piksel çok açık renkliyse (beyaz/açık gri arka plan gibi), tamamen saydam yap
          if (r > 200 && g > 200 && b > 200) {
            data[i+3] = 0; 
          } 
          // Geri kalan her şeyi (siyah, gri, anti-alias kenarlar, renkli kısımlar) tam BEYAZ yap!
          else {
            data[i] = 255;   // R
            data[i+1] = 255; // G
            data[i+2] = 255; // B
            // a (alpha) değerine dokunmuyoruz ki yumuşak kenarlar (anti-aliasing) korunsun
          }
        }
        
        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } catch (err) {
        console.error("Logo dönüştürme hatası:", err);
        resolve(base64);
      }
    };
    img.onerror = () => resolve(base64);
    img.src = base64;
  });
};
