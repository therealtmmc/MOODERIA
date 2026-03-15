import React, { useRef, useState, useEffect } from 'react';
import { toPng } from 'html-to-image';
import { X, Download, Share2, Loader2, Cloud, Copy, Check, Mail, Terminal } from 'lucide-react';
import { generateShareUrl, generateCloudShareUrl, ShareType } from '@/lib/shareUtils';
import { motion, AnimatePresence } from 'motion/react';
import { createCloudShare } from '@/services/cloudShareService';
import { cn } from '@/lib/utils';
import { QRCodeSVG } from 'qrcode.react';
import { useStore } from '@/context/StoreContext';
import { format } from 'date-fns';

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
                "p-6 rounded-3xl flex flex-col items-center relative overflow-hidden transition-colors duration-500 mx-auto",
                state.isStarkTheme ? "bg-black border-4 border-green-500" : "bg-[#ffde59] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
              )}
              style={{ width: '100%', maxWidth: '320px', minHeight: '460px' }}
            >
              {/* Background pattern for cartoony feel */}
              {!state.isStarkTheme && (
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '16px 16px' }}></div>
              )}

              {/* Top Section: Mooderia + Name */}
              <div className="w-full relative z-10 flex flex-col items-center mt-2 mb-6">
                <h1 className={cn("text-4xl font-black uppercase tracking-tighter", state.isStarkTheme ? "text-green-500" : "text-black")}>
                  MOODERIA
                </h1>
                <div className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-black border-2 mt-1 uppercase tracking-wider", 
                  state.isStarkTheme ? "border-green-500 text-green-400 bg-black" : "border-black text-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -rotate-2"
                )}>
                  FROM: {state.userProfile?.displayName || "MYSTERY SENDER"}
                </div>
              </div>

              {/* Title / Content */}
              <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center text-center px-4 mb-8">
                <h3 className={cn(
                  "font-black text-2xl leading-tight break-words", 
                  state.isStarkTheme ? "text-green-400" : "text-black"
                )}>
                  {title}
                </h3>
              </div>

              {/* Stamp of specific section */}
              <div className={cn(
                "absolute top-32 right-2 w-20 h-20 rounded-full border-4 flex items-center justify-center font-black text-[10px] rotate-12 z-20 opacity-90",
                state.isStarkTheme ? "border-green-500 text-green-500 bg-black" : "border-[#ff3b30] text-[#ff3b30] bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              )}>
                <div className="border-2 border-current rounded-full w-[68px] h-[68px] flex items-center justify-center text-center leading-none p-1 uppercase tracking-tighter">
                  {type}
                </div>
              </div>

              {/* Bottom Section: QR + Date */}
              <div className="relative z-10 flex flex-col items-center mt-auto w-full mb-2">
                <div className={cn(
                  "p-3 rounded-2xl mb-3",
                  state.isStarkTheme ? "bg-black border-2 border-green-500" : "bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-1"
                )}>
                  <QRCodeSVG value={shareUrl} size={130} level="H" includeMargin={false} fgColor={state.isStarkTheme ? "#22c55e" : "#000000"} bgColor={state.isStarkTheme ? "#000000" : "#ffffff"} />
                </div>
                
                <p className={cn(
                  "text-[10px] font-black uppercase tracking-widest mt-1", 
                  state.isStarkTheme ? "text-green-600" : "text-black/60"
                )}>
                  {format(new Date(), 'MMM dd, yyyy')}
                </p>
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
