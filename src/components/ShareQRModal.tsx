import React, { useRef, useState, useEffect } from 'react';
import { toPng } from 'html-to-image';
import { X, Download, Share2, Loader2, Cloud, Copy, Check, Mail, Terminal } from 'lucide-react';
import { generateShareUrl, generateCloudShareUrl, ShareType } from '@/lib/shareUtils';
import { motion, AnimatePresence } from 'motion/react';
import { createCloudShare } from '@/services/cloudShareService';
import { cn } from '@/lib/utils';
import { QRCodeSVG } from 'qrcode.react';
import { useStore } from '@/context/StoreContext';

interface ShareQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: ShareType;
  data: any;
  title: string;
}

export function ShareQRModal({ isOpen, onClose, type, data, title }: ShareQRModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [cloudId, setCloudId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { state } = useStore();

  useEffect(() => {
    if (isOpen) {
      setCloudId(null);
      setError(null);
    }
  }, [isOpen]);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 3, // High resolution
        skipFonts: false,
      });
      const link = document.createElement('a');
      link.download = `Mooderia-${type}-${title.replace(/\s+/g, '-')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Failed to download share card', error);
    }
  };

  const shareUrl = cloudId ? generateCloudShareUrl(cloudId) : generateShareUrl(type, data);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={cn("fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm", state.isStarkTheme && "stark-theme")}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-[2.5rem] p-6 sm:p-8 max-w-sm w-full shadow-2xl relative"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-red-500 shadow-inner">
                {isUploading ? <Loader2 className="w-8 h-8 animate-spin" /> : (state.isStarkTheme ? <Terminal className="w-8 h-8" /> : <Mail className="w-8 h-8" />)}
              </div>
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
                {isUploading ? (uploadProgress < 50 ? "Compressing Video..." : "Uploading...") : (state.isStarkTheme ? "ENCRYPT DATA" : "Share Memory")}
              </h2>
            </div>

            {/* Share Card Container (This is what gets captured) */}
            <div 
              ref={cardRef} 
              className={cn(
                "p-8 rounded-[2rem] shadow-2xl flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-500 bg-[#fdfbf7]"
              )}
            >
              {/* Airmail Border */}
              {!state.isStarkTheme && <div className="absolute inset-0 pointer-events-none" style={{ border: '12px solid transparent', borderImage: 'repeating-linear-gradient(45deg, #e53e3e 0, #e53e3e 10px, transparent 10px, transparent 20px, #3182ce 20px, #3182ce 30px, transparent 30px, transparent 40px) 12' }}></div>}
              {state.isStarkTheme && <div className="absolute inset-0 border-[12px] border-green-500 pointer-events-none"></div>}
              
              {/* Mail Envelope Flap Design */}
              {!state.isStarkTheme && <div className="absolute top-0 left-0 right-0 h-16 bg-red-500/5 border-b border-dashed border-red-500/20" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}></div>}

              <div className="relative z-10 text-center w-full flex flex-col items-center mt-4">
                <div className="inline-block px-4 py-1 bg-red-100 rounded-full text-red-600 text-[10px] font-black uppercase tracking-widest mb-4 border border-red-200 shadow-sm">
                  {state.isStarkTheme ? "SECURE_PACKET" : "Mooderia Post"}
                </div>
                <h3 className={cn("text-gray-800 font-black text-2xl leading-tight break-words mb-6 px-2", !state.isStarkTheme && "font-serif italic")}>{title}</h3>
                
                <div className="bg-white p-3 rounded-2xl shadow-md border-2 border-gray-100 mb-4">
                  <QRCodeSVG value={shareUrl} size={140} level="H" includeMargin={false} fgColor={state.isStarkTheme ? "#22c55e" : "#000000"} bgColor={state.isStarkTheme ? "#000000" : "#ffffff"} />
                </div>
                
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{state.isStarkTheme ? "> DECRYPTING MEMORY..." : "Scan to Open Letter"}</p>
              </div>
            </div>

            {/* Instructions */}
            <div className="mt-6 bg-red-50 p-4 rounded-2xl border border-red-100">
              <h4 className="text-red-900 font-bold text-sm mb-2 uppercase tracking-wide">{state.isStarkTheme ? "EXECUTION PROTOCOL:" : "How to Share:"}</h4>
              <ol className="text-red-700 text-xs space-y-1 list-decimal list-inside">
                <li>Click <strong>{state.isStarkTheme ? "SAVE DATA" : "Save Card"}</strong> to download the image.</li>
                <li>Send the image to your friends.</li>
                <li>They can scan the QR code to read your memory.</li>
              </ol>
            </div>

            {error && (
              <p className="text-red-500 text-[10px] font-bold text-center mt-4 uppercase">{error}</p>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleDownload}
                disabled={isUploading}
                className="w-full py-4 bg-red-500 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-red-600 transition-colors flex items-center justify-center gap-2 shadow-lg active:scale-95 disabled:opacity-50 border-b-4 border-red-700 active:border-b-0 active:translate-y-1"
              >
                <Download className="w-5 h-5" />
                {state.isStarkTheme ? "SAVE DATA" : "Save Card"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
