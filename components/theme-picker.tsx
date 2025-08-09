"use client"

import { useEffect } from "react"
import { THEMES, type Theme, DEFAULT_THEME } from "@/lib/themes"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function ThemePicker({
  open,
  onOpenChange,
  onApply,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onApply?: (theme: Theme) => void
}) {
  const [selected, setSelected] = useLocalStorage<Theme>("tc-theme", DEFAULT_THEME)

  useEffect(() => {
    onApply?.(selected)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Choose a theme</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {THEMES.map((t) => {
            const isActive = t.id === selected.id
            return (
              <button
                key={t.id}
                onClick={() => setSelected(t)}
                className={`group relative flex min-w-0 items-center gap-3 overflow-hidden rounded-lg border p-3 transition hover:shadow-sm ${
                  isActive ? "border-foreground" : "border-border"
                }`}
                aria-pressed={isActive}
              >
                <div className="flex items-center gap-1.5 shrink-0">
                  {t.preview.map((c, i) => (
                    <span key={i} className="h-6 w-6 rounded-md border" style={{ backgroundColor: c }} aria-hidden />
                  ))}
                </div>
                <div className="min-w-0 text-left">
                  <div className="text-sm font-medium break-words">{t.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{t.id}</div>
                </div>
              </button>
            )
          })}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onApply?.(selected)
              onOpenChange(false)
            }}
          >
            Apply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
