/* @ds-bundle: {"format":4,"namespace":"AssistirJunto","components":[{"name":"Button"},{"name":"IconButton"},{"name":"ParticipantAvatar"},{"name":"PushToTalk"},{"name":"ReactionBar"},{"name":"ChatMessage"},{"name":"SyncIndicator"},{"name":"PlayerProgress"},{"name":"InviteSheet"},{"name":"LobbyList"},{"name":"ParticipantPanel"},{"name":"Countdown"},{"name":"TvNotice"},{"name":"ChatComposer"}]} */
(function () {
  var React = window.React;
  var h = React.createElement;

  function cx() {
    var out = [];
    for (var i = 0; i < arguments.length; i++) { if (arguments[i]) out.push(arguments[i]); }
    return out.join(' ');
  }

  var PATHS = {
    mic: ['M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3z', 'M19 11a7 7 0 0 1-14 0', 'M12 18v3'],
    'mic-off': ['M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3z', 'M19 11a7 7 0 0 1-14 0', 'M12 18v3', 'M4 4l16 16'],
    crown: ['M3 8l4 4 5-7 5 7 4-4-2 11H5z'],
    send: ['M4 12l16-8-6 16-3-7z'],
    sync: ['M20 12a8 8 0 1 1-2.34-5.66', 'M20 4v5h-5'],
    play: ['M7 4l13 8-13 8z'],
    pause: ['M8 5v14', 'M16 5v14'],
    check: ['M5 12l5 5 9-10'],
    'check-circle': ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', 'M8 12l3 3 5-6'],
    alert: ['M12 3l9 16H3z', 'M12 9v4', 'M12 16v.01'],
    link: ['M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1', 'M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1'],
    share: ['M12 15V3', 'M7 8l5-5 5 5', 'M5 13v7h14v-7'],
    people: ['M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', 'M3 20a6 6 0 0 1 12 0', 'M16 5a3 3 0 0 1 0 6', 'M21 20a6 6 0 0 0-4-5.66'],
    chat: ['M4 5h16v11H9l-5 4z'],
    tv: ['M3 6h18v11H3z', 'M8 21h8'],
    phone: ['M8 3h8v18H8z', 'M11 18h2'],
    lock: ['M6 11h12v9H6z', 'M8 11V8a4 4 0 0 1 8 0v3'],
    'chevron-up': ['M6 15l6-6 6 6'],
    close: ['M6 6l12 12', 'M18 6L6 18'],
    rotate: ['M4 12a8 8 0 0 1 13.66-5.66L20 9', 'M20 4v5h-5', 'M20 12a8 8 0 0 1-13.66 5.66L4 15', 'M4 20v-5h5']
  };

  function Icon(props) {
    var paths = PATHS[props.name] || [];
    return h('svg', {
      className: cx('aj-icon', props.className),
      width: props.size || 24, height: props.size || 24, viewBox: '0 0 24 24',
      fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round',
      'aria-hidden': 'true', focusable: 'false'
    }, paths.map(function (d, i) { return h('path', { key: i, d: d }); }));
  }

  function initials(name) {
    var parts = String(name || '?').trim().split(/\s+/);
    var a = parts[0] ? parts[0].charAt(0) : '?';
    var b = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';
    return (a + b).toUpperCase();
  }

  function Button(props) {
    var variant = props.variant || 'primary';
    var size = props.size || 'md';
    return h('button', {
      type: props.type || 'button',
      className: cx('aj-btn', 'aj-btn-' + variant, 'aj-btn-' + size, props.block && 'aj-btn-block', props.focused && 'aj-focused', props.className),
      disabled: props.disabled, onClick: props.onClick
    }, props.icon ? h(Icon, { name: props.icon, size: size === 'lg' ? 24 : 20 }) : null, h('span', null, props.children));
  }

  function IconButton(props) {
    return h('button', {
      type: 'button',
      className: cx('aj-iconbtn', props.surface === 'video' && 'aj-iconbtn-video', props.active && 'aj-iconbtn-active', props.size === 'lg' && 'aj-iconbtn-lg', props.focused && 'aj-focused', props.className),
      'aria-label': props.label, 'aria-pressed': props.active === undefined ? undefined : !!props.active,
      disabled: props.disabled, onClick: props.onClick
    }, h(Icon, { name: props.icon, size: props.size === 'lg' ? 28 : 22 }));
  }

  function ParticipantAvatar(props) {
    var size = props.size || 'md';
    var color = props.color || 1;
    var state = props.speaking ? 'falando' : props.muted ? 'microfone desligado' : '';
    var label = props.name + (props.host ? ', anfitrião' : '') + (state ? ', ' + state : '') + (props.reaction ? ', reagiu ' + (props.reactionLabel || props.reaction) : '');
    return h('span', { className: cx('aj-av', 'aj-av-' + size, props.speaking && 'aj-av-speaking', props.className), role: 'img', 'aria-label': label },
      h('span', { className: 'aj-av-frame' },
        h('span', { className: 'aj-av-face aj-av-c' + color }, initials(props.name)),
        props.host ? h('span', { className: 'aj-av-badge aj-av-host' }, h(Icon, { name: 'crown', size: 12 })) : null,
        props.muted && !props.speaking ? h('span', { className: 'aj-av-badge aj-av-muted' }, h(Icon, { name: 'mic-off', size: 12 })) : null,
        props.reaction ? h('span', { className: 'aj-av-reaction', 'aria-hidden': 'true' }, props.reaction) : null),
      props.showName ? h('span', { className: 'aj-av-name' }, props.name) : null
    );
  }

  var LOCK_DISTANCE = 64;

  function PushToTalk(props) {
    var state = props.state || 'idle';
    var startY = React.useRef(null);
    var text;
    if (state === 'talking') text = 'Falando…';
    else if (state === 'locked') text = 'Microfone aberto';
    else if (state === 'muted') text = 'Microfone desligado';
    else text = props.showHint ? 'Segure para falar' : 'Falar';

    function down(e) {
      if (state === 'muted' || state === 'locked') return;
      startY.current = e.clientY;
      if (props.onPressStart) props.onPressStart();
    }
    function move(e) {
      if (startY.current === null || state !== 'talking') return;
      if (startY.current - e.clientY > LOCK_DISTANCE) { startY.current = null; if (props.onLock) props.onLock(); }
    }
    function up() {
      if (startY.current === null) return;
      startY.current = null;
      if (props.onPressEnd) props.onPressEnd();
    }

    var glass = props.variant === 'glass';
    if (glass) {
      return h('div', { className: cx('aj-ptt-wrap', 'aj-ptt-wrap-glass', props.className) },
        state === 'talking' ? h('div', { className: 'aj-ptt-lockhint aj-ptt-lockhint-glass', 'aria-hidden': 'true' }, h(Icon, { name: 'lock', size: 16 }), h(Icon, { name: 'chevron-up', size: 16 })) : null,
        h('button', {
          type: 'button',
          className: cx('aj-ptt', 'aj-ptt-glass', 'aj-ptt-' + state, props.focused && 'aj-focused'),
          'aria-pressed': state === 'talking' || state === 'locked',
          'aria-label': state === 'locked' ? 'Microfone aberto. Toque para fechar' : state === 'muted' ? 'Microfone desligado' : state === 'talking' ? 'Falando' : 'Segure para falar',
          onPointerDown: down, onPointerMove: move, onPointerUp: up, onPointerCancel: up,
          onClick: state === 'muted' ? props.onUnmute : state === 'locked' ? props.onUnlock : undefined
        },
          h(Icon, { name: state === 'muted' ? 'mic-off' : state === 'locked' ? 'lock' : 'mic', size: 24 }),
          state === 'talking' || state === 'locked' ? h('span', { className: 'aj-ptt-ring', 'aria-hidden': 'true' }) : null
        )
      );
    }
    return h('div', { className: cx('aj-ptt-wrap', props.className) },
      state === 'talking' ? h('div', { className: 'aj-ptt-lockhint', 'aria-hidden': 'true' }, h(Icon, { name: 'lock', size: 18 }), h(Icon, { name: 'chevron-up', size: 18 })) : null,
      h('button', {
        type: 'button',
        className: cx('aj-ptt', 'aj-ptt-' + state, props.focused && 'aj-focused'),
        'aria-pressed': state === 'talking' || state === 'locked',
        onPointerDown: down, onPointerMove: move, onPointerUp: up, onPointerCancel: up,
        onClick: state === 'muted' ? props.onUnmute : state === 'locked' ? props.onUnlock : undefined
      },
        h(Icon, { name: state === 'muted' ? 'mic-off' : state === 'locked' ? 'lock' : 'mic', size: 24 }),
        h('span', { className: 'aj-ptt-text' }, text),
        state === 'talking' || state === 'locked' ? h('span', { className: 'aj-ptt-level', 'aria-hidden': 'true' }, h('i'), h('i'), h('i'), h('i')) : null,
        state === 'locked' ? h('span', { className: 'aj-ptt-close' }, 'Fechar') : null
      ),
      props.showHint && state === 'idle' ? h('p', { className: 'aj-ptt-hint' }, 'Arraste para cima para manter o microfone aberto') : null
    );
  }

  var DEFAULT_REACTIONS = [
    { emoji: '😂', label: 'Rindo' },
    { emoji: '😱', label: 'Susto' },
    { emoji: '😍', label: 'Amei' },
    { emoji: '😢', label: 'Triste' },
    { emoji: '👏', label: 'Palmas' }
  ];

  function ReactionBar(props) {
    var items = props.reactions || DEFAULT_REACTIONS;
    return h('div', { className: cx('aj-reactions', props.className), role: 'toolbar', 'aria-label': 'Reações' },
      items.map(function (r) {
        return h('button', {
          key: r.label, type: 'button', className: cx('aj-reaction', props.selected === r.label && 'aj-reaction-on'),
          'aria-label': r.label, 'aria-pressed': props.selected === r.label,
          onClick: props.onReact ? function () { props.onReact(r); } : undefined
        }, h('span', { 'aria-hidden': 'true' }, r.emoji));
      })
    );
  }

  function ChatMessage(props) {
    if (props.kind === 'system') {
      return h('div', { className: cx('aj-msg-system', props.className), role: 'status' }, props.children);
    }
    return h('div', { className: cx('aj-msg', props.mine && 'aj-msg-mine', props.className) },
      props.mine ? null : h(ParticipantAvatar, { name: props.author, color: props.color, size: 'sm' }),
      h('div', { className: 'aj-msg-body' },
        h('div', { className: 'aj-msg-meta' },
          h('span', { className: 'aj-msg-author' }, props.mine ? 'Você' : props.author),
          props.time ? h('span', { className: 'aj-msg-time' }, props.time) : null),
        h('div', { className: 'aj-msg-bubble' }, props.children))
    );
  }

  function SyncIndicator(props) {
    var state = props.state || 'synced';
    var icon = state === 'synced' ? 'check-circle' : state === 'correcting' ? 'sync' : 'alert';
    var text = state === 'synced' ? 'No mesmo ponto do grupo' : state === 'correcting' ? 'Ajustando o atraso' : (props.delay ? props.delay + ' atrás do grupo' : 'Atrás do grupo');
    return h('div', { className: cx('aj-sync', 'aj-sync-' + state, props.className), role: 'status' },
      h(Icon, { name: icon, size: 18, className: 'aj-sync-icon' }),
      h('span', { className: 'aj-sync-text' }, text),
      state === 'behind' ? h('button', { type: 'button', className: 'aj-sync-action', onClick: props.onRejoin }, 'Voltar ao grupo') : null
    );
  }

  function PlayerProgress(props) {
    var pct = Math.max(0, Math.min(100, props.progress || 0));
    var buf = Math.max(pct, Math.min(100, props.buffered || pct));
    return h('div', { className: cx('aj-progress', props.size === 'tv' && 'aj-progress-tv', props.className) },
      h('div', { className: 'aj-progress-track', role: 'slider', 'aria-label': 'Posição no filme', 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': Math.round(pct), 'aria-valuetext': props.current },
        h('div', { className: 'aj-progress-buffer', style: { width: buf + '%' } }),
        h('div', { className: 'aj-progress-fill', style: { width: pct + '%' } }),
        h('div', { className: 'aj-progress-thumb', style: { left: pct + '%' } })),
      h('div', { className: 'aj-progress-times' },
        h('span', null, props.current || '0:00'),
        h('span', null, props.remaining ? '-' + props.remaining : ''))
    );
  }

  function Sheet(props) {
    var side = props.placement === 'side';
    return h('section', { className: cx('aj-sheet', side && 'aj-sheet-side', props.className), 'aria-label': props.title },
      side ? null : h('div', { className: 'aj-sheet-handle', 'aria-hidden': 'true' }),
      h('header', { className: 'aj-sheet-head' },
        h('h2', { className: 'aj-sheet-title' }, props.title),
        props.onClose ? h(IconButton, { icon: 'close', label: 'Fechar', onClick: props.onClose }) : null),
      props.children);
  }

  var COMPOSER_MAX = 200;
  var COMPOSER_COUNT_FROM = 180;

  function ChatComposer(props) {
    var max = props.max || COMPOSER_MAX;
    var st = React.useState('');
    var text = st[0], setText = st[1];
    var empty = text.trim().length === 0;
    function send(e) {
      if (e) e.preventDefault();
      if (empty) return;
      if (props.onSend) props.onSend(text.trim());
      setText('');
    }
    var showCount = text.length >= Math.min(COMPOSER_COUNT_FROM, max - 20);
    return h('form', { className: cx('aj-composer', props.className), onSubmit: send },
      h('div', { className: 'aj-composer-row' },
        h('input', {
          className: 'aj-composer-field', type: 'text', value: text, maxLength: max,
          placeholder: props.placeholder || 'Escreva uma mensagem', 'aria-label': 'Mensagem para o grupo',
          enterKeyHint: 'send', autoComplete: 'off',
          onChange: function (e) { setText(e.target.value); },
          onFocus: props.onFocus, onBlur: props.onBlur
        }),
        h('button', { type: 'submit', className: cx('aj-iconbtn', !empty && 'aj-composer-send-on'), 'aria-label': 'Enviar', disabled: empty },
          h(Icon, { name: 'send', size: 22 }))),
      showCount ? h('p', { className: cx('aj-composer-count', text.length >= max && 'aj-composer-count-max'), 'aria-live': 'polite' }, text.length + '/' + max) : null
    );
  }

  function InviteSheet(props) {
    return h(Sheet, { title: props.title || 'Convide quem vai assistir', onClose: props.onClose },
      h('p', { className: 'aj-sheet-text' }, 'Mande o link para até ' + ((props.max || 8) - 1) + ' pessoas. Cada uma entra com a própria conta.'),
      h('div', { className: 'aj-field', role: 'group', 'aria-label': 'Link do convite' },
        h(Icon, { name: 'link', size: 20 }),
        h('span', { className: 'aj-field-value' }, props.link || 'assistir.junto/sala/k7q2')),
      h('div', { className: 'aj-sheet-actions' },
        h(Button, { variant: 'secondary', icon: props.copied ? 'check' : 'link', block: true, onClick: props.onCopy }, props.copied ? 'Link copiado' : 'Copiar link'),
        h(Button, { variant: 'primary', icon: 'share', block: true, onClick: props.onShare }, 'Compartilhar')),
      h('p', { className: 'aj-sheet-caption' }, (props.count || 1) + ' de ' + (props.max || 8) + ' pessoas na sala'));
  }

  function deviceText(p) {
    if (!p.device) return 'entrando…';
    return p.device === 'tv' ? 'na TV' : 'no celular';
  }

  function LobbyList(props) {
    var list = props.participants || [];
    var max = props.max || 8;
    return h('div', { className: cx('aj-lobby', props.className) },
      h('div', { className: 'aj-lobby-head' },
        h('span', { className: 'aj-lobby-title' }, 'Na sala'),
        h('span', { className: 'aj-lobby-count' }, list.length + ' de ' + max)),
      h('ul', { className: 'aj-list' }, list.map(function (p) {
        return h('li', { key: p.name, className: cx('aj-list-row', !p.device && 'aj-list-row-pending') },
          h(ParticipantAvatar, { name: p.name, color: p.color, host: p.host }),
          h('span', { className: 'aj-list-main' },
            h('span', { className: 'aj-list-name' }, p.name + (p.me ? ' (você)' : '')),
            h('span', { className: 'aj-list-meta' }, (p.host ? 'anfitrião · ' : '') + deviceText(p))),
          p.device ? h(Icon, { name: p.device === 'tv' ? 'tv' : 'phone', size: 20, className: 'aj-list-icon' }) : null);
      })));
  }

  function Switch(props) {
    return h('button', { type: 'button', role: 'switch', 'aria-checked': !!props.checked, 'aria-label': props.label, className: cx('aj-switch', props.checked && 'aj-switch-on'), onClick: props.onChange },
      h('span', { className: 'aj-switch-knob' }));
  }

  function ParticipantPanel(props) {
    var list = props.participants || [];
    return h(Sheet, { title: 'Participantes', onClose: props.onClose, placement: props.placement },
      props.isHost ? h('div', { className: 'aj-setting' },
        h('span', { className: 'aj-list-main' },
          h('span', { className: 'aj-list-name' }, 'Só eu posso pausar'),
          h('span', { className: 'aj-list-meta' }, 'Os outros ainda falam, reagem e conversam')),
        h(Switch, { checked: props.pauseLocked, label: 'Só eu posso pausar', onChange: props.onToggleLock })) : null,
      h('ul', { className: 'aj-list' }, list.map(function (p) {
        var canManage = props.isHost && !p.me;
        return h('li', { key: p.name, className: 'aj-list-row' },
          h(ParticipantAvatar, { name: p.name, color: p.color, host: p.host, speaking: p.speaking, muted: p.muted }),
          h('span', { className: 'aj-list-main' },
            h('span', { className: 'aj-list-name' }, p.name + (p.me ? ' (você)' : '')),
            h('span', { className: cx('aj-list-meta', p.speaking && 'aj-list-meta-speaking') }, p.speaking ? 'falando' : (p.host ? 'anfitrião · ' : '') + deviceText(p))),
          canManage ? h('span', { className: 'aj-list-actions' },
            h(IconButton, { icon: p.muted ? 'mic' : 'mic-off', label: (p.muted ? 'Liberar microfone de ' : 'Silenciar ') + p.name, onClick: props.onMute ? function () { props.onMute(p); } : undefined }),
            h(IconButton, { icon: 'close', label: 'Remover ' + p.name + ' da sala', onClick: props.onRemove ? function () { props.onRemove(p); } : undefined })) : null);
      })));
  }

  function Countdown(props) {
    var list = props.participants || [];
    return h('div', { className: cx('aj-countdown', props.className), role: 'timer', 'aria-live': 'assertive' },
      h('span', { className: 'aj-countdown-label' }, props.label || 'Começando para todos'),
      h('span', { className: 'aj-countdown-num' }, props.value === undefined ? 3 : props.value),
      h('span', { className: 'aj-countdown-people' }, list.map(function (p) {
        return h(ParticipantAvatar, { key: p.name, name: p.name, color: p.color, size: 'tv' });
      })));
  }

  function TvNotice(props) {
    var kind = props.kind || 'speaking';
    var verb = kind === 'speaking' ? 'está falando' : kind === 'joined' ? 'entrou' : kind === 'left' ? 'saiu' : kind === 'back' ? 'voltou' : kind === 'paused' ? 'pausou para o grupo' : kind === 'reaction' ? 'reagiu' : '';
    return h('div', { className: cx('aj-tvnotice', 'aj-tvnotice-' + kind, props.className), role: 'status' },
      h(ParticipantAvatar, { name: props.name, color: props.color, size: 'tv', speaking: kind === 'speaking' }),
      h('span', { className: 'aj-tvnotice-text' }, h('strong', null, props.name), ' ' + verb),
      kind === 'reaction' && props.emoji ? h('span', { className: 'aj-tvnotice-emoji', role: 'img', 'aria-label': props.reactionLabel || props.emoji }, props.emoji) : null
    );
  }

  window.AssistirJunto = Object.assign(window.AssistirJunto || {}, {
    Button: Button,
    IconButton: IconButton,
    ParticipantAvatar: ParticipantAvatar,
    PushToTalk: PushToTalk,
    ReactionBar: ReactionBar,
    ChatMessage: ChatMessage,
    SyncIndicator: SyncIndicator,
    PlayerProgress: PlayerProgress,
    InviteSheet: InviteSheet,
    LobbyList: LobbyList,
    ParticipantPanel: ParticipantPanel,
    Countdown: Countdown,
    TvNotice: TvNotice,
    ChatComposer: ChatComposer,
    Sheet: Sheet,
    Switch: Switch,
    Icon: Icon
  });
})();
