import { motion } from 'framer-motion';

function ProgressBar({ value }) {
  return <div className="h-2 overflow-hidden rounded-full bg-slate-200/80"><motion.div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-sky-400" initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 0.35, ease: 'easeOut' }} /></div>;
}

export default ProgressBar;
