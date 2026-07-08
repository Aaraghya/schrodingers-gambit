import React from 'react'

interface BoardCoordinatesProps {
  className?: string
}

export const BoardCoordinates: React.FC<BoardCoordinatesProps> = () => {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1']

  return (
    <>
      {/* Rank Labels (Vertical Left, within the p-6 frame) */}
      <div 
        className="absolute left-0 top-6 bottom-6 w-6 flex flex-col justify-around text-[9px] font-mono text-text-secondary/40 select-none pointer-events-none"
        aria-hidden="true"
      >
        {ranks.map((rank) => (
          <span key={rank} className="h-full flex items-center justify-center">
            {rank}
          </span>
        ))}
      </div>

      {/* File Labels (Horizontal Bottom, within the p-6 frame) */}
      <div 
        className="absolute bottom-0 left-6 right-6 h-6 flex justify-around text-[9px] font-mono text-text-secondary/40 select-none pointer-events-none"
        aria-hidden="true"
      >
        {files.map((file) => (
          <span key={file} className="w-full flex items-center justify-center uppercase">
            {file}
          </span>
        ))}
      </div>
    </>
  )
}
