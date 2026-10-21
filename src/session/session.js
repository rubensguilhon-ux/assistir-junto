// Estado simulado de uma sala do Assistir Junto. Tudo roda no navegador, sem servidor.
// Cada tela é uma função deste estado: o protótipo muda o estado com ações,
// o modo demonstração fixa um estado por tela.

export const TITLE = {
  name: 'O Farol de Bruma',
  meta: '2025 · Suspense · 1h 42min',
  synopsis: 'Numa ilha isolada, a nova faroleira percebe que a luz do farol apaga sempre na mesma hora. E que alguém lá embaixo espera por isso.',
  duration: 6152
};

export const MAX_PEOPLE = 8; // D24
export const SYNC_LIMIT_S = 2; // D22
export const DUCK_LEVEL = 0.3; // em aberto: proposta de 30% enquanto alguém fala

export const PEOPLE = {
  ana: { name: 'Ana Lima', short: 'Ana', color: 1 },
  bruno: { name: 'Bruno Reis', short: 'Bruno', color: 2 },
  carla: { name: 'Carla', short: 'Carla', color: 3 },
  davi: { name: 'Davi Souza', short: 'Davi', color: 4 }
};

export function initialState() {
  return {
    phase: 'title', // title | lobby | countdown | session | ended
    sheet: null, // invite | chat | people
    copied: false,
    people: [{ ...PEOPLE.ana, id: 'ana', host: true, me: true, device: null }],
    countdown: 3,
    position: 2292,
    playing: false,
    pausedBy: null,
    pauseLocked: false,
    ptt: 'idle', // idle | talking | locked | muted
    firstTalk: true,
    speakingId: null,
    sync: 'synced', // synced | correcting | behind
    delay: 0,
    notices: [],
    messages: [{ id: 1, kind: 'system', text: 'Ana criou a sala' }],
    reaction: null,
    orientation: 'portrait', // portrait | landscape (só com o filme no celular)
    controls: false, // controles sobre o vídeo em tela cheia
    rotated: false // já girou uma vez: some a dica de girar
  };
}

let seq = 100;
const nextId = () => ++seq;

function notice(state, kind, personId) {
  const p = PEOPLE[personId];
  const n = { id: nextId(), kind, name: p.short, color: p.color, personId };
  // No máximo dois avisos empilhados na TV.
  return [...state.notices.filter((x) => !(x.kind === 'speaking' && x.personId === personId)), n].slice(-2);
}

function system(state, text) {
  return [...state.messages, { id: nextId(), kind: 'system', text }];
}

