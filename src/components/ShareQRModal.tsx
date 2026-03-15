import React, { useRef, useState, useEffect } from 'react';
import { toPng } from 'html-to-image';
import { X, Download, Share2, Loader2, Cloud, Copy, Check } from 'lucide-react';
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
  const cardRef = useRef<HTMLDivElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [cloudId, setCloudId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const isMedia = (val: any) => val instanceof Blob || (typeof val === 'string' && (val.startsWith('http') || val.startsWith('data:')));
      const hasMedia = isMedia(data.image) || isMedia(data.video) || isMedia(data.audio);
      
      if (hasMedia) {
        const startCloudShare = async () => {
          setIsUploading(true);
          setUploadProgress(0);
          setError(null);

          // Check if any file exceeds 20MB
          const MAX_SIZE = 20 * 1024 * 1024; // 20MB
          const files = [data.image, data.video, data.audio].filter(f => f instanceof Blob) as Blob[];
          if (files.some(f => f.size > MAX_SIZE)) {
            setError("Media file is too large (max 20MB).");
            setIsUploading(false);
            return;
          }

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
                {isUploading ? (uploadProgress < 50 ? "Compressing Video..." : "Uploading...") : "Share Memory"}
              </h2>
            </div>

            {/* Share Card Container (This is what gets captured) */}
            <div 
              ref={cardRef} 
              className={cn(
                "p-8 rounded-[2rem] shadow-xl flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-500",
                "bg-gradient-to-br from-purple-500 to-indigo-600"
              )}
            >
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              
              <div className="relative z-10 text-center">
                <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-white text-[10px] font-black uppercase tracking-widest mb-4 backdrop-blur-sm">
                  Mooderia Memory
                </div>
                <h3 className="text-white font-black text-3xl leading-tight drop-shadow-md break-words mb-2">{title}</h3>
                <p className="text-indigo-200 text-sm font-bold uppercase tracking-widest">Scan to View</p>
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-[10px] font-bold text-center mt-4 uppercase">{error}</p>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={copyToClipboard}
                className="flex-1 py-4 bg-gray-100 text-gray-900 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                {copied ? "Copied" : "Copy Link"}
              </button>
              <button
                onClick={handleDownload}
                disabled={isUploading}
                className="flex-1 py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 shadow-lg active:scale-95 disabled:opacity-50"
              >
                <Download className="w-5 h-5" />
                Save Card
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
