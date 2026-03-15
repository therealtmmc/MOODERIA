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
                "p-8 rounded-[2rem] shadow-2xl flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-500 border-4 border-white/20",
                "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500"
              )}
            >
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              
              <div className="relative z-10 text-center">
                <div className="inline-block px-4 py-1 bg-white/20 rounded-full text-white text-[10px] font-black uppercase tracking-widest mb-6 backdrop-blur-md shadow-sm">
                  Mooderia Memory
                </div>
                <h3 className="text-white font-black text-4xl leading-tight drop-shadow-lg break-words mb-4 px-2">{title}</h3>
                <div className="w-16 h-1 bg-white/30 rounded-full mx-auto mb-4"></div>
                <p className="text-white/80 text-sm font-bold uppercase tracking-widest">Tap to View</p>
              </div>
            </div>

            {/* Instructions */}
            <div className="mt-6 bg-purple-50 p-4 rounded-2xl border border-purple-100">
              <h4 className="text-purple-900 font-bold text-sm mb-2 uppercase tracking-wide">How to Share to Story:</h4>
              <ol className="text-purple-700 text-xs space-y-1 list-decimal list-inside">
                <li>Click <strong>"Copy Link"</strong> to copy the memory URL.</li>
                <li>Click <strong>"Save Card"</strong> to download the image.</li>
                <li>Open Instagram/Facebook Story.</li>
                <li>Upload the saved image.</li>
                <li>Add a <strong>"Link" sticker</strong> and paste the URL.</li>
              </ol>
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
