import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

let ffmpeg: FFmpeg | null = null;

const loadFFmpeg = async () => {
  if (ffmpeg) return ffmpeg;
  
  ffmpeg = new FFmpeg();
  // Using CDN for core files to avoid bundling issues
  await ffmpeg.load({
    coreURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm/ffmpeg-core.js',
    wasmURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm/ffmpeg-core.wasm',
  });
  return ffmpeg;
};

export const compressVideo = async (
  videoBlob: Blob, 
  onProgress: (progress: number) => void
): Promise<Blob> => {
  const ffmpegInstance = await loadFFmpeg();
  
  const inputName = 'input.mp4';
  const outputName = 'output.mp4';
  
  await ffmpegInstance.writeFile(inputName, await fetchFile(videoBlob));
  
  // FFmpeg command to compress:
  // -vcodec libx264: Use H.264 codec
  // -crf 28: Constant Rate Factor (higher = more compression, lower quality)
  // -preset veryfast: Faster compression
  // -vf scale=-2:480: Scale to 480p height, maintaining aspect ratio
  await ffmpegInstance.exec([
    '-i', inputName,
    '-vcodec', 'libx264',
    '-crf', '28',
    '-preset', 'veryfast',
    '-vf', 'scale=-2:480',
    outputName
  ]);
  
  const data = await ffmpegInstance.readFile(outputName);
  
  // Clean up
  await ffmpegInstance.deleteFile(inputName);
  await ffmpegInstance.deleteFile(outputName);
  
  return new Blob([data], { type: 'video/mp4' });
};
