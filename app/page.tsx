"use client"

import type React from "react"

import { useEffect, useMemo, useState } from "react"
import { SiteHeader } from "@/components/site-header"
import TypingTest from "@/components/typing-test"
import { ThemePicker } from "@/components/theme-picker"
import { DEFAULT_THEME, type Theme } from "@/lib/themes"
import { useLocalStorage } from "@/hooks/use-local-storage"

export default function Page() {
  const [theme, setTheme] = useLocalStorage<Theme>("tc-theme", DEFAULT_THEME)
  const [openThemes, setOpenThemes] = useState(false)

  // Local state to control test settings (mode/duration/words) from child using window shims
  const [mode, setMode] = useState<"time" | "words">("time")
  const [duration, setDuration] = useState<number>(30)
  const [wordsCount, setWordsCount] = useState<number>(50)

  useEffect(() => {
    ;(window as any).__setMode = (m: "time" | "words") => setMode(m)
    ;(window as any).__setDuration = (d: number) => setDuration(d)
    ;(window as any).__setWords = (w: number) => setWordsCount(w)
    return () => {
      delete (window as any).__setMode
      delete (window as any).__setDuration
      delete (window as any).__setWords
    }
  }, [])

  const themeVars = useMemo(() => theme.vars, [theme])

  return (
    <div
      className="min-h-screen text-[var(--tc-muted)]"
      style={
        {
          "--tc-bg": themeVars["--tc-bg"],
          "--tc-primary": themeVars["--tc-primary"],
          "--tc-muted": themeVars["--tc-muted"],
          "--tc-caret": themeVars["--tc-caret"],
          "--tc-correct": themeVars["--tc-correct"],
          "--tc-incorrect": themeVars["--tc-incorrect"],
          background: "linear-gradient(180deg, var(--tc-bg), color-mix(in oklab, var(--tc-bg) 88%, black 12%))",
        } as React.CSSProperties
      }
    >
      <SiteHeader onOpenThemes={() => setOpenThemes(true)} />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--tc-primary)]">Typing Speed Test</h1>
          <p className="mt-1 text-sm">
            Start typing to begin the test. Switch between time and words modes. Press Esc to restart.
          </p>
        </div>
        <TypingTest mode={mode} duration={duration} wordsCount={wordsCount} onFinish={() => {}} />
      </main>

      <ThemePicker open={openThemes} onOpenChange={setOpenThemes} onApply={(t) => setTheme(t)} />
    </div>
  )
}
