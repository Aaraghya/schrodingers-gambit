import { useTheme } from '../../features/hooks/useTheme'

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex items-center gap-2 select-none cursor-pointer outline-none focus-visible:outline-1 focus-visible:outline-sage group"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
    >
      <span className="text-[8px] font-mono tracking-[0.2em] text-text-secondary/40 uppercase transition-colors duration-300 group-hover:text-text-secondary/70">
        THEME
      </span>
      <span className="text-[9px] font-mono tracking-[0.15em] text-text-secondary/50 border border-border/40 px-2 py-0.5 uppercase transition-all duration-300 group-hover:text-text-primary group-hover:border-sage/50">
        {theme === 'dark' ? '[ DARK ]' : '[ LIGHT ]'}
      </span>
    </button>
  )
}

export default ThemeToggle
