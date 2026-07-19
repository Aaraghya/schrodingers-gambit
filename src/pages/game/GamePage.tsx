import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/layout/Header'
import BackgroundGrid from '../../components/landing/BackgroundGrid'
import { ChessBoard } from '../../features/chess/components/ChessBoard'
import QuantumStatusPanel from '../../features/chess/components/QuantumStatusPanel'
import OperationalLogPanel from '../../features/chess/components/OperationalLogPanel'
import { useChessGame } from '../../features/hooks/useChessGame'

export const GamePage: React.FC = () => {
  const navigate = useNavigate()
  const { 
    board,
    selectedSquare,
    legalMoves,
    lastMove,
    selectSquare,
    turn,
    inCheck,
    isCheckmate,
    isDraw,
    drawReason,
    history,
    promotionPending,
    kingInCheckSquare,
    promotePawn,
    cancelPromotion,
    resetGame,
    isQuantumModeActive,
    quantumModeError,
    firstTarget,
    secondTarget,
    currentOverlay,
    hasUsedQuantumMove,
    toggleQuantumMode,
    triggerManualCollapse
  } = useChessGame()

  const onReturnHome = () => {
    navigate('/')
  }

  // Get dynamic state message for the status bar
  const getStatusBarMessage = () => {
    if (isQuantumModeActive) {
      return firstTarget === null ? 'SELECT FIRST DESTINATION' : 'SELECT SECOND DESTINATION'
    }
    if (promotionPending) return 'Promotion Required'
    if (isCheckmate) return 'Checkmate'
    if (isDraw) return 'Draw Detected'
    if (inCheck) return 'Check'
    return turn === 'w' ? 'QUANTUM MOVE AVAILABLE' : 'OBSERVATION PENDING'
  }

  const getStatusBarTurnText = () => {
    if (isCheckmate) return turn === 'w' ? 'BLACK WINS' : 'WHITE WINS'
    if (isDraw) return 'GAME DRAWN'
    return turn === 'w' ? 'WHITE TURN' : 'BLACK TURN'
  }

  const isSystemAlert = inCheck || isCheckmate || promotionPending
  const dotColor = isQuantumModeActive ? 'bg-sage' : (isSystemAlert ? 'bg-[#e25c5c]' : (turn === 'w' ? 'bg-success' : 'bg-accent'))
  const dotPulse = isQuantumModeActive ? '' : 'animate-pulse'
  const textColor = isQuantumModeActive ? 'text-sage' : (isSystemAlert ? 'text-[#e25c5c]' : 'text-sage')
  const textPulse = isQuantumModeActive ? '' : 'animate-pulse'

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
                  <span className={`h-1.5 w-1.5 rounded-full ${dotColor} ${dotPulse}`} />
                  <span className="text-[8px] sm:text-[9px] text-text-secondary/50 tracking-[0.15em] uppercase">SYSTEM STATE</span>
                </div>
                <span className={`text-[9px] sm:text-[10px] ${textColor} font-bold tracking-[0.2em] uppercase ${textPulse}`}>
                  {getStatusBarMessage()}
                </span>
                <span className="text-[8px] sm:text-[9px] text-text-secondary/30 tracking-wider uppercase">
                  {getStatusBarTurnText()}
                </span>
              </div>

              {/* Quantum Move Button */}
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={toggleQuantumMode}
                  disabled={!isQuantumModeActive && hasUsedQuantumMove}
                  className={`w-full py-2 border font-mono text-[10px] tracking-widest uppercase transition-all duration-200 cursor-pointer select-none rounded-none outline-none ${
                    isQuantumModeActive
                      ? 'bg-sage/10 text-sage border-sage hover:bg-sage/20'
                      : hasUsedQuantumMove
                        ? 'bg-bg-primary text-text-secondary/30 border-border/10 cursor-not-allowed'
                        : 'bg-[#0c0c0d] text-sage border-sage/40 hover:border-sage hover:text-text-primary'
                  }`}
                >
                  {isQuantumModeActive ? '[ Cancel Superposition ]' : '[ Initiate Superposition ]'}
                </button>
                {quantumModeError && (
                  <span className="text-[9px] font-mono text-text-secondary/50 tracking-wider text-center uppercase">
                    // Activation Failed: {quantumModeError}
                  </span>
                )}
              </div>

              {/* Chessboard Component */}
              <div className="w-full">
                <ChessBoard 
                  board={board}
                  selectedSquare={selectedSquare}
                  legalMoves={legalMoves}
                  lastMove={lastMove}
                  kingInCheckSquare={kingInCheckSquare}
                  promotionPending={promotionPending}
                  isGameOver={isCheckmate || isDraw}
                  isCheckmate={isCheckmate}
                  drawReason={drawReason}
                  turn={turn}
                  onSquareClick={selectSquare}
                  onPromoteSelect={promotePawn}
                  onPromoteCancel={cancelPromotion}
                  onResetGame={resetGame}
                  onReturnHome={onReturnHome}
                  firstTarget={firstTarget}
                  secondTarget={secondTarget}
                  currentOverlay={currentOverlay}
                />
              </div>

            </div>
          </div>

          {/* Right panel: Operational Logs & Controls */}
          <div className="col-span-1 lg:border-l lg:border-border/10 lg:pl-8 h-full min-h-0 flex flex-col justify-center order-3">
            <OperationalLogPanel 
              history={history}
              onResetGame={resetGame}
              onAbortTest={onReturnHome}
              onClearSelection={triggerManualCollapse}
            />
          </div>

        </div>
      </main>
    </motion.div>
  )
}

export default GamePage
