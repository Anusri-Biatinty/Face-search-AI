import { memo } from 'react';
import { motion } from 'framer-motion';
import { CircleAlert, Info } from 'lucide-react';

function ErrorAlert({ title = 'Something went wrong', message, tone = 'error' }) {
  const isError = tone === 'error';

  return (
    <motion.div
      role={isError ? 'alert' : 'status'}
      className={[
        'flex items-start gap-3 rounded-xl border px-4 py-3 text-sm',
        isError
          ? 'border-rose-200 bg-rose-50 text-rose-800'
          : 'border-slate-200 bg-slate-50 text-slate-700',
      ].join(' ')}
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {isError ? <CircleAlert size={17} className="mt-0.5 shrink-0" /> : <Info size={17} className="mt-0.5 shrink-0" />}
      <div><p className="font-semibold">{title}</p>{message && <p className="mt-1 opacity-90">{message}</p>}</div>
    </motion.div>
  );
}

export default memo(ErrorAlert);
