"use client"

import type React from "react"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RotateCcw, Timer, Target, BarChart2 } from "lucide-react"

type Mode = "time" | "words"

const COMMON_WORDS = [
  "time",
  "year",
  "people",
  "way",
  "day",
  "man",
  "thing",
  "woman",
  "life",
  "child",
  "world",
  "school",
  "state",
  "family",
  "student",
  "group",
  "country",
  "problem",
  "hand",
  "place",
  "case",
  "week",
  "company",
  "system",
  "program",
  "question",
  "work",
  "government",
  "number",
  "night",
  "point",
  "home",
  "water",
  "room",
  "mother",
  "area",
  "money",
  "story",
  "fact",
  "month",
  "lot",
  "right",
  "study",
  "book",
  "eye",
  "job",
  "word",
  "business",
  "issue",
  "side",
  "kind",
  "head",
  "house",
  "service",
  "friend",
  "father",
  "power",
  "hour",
  "game",
  "line",
  "end",
  "member",
  "law",
  "car",
  "city",
  "community",
  "name",
  "president",
  "team",
  "minute",
  "idea",
  "kid",
  "body",
  "information",
  "back",
  "parent",
  "face",
  "others",
  "level",
  "office",
  "door",
  "health",
  "person",
  "art",
  "war",
  "history",
  "party",
  "result",
  "change",
  "morning",
  "reason",
  "research",
  "girl",
  "guy",
  "moment",
  "air",
  "teacher",
  "force",
  "education",
]

function generateWords(count: number) {
  const words: string[] = []
  for (let i = 0; i < count; i++) {
    const w = COMMON_WORDS[Math.floor(Math.random() * COMMON_WORDS.length)]
    words.push(w)
  }
  return words.join(" ")
}

