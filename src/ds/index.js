// Ponto único de entrada do design system Assistir Junto (D36).
// Não reescreva componentes aqui: eles vêm do bundle publicado.
import './react-global.js';
import './tokens.css';
import './bundle.css';
import './bundle.js';

const DS = window.AssistirJunto;

export const {
  Button,
  IconButton,
  ParticipantAvatar,
  PushToTalk,
  ReactionBar,
  ChatMessage,
  SyncIndicator,
  PlayerProgress,
  InviteSheet,
  LobbyList,
  ParticipantPanel,
  Countdown,
  TvNotice,
  ChatComposer,
  Sheet,
  Switch,
  Icon
} = DS;
