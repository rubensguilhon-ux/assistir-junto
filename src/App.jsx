import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { Button } from './ds/index.js';
import { reducer, initialState, me, clock, PEOPLE } from './session/session.js';
import PhoneFrame from './screens/PhoneFrame.jsx';
import TvFrame from './screens/TvFrame.jsx';
import TitleScreen from './screens/phone/TitleScreen.jsx';
import LobbyScreen from './screens/phone/LobbyScreen.jsx';
import SessionScreen from './screens/phone/SessionScreen.jsx';
import LandscapeSession from './screens/phone/LandscapeSession.jsx';
import EndScreen from './screens/phone/EndScreen.jsx';
import TvScreen from './screens/tv/TvScreen.jsx';
import Demo from './demo/Demo.jsx';

export function PhoneFor({ s, act }) {
  if (s.phase === 'title') return <TitleScreen s={s} act={act} />;
  if (s.phase === 'lobby' || s.phase === 'countdown') return <LobbyScreen s={s} act={act} />;
  if (s.phase === 'ended') return <EndScreen s={s} act={act} />;
  if (s.orientation === 'landscape') return <LandscapeSession s={s} act={act} />;
  return <SessionScreen s={s} act={act} />;
}

function useSimulation(s, dispatch) {
  const joined = useRef(false);
  const chatted = useRef(false);

  // Convidados entram depois do convite.
  useEffect(() => {
    if (s.phase !== 'lobby' || joined.current) return undefined;
    joined.current = true;
    const t = [
      setTimeout(() => dispatch({ type: 'join', id: 'bruno', device: 'phone' }), 900),
      setTimeout(() => dispatch({ type: 'join', id: 'carla', device: 'tv' }), 1900),
      setTimeout(() => dispatch({ type: 'join', id: 'davi' }), 3200),
      setTimeout(() => dispatch({ type: 'setDevice', id: 'davi', device: 'tv' }), 5200)
    ];
    return () => t.forEach(clearTimeout);
  }, [s.phase, dispatch]);

  // Contagem regressiva e relógio do filme.
  useEffect(() => {
    if (s.phase !== 'countdown') return undefined;
    const t = setTimeout(() => dispatch({ type: 'tickCountdown' }), 1000);
    return () => clearTimeout(t);
  }, [s.phase, s.countdown, dispatch]);

  useEffect(() => {
    if (!s.playing) return undefined;
    const t = setInterval(() => dispatch({ type: 'tick' }), 1000);
    return () => clearInterval(t);
  }, [s.playing, dispatch]);

  // Bruno fala de tempos em tempos, quando ninguém está falando.
  useEffect(() => {
    if (s.phase !== 'session' || !s.playing || !s.people.some((p) => p.id === 'bruno')) return undefined;
    let stop;
    const start = setTimeout(() => {
      dispatch({ type: 'otherSpeaks', id: 'bruno' });
      stop = setTimeout(() => dispatch({ type: 'otherStops', id: 'bruno' }), 3000);
    }, 9000);
    return () => { clearTimeout(start); clearTimeout(stop); };
  }, [s.phase, s.playing, s.speakingId === null, s.people.length, dispatch]);

  // Primeiras mensagens do chat.
  useEffect(() => {
    if (s.phase !== 'session' || chatted.current) return undefined;
    chatted.current = true;
    const t = [
      setTimeout(() => dispatch({ type: 'message', id: 'bruno', text: 'Esse farol já me deu medo', time: '21:04' }), 4000),
      setTimeout(() => dispatch({ type: 'message', id: 'carla', text: 'Olha o fundo da cena!', time: '21:05' }), 12000)
    ];
    return () => t.forEach(clearTimeout);
  }, [s.phase, dispatch]);

  // Avisos da TV somem em 3 s (reações em 2 s), menos "está falando".
  useEffect(() => {
    const timers = s.notices
      .filter((n) => n.kind !== 'speaking' && !(n.kind === 'paused' && !s.playing))
      .map((n) => setTimeout(() => dispatch({ type: 'dismissNotice', id: n.id }), n.kind === 'reaction' ? 2000 : 3000));
    return () => timers.forEach(clearTimeout);
  }, [s.notices, s.playing, dispatch]);

  // O emoji de quem reagiu some do avatar em 2 s (proposta R16).
  const reacting = s.people.filter((p) => p.reaction).map((p) => p.id).join(',');
  useEffect(() => {
    if (!reacting) return undefined;
    const t = reacting.split(',').map((id) => setTimeout(() => dispatch({ type: 'clearOtherReaction', id }), 2000));
    return () => t.forEach(clearTimeout);
  }, [reacting, dispatch]);

  // Reação fica marcada por 1 s; atraso pequeno se corrige em 2 s (D22).
  useEffect(() => {
    if (!s.reaction) return undefined;
    const t = setTimeout(() => dispatch({ type: 'clearReaction' }), 1000);
    return () => clearTimeout(t);
  }, [s.reaction, dispatch]);

  // Controles sobre o vídeo deitado somem em 3 s, menos com pausa, folha aberta ou microfone aberto (R28).
  useEffect(() => {
    if (!s.controls || !s.playing || s.sheet || s.ptt !== 'idle') return undefined;
    const t = setTimeout(() => dispatch({ type: 'hideControls' }), 3000);
    return () => clearTimeout(t);
  }, [s.controls, s.controlsAt, s.playing, s.sheet, s.ptt, dispatch]);

  useEffect(() => {
    if (s.sync !== 'correcting') return undefined;
    const t = setTimeout(() => dispatch({ type: 'resync' }), 2000);
    return () => clearTimeout(t);
  }, [s.sync, dispatch]);
}

