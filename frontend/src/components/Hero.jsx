import { motion } from 'framer-motion';
import { ArrowRight, Search, ScanFace, Upload } from 'lucide-react';

function Hero({ onUploadClick, onSearchClick }) {
  return (
    <section className="hero-layout relative overflow-hidden pt-16 sm:pt-24">
      <motion.div
        className="relative z-10 max-w-3xl"
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="eyebrow">AI-powered photo discovery</div>
        <h1 className="hero-title">Find Every Photo<br />Containing The Same Person</h1>
        <p className="hero-copy">Upload your photo collection once. Search any person instantly using face recognition built for your private library.</p>
        <div className="mt-9 flex flex-wrap gap-3"><motion.button type="button" onClick={onUploadClick} className="primary-action" whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}><Upload size={17} /> Upload Collection</motion.button><motion.button type="button" onClick={onSearchClick} className="secondary-action" whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}><Search size={17} /> Search Photos <ArrowRight size={15} /></motion.button></div>
      </motion.div>
      <motion.div className="hero-illustration hidden sm:flex" initial={{ opacity: 0, y: 16, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.8, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}>
        <div className="hero-scan"><ScanFace size={60} strokeWidth={1.35} /><span className="scan-dot dot-one" /><span className="scan-dot dot-two" /><span className="scan-dot dot-three" /></div>
      </motion.div>
    </section>
  );
}

export default Hero;
