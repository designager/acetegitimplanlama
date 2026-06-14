export const processLogoForDarkTheme = (base64: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
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

        // Beyaz veya çok açık gri arka planları transparan yap
        if (r > 200 && g > 200 && b > 200) {
          data[i+3] = 0; 
        } 
        // Siyah veya çok koyu renkleri beyaza çevir
        else if (r < 80 && g < 80 && b < 80) {
          data[i] = 255;
          data[i+1] = 255;
          data[i+2] = 255;
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
      // Sonucu PNG olarak döndür (transparanlık korunsun diye)
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => resolve(base64); // Hata olursa orijinali dön
    img.src = base64;
  });
};
