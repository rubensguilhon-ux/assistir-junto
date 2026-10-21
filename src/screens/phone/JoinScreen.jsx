import { Button, ParticipantAvatar } from '../../ds/index.js';
import Scene from '../Scene.jsx';
import { TITLE, PEOPLE, MAX_PEOPLE } from '../../session/session.js';

// Tela 3: convidado abre o link. full = variação de sala cheia (D24).
export default function JoinScreen({ full = false }) {
  const host = PEOPLE.ana;
  return (
    <div className="screen">
      <div className="hero hero-short">
        <Scene />
      </div>
      <div className="screen-body stack-5">
        <div className="row-2">
          <ParticipantAvatar name={host.name} color={host.color} host />
          <p className="body">
            <strong>{host.short}</strong> chamou você para assistir junto
          </p>
        </div>
        <div className="stack-1">
          <h1 className="title">{TITLE.name}</h1>
          <p className="caption text-muted">{TITLE.meta}</p>
        </div>
        {full ? (
          <div className="stack-3">
            <p className="body" role="status">
              A sala está cheia: já tem {MAX_PEOPLE} pessoas. Peça um novo convite a {host.short}.
            </p>
            <Button variant="primary" block disabled>Sala cheia</Button>
            <Button variant="ghost" block>Voltar ao início</Button>
          </div>
        ) : (
          <div className="stack-3">
            <p className="body text-muted">Você entra com a sua própria conta. Ninguém vê o que você assiste fora da sala.</p>
            <Button variant="primary" block>Entrar na sala</Button>
            <Button variant="ghost" block>Agora não</Button>
          </div>
        )}
      </div>
    </div>
  );
}
