/**
 * AudioManager — Schrödinger's Gambit
 *
 * Completely independent of the chess engines. Produces all game sounds via
 * the Web Audio API (procedural synthesis). No audio files are bundled; every
 * sound is a self-contained synthesis recipe. To replace a sound with a custom
 * asset later, swap only the corresponding `_play*` method — no other code
 * needs to change.
 *
 * Design philosophy: restrained, clean, scientific. Sounds should feel like
 * precision instruments, not a video game arcade.
 */

type AudioCue =
  | 'move'
  | 'capture'
  | 'quantumSplit'
  | 'collapse'
  | 'check'
  | 'checkmate'
  | 'uiClick'

export class AudioManager {
  private ctx: AudioContext | null = null
  private masterGain: GainNode | null = null

  // ─── Public API ──────────────────────────────────────────────────────────

  /** Plays a named audio cue. Silently no-ops if Web Audio is unavailable. */
  public play(cue: AudioCue): void {
    try {
      const ctx = this._getContext()
      if (!ctx) return

      switch (cue) {
        case 'move':         this._playMove(ctx); break
        case 'capture':      this._playCapture(ctx); break
        case 'quantumSplit': this._playQuantumSplit(ctx); break
        case 'collapse':     this._playCollapse(ctx); break
        case 'check':        this._playCheck(ctx); break
        case 'checkmate':    this._playCheckmate(ctx); break
        case 'uiClick':      this._playUiClick(ctx); break
      }
    } catch {
      // Audio errors must never propagate to the gameplay layer
    }
  }

  // ─── Context Management ───────────────────────────────────────────────────

