import { motion } from 'framer-motion'
import CTAButton from './CTAButton'

function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6">
      <motion.div
        className="text-center max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
      >
        <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-extralight tracking-tight text-text-primary mb-6">
          Quantum Chess
        </h1>

        <p className="font-heading text-lg md:text-xl font-light text-text-secondary tracking-wide mb-4">
          Every move exists until observed.
        </p>

        <p className="font-body text-sm text-text-secondary/70 max-w-md mx-auto mb-12 leading-relaxed">
          A premium reimagining of classical chess inspired by quantum
          superposition.
        </p>

        <CTAButton>Begin Experiment</CTAButton>
      </motion.div>
    </section>
  )
}

export default Hero
