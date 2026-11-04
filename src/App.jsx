import { useCallback, useEffect, useLayoutEffect, useReducer, useRef, useState } from 'react';
import { Button } from './ds/index.js';
import { reducer, initialState, me, clock, PEOPLE, DUCK_LEVEL } from './session/session.js';
import { ensureAudio, setFilmLevel, setMuted, earcon, say, stopVoices, startMic, micLevel } from './session/audio.js';
import PhoneFrame from './screens/PhoneFrame.jsx';
import TvFrame from './screens/TvFrame.jsx';
import TitleScreen from './screens/phone/TitleScreen.jsx';
import LobbyScreen from './screens/phone/LobbyScreen.jsx';
import SessionScreen from './screens/phone/SessionScreen.jsx';
import LandscapeSession from './screens/phone/LandscapeSession.jsx';
import EndScreen from './screens/phone/EndScreen.jsx';
import LeftScreen from './screens/phone/LeftScreen.jsx';
import TvScreen from './screens/tv/TvScreen.jsx';
import Demo from './demo/Demo.jsx';

export function PhoneFor({ s, act }) {
  if (s.phase === 'title') return <TitleScreen s={s} act={act} />;
  if (s.phase === 'lobby' || s.phase === 'countdown') return <LobbyScreen s={s} act={act} />;
  if (s.phase === 'ended') return <EndScreen s={s} act={act} />;
  if (s.phase === 'left') return <LeftScreen s={s} act={act} />;
  if (s.orientation === 'landscape') return <LandscapeSession s={s} act={act} />;
  return <SessionScreen s={s} act={act} />;
}

// Falas simuladas do Bruno, ouvidas pela síntese de fala do navegador.
const BRUNO_LINES = [
  'Gente, a luz do farol apagou de novo.',
  'Eu não confio nessa faroleira.',
  'Que som foi esse lá embaixo?',
  'Pausa rapidinho, eu perdi essa parte.',
  'Essa trilha está me deixando nervoso.'
];

export function brunoSpeaks(dispatch, line) {
  dispatch({ type: 'otherSpeaks', id: 'bruno' });
  say('bruno', line, () => dispatch({ type: 'otherStops', id: 'bruno' }));
}

