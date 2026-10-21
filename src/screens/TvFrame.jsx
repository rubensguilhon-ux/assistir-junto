import { useLayoutEffect, useRef, useState } from 'react';

// Palco da TV: sempre 1920 × 1080, escalado para caber na largura disponível.
export default function TvFrame({ label, children }) {
  const box = useRef(null);
  const [scale, setScale] = useState(0.3);
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return undefined;
    const fit = () => setScale(el.clientWidth / 1920);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <section className="tv" aria-label={label} ref={box}>
      <div className="tv-stage" style={{ transform: `scale(${scale})` }}>{children}</div>
    </section>
  );
}
