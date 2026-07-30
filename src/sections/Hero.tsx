import { useRef, useEffect, useState } from 'react';
import AmberCascades from './AmberCascades';
import LiquidGlassButton from '../components/LiquidGlassButton';
import { heroConfig } from '../config';
import { useIsMobile } from '../hooks/use-mobile';

export default function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [titleWidth, setTitleWidth] = useState<number>(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    const measure = () => {
      if (titleRef.current) setTitleWidth(titleRef.current.offsetWidth);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  if (!heroConfig.title) {
    return null;
  }

  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden"
      style={{ height: '100vh' }}
    >
      <AmberCascades />
      <div
        className="relative z-10 flex flex-col justify-between pointer-events-none"
        style={{
          height: '100%',
          padding: isMobile
            ? '14vh 5vw 6vh'
            : 'clamp(16vh, 22vw, 28vh) 5vw clamp(5vh, 6vw, 8vh)',
        }}
      >
        <div>
          <h1
            ref={titleRef}
            className="text-white"
            style={{
              fontFamily: "'GeistMono', monospace",
              fontWeight: 400,
              fontSize: isMobile ? 'clamp(32px, 9vw, 48px)' : 'clamp(36px, 6vw, 96px)',
              lineHeight: 1.0,
              letterSpacing: isMobile ? '-1px' : 'clamp(-1px, -0.3vw, -3px)',
              textShadow: '0 4px 24px rgba(0,0,0,0.8)',
              marginBottom: 'clamp(32px, 4vw, 56px)',
              width: 'fit-content',
            }}
          >
            {heroConfig.title}
          </h1>
          {heroConfig.subtitleLine1 && (
            <p
              style={{
                fontFamily: "'GeistMono', monospace",
                fontWeight: 200,
              fontSize: isMobile ? 14 : 'clamp(15px, 1.5vw, 22px)',
              lineHeight: 1.7,
              letterSpacing: '-0.3px',
              color: '#ffffff',
              margin: '0 0 12px 0',
              width: isMobile ? '100%' : (titleWidth || 'auto'),
              maxWidth: '100%',
              textShadow: '0 2px 12px rgba(0,0,0,0.6)',
              }}
            >
              {heroConfig.subtitleLine1}
            </p>
          )}
          {heroConfig.subtitleLine2 && (
            <p
              style={{
                fontFamily: "'GeistMono', monospace",
                fontWeight: 200,
              fontSize: isMobile ? 14 : 'clamp(15px, 1.5vw, 22px)',
              lineHeight: 1.7,
              letterSpacing: '-0.3px',
              color: '#ffffff',
              margin: 0,
              width: isMobile ? '100%' : (titleWidth || 'auto'),
              maxWidth: '100%',
              textShadow: '0 2px 12px rgba(0,0,0,0.6)',
              }}
            >
              {heroConfig.subtitleLine2}
            </p>
          )}
        </div>

        {heroConfig.ctaText && (
          <div style={{ display: 'flex', justifyContent: 'center' }} className="pointer-events-auto">
            <LiquidGlassButton
              onClick={() => {
                document.querySelector('#curriculum')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {heroConfig.ctaText}
            </LiquidGlassButton>
          </div>
        )}
      </div>
    </section>
  );
}
