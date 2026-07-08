import React from 'react'

export const QuantumStatusPanel: React.FC = () => {
  return (
    <div className="flex flex-col h-full justify-between gap-8 py-2 text-left font-mono">
      {/* Panel Title */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] tracking-[0.25em] text-sage font-bold uppercase">
          // Analyzer: Wave Function
        </span>
        <div className="h-[1px] w-full bg-border/30" />
      </div>

      {/* Main Telemetry Indicators */}
      <div className="flex flex-col gap-6 flex-1 justify-center">
        {/* State readout with blinking style green led */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[9px] text-text-secondary/50 uppercase tracking-wider">Field Coherence</span>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
            </span>
            <span className="text-xs text-text-primary uppercase tracking-wide">
              Wave Function Stable
            </span>
          </div>
        </div>

        {/* Superposition state */}
        <div className="flex flex-col gap-1">
          <span className="text-[9px] text-text-secondary/50 uppercase tracking-wider">Superposition State</span>
          <span className="text-xs text-text-primary uppercase tracking-wide">
            0 Active States
          </span>
        </div>

        {/* Collapse probability */}
        <div className="flex flex-col gap-1">
          <span className="text-[9px] text-text-secondary/50 uppercase tracking-wider">Collapse Probability</span>
          <span className="text-xs text-text-primary uppercase tracking-wide">
            100.0% Pure State
          </span>
        </div>

        {/* Entangled nodes */}
        <div className="flex flex-col gap-1">
          <span className="text-[9px] text-text-secondary/50 uppercase tracking-wider">Entanglement Field</span>
          <span className="text-xs text-text-primary uppercase tracking-wide text-text-secondary/60">
            Field Disconnected
          </span>
        </div>
      </div>

      {/* Probability Telemetry Graph (Subtle SVG Line) */}
      <div className="flex flex-col gap-3">
        <span className="text-[9px] text-text-secondary/40 uppercase tracking-wider">
          // Probability Telemetry
        </span>
        <div className="relative h-24 w-full border border-border/20 bg-[#0c0c0d] flex items-center justify-center p-1">
          {/* Horizontal and Vertical grid lines */}
          <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 pointer-events-none opacity-20">
            <div className="border-r border-border/40 w-full h-full" />
            <div className="border-r border-border/40 w-full h-full" />
            <div className="border-r border-border/40 w-full h-full" />
            <div className="border-b border-border/40 w-full h-full col-span-4" />
            <div className="border-b border-border/40 w-full h-full col-span-4" />
            <div className="border-b border-border/40 w-full h-full col-span-4" />
          </div>

          {/* SVG Wave Function Curve */}
          <svg className="w-full h-full opacity-60" viewBox="0 0 160 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Base line */}
            <line x1="0" y1="70" x2="160" y2="70" stroke="#2a2a2e" strokeWidth="1" />
            {/* Probability curve (Normal distribution-like wave) */}
            <path
              d="M 10 70 Q 40 70 60 40 T 80 15 T 100 45 T 120 70 L 150 70"
              stroke="#97A88A"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            {/* Measurement cursor */}
            <line x1="80" y1="10" x2="80" y2="70" stroke="#4a9e9e" strokeWidth="1" strokeDasharray="2 2" />
          </svg>

          {/* Text overlays */}
          <span className="absolute top-2 left-2 text-[8px] text-text-secondary/30">ψ(x)</span>
          <span className="absolute bottom-2 right-2 text-[8px] text-text-secondary/30">Δx · Δp ≥ ℏ/2</span>
        </div>
      </div>
    </div>
  )
}

export default QuantumStatusPanel
