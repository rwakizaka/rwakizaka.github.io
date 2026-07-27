/** `user@example.com` -> `user [at] example.com`, to slow down naive scrapers. */
export function obfuscateEmail(email: string): string {
  const at = email.lastIndexOf('@')
  if (at < 0) return email
  return `${email.slice(0, at)} [at] ${email.slice(at + 1)}`
}

const DATE_FORMAT = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
})

const MONTH_FORMAT = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  timeZone: 'UTC',
})

/** Formats a blog post date, e.g. `Jul 28, 2026`. */
export function formatDate(date: Date): string {
  return DATE_FORMAT.format(date)
}

/** Formats a news `YYYY-MM` or `YYYY-MM-DD` string, e.g. `Apr 2025`. */
export function formatNewsDate(date: string): string {
  const parts = date.split('-').map(Number)
  const [year, month, day] = parts
  const value = new Date(Date.UTC(year!, (month ?? 1) - 1, day ?? 1))
  return day === undefined ? MONTH_FORMAT.format(value) : DATE_FORMAT.format(value)
}
