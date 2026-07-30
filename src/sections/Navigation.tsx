import { useEffect, useState } from 'react';
import { siteConfig, navigationConfig } from '../config';
import { useIsMobile } from '../hooks/use-mobile';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 关闭菜单时也要平滑滚动
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!siteConfig.brandName && navigationConfig.links.length === 0) {
    return null;
  }

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between transition-colors duration-500"
        style={{
          height: 'clamp(56px, 11vw, 80px)',
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
            fontSize: isMobile ? 15 : 18,
            fontWeight: 400,
            letterSpacing: '-0.5px',
          }}
        >
          {siteConfig.brandName}
        </a>

        {/* 桌面导航 */}
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

        {/* 右侧：搜索 + 汉堡 */}
        <div className="flex items-center" style={{ gap: 12 }}>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-search'))}
            aria-label="搜索神祇与故事"
            className="flex items-center"
            style={{
              gap: 6, background: 'rgba(120, 110, 220, 0.12)',
              border: '1px solid rgba(160, 150, 240, 0.3)', borderRadius: 999,
              padding: isMobile ? '6px 10px' : '7px 16px', cursor: 'pointer',
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif", fontSize: isMobile ? 12 : 13, color: '#cfc9f2',
              transition: 'background 0.3s ease',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(120, 110, 220, 0.28)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(120, 110, 220, 0.12)'; }}
          >
            <svg width={isMobile ? 14 : 14} height={isMobile ? 14 : 14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <line x1="16.5" y1="16.5" x2="21" y2="21" />
            </svg>
            <span className={isMobile ? 'hidden' : 'hidden sm:inline'}>寻神</span>
          </button>

          {/* 汉堡菜单按钮（仅移动端显示） */}
          <button
            className="md:hidden flex items-center justify-center"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="打开导航菜单"
            style={{
              width: 40, height: 40,
              background: menuOpen ? 'rgba(120, 110, 220, 0.2)' : 'transparent',
              border: '1px solid rgba(160, 150, 240, 0.3)',
              borderRadius: 8, cursor: 'pointer', color: '#cfc9f2',
              transition: 'background 0.3s ease',
            }}
          >
            {menuOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="18" y1="6" x2="6" y2="18" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* 移动端下拉菜单 */}
      {menuOpen && (
        <div
          className="md:hidden fixed left-0 right-0 z-40"
          style={{
            top: 'clamp(56px, 11vw, 80px)',
            background: 'rgba(8, 8, 22, 0.97)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '24px 5vw',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          {navigationConfig.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleClick(e, link.href)}
              className="nav-link"
              style={{
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif",
                fontSize: 16,
                fontWeight: 300,
                letterSpacing: '0.5px',
                color: '#cfc9f2',
                textDecoration: 'none',
                transition: 'color 0.3s',
              }}
            >
              {link.label}
            </a>
          ))}
          {navigationConfig.ctaText && (
            <a
              href="#footer"
              onClick={(e) => handleClick(e, '#footer')}
              style={{
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif",
                fontSize: 16,
                fontWeight: 300,
                letterSpacing: '0.5px',
                color: '#cfc9f2',
                textDecoration: 'none',
              }}
            >
              {navigationConfig.ctaText}
            </a>
          )}
        </div>
      )}
    </>
  );
}
