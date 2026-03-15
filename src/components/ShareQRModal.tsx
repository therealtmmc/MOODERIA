import React, { useRef, useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { toPng } from 'html-to-image';
import { X, Download, Share2, Loader2, Cloud } from 'lucide-react';
import { generateShareUrl, generateCloudShareUrl, ShareType } from '@/lib/shareUtils';
import { motion, AnimatePresence } from 'motion/react';
import { createCloudShare } from '@/services/cloudShareService';
import { cn } from '@/lib/utils';

interface ShareQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: ShareType;
  data: any;
  title: string;
}

export function ShareQRModal({ isOpen, onClose, type, data, title }: ShareQRModalProps) {
  const qrRef = useRef<HTMLDivElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [cloudId, setCloudId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const isMedia = (val: any) => val instanceof Blob || (typeof val === 'string' && (val.startsWith('http') || val.startsWith('data:')));
      const hasMedia = isMedia(data.image) || isMedia(data.video) || isMedia(data.audio);
      
      if (hasMedia) {
        const startCloudShare = async () => {
          setIsUploading(true);
          setUploadProgress(0);
          setError(null);
          try {
            const id = await createCloudShare(type, data, (progress) => {
              setUploadProgress(progress);
            });
            setCloudId(id);
          } catch (err) {
            console.error("Cloud share failed", err);
            setError("Failed to upload media to cloud. Sharing without media.");
          } finally {
            setIsUploading(false);
          }
        };
        startCloudShare();
      } else {
        setCloudId(null);
        setError(null);
      }
    }
  }, [isOpen, data, type]);

  const handleDownload = async () => {
    if (!qrRef.current) return;
    try {
      const dataUrl = await toPng(qrRef.current, {
        quality: 1,
        pixelRatio: 3, // High resolution
        skipFonts: false,
      });
      const link = document.createElement('a');
      link.download = `Mooderia-${type}-${title.replace(/\s+/g, '-')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Failed to download QR code', error);
    }
  };

  const shareUrl = cloudId ? generateCloudShareUrl(cloudId) : generateShareUrl(type, data);

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
                {isUploading ? <Loader2 className="w-8 h-8 animate-spin" /> : cloudId ? <Cloud className="w-8 h-8" /> : <Share2 className="w-8 h-8" />}
              </div>
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
                {isUploading ? (uploadProgress < 50 ? "Compressing Video..." : "Uploading...") : cloudId ? "Cloud Link Ready" : `Share ${type}`}
              </h2>
              {isUploading ? (
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                  <div className="bg-purple-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                </div>
              ) : (
                <p className="text-sm font-bold text-gray-500 mt-1">
                  {cloudId ? "Scan to open in Mooderia" : "Scan to open in Mooderia"}
                </p>
              )}
            </div>

            {/* QR Code Container (This is what gets captured) */}
            <div 
              ref={qrRef} 
              className={cn(
                "p-8 rounded-[2rem] shadow-xl flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-500",
                isUploading ? "bg-gray-200" : cloudId ? "bg-gradient-to-br from-blue-500 to-indigo-600" : "bg-gradient-to-br from-purple-500 to-indigo-600"
              )}
              style={{
                background: isUploading ? '#e5e7eb' : cloudId ? 'linear-gradient(135deg, #3b82f6 0%, #4338ca 100%)' : 'linear-gradient(135deg, #8b5cf6 0%, #4338ca 100%)',
              }}
            >
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              
              <div className="bg-white p-4 rounded-2xl shadow-lg relative z-10 mb-4">
                {isUploading ? (
                  <div className="w-[180px] h-[180px] flex items-center justify-center bg-gray-50 rounded-lg">
                    <Loader2 className="w-12 h-12 text-gray-300 animate-spin" />
                  </div>
                ) : (
                  <QRCodeCanvas 
                    value={shareUrl} 
                    size={180} 
                    level="H"
                    includeMargin={false}
                    fgColor={cloudId ? "#1e40af" : "#4338ca"}
                  />
                )}
              </div>
              
              <div className="mt-2 text-center relative z-10 w-full">
                <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-white text-[10px] font-black uppercase tracking-widest mb-2 backdrop-blur-sm">
                  {isUploading ? "Processing" : cloudId ? "Cloud Link" : type}
                </div>
                <h3 className="text-white font-black text-xl leading-tight drop-shadow-md break-words line-clamp-2">{title}</h3>
                <p className="text-indigo-200 text-[10px] font-bold uppercase tracking-widest mt-2">Mooderia Republic</p>
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-[10px] font-bold text-center mt-4 uppercase">{error}</p>
            )}

            <button
              onClick={handleDownload}
              disabled={isUploading}
              className="w-full mt-6 py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 shadow-lg active:scale-95 disabled:opacity-50"
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
