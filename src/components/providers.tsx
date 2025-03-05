"use client"
import { ThemeProvider } from "next-themes"

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      enableSystem
      attribute="class"
      themes={["light", "dark"]}
      defaultTheme="system"
      enableColorScheme
    >
      {children}
    </ThemeProvider>
  )
}

export default Providers
