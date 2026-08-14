import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ImagePlus, Sparkles, UploadCloud, X } from 'lucide-react';

import EmptyState from './EmptyState';
import ErrorAlert from './ErrorAlert';
import GlassCard from './GlassCard';
import LoadingOverlay from './LoadingOverlay';
import SuccessToast from './SuccessToast';
import { useImagePreviews } from '../hooks/useImagePreviews';
import { uploadPhotoCollection } from '../services/api';

function UploadSection({ resetVersion, onUploadComplete }) {
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const { images, addImages, removeImage, clearImages } = useImagePreviews();

  useEffect(() => {
    clearImages();
    setErrorMessage('');
    setSuccessMessage('');
    setUploadProgress(0);
  }, [clearImages, resetVersion]);

  const addSelectedImages = useCallback((files) => {
    const invalidCount = addImages(files);
    setSuccessMessage('');
    setErrorMessage(invalidCount ? `${invalidCount} non-image file${invalidCount > 1 ? 's were' : ' was'} skipped.` : '');
  }, [addImages]);

  const handleUpload = async () => {
    if (!images.length) {
      setErrorMessage('Select at least one image before uploading.');
      return;
    }

    setErrorMessage('');
    setSuccessMessage('');
    setUploadProgress(0);
    setIsUploading(true);
    try {
      const result = await uploadPhotoCollection({
        images,
        onUploadProgress: (event) => {
          if (event.total) setUploadProgress(Math.round((event.loaded * 100) / event.total));
        },
      });
      onUploadComplete(result);
      clearImages();
      setSuccessMessage('Collection uploaded successfully.');
    } catch (error) {
      setErrorMessage(error.message || 'The collection could not be uploaded.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section aria-labelledby="upload-title">
      <SectionHeading eyebrow="01 · Upload" title="Upload Collection" description="Add any number of photos. Every face in every photo is ready to search." />
      <GlassCard className="relative p-6 sm:p-9">
        <AnimatePresence>{isUploading && <LoadingOverlay title="Processing faces..." progress={uploadProgress} />}</AnimatePresence>
        <label
          className={`upload-dropzone ${isDragging ? 'is-dragging' : ''} ${isUploading ? 'pointer-events-none opacity-60' : ''}`}
          tabIndex={0}
          onDragEnter={() => setIsDragging(true)}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            if (!isUploading) addSelectedImages(event.dataTransfer.files);
          }}
          onPaste={(event) => addSelectedImages(event.clipboardData.files)}
        >
          <motion.span className="upload-icon" animate={isDragging ? { scale: [1, 1.08, 1], rotate: [0, -3, 3, 0] } : { y: [0, -3, 0] }} transition={{ duration: isDragging ? 0.45 : 2.8, repeat: Infinity, repeatDelay: 1.5 }}>
            <UploadCloud size={28} strokeWidth={1.7} />
          </motion.span>
          <p className="mt-5 text-base font-semibold tracking-tight text-slate-800">Drop photos to begin</p>
          <p className="mt-1.5 text-sm text-slate-500">or click to browse from your device</p>
          <span className="mt-5 text-xs font-medium text-slate-400">Paste, browse, or drop JPG, PNG, WEBP, or GIF</span>
          <input className="sr-only" type="file" accept="image/*" multiple disabled={isUploading} onChange={(event) => { addSelectedImages(event.target.files); event.target.value = ''; }} />
        </label>

        {errorMessage && <div className="mt-5"><ErrorAlert message={errorMessage} /></div>}
        {images.length === 0 ? <EmptyState icon={ImagePlus} title="No photos indexed yet" description="Upload a collection to make it searchable." /> : <PreviewGrid images={images} onRemove={removeImage} />}
        <motion.button type="button" disabled={isUploading || !images.length} onClick={handleUpload} className="premium-button mt-9" whileHover={!isUploading && images.length ? { y: -2 } : {}} whileTap={!isUploading && images.length ? { scale: 0.98 } : {}}>
          <Sparkles size={17} /> Upload Collection
        </motion.button>
      </GlassCard>
      {successMessage && <SuccessToast title="Collection ready" message={successMessage} onDismiss={() => setSuccessMessage('')} />}
    </section>
  );
}

function SectionHeading({ eyebrow, title, description }) {
  return <div className="mb-8 max-w-2xl"><p className="eyebrow">{eyebrow}</p><h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-slate-800 sm:text-4xl">{title}</h2><p className="mt-3 text-base leading-7 text-slate-500">{description}</p></div>;
}

function PreviewGrid({ images, onRemove }) {
  return <div className="mt-5"><div className="mb-3 flex items-center justify-between"><p className="text-sm font-medium text-slate-600">{images.length} photo{images.length === 1 ? '' : 's'} selected</p><p className="text-xs text-slate-400">Ready to index</p></div><motion.div layout className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">{images.map((image) => <motion.article layout initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }} key={image.id} className="preview-card group"><img src={image.previewUrl} alt={`Preview of ${image.file.name}`} /><div className="preview-caption"><p>{image.file.name}</p></div><motion.button type="button" onClick={() => onRemove(image.id)} className="preview-remove" aria-label={`Remove ${image.file.name}`} whileTap={{ scale: 0.9 }}><X size={15} /></motion.button></motion.article>)}</motion.div></div>;
}

export default UploadSection;
