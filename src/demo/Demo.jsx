import { initialState, PEOPLE } from '../session/session.js';
import PhoneFrame from '../screens/PhoneFrame.jsx';
import TvFrame from '../screens/TvFrame.jsx';
import TitleScreen from '../screens/phone/TitleScreen.jsx';
import JoinScreen from '../screens/phone/JoinScreen.jsx';
import LobbyScreen from '../screens/phone/LobbyScreen.jsx';
import SessionScreen from '../screens/phone/SessionScreen.jsx';
import LandscapeSession from '../screens/phone/LandscapeSession.jsx';
import EndScreen from '../screens/phone/EndScreen.jsx';
import TvScreen from '../screens/tv/TvScreen.jsx';

// Modo demonstração (D34): as 15 telas do design.md em estado fixo, mais as variações 3b, 7b, 10b, 14b e 14c, para as imagens e o fluxo estático do case.
const noop = () => {};

const person = (id, extra = {}) => ({ ...PEOPLE[id], id, ...extra });
const room = (devices = {}) => [
  person('ana', { host: true, me: true, device: devices.ana ?? 'tv' }),
  person('bruno', { device: devices.bruno ?? 'phone' }),
  person('carla', { device: devices.carla ?? 'tv' }),
  person('davi', { device: devices.davi === undefined ? 'tv' : devices.davi })
];
const n = (id, kind, personId) => ({ id, kind, name: PEOPLE[personId].short, color: PEOPLE[personId].color, personId });
const chat = [
  { id: 1, kind: 'system', text: 'Bruno entrou na sala' },
  { id: 2, kind: 'message', from: 'bruno', text: 'Esse farol já me deu medo', time: '21:04' },
  { id: 3, kind: 'message', from: 'carla', text: 'Olha o fundo da cena!', time: '21:05' },
  { id: 4, kind: 'message', from: 'ana', text: 'Vi! Pausa que eu perdi', time: '21:05' },
  { id: 5, kind: 'system', text: 'Ana pausou para o grupo' }
];
const base = (patch) => ({ ...initialState(), ...patch });
const session = (patch) => base({ phase: 'session', playing: true, position: 2412, people: room(), firstTalk: false, messages: chat, ...patch });

