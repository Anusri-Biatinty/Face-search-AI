import { Aperture, Code2, Search, Upload } from 'lucide-react';
import { motion } from 'framer-motion';

function Navbar({ onUploadClick, onSearchClick }) {
  return (
    <header className="pointer-events-none sticky top-0 z-40 px-4 pt-4 sm:px-6">
      <motion.nav
        initial={{ opacity: 0, y: -12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="floating-nav pointer-events-auto mx-auto flex h-14 max-w-[700px] items-center justify-between px-3"
      >
        <button type="button" onClick={onUploadClick} className="flex items-center gap-2.5 rounded-2xl px-2.5 py-2 text-left" aria-label="AI Face Search home">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-blue-500 text-white shadow-sm shadow-blue-500/30"><Aperture size={18} strokeWidth={2} aria-hidden="true" /></span>
          <span className="text-sm font-semibold tracking-tight text-slate-800">AI Face Search</span>
        </button>
        <div className="flex items-center gap-1">
          <button type="button" onClick={onUploadClick} className="nav-link"><Upload size={14} /> <span className="hidden sm:inline">Upload</span></button>
          <button type="button" onClick={onSearchClick} className="nav-link"><Search size={14} /> <span className="hidden sm:inline">Search</span></button>
        </div>
        <button type="button" className="nav-icon" aria-label="GitHub repository"><Code2 size={16} /></button>
      </motion.nav>
    </header>
  );
}

export default Navbar;
