import React, { useRef, useState } from 'react';
import { UploadCloud, X } from 'lucide-react';

interface LogoUploaderProps {
  currentLogo?: string;
  onLogoSelect: (base64: string) => void;
  onLogoRemove: () => void;
}

import { processLogoForDarkTheme } from '../utils/imageUtils';

export const LogoUploader: React.FC<LogoUploaderProps> = ({ currentLogo, onLogoSelect, onLogoRemove }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError('Dosya boyutu 2MB den küçük olmalıdır.');
      return;
    }
    
    setError('');
    const reader = new FileReader();
    reader.onload = async (event) => {
      if (event.target?.result) {
        const originalBase64 = event.target.result as string;
        const processedBase64 = await processLogoForDarkTheme(originalBase64);
        onLogoSelect(processedBase64);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="mt-2">
      {currentLogo ? (
        <div className="relative inline-block border border-white/10 rounded-lg p-3 bg-[#0A1128]">
          <img src={currentLogo} alt="Logo" className="h-20 object-contain" />
          <button
            type="button"
            onClick={onLogoRemove}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div 
          className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:bg-white/5 cursor-pointer transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <UploadCloud className="mx-auto text-gray-400 mb-2" size={32} />
          <p className="text-sm text-text-muted">Logo yüklemek için tıklayın</p>
          <p className="text-xs text-gray-400 mt-1">PNG, JPG veya SVG (Maks: 2MB)</p>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/png, image/jpeg, image/svg+xml" 
            className="hidden" 
          />
        </div>
      )}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};
