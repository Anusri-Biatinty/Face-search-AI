import { memo } from 'react';

function LoadingSpinner({ label = 'Loading...', className = '' }) {
  return (
    <p className={`flex items-center gap-3 text-sm text-slate-300 ${className}`} role="status">
      <span
        aria-hidden="true"
        className="h-4 w-4 animate-spin rounded-full border-2 border-sky-300 border-t-transparent"
      />
      {label}
    </p>
  );
}

export default memo(LoadingSpinner);