function useSimulation(s, dispatch) {
  const joined = useRef(false);
  const chatted = useRef(false);
  const lineIndex = useRef(0);

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

  // Bruno fala de tempos em tempos, quando ninguém está falando. Com som ligado, dá para ouvir a fala.
  useEffect(() => {
    if (s.phase !== 'session' || !s.playing || s.speakingId !== null || !s.people.some((p) => p.id === 'bruno')) return undefined;
    const start = setTimeout(() => {
      brunoSpeaks(dispatch, BRUNO_LINES[lineIndex.current % BRUNO_LINES.length]);
      lineIndex.current += 1;
    }, 15000);
    return () => clearTimeout(start);
  }, [s.phase, s.playing, s.speakingId, s.people.length, dispatch]);

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

  // Avisos no celular, um por vez (D59): reação fica 2 s; mensagem 3 s mais 40 ms por letra, até 7 s.
  // Quando o aviso da vez some, o próximo da fila entra no lugar, com a mesma animação de entrada.
  const current = s.toasts[0];
  useEffect(() => {
    if (!current) return undefined;
    const time = current.kind === 'reaction' ? 2000 : Math.min(7000, 3000 + current.text.length * 40);
    const t = setTimeout(() => dispatch({ type: 'dismissToast', id: current.id }), time);
    return () => clearTimeout(t);
  }, [current && current.id, dispatch]);

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

// Som do protótipo: o filme toca enquanto a sessão roda e baixa para o nível escolhido enquanto alguém fala (R13, R14).
function useAudio(s, active, soundOn, duck, dispatch) {
  const anyoneSpeaking = s.speakingId !== null || s.ptt === 'talking' || s.ptt === 'locked';
  const level = !active || s.phase !== 'session' || !s.playing ? 0 : anyoneSpeaking ? duck : 1;
  useEffect(() => { setMuted(!soundOn); }, [soundOn]);
  useEffect(() => { setFilmLevel(level); }, [level]);
  useEffect(() => { if (!s.playing || s.phase !== 'session') stopVoices(); }, [s.playing, s.phase]);
  const prev = useRef(s.ptt);
  useEffect(() => {
    const was = prev.current;
    prev.current = s.ptt;
    if (!active) return;
    const open = (p) => p === 'talking' || p === 'locked';
    if (!open(was) && open(s.ptt)) {
      earcon('open');
      if (s.mic === 'off') {
        dispatch({ type: 'mic', status: 'asking' });
        startMic().then((status) => dispatch({ type: 'mic', status }));
      }
    }
    if (open(was) && !open(s.ptt)) earcon('close');
  }, [s.ptt, active]);

  // Com o microfone ligado, o nível da voz vai para o botão de falar pela variável --aj-mic-level.
  const micOpen = active && s.mic === 'on' && (s.ptt === 'talking' || s.ptt === 'locked');
  useEffect(() => {
    const root = document.documentElement;
    if (!micOpen) {
      root.style.setProperty('--aj-mic-level', '0');
      return undefined;
    }
    let frame;
    const loop = () => {
      root.style.setProperty('--aj-mic-level', micLevel().toFixed(2));
      frame = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(frame);
  }, [micOpen]);
}

const DUCK_OPTIONS = [0.15, 0.3, 0.5];

// Atalho só do protótipo, para o teste no computador (D56): segurar Espaço fala; com Espaço seguro, Enter trava o
// microfone; com o microfone travado, Espaço fecha. Não vale enquanto se digita no chat.
function usePushToTalkKeys(s, act, active) {
  const ref = useRef(s);
  ref.current = s;
  useEffect(() => {
    if (!active) return undefined;
    const typing = (e) => e.target instanceof HTMLElement && (e.target.matches('input, textarea') || e.target.isContentEditable);
    const down = (e) => {
      const st = ref.current;
      if (st.phase !== 'session' || typing(e)) return;
      if (e.code === 'Space') {
        e.preventDefault();
        if (e.repeat) return;
        if (st.ptt === 'idle') act('pttStart');
        else if (st.ptt === 'locked') act('pttUnlock');
      } else if (e.code === 'Enter' && st.ptt === 'talking') {
        e.preventDefault();
        act('pttLock');
      }
    };
    const up = (e) => {
      const st = ref.current;
      if (e.code !== 'Space' || typing(e)) return;
      e.preventDefault();
      if (st.ptt === 'talking') act('pttEnd');
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, [active, act]);
}

// O celular encolhe para caber na altura da janela, sem rolar a página (D55).
// A moldura mede 418 × 872 em pé e 872 × 418 deitada.
function PhoneFit({ landscape, solo, children }) {
  const box = useRef(null);
  const [scale, setScale] = useState(1);
  const w = landscape ? 872 : 418;
  const h = landscape ? 418 : 872;
  useLayoutEffect(() => {
    const fit = () => {
      const el = box.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      const below = solo ? 96 : 0; // espaço do botão de girar
      const availH = window.innerHeight - top - 24 - below;
      const availW = solo ? window.innerWidth - (window.innerWidth > 1100 ? 360 : 48) : window.innerWidth * 0.42;
      setScale(Math.max(0.45, Math.min(1, availH / h, availW / w)));
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [w, h, solo]);
  return (
    <div className="phone-fit" ref={box} style={{ width: w * scale, height: h * scale }}>
      <div className="phone-fit-inner" style={{ transform: `scale(${scale})` }}>{children}</div>
    </div>
  );
}

function Facilitator({ s, dispatch, soundOn, setSoundOn, duck, setDuck }) {
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
        <Button variant="ghost" disabled={!inSession || !s.playing || !has('bruno') || s.speakingId !== null} onClick={() => brunoSpeaks(dispatch, 'Olha isso, olha isso! Alguém subiu a escada do farol.')}>Bruno fala agora</Button>
        <Button variant="ghost" disabled={!inSession} onClick={go({ type: 'end' })}>Fim do filme</Button>
        <Button variant="ghost" onClick={go({ type: 'reset' })}>Recomeçar</Button>
      </div>
      <div className="facilitator-sound stack-2">
        <p className="label">Teclado no teste</p>
        <p className="caption text-muted">Segure Espaço para falar. Com Espaço seguro, aperte Enter para travar o microfone; Espaço de novo fecha.</p>
        <p className="label">Som do protótipo</p>
        <p className="caption text-muted">Trilha do filme e vozes simuladas no navegador. Use fone ou caixa de som.</p>
        <Button variant={soundOn ? 'secondary' : 'ghost'} onClick={() => setSoundOn(!soundOn)}>{soundOn ? 'Som ligado' : 'Som desligado'}</Button>
        <p className="caption text-muted">Microfone: {{ off: 'pedido no primeiro toque em falar', asking: 'aguardando a permissão do navegador', on: 'ligado (só mede o nível da voz, nada é gravado)', denied: 'bloqueado pelo navegador; a fala continua simulada' }[s.mic]}</p>
        <p className="caption text-muted">Volume do filme enquanto alguém fala (R14)</p>
        <div className="row-2 wrap" role="group" aria-label="Volume do filme enquanto alguém fala">
          {DUCK_OPTIONS.map((d) => (
            <Button key={d} variant={duck === d ? 'primary' : 'ghost'} onClick={() => setDuck(d)}>{Math.round(d * 100)}%</Button>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default function App() {
  const [mode, setMode] = useState(() => (location.hash === '#demo' ? 'demo' : 'proto'));
  const [s, dispatch] = useReducer(reducer, undefined, initialState);
  const turned = useRef(false);
  const [soundOn, setSoundOn] = useState(true);
  const [duck, setDuck] = useState(DUCK_LEVEL);
  // Todo toque libera o som: o navegador só toca áudio depois de uma interação.
  const act = useCallback((type, payload = {}) => {
    ensureAudio();
    if (type === 'rotate') turned.current = true;
    dispatch({ type, ...payload });
  }, []);
  const facilitate = useCallback((a) => { ensureAudio(); dispatch(a); }, []);
  useSimulation(s, dispatch);
  useAudio(s, mode === 'proto', soundOn, duck, dispatch);
  usePushToTalkKeys(s, act, mode === 'proto');
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
            <PhoneFit landscape={s.orientation === 'landscape'} solo={filmOnPhone}>
              <PhoneFrame key={s.orientation} label={`Celular de ${me(s).short}`} orientation={s.orientation} animate={turned.current}>
                <PhoneFor s={s} act={act} />
              </PhoneFrame>
            </PhoneFit>
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
          <Facilitator s={s} dispatch={facilitate} soundOn={soundOn} setSoundOn={(v) => { ensureAudio(); setSoundOn(v); }} duck={duck} setDuck={(v) => { ensureAudio(); setDuck(v); }} />
        </main>
      )}
    </div>
  );
}
