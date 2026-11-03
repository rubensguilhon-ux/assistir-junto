import { Button, ParticipantAvatar } from '../../ds/index.js';
import { TITLE, PEOPLE } from '../../session/session.js';

// Depois de "Sair da sala": a sessão continua para o grupo (R24). A pessoa pode voltar no ponto atual (D23).
export default function LeftScreen({ s, act }) {
  const host = s.people.find((p) => p.host);
  const others = s.people.filter((p) => !p.me);
  return (
    <div className="screen">
      <div className="screen-body stack-6 screen-pad-top">
        <div className="stack-1">
          <p className="caption text-muted">Você saiu da sala</p>
          <h1 className="title">O grupo continua assistindo</h1>
          <p className="body text-muted">{TITLE.name}</p>
        </div>
        <div className="row-3 wrap">
          {others.map((p) => (
            <ParticipantAvatar key={p.id} name={p.short} color={p.color} host={p.host} showName size="lg" />
          ))}
        </div>
        {host && !host.me ? <p className="body">{PEOPLE[host.id].short} agora é o anfitrião.</p> : null}
        <div className="stack-2">
          <Button variant="primary" icon="play" block onClick={() => act('rejoin')}>Voltar para a sala</Button>
          <Button variant="ghost" block onClick={() => act('reset')}>Voltar ao início</Button>
        </div>
      </div>
    </div>
  );
}
