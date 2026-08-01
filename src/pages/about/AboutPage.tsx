import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/layout/Header'
import BackgroundGrid from '../../components/landing/BackgroundGrid'

export const AboutPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen w-full flex flex-col bg-bg-primary text-text-primary"
    >
      <BackgroundGrid />
      <Header />

      <main className="flex-1 w-full max-w-4xl mx-auto px-6 pt-24 pb-20 z-10 flex flex-col gap-12">

        {/* Page Banner Header */}
        <div className="flex flex-col items-center text-center gap-3 border-b border-border/20 pb-8">
          <span className="text-[10px] font-mono tracking-[0.25em] text-sage font-bold uppercase">
            // Specification: Project Overview
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-text-primary tracking-wide">
            About Schrödinger's Gambit
          </h1>
          <p className="text-xs font-mono text-text-secondary/70 max-w-lg leading-relaxed mt-1">
            The project, its philosophy, the person behind it, and what comes next.
          </p>
        </div>

        {/* Section 1: About the Project */}
        <section className="flex flex-col gap-4 border border-border/20 bg-surface-deep p-6 sm:p-8">
          <div className="flex items-center gap-3 border-b border-border/15 pb-3">
            <span className="text-xs font-mono text-sage">[ 01 ]</span>
            <h2 className="text-lg font-serif text-text-primary tracking-wide">
              About the Project
            </h2>
          </div>
          <div className="flex flex-col gap-4 text-xs sm:text-sm text-text-secondary/90 leading-relaxed font-sans">
            <p>
              Quantum mechanics has always fascinated me because the ideas are so unintuitive. Schrödinger's Gambit came from wondering what would happen if one of those ideas could become a chess mechanic.
            </p>
            <p>
              It isn't meant to be a physics simulator. It's simply an attempt to turn one of science's most famous thought experiments into something you can actually play.
            </p>
            <p className="text-sage font-mono text-xs tracking-wider mt-2">
              From one curious mind to another.
            </p>
          </div>
        </section>

        {/* Section 2: About the Creator */}
        <section className="flex flex-col gap-4 border border-border/20 bg-surface-deep p-6 sm:p-8">
          <div className="flex items-center gap-3 border-b border-border/15 pb-3">
            <span className="text-xs font-mono text-sage">[ 02 ]</span>
            <h2 className="text-lg font-serif text-text-primary tracking-wide">
              About the Creator
            </h2>
          </div>
          <div className="flex flex-col gap-4 text-xs sm:text-sm text-text-secondary/90 leading-relaxed font-sans">
            <p>
              Hi, I'm <strong className="text-text-primary font-normal">Aaraghya</strong>. I build things because I'm curious about how they work, and I like sharing the results with anyone who feels the same way.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <a
                href="https://github.com/Aaraghya"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 border border-border/30 bg-bg-primary/50 text-text-secondary/80 hover:text-sage hover:border-sage/40 transition-all duration-200 font-mono text-[10px] tracking-widest uppercase"
              >
                <span>GitHub</span>
                <span className="text-text-secondary/30">↗</span>
              </a>
              <a
                href="https://www.linkedin.com/in/aaraghya/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 border border-border/30 bg-bg-primary/50 text-text-secondary/80 hover:text-sage hover:border-sage/40 transition-all duration-200 font-mono text-[10px] tracking-widest uppercase"
              >
                <span>LinkedIn</span>
                <span className="text-text-secondary/30">↗</span>
              </a>
            </div>
          </div>
        </section>

        {/* Section 3: Design Decisions */}
        <section className="flex flex-col gap-6 border border-border/20 bg-surface-deep p-6 sm:p-8">
          <div className="flex items-center gap-3 border-b border-border/15 pb-3">
            <span className="text-xs font-mono text-sage">[ 03 ]</span>
            <h2 className="text-lg font-serif text-text-primary tracking-wide">
              Design Decisions
            </h2>
          </div>

          <div className="flex flex-col gap-4 font-sans text-xs sm:text-sm">
            {[
              {
                q: 'Why procedural audio instead of MP3 files?',
                a: 'I wanted every sound to be generated in real time instead of loaded from a file. It keeps the project lightweight and made designing each sound almost as fun as building the game itself.'
              },
              {
                q: 'Why replay instead of parallel universes?',
                a: 'Keeping multiple chessboards in sync sounds exciting, but it quickly becomes messy. Rebuilding a single timeline after collapse keeps every classical chess rule correct without adding unnecessary complexity.'
              },
              {
                q: 'Why only one quantum move?',
                a: 'Unlimited superpositions quickly stop feeling strategic and start feeling chaotic. One carefully timed quantum move makes every decision feel meaningful.'
              },
              {
                q: 'Why local multiplayer instead of AI?',
                a: 'I wanted players to experience the uncertainty together. Watching another person react to a collapse is far more interesting than watching an algorithm do it.'
              },
              {
                q: 'Why no backend?',
                a: 'The game doesn\'t need accounts or servers to be enjoyable. Keeping everything local makes it fast, simple, and easy for anyone to play instantly.'
              }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col gap-2 p-4 border border-border/10 bg-bg-primary/30">
                <h3 className="font-mono text-xs text-text-primary tracking-wide">{item.q}</h3>
                <p className="text-text-secondary/80 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Future Experiments */}
        <section className="flex flex-col gap-6 border border-sage/30 bg-sage/5 p-6 sm:p-8">
          <div className="flex items-center gap-3 border-b border-sage/20 pb-3">
            <span className="text-xs font-mono text-sage">[ 04 ]</span>
            <h2 className="text-lg font-serif text-text-primary tracking-wide">
              Future Experiments
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                title: 'Better Animations',
                desc: 'Make every split and collapse feel even more physical without slowing down gameplay.'
              },
              {
                title: 'Online Multiplayer',
                desc: 'Let two players experience the same uncertainty from anywhere in the world.'
              },
              {
                title: 'Smarter Opponents',
                desc: 'Build an AI that understands both classical chess and quantum strategy.'
              },
              {
                title: 'More Quantum Mechanics',
                desc: 'Experiment with ideas like entanglement and multiple simultaneous superpositions while keeping the game intuitive.'
              }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col gap-1.5 p-4 border border-border/10 bg-surface-deep">
                <h3 className="text-xs font-mono text-sage uppercase tracking-wide">{item.title}</h3>
                <p className="text-xs text-text-secondary/80 font-sans leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-border/20">
          <button
            type="button"
            onClick={() => navigate('/play')}
            className="flex-1 py-3 bg-bg-primary text-sage hover:text-text-primary border border-sage/40 hover:border-sage text-[10px] font-mono tracking-widest uppercase transition-all duration-200 cursor-pointer rounded-none outline-none focus-visible:outline-1 focus-visible:outline-sage select-none"
          >
            [ Launch Simulation ]
          </button>
          <button
            type="button"
            onClick={() => navigate('/theory')}
            className="flex-1 py-3 bg-bg-primary text-text-secondary/70 hover:text-text-primary border border-border/40 hover:border-border text-[9px] font-mono tracking-widest uppercase transition-all duration-200 cursor-pointer rounded-none outline-none focus-visible:outline-1 focus-visible:outline-border select-none"
          >
            [ Read the Theory ]
          </button>
        </div>

      </main>
    </motion.div>
  )
}

export default AboutPage
