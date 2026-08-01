# Schrödinger's Gambit — Version 1

> A quantum-inspired chess variant web application featuring real-time wave function superposition, measurement-driven state collapse, procedural Web Audio feedback, and a laboratory scientific telemetry interface.

---

## Table of Contents

- [Overview](#overview)
- [Quantum Gameplay Mechanics](#quantum-gameplay-mechanics)
- [Version 1 Rule Set](#version-1-rule-set)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Repository Structure](#repository-structure)
- [Installation & Setup](#installation--setup)
- [Running Locally](#running-locally)
- [Build & Verification](#build--verification)
- [Screenshots & Visuals](#screenshots--visuals)
- [Future Roadmap (Version 2)](#future-roadmap-version-2)
- [License & Credits](#license--credits)

---

## Overview

**Schrödinger's Gambit** brings fundamental concepts from quantum mechanics — **superposition**, **wave function probability**, and **measurement collapse** — onto the classical 8x8 chessboard.

Players can split a selected chess piece into a state of quantum superposition, distributing its presence across two distinct target destination squares. The piece exists as semi-transparent "ghost" states in both locations simultaneously with equal 50/50 probability density. The superposition persists until a measurement event (such as moving the quantum piece or attempting to capture one of its branches) forces an instantaneous collapse to a single square, updating the game state according to strict classical chess invariants.

---

## Quantum Gameplay Mechanics

```
                  ┌───────────────────────────────┐
                  │      Initiate Superposition   │
                  │   Select piece & 2 destinations │
                  └───────────────┬───────────────┘
                                  │
                                  ▼
                  ┌───────────────────────────────┐
                  │    Active Superposition (Ψ)   │
                  │ Ghost pieces at Square A & B  │
                  └───────────────┬───────────────┘
                                  │
                       Measurement Event (Move/Capture)
                                  │
                                  ▼
                  ┌───────────────────────────────┐
                  │      State Collapse (50/50)   │
                  │ Resolves to Square A OR B     │
                  └───────────────┬───────────────┘
                                  │
                                  ▼
                  ┌───────────────────────────────┐
                  │    Deterministic Replay Sync  │
                  │ Engine updates classical state│
                  └───────────────────────────────┘
```

### 1. Superposition (Split Move)
When a player initiates superposition, they choose a piece and select **two legal destination squares**. The piece vanishes from its original position and materializes as two ghost states at **Square A** and **Square B**.

### 2. Observation & Measurement
The quantum state remains active on the board until an interactive measurement is triggered:
- **Move Measurement**: A player attempts to move the quantum piece from one of its branch squares.
- **Capture Measurement**: A player attempts to capture either branch of the quantum piece.

### 3. Collapse & State Resolution
When a measurement occurs:
1. The `QuantumEngine` randomly resolves the wave function to **Square A** (50%) or **Square B** (50%).
2. The orchestrator (`useChessGame`) rebuilds the move history up to the split point, substituting the actual collapsed square.
3. The classical engine validates and executes the resulting move, maintaining 100% compliance with standard chess rules.

---

## Version 1 Rule Set

1. **One Quantum Move Per Player**: Each player (`White` and `Black`) is granted **1 quantum split move** per game.
2. **Single Active Superposition**: Only **one superposition** may exist on the board at any given time across both players.
3. **Legal Classical Destinations**: A piece can only split onto target squares that represent valid, legal classical moves for that piece type in the current position.
4. **Instant Measurement**: Interacting with either branch of an active superposition immediately triggers a collapse before processing the requested classical action.
5. **Invariant Preservation**: Check, checkmate, stalemate, draw rules (50-move rule, threefold repetition, insufficient material), castling rights, en passant, and pawn promotions are strictly evaluated after state collapse.

---

## Features

- **Laboratory Telemetry Interface**: Industrial, dark-mode design system styled with strict unrounded corners, custom HSL color tokens (`--sage`, `--accent`, `--surface`), and crisp monospace typography.
- **Procedural Web Audio Engine**: Zero external audio asset dependencies. Synthesizes subtle, clean, scientific audio cues (move thud, capture density, quantum split shimmer, collapse resonance, check warning ping, checkmate tone, and UI clicks) using the native Web Audio API.
- **Dynamic Coupling Vector**: An animated SVG vector line links the two branches of a quantum superposition whenever either branch is hovered.
- **Operational Log Terminal**: Displays real-time SAN move history paired by round, alongside system status readouts.
- **Wave Function Analyzer**: Displays field coherence metrics, superposition state tracking, and probability curve graphs.
- **Comprehensive Verification Suite**: Includes 3 automated test runners validating rules, gameplay coordination, replay integrity, and full integration scenarios.

---

## System Architecture

The application is structured using a **Decoupled Model-View-Orchestrator** architectural pattern:

```
┌────────────────────────────────────────────────────────────────────────┐
│                              React View Layer                          │
│  (GamePage, ChessBoard, Square, Piece, QuantumStatusPanel, LogPanel)   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        Orchestrator (useChessGame)                      │
│   • Synchronizes engine states & handles user click interactions       │
│   • Merges board views via getMergedBoardState()                        │
│   • Triggers rebuildGame() replay synchronization on collapse         │
│   • Emits audio cues to AudioManager                                    │
└──────────────────┬─────────────────────────────────┬───────────────────┘
                   │                                 │
                   ▼                                 ▼
┌───────────────────────────────────┐ ┌───────────────────────────────────┐
│        ChessEngine (Model)        │ │       QuantumEngine (Model)       │
│  • Wraps chess.js                 │ │  • Tracks active QuantumOverlay   │
│  • Pure classical chess state     │ │  • Manages spent quantum moves    │
│  • Standard check/mate/draw rules │ │  • Measurement history & collapse │
└───────────────────────────────────┘ └───────────────────────────────────┘
```

- **`ChessEngine`**: Pure deterministic classical chess validator wrapping `chess.js`. Has no knowledge of quantum mechanics.
- **`QuantumEngine`**: Independent quantum state manager tracking active overlays, measurement triggers, and collapse probabilities. Has no knowledge of classical movement geometry.
- **`useChessGame` Hook**: Central orchestrator synchronizing both engines, managing UI selection flows, driving replay reconstruction, and triggering audio cues.
- **`AudioManager`**: Standalone audio synthesizer operating independently of game logic.

---

## Technology Stack

| Domain | Technology | Description |
| :--- | :--- | :--- |
| **Core Framework** | React 19 + Vite 8 | High-performance component rendering and fast HMR dev server |
| **Language** | TypeScript 5.7+ | Strict type safety across components, hooks, and engines |
| **Styling** | Tailwind CSS v4 | CSS variable tokenization, custom animation keyframes |
| **Chess Logic** | `chess.js` v1.4 | Authoritative classical move validation and board FEN parsing |
| **Audio Engine** | Web Audio API | Procedural sound synthesis (0 external MP3/WAV files) |
| **Animations** | Framer Motion v12 | UI transitions and interactive button scaling |
| **Quality & Tests** | Oxlint + `tsx` | High-speed linting and deterministic TypeScript test execution |

---

## Repository Structure

```text
schrodingers-gambit/
├── dist/                          # Production build output
├── public/                        # Static assets & public documentation
│   ├── docs/
│   │   └── screenshots/           # Screenshot repository for documentation
│   └── favicon.ico
├── src/
│   ├── components/                # Global layout & landing page components
│   │   ├── landing/
│   │   └── layout/
│   ├── features/                  # Domain-driven feature modules
│   │   ├── audio/
│   │   │   └── audioManager.ts    # Procedural Web Audio API synthesizer
│   │   ├── chess/
│   │   │   ├── components/        # Board, Square, Piece, & Panel components
│   │   │   └── types/
│   │   ├── engine/
│   │   │   ├── boardMapper.ts     # Maps chess.js board representation
│   │   │   ├── chessEngine.ts     # Classical ChessEngine wrapper
│   │   │   └── moveValidation.ts
│   │   ├── hooks/
│   │   │   └── useChessGame.ts    # Central Orchestrator Hook
│   │   └── quantum/
│   │       ├── engine/
│   │       │   └── quantumEngine.ts # Pure QuantumEngine state manager
│   │       ├── types/
│   │       └── utils/
│   ├── pages/                     # Application pages (LandingPage, GamePage)
│   ├── App.tsx                    # Client-side router definition
│   ├── main.tsx                   # React root mount point
│   └── index.css                  # Design system tokens & keyframe animations
├── verify-rules-audit.ts          # Comprehensive classical rules verification suite
├── verify-gameplay-coordinator.ts # Coordinator collapse & probability trial suite
├── verify-gameplay-integration.ts  # End-to-end integration scenario suite
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## Installation & Setup

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Aaraghya/schrodingers-gambit.git
   cd schrodingers-gambit
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

---

## Running Locally

Start the Vite development server:

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173`.

---

## Build & Verification

### Production Build

Compile TypeScript and build the optimized production bundle:

```bash
npm run build
```

### Code Linting

Run Oxlint across all source files:

```bash
npx oxlint src/
```

### Automated Verification Suites

Run the full verification suite to validate rules, probability distribution, and state safety:

```bash
# 1. Classical Rules Audit (40 assertions)
npx tsx verify-rules-audit.ts

# 2. Coordinator & Collapse Trials (Probability checks)
npx tsx verify-gameplay-coordinator.ts

# 3. End-to-End Integration Scenarios
npx tsx verify-gameplay-integration.ts
```

---

## Screenshots & Visuals

> Visual preview screenshots and recordings of Schrödinger's Gambit should be placed in `public/docs/screenshots/` following these naming conventions:

- `hero-landing.png` — Landing page hero section with atmospheric radial glow.
- `game-board-initial.png` — Initial game board layout and status bar readout.
- `superposition-targeting.png` — Initiating superposition and picking destination squares.
- `quantum-overlay-active.png` — Active superposition showing ghost pieces and SVG coupling line.
- `state-collapse-log.png` — State collapse resolution recorded in the operational log terminal.

---

## Future Roadmap (Version 2)

The following concept features are planned for future iterations beyond Version 1:

- [ ] **Multi-Piece Entanglement**: Allowing superpositions of multiple pieces to interact and form dependent quantum graphs.
- [ ] **Online Peer-to-Peer Multiplayer**: WebRTC or WebSocket implementation for remote play.
- [ ] **Quantum AI Engine**: Minimax / MCTS algorithm adapted to evaluate probabilistic game trees.
- [ ] **Custom Audio Asset Packs**: High-definition sampled audio options alongside the procedural synth engine.
- [ ] **Interactive Wave Function Controls**: Volume sliders, audio mute toggles, and customizable wave telemetry graphs.

---

## License & Credits

- **License**: MIT License — open-source for educational and recreational use.
- **Engine Core**: Powered by [`chess.js`](https://github.com/jhlywa/chess.js) for standard chess move validation.
- **Design & Concept**: Built with inspiration from quantum mechanics and scientific instrumentation consoles.
