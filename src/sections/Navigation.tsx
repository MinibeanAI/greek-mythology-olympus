import { useEffect, useState } from 'react';
import { siteConfig, navigationConfig } from '../config';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!siteConfig.brandName && navigationConfig.links.length === 0) {
    return null;
  }

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between transition-colors duration-500"
      style={{
        height: 80,
        padding: '0 5vw',
        backgroundColor: scrolled ? 'rgba(8, 8, 22, 0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(8px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
      }}
    >
      <a
        href="#hero"
        onClick={(e) => handleClick(e, '#hero')}
        className="text-white no-underline"
        style={{
          fontFamily: "'GeistMono', monospace",
          fontSize: 18,
          fontWeight: 400,
          letterSpacing: '-0.5px',
        }}
      >
        {siteConfig.brandName}
      </a>

      <div className="hidden md:flex items-center" style={{ gap: 40 }}>
        {navigationConfig.links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            onClick={(e) => handleClick(e, link.href)}
            className="nav-link"
          >
            {link.label}
          </a>
        ))}
      </div>

      {navigationConfig.ctaText && (
        <a
          href="#footer"
          onClick={(e) => handleClick(e, '#footer')}
          className="nav-link hidden md:inline-block"
        >
          {navigationConfig.ctaText}
        </a>
      )}

      <button
        onClick={() => window.dispatchEvent(new CustomEvent('open-search'))}
        aria-label="搜索神祇与故事"
        className="flex items-center"
        style={{
          gap: 8, background: 'rgba(120, 110, 220, 0.12)',
          border: '1px solid rgba(160, 150, 240, 0.3)', borderRadius: 999,
          padding: '7px 16px', cursor: 'pointer',
          fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#cfc9f2',
          transition: 'background 0.3s ease',
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(120, 110, 220, 0.28)'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(120, 110, 220, 0.12)'; }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="7" />
          <line x1="16.5" y1="16.5" x2="21" y2="21" />
        </svg>
        <span className="hidden sm:inline">寻神</span>
      </button>
    </nav>
  );
}
