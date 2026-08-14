import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

import Hero from './components/Hero';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SearchSection from './components/SearchSection';
import Statistics from './components/Statistics';
import UploadSection from './components/UploadSection';
import ResetDatabase from './components/ResetDatabase';

function App() {
  const uploadRef = useRef(null);
  const searchRef = useRef(null);
  const [resetVersion, setResetVersion] = useState(0);
  const [stats, setStats] = useState({ images: 0, faces: 0, searches: 0, averageSearchTime: 0 });
  const scrollTo = (sectionRef) => {
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="app-shell min-h-screen text-slate-950">
      <Navbar onUploadClick={() => scrollTo(uploadRef)} onSearchClick={() => scrollTo(searchRef)} />
      <main className="mx-auto max-w-[1180px] px-5 pb-32 pt-8 sm:px-8 sm:pt-12 lg:px-10">
        <Hero onUploadClick={() => scrollTo(uploadRef)} onSearchClick={() => scrollTo(searchRef)} />
        <Statistics stats={stats} />
        <motion.div
          className="mt-24 space-y-28 sm:mt-32 sm:space-y-36"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.14 } } }}
        >
          <motion.div ref={uploadRef} className="scroll-mt-28" variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}>
            <UploadSection resetVersion={resetVersion} onUploadComplete={(result) => setStats((current) => ({ ...current, images: current.images + result.images_processed, faces: current.faces + result.faces_indexed }))} />
          </motion.div>
          <motion.div ref={searchRef} className="scroll-mt-28" variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}>
            <SearchSection resetVersion={resetVersion} onSearchComplete={(duration) => setStats((current) => ({ searches: current.searches + 1, images: current.images, faces: current.faces, averageSearchTime: current.searches ? ((current.averageSearchTime * current.searches) + duration) / (current.searches + 1) : duration }))} />
          </motion.div>
        </motion.div>
        <ResetDatabase onReset={() => { setResetVersion((version) => version + 1); setStats({ images: 0, faces: 0, searches: 0, averageSearchTime: 0 }); }} />
        <Footer />
      </main>
    </div>
  );
}

export default App;
