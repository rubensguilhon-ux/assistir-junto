import { Countdown, Icon, ParticipantAvatar, PlayerProgress, TvNotice } from '../../ds/index.js';
import Scene from '../Scene.jsx';
import { TITLE, MAX_PEOPLE, formatTime, me } from '../../session/session.js';

// Telas 5, 6, 7 e 12: o que a TV mostra em cada fase.
export default function TvScreen({ s }) {
  const self = me(s);
  const progress = (s.position / TITLE.duration) * 100;

  if (self.device === 'phone' && s.phase !== 'title') {
    return (
      <div className="tv-screen">
        <Scene dim />
        <div className="tv-center stack-4">
          <Icon name="phone" size={64} />
          <p className="tv-title">Assistindo no celular</p>
          <p className="tv-body text-muted">Escolha "Na TV" no lobby para trazer o filme para cá.</p>
        </div>
      </div>
    );
  }

  if (s.phase === 'title') {
    return (
      <div className="tv-screen">
        <Scene dim />
        <div className="tv-center stack-4">
          <p className="tv-display">{TITLE.name}</p>
          <p className="tv-body text-muted">Escolha um título no celular e toque em Assistir Junto</p>
        </div>
      </div>
    );
  }

  if (s.phase === 'lobby') {
    return (
      <div className="tv-screen">
        <Scene dim />
        <div className="tv-lobby stack-7">
          <div className="stack-3">
            <p className="tv-caption text-muted">Sala de {self.short}</p>
            <p className="tv-display">{TITLE.name}</p>
            <p className="tv-body">Abra o link no celular para entrar. A conversa fica no celular, o filme fica aqui.</p>
          </div>
          <div className="tv-people">
            {s.people.map((p) => (
              <div key={p.id} className="tv-person">
                <ParticipantAvatar name={p.short} color={p.color} host={p.host} size="tv" />
                <span className="tv-caption">{p.short}</span>
              </div>
            ))}
          </div>
          <p className="tv-caption text-muted">
            {s.people.length} de {MAX_PEOPLE} na sala · esperando {self.short} começar
          </p>
        </div>
      </div>
    );
  }

  if (s.phase === 'countdown') {
    return (
      <div className="tv-screen">
        <Scene dim />
        <div className="tv-fill">
          <Countdown value={s.countdown} participants={s.people.map((p) => ({ name: p.short, color: p.color }))} />
        </div>
      </div>
    );
  }

  if (s.phase === 'ended') {
    return (
      <div className="tv-screen">
        <Scene dim />
        <div className="tv-center stack-4">
          <p className="tv-display">Fim da sessão</p>
          <p className="tv-body text-muted">Obrigado por assistir junto</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tv-screen">
      <Scene dim={!s.playing} />
      <div className="tv-notices" aria-live="polite">
        {s.notices.map((n) => (
          <TvNotice key={n.id} kind={n.kind} name={n.name} color={n.color} emoji={n.emoji} reactionLabel={n.label} />
        ))}
      </div>
      {!s.playing ? (
        <div className="tv-player">
          <p className="tv-label">{TITLE.name}</p>
          <PlayerProgress size="tv" progress={progress} buffered={Math.min(progress + 12, 100)} current={formatTime(s.position)} remaining={formatTime(TITLE.duration - s.position)} />
        </div>
      ) : null}
    </div>
  );
}
