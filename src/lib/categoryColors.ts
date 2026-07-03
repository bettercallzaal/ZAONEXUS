export const CATEGORY_COLORS: Record<string, string> = {
  'The ZAO': '#f5a623',
  'Community Projects': '#2dd4bf',
  'ZAO Members': '#f472b6',
  'Ecosystem & Tokens': '#818cf8',
  'ZAO Festivals': '#c084fc',
  'ZAO OS': '#34d399',
  'Agents & Bots': '#fb923c',
  'ZAO Onchain': '#38bdf8',
  'ZAO Stock': '#fb7185',
}

const FALLBACK = '#f5a623'

export function colorForCategory(category: string): string {
  return CATEGORY_COLORS[category] ?? FALLBACK
}
