import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import CTAButton from './CTAButton'

function Hero() {
  const navigate = useNavigate()

  return (
    <section className="min-h-screen flex items-center justify-center px-8 py-24">
      <motion.div
        className="text-center max-w-2xl flex flex-col items-center"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Main Title: Georgia, Regular, Sage Green, significantly downsized */}
        <h1 
          className="font-georgia text-3xl sm:text-4xl md:text-[2.75rem] font-normal text-sage leading-[1.25] tracking-wide select-none"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          Schrödinger's Gambit
        </h1>

        {/* Tagline: Lora, Bold, White, close to title, reading like a quotation */}
        <p className="mt-4 font-lora text-base sm:text-lg md:text-xl font-bold text-white italic tracking-wide leading-relaxed select-none">
          “Every move exists until observed.”
        </p>

        {/* CTA: Visual Center of Gravity with generous whitespace */}
        <div className="mt-16 mb-16 md:mt-20 md:mb-20">
          <CTAButton onClick={() => navigate('/play')}>[ Begin Experiment ]</CTAButton>
        </div>

        {/* Supporting Copy: Lora, Bold, White, smaller, softer opacity */}
        <p className="font-lora text-xs sm:text-sm font-bold text-white/85 max-w-md tracking-wider leading-relaxed select-none">
          A premium reimagining of classical chess inspired by quantum superposition.
        </p>
      </motion.div>
    </section>
  )
}

export default Hero
