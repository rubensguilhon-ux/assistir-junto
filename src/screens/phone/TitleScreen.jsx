import { Button, InviteSheet } from '../../ds/index.js';
import Scene from '../Scene.jsx';
import { TITLE, MAX_PEOPLE } from '../../session/session.js';

// Telas 1 e 2: página do título e folha de convite.
export default function TitleScreen({ s, act }) {
  return (
    <div className="screen screen-title">
      <div className="hero">
        <Scene />
      </div>
      <div className="screen-body stack-4">
        <h1 className="display">{TITLE.name}</h1>
        <p className="caption text-muted">{TITLE.meta}</p>
        <div className="stack-2">
          <Button variant="primary" icon="people" block onClick={() => act('openInvite')}>Assistir Junto</Button>
          <Button variant="secondary" icon="play" block>Assistir sozinho</Button>
        </div>
        <p className="body text-muted">{TITLE.synopsis}</p>
      </div>
      {s.sheet === 'invite' ? (
        <div className="sheet-layer">
          <InviteSheet
            link="assistir.junto/sala/k7q2"
            count={s.people.length}
            max={MAX_PEOPLE}
            copied={s.copied}
            onCopy={() => act('copyLink')}
            onShare={() => act('share')}
            onClose={() => act('closeSheet')}
          />
        </div>
      ) : null}
    </div>
  );
}
