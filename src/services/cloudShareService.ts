import { db, storage } from '../lib/firebase';
import { collection, addDoc, getDoc, doc } from 'firebase/firestore';
import { ref, uploadBytesResumable, uploadBytes, getDownloadURL, UploadTaskSnapshot } from 'firebase/storage';
import { compressVideo } from '../lib/videoCompressor';

export const uploadMedia = async (
  blob: Blob, 
  path: string, 
  onProgress: (progress: number) => void
): Promise<string> => {
  const storageRef = ref(storage, path);
  
  // Use uploadBytes for small files (< 5MB) for faster upload
  if (blob.size < 5 * 1024 * 1024) {
    onProgress(50); // Jump to 50%
    await uploadBytes(storageRef, blob);
    onProgress(100);
    return getDownloadURL(storageRef);
  }

  // Use uploadBytesResumable for larger files
  const uploadTask = uploadBytesResumable(storageRef, blob);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot: UploadTaskSnapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress(progress);
      },
      (error) => reject(error),
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadURL);
      }
    );
  });
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
  const processedData = { ...data };
  
  const mediaKeys = ['image', 'video', 'audio'];
  const mediaToUpload = mediaKeys.filter(key => data[key] instanceof Blob || (typeof data[key] === 'string' && data[key].startsWith('data:')));
  
  const progressMap = new Map<string, number>();
  
  const updateProgress = () => {
    const totalProgress = Array.from(progressMap.values()).reduce((a, b) => a + b, 0) / (mediaToUpload.length || 1);
    onProgress(totalProgress);
  };

  const processMedia = async (key: string, folder: string) => {
    let blob: Blob;
    if (data[key] instanceof Blob) {
      blob = data[key];
    } else {
      blob = await dataUrlToBlob(data[key]);
    }
    
    // Compress video if it's a video and larger than 5MB
    if (key === 'video' && blob.size > 5 * 1024 * 1024) {
      progressMap.set(key, 0); // Start progress at 0 for compression
      blob = await compressVideo(blob, (p) => {
        // Compression is roughly 50% of the total task
        progressMap.set(key, p * 0.5);
        updateProgress();
      });
      // Compression done, now upload
      progressMap.set(key, 50);
    } else if (key === 'video') {
      // Skipping compression, set progress to 50% to align with upload logic
      progressMap.set(key, 50);
    }
    
    processedData[key] = await uploadMedia(blob, `shares/${folder}/${crypto.randomUUID()}`, (p) => {
      // Upload is the other 50%
      progressMap.set(key, 50 + p * 0.5);
      updateProgress();
    });
  };

  await Promise.all(mediaToUpload.map(key => processMedia(key, key === 'image' ? 'images' : key === 'video' ? 'videos' : 'audio')));

  const docRef = await addDoc(collection(db, 'shared_memories'), {
    type,
    data: processedData,
    createdAt: new Date().toISOString(),
  });

  return docRef.id;
};

export const getCloudShare = async (id: string): Promise<{ type: string, data: any } | null> => {
  const docSnap = await getDoc(doc(db, 'shared_memories', id));
  if (docSnap.exists()) {
    return docSnap.data() as { type: string, data: any };
  }
  return null;
};
