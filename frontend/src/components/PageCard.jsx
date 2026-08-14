function PageCard({ eyebrow, title, description, children }) {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:py-20">
      <section className="rounded-3xl border border-white/10 bg-slate-900/75 p-6 shadow-2xl shadow-slate-950/50 ring-1 ring-white/5 backdrop-blur sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-sky-300">
          {eyebrow}
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">
          {description}
        </p>
        {children}
      </section>
    </div>
  );
}

export default PageCard;
