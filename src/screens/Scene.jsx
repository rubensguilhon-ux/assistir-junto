// Placeholder do vídeo: uma cena desenhada em CSS para o título fictício.
// É conteúdo, não interface: as cores da cena ficam em scene.css (ver relatório de desvios).
import './scene.css';

export default function Scene({ dim = false, children }) {
  return (
    <div className={'scene' + (dim ? ' scene-dim' : '')} aria-hidden={children ? undefined : 'true'}>
      <div className="scene-sky" />
      <div className="scene-glow" />
      <div className="scene-tower" />
      <div className="scene-hill" />
      <div className="scene-vignette" />
      {children}
    </div>
  );
}
