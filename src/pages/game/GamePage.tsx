import React from 'react'
import { motion } from 'framer-motion'
import Header from '../../components/layout/Header'
import BackgroundGrid from '../../components/landing/BackgroundGrid'
import { ChessBoard } from '../../features/chess/components/ChessBoard'
import QuantumStatusPanel from '../../features/chess/components/QuantumStatusPanel'
import OperationalLogPanel from '../../features/chess/components/OperationalLogPanel'
import { useChessGame } from '../../features/hooks/useChessGame'

export const GamePage: React.FC = () => {
  const { 
    board,
    selectedSquare,
    legalMoves,
    lastMove,
    selectSquare,
    turn
  } = useChessGame()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen w-full flex flex-col bg-bg-primary text-text-primary lg:overflow-hidden"
    >
      <BackgroundGrid />
      <Header />

      {/* Main Game Interface Layout */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-10 pt-20 pb-8 flex items-center justify-center lg:h-[calc(100vh-4rem)] min-h-0">
        <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12 items-stretch h-full min-h-0">
          
          {/* Left panel: Quantum Status */}
          <div className="col-span-1 lg:border-r lg:border-border/10 lg:pr-8 h-full min-h-0 flex flex-col justify-center order-2 lg:order-1">
            <QuantumStatusPanel />
          </div>

          {/* Centered Chessboard Panel (takes 2 columns on desktop) */}
          <div className="col-span-1 lg:col-span-2 flex flex-col items-center justify-center py-4 px-2 md:px-4 order-1 lg:order-2 h-full min-h-0">
            <div className="w-full max-w-[460px] flex flex-col gap-4">
              
              {/* Telemetry Status Bar */}
              <div className="w-full flex items-center justify-between px-4 py-2.5 border border-border/30 bg-[#0c0c0d] font-mono select-none">
                <div className="flex items-center gap-2">
                  <span className={`h-1.5 w-1.5 rounded-full ${turn === 'w' ? 'bg-success' : 'bg-accent'} animate-pulse`} />
                  <span className="text-[8px] sm:text-[9px] text-text-secondary/50 tracking-[0.15em] uppercase">SYSTEM STATE</span>
                </div>
                <span className="text-[9px] sm:text-[10px] text-sage font-bold tracking-[0.2em] uppercase animate-pulse">
                  {turn === 'w' ? 'QUANTUM MOVE AVAILABLE' : 'OBSERVATION PENDING'}
                </span>
                <span className="text-[8px] sm:text-[9px] text-text-secondary/30 tracking-wider uppercase">
                  {turn === 'w' ? 'WHITE TURN' : 'BLACK TURN'}
                </span>
              </div>

              {/* Chessboard Component */}
              <div className="w-full">
                <ChessBoard 
                  board={board}
                  selectedSquare={selectedSquare}
                  legalMoves={legalMoves}
                  lastMove={lastMove}
                  onSquareClick={selectSquare}
                />
              </div>

            </div>
          </div>

          {/* Right panel: Operational Logs & Controls */}
          <div className="col-span-1 lg:border-l lg:border-border/10 lg:pl-8 h-full min-h-0 flex flex-col justify-center order-3">
            <OperationalLogPanel />
          </div>

        </div>
      </main>
    </motion.div>
  )
}

export default GamePage
