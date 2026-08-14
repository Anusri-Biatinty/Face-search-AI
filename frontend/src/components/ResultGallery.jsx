import { memo, useCallback, useState } from 'react';
import { motion } from 'framer-motion';

import ImageCard from './ImageCard';
import Lightbox from './Lightbox';

function ResultGallery({ matches }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const navigate = useCallback((offset) => {
    setActiveIndex((current) => (current + offset + matches.length) % matches.length);
  }, [matches.length]);

  return <motion.section className="mt-10" aria-labelledby="matches-title" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
    <div className="mb-6 flex items-end justify-between gap-4"><div><p className="eyebrow">Search results</p><h3 id="matches-title" className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-800">Matches Found</h3></div><span className="similarity-pill static">{matches.length} photos</span></div>
    <div className="masonry-grid">{matches.map((match, index) => <ImageCard key={match.image_id} match={match} index={index} onOpen={() => setActiveIndex(index)} />)}</div>
    {activeIndex !== null && <Lightbox matches={matches} activeIndex={activeIndex} onClose={() => setActiveIndex(null)} onNavigate={navigate} />}
  </motion.section>;
}

export default memo(ResultGallery);
