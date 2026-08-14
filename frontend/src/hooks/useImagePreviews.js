import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export function useImagePreviews() {
  const [images, setImages] = useState([]);
  const previewUrls = useRef(new Set());

  useEffect(() => {
    const urls = previewUrls.current;
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  const addImages = useCallback((files) => {
    const fileList = Array.from(files);
    const validFiles = fileList.filter((file) => file.type.startsWith('image/'));
    const invalidFileCount = fileList.length - validFiles.length;
    const newImages = validFiles.map((file) => {
      const previewUrl = URL.createObjectURL(file);
      previewUrls.current.add(previewUrl);

      return {
        id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
        file,
        previewUrl,
      };
    });

    setImages((currentImages) => [...currentImages, ...newImages]);
    return invalidFileCount;
  }, []);

  const removeImage = useCallback((imageId) => {
    setImages((currentImages) => {
      const removedImage = currentImages.find((image) => image.id === imageId);
      if (removedImage) {
        URL.revokeObjectURL(removedImage.previewUrl);
        previewUrls.current.delete(removedImage.previewUrl);
      }
      return currentImages.filter((image) => image.id !== imageId);
    });
  }, []);

  const clearImages = useCallback(() => {
    setImages((currentImages) => {
      currentImages.forEach((image) => {
        URL.revokeObjectURL(image.previewUrl);
        previewUrls.current.delete(image.previewUrl);
      });
      return [];
    });
  }, []);

  return useMemo(
    () => ({ images, addImages, removeImage, clearImages }),
    [images, addImages, removeImage, clearImages],
  );
}
