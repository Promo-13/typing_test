"use client"

import type React from "react"

import { notFound, useParams } from "next/navigation"
import { LESSONS } from "@/lib/lessons"
import TypingTest from "@/components/typing-test"
import { DEFAULT_THEME, type Theme } from "@/lib/themes"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useEffect, useMemo, useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { ThemePicker } from "@/components/theme-picker"

export default function Page() {
  const params = useParams<{ slug: string }>()
  const lesson = useMemo(() => LESSONS.find((l) => l.slug === params.slug), [params.slug])
  const [theme, setTheme] = useLocalStorage<Theme>("tc-theme", DEFAULT_THEME)
  const [openThemes, setOpenThemes] = useState(false)

  useEffect(() => {
    if (!lesson) notFound()
  }, [lesson])

  if (!lesson) return null

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
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--tc-primary)]">{lesson.title}</h1>
          <p className="mt-1 text-sm">{lesson.description}</p>
        </div>
        <TypingTest mode="words" wordsCount={lesson.text.split(/\s+/).length} text={lesson.text} />
      </main>

      <ThemePicker open={openThemes} onOpenChange={setOpenThemes} onApply={(t) => setTheme(t)} />
    </div>
  )
}
