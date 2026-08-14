import { memo } from 'react';

import { getStorageUrl } from '../services/api';

function ImageGallery({ matches }) {
  return (
    <section className="mt-7 border-t border-emerald-400/15 pt-6" aria-labelledby="stored-images-title">
      <div className="flex items-baseline justify-between gap-3">
        <h3 id="stored-images-title" className="text-base font-semibold text-white">
          Image Gallery
        </h3>
        <span className="text-sm text-slate-400">{matches.length} total</span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {matches.map((match) => {
          const filename = match.filename || 'Stored image';
          return (
            <article
              key={match.image_id}
              className="group overflow-hidden rounded-xl border border-white/10 bg-slate-950/60 shadow-lg shadow-slate-950/20 transition duration-200 hover:-translate-y-1 hover:border-sky-400/40 hover:shadow-sky-500/10"
            >
              <div className="overflow-hidden bg-slate-900">
                <img
                  src={getStorageUrl(match.path)}
                  alt={`Matching image: ${filename}`}
                  loading="lazy"
                  className="aspect-square w-full object-cover transition duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex items-center justify-between gap-2 px-3 py-2">
                <p className="truncate text-xs text-slate-300" title={filename}>
                  {filename}
                </p>
                <span className="shrink-0 text-[11px] font-semibold text-sky-300">
                  {(match.score * 100).toFixed(1)}%
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default memo(ImageGallery);
