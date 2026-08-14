import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Image as ImageIcon, Search, Sparkles, X } from 'lucide-react';

import EmptyState from './EmptyState';
import ErrorAlert from './ErrorAlert';
import GlassCard from './GlassCard';
import LoadingOverlay from './LoadingOverlay';
import ResultGallery from './ResultGallery';
import { searchPerson } from '../services/api';

function SearchSection({ resetVersion, onSearchComplete }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [matches, setMatches] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => () => {
    if (selectedImage?.previewUrl) URL.revokeObjectURL(selectedImage.previewUrl);
  }, [selectedImage]);

  useEffect(() => {
    setSelectedImage(null);
    setMatches(null);
    setErrorMessage('');
  }, [resetVersion]);

  const chooseImage = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Choose a valid image file to search.');
      return;
    }
    setSelectedImage({ file, previewUrl: URL.createObjectURL(file) });
    setMatches(null);
    setErrorMessage('');
  };

  const handleSearch = async () => {
    if (!selectedImage) {
      setErrorMessage('Upload a face image before searching.');
      return;
    }
    setIsSearching(true);
    setErrorMessage('');
    setMatches(null);
    const searchStartedAt = performance.now();
    try {
      const result = await searchPerson(selectedImage.file);
      setMatches(result.matches || []);
      onSearchComplete((performance.now() - searchStartedAt) / 1000);
    } catch (error) {
      setErrorMessage(error.message || 'The photo could not be searched.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <section aria-labelledby="search-title">
      <div className="mb-8 max-w-2xl"><p className="eyebrow">02 · Search</p><h2 id="search-title" className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-slate-800 sm:text-4xl">Search by Face</h2><p className="mt-3 text-base leading-7 text-slate-500">Use one clear photo containing one person’s face.</p></div>
      <GlassCard className="relative p-6 sm:p-9">
        <AnimatePresence>{isSearching && <LoadingOverlay title="Searching photo collection..." />}</AnimatePresence>
        {!selectedImage ? <label className="search-dropzone" tabIndex={0} onPaste={(event) => chooseImage(event.clipboardData.files?.[0])}><span className="upload-icon"><Search size={27} strokeWidth={1.7} /></span><p className="mt-5 text-base font-semibold tracking-tight text-slate-800">Upload a face to search</p><p className="mt-1.5 text-sm text-slate-500">One image only · browse or paste</p><input className="sr-only" type="file" accept="image/*" disabled={isSearching} onChange={(event) => { chooseImage(event.target.files?.[0]); event.target.value = ''; }} /></label> : <motion.div className="search-preview" initial={{ opacity: 0, scale: 0.985 }} animate={{ opacity: 1, scale: 1 }}><img src={selectedImage.previewUrl} alt={`Search preview of ${selectedImage.file.name}`} /><div className="search-preview-footer"><div className="min-w-0"><p className="truncate text-sm font-medium text-slate-700">{selectedImage.file.name}</p><p className="mt-0.5 text-xs text-slate-400">Ready to search</p></div><motion.button type="button" onClick={() => { setSelectedImage(null); setMatches(null); }} className="preview-remove relative opacity-100" aria-label="Change selected image" whileTap={{ scale: 0.9 }}><X size={15} /></motion.button></div></motion.div>}
        {errorMessage && <div className="mt-5"><ErrorAlert message={errorMessage} /></div>}
        <motion.button type="button" disabled={isSearching || !selectedImage} onClick={handleSearch} className="premium-button mt-9" whileHover={selectedImage && !isSearching ? { y: -2 } : {}} whileTap={selectedImage && !isSearching ? { scale: 0.98 } : {}}><Sparkles size={17} /> Search Collection</motion.button>
      </GlassCard>
      <AnimatePresence>{Array.isArray(matches) && (matches.length ? <ResultGallery matches={matches} /> : <EmptyState icon={ImageIcon} title="No matching photos found" description="Try a clearer face image or add more photos to your collection." />)}</AnimatePresence>
    </section>
  );
}

export default SearchSection;