export function reducer(state, action) {
  switch (action.type) {
    case 'openInvite':
      return { ...state, sheet: 'invite' };
    case 'copyLink':
      return { ...state, copied: true };
    case 'share':
      return { ...state, sheet: null, phase: 'lobby' };
    case 'closeSheet':
      return { ...state, sheet: null, copied: false };
    case 'join': {
      if (state.people.length >= MAX_PEOPLE || state.people.some((p) => p.id === action.id)) return state;
      const p = PEOPLE[action.id];
      return {
        ...state,
        people: [...state.people, { ...p, id: action.id, device: action.device ?? null }],
        notices: notice(state, 'joined', action.id),
        messages: system(state, `${p.short} entrou na sala`)
      };
    }
    case 'setDevice': {
      const mine = state.people.find((p) => p.id === action.id)?.me;
      return {
        ...state,
        orientation: mine && action.device !== 'phone' ? 'portrait' : state.orientation,
        people: state.people.map((p) => (p.id === action.id ? { ...p, device: action.device } : p))
      };
    }
    case 'rotate':
      return { ...state, orientation: state.orientation === 'portrait' ? 'landscape' : 'portrait', rotated: true, controls: state.orientation === 'portrait', sheet: null };
    case 'showControls':
      return { ...state, controls: true, controlsAt: Date.now() };
    case 'hideControls':
      return { ...state, controls: false };
    case 'start':
      return { ...state, phase: 'countdown', countdown: 3, notices: [] };
    case 'tickCountdown':
      if (state.countdown > 1) return { ...state, countdown: state.countdown - 1 };
      return { ...state, phase: 'session', playing: true };
    case 'tick':
      if (!state.playing) return state;
      if (state.position + 1 >= TITLE.duration) return { ...state, playing: false, phase: 'ended', sheet: null, orientation: 'portrait', controls: false };
      return { ...state, position: state.position + 1 };
    case 'pttStart': {
      const id = me(state).id;
      return { ...state, ptt: 'talking', speakingId: id, notices: notice(state, 'speaking', id) };
    }
    case 'pttEnd': {
      const id = me(state).id;
      return { ...state, ptt: 'idle', firstTalk: false, speakingId: null, notices: state.notices.filter((n) => !(n.kind === 'speaking' && n.personId === id)) };
    }
    case 'pttLock':
      return { ...state, ptt: 'locked', firstTalk: false };
    case 'pttUnlock': {
      const id = me(state).id;
      return { ...state, ptt: 'idle', speakingId: null, notices: state.notices.filter((n) => !(n.kind === 'speaking' && n.personId === id)) };
    }
    case 'otherSpeaks':
      return { ...state, speakingId: action.id, notices: notice(state, 'speaking', action.id) };
    case 'otherStops':
      return {
        ...state,
        speakingId: state.speakingId === action.id ? null : state.speakingId,
        notices: state.notices.filter((n) => !(n.kind === 'speaking' && n.personId === action.id))
      };
    case 'pause':
      return {
        ...state,
        playing: false,
        pausedBy: action.id,
        notices: notice(state, 'paused', action.id),
        messages: system(state, `${PEOPLE[action.id].short} pausou para o grupo`)
      };
    case 'resume':
      return { ...state, playing: true, pausedBy: null, notices: state.notices.filter((n) => n.kind !== 'paused') };
    case 'toggleLock':
      return { ...state, pauseLocked: !state.pauseLocked };
    case 'fallBehind':
      return { ...state, sync: action.delay > SYNC_LIMIT_S ? 'behind' : 'correcting', delay: action.delay };
    case 'resync':
      return { ...state, sync: 'synced', delay: 0 };
    case 'leave': {
      const p = PEOPLE[action.id];
      return { ...state, people: state.people.filter((x) => x.id !== action.id), notices: notice(state, 'left', action.id), messages: system(state, `${p.short} saiu`) };
    }
    case 'back': {
      const p = PEOPLE[action.id];
      return {
        ...state,
        people: [...state.people, { ...p, id: action.id, device: action.device ?? 'tv' }],
        notices: notice(state, 'back', action.id),
        messages: system(state, `${p.short} voltou`)
      };
    }
    case 'mute':
      return { ...state, people: state.people.map((p) => (p.id === action.id ? { ...p, muted: !p.muted } : p)) };
    case 'remove':
      return { ...state, people: state.people.filter((p) => p.id !== action.id), messages: system(state, `${PEOPLE[action.id].short} foi removido da sala`) };
    case 'react':
      return { ...state, reaction: action.label };
    case 'otherReacts': {
      // Proposta R16: o emoji aparece no avatar de quem reagiu e num aviso discreto na TV, por 2 s.
      const p = PEOPLE[action.id];
      const n = { id: nextId(), kind: 'reaction', name: p.short, color: p.color, personId: action.id, emoji: action.emoji, label: action.label };
      return {
        ...state,
        people: state.people.map((x) => (x.id === action.id ? { ...x, reaction: action.emoji, reactionLabel: action.label } : x)),
        notices: [...state.notices.filter((x) => !(x.kind === 'reaction' && x.personId === action.id)), n].slice(-2)
      };
    }
    case 'clearOtherReaction':
      return { ...state, people: state.people.map((x) => (x.id === action.id ? { ...x, reaction: null, reactionLabel: null } : x)) };
    case 'clearReaction':
      return { ...state, reaction: null };
    case 'message':
      return { ...state, messages: [...state.messages, { id: nextId(), kind: 'message', from: action.id, text: action.text, time: action.time }] };
    case 'dismissNotice':
      return { ...state, notices: state.notices.filter((n) => n.id !== action.id) };
    case 'openSheet':
      return { ...state, sheet: action.sheet };
    case 'end':
      return { ...state, playing: false, phase: 'ended', sheet: null, notices: [], orientation: 'portrait', controls: false };
    case 'reset':
      return initialState();
    case 'set':
      return { ...state, ...action.patch };
    default:
      return state;
  }
}

export function formatTime(s) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  const mm = h ? String(m).padStart(2, '0') : String(m);
  return (h ? h + ':' : '') + mm + ':' + String(sec).padStart(2, '0');
}

export function me(state) {
  return state.people.find((p) => p.me);
}

// Hora de exemplo das mensagens: 21:04 no ponto inicial do filme, avançando com ele.
export function clock(state) {
  const m = 4 + Math.max(0, Math.floor((state.position - 2292) / 60));
  return `${21 + Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`;
}
