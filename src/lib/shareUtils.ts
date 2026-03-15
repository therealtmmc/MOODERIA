import LZString from 'lz-string';

export type ShareType = 'diary' | 'workout' | 'event' | 'market' | 'passport';

export interface SharePayload {
  type: ShareType;
  data: any;
}

export const encodeShareData = (type: ShareType, data: any): string => {
  // Deep clone and strip large media for sharing safety
  const safeData = JSON.parse(JSON.stringify(data, (key, value) => {
    if (typeof value === 'string' && value.length > 5000) {
      return "[Media too large for QR]";
    }
    if (value instanceof Blob) {
      return "[Media Blob]";
    }
    return value;
  }));

  const payload: SharePayload = { type, data: safeData };
  const jsonString = JSON.stringify(payload);
  // Compress and encode for URL
  return LZString.compressToEncodedURIComponent(jsonString);
};

export const decodeShareData = (encodedData: string): SharePayload | null => {
  try {
    const jsonString = LZString.decompressFromEncodedURIComponent(encodedData);
    if (!jsonString) return null;
    return JSON.parse(jsonString) as SharePayload;
  } catch (e) {
    console.error("Failed to decode share data", e);
    return null;
  }
};

export const generateShareUrl = (type: ShareType, data: any): string => {
  const encoded = encodeShareData(type, data);
  const baseUrl = window.location.origin;
  return `${baseUrl}/share?d=${encoded}`;
};

export const generateCloudShareUrl = (cloudId: string): string => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/share?c=${cloudId}`;
};