function splitChars(text: string) {
  // Normalize multiple spaces to single space and ensure trailing space for flow
  return text.replace(/\s+/g, " ").trim() + " "
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

export type TypingTestProps = {
  mode?: Mode
  duration?: number // seconds, if mode=time
  wordsCount?: number // if mode=words
  text?: string // if provided, overrides generation
  onFinish?: (stats: Stats) => void
}

export type Stats = {
  wpm: number
  rawWpm: number
  accuracy: number
  correct: number
  incorrect: number
  elapsed: number
}

export default function TypingTest({ mode = "time", duration = 30, wordsCount = 50, text, onFinish }: TypingTestProps) {
  const displayText = useMemo(() => {
    if (text && text.length > 0) return splitChars(text)
    if (mode === "words") return splitChars(generateWords(wordsCount))
    // time mode: generate a generous pool
    return splitChars(generateWords(400))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, mode, wordsCount])

  const chars = useMemo(() => displayText.split(""), [displayText])

  const [started, setStarted] = useState(false)
  const [finished, setFinished] = useState(false)
  const [index, setIndex] = useState(0)
  const [typed, setTyped] = useState<string[]>([])
  const [incorrectSet, setIncorrectSet] = useState<Set<number>>(new Set())
  const [startTime, setStartTime] = useState<number | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [countdown, setCountdown] = useState(duration)

  const containerRef = useRef<HTMLDivElement>(null)
  const focusTargetRef = useRef<HTMLDivElement>(null)

  const reset = useCallback(() => {
    setStarted(false)
    setFinished(false)
    setIndex(0)
    setTyped([])
    setIncorrectSet(new Set())
    setStartTime(null)
    setElapsed(0)
    setCountdown(duration)
    // refocus
    setTimeout(() => {
      focusTargetRef.current?.focus()
    }, 0)
  }, [duration])

  // Timer
  useEffect(() => {
    if (!started || finished) return
    const tick = () => {
      const now = performance.now()
      if (startTime == null) return
      const ms = now - startTime
      const s = ms / 1000
      setElapsed(s)
      if (mode === "time") {
        const rem = clamp(duration - s, 0, duration)
        setCountdown(rem)
        if (rem <= 0.0001) {
          setFinished(true)
        }
      } else {
        // words mode ends when text fully typed
        if (index >= chars.length - 1) {
          setFinished(true)
        }
      }
    }
    const id = window.setInterval(tick, 100)
    return () => clearInterval(id)
  }, [started, finished, startTime, mode, duration, index, chars.length])

  // Auto scroll current char into view
  useEffect(() => {
    const el = containerRef.current?.querySelector(`[data-idx="${index}"]`)
    if (el) {
      ;(el as HTMLElement).scrollIntoView({ block: "center", inline: "start", behavior: "smooth" })
    }
  }, [index])

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (finished) {
      if (e.key === "Enter") {
        e.preventDefault()
        reset()
      }
      return
    }

    if (!started) {
      // start on first valid key
      if (e.key.length === 1 || e.key === "Backspace" || e.key === " ") {
        setStarted(true)
        setStartTime(performance.now())
      }
    }

    if (e.key === "Tab") {
      e.preventDefault()
      return
    }

    if (e.key === "Escape") {
      e.preventDefault()
      reset()
      return
    }

    if (e.key === "Backspace") {
      e.preventDefault()
      if (index === 0) return
      const newIdx = index - 1
      setIndex(newIdx)
      setTyped((t) => {
        const nt = t.slice(0, -1)
        return nt
      })
      setIncorrectSet((s) => {
        const ns = new Set(s)
        ns.delete(newIdx)
        return ns
      })
      return
    }

    if (e.key.length === 1 || e.key === " ") {
      e.preventDefault()
      const current = chars[index]
      const pressed = e.key === "Enter" ? "\n" : e.key
      const isCorrect = pressed === current
      setTyped((t) => [...t, pressed])
      setIncorrectSet((s) => {
        const ns = new Set(s)
        if (!isCorrect) ns.add(index)
        return ns
      })
      const nextIdx = index + 1
      setIndex(nextIdx)

      if (mode === "words") {
        if (nextIdx >= chars.length) {
          // reached end, finish now
          setFinished(true)
        }
      }
    }
  }

  // Stats
  const typedCount = typed.length
  const incorrect = incorrectSet.size
  const correct = Math.max(typedCount - incorrect, 0)
  const minutes = Math.max(elapsed / 60, 1 / 60) // avoid div by zero
  const wpm = Math.max(Math.round(correct / 5 / minutes), 0)
  const rawWpm = Math.max(Math.round(typedCount / 5 / minutes), 0)
  const accuracy = typedCount > 0 ? Math.round((correct / typedCount) * 100) : 100

  useEffect(() => {
    if (finished) {
      onFinish?.({
        wpm,
        rawWpm,
        accuracy,
        correct,
        incorrect,
        elapsed,
      })
      // focus to allow Enter to restart
      focusTargetRef.current?.focus()
    }
  }, [finished, wpm, rawWpm, accuracy, correct, incorrect, elapsed, onFinish])

  return (
    <Card className="border-none bg-transparent shadow-none">
      <CardContent className="p-0">
        <div
          className="mx-auto mt-4 w-full max-w-5xl rounded-xl p-4 sm:p-6"
          style={
            {
              background: "color-mix(in oklab, var(--tc-bg) 94%, black 6%)",
            } as React.CSSProperties
          }
        >
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="inline-flex items-center gap-1 rounded-md border border-[var(--tc-caret)] px-2 py-1 text-[var(--tc-primary)]">
                <Timer className="h-4 w-4" />
                {mode === "time" ? `${Math.ceil(countdown)}s` : "Words"}
              </div>
              <div className="inline-flex items-center gap-1 rounded-md border border-[var(--tc-caret)] px-2 py-1 text-[var(--tc-primary)]">
                <BarChart2 className="h-4 w-4" />
                {wpm} WPM
              </div>
              <div className="inline-flex items-center gap-1 rounded-md border border-[var(--tc-caret)] px-2 py-1 text-[var(--tc-primary)]">
                <Target className="h-4 w-4" />
                {accuracy}% Acc
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={reset}
                className="gap-2 bg-transparent border-[var(--tc-caret)] text-white"
              >
                <RotateCcw className="h-4 w-4" />
                Restart
              </Button>
            </div>
          </div>

          {/* Controls */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {/* Mode toggle */}
            <div className="flex items-center overflow-hidden rounded-md border border-[var(--tc-caret)]">
              <button
                className={`px-3 py-1.5 text-sm transition ${
                  mode === "time" ? "bg-[var(--tc-primary)] text-black" : "text-[var(--tc-primary)] hover:text-white"
                }`}
                onClick={() => {
                  if (mode !== "time") {
                    ;(window as any).__setMode?.("time")
                  }
                }}
              >
                Time
              </button>
              <button
                className={`px-3 py-1.5 text-sm transition ${
                  mode === "words" ? "bg-[var(--tc-primary)] text-black" : "text-[var(--tc-primary)] hover:text-white"
                }`}
                onClick={() => {
                  if (mode !== "words") {
                    ;(window as any).__setMode?.("words")
                  }
                }}
              >
                Words
              </button>
            </div>
            {/* Presets (time or words) */}
            <PresetPicker mode={mode} duration={duration} wordsCount={wordsCount} />
          </div>

          {/* Typing area */}
          <div className="relative">
            {/* Focus trap */}
            <div
              ref={focusTargetRef}
              role="textbox"
              aria-label="Typing test input area. Start typing to begin."
              tabIndex={0}
              onKeyDown={onKeyDown}
              className="sr-only"
            />
            <button
              onClick={() => focusTargetRef.current?.focus()}
              className="mb-3 rounded-md border border-dashed px-3 py-1 text-xs text-[var(--tc-muted)] hover:border-[var(--tc-primary)] hover:text-[var(--tc-primary)]"
            >
              Click here or press any key to start. Press Esc to restart.
            </button>

            <div
              ref={containerRef}
              // Show ~3 lines at a time; allow vertical scroll for more
              className="h-[9.5rem] sm:h-[10.5rem] overflow-y-auto rounded-lg border border-[var(--tc-caret)] bg-[var(--tc-bg)] p-4 sm:p-6"
              style={{ scrollbarColor: "var(--tc-caret) transparent" } as React.CSSProperties}
              onClick={() => focusTargetRef.current?.focus()}
            >
              <div
                className="font-mono text-[22px] sm:text-[26px] leading-[2.2rem] sm:leading-[2.4rem] whitespace-pre-wrap"
                style={{ color: "var(--tc-muted)" } as React.CSSProperties}
              >
                {chars.map((ch, i) => {
                  const typedCh = typed[i]
                  const isCurrent = i === index && !finished
                  const isCorrect = typedCh != null && typedCh === chars[i]
                  const isIncorrect = typedCh != null && typedCh !== chars[i]
                  return (
                    <span
                      key={i}
                      data-idx={i}
                      className={[
                        "relative rounded-sm",
                        isCorrect ? "text-[var(--tc-correct)]" : "",
                        isIncorrect ? "text-[var(--tc-incorrect)]" : "",
                        isCurrent ? "bg-[var(--tc-caret)] text-[var(--tc-primary)]" : "",
                      ].join(" ")}
                    >
                      {ch}
                    </span>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Results overlay */}
          {finished && (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatTile label="WPM" value={wpm} />
              <StatTile label="Raw WPM" value={rawWpm} />
              <StatTile label="Accuracy" value={`${accuracy}%`} />
              <StatTile label="Errors" value={incorrect} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function StatTile({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border border-[var(--tc-caret)] bg-[var(--tc-bg)] p-3 text-center">
      <div className="text-xs uppercase tracking-wide text-[var(--tc-muted)]">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-[var(--tc-primary)]">{value}</div>
    </div>
  )
}

function PresetPicker({ mode, duration, wordsCount }: { mode: Mode; duration: number; wordsCount: number }) {
  const setDuration = (v: number) => (window as any).__setDuration?.(v)
  const setWords = (v: number) => (window as any).__setWords?.(v)
  const btn = (label: string, active: boolean, onClick: () => void) => (
    <button
      key={label}
      onClick={onClick}
      className={`rounded-md border px-2.5 py-1 text-sm transition ${
        active
          ? "border-[var(--tc-primary)] text-[var(--tc-primary)]"
          : "border-[var(--tc-caret)] text-[var(--tc-muted)] hover:text-[var(--tc-primary)] hover:border-[var(--tc-primary)]"
      }`}
    >
      {label}
    </button>
  )

  return (
    <div className="flex items-center gap-2">
      {mode === "time" ? (
        <>
          {btn("15s", duration === 15, () => setDuration(15))}
          {btn("30s", duration === 30, () => setDuration(30))}
          {btn("60s", duration === 60, () => setDuration(60))}
        </>
      ) : (
        <>
          {btn("25", wordsCount === 25, () => setWords(25))}
          {btn("50", wordsCount === 50, () => setWords(50))}
          {btn("100", wordsCount === 100, () => setWords(100))}
        </>
      )}
    </div>
  )
}
