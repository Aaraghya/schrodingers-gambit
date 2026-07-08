import { motion } from 'framer-motion'

const navItems = ['Play', 'Theory', 'About']

function Header() {
  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/20 backdrop-blur-[2px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
    >
      <div className="max-w-7xl mx-auto px-10 h-16 flex items-center justify-between">
        <span className="font-heading text-[11px] tracking-[0.25em] text-text-primary/70 uppercase select-none">
          Schrödinger's Gambit
        </span>

        <nav
          className="hidden sm:flex items-center gap-10"
          aria-label="Main navigation"
        >
          {navItems.map((item) => (
            <span
              key={item}
              className="text-[9px] tracking-[0.2em] uppercase text-text-secondary/40 cursor-default select-none transition-colors duration-300 hover:text-text-secondary/80"
              aria-disabled="true"
            >
              {item}
            </span>
          ))}
        </nav>
      </div>
    </motion.header>
  )
}

export default Header
