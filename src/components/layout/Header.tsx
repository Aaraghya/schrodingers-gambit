import { motion } from 'framer-motion'

const navItems = ['Play', 'Theory', 'About']

function Header() {
  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 bg-surface border-b border-border"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <span className="font-heading text-[13px] tracking-[0.2em] text-text-primary uppercase select-none">
          Schrödinger's Gambit
        </span>

        <nav
          className="hidden sm:flex items-center gap-8"
          aria-label="Main navigation"
        >
          {navItems.map((item) => (
            <span
              key={item}
              className="text-[11px] tracking-[0.15em] uppercase text-text-secondary/60 cursor-default select-none transition-colors duration-300 hover:text-text-secondary"
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
