import { useCallback, useState } from 'react';

import ErrorAlert from '../components/ErrorAlert';
import ImageUploader from '../components/ImageUploader';
import LoadingSpinner from '../components/LoadingSpinner';
import PageCard from '../components/PageCard';
import PrimaryButton from '../components/PrimaryButton';
import SuccessToast from '../components/SuccessToast';
import { useImagePreviews } from '../hooks/useImagePreviews';
import { uploadPhotoCollection } from '../services/api';

function UploadCollectionPage() {
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { images, addImages, removeImage, clearImages } = useImagePreviews();

  const handleAddImages = useCallback((files) => {
    const invalidFileCount = addImages(files);
    setSuccessMessage('');
    setErrorMessage(
      invalidFileCount > 0
        ? `${invalidFileCount} non-image file${invalidFileCount > 1 ? 's were' : ' was'} skipped.`
        : '',
    );
  }, [addImages]);

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (images.length === 0) {
      setErrorMessage('Add at least one image before uploading.');
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);
    try {
      await uploadPhotoCollection({
        images,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            setUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
          }
        },
      });

      setSuccessMessage('Upload completed.');
      clearImages();
    } catch (error) {
      setErrorMessage(
        error.message || 'Upload failed. Check the images and try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <PageCard
        eyebrow="Photo collection"
        title="Upload photos"
        description="Add one or more photos. Every detected face is securely indexed for search."
      >
        <form className="mt-10 space-y-8" onSubmit={handleSubmit}>
          <ImageUploader
            images={images}
            onAddImages={handleAddImages}
            onRemoveImage={removeImage}
            disabled={isSubmitting}
          />

          {errorMessage && (
            <ErrorAlert message={errorMessage} />
          )}

          {isSubmitting && (
            <div>
              <LoadingSpinner label="Uploading..." />
              <div className="mb-2 flex justify-between text-xs text-slate-400">
                <span>Processing faces...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                <div className="h-full rounded-full bg-sky-400 transition-all" style={{ width: `${uploadProgress}%` }} />
              </div>
            </div>
          )}

          <PrimaryButton
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Uploading…' : 'Upload photos'}
          </PrimaryButton>
        </form>
      </PageCard>
      {successMessage && (
        <SuccessToast
          title="Upload Complete"
          message={successMessage}
          onDismiss={() => setSuccessMessage('')}
        />
      )}
    </>
  );
}

export default UploadCollectionPage;
