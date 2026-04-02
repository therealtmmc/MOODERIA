import { FFmpeg } from'@ffmpeg/ffmpeg';
import { fetchFile } from'@ffmpeg/util';

let ffmpeg: FFmpeg | null = null;

const loadFFmpeg = async () => {
 if (ffmpeg) return ffmpeg;
 
 ffmpeg = new FFmpeg();
 // Using CDN for core files to avoid bundling issues
 await ffmpeg.load({
 coreURL:'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm/ffmpeg-core.js',
 wasmURL:'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm/ffmpeg-core.wasm',
 });
 return ffmpeg;
};

export const compressVideo = async (
 videoBlob: Blob, 
 onProgress: (progress: number) => void
): Promise<Blob> => {
 try {
 const ffmpegInstance = await loadFFmpeg();
 
 const inputName ='input.mp4';
 const outputName ='output.mp4';
 
 await ffmpegInstance.writeFile(inputName, await fetchFile(videoBlob));
 
 // Set a timeout for compression
 const timeoutPromise = new Promise((_, reject) => 
 setTimeout(() => reject(new Error('Compression timed out')), 60000)
 );

 const compressionPromise = ffmpegInstance.exec([
'-i', inputName,
'-vcodec','libx264',
'-crf','30',
'-preset','ultrafast',
'-vf','scale=-2:480',
 outputName
 ]);

 await Promise.race([compressionPromise, timeoutPromise]);
 
 const data = await ffmpegInstance.readFile(outputName);
 
 // Clean up
 await ffmpegInstance.deleteFile(inputName);
 await ffmpegInstance.deleteFile(outputName);
 
 return new Blob([data], { type:'video/mp4' });
 } catch (error) {
 console.error('Compression failed, falling back to original:', error);
 return videoBlob; // Fallback to original
 }
};
