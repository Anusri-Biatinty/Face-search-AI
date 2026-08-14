import { useCallback, useEffect, useState } from 'react';

import ErrorAlert from '../components/ErrorAlert';
import ImageGallery from '../components/ImageGallery';
import LoadingSpinner from '../components/LoadingSpinner';
import PageCard from '../components/PageCard';
import PrimaryButton from '../components/PrimaryButton';
import { searchPerson } from '../services/api';

function SearchPersonPage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [match, setMatch] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    return () => {
      if (selectedImage) {
        URL.revokeObjectURL(selectedImage.previewUrl);
      }
    };
  }, [selectedImage]);

  const handleFileChange = useCallback((event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) {
      return;
    }
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Choose an image file to search.');
      return;
    }

    setSelectedImage({ file, previewUrl: URL.createObjectURL(file) });
    setErrorMessage('');
    setMatch(null);
    setHasSearched(false);
  }, []);

  const clearImage = useCallback(() => {
    setSelectedImage(null);
    setMatch(null);
    setHasSearched(false);
    setErrorMessage('');
  }, []);

  async function handleSearch() {
    if (!selectedImage) {
      setErrorMessage('Upload an image before searching.');
      return;
    }

    setIsSearching(true);
    setErrorMessage('');
    setMatch(null);
    setHasSearched(false);
    try {
      const result = await searchPerson(selectedImage.file);

      if (result.matches?.length) {
        setMatch({
          similarity: result.matches[0].score,
          imageCount: result.matches.length,
          images: result.matches,
        });
      }
      setHasSearched(true);
    } catch (error) {
      setErrorMessage(
        error.message || 'Search failed. Check the image and try again.',
      );
    } finally {
      setIsSearching(false);
    }
  }

  return (
    <PageCard
      eyebrow="Face search"
      title="Search photos"
      description="Upload a photo to find every image containing a similar face."
    >
        <div className="mt-8">
          {!selectedImage ? (
            <label className="flex min-h-72 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-950/50 px-6 text-center shadow-inner shadow-black/15 transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-400/60 hover:bg-slate-950 hover:shadow-lg hover:shadow-sky-950/30">
              <span className="text-3xl" aria-hidden="true">⌕</span>
              <span className="mt-3 text-sm font-medium text-slate-200">
                Select an image
              </span>
              <span className="mt-1 text-xs text-slate-500">JPEG, PNG, GIF, or WebP</span>
              <input
                type="file"
                accept="image/*"
                disabled={isSearching}
                className="sr-only"
                onChange={handleFileChange}
              />
            </label>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-700/70 bg-slate-950 shadow-lg shadow-black/15">
              <img
                src={selectedImage.previewUrl}
                alt={`Preview of ${selectedImage.file.name}`}
                className="max-h-96 w-full object-contain"
              />
              <div className="flex items-center justify-between gap-4 border-t border-slate-800 px-4 py-3">
                <p className="min-w-0 truncate text-sm text-slate-300">
                  {selectedImage.file.name}
                </p>
                <button
                  type="button"
                  disabled={isSearching}
                  onClick={clearImage}
                  className="shrink-0 text-sm font-medium text-sky-300 transition hover:text-sky-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Change image
                </button>
              </div>
            </div>
          )}
        </div>

        {errorMessage && (
          <div className="mt-5">
            <ErrorAlert message={errorMessage} />
          </div>
        )}

        <PrimaryButton
          type="button"
          disabled={isSearching || !selectedImage}
          onClick={handleSearch}
          className="mt-7"
        >
          {isSearching ? 'Searching…' : 'Search person'}
        </PrimaryButton>

        {isSearching && (
          <LoadingSpinner label="Searching..." className="mt-5" />
        )}

        {hasSearched && !match && (
          <div className="mt-6">
            <ErrorAlert
              title="No Match Found"
              message="No matching person found."
              tone="info"
            />
          </div>
        )}

        {match && (
          <section className="mt-8 rounded-2xl border border-emerald-400/25 bg-emerald-400/5 p-6 shadow-xl shadow-emerald-950/10 ring-1 ring-emerald-400/5 sm:p-7" aria-labelledby="match-title">
            <h2 id="match-title" className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-300">
              Matching Images
            </h2>
            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Top Similarity Score</dt>
                <dd className="mt-1 text-lg font-semibold text-emerald-300">
                  {(match.similarity * 100).toFixed(1)}%
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Matching images</dt>
                <dd className="mt-1 text-lg font-semibold text-white">{match.imageCount}</dd>
              </div>
            </dl>
            <ImageGallery matches={match.images} />
          </section>
        )}
    </PageCard>
  );
}

export default SearchPersonPage;
