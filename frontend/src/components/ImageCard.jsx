import { motion } from 'framer-motion';
import { Image as ImageIcon } from 'lucide-react';

import { getStorageUrl } from '../services/api';

function ImageCard({ match, index, onOpen }) {
  const filename = match.filename || 'Matching image';
  return <motion.button type="button" layout initial={{ opacity: 0, y: 14, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.42, delay: index * 0.045, ease: [0.22, 1, 0.36, 1] }} whileHover={{ y: -5 }} onClick={onOpen} className="gallery-card group block w-full break-inside-avoid text-left">
    <div className="relative overflow-hidden"><img src={getStorageUrl(match.path)} alt={`Matching photo: ${filename}`} loading="lazy" className="block h-auto w-full transition duration-700 group-hover:scale-[1.045]" /><span className="similarity-pill">{(match.score * 100).toFixed(1)}%</span></div>
    <div className="flex items-center gap-2 px-4 py-3"><ImageIcon size={15} className="shrink-0 text-slate-400" aria-hidden="true" /><p className="truncate text-sm font-medium text-slate-600" title={filename}>{filename}</p></div>
  </motion.button>;
}

export default ImageCard;
