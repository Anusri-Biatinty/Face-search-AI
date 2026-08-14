import { memo, useCallback } from 'react';

function ImageUploader({ images, onAddImages, onRemoveImage, disabled = false }) {
  const handleFileChange = useCallback((event) => {
    onAddImages(event.target.files);
    event.target.value = '';
  }, [onAddImages]);

  return (
    <section aria-labelledby="images-label">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 id="images-label" className="text-sm font-semibold text-white">
            Face images
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Add photos of any size. Every detected face will be indexed.
          </p>
        </div>
        <label className="cursor-pointer rounded-lg border border-sky-400/40 bg-sky-400/10 px-3 py-2 text-sm font-medium text-sky-200 transition hover:bg-sky-400/20 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50">
          Add images
          <input
            type="file"
            accept="image/*"
            multiple
            disabled={disabled}
            className="sr-only"
            onChange={handleFileChange}
          />
        </label>
      </div>

      {images.length === 0 ? (
        <label className="mt-4 flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-900/50 px-6 text-center transition hover:border-sky-400/60 hover:bg-slate-900">
          <span className="text-3xl" aria-hidden="true">⌁</span>
          <span className="mt-3 text-sm font-medium text-slate-200">
            Select one or more photos
          </span>
          <span className="mt-1 text-xs text-slate-500">JPEG, PNG, GIF, or WebP</span>
          <input
            type="file"
            accept="image/*"
            multiple
            disabled={disabled}
            className="sr-only"
            onChange={handleFileChange}
          />
        </label>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((image) => (
            <article
              key={image.id}
              className="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900"
            >
              <img
                src={image.previewUrl}
                alt={`Preview of ${image.file.name}`}
                className="aspect-square w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-slate-950/90 to-transparent px-3 pb-2 pt-8">
                <p className="truncate text-xs text-slate-200">{image.file.name}</p>
              </div>
              <button
                type="button"
                disabled={disabled}
                className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-slate-950/85 text-lg text-white opacity-0 transition hover:bg-rose-500 group-hover:opacity-100 focus:opacity-100 disabled:cursor-not-allowed"
                aria-label={`Remove ${image.file.name}`}
                onClick={() => onRemoveImage(image.id)}
              >
                ×
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default memo(ImageUploader);
