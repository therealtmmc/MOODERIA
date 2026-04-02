import { compressVideo } from'../lib/videoCompressor';

export const uploadMedia = async (
 blob: Blob, 
 path: string, 
 onProgress: (progress: number) => void
): Promise<string> => {
 // Cloud sharing is disabled as Firebase has been removed.
 return"";
};

const dataUrlToBlob = async (dataUrl: string): Promise<Blob> => {
 const response = await fetch(dataUrl);
 return await response.blob();
};

export const createCloudShare = async (
 type: string, 
 data: any, 
 onProgress: (progress: number) => void
): Promise<string> => {
 // Cloud sharing is disabled as Firebase has been removed.
 return"";
};

export const getCloudShare = async (id: string): Promise<{ type: string, data: any } | null> => {
 // Cloud sharing is disabled as Firebase has been removed.
 return null;
};
