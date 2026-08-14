import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

import { getStorageUrl } from '../services/api';

function Lightbox({ matches, activeIndex, onClose, onNavigate }) {
  const match = matches[activeIndex];

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') onNavigate(-1);
      if (event.key === 'ArrowRight') onNavigate(1);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose, onNavigate]);

  if (!match) return null;
  const filename = match.filename || 'Matching image';
  return <AnimatePresence><motion.div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/75 p-4 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-label={filename} onClick={onClose}><motion.div className="relative max-h-full max-w-6xl" initial={{ opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .97 }} onClick={(event) => event.stopPropagation()}><img src={getStorageUrl(match.path)} alt={filename} className="max-h-[82vh] max-w-full rounded-[24px] object-contain shadow-2xl" /><div className="mt-3 flex items-center justify-between gap-4 px-1 text-sm text-white"><span className="truncate">{filename}</span><span className="shrink-0 font-semibold">{(match.score * 100).toFixed(1)}%</span></div><button type="button" onClick={onClose} className="lightbox-button right-3 top-3" aria-label="Close image"><X size={20} /></button>{matches.length > 1 && <><button type="button" onClick={() => onNavigate(-1)} className="lightbox-button left-3 top-1/2 -translate-y-1/2" aria-label="Previous image"><ChevronLeft size={23} /></button><button type="button" onClick={() => onNavigate(1)} className="lightbox-button right-3 top-1/2 -translate-y-1/2" aria-label="Next image"><ChevronRight size={23} /></button></>}</motion.div></motion.div></AnimatePresence>;
}

export default Lightbox;
