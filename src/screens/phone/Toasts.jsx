import { ChatToast } from '../../ds/index.js';
import { PEOPLE } from '../../session/session.js';

// Mensagens e reações que chegam com o chat fechado, no canto superior direito do celular (D57).
export default function Toasts({ s, act, className = '', max = 2 }) {
  if (!s.toasts.length || s.sheet === 'chat') return null;
  return (
    <div className={'toasts ' + className} aria-live="polite">
      {s.toasts.slice(-max).map((t) => {
        const p = PEOPLE[t.personId];
        return t.kind === 'reaction' ? (
          <ChatToast key={t.id} kind="reaction" name={p.short} color={p.color} emoji={t.emoji} reactionLabel={t.label} />
        ) : (
          <ChatToast key={t.id} kind="message" name={p.short} color={p.color} text={t.text} onClick={() => act('openSheet', { sheet: 'chat' })} />
        );
      })}
    </div>
  );
}
