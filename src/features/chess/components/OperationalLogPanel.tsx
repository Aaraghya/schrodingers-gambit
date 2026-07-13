import React from 'react'
import { motion } from 'framer-motion'

interface OperationalLogPanelProps {
  history: string[]
  onResetGame: () => void
  onAbortTest: () => void
  onClearSelection?: () => void
}

export const OperationalLogPanel: React.FC<OperationalLogPanelProps> = ({
  history,
  onResetGame,
  onAbortTest,
  onClearSelection
}) => {
  // Map flat SAN moves list into paired rounds (e.g. White move, Black move)
  const logEntries = []
  for (let i = 0; i < history.length; i += 2) {
    const num = String(Math.floor(i / 2) + 1).padStart(2, '0')
    const white = history[i]
    const black = history[i + 1] || '...'
    logEntries.push({ num, white, black, type: 'CLASSICAL' })
  }

  return (
    <div className="flex flex-col h-full justify-between gap-6 py-2 text-right font-mono">
      {/* Panel Title */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] tracking-[0.25em] text-sage font-bold uppercase">
          // Operations: Log & Controls
        </span>
        <div className="h-[1px] w-full bg-border/30" />
      </div>

      {/* Terminal-style Move Logs */}
      <div className="flex-1 flex flex-col justify-start gap-3 min-h-0">
        <span className="text-[9px] text-text-secondary/40 uppercase tracking-wider text-right">
          // Move Registry
        </span>
        <div className="flex-1 overflow-y-auto border border-border/20 bg-[#0c0c0d] p-3 text-[10px] flex flex-col gap-2 text-left h-48 max-h-56 custom-scrollbar">
          <div className="text-text-secondary/30 uppercase tracking-[0.1em] text-[8px] border-b border-border/10 pb-1 mb-1 flex justify-between">
            <span>Step</span>
            <span>Observations</span>
            <span className="text-right">Field Mode</span>
          </div>
          {logEntries.map((entry) => (
            <div key={entry.num} className="flex justify-between items-center text-text-primary/70 leading-normal">
              <span className="text-text-secondary/40 w-6">{entry.num}.</span>
              <span className="flex-1 font-sans">{entry.white}</span>
              <span className="flex-1 font-sans">{entry.black}</span>
              <span className={`text-[8px] px-1 bg-border/20 text-right ${entry.type === 'QUANTUM' ? 'text-accent border border-accent/20' : 'text-text-secondary/50'}`}>
                {entry.type}
              </span>
            </div>
          ))}
          {/* Active blinking prompt cursor */}
          <div className="flex items-center gap-1 text-[9px] text-sage/70 mt-1">
            <span>&gt; SYSTEM STATE: READY_TO_MEASURE</span>
            <span className="w-1.5 h-3 bg-sage/70 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Calibration Controls */}
      <div className="flex flex-col gap-3">
        <span className="text-[9px] text-text-secondary/40 uppercase tracking-wider text-right">
          // Calibration Controls
        </span>
        <div className="flex flex-col gap-2">
          {/* Main action: Collapse */}
          <motion.button 
            type="button"
            onClick={onClearSelection}
            className="w-full py-2.5 bg-bg-primary text-sage hover:text-text-primary border border-sage/40 hover:border-sage text-[10px] font-mono tracking-widest uppercase transition-all duration-200 hover:shadow-[0_0_16px_rgba(151,168,138,0.15)] cursor-pointer rounded-none outline-none focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-sage select-none"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'tween', duration: 0.15 }}
          >
            [ Collapse State ]
          </motion.button>
          
          <div className="grid grid-cols-2 gap-2">
            <motion.button 
              type="button"
              onClick={onResetGame}
              className="py-2 bg-bg-primary text-text-secondary/70 hover:text-text-primary border border-border/40 hover:border-border text-[9px] font-mono tracking-widest uppercase transition-all duration-200 cursor-pointer rounded-none outline-none focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-border select-none"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'tween', duration: 0.15 }}
            >
              [ Reset Field ]
            </motion.button>
            <motion.button 
              type="button"
              onClick={onAbortTest}
              className="py-2 bg-bg-primary text-text-secondary/70 hover:text-text-primary border border-border/40 hover:border-border text-[9px] font-mono tracking-widest uppercase transition-all duration-200 cursor-pointer rounded-none outline-none focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-border select-none"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'tween', duration: 0.15 }}
            >
              [ Abort Test ]
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OperationalLogPanel
