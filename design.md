# design.md · Assistir Junto

Diretrizes de design para quem for codar o Assistir Junto, pessoa ou agente de IA. Leia inteiro antes de escrever código. Em conflito, vale nesta ordem: o pedido do Rubens, este arquivo, o design system, o diário de decisões.

## Fontes da verdade

- **Design system:** https://claude.ai/artifact/UDbAyLBApvyBgRb1kjWkX8 (tokens, tipografia, 13 componentes, namespace `AssistirJunto`).
- **Diário de decisões:** https://claude.ai/code/artifact/3e81a43e-4fc2-4444-88bf-2f15e990bc90 (decisões D1 a D41, fluxo, casos de erro, evidências).
- Os códigos `Dnn` neste arquivo apontam para o diário.

## Regras para o agente

1. **Estrutura só com aprovação (D37).** Antes de mudar arquitetura, estrutura de pastas, dependências, rotas ou o fluxo de telas, pare, explique a mudança e espere o Rubens aprovar. Ajustes dentro de um componente ou de uma tela você faz direto.
2. **Só componentes do design system (D36).** Nunca invente um componente nem recrie um que já existe. Se faltar algum, pare, proponha (nome, props, estados) e espere aprovação. O componente novo entra primeiro no design system, depois no código.
3. **Só tokens (D38).** Nenhum hex, rgba, px de espaçamento, raio ou sombra soltos. Use as variáveis do design system (`var(--accent)`, `var(--space-4)`, `var(--radius-md)`). Se faltar um valor, proponha um token novo antes de usar.
4. **Textos novos seguem o guia (D39).** Você pode escrever textos de interface que ainda não existem, seguindo a seção Conteúdo e tom. No fim de cada entrega, liste todos os textos novos para revisão.
5. **Não remova nem renomeie** tokens, componentes ou textos já aprovados sem pedir.
6. **Relate o que fez.** No fim de cada entrega: o que mudou, os textos novos, o que ficou pendente e qualquer desvio deste arquivo, com o motivo.

## Stack (D35)

- React 18 com Vite. Componentes de função e hooks.
- O design system é a base: importe tokens e componentes do bundle `AssistirJunto` ou da cópia local dele. Não reescreva os componentes.
- Identificadores, arquivos e comentários de código em inglês. Todo texto visível em português do Brasil.
- Sem biblioteca de UI externa (MUI, Chakra, shadcn e similares).

## O produto em uma página

- **Problema (D12):** grupos pequenos que assistem juntos à distância conseguem dar play ao mesmo tempo, mas a conversa fica fora da experiência: mensagem, pausa para comentar, outro app em um segundo aparelho. Com o delay, assistir junto vira assistir em paralelo.
- **Público (D11):** grupos pequenos e próximos, de 2 a 4 pessoas, como amigos ou um casal à distância.
- **Solução:** o filme fica na TV e a conversa no celular (D7). Quem não tem TV assiste no celular, com a camada social sobre o vídeo (D21).
- **MVP (D8):** voz por botão de falar, reações, chat de texto e controles do anfitrião.
- **Conceito não oficial**, inspirado na Netflix. Nunca use o logo, a fonte Netflix Sans, o vermelho #E50914 nem imagens de títulos reais (D5).

## Princípios

- **O filme manda.** Nada na TV cobre o centro da imagem. Avisos ficam no canto e somem sozinhos.
- **A conversa mora no celular.** A TV só mostra quem fala, quem entrou, saiu, voltou ou pausou.
- **Falar sem olhar.** O botão de falar fica sempre no mesmo lugar, embaixo e na largura toda.
- **Todos no mesmo ponto.** A sincronia é a base. Seu estado aparece com ícone e texto, nunca só com cor.

## Superfícies

| Superfície | Tamanho de referência | Margens | Entrada |
| --- | --- | --- | --- |
| Celular em pé | 390 × 844 | `space-4` nas laterais | Toque; alvos com no mínimo `touch-target` (48px) |
| Celular deitado | 844 × 390 | 56px nas laterais, livres da ilha | Toque; só com o filme no celular (R28) |
| TV | 1920 × 1080 | `tv-safe-x` (96px) e `tv-safe-y` (54px) | Controle remoto; foco sempre visível |

## Cor

- Tema escuro único. Fundo sempre `surface`; camadas em `surface-raised`, `surface-sheet` e `surface-control`.
- `accent` é a cor de ação: botão primário, botão de falar ativo, barra de progresso. Um único botão primário por tela.
- `accent` nunca como texto sobre fundo escuro. Vermelho em texto ou ícone usa `accent-text`.
- `speaking`, o verde, é exclusivo de quem fala (D28). Não use verde para sucesso nem para sincronia.
- `status-warn` e `status-danger` só aparecem acompanhados de texto.
- Cada participante recebe uma cor de `avatar-1` a `avatar-6`, na ordem de entrada na sala.

