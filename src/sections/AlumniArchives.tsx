import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { researchConfig } from '../config';
import { SELECT_GOD_EVENT } from './PantheonGraph';
import { useIsMobile } from '../hooks/use-mobile';

function flyToGod(godId?: string) {
  if (!godId) return;
  document.querySelector('#pantheon')?.scrollIntoView({ behavior: 'smooth' });
  // 等滚动落位后再点亮节点
  window.setTimeout(() => {
    window.dispatchEvent(new CustomEvent(SELECT_GOD_EVENT, { detail: godId }));
  }, 650);
}

export default function AlumniArchives() {
  const gridRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isMobile = useIsMobile();

  useEffect(() => {
    const items = itemRefs.current.filter(Boolean) as HTMLDivElement[];

    items.forEach((item) => {
      gsap.set(item, { opacity: 0, y: 30 });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = items.indexOf(entry.target as HTMLDivElement);
            gsap.to(entry.target, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              delay: (idx % 4) * 0.1,
              ease: 'power2.out',
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  if (!researchConfig.sectionLabel && researchConfig.projects.length === 0) {
    return null;
  }

  return (
    <section
      id="alumni"
      style={{
        padding: 'clamp(60px, 12vw, 150px) 5vw',
        background: 'transparent',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        {researchConfig.sectionLabel && (
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
            {researchConfig.sectionLabel}
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

        <div
          ref={gridRef}
          className="grid grid-cols-2 md:grid-cols-4"
          style={{ gap: isMobile ? 10 : 0 }}
        >
          {researchConfig.projects.map((project, i) => (
            <div
              key={`${project.title}-${i}`}
              ref={(el) => { itemRefs.current[i] = el; }}
              className="group cursor-pointer"
              onClick={() => flyToGod(project.godId)}
              role={project.godId ? 'button' : undefined}
              aria-label={project.godId ? `在诸神星图中查看${project.title}` : undefined}
              style={{
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                borderRight: (i + 1) % (isMobile ? 2 : 4) !== 0 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                padding: isMobile ? '12px 10px' : '24px 20px',
              }}
            >
              <div
                className="relative overflow-hidden mb-3"
                style={{ aspectRatio: '1/1', borderRadius: isMobile ? 6 : 0, overflow: 'hidden' }}
              >
                {project.image && (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-all duration-700"
                    style={{
                      opacity: 0.7,
                      filter: 'grayscale(60%)',
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLImageElement).style.opacity = '1';
                      (e.target as HTMLImageElement).style.filter = 'grayscale(0%)';
                      (e.target as HTMLImageElement).style.transform = 'scale(1.04)';
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLImageElement).style.opacity = '0.7';
                      (e.target as HTMLImageElement).style.filter = 'grayscale(60%)';
                      (e.target as HTMLImageElement).style.transform = 'scale(1)';
                    }}
                    loading="lazy"
                  />
                )}
              </div>
              <h4
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontWeight: 400,
                  fontSize: isMobile ? 13 : 18,
                  color: '#ffffff',
                  margin: '0 0 3px 0',
                  lineHeight: 1.25,
                  // 防止长中文换行截断
                  wordBreak: 'keep-all',
                  overflowWrap: 'break-word',
                }}
              >
                {project.title}
              </h4>
              <div
                className="flex items-center justify-between"
                style={{ gap: 6 }}
              >
                <span
                  style={{
                    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif",
                    fontWeight: 200,
                    fontSize: isMobile ? 10.5 : 12,
                    color: '#dadada',
                    opacity: 0.6,
                    flex: '1 1 auto',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {project.discipline}
                </span>
                <span
                  style={{
                    fontFamily: "'SF Mono', Menlo, Consolas, monospace",
                    fontWeight: 400,
                    fontSize: isMobile ? 9 : 11,
                    color: '#dadada',
                    opacity: 0.4,
                    flex: '0 0 auto',
                    letterSpacing: 0.5,
                  }}
                >
                  {project.year}
                </span>
              </div>
              {project.godId && (
                <div
                  className="md:opacity-0 md:group-hover:opacity-80 transition-opacity duration-500"
                  style={{
                    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif",
                    fontSize: isMobile ? 10 : 11,
                    color: 'rgba(160, 190, 255, 1)',
                    marginTop: isMobile ? 4 : 6,
                    letterSpacing: '1px',
                    opacity: isMobile ? 0.55 : 0.6,
                  }}
                >
                  ✦ 点击前往星图
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
