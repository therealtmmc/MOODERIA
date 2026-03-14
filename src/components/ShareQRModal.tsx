import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import { X, Download, Share2 } from 'lucide-react';
import { generateShareUrl, ShareType } from '@/lib/shareUtils';
import { motion, AnimatePresence } from 'motion/react';

interface ShareQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: ShareType;
  data: any;
  title: string;
}

export function ShareQRModal({ isOpen, onClose, type, data, title }: ShareQRModalProps) {
  const qrRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!qrRef.current) return;
    try {
      const canvas = await html2canvas(qrRef.current, {
        scale: 2, // Higher resolution
        backgroundColor: null,
      });
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Mooderia-${type}-${title.replace(/\s+/g, '-')}.png`;
      link.href = url;
      link.click();
    } catch (error) {
      console.error('Failed to download QR code', error);
    }
  };

  const shareUrl = generateShareUrl(type, data);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
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
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-purple-600 shadow-inner">
                <Share2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Share {type}</h2>
              <p className="text-sm font-bold text-gray-500 mt-1">Scan to open in Mooderia</p>
            </div>

            {/* QR Code Container (This is what gets captured) */}
            <div 
              ref={qrRef} 
              className="bg-gradient-to-br from-purple-500 to-indigo-600 p-8 rounded-[2rem] shadow-xl flex flex-col items-center justify-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              
              <div className="bg-white p-4 rounded-2xl shadow-lg relative z-10">
                <QRCodeSVG 
                  value={shareUrl} 
                  size={200} 
                  level="H"
                  includeMargin={false}
                  fgColor="#46178f"
                />
              </div>
              
              <div className="mt-6 text-center relative z-10">
                <h3 className="text-white font-black text-xl leading-tight drop-shadow-md">{title}</h3>
                <p className="text-purple-200 text-xs font-bold uppercase tracking-widest mt-1">Mooderia Republic</p>
              </div>
            </div>

            <button
              onClick={handleDownload}
              className="w-full mt-6 py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 shadow-lg active:scale-95"
            >
              <Download className="w-5 h-5" />
              Save Photo
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
