// Som simulado do protótipo (R13, R14). Tudo é gerado no navegador: nada é gravado nem enviado.
// - A trilha do filme é um mar e um zumbido grave feitos com a Web Audio API, mais uma buzina de nevoeiro de tempos em tempos.
// - As vozes dos amigos usam a síntese de fala do navegador, em português quando houver voz instalada.
// - Enquanto alguém fala, o filme baixa para o nível escolhido e volta ao soltar.

let ctx = null;
let master = null;
let filmGain = null;
let hornTimer = null;
let muted = false;
const FILM_VOLUME = 0.55;

function noiseBuffer(c, seconds) {
  const len = c.sampleRate * seconds;
  const buf = c.createBuffer(1, len, c.sampleRate);
  const d = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < len; i++) {
    // Ruído marrom: grave e contínuo, como mar ao longe.
    last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02;
    d[i] = last * 3.5;
  }
  return buf;
}

function buildFilm(c) {
  // Mar: ruído filtrado com ondas lentas de volume.
  const sea = c.createBufferSource();
  sea.buffer = noiseBuffer(c, 6);
  sea.loop = true;
  const lp = c.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 520;
  const waves = c.createGain();
  waves.gain.value = 0.6;
  const lfo = c.createOscillator();
  lfo.frequency.value = 0.09;
  const lfoDepth = c.createGain();
  lfoDepth.gain.value = 0.35;
  lfo.connect(lfoDepth).connect(waves.gain);
  sea.connect(lp).connect(waves).connect(filmGain);
  // Zumbido grave de suspense.
  [55, 82.4].forEach((f) => {
    const o = c.createOscillator();
    o.type = 'sine';
    o.frequency.value = f;
    const g = c.createGain();
    g.gain.value = 0.06;
    o.connect(g).connect(filmGain);
    o.start();
  });
  sea.start();
  lfo.start();
}

function horn() {
  if (!ctx) return;
  const t = ctx.currentTime;
  const o = ctx.createOscillator();
  o.type = 'sawtooth';
  o.frequency.value = 98;
  const f = ctx.createBiquadFilter();
  f.type = 'lowpass';
  f.frequency.value = 380;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.22, t + 0.4);
  g.gain.setValueAtTime(0.22, t + 1.8);
  g.gain.linearRampToValueAtTime(0, t + 2.6);
  o.connect(f).connect(g).connect(filmGain);
  o.start(t);
  o.stop(t + 2.7);
}

// Precisa ser chamado dentro de um clique: o navegador só toca som depois de uma interação.
export function ensureAudio() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  if (!ctx) {
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 1;
    master.connect(ctx.destination);
    filmGain = ctx.createGain();
    filmGain.gain.value = 0;
    filmGain.connect(master);
    buildFilm(ctx);
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

// level: 1 = volume normal; DUCK_LEVEL enquanto alguém fala; 0 = parado.
export function setFilmLevel(level) {
  if (!ctx) return;
  filmGain.gain.setTargetAtTime(level * FILM_VOLUME, ctx.currentTime, 0.06);
  if (level > 0 && !hornTimer) {
    hornTimer = setInterval(horn, 23000);
  } else if (level === 0 && hornTimer) {
    clearInterval(hornTimer);
    hornTimer = null;
  }
}

export function setMuted(value) {
  muted = value;
  if (muted) stopVoices();
  if (!ctx) return;
  master.gain.setTargetAtTime(muted ? 0 : 1, ctx.currentTime, 0.03);
}

// Sinal curto ao abrir e fechar o microfone, para confirmar sem olhar.
export function earcon(kind) {
  if (!ctx || muted) return;
  const t = ctx.currentTime;
  const o = ctx.createOscillator();
  o.type = 'sine';
  o.frequency.setValueAtTime(kind === 'open' ? 660 : 520, t);
  o.frequency.linearRampToValueAtTime(kind === 'open' ? 880 : 390, t + 0.09);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.12, t + 0.01);
  g.gain.linearRampToValueAtTime(0, t + 0.12);
  o.connect(g).connect(master);
  o.start(t);
  o.stop(t + 0.14);
}

function ptVoice() {
  const voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
  return voices.find((v) => /pt[-_]BR/i.test(v.lang)) || voices.find((v) => /^pt/i.test(v.lang)) || null;
}

const VOICE_STYLE = { bruno: { pitch: 0.85, rate: 1.05 }, carla: { pitch: 1.25, rate: 1 }, davi: { pitch: 1, rate: 0.95 } };

// Fala de outra pessoa. onEnd é chamado no fim da fala, ou em 3 s se o navegador não tiver síntese de fala.
export function say(personId, text, onEnd) {
  let done = false;
  const started = Date.now();
  // A fala fica visível por pelo menos 2,5 s, mesmo se o navegador não tiver voz instalada.
  const finish = () => {
    if (done) return;
    done = true;
    setTimeout(onEnd, Math.max(0, 2500 - (Date.now() - started)));
  };
  const synth = window.speechSynthesis;
  if (!synth || !ctx || muted) {
    setTimeout(finish, 3000);
    return;
  }
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'pt-BR';
  const v = ptVoice();
  if (v) u.voice = v;
  const style = VOICE_STYLE[personId] || {};
  u.pitch = style.pitch || 1;
  u.rate = style.rate || 1;
  u.onend = finish;
  u.onerror = finish;
  synth.speak(u);
  setTimeout(finish, 8000);
}

export function stopVoices() {
  if (window.speechSynthesis) window.speechSynthesis.cancel();
}

// Microfone de verdade (opcional): o navegador pede permissão no primeiro toque em falar.
// A voz só é medida para mostrar o nível no botão; não é tocada de volta, gravada nem enviada.
let micStream = null;
let analyser = null;
let samples = null;
let micState = 'off'; // off | asking | on | denied

export async function startMic() {
  if (micState !== 'off') return micState;
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    micState = 'denied';
    return micState;
  }
  micState = 'asking';
  try {
    micStream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
    const c = ensureAudio();
    const src = c.createMediaStreamSource(micStream);
    analyser = c.createAnalyser();
    analyser.fftSize = 512;
    samples = new Uint8Array(analyser.fftSize);
    // O Chrome só processa o que chega à saída: ligamos a medição a um volume zero, para ninguém ouvir a própria voz.
    const silent = c.createGain();
    silent.gain.value = 0;
    src.connect(analyser).connect(silent).connect(c.destination);
    micState = 'on';
  } catch (e) {
    micState = 'denied';
  }
  return micState;
}

// Nível da voz de 0 a 1, ou 0 sem microfone.
export function micLevel() {
  if (!analyser) return 0;
  analyser.getByteTimeDomainData(samples);
  let sum = 0;
  for (let i = 0; i < samples.length; i++) {
    const v = (samples[i] - 128) / 128;
    sum += v * v;
  }
  return Math.min(1, Math.sqrt(sum / samples.length) * 6);
}
