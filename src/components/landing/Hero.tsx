import { motion } from 'framer-motion'
import CTAButton from './CTAButton'

function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center px-8">
      <motion.div
        className="text-center max-w-4xl flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.0, ease: 'easeOut', delay: 0.2 }}
      >
        {/* Headline: The largest visual element, tight vertical rhythm, tight tracking */}
        <h1 className="font-heading text-6xl md:text-8xl lg:text-[10rem] font-extralight tracking-tighter md:tracking-[-0.04em] text-text-primary leading-[0.9] select-none select-none">
          Schrödinger's
          <span className="block mt-2 md:mt-4 text-text-primary/95">Gambit</span>
        </h1>

        {/* Generous spacing before CTA */}
        <div className="my-16 md:my-20">
          <CTAButton>Begin Experiment</CTAButton>
        </div>

        {/* Bottom Legends (Subtitle + Supporting copy) */}
        <div className="flex flex-col items-center max-w-md">
          {/* Subtitle */}
          <p className="font-heading text-[13px] md:text-sm font-light text-text-secondary tracking-[0.25em] uppercase mb-4 opacity-80">
            Every move exists until observed.
          </p>

          {/* Supporting Copy */}
          <p className="font-body text-[11px] md:text-xs text-text-secondary/50 leading-relaxed uppercase tracking-wider">
            A premium reimagining of classical chess inspired by quantum superposition.
          </p>
        </div>
      </motion.div>
    </section>
  )
}

export default Hero
