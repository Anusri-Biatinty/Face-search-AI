import { motion } from 'framer-motion';

function GlassCard({ children, className = '' }) {
  return <motion.div className={`glass-card ${className}`}>{children}</motion.div>;
}

export default GlassCard;
