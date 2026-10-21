import { useEffect, useRef } from 'react';
import {
  ChatComposer,
  ChatMessage,
  IconButton,
  ParticipantPanel,
  PlayerProgress,
  PushToTalk,
  ReactionBar,
  Sheet,
  SyncIndicator,
  TvNotice
} from '../../ds/index.js';
import Scene from '../Scene.jsx';
import { TITLE, PEOPLE, formatTime, me, clock } from '../../session/session.js';

// Telas 14b e 14c: o filme no celular deitado (R28).
// Tela cheia: só o filme. Um toque mostra os controles e o botão de falar em vidro; somem em 3 s.
// Chat ou participantes abertos: o vídeo encolhe e a folha lateral abre ao lado, sem cobrir a cena.
export default function LandscapeSession({ s, act }) {
  const self = me(s);
  const chatEnd = useRef(null);
  // A mensagem mais nova fica sempre visível no fim da lista.
  useEffect(() => {
    const end = chatEnd.current;
    if (!end) return;
    [end.parentElement, end.closest('.aj-sheet')].forEach((el) => { if (el) el.scrollTop = el.scrollHeight; });
  }, [s.messages.length, s.sheet]);
  const progress = (s.position / TITLE.duration) * 100;
  const canPause = !s.pauseLocked || self.host;
  const sheetOpen = s.sheet === 'chat' || s.sheet === 'people';
  const talking = s.ptt === 'talking' || s.ptt === 'locked';
  const showControls = s.controls || !s.playing;
  const showPtt = showControls || talking || sheetOpen;

  const tap = (e) => {
    if (e.target !== e.currentTarget) return;
    act(s.controls ? 'hideControls' : 'showControls');
  };

  const ptt = (variant) => (
    <PushToTalk
      variant={variant}
      state={s.ptt}
      showHint={variant !== 'glass' && s.firstTalk && s.ptt === 'idle'}
      onPressStart={() => act('pttStart')}
      onPressEnd={() => act('pttEnd')}
      onLock={() => act('pttLock')}
      onUnlock={() => act('pttUnlock')}
    />
  );

  return (
    <div className={'land' + (sheetOpen ? ' land-split' : '')}>
      <div className="land-video">
        <div className="land-frame">
          <Scene dim={!s.playing} />
          <div className="land-notices">
            {s.notices.slice(-1).map((n) => (
              <TvNotice key={n.id} kind={n.kind} name={n.name} color={n.color} emoji={n.emoji} reactionLabel={n.label} />
            ))}
          </div>

          <button type="button" className="land-tap" onClick={tap} aria-label={s.controls ? 'Esconder os controles' : 'Mostrar os controles'} />

          {showControls && !sheetOpen ? (
            <div className="land-controls">
              <div className="land-top">
                <div className="stack-0">
                  <p className="label">{TITLE.name}</p>
                  <p className="caption text-muted">No celular · {s.people.length} {s.people.length === 1 ? 'pessoa' : 'pessoas'}</p>
                </div>
                <div className="row-2">
                  <SyncIndicator state={s.sync} delay={s.delay ? s.delay + ' s' : undefined} onRejoin={() => act('resync')} />
                  <IconButton icon="close" label="Sair da sala" surface="video" onClick={() => act('end')} />
                </div>
              </div>
              <div className="land-bottom">
                <PlayerProgress progress={progress} buffered={Math.min(progress + 12, 100)} current={formatTime(s.position)} remaining={formatTime(TITLE.duration - s.position)} />
                <div className="row-between">
                  <IconButton
                    icon={s.playing ? 'pause' : 'play'}
                    label={s.playing ? 'Pausar para o grupo' : 'Retomar para o grupo'}
                    surface="video"
                    disabled={!canPause}
                    onClick={() => act(s.playing ? 'pause' : 'resume', { id: self.id })}
                  />
                  <ReactionBar selected={s.reaction} onReact={(r) => act('react', { label: r.label })} />
                  <div className="row-2">
                    <IconButton icon="chat" label="Abrir chat" surface="video" onClick={() => act('openSheet', { sheet: 'chat' })} />
                    <IconButton icon="people" label="Ver participantes" surface="video" onClick={() => act('openSheet', { sheet: 'people' })} />
                  </div>
                </div>
                {!canPause ? <p className="caption text-muted">Só {PEOPLE.ana.short} pode pausar agora.</p> : null}
              </div>
            </div>
          ) : null}

          {showPtt && !sheetOpen ? (
            <div className="land-ptt">
              {s.firstTalk && s.ptt === 'idle' ? <p className="land-ptt-hint caption">Segure para falar · arraste para cima para travar</p> : null}
              {ptt('glass')}
            </div>
          ) : null}
        </div>
        {sheetOpen ? (
          <div className="land-mini stack-2">
            <div className="row-between">
              <div className="stack-0">
                <p className="label">{TITLE.name}</p>
                <p className="caption text-muted">No celular · {s.people.length} {s.people.length === 1 ? 'pessoa' : 'pessoas'}</p>
              </div>
              <IconButton
                icon={s.playing ? 'pause' : 'play'}
                label={s.playing ? 'Pausar para o grupo' : 'Retomar para o grupo'}
                disabled={!canPause}
                onClick={() => act(s.playing ? 'pause' : 'resume', { id: self.id })}
              />
            </div>
            <PlayerProgress progress={progress} buffered={Math.min(progress + 12, 100)} current={formatTime(s.position)} remaining={formatTime(TITLE.duration - s.position)} />
          </div>
        ) : null}
      </div>

      {s.sheet === 'chat' ? (
        <div className="land-side">
          <Sheet title="Chat" placement="side" onClose={() => act('closeSheet')}>
            <div className="chat-list land-scroll" role="log" aria-label="Mensagens">
              {s.messages.map((m) =>
                m.kind === 'system' ? (
                  <ChatMessage key={m.id} kind="system">{m.text}</ChatMessage>
                ) : (
                  <ChatMessage key={m.id} author={PEOPLE[m.from].short} color={PEOPLE[m.from].color} time={m.time} mine={m.from === self.id}>
                    {m.text}
                  </ChatMessage>
                )
              )}
              <div ref={chatEnd} />
            </div>
            <ChatComposer onSend={(text) => act('message', { id: self.id, text, time: clock(s) })} />
            {ptt('default')}
          </Sheet>
        </div>
      ) : null}

      {s.sheet === 'people' ? (
        <div className="land-side">
          <ParticipantPanel
            placement="side"
            isHost={self.host}
            pauseLocked={s.pauseLocked}
            onToggleLock={() => act('toggleLock')}
            onMute={(p) => act('mute', { id: p.id })}
            onRemove={(p) => act('remove', { id: p.id })}
            onClose={() => act('closeSheet')}
            participants={s.people.map((p) => ({ ...p, name: p.short, speaking: s.speakingId === p.id }))}
          />
        </div>
      ) : null}
    </div>
  );
}
