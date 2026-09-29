// Downscale and re-encode images as JPEG before upload.
// Keeps request payloads small and guarantees the MIME type the server expects.
const MAX_DIMENSION = 1280;
const JPEG_QUALITY = 0.85;

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export const drawToJpeg = (
  source: CanvasImageSource,
  width: number,
  height: number
): string => {
  const scale = Math.min(1, MAX_DIMENSION / Math.max(width, height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', JPEG_QUALITY);
};

export const compressImageFile = async (file: File): Promise<string> => {
  const original = await readFileAsDataUrl(file);
  try {
    const img = await loadImage(original);
    return drawToJpeg(img, img.naturalWidth, img.naturalHeight);
  } catch {
    // Formats the browser cannot decode (e.g. HEIC on desktop) are sent as-is.
    return original;
  }
};

export const getDataUrlMimeType = (dataUrl: string) =>
  /^data:([^;]+);base64,/.exec(dataUrl)?.[1] || 'image/jpeg';
