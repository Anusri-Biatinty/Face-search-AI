import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock3, Image, ScanFace, Search } from 'lucide-react';

function StatisticValue({ value, suffix = '' }) {
  const [displayValue, setDisplayValue] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const from = displayValue;
    const frame = (now) => {
      const progress = Math.min((now - start) / 420, 1);
      const easedProgress = 1 - ((1 - progress) ** 3);
      setDisplayValue(from + ((value - from) * easedProgress));
      if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, [value]);
  return `${suffix === 's' ? displayValue.toFixed(1) : Math.round(displayValue)}${suffix}`;
}

function Statistics({ stats }) {
  const items = [{ label: 'Images Indexed', value: stats.images, icon: Image }, { label: 'Faces Indexed', value: stats.faces, icon: ScanFace }, { label: 'Searches', value: stats.searches, icon: Search }, { label: 'Average Search Time', value: stats.averageSearchTime, suffix: 's', icon: Clock3 }];
  return <motion.section className="stats-grid" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2, duration: .5 }}>{items.map(({ label, value, suffix, icon: Icon }, index) => <motion.article key={label} className="stat-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .26 + (index * .06) }}><span className="stat-icon"><Icon size={17} /></span><div><p>{label}</p><strong><StatisticValue value={value} suffix={suffix} /></strong></div></motion.article>)}</motion.section>;
}

export default Statistics;
