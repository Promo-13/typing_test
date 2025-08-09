"use client"

import type React from "react"

import Link from "next/link"
import { LESSONS } from "@/lib/lessons"
import { DEFAULT_THEME, type Theme } from "@/lib/themes"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { SiteHeader } from "@/components/site-header"
import { ThemePicker } from "@/components/theme-picker"
import { Button } from "@/components/ui/button"

export default function Page() {
  const [theme, setTheme] = useLocalStorage<Theme>("tc-theme", DEFAULT_THEME)
  const [openThemes, setOpenThemes] = useLocalStorage<boolean>("tc-theme-open", false)

  return (
    <div
      className="min-h-screen text-[var(--tc-muted)]"
      style={
        {
          "--tc-bg": theme.vars["--tc-bg"],
          "--tc-primary": theme.vars["--tc-primary"],
          "--tc-muted": theme.vars["--tc-muted"],
          "--tc-caret": theme.vars["--tc-caret"],
          "--tc-correct": theme.vars["--tc-correct"],
          "--tc-incorrect": theme.vars["--tc-incorrect"],
          background: "linear-gradient(180deg, var(--tc-bg), color-mix(in oklab, var(--tc-bg) 88%, black 12%))",
        } as React.CSSProperties
      }
    >
      <SiteHeader onOpenThemes={() => setOpenThemes(true)} />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--tc-primary)]">Typing Lessons</h1>
        <p className="mt-1 text-sm">Choose a lesson to practice targeted keys and patterns.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {LESSONS.map((l) => (
            <Link
              key={l.slug}
              href={`/lessons/${l.slug}`}
              className="group rounded-lg border border-[var(--tc-caret)] bg-[var(--tc-bg)] p-4 transition hover:border-[var(--tc-primary)]"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-[var(--tc-primary)]">{l.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm">{l.description}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0 bg-transparent border-[var(--tc-caret)] text-white"
                >
                  Start
                </Button>
              </div>
              <div className="mt-3 text-xs">{l.level}</div>
            </Link>
          ))}
        </div>
      </main>

      <ThemePicker open={!!openThemes} onOpenChange={setOpenThemes as any} onApply={(t) => setTheme(t)} />
    </div>
  )
}
