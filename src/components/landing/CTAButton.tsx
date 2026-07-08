import { motion } from 'framer-motion'

interface CTAButtonProps {
  children: React.ReactNode
  onClick?: () => void
}

function CTAButton({ children, onClick }: CTAButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className="relative px-16 py-5 bg-bg-primary text-sage hover:text-text-primary border border-sage/50 hover:border-sage text-xs font-mono tracking-[0.25em] uppercase transition-all duration-300 hover:shadow-[0_0_24px_rgba(151,168,138,0.2)] focus:outline-none focus-visible:ring-1 focus-visible:ring-sage cursor-pointer rounded-none select-none"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'tween', duration: 0.2, ease: 'easeOut' }}
    >
      {/* Instrument Bracket Corners */}
      <span className="absolute top-0 left-0 w-2.5 h-[1px] bg-sage" />
      <span className="absolute top-0 left-0 w-[1px] h-2.5 bg-sage" />
      <span className="absolute bottom-0 right-0 w-2.5 h-[1px] bg-sage" />
      <span className="absolute bottom-0 right-0 w-[1px] h-2.5 bg-sage" />
      
      {children}
    </motion.button>
  )
}

export default CTAButton
