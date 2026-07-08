function BackgroundGrid() {
  return (
    <div className="fixed inset-0 -z-10" aria-hidden="true">
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            'radial-gradient(circle, var(--border) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Radial accent glow — centered behind hero */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 800px 600px at 50% 40%, var(--accent-glow), transparent)',
        }}
      />
    </div>
  )
}

export default BackgroundGrid
