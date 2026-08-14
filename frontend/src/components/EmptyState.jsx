import { motion } from 'framer-motion';

function EmptyState({ icon: Icon, title, description }) {
  return <motion.div className="empty-state" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}><span className="empty-state-icon"><Icon size={23} strokeWidth={1.6} /></span><h3>{title}</h3>{description && <p>{description}</p>}</motion.div>;
}

export default EmptyState;
