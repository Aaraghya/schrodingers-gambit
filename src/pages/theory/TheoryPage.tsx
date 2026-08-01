import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/layout/Header'
import BackgroundGrid from '../../components/landing/BackgroundGrid'

export const TheoryPage: React.FC = () => {
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
            // Analyzer: Scientific Framework & Guide
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-text-primary tracking-wide">
            Quantum Theory & Guide
          </h1>
          <p className="text-xs font-mono text-text-secondary/70 max-w-lg leading-relaxed mt-1">
            An introduction to the mechanics, rules, physics concepts, and design philosophy behind Schrödinger's Gambit.
          </p>
        </div>

        {/* Section 1: What is Schrödinger's Gambit? */}
        <section className="flex flex-col gap-4 border border-border/20 bg-surface-deep p-6 sm:p-8">
          <div className="flex items-center gap-3 border-b border-border/15 pb-3">
            <span className="text-xs font-mono text-sage">[ 01 ]</span>
            <h2 className="text-lg font-serif text-text-primary tracking-wide">
              What is Schrödinger's Gambit?
            </h2>
          </div>
          <div className="flex flex-col gap-3 text-xs sm:text-sm text-text-secondary/90 leading-relaxed font-sans">
            <p>
              Schrödinger's Gambit is a two-player chess game inspired by the mind-bending principles of quantum mechanics. It takes the familiar rules of classical chess and adds a powerful twist: <strong className="text-text-primary font-normal bg-sage/10 px-1 py-0.5 border border-sage/20">Each player gets one opportunity during the game to temporarily place a piece in two possible locations at once.</strong>
            </p>
            <p>
              Until someone tries to interact with that piece, it exists as a 50/50 probability spread across both target squares. Once an interaction happens—such as an attack or a move attempt—the piece is forced to "choose" a single square, instantly resolving its true physical location.
            </p>
          </div>
        </section>

        {/* Section 2: How to Play */}
        <section className="flex flex-col gap-6 border border-border/20 bg-surface-deep p-6 sm:p-8">
          <div className="flex items-center gap-3 border-b border-border/15 pb-3">
            <span className="text-xs font-mono text-sage">[ 02 ]</span>
            <h2 className="text-lg font-serif text-text-primary tracking-wide">
              How to Play: Step-by-Step
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                step: '01',
                title: 'Select a Piece',
                desc: 'Click on any of your active pieces on your turn just like standard chess.'
              },
              {
                step: '02',
                title: 'Initiate Superposition',
                desc: 'Click the [ Initiate Superposition ] button above the board to enter Quantum Mode.'
              },
              {
                step: '03',
                title: 'Choose Two Destinations',
                desc: 'Click two separate legal destination squares for your selected piece.'
              },
              {
                step: '04',
                title: 'Ghost States Materialize',
                desc: 'Your piece leaves its original square and appears as semi-transparent "ghost" copies on both target squares.'
              },
              {
                step: '05',
                title: 'Play Continues Normally',
                desc: 'Players continue taking turns making standard chess moves while the superposition persists.'
              },
              {
                step: '06',
                title: 'Trigger an Interaction',
                desc: 'Collapse occurs when a player moves the quantum piece or attempts to capture either ghost square.'
              },
              {
                step: '07',
                title: 'State Collapses (50 / 50)',
                desc: 'The game randomly resolves the piece to Target A (50%) or Target B (50%). The other ghost vanishes.'
              },
              {
                step: '08',
                title: 'Resume Classical Rules',
                desc: 'The move history synchronizes automatically and standard chess play proceeds.'
              }
            ].map((item) => (
              <div key={item.step} className="flex flex-col gap-1.5 p-4 border border-border/10 bg-bg-primary/40">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-sage tracking-wider">STEP {item.step}</span>
                </div>
                <h3 className="text-xs font-mono text-text-primary uppercase tracking-wide">{item.title}</h3>
                <p className="text-xs text-text-secondary/80 font-sans leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Version 1 Rules */}
        <section className="flex flex-col gap-4 border border-border/20 bg-surface-deep p-6 sm:p-8">
          <div className="flex items-center gap-3 border-b border-border/15 pb-3">
            <span className="text-xs font-mono text-sage">[ 03 ]</span>
            <h2 className="text-lg font-serif text-text-primary tracking-wide">
              Version 1 Rule Set
            </h2>
          </div>
          <ul className="flex flex-col gap-2.5 text-xs sm:text-sm font-sans text-text-secondary/90">
            <li className="flex items-start gap-2.5">
              <span className="text-sage font-mono text-xs mt-0.5">•</span>
              <span><strong className="text-text-primary font-mono text-xs uppercase">One Quantum Move Per Player:</strong> White and Black each receive exactly one superposition split during the game.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-sage font-mono text-xs mt-0.5">•</span>
              <span><strong className="text-text-primary font-mono text-xs uppercase">Single Active Superposition:</strong> Only one quantum overlay can exist on the entire board at any given time.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-sage font-mono text-xs mt-0.5">•</span>
              <span><strong className="text-text-primary font-mono text-xs uppercase">Legal Classical Destinations:</strong> Both split target squares must be valid classical move destinations for the piece.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-sage font-mono text-xs mt-0.5">•</span>
              <span><strong className="text-text-primary font-mono text-xs uppercase">Interaction-Driven Collapse:</strong> Collapse occurs only when attempting to move the quantum piece or capture either branch.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-sage font-mono text-xs mt-0.5">•</span>
              <span><strong className="text-text-primary font-mono text-xs uppercase">Unbiased 50/50 Probability:</strong> State resolution is always an exact 50% random choice between Square A and Square B.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-sage font-mono text-xs mt-0.5">•</span>
              <span><strong className="text-text-primary font-mono text-xs uppercase">Unchanged Standard Rules:</strong> Check, checkmate, stalemate, draws, castling, en passant, and pawn promotion rules remain standard.</span>
            </li>
          </ul>
        </section>

        {/* Section 4: Understanding the Physics */}
        <section className="flex flex-col gap-6 border border-border/20 bg-surface-deep p-6 sm:p-8">
          <div className="flex items-center gap-3 border-b border-border/15 pb-3">
            <span className="text-xs font-mono text-sage">[ 04 ]</span>
            <h2 className="text-lg font-serif text-text-primary tracking-wide">
              Understanding the Physics
            </h2>
          </div>

          <div className="flex flex-col gap-6 text-xs sm:text-sm font-sans text-text-secondary/90 leading-relaxed">
            
            {/* Superposition */}
            <div className="flex flex-col gap-2">
              <h3 className="text-xs font-mono text-sage uppercase tracking-wider">// Superposition</h3>
              <p>
                In everyday experience, an object is always in one exact location. But in quantum physics, subatomic particles like electrons can exist in a combination of multiple states at the same time. This is called <strong>superposition</strong>. In the game, having your piece exist on two squares simultaneously represents a particle existing in two potential states at once.
              </p>
            </div>

            {/* Observation / Measurement */}
            <div className="flex flex-col gap-2">
              <h3 className="text-xs font-mono text-sage uppercase tracking-wider">// Observation & Measurement</h3>
              <p>
                A quantum system remains in superposition until an instrument or observer interacts with it. Measuring the system forces nature to choose one definite reality. This is called <strong>wave function collapse</strong>. In Schrödinger's Gambit, trying to attack a ghost piece or move it acts as the measurement that forces the piece to collapse onto a single square.
              </p>
            </div>

            {/* Schrödinger's Cat */}
            <div className="flex flex-col gap-2">
              <h3 className="text-xs font-mono text-sage uppercase tracking-wider">// Schrödinger's Cat</h3>
              <p>
                Physicist Erwin Schrödinger proposed a famous thought experiment: imagine a cat in a sealed box with a mechanism that has a 50% chance of releasing poison based on a quantum event. Until you open the box to look, quantum theory treats the cat as simultaneously alive and dead. Opening the box forces reality to pick one outcome. Schrödinger's Gambit borrows this exact concept—a piece is "alive" on two squares until a player "opens the box" by interacting with it.
              </p>
            </div>

            {/* Where the Game Simplifies Reality */}
            <div className="flex flex-col gap-2 p-4 border border-border/15 bg-bg-primary/50">
              <h3 className="text-xs font-mono text-accent uppercase tracking-wider">// Where the Game Simplifies Reality</h3>
              <p className="text-text-secondary/80">
                Real quantum mechanics involves complex calculus, magnetic fields, and subatomic particles. Physical chess pieces cannot actually split into physical waves! Schrödinger's Gambit isn't intended to be a laboratory physics simulation—it borrows one fascinating quantum concept to create deep, strategic gameplay.
              </p>
            </div>

          </div>
        </section>

        {/* Section 5: Why the Game Works This Way */}
        <section className="flex flex-col gap-6 border border-border/20 bg-surface-deep p-6 sm:p-8">
          <div className="flex items-center gap-3 border-b border-border/15 pb-3">
            <span className="text-xs font-mono text-sage">[ 05 ]</span>
            <h2 className="text-lg font-serif text-text-primary tracking-wide">
              Design & Architecture Decisions
            </h2>
          </div>

          <div className="flex flex-col gap-4 font-sans text-xs sm:text-sm">
            {[
              {
                q: 'Why only one quantum move per player?',
                a: 'Allowing unlimited quantum moves creates chaotic boards where every piece is a ghost, removing tactical clarity. Restricting each player to one quantum move turns superposition into a valuable strategic trump card to be deployed at the perfect tactical moment.'
              },
              {
                q: 'Why allow only one active superposition on the board?',
                a: 'Multiple active superpositions would create "quantum entanglements" where one ghost piece splits onto another ghost piece, creating complex dependency webs. Limiting the board to one active superposition keeps the game clean, fast, and intuitive.'
              },
              {
                q: 'Why does collapse happen only on interaction?',
                a: 'If pieces collapsed automatically after one turn, players wouldn\'t get to experience the tension of a persistent quantum state. Requiring a physical move or capture attempt to trigger collapse mirrors how quantum measurement actually works.'
              },
              {
                q: 'Why preserve standard classical chess rules?',
                a: 'Chess has been refined over centuries into a deep, balanced game. Keeping standard movement, checkmate, and draw rules ensures that quantum mechanics enhances classical strategy rather than replacing it.'
              },
              {
                q: 'Why does the engine replay history internally?',
                a: 'Standard chess engines like chess.js cannot place a single piece on two squares. When a collapse happens, our orchestrator rewrites the move history with the collapsed location and replays the game internally to ensure 100% engine correctness.'
              }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col gap-2 p-4 border border-border/10 bg-bg-primary/30">
                <h3 className="font-mono text-xs text-text-primary tracking-wide">{item.q}</h3>
                <p className="text-text-secondary/80 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 6: Curious to Learn More? */}
        <section className="flex flex-col gap-4 border border-sage/30 bg-sage/5 p-6 sm:p-8">
          <div className="flex items-center gap-3 border-b border-sage/20 pb-3">
            <span className="text-xs font-mono text-sage">[ 06 ]</span>
            <h2 className="text-lg font-serif text-text-primary tracking-wide">
              Curious to Learn More?
            </h2>
          </div>

          <div className="flex flex-col items-center gap-4 text-center my-2">
            <div className="py-3 px-6 border border-sage/40 bg-surface-deep font-mono text-sage text-base sm:text-lg tracking-widest select-none">
              iℏ (∂ψ / ∂t) = Ĥψ
            </div>
            <p className="text-xs sm:text-sm font-sans text-text-secondary/90 leading-relaxed max-w-xl">
              This equation is Erwin Schrödinger's famous time-dependent wave equation, one of the foundational pillars of modern quantum mechanics. It mathematically describes how a quantum system's wave function (Ψ) changes over time. Schrödinger's Gambit doesn't simulate this equation—it simply borrows some of the fascinating ideas that grew out of it.
            </p>
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
            onClick={() => navigate('/')}
            className="flex-1 py-3 bg-bg-primary text-text-secondary/70 hover:text-text-primary border border-border/40 hover:border-border text-[9px] font-mono tracking-widest uppercase transition-all duration-200 cursor-pointer rounded-none outline-none focus-visible:outline-1 focus-visible:outline-border select-none"
          >
            [ Return Home ]
          </button>
        </div>

      </main>
    </motion.div>
  )
}

export default TheoryPage
