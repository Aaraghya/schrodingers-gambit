import { motion } from 'framer-motion'
import Header from '../../components/layout/Header'
import Hero from '../../components/landing/Hero'
import BackgroundGrid from '../../components/landing/BackgroundGrid'

function LandingPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <BackgroundGrid />
      <Header />
      <main>
        <Hero />
      </main>
    </motion.div>
  )
}

export default LandingPage
