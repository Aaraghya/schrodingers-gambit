import { motion } from 'framer-motion'

interface CTAButtonProps {
  children: React.ReactNode
  onClick?: () => void
}

function CTAButton({ children, onClick }: CTAButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className="px-8 py-3 bg-transparent border border-accent/80 text-accent text-xs font-body tracking-[0.2em] uppercase transition-all duration-300 hover:border-accent hover:bg-accent/5 hover:shadow-[0_0_24px_var(--accent-glow)] focus:outline-none focus-visible:ring-1 focus-visible:ring-accent"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'tween', duration: 0.15 }}
    >
      {children}
    </motion.button>
  )
}

export default CTAButton