const SCREENS = [
  { n: 1, device: 'phone', title: 'Página do título', group: 'Entrada e convite', el: <TitleScreen s={base({})} act={noop} /> },
  { n: 2, device: 'phone', title: 'Folha de convite', group: 'Entrada e convite', el: <TitleScreen s={base({ sheet: 'invite' })} act={noop} /> },
  { n: 3, device: 'phone', title: 'Convidado abre o link', group: 'Entrada e convite', el: <JoinScreen /> },
  { n: '3b', device: 'phone', title: 'Variação: sala cheia', group: 'Entrada e convite', el: <JoinScreen full /> },
  { n: 4, device: 'phone', title: 'Lobby no celular', group: 'Lobby e início', el: <LobbyScreen s={base({ phase: 'lobby', people: room({ davi: null }) })} act={noop} /> },
  { n: 5, device: 'tv', title: 'Lobby na TV', group: 'Lobby e início', el: <TvScreen s={base({ phase: 'lobby', people: room({ davi: null }) })} /> },
  { n: 6, device: 'tv', title: 'Contagem regressiva', group: 'Lobby e início', el: <TvScreen s={base({ phase: 'countdown', countdown: 3, people: room() })} /> },
  { n: 7, device: 'tv', title: 'Filme com Bruno falando', group: 'Sessão', el: <TvScreen s={session({ speakingId: 'bruno', notices: [n(1, 'speaking', 'bruno')] })} /> },
  { n: '7b', device: 'tv', title: 'Carla reagiu (proposta R16)', group: 'Sessão', el: <TvScreen s={session({ notices: [{ ...n(5, 'reaction', 'carla'), emoji: '😱', label: 'Susto' }] })} /> },
  { n: 8, device: 'phone', title: 'Sessão, primeira vez', group: 'Sessão', el: <SessionScreen s={session({ firstTalk: true, messages: chat.slice(0, 1) })} act={noop} /> },
  { n: 9, device: 'phone', title: 'Falando, arraste para travar', group: 'Sessão', el: <SessionScreen s={session({ ptt: 'talking', speakingId: 'ana' })} act={noop} /> },
  { n: 10, device: 'phone', title: 'Chat aberto', group: 'Sessão', el: <SessionScreen s={session({ sheet: 'chat', playing: false, pausedBy: 'ana' })} act={noop} /> },
  { n: '10b', device: 'phone', title: 'Bruno escreveu, Carla reagiu', group: 'Sessão', el: <SessionScreen s={session({ people: room().map((p) => (p.id === 'carla' ? { ...p, reaction: '😱', reactionLabel: 'Susto' } : p)), messages: [...chat, { id: 6, kind: 'message', from: 'bruno', text: 'Não acredito que a luz apagou de novo', time: '21:06' }] })} act={noop} /> },
  { n: 11, device: 'phone', title: 'Participantes, visão do anfitrião', group: 'Sessão', el: <SessionScreen s={session({ sheet: 'people', speakingId: 'bruno', people: room().map((p) => (p.id === 'carla' ? { ...p, muted: true } : p)) })} act={noop} /> },
  { n: 12, device: 'tv', title: 'Pausado por Ana', group: 'Exceções e fim', el: <TvScreen s={session({ playing: false, pausedBy: 'ana', notices: [n(2, 'paused', 'ana')] })} /> },
  { n: 13, device: 'phone', title: 'Atrás do grupo', group: 'Exceções e fim', el: <SessionScreen s={session({ sync: 'behind', delay: 5 })} act={noop} /> },
  { n: 14, device: 'phone', title: 'Sem TV: vídeo no celular', group: 'Exceções e fim', el: <SessionScreen s={session({ people: room({ ana: 'phone' }), speakingId: 'carla', notices: [n(3, 'speaking', 'carla')] })} act={noop} /> },
  { n: '14b', device: 'landscape', title: 'Deitado: toque mostra os controles', group: 'Exceções e fim', el: <LandscapeSession s={session({ people: room({ ana: 'phone' }), orientation: 'landscape', rotated: true, controls: true, firstTalk: true, speakingId: 'carla', notices: [n(4, 'speaking', 'carla')] })} act={noop} /> },
  { n: '14c', device: 'landscape', title: 'Deitado: vídeo encolhe e o chat abre ao lado', group: 'Exceções e fim', el: <LandscapeSession s={session({ people: room({ ana: 'phone' }), orientation: 'landscape', rotated: true, sheet: 'chat', firstTalk: false })} act={noop} /> },
  { n: 15, device: 'phone', title: 'Fim da sessão', group: 'Exceções e fim', el: <EndScreen s={session({ phase: 'ended', playing: false, position: 6152 })} act={noop} /> }
];

const GROUPS = ['Entrada e convite', 'Lobby e início', 'Sessão', 'Exceções e fim'];

export default function Demo() {
  return (
    <main className="demo">
      {GROUPS.map((g) => (
        <section key={g} className="demo-group" aria-labelledby={'g-' + g}>
          <h2 id={'g-' + g} className="title">{g}</h2>
          <div className="demo-row">
            {SCREENS.filter((x) => x.group === g).map((x) => (
              <figure key={x.n} className={'demo-item demo-' + x.device}>
                {x.device === 'tv' ? (
                  <TvFrame label={`Tela ${x.n}: ${x.title}`}>{x.el}</TvFrame>
                ) : (
                  <PhoneFrame label={`Tela ${x.n}: ${x.title}`} orientation={x.device === 'landscape' ? 'landscape' : 'portrait'}>{x.el}</PhoneFrame>
                )}
                <figcaption className="caption text-muted">
                  <span className="label">{x.n}</span> · {x.title}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
