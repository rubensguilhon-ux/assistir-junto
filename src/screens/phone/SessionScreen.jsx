import { useEffect, useRef } from 'react';
import {
  ChatComposer,
  Button,
  ChatMessage,
  IconButton,
  ParticipantAvatar,
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

// Telas 8 a 11, 13 e 14: a sessão no celular.
// Com a TV, o celular é a segunda tela (conversa). Sem TV (D21), o vídeo fica no topo com a camada social.
export default function SessionScreen({ s, act }) {
  const self = me(s);
  const chatEnd = useRef(null);
  // A mensagem mais nova fica sempre visível no fim da lista.
  useEffect(() => {
    const end = chatEnd.current;
    if (!end) return;
    [end.parentElement, end.closest('.aj-sheet')].forEach((el) => { if (el) el.scrollTop = el.scrollHeight; });
  }, [s.messages.length, s.sheet]);
  const onPhone = self.device === 'phone';
  const progress = (s.position / TITLE.duration) * 100;
  const canPause = !s.pauseLocked || self.host;
  const playing = s.playing;

  return (
    <div className="screen screen-session">
      {onPhone ? (
        <div className="video">
          <Scene dim={!playing} />
          <div className="video-notices">
            {s.notices.slice(-1).map((n) => (
              <TvNotice key={n.id} kind={n.kind} name={n.name} color={n.color} emoji={n.emoji} reactionLabel={n.label} />
            ))}
          </div>
          {!s.rotated ? (
            <div className="video-rotate">
              <Button variant="secondary" icon="rotate" onClick={() => act('rotate')}>Gire para ver maior</Button>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="session-top">
        <div className="row-between">
          <div className="stack-0">
            <p className="label">{TITLE.name}</p>
            <p className="caption text-muted">{onPhone ? 'No celular' : 'Na TV'} · {s.people.length} {s.people.length === 1 ? 'pessoa' : 'pessoas'}</p>
          </div>
          <IconButton icon="close" label="Sair da sala" onClick={() => act('end')} />
        </div>
        <SyncIndicator state={s.sync} delay={s.delay ? s.delay + ' s' : undefined} onRejoin={() => act('resync')} />
      </div>

      <div className="session-people" aria-label="Quem está na sala">
        {s.people.map((p) => (
          <ParticipantAvatar
            key={p.id}
            name={p.me ? 'Você' : p.short}
            color={p.color}
            host={p.host}
            muted={p.muted}
            speaking={s.speakingId === p.id}
            reaction={p.reaction}
            reactionLabel={p.reactionLabel}
            showName
          />
        ))}
      </div>

      <div className="session-controls">
        <PlayerProgress progress={progress} buffered={Math.min(progress + 12, 100)} current={formatTime(s.position)} remaining={formatTime(TITLE.duration - s.position)} />
        <div className="row-center">
          <IconButton
            icon={playing ? 'pause' : 'play'}
            label={playing ? 'Pausar para o grupo' : 'Retomar para o grupo'}
            size="lg"
            active={!playing}
            disabled={!canPause}
            onClick={() => act(playing ? 'pause' : 'resume', { id: self.id })}
          />
          <IconButton icon="chat" label="Abrir chat" onClick={() => act('openSheet', { sheet: 'chat' })} />
          <IconButton icon="people" label="Ver participantes" onClick={() => act('openSheet', { sheet: 'people' })} />
        </div>
        {!canPause ? <p className="caption text-muted text-center">Só {PEOPLE.ana.short} pode pausar agora.</p> : null}
      </div>

      <div className="session-bottom">
        <ReactionBar selected={s.reaction} onReact={(r) => act('react', { label: r.label })} />
        <PushToTalk
          state={s.ptt}
          showHint={s.firstTalk && s.ptt === 'idle'}
          onPressStart={() => act('pttStart')}
          onPressEnd={() => act('pttEnd')}
          onLock={() => act('pttLock')}
          onUnlock={() => act('pttUnlock')}
        />
      </div>

      {s.sheet === 'chat' ? (
        <div className="sheet-layer">
          <Sheet title="Chat" onClose={() => act('closeSheet')}>
            <div className="chat-list" role="log" aria-label="Mensagens">
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
          </Sheet>
        </div>
      ) : null}

      {s.sheet === 'people' ? (
        <div className="sheet-layer">
          <ParticipantPanel
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
