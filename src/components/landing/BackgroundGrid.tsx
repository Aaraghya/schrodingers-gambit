function BackgroundGrid() {
  return (
    <div className="fixed inset-0 -z-10 select-none pointer-events-none" aria-hidden="true">
      {/* Editorial/Instrument Viewfinder Frame */}
      <div className="absolute inset-4 md:inset-6 border border-border/30" />

      {/* Grid Pattern */}
      <div
        className="absolute inset-4 md:inset-6 opacity-[0.18]"
        style={{
          backgroundImage:
            'radial-gradient(circle, var(--border) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Radial Accent Glow behind Hero */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 600px 400px at 50% 45%, var(--accent-glow), transparent)',
        }}
      />

      {/* Technical Lab Labels in Corners */}
      <div className="absolute top-8 left-8 hidden md:flex flex-col gap-1 font-mono text-[9px] text-text-secondary/30 tracking-[0.15em] uppercase">
        <span>SYS.STATUS: IDLE</span>
        <span>SUPERPOSITION: ENFORCE</span>
      </div>

      <div className="absolute bottom-8 left-8 hidden md:flex flex-col gap-1 font-mono text-[9px] text-text-secondary/30 tracking-[0.15em] uppercase">
        <span>LOC.COORD: 43.7A_00.56</span>
        <span>REF_GRID: SG_V1.0</span>
      </div>

      <div className="absolute bottom-8 right-8 hidden md:flex flex-col gap-1 font-mono text-[9px] text-text-secondary/30 tracking-[0.15em] uppercase text-right">
        <span>[ OBSERVER STATE: MEASURED ]</span>
        <span>COLLAPSE PROBABILITY: UNSET</span>
      </div>
    </div>
  )
}

export default BackgroundGrid
