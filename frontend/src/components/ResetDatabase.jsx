import { useState } from 'react';
import { AlertTriangle, LoaderCircle, Trash2, X } from 'lucide-react';

import ErrorAlert from './ErrorAlert';
import SuccessToast from './SuccessToast';
import { resetDatabase } from '../services/api';

function ResetDatabase({ onReset }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const confirmReset = async () => {
    setIsResetting(true);
    setErrorMessage('');
    try {
      await resetDatabase();
      setIsOpen(false);
      setSuccessMessage('Database cleared successfully.');
      onReset();
    } catch (error) {
      setErrorMessage(error.message || 'The database could not be reset.');
    } finally {
      setIsResetting(false);
    }
  };

  return <section className="mt-20 border-t border-slate-200 pt-8" aria-labelledby="reset-title">
    <div className="flex flex-col items-start justify-between gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
      <div><h2 id="reset-title" className="text-base font-semibold text-slate-900">Reset development database</h2><p className="mt-1 text-sm leading-6 text-slate-500">Permanently remove uploaded images, embeddings, metadata, and search indexes.</p></div>
      <button type="button" onClick={() => { setErrorMessage(''); setIsOpen(true); }} className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-rose-300 px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"><Trash2 size={17} aria-hidden="true" />Reset Database</button>
    </div>
    {isOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-5 backdrop-blur-sm" role="presentation"><div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="reset-dialog-title"><div className="flex items-start justify-between gap-4"><span className="grid h-10 w-10 place-items-center rounded-full bg-rose-100 text-rose-600"><AlertTriangle size={20} aria-hidden="true" /></span><button type="button" onClick={() => setIsOpen(false)} disabled={isResetting} className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" aria-label="Close reset confirmation"><X size={20} aria-hidden="true" /></button></div><h3 id="reset-dialog-title" className="mt-5 text-lg font-semibold text-slate-900">Reset database?</h3><p className="mt-2 text-sm leading-6 text-slate-600">Are you sure? This will permanently delete all uploaded images, embeddings, metadata and search indexes.</p>{errorMessage && <div className="mt-4"><ErrorAlert message={errorMessage} /></div>}<div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button type="button" onClick={() => setIsOpen(false)} disabled={isResetting} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">Cancel</button><button type="button" onClick={confirmReset} disabled={isResetting} className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60">{isResetting && <LoaderCircle size={16} className="animate-spin" aria-hidden="true" />}Reset</button></div></div></div>}
    {successMessage && <SuccessToast title="Database reset" message={successMessage} onDismiss={() => setSuccessMessage('')} />}
  </section>;
}

export default ResetDatabase;
