export function domainOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

export function faviconOf(url: string): string | null {
  if (!url.startsWith('http')) return null
  return `https://www.google.com/s2/favicons?sz=64&domain=${domainOf(url)}`
}
