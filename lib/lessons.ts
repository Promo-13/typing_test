export type Lesson = {
  slug: string
  title: string
  description: string
  text: string
  level: "Beginner" | "Intermediate" | "Advanced"
}

export const LESSONS: Lesson[] = [
  {
    slug: "home-row-1",
    title: "Home Row Basics",
    level: "Beginner",
    description: "Introduce the home row keys: a s d f j k l ;",
    text: "asdf jkl; asdf jkl; asdf jkl; asdf jkl; as df jk l; asdf jkl; asdf jkl; asdf jkl; lake salad flask; ask dad; fall safe; a sad lad;",
  },
  {
    slug: "top-row",
    title: "Top Row Practice",
    level: "Beginner",
    description: "Practice q w e r t y u i o p with simple patterns.",
    text: "qwe rty yui op qwe rty uio p try wet yet you per tire type write rope quiet quip wire ripe type",
  },
  {
    slug: "numbers",
    title: "Numbers and Symbols",
    level: "Intermediate",
    description: "Numbers and common symbols for coding and data entry.",
    text: "123 456 7890 1 2 3 4 5 6 7 8 9 0 12 34 56 78 90 ( ) [ ] { } # $ % ^ & * + - = _ : ; , . /",
  },
  {
    slug: "punctuation",
    title: "Punctuation Flow",
    level: "Intermediate",
    description: "Practice commas, periods, apostrophes, and quotes.",
    text: "He said, 'it is fine.' Then, she replied: \"sure!\" It's easy, isn't it? Wait... really? yes, really.",
  },
  {
    slug: "code-lines",
    title: "Code Lines",
    level: "Advanced",
    description: "Mix of brackets, operators, and camelCase words.",
    text: "function add(a, b) { return a + b; } const userId = getUserId(); if (x !== null && y >= 0) { x++; y -= 1; }",
  },
]
