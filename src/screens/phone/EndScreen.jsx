import { Button, ParticipantAvatar } from '../../ds/index.js';
import { TITLE, formatTime } from '../../session/session.js';

// Tela 15: fim da sessão, resumo no celular.
export default function EndScreen({ s, act }) {
  const watched = s.position - 2292;
  const talks = s.messages.filter((m) => m.kind === 'message').length;
  return (
    <div className="screen">
      <div className="screen-body stack-6 screen-pad-top">
        <div className="stack-1">
          <p className="caption text-muted">Sessão encerrada</p>
          <h1 className="title">Vocês assistiram juntos</h1>
          <p className="body text-muted">{TITLE.name}</p>
        </div>
        <div className="row-3 wrap">
          {s.people.map((p) => (
            <ParticipantAvatar key={p.id} name={p.short} color={p.color} host={p.host} showName size="lg" />
          ))}
        </div>
        <dl className="summary">
          <div><dt className="caption text-muted">Tempo juntos</dt><dd className="title-sm">{formatTime(Math.max(watched, 0))}</dd></div>
          <div><dt className="caption text-muted">Mensagens no chat</dt><dd className="title-sm">{talks}</dd></div>
        </dl>
        <div className="stack-2">
          <Button variant="primary" icon="people" block onClick={() => act('reset')}>Assistir junto de novo</Button>
          <Button variant="ghost" block onClick={() => act('reset')}>Voltar ao início</Button>
        </div>
      </div>
    </div>
  );
}