  private _getContext(): AudioContext | null {
    if (typeof window === 'undefined' || !('AudioContext' in window || 'webkitAudioContext' in window)) {
      return null
    }
    if (!this.ctx) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const Ctx = window.AudioContext ?? (window as any).webkitAudioContext
      this.ctx = new Ctx()
      this.masterGain = this.ctx.createGain()
      this.masterGain.gain.value = 0.65
      this.masterGain.connect(this.ctx.destination)
    }
    // Resume context if suspended (browser autoplay policy)
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => { /* intentional no-op */ })
    }
    return this.ctx
  }

  /**
   * Returns the master output node for chaining synthesized nodes.
   */
  private _output(ctx: AudioContext): AudioNode {
    if (!this.masterGain) {
      this.masterGain = ctx.createGain()
      this.masterGain.gain.value = 0.65
      this.masterGain.connect(ctx.destination)
    }
    return this.masterGain
  }

  // ─── Synthesis Helpers ────────────────────────────────────────────────────

  /**
   * Creates a simple envelope — attack + sustain + release — on a GainNode.
   */
  private _envelope(
    gainNode: GainNode,
    now: number,
    attack: number,
    sustain: number,
    release: number,
    peakGain = 1.0
  ): void {
    gainNode.gain.setValueAtTime(0, now)
    gainNode.gain.linearRampToValueAtTime(peakGain, now + attack)
    gainNode.gain.setValueAtTime(peakGain, now + attack + sustain)
    gainNode.gain.linearRampToValueAtTime(0, now + attack + sustain + release)
  }

  // ─── Sound Recipes ────────────────────────────────────────────────────────

  /**
   * MOVE: A short, clean wooden thud. Low-frequency noise burst shaped by a
   * fast envelope — precise, not percussive.
   */
  private _playMove(ctx: AudioContext): void {
    const now = ctx.currentTime
    const gainNode = ctx.createGain()
    gainNode.connect(this._output(ctx))
    this._envelope(gainNode, now, 0.003, 0.02, 0.07, 0.28)

    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(320, now)
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.1)
    osc.connect(gainNode)
    osc.start(now)
    osc.stop(now + 0.12)
  }

  /**
   * CAPTURE: A sharper, slightly denser impact. Two layered tones with a brief
   * transient click, suggesting material contact rather than a slide.
   */
  private _playCapture(ctx: AudioContext): void {
    const now = ctx.currentTime

    // Primary impact tone
    const g1 = ctx.createGain()
    g1.connect(this._output(ctx))
    this._envelope(g1, now, 0.002, 0.01, 0.12, 0.38)

    const osc1 = ctx.createOscillator()
    osc1.type = 'triangle'
    osc1.frequency.setValueAtTime(520, now)
    osc1.frequency.exponentialRampToValueAtTime(140, now + 0.14)
    osc1.connect(g1)
    osc1.start(now)
    osc1.stop(now + 0.16)

    // Secondary sub-thud for weight
    const g2 = ctx.createGain()
    g2.connect(this._output(ctx))
    this._envelope(g2, now, 0.003, 0.02, 0.09, 0.22)

    const osc2 = ctx.createOscillator()
    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(200, now)
    osc2.frequency.exponentialRampToValueAtTime(80, now + 0.11)
    osc2.connect(g2)
    osc2.start(now)
    osc2.stop(now + 0.14)
  }

  /**
   * QUANTUM SPLIT: A rising synthetic shimmer — two slightly detuned sine
   * waves diverge in frequency, suggesting bifurcation into superposition.
   * Atmospheric, not magical.
   */
  private _playQuantumSplit(ctx: AudioContext): void {
    const now = ctx.currentTime

    const voices = [
      { startFreq: 440, endFreq: 660, detune: 0 },
      { startFreq: 440, endFreq: 695, detune: 7 },
    ]

    for (const v of voices) {
      const g = ctx.createGain()
      g.connect(this._output(ctx))
      this._envelope(g, now, 0.04, 0.08, 0.28, 0.14)

      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.detune.value = v.detune
      osc.frequency.setValueAtTime(v.startFreq, now)
      osc.frequency.linearRampToValueAtTime(v.endFreq, now + 0.42)
      osc.connect(g)
      osc.start(now)
      osc.stop(now + 0.44)
    }
  }

  /**
   * COLLAPSE: A converging resonance — two tones that were diverging now
   * snap together into a single resolved frequency, like a wavefunction
   * resolving. Followed by a brief low-frequency confirmation pulse.
   */
  private _playCollapse(ctx: AudioContext): void {
    const now = ctx.currentTime

    // Two tones converging to unison
    const voices = [
      { startFreq: 660, endFreq: 440 },
      { startFreq: 695, endFreq: 440 },
    ]

    for (const v of voices) {
      const g = ctx.createGain()
      g.connect(this._output(ctx))
      this._envelope(g, now, 0.01, 0.05, 0.22, 0.13)

      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(v.startFreq, now)
      osc.frequency.linearRampToValueAtTime(v.endFreq, now + 0.28)
      osc.connect(g)
      osc.start(now)
      osc.stop(now + 0.3)
    }

    // Resolution pulse
    const gPulse = ctx.createGain()
    gPulse.connect(this._output(ctx))
    this._envelope(gPulse, now + 0.25, 0.005, 0.03, 0.1, 0.18)

    const oscPulse = ctx.createOscillator()
    oscPulse.type = 'sine'
    oscPulse.frequency.value = 220
    oscPulse.connect(gPulse)
    oscPulse.start(now + 0.25)
    oscPulse.stop(now + 0.42)
  }

  /**
   * CHECK: A clean, short two-tone alert — measured and precise, not alarming.
   * Inspired by lab equipment warning tones.
   */
  private _playCheck(ctx: AudioContext): void {
    const now = ctx.currentTime

    const tones = [
      { freq: 880, at: now },
      { freq: 1100, at: now + 0.12 },
    ]

    for (const t of tones) {
      const g = ctx.createGain()
      g.connect(this._output(ctx))
      this._envelope(g, t.at, 0.005, 0.04, 0.08, 0.22)

      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = t.freq
      osc.connect(g)
      osc.start(t.at)
      osc.stop(t.at + 0.14)
    }
  }

  /**
   * CHECKMATE: Three descending tones — resolute, final, and solemn.
   * Not triumphant, not punishing. Calibration concluded.
   */
  private _playCheckmate(ctx: AudioContext): void {
    const now = ctx.currentTime

    const tones = [
      { freq: 880, at: now },
      { freq: 660, at: now + 0.18 },
      { freq: 440, at: now + 0.38 },
    ]

    for (const t of tones) {
      const g = ctx.createGain()
      g.connect(this._output(ctx))
      this._envelope(g, t.at, 0.01, 0.08, 0.2, 0.24)

      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = t.freq
      osc.connect(g)
      osc.start(t.at)
      osc.stop(t.at + 0.32)
    }
  }

  /**
   * UI CLICK: A brief, barely-audible soft transient — just enough to confirm
   * a button activation without being distracting.
   */
  private _playUiClick(ctx: AudioContext): void {
    const now = ctx.currentTime
    const g = ctx.createGain()
    g.connect(this._output(ctx))
    this._envelope(g, now, 0.002, 0.005, 0.04, 0.12)

    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(900, now)
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.04)
    osc.connect(g)
    osc.start(now)
    osc.stop(now + 0.05)
  }
}

/** Singleton instance — shared across the entire application. */
export const audioManager = new AudioManager()
