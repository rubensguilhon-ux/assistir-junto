// Moldura de celular para o protótipo: 390 × 844 em pé, 844 × 390 deitado.
// É casca do protótipo, como os controles do facilitador: não faz parte da interface do produto.
// Genérica no estilo iPhone (ilha, barra de status, indicador de início), sem logo nem imagem da Apple.
function StatusBar() {
  return (
    <div className="phone-status" aria-hidden="true">
      <span className="phone-time">21:04</span>
      <span className="phone-status-icons">
        <svg width="18" height="12" viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx="1" /><rect x="5" y="5" width="3" height="7" rx="1" /><rect x="10" y="2.5" width="3" height="9.5" rx="1" /><rect x="15" y="0" width="3" height="12" rx="1" /></svg>
        <svg width="16" height="12" viewBox="0 0 16 12"><path d="M8 11.5 5.6 9a3.4 3.4 0 0 1 4.8 0z" /><path d="M3.3 6.7a6.6 6.6 0 0 1 9.4 0l-1.2 1.2a4.9 4.9 0 0 0-7 0z" /><path d="M1 4.4a9.9 9.9 0 0 1 14 0l-1.2 1.2a8.2 8.2 0 0 0-11.6 0z" /></svg>
        <span className="phone-battery"><i /></span>
      </span>
    </div>
  );
}

export default function PhoneFrame({ label, children, overlay, orientation = 'portrait', animate = false }) {
  const landscape = orientation === 'landscape';
  return (
    <section
      className={'device' + (landscape ? ' device-landscape' : '') + (animate ? ' device-turn' : '')}
      aria-label={label + (landscape ? ', deitado' : '')}
    >
      <span className="device-btn device-btn-a" aria-hidden="true" />
      <span className="device-btn device-btn-b" aria-hidden="true" />
      <span className="device-btn device-btn-c" aria-hidden="true" />
      <div className="phone">
        {landscape ? null : <StatusBar />}
        <span className="phone-island" aria-hidden="true" />
        <div className="phone-screen">{children}</div>
        {overlay ? <div className="phone-overlay">{overlay}</div> : null}
        <span className="phone-home" aria-hidden="true" />
      </div>
    </section>
  );
}
