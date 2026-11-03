import { Button, Sheet } from '../../ds/index.js';
import { PEOPLE, me } from '../../session/session.js';

// O X da sessão pergunta antes (D52). Convidado só sai; anfitrião escolhe entre sair e encerrar para todos.
export default function LeaveSheet({ s, act, placement }) {
  const self = me(s);
  const next = s.people.find((p) => !p.me);
  return (
    <Sheet title={self.host ? 'Sair ou encerrar?' : 'Sair da sala?'} placement={placement} onClose={() => act('closeSheet')}>
      <p className="body text-muted">
        {self.host
          ? next
            ? `Se você sair, o grupo continua e ${PEOPLE[next.id].short} vira o anfitrião. Se encerrar, a sessão acaba para todos.`
            : 'Você está sozinho na sala. Encerrar acaba a sessão.'
          : 'O grupo continua assistindo. Você pode voltar no ponto em que eles estiverem.'}
      </p>
      <div className="stack-2">
        {next ? <Button variant="secondary" block onClick={() => act('leaveSelf')}>Sair da sala</Button> : null}
        {self.host ? <Button variant="primary" block onClick={() => act('end')}>Encerrar para todos</Button> : null}
        <Button variant="ghost" block onClick={() => act('closeSheet')}>Cancelar</Button>
      </div>
    </Sheet>
  );
}