## Tipografia

- Família `sans` (Inter, via Google Fonts) (D26).
- Celular: `body` para texto, `label` para botões e nomes, `title-sm` para títulos de folha, `title` para títulos de tela, `caption` para metadados.
- TV: nada abaixo de `tv-caption` (20px); avisos em `tv-label` (24px). Esses tamanhos foram validados: 3 pessoas leram 30 de 30 avisos de relance (D33).

## Componentes

| Componente | Use para | Não use para |
| --- | --- | --- |
| `Button` | Ações com texto; `primary`, `secondary`, `ghost` | Ações só com ícone |
| `IconButton` | Controles do player e atalhos (chat, participantes, microfone) | Ações principais da tela |
| `ParticipantAvatar` | Representar uma pessoa: iniciais, cor, anfitrião, falando, microfone desligado | Fotos ou personagens |
| `PushToTalk` | O botão de falar; `variant="glass"` sobre o vídeo em tela cheia, com o celular deitado | Qualquer outro botão |
| `ReactionBar` | Reações rápidas durante o filme | Emojis em outros lugares |
| `ChatMessage` | Mensagens e avisos do sistema no chat | Avisos na TV |
| `ChatComposer` | Escrever no chat: campo, enviar e Enter; limite de 200 (D49) | Mensagens na TV |
| `SyncIndicator` | Estado de sincronia no celular | Status de conexão genérico |
| `PlayerProgress` | Posição no filme, no celular e na TV | Barras de carregamento |
| `InviteSheet` | Convite com link | Outros compartilhamentos |
| `LobbyList` | Quem está na sala antes de começar | A lista durante a sessão |
| `ParticipantPanel` | Lista durante a sessão e controles do anfitrião; `placement="side"` com o celular deitado | O lobby |
| `Sheet` | Folha de chat; `placement="side"` ao lado do vídeo encolhido | Avisos rápidos |
| `Countdown` | Contagem 3, 2, 1 na TV ao começar ou retomar | Timers em geral |
| `TvNotice` | Avisos discretos sobre o vídeo na TV | Avisos no celular |

## Fluxo

1. O anfitrião escolhe o título no celular e toca em "Assistir Junto" (D18).
2. Compartilha o link de convite (`InviteSheet`) (D22).
3. Os convidados abrem o link e entram no lobby. Quem não tem conta vê o aviso de conta própria antes de entrar (D22).
4. Cada um escolhe assistir na TV ou no celular (D21).
5. O anfitrião toca em "Começar". A TV de todos mostra a contagem regressiva (`Countdown`).
6. Filme sincronizado na TV; voz, reações e chat no celular.
7. Fim do filme ou o anfitrião encerra: resumo da sessão no celular.

## Comportamentos

- **Botão de falar (D29):** segurar fala, soltar para. Arrastar 64px para cima trava o microfone aberto; tocar em "Fechar" destrava. A instrução completa aparece só na primeira vez; depois, o rótulo é "Falar".
- **Volume do filme:** enquanto alguém fala, o volume do filme abaixa para todos e volta ao soltar. O nível ainda está em aberto (ver Em aberto).
- **Sincronia (D22):** atraso de até 2 s é corrigido sem aviso ("Ajustando o atraso"). Acima de 2 s, aparece "Voltar ao grupo".
- **Pausa (D19):** qualquer pessoa pausa para o grupo, e a TV mostra quem pausou. O anfitrião pode ativar "Só eu posso pausar".
- **Anfitrião sai (D20):** quem entrou primeiro assume, e a sessão continua.
- **Reconexão (D23):** ao voltar, a pessoa entra no ponto atual do grupo; os outros veem quem saiu e quem voltou.
- **Limite (D24):** 8 pessoas por sala. O link de uma sala cheia avisa antes de entrar.
- **Avisos na TV:** no máximo dois empilhados. Somem em 3 s, exceto "está falando", que fica enquanto a pessoa fala.
- **Celular deitado (R28):** só com o filme no celular. Em pé, o vídeo mostra "Gire para ver maior" até o primeiro giro.
  - Tela cheia: só o filme e o aviso de quem fala, no canto superior esquerdo.
  - Um toque no vídeo mostra os controles (título, sincronia, sair, progresso, pausa, reações, chat, participantes) e o botão de falar em vidro na borda direita, no alcance do polegar. Somem em 3 s; ficam enquanto o filme está pausado, uma folha está aberta ou alguém está com o microfone aberto.
  - O botão de falar em vidro continua visível enquanto a pessoa fala, mesmo com os controles escondidos.
  - Chat ou participantes: o vídeo encolhe à esquerda e a folha lateral abre à direita, sem cobrir a cena. O botão de falar vai para o rodapé da folha.
  - O giro do aparelho é animado em até 200 ms (D41).

