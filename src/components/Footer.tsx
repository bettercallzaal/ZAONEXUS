import { Github, Mail, Twitter } from 'lucide-react'
import zaoLogo from '../assets/thezao-logo.jpg'

const PLATFORMS = [
  { label: 'ZAO OS App', href: 'https://zaoos.vercel.app' },
  { label: 'ZAOstock Festival', href: 'https://zaostock.com' },
  { label: 'ZABAL Gamez', href: 'https://zabal.games' },
]

export function Footer() {
  return (
    <footer className="mt-24 border-t border-[var(--card-border)]">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2.5 font-semibold">
            <img
              src={zaoLogo}
              alt="The ZAO"
              className="h-9 w-9 rounded-full shadow-[0_0_20px_rgba(245,166,35,0.3)] ring-1 ring-gold/30"
            />
            ZAO NEXUS
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted">
            The living directory for The ZAO — a decentralized impact network of artists,
            builders, and supporters.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gold">Companion Platforms</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {PLATFORMS.map((p) => (
              <li key={p.href}>
                <a href={p.href} target="_blank" rel="noreferrer" className="transition-colors hover:text-gold">
                  {p.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gold">Get Involved</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>
              <a
                href="mailto:info@thezao.com"
                className="flex items-center gap-2 transition-colors hover:text-gold"
              >
                <Mail size={14} /> info@thezao.com
              </a>
            </li>
            <li>
              <a
                href="https://twitter.com/thezaoofficial"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 transition-colors hover:text-gold"
              >
                <Twitter size={14} /> Message us on X
              </a>
            </li>
            <li>
              <a
                href="https://github.com/thezao"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 transition-colors hover:text-gold"
              >
                <Github size={14} /> Suggest a link
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[var(--card-border)] py-6 text-center text-xs text-faint">
        Built by the community, for the community. ZAO NEXUS &copy; {new Date().getFullYear() || 2026}.
      </div>
    </footer>
  )
}
