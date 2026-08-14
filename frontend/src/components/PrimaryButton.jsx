function PrimaryButton({ children, className = '', ...props }) {
  return (
    <button
      {...props}
      className={`inline-flex w-full items-center justify-center rounded-2xl bg-linear-to-r from-sky-300 to-cyan-300 px-6 py-3.5 font-bold text-slate-950 shadow-lg shadow-sky-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:from-sky-200 hover:to-cyan-200 hover:shadow-sky-500/35 focus:outline-none focus:ring-4 focus:ring-sky-400/30 active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto ${className}`}
    >
      {children}
    </button>
  );
}

export default PrimaryButton;
