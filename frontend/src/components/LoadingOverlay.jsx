import { motion } from 'framer-motion';
import { LoaderCircle, Sparkles } from 'lucide-react';

import ProgressBar from './ProgressBar';

function LoadingOverlay({ title, progress }) {
  return (
    <motion.div className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-[28px] bg-white/72 px-6 text-center backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} role="status">
      <div className="relative grid h-16 w-16 place-items-center rounded-[22px] bg-white shadow-lg shadow-blue-500/10 ring-1 ring-white">
        <LoaderCircle className="h-7 w-7 animate-spin text-blue-500" aria-hidden="true" />
        <Sparkles className="absolute -right-2 -top-2 h-4 w-4 text-blue-400" aria-hidden="true" />
      </div>
      <p className="mt-5 text-base font-semibold tracking-tight text-slate-800">{title}</p>
      <p className="mt-1 text-sm text-slate-500">This may take a moment.</p>
      {typeof progress === 'number' && <div className="mt-6 w-full max-w-xs"><div className="mb-2 flex justify-between text-xs font-medium text-slate-500"><span>Uploading</span><span>{progress}%</span></div><ProgressBar value={progress} /></div>}
    </motion.div>
  );
}

export default LoadingOverlay;
