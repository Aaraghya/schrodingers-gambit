import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const navItems = ['PLAY', 'THEORY', 'ABOUT']

function Header() {
  const navigate = useNavigate()

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/20 backdrop-blur-[2px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
    >
      <div className="max-w-7xl mx-auto px-10 h-16 flex items-center justify-between">
        <span 
          onClick={() => navigate('/')}
          className="flex items-center gap-3 select-none cursor-pointer group"
        >
          <span 
            className="font-georgia text-xl text-sage select-none transition-colors duration-300 group-hover:text-text-primary" 
            aria-hidden="true"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Ψ
          </span>
          <span 
            className="font-georgia text-xs tracking-[0.25em] text-text-primary/70 uppercase transition-colors duration-300 group-hover:text-text-primary"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Schrödinger's Gambit
          </span>
        </span>

        <nav
          className="flex items-center gap-8"
          aria-label="Main navigation"
        >
          {navItems.map((item) => (
            <span
              key={item}
              className="text-[10px] tracking-[0.2em] font-mono text-text-secondary/50 cursor-default select-none transition-colors duration-300 hover:text-text-primary"
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
