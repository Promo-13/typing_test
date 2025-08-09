"use client"

import Link from "next/link"
import { Palette, BookOpenText, Keyboard } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SiteHeader({
  onOpenThemes,
}: {
  onOpenThemes?: () => void
}) {
  return (
    <header className="w-full border-b border-[var(--tc-caret)]">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-[var(--tc-primary)] transition-colors">
          <Keyboard className="h-5 w-5" />
          <span className="tracking-tight">TypeClone</span>
        </Link>
        <nav className="flex items-center gap-2">
          <Link
            href="/lessons"
            className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm text-[var(--tc-muted)] hover:text-[var(--tc-primary)]"
          >
            <BookOpenText className="h-4 w-4" />
            <span className="hidden sm:inline">Lessons</span>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenThemes?.()}
            className="inline-flex items-center gap-2 border-[var(--tc-caret)] bg-transparent text-[var(--tc-primary)] transition-colors hover:bg-[var(--tc-caret)] hover:text-white"
          >
            <Palette className="h-4 w-4" />
            Themes
          </Button>
        </nav>
      </div>
    </header>
  )
}
