import { useMemo } from 'react';

// 宇宙星野背景：深空渐变 + 星云斑 + 闪烁星辰（纯 CSS/SVG，fixed 于所有内容之下）

function makeStars(count: number, seed: number) {
  let s = seed;
  const rand = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  return Array.from({ length: count }, (_, i) => ({
    left: rand() * 100,
    top: rand() * 100,
    size: rand() * 1.8 + 0.6,
    delay: (i % 23) * 0.41,
    dur: 2.6 + rand() * 3.4,
    opacity: 0.35 + rand() * 0.65,
  }));
}

export default function CosmicBackground() {
  const stars = useMemo(() => makeStars(typeof window !== 'undefined' && window.innerWidth < 768 ? 70 : 140, 7), []);

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        background:
          'radial-gradient(ellipse 120% 90% at 50% -10%, #12102e 0%, #0a0a20 45%, #05050e 100%)',
      }}
    >
      {/* 星云斑 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse 42% 30% at 18% 22%, rgba(104, 74, 199, 0.14), transparent 70%),
            radial-gradient(ellipse 38% 26% at 82% 14%, rgba(64, 110, 201, 0.12), transparent 70%),
            radial-gradient(ellipse 46% 32% at 74% 72%, rgba(140, 60, 160, 0.10), transparent 70%),
            radial-gradient(ellipse 36% 28% at 22% 82%, rgba(52, 96, 172, 0.10), transparent 70%),
            radial-gradient(ellipse 30% 22% at 50% 48%, rgba(90, 70, 180, 0.07), transparent 70%)
          `,
        }}
      />
      {/* 闪烁星辰 */}
      {stars.map((s, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            borderRadius: '50%',
            background: i % 9 === 0 ? 'rgba(190, 205, 255, 1)' : 'rgba(230, 230, 250, 0.95)',
            boxShadow: `0 0 ${s.size * 3}px rgba(180, 180, 255, 0.55)`,
            opacity: s.opacity,
            animation: `cosmicTwinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes cosmicTwinkle {
          0%, 100% { opacity: 0.15; transform: scale(0.8); }
          50% { opacity: 0.9; transform: scale(1.15); }
        }
      `}</style>
    </div>
  );
}