function Facilitator({ s, dispatch }) {
  const inSession = s.phase === 'session';
  const has = (id) => s.people.some((p) => p.id === id);
  const go = (a) => () => dispatch(a);
  const reactor = ['carla', 'davi'].find(has);
  return (
    <aside className="facilitator" aria-label="Controles do facilitador">
      <p className="label">Controles do facilitador</p>
      <p className="caption text-muted">Simulam o que as outras pessoas da sala fariam. Não fazem parte da interface.</p>
      <div className="facilitator-actions">
        <Button variant="ghost" disabled={!inSession || !s.playing || !has('bruno')} onClick={go({ type: 'pause', id: 'bruno' })}>Bruno pausa</Button>
        <Button variant="ghost" disabled={!inSession || s.playing} onClick={go({ type: 'resume' })}>Retomar</Button>
        <Button variant="ghost" disabled={!inSession} onClick={go({ type: 'fallBehind', delay: 1 })}>Atraso de 1 s</Button>
        <Button variant="ghost" disabled={!inSession} onClick={go({ type: 'fallBehind', delay: 5 })}>Atraso de 5 s</Button>
        <Button variant="ghost" disabled={!inSession || !has('carla')} onClick={() => { dispatch({ type: 'leave', id: 'carla' }); setTimeout(() => dispatch({ type: 'back', id: 'carla', device: 'tv' }), 4000); }}>Carla cai e volta</Button>
        <Button variant="ghost" disabled={!inSession || !has('bruno')} onClick={go({ type: 'message', id: 'bruno', text: 'Pausa que eu perdi', time: clock(s) })}>Bruno escreve</Button>
        <Button variant="ghost" disabled={!inSession || !has('bruno') || !reactor} onClick={() => { dispatch({ type: 'message', id: 'bruno', text: 'Não acredito que a luz apagou de novo', time: clock(s) }); setTimeout(() => dispatch({ type: 'otherReacts', id: reactor, emoji: '😱', label: 'Susto' }), 1500); }}>Bruno escreve e {reactor ? PEOPLE[reactor].short : 'alguém'} reage</Button>
        <Button variant="ghost" disabled={!inSession} onClick={go({ type: 'end' })}>Fim do filme</Button>
        <Button variant="ghost" onClick={go({ type: 'reset' })}>Recomeçar</Button>
      </div>
    </aside>
  );
}

export default function App() {
  const [mode, setMode] = useState(() => (location.hash === '#demo' ? 'demo' : 'proto'));
  const [s, dispatch] = useReducer(reducer, undefined, initialState);
  const turned = useRef(false);
  const act = useCallback((type, payload = {}) => {
    if (type === 'rotate') turned.current = true;
    dispatch({ type, ...payload });
  }, []);
  useSimulation(s, dispatch);
  const filmOnPhone = me(s).device === 'phone' && s.phase !== 'title';
  const canRotate = s.phase === 'session';

  return (
    <div className="app">
      <header className="app-head">
        <div className="stack-0">
          <p className="title-sm">Assistir Junto</p>
          <p className="caption text-muted">Conceito não oficial para o desafio da PM3 · o filme na TV, a conversa no celular</p>
        </div>
        <nav className="row-2" aria-label="Modo">
          <Button variant={mode === 'proto' ? 'primary' : 'ghost'} onClick={() => setMode('proto')}>Protótipo</Button>
          <Button variant={mode === 'demo' ? 'primary' : 'ghost'} onClick={() => setMode('demo')}>Demonstração</Button>
        </nav>
      </header>

      {mode === 'demo' ? (
        <Demo />
      ) : (
        <main className={'proto' + (filmOnPhone ? ' proto-solo' : '')}>
          <div className="proto-phone">
            <PhoneFrame key={s.orientation} label={`Celular de ${me(s).short}`} orientation={s.orientation} animate={turned.current}>
              <PhoneFor s={s} act={act} />
            </PhoneFrame>
            {filmOnPhone ? (
              <div className="proto-rotate stack-2">
                <Button variant="secondary" icon="rotate" disabled={!canRotate} onClick={() => act('rotate')}>
                  {s.orientation === 'portrait' ? 'Girar aparelho' : 'Voltar o aparelho em pé'}
                </Button>
                <p className="caption text-muted">Sem TV: o filme está no celular. {!canRotate ? 'O giro fica disponível quando o filme começa.' : s.orientation === 'portrait' ? 'Gire para ver o filme maior.' : 'Toque no vídeo para ver os controles.'}</p>
              </div>
            ) : null}
          </div>
          {filmOnPhone ? null : (
            <div className="proto-tv">
              <TvFrame label="TV da sala">
                <TvScreen s={s} />
              </TvFrame>
            </div>
          )}
          <Facilitator s={s} dispatch={dispatch} />
        </main>
      )}
    </div>
  );
}
