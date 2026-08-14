import { memo } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

function SuccessToast({ title = 'Success', message, onDismiss }) {
  return (
    <motion.div
      role="status"
      className="fixed bottom-5 right-5 z-50 flex max-w-sm items-start gap-3 rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-emerald-900 shadow-xl shadow-slate-300/50"
      initial={{ opacity: 0, y: 14, scale: .97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
    >
      <motion.span aria-hidden="true" className="grid h-6 w-6 place-items-center rounded-full bg-emerald-100 text-emerald-600" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: .15, type: 'spring', stiffness: 360, damping: 18 }}><Check size={15} /></motion.span>
      <div className="min-w-0 flex-1">
        <p className="font-semibold">{title}</p>
        {message && <p className="mt-1 text-sm text-emerald-800/75">{message}</p>}
      </div>
      {onDismiss && (
        <button
          type="button"
          aria-label="Dismiss notification"
          onClick={onDismiss}
          className="text-emerald-700/70 transition hover:text-emerald-950"
        >
          ×
        </button>
      )}
    </motion.div>
  );
}

export default memo(SuccessToast);