## Casos de erro

| Situação | O que acontece |
| --- | --- |
| Convidado sem conta | Aviso antes de entrar: é preciso ter conta própria |
| Atraso até 2 s | Correção sem aviso |
| Atraso acima de 2 s | "Voltar ao grupo" |
| Anfitrião sai | Próximo a entrar assume |
| Sala cheia | Aviso no link, sem entrar |
| Sem TV | Assiste no celular com a camada social; deitado, o filme em tela cheia |
| Conexão cai | Volta no ponto atual do grupo; avisos de saída e volta |

## Conteúdo e tom

- Português do Brasil, frases curtas, tom de amigo, sem jargão técnico: "Ajustando o atraso", não "Ressincronizando buffer".
- Botões começam com verbo e têm até 3 palavras: "Assistir Junto", "Copiar link", "Voltar ao grupo".
- Caixa de frase em tudo.
- Avisos dizem quem e o quê: "Bruno entrou", "Ana pausou para o grupo".
- Erros dizem o que aconteceu e o que fazer: "A sala está cheia. Peça um novo convite ao anfitrião."
- Emoji só nas reações, no padrão do iPhone (D30).
- Conteúdo de exemplo: o título fictício "O Farol de Bruma" e as pessoas Ana, Bruno, Carla, Davi, Elisa e Fábio.

## Acessibilidade (D40)

- WCAG 2.1 AA em tudo: texto com contraste de 4.5:1 (3:1 a partir de 24px), bordas e ícones de significado com 3:1.
- Elementos reais: `button`, `a`, `input` com `label`. Nunca `onClick` em `div`.
- Todo botão só com ícone tem `aria-label` em português.
- Foco: anel de 2px em `focus` no celular; na TV, 4px e o controle cresce 6% (D31). Toda a TV funciona só com as setas e o OK do controle.
- Quem fala entra no nome acessível do avatar ("Bruno, falando"). Avisos da TV e do chat usam `role="status"`.

## Movimento (D41)

- Discreto e funcional: só para feedback (falando, reação enviada, aviso entrando ou saindo).
- Até 200 ms, com `ease-out` na entrada.
- Com `prefers-reduced-motion`, tudo para ou vira troca instantânea.

## Modo demonstração

O protótipo tem um modo que mostra cada tela num estado fixo, para gerar as imagens e o fluxo estático do case (D34). As telas aparecem dentro de uma moldura de celular genérica, no estilo iPhone (ilha, barra de status, indicador de início), sem logo nem imagem da Apple.

No modo protótipo, o celular fica sempre à esquerda, a TV no centro e os controles do facilitador à direita. Com o filme no celular, a TV sai, o celular vai para o centro e o botão "Girar aparelho" aparece fora da moldura.

As 15 telas, mais as variações 3b, 14b e 14c:

| # | Aparelho | Tela |
| --- | --- | --- |
| 1 | Celular | Página do título com "Assistir Junto" |
| 2 | Celular | Folha de convite |
| 3 | Celular | Convidado abre o link (aviso de conta própria; sala cheia como variação) |
| 4 | Celular | Lobby: quem está na sala, TV ou celular, "Começar" |
| 5 | TV | Lobby na TV |
| 6 | TV | Contagem regressiva |
| 7 | TV | Filme com "Bruno está falando" |
| 8 | Celular | Sessão, primeira vez, com instrução do botão de falar |
| 9 | Celular | Falando e arrastando para travar |
| 10 | Celular | Chat aberto |
| 11 | Celular | Participantes, visão do anfitrião |
| 12 | TV | Pausado por Ana |
| 13 | Celular | Atrás do grupo, com "Voltar ao grupo" |
| 14 | Celular | Sem TV: vídeo no celular com a camada social e "Gire para ver maior" |
| 14b | Celular deitado | Toque no vídeo: controles e botão de falar em vidro |
| 14c | Celular deitado | Vídeo encolhido e chat na folha lateral |
| 15 | Celular | Fim da sessão: resumo |

## Em aberto

- Quanto o volume do filme abaixa enquanto alguém fala. Proposta para testar: 30% do volume.

## Checklist antes de entregar

- [ ] Nenhum valor visual solto; só tokens.
- [ ] Nenhum componente novo fora do design system.
- [ ] Nenhuma mudança de estrutura sem aprovação.
- [ ] Contraste, foco e rótulos conferidos (AA).
- [ ] Movimento respeita `prefers-reduced-motion`.
- [ ] Lista de textos novos e de desvios no relatório.
