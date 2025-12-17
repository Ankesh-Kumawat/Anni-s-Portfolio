import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system" | "soft-dark" | "forest-green" | "ocean-blue" | "sunset-orange" | "lavender-dream" | "cream-chocolate" | "rose-gold" | "mint-fresh" | "peachy-keen" | "sky-blue"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

// Theme color mappings
const THEME_COLORS: Record<string, { background: string; foreground: string; primary: string }> = {
  "soft-dark": { background: "#2b2d3a", foreground: "#e0e0e0", primary: "#7c3aed" },
  "forest-green": { background: "#1a2f23", foreground: "#d4e8d4", primary: "#10b981" },
  "ocean-blue": { background: "#1a2332", foreground: "#d4e4f7", primary: "#3b82f6" },
  "sunset-orange": { background: "#2d1f1a", foreground: "#f5e6d3", primary: "#f97316" },
  "lavender-dream": { background: "#2a2438", foreground: "#e9d5ff", primary: "#a855f7" },
  "cream-chocolate": { background: "#faf8f3", foreground: "#3e2723", primary: "#8d6e63" },
  "rose-gold": { background: "#fff5f7", foreground: "#4a1c2e", primary: "#ec4899" },
  "mint-fresh": { background: "#f0fdf4", foreground: "#14532d", primary: "#10b981" },
  "peachy-keen": { background: "#fff7ed", foreground: "#431407", primary: "#f97316" },
  "sky-blue": { background: "#f0f9ff", foreground: "#0c4a6e", primary: "#0ea5e9" },
};

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )

  useEffect(() => {
    const root = window.document.documentElement

    // Remove all theme classes
    root.classList.remove("light", "dark", "soft-dark", "forest-green", "ocean-blue", "sunset-orange", "lavender-dream", "cream-chocolate", "rose-gold", "mint-fresh", "peachy-keen", "sky-blue")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light"

      root.classList.add(systemTheme)
      return
    }

    // Apply theme class
    root.classList.add(theme)

    // Apply custom CSS variables for custom themes
    if (THEME_COLORS[theme]) {
      const colors = THEME_COLORS[theme];
      root.style.setProperty('--background', colors.background);
      root.style.setProperty('--foreground', colors.foreground);
      root.style.setProperty('--primary', colors.primary);
    } else {
      // Reset to default for light/dark
      root.style.removeProperty('--background');
      root.style.removeProperty('--foreground');
      root.style.removeProperty('--primary');
    }
  }, [theme])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
  }

  return (
    <ThemeProviderContext.Provider value={value} {...{ children, defaultTheme, storageKey }}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
