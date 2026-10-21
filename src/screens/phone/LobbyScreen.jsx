import { Button, LobbyList } from '../../ds/index.js';
import { TITLE, MAX_PEOPLE, me } from '../../session/session.js';

// Tela 4: lobby no celular. Cada um escolhe TV ou celular (D21); só o anfitrião começa.
export default function LobbyScreen({ s, act }) {
  const self = me(s);
  const ready = s.people.filter((p) => p.device).length;
  return (
    <div className="screen">
      <div className="screen-body stack-5 screen-pad-top">
        <div className="stack-1">
          <p className="caption text-muted">Sala de {self.short}</p>
          <h1 className="title">{TITLE.name}</h1>
        </div>
        <LobbyList participants={s.people.map((p) => ({ ...p, name: p.short }))} max={MAX_PEOPLE} />
        {self.device ? (
          <div className="stack-2">
            {s.phase === 'countdown' ? (
              <p className="title text-center" role="status">Começando em {s.countdown}</p>
            ) : (
              <>
                <Button variant="primary" size="lg" icon="play" block onClick={() => act('start')}>Começar</Button>
                <p className="caption text-muted text-center">
                  {ready} de {s.people.length} prontos. Quem ainda não escolheu entra assim que escolher.
                </p>
                <Button variant="ghost" block onClick={() => act('openInvite')}>Convidar mais pessoas</Button>
              </>
            )}
          </div>
        ) : (
          <div className="stack-2">
            <p className="label">Onde você vai assistir?</p>
            <div className="grid-2">
              <Button variant="secondary" icon="tv" block onClick={() => act('setDevice', { id: self.id, device: 'tv' })}>Na TV</Button>
              <Button variant="secondary" icon="phone" block onClick={() => act('setDevice', { id: self.id, device: 'phone' })}>No celular</Button>
            </div>
            <p className="caption text-muted">Na TV, o filme vai para a tela grande e o celular fica com a conversa.</p>
          </div>
        )}
      </div>
    </div>
  );
}
