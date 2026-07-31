import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { architectureConfig } from '../config';
import { useIsMobile } from '../hooks/use-mobile';

export default function CinematicVision() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const section = sectionRef.current;
    const text = textRef.current;
    if (!section || !text) return;

    gsap.set(text, { opacity: 0, y: 40 });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.to(text, {
              opacity: 1,
              y: 0,
              duration: 1.2,
              ease: 'power3.out',
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  // 移动端：进入视口才播放，移出暂停（节省流量 + 性能）
  useEffect(() => {
    if (!isMobile) return;
    const video = videoRef.current;
    if (!video) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) video.play().catch(() => {});
          else video.pause();
        });
      },
      { threshold: 0.3 }
    );
    io.observe(video);
    return () => io.disconnect();
  }, [isMobile]);

  if (!architectureConfig.sectionLabel && !architectureConfig.title) {
    return null;
  }

  return (
    <section
      id="cinematic"
      ref={sectionRef}
      style={{
        padding: 'clamp(60px, 12vw, 150px) 5vw clamp(30px, 6vw, 80px)',
        background: 'transparent',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        {architectureConfig.sectionLabel && (
          <div
            className="mb-6"
            style={{
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif",
              fontSize: 12,
              fontWeight: 300,
              letterSpacing: '3px',
              textTransform: 'uppercase',
              color: '#dadada',
              opacity: 0.6,
            }}
          >
            {architectureConfig.sectionLabel}
          </div>
        )}
        <div
          className="mb-16"
          style={{
            width: '100%',
            height: 1,
            background: 'rgba(255, 255, 255, 0.1)',
          }}
        />

        <div className="relative">
          {architectureConfig.videoPath && (
            <div
              className="relative overflow-hidden"
              style={{
                width: '100%',
                maxWidth: '100%',
                margin: '0 auto',
                aspectRatio: isMobile ? '16 / 9' : '21 / 9',
                borderRadius: isMobile ? 10 : 0,
              }}
            >
              <img
                src={architectureConfig.videoPath}
                alt={architectureConfig.title || '奥林匹斯山全景'}
                className="w-full h-full object-cover"
                style={{ display: 'block' }}
                loading="lazy"
              />
            </div>
          )}

          <div
            ref={textRef}
            className="flex flex-col md:flex-row md:items-center"
            style={{ marginTop: isMobile ? '32px' : 'clamp(48px, 12vw, 160px)', gap: isMobile ? '16px' : 'clamp(24px, 5vw, 60px)' }}
          >
            {architectureConfig.title && (
              <h2
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontWeight: 400,
              fontSize: isMobile ? 'clamp(24px, 6vw, 36px)' : 'clamp(32px, 4vw, 64px)',
              lineHeight: 1.15,
              letterSpacing: '-0.5px',
              color: '#ffffff',
              margin: 0,
              flex: '0 0 50%',
                  textWrap: 'balance',
                }}
              >
                {architectureConfig.title}
              </h2>
            )}
            {architectureConfig.description && (
              <p
                style={{
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif",
                  fontWeight: 200,
                fontSize: isMobile ? 13 : 17,
                lineHeight: isMobile ? 1.8 : 1.85,
                  color: '#dadada',
                  margin: 0,
                  flex: '1 1 50%',
                  textWrap: 'pretty',
                }}
              >
                {architectureConfig.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
