import { db, storage } from '../lib/firebase';
import { collection, addDoc, getDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const uploadMedia = async (blob: Blob, path: string): Promise<string> => {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, blob);
  return getDownloadURL(storageRef);
};

const dataUrlToBlob = async (dataUrl: string): Promise<Blob> => {
  const response = await fetch(dataUrl);
  return await response.blob();
};

export const createCloudShare = async (type: string, data: any): Promise<string> => {
  // 1. Handle media uploads if any
  const processedData = { ...data };
  
  const processMedia = async (key: string, folder: string) => {
    if (data[key] instanceof Blob) {
      processedData[key] = await uploadMedia(data[key], `shares/${folder}/${crypto.randomUUID()}`);
    } else if (typeof data[key] === 'string' && data[key].startsWith('data:')) {
      const blob = await dataUrlToBlob(data[key]);
      processedData[key] = await uploadMedia(blob, `shares/${folder}/${crypto.randomUUID()}`);
    }
  };

  await processMedia('image', 'images');
  await processMedia('video', 'videos');
  await processMedia('audio', 'audio');

  // 2. Save to Firestore
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
