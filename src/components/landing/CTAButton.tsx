import { motion } from 'framer-motion'

interface CTAButtonProps {
  children: React.ReactNode
  onClick?: () => void
}

function CTAButton({ children, onClick }: CTAButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className="relative px-12 py-4 bg-bg-primary text-accent hover:text-text-primary border border-accent/40 hover:border-accent text-[11px] font-mono tracking-[0.3em] uppercase transition-all duration-300 hover:shadow-[0_0_32px_var(--accent-glow)] focus:outline-none focus-visible:ring-1 focus-visible:ring-accent cursor-pointer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'tween', duration: 0.15 }}
    >
      {/* Visual bracket corners to make it look like a physical calibration button on an instrument */}
      <span className="absolute top-0 left-0 w-2 h-[1px] bg-accent" />
      <span className="absolute top-0 left-0 w-[1px] h-2 bg-accent" />
      <span className="absolute bottom-0 right-0 w-2 h-[1px] bg-accent" />
      <span className="absolute bottom-0 right-0 w-[1px] h-2 bg-accent" />
      
      {children}
    </motion.button>
  )
}

export default CTAButton
