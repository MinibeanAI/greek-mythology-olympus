import { useEffect, useMemo, useRef, useState } from 'react';
import { SEARCH_INDEX, SELECT_GOD_EVENT, SELECT_STORY_EVENT } from './PantheonGraph';

// 全站搜索：寻神与寻故事。由导航的「寻神」按钮或快捷键 / 唤起。
interface Item { id: string; kind: 'god' | 'story'; title: string; latin: string; tag: string }

export default function SearchOverlay() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlight, setHighlight] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onOpen = () => { setOpen(true); setQuery(''); setHighlight(0); };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '/' && !open && !(e.target as HTMLElement)?.closest('input, textarea')) {
        e.preventDefault();
        onOpen();
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('open-search', onOpen);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('open-search', onOpen);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  useEffect(() => {
    if (open) window.setTimeout(() => inputRef.current?.focus(), 60);
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SEARCH_INDEX;
    return SEARCH_INDEX.filter((it) =>
      it.title.toLowerCase().includes(q) ||
      it.latin.toLowerCase().includes(q) ||
      it.tag.toLowerCase().includes(q)
    );
  }, [query]);

  useEffect(() => { setHighlight(0); }, [query]);

  const pick = (item: Item) => {
    setOpen(false);
    if (item.kind === 'god') {
      document.querySelector('#pantheon')?.scrollIntoView({ behavior: 'smooth' });
      window.setTimeout(() => {
        window.dispatchEvent(new CustomEvent(SELECT_GOD_EVENT, { detail: item.id }));
      }, 650);
    } else {
      document.querySelector('#pantheon')?.scrollIntoView({ behavior: 'smooth' });
      window.setTimeout(() => {
        window.dispatchEvent(new CustomEvent(SELECT_STORY_EVENT, { detail: item.id }));
      }, 650);
    }
  };

  if (!open) return null;

  return (
    <div
      onClick={() => setOpen(false)}
      style={{
        position: 'fixed', inset: 0, zIndex: 80,
        background: 'rgba(3, 3, 12, 0.66)',
        backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
        display: 'flex', justifyContent: 'center', paddingTop: '14vh',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(560px, 92vw)', height: 'fit-content', maxHeight: '64vh',
          background: 'linear-gradient(160deg, rgba(26, 22, 56, 0.97), rgba(10, 10, 26, 0.98))',
          border: '1px solid rgba(150, 170, 255, 0.24)', borderRadius: 14,
          boxShadow: '0 0 70px rgba(90, 80, 200, 0.28), 0 24px 50px rgba(0,0,0,0.5)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}
      >
        <div className="flex items-center" style={{ padding: '16px 20px', borderBottom: '1px solid rgba(150,170,255,0.14)', gap: 12 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9d92e8" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <line x1="16.5" y1="16.5" x2="21" y2="21" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') { e.preventDefault(); setHighlight((h) => Math.min(h + 1, results.length - 1)); }
              if (e.key === 'ArrowUp') { e.preventDefault(); setHighlight((h) => Math.max(h - 1, 0)); }
              if (e.key === 'Enter' && results[highlight]) pick(results[highlight]);
            }}
            placeholder="搜索神祇、故事或主题，如：雅典娜、勇气、奥德赛…"
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              fontFamily: "'Inter', sans-serif", fontSize: 15, color: '#eceaf8',
            }}
          />
          <span style={{ fontFamily: "'Fira Code', monospace", fontSize: 10, color: 'rgba(160,150,230,0.5)', border: '1px solid rgba(160,150,230,0.3)', borderRadius: 4, padding: '2px 6px' }}>
            ESC
          </span>
        </div>
        <div style={{ overflowY: 'auto' }}>
          {results.length === 0 && (
            <div style={{ padding: '28px 22px', fontFamily: "'Inter', sans-serif", fontSize: 13, color: 'rgba(200,196,235,0.6)' }}>
              星空中没有找到「{query}」——换个名字试试？
            </div>
          )}
          {results.map((it, i) => (
            <button
              key={`${it.kind}-${it.id}`}
              onClick={() => pick(it)}
              onMouseEnter={() => setHighlight(i)}
              className="flex items-center w-full text-left"
              style={{
                gap: 12, padding: '12px 20px', border: 'none', cursor: 'pointer',
                background: i === highlight ? 'rgba(120, 110, 220, 0.2)' : 'transparent',
                borderBottom: '1px solid rgba(150,170,255,0.07)',
              }}
            >
              <span style={{ fontSize: 10, color: it.kind === 'god' ? 'rgba(200,186,255,0.95)' : 'rgba(150,222,255,0.95)' }}>
                {it.kind === 'god' ? '★' : '✦'}
              </span>
              <span style={{ fontFamily: "'EB Garamond', serif", fontSize: 16, color: '#f0eefc' }}>
                {it.title}
              </span>
              <span style={{ fontFamily: "'Fira Code', monospace", fontSize: 10, letterSpacing: 1, color: 'rgba(165,150,230,0.6)' }}>
                {it.latin}
              </span>
              <span style={{ marginLeft: 'auto', fontFamily: "'Inter', sans-serif", fontSize: 11, color: 'rgba(180,200,255,0.5)' }}>
                {it.kind === 'god' ? '神祇' : '故事'} · {it.tag}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
