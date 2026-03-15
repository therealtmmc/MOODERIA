import { db, storage } from '../lib/firebase';
import { collection, addDoc, getDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const uploadMedia = async (blob: Blob, path: string): Promise<string> => {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, blob);
  return getDownloadURL(storageRef);
};

export const createCloudShare = async (type: string, data: any): Promise<string> => {
  // 1. Handle media uploads if any
  const processedData = { ...data };
  
  if (data.image instanceof Blob) {
    processedData.image = await uploadMedia(data.image, `shares/images/${crypto.randomUUID()}`);
  }
  if (data.video instanceof Blob) {
    processedData.video = await uploadMedia(data.video, `shares/videos/${crypto.randomUUID()}`);
  }
  if (data.audio instanceof Blob) {
    processedData.audio = await uploadMedia(data.audio, `shares/audio/${crypto.randomUUID()}`);
  }

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
