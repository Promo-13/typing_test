export type ThemeVars = {
  "--tc-bg": string
  "--tc-primary": string
  "--tc-muted": string
  "--tc-caret": string
  "--tc-correct": string
  "--tc-incorrect": string
}

export type Theme = {
  id: string
  name: string
  vars: ThemeVars
  preview: string[]
}

export const THEMES: Theme[] = [
  {
    id: "aurora",
    name: "Aurora",
    vars: {
      "--tc-bg": "#0b1220",
      "--tc-primary": "#00e5b0",
      "--tc-muted": "#6b7280",
      "--tc-caret": "#1f2937",
      "--tc-correct": "#34d399",
      "--tc-incorrect": "#ff6b6b",
    },
    preview: ["#0b1220", "#00e5b0", "#34d399"],
  },
  {
    id: "sunset",
    name: "Sunset",
    vars: {
      "--tc-bg": "#1a1412",
      "--tc-primary": "#ff9f1a",
      "--tc-muted": "#7c6f66",
      "--tc-caret": "#2b211e",
      "--tc-correct": "#ffd166",
      "--tc-incorrect": "#ef476f",
    },
    preview: ["#1a1412", "#ff9f1a", "#ffd166"],
  },
  {
    id: "grape",
    name: "Grape",
    vars: {
      "--tc-bg": "#151126",
      "--tc-primary": "#a78bfa",
      "--tc-muted": "#7c7a8c",
      "--tc-caret": "#241c3a",
      "--tc-correct": "#c4b5fd",
      "--tc-incorrect": "#fb7185",
    },
    preview: ["#151126", "#a78bfa", "#c4b5fd"],
  },
  {
    id: "lime",
    name: "Lime",
    vars: {
      "--tc-bg": "#101710",
      "--tc-primary": "#a3e635",
      "--tc-muted": "#6b7a6b",
      "--tc-caret": "#1a241a",
      "--tc-correct": "#bef264",
      "--tc-incorrect": "#f87171",
    },
    preview: ["#101710", "#a3e635", "#bef264"],
  },
  {
    id: "slate",
    name: "Slate",
    vars: {
      "--tc-bg": "#0f172a",
      "--tc-primary": "#94a3b8",
      "--tc-muted": "#64748b",
      "--tc-caret": "#1e293b",
      "--tc-correct": "#cbd5e1",
      "--tc-incorrect": "#f87171",
    },
    preview: ["#0f172a", "#94a3b8", "#cbd5e1"],
  },
  {
    id: "flamingo",
    name: "Flamingo",
    vars: {
      "--tc-bg": "#1d1417",
      "--tc-primary": "#f472b6",
      "--tc-muted": "#8a6b75",
      "--tc-caret": "#2a1d22",
      "--tc-correct": "#f9a8d4",
      "--tc-incorrect": "#fb7185",
    },
    preview: ["#1d1417", "#f472b6", "#f9a8d4"],
  },
]

export const DEFAULT_THEME = THEMES[0]
