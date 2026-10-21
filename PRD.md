# PRD · Assistir Junto (MVP)

**Status do documento:** [ ] Definição | [ ] Design | [x] Implementação | [ ] Testado | [ ] Concluído

**Plataforma:** [x] Celular (390 × 844) | [x] TV (1920 × 1080) | [ ] Desktop

**Stack:** React 18.3.1 + Vite 5, design system Assistir Junto (`src/ds`)

**Autor:** Rubens Guilhon

**Data de criação:** 2026-10-19

**Última atualização:** 2026-10-20 (rev5). ChatComposer aprovado e ligado ao chat; R18 em Implementação (D49). Rev4: Celular deitado com o filme no celular (R28), moldura de celular no protótipo e nova disposição: celular à esquerda, TV no centro (D46 a D48). Rev3: Estrutura alinhada ao modelo de PRD de produto usado no trabalho do Rubens: contexto, fluxos com ponto de entrada e saída, mapa de estados por tela, componentes por tela, contrato do estado simulado, critérios de aceite por fluxo, pendências separadas e histórico de decisões. Mantidos da rev2: status por requisito, metas de validação e a tabela de fora do escopo com motivo.

**Como ler:** este arquivo diz o quê e por quê; o `design.md` diz como. Quem implementa, pessoa ou agente de IA, lê os dois. Os códigos `Dnn` apontam para o diário de decisões; `Rnn` e `Nnn` são requisitos; `Pnn` e `Mnn` são pendências.

> ### Status por fluxo
>
> | Fluxo | Status | Requisitos | Telas |
> | --- | --- | --- | --- |
> | **A · Anfitrião cria a sala e convida** | Implementação | R01, R02 | 1, 2 |
> | **B · Convidado entra pelo link** | Implementação (só no modo demonstração) | R03, R04 | 3, 3b |
> | **C · Lobby e início** | Implementação | R05 a R08 | 4, 5, 6 |
> | **D · Conversa durante o filme** | Implementação, com pendências | R09 a R18, R26 | 7, 8, 9, 10 |
> | **E · Pausa e controles do anfitrião** | Implementação | R19 a R21 | 11, 12 |
> | **F · Exceções: sem TV, atraso, queda** | Implementação | R22, R23, R25 | 13, 14 |
> | **F4 · Anfitrião sai** | Design (não programado) | R24 | sem tela própria |
> | **F5 · Filme no celular deitado** | Implementação | R28 | 14b, 14c |
> | **G · Fim da sessão** | Implementação | R27 | 15 |

## 1. Contexto e problema

### Qual é o problema que estamos resolvendo?

Grupos pequenos conseguem dar play ao mesmo tempo, mas a conversa fica fora da experiência: vai para o app de mensagem, para uma ligação paralela ou para depois do filme. Com o atraso entre aparelhos, assistir junto vira assistir em paralelo (D12).

### Quem é afetado?

| Perfil | Como é afetado |
| --- | --- |
| **Quem assiste à distância** | Conversa fora do filme: troca de app, pausa para digitar ou deixa para depois, e perde cena ou som |
| **Quem organiza a sessão** | Combina por mensagem, conta "3, 2, 1" e corrige o atraso de cada pessoa na mão |

### O que sabemos do discovery?

Sete entrevistas (P1 a P7). Só entram aqui os achados que definem comportamento:

- A voz foi pedida por 7 de 7; é a forma principal de conversa (D8, D14).
- 5 de 7 relatam problemas de sincronia ou conexão; a sincronia é a base, não um extra (D12, D22).
- Os grupos têm de 2 a 5 pessoas; ninguém citou salas com desconhecidos (D11, D24).
- As pessoas já combinam por mensagem; o convite por link segue esse hábito (D22).
- P2 pausa para comentar; a pausa precisa ser do grupo (D19).
- P7 já usa um segundo aparelho enquanto assiste; a segunda tela é um hábito, não uma imposição (D7).
- Nenhuma entrevista pediu reações; elas entram como hipótese a observar no teste (D15).

### O que acontece hoje?

- Cada pessoa dá play no próprio aparelho, depois de uma contagem por mensagem.
- A conversa acontece em outro app, por texto ou ligação, que disputa o som e a atenção com o filme.
- Quando alguém atrasa, o grupo pausa e tenta alinhar o ponto na mão.
- Não existe nada no produto que mostre quem está assistindo, quem falou ou quem pausou.

## 2. Objetivos

### O que queremos alcançar?

- O anfitrião cria a sala a partir do título e convida por link em menos de um minuto.
- Todos começam no mesmo ponto, com uma contagem única, e continuam juntos com correção automática de até 2 s.
- Quem assiste conversa por voz sem perder a cena: o filme fica na TV e a conversa fica no celular.
- Quem prefere não falar participa com reações e chat.
- O anfitrião organiza o grupo: pausa, trava a pausa, silencia e remove.
- Quem não tem TV participa pelo celular, com a mesma camada social.

### Metas de validação

A implementação está validada quando o protótipo atinge estas metas.

| O que se valida | Métrica | Meta | Como se mede |
| --- | --- | --- | --- |
| Criar a sala e convidar | Tempo da tarefa | Menos de 60 s | Teste de usabilidade |
| Usar sem ajuda | Sucesso por tarefa | 80% ou mais | Teste de usabilidade |
| Facilidade de uso | SUS | 75 ou mais | Teste de usabilidade |
| Sincronia entre aparelhos | Atraso corrigido sem aviso | Até 2 s; acima disso, "Voltar ao grupo" | Protótipo, com atraso simulado (R22) |
| Legibilidade na TV | Avisos lidos de relance | 9 de 10 a 3 m | Teste de leitura (N01): 30 de 30 |

### O que está fora do escopo do MVP?

Nada abaixo deve ser implementado nesta versão. Se uma tarefa parecer exigir algum destes itens, pare e pergunte.

| Item | Por que fica de fora | Origem |
| --- | --- | --- |
| Chamada de vídeo entre participantes | A conversa é por voz para não disputar a tela com o filme | D8 |
| Salas públicas ou com desconhecidos | O público são grupos próximos | D11 |
| Salas com mais de 8 pessoas | Limite do MVP | D24 |
| Escolher em grupo o que assistir | É outro problema; fica como oportunidade futura | D13 |
| Desktop e navegador como superfície de uso | O MVP é celular e TV | D7 |
| Fórum ou discussão depois do filme | Apareceu só de forma parcial na pesquisa | D14 |
| Convite por perfil ou lista de contatos | O convite é por link | D22 |
| Servidor, contas e login reais | O protótipo simula a sala no navegador | D35 |
| Voz e áudio reais no protótipo | O protótipo não capta nem toca som; a regra do volume (R13) está só no design | D35 |
| Sincronia real entre aparelhos | O protótipo simula atraso e correção | D35 |
| Assinatura, pagamento ou cadastro | Cada pessoa usa a própria conta | D22 |
| Marca Netflix (logo, Netflix Sans, #E50914, imagens de títulos reais) | Conceito não oficial | D5 |

## 3. Usuários e contextos

### Perfis e permissões

| Papel | Aparelho | Pode | Não pode | Requisitos |
| --- | --- | --- | --- | --- |
| **Anfitrião** | Celular, com o filme na TV ou no próprio celular | Criar a sala, convidar, começar, pausar, travar a pausa, silenciar e remover pessoas, encerrar | Sair sem passar o papel: ao sair, o papel vai para quem entrou primeiro | R01, R02, R07, R19 a R21, R24, R27 |
| **Convidado** | Celular, com o filme na TV ou no próprio celular | Entrar pelo link, escolher o aparelho, falar, reagir, conversar, pausar quando a pausa não estiver travada | Começar, travar a pausa, silenciar ou remover alguém | R03 a R06, R09 a R19, R23, R25 |
| **TV da sala** | TV pareada a um celular | Mostrar lobby, contagem, filme sincronizado e avisos | Receber comandos de conversa; toda interação social acontece no celular | R08, R12, R19, R22, R26 |

Referência de uso: casal ou grupo de 2 a 4 pessoas, cada uma com a própria conta; no máximo 8 por sala (D11, D24). Uso sob demanda, em sessões de um filme ou episódio.

### Restrições de contexto

- **Sala escura e atenção no filme:** o celular é olhado de relance; ações da sessão precisam funcionar com uma mão e sem leitura longa. Movimento só como feedback, até 200 ms (D41).
- **Leitura a 3 m:** na TV, nada abaixo de 20 px; avisos em 24 px; no máximo dois avisos ao mesmo tempo (D33, R26).
- **Som compartilhado:** voz e filme disputam o mesmo ouvido; o filme baixa enquanto alguém fala (R13).
- **Controle remoto:** a TV só tem setas e OK; o foco é o único sinal de seleção (D31, N03).
- **Conexão variável:** cada pessoa tem um atraso diferente; quedas precisam de volta automática ao ponto do grupo (D22, D23).
- **Acessibilidade:** WCAG 2.1 AA em todas as telas, inclusive na TV (D40).
- **Diretrizes de construção:** só componentes e tokens do design system; mudança de estrutura pede aprovação; texto novo é listado para revisão (D36 a D39, `design.md`).

## 4. Fluxos

### Fluxo A · Anfitrião cria a sala e convida

> **Implementação.** Telas 1 e 2.

**Ponto de entrada:** página do título no celular.

1. O anfitrião toca em "Assistir Junto", o único botão primário da página (R01).
2. O sistema abre a folha de convite com o link da sala e a contagem "x de 8 pessoas na sala" (R02).
3. O anfitrião toca em "Copiar link" (o botão vira "Link copiado") ou em "Compartilhar", que abre a folha de compartilhamento do sistema.
4. Ao compartilhar, o sistema leva o anfitrião ao lobby.

**Ponto de saída:** lobby no celular, com o anfitrião na lista.

### Fluxo B · Convidado entra pelo link

> **Implementação, só no modo demonstração.** Telas 3 e 3b. No modo protótipo, os convidados entram sozinhos, simulados.

**Ponto de entrada:** link da sala aberto no celular do convidado.

1. O sistema mostra quem chamou, o título e o aviso de que a pessoa entra com a própria conta (R03).
2. O convidado toca em "Entrar na sala" e vai para o lobby, ou em "Agora não".
3. Se a sala já tem 8 pessoas, o sistema mostra que está cheia; "Sala cheia" fica desabilitado e só resta "Voltar ao início" (R04).

**Ponto de saída:** lobby no celular, ou a página inicial se a sala estiver cheia.

### Fluxo C · Lobby e início

> **Implementação.** Telas 4, 5 e 6.

**Ponto de entrada:** lobby, depois do convite ou do link.

1. O lobby lista cada pessoa com avatar, coroa do anfitrião e aparelho: "na TV", "no celular" ou "entrando…", e a contagem "x de 8" (R05).
2. Cada pessoa responde "Onde você vai assistir?" com "Na TV" ou "No celular"; a escolha aparece na lista na hora (R06).
3. A TV de quem escolheu "Na TV" mostra o título, a instrução de entrar pelo celular, quem já entrou e "esperando o anfitrião começar" (R08).
4. Só o anfitrião vê "Começar" e "Convidar mais pessoas" (R07).
5. O anfitrião toca em "Começar"; todos veem 3, 2, 1 ao mesmo tempo, e o filme começa junto.

**Ponto de saída:** sessão em andamento.

### Fluxo D · Conversa durante o filme

> **Implementação, com pendências:** R13 em Design; R14 e R16 em Definição. Telas 7 a 10.

**Ponto de entrada:** sessão em andamento.

1. Na primeira vez, o botão de falar diz "Segure para falar" e mostra a dica de arrastar; depois, só "Falar" (R11).
2. A pessoa segura o botão: o microfone abre, o botão mostra "Falando…" e o avatar dela ganha o anel verde (R09, R12).
3. A TV mostra "Nome está falando" enquanto durar a fala (R12, R26).
4. O volume do filme baixa para todos enquanto alguém fala e volta ao soltar (R13; nível em R14).
5. Segurando, a pessoa arrasta 64 px para cima e o microfone trava aberto ("Microfone aberto"); "Fechar" destrava (R10).
6. A pessoa solta o botão e o microfone fecha.
7. Para reagir, a pessoa toca em uma das cinco reações; a escolhida fica marcada por 1 s (R15). A exibição na TV está em definição (R16).
8. Para o chat, a pessoa toca no ícone de chat e a folha abre com mensagens (autor e hora) e avisos do sistema (R17). No rodapé da folha, a pessoa escreve no campo e envia pelo botão ou pelo Enter; a mensagem aparece na hora como "Você" e a lista desce até ela (R18).

**Ponto de saída:** a sessão continua.

### Fluxo E · Pausa e controles do anfitrião

> **Implementação.** Telas 11 e 12.

**Ponto de entrada:** sessão em andamento.

1. Qualquer pessoa toca em pausar; o filme pausa para todos (R19).
2. A TV mostra "Nome pausou para o grupo" e a barra de progresso; o chat registra a pausa.
3. Qualquer pessoa toca em retomar e o filme volta para todos.
4. O anfitrião abre o painel de participantes e ativa "Só eu posso pausar"; os outros veem o botão desabilitado e "Só Nome pode pausar agora" (R20).
5. No mesmo painel, o anfitrião silencia ou remove qualquer pessoa, menos ele mesmo; a remoção aparece no chat (R21).

**Ponto de saída:** a sessão continua.

### Fluxo F · Exceções

> **Implementação**, menos F4, que está em Design. Telas 13 e 14.

**F1 · Sem TV (R23).** Quem escolhe "No celular" no lobby segue o mesmo fluxo, com o vídeo no topo do celular, o aviso de quem fala sobre o vídeo e os mesmos controles. O vídeo mostra "Gire para ver maior" até o primeiro giro (F5). A TV dessa pessoa mostra "Assistindo no celular".

**F2 · Atraso (R22).**

1. Atraso de até 2 s: o indicador mostra "Ajustando o atraso" e o sistema corrige sozinho em até 2 s.
2. Atraso acima de 2 s: o indicador mostra "x s atrás do grupo" e o botão "Voltar ao grupo".
3. A pessoa toca em "Voltar ao grupo" e volta ao ponto atual.

**F3 · Queda de conexão (R25).**

1. A pessoa cai; a TV e o chat avisam "Nome saiu".
2. Ao reconectar, a pessoa entra no ponto atual do grupo, não de onde parou.
3. A TV e o chat avisam "Nome voltou".

**F4 · Anfitrião sai (R24, não programado).**

1. O anfitrião sai da sala.
2. Quem entrou primeiro vira anfitrião, recebe a coroa e os controles.
3. O chat avisa a troca e a sessão continua para todos.

**F5 · Filme no celular deitado (R28).**

1. Com o filme no celular, a pessoa gira o aparelho; o giro é animado em até 200 ms.
2. O filme ocupa a tela inteira, com o aviso de quem fala no canto superior esquerdo. Nenhum controle aparece.
3. A pessoa toca no vídeo: aparecem os controles (título, sincronia, sair, progresso, pausa, reações, chat, participantes) e o botão de falar em vidro na borda direita.
4. Sem novo toque, os controles somem em 3 s. Ficam enquanto o filme está pausado, uma folha está aberta ou o microfone está aberto.
5. A pessoa segura o botão de falar em vidro; ele fica visível enquanto ela fala, mesmo com os controles escondidos.
6. A pessoa toca em chat ou participantes: o vídeo encolhe à esquerda e a folha lateral abre à direita, com o botão de falar no rodapé.
7. A pessoa fecha a folha e o vídeo volta à tela cheia.
8. A pessoa gira o aparelho de volta e retoma a sessão em pé. No fim da sessão, o celular volta em pé.

**Ponto de saída:** a sessão continua.

### Fluxo G · Fim da sessão

> **Implementação.** Tela 15.

**Ponto de entrada:** fim do filme, ou o anfitrião encerra.

1. O sistema encerra a sessão para todos.
2. O celular mostra "Vocês assistiram juntos", quem assistiu, tempo juntos e mensagens no chat (R27).
3. A TV mostra "Fim da sessão".
4. A pessoa toca em "Assistir junto de novo" ou em "Voltar ao início".

**Ponto de saída:** página do título.

## 5. Mapa de estados por tela

### Enums do estado da sala

| Campo | Valor | Exibido como | Significado |
| --- | --- | --- | --- |
| `phase` | `title` | Página do título | Antes de criar a sala |
| `phase` | `lobby` | Lobby | Sala criada, esperando o anfitrião começar |
| `phase` | `countdown` | 3, 2, 1 | Contagem única para todos |
| `phase` | `session` | Sessão | Filme rodando ou pausado para o grupo |
| `phase` | `ended` | Fim da sessão | Fim do filme ou encerrado pelo anfitrião |
| `ptt` | `idle` | "Segure para falar" ou "Falar" | Microfone fechado |
| `ptt` | `talking` | "Falando…" | Segurando o botão |
| `ptt` | `locked` | "Microfone aberto" | Trava ativada pelo arraste |
| `ptt` | `muted` | Botão desabilitado | Silenciado pelo anfitrião |
| `sync` | `synced` | Ícone de sincronizado | No mesmo ponto do grupo |
| `sync` | `correcting` | "Ajustando o atraso" | Atraso de até 2 s, corrigindo sozinho |
| `sync` | `behind` | "x s atrás do grupo" | Atraso acima de 2 s |
| `device` | `tv` / `phone` / `null` | "na TV" / "no celular" / "entrando…" | Onde a pessoa assiste |
| `sheet` | `invite` / `chat` / `people` / `null` | Folha aberta | Uma folha por vez |
| `orientation` | `portrait` / `landscape` | Em pé / deitado | Deitado só com o filme no celular |
| `controls` | `true` / `false` | Controles sobre o vídeo | Só com o celular deitado; somem em 3 s |
| `rotated` | `true` / `false` | Dica de girar | Some depois do primeiro giro |

### Telas 1 e 2 · Página do título e folha de convite (celular)

| Estado | Gatilho | Comportamento esperado |
| --- | --- | --- |
| **Default** | Abrir o título | "Assistir Junto" como único botão primário; "Assistir sozinho" como secundário |
| **Folha de convite** | Tocar em "Assistir Junto" | Folha com o link, "Copiar link", "Compartilhar" e "x de 8 pessoas na sala" |
| **Link copiado** | Tocar em "Copiar link" | O botão vira "Link copiado" até a folha fechar |
| **Compartilhado** | Tocar em "Compartilhar" | Folha do sistema; ao voltar, o celular vai para o lobby |

### Telas 3 e 3b · Convite pelo link (celular do convidado)

| Estado | Gatilho | Comportamento esperado |
| --- | --- | --- |
| **Default** | Abrir o link | Quem chamou, o título, aviso de conta própria, "Entrar na sala" e "Agora não" |
| **Sala cheia** | Sala com 8 pessoas | Aviso de sala cheia, "Sala cheia" desabilitado e "Voltar ao início" |

### Tela 4 · Lobby (celular)

| Estado | Gatilho | Comportamento esperado |
| --- | --- | --- |
| **Default** | Entrar no lobby | Lista de pessoas com aparelho e contagem "x de 8" |
| **Pessoa entrando** | Alguém abre o link | A pessoa aparece com "entrando…"; a TV e o chat avisam "Nome entrou" |
| **Aparelho escolhido** | Tocar em "Na TV" ou "No celular" | A lista atualiza na hora |
| **Visão do anfitrião** | Ser o anfitrião | "Começar" e "Convidar mais pessoas" visíveis |
| **Visão do convidado** | Ser convidado | Sem "Começar"; texto de espera pelo anfitrião |
| **Contagem** | O anfitrião toca em "Começar" | O celular acompanha o 3, 2, 1 da TV |

### Telas 5, 6, 7 e 12 · TV

| Estado | Gatilho | Comportamento esperado |
| --- | --- | --- |
| **Antes da sala** | `phase: title` | Nome do título e "Escolha um título no celular e toque em Assistir Junto" |
| **Lobby** | `phase: lobby` | Título, instrução, avatares de quem entrou, "x de 8 na sala · esperando Nome começar" |
| **Contagem** | `phase: countdown` | Countdown com 3, 2, 1 e os avatares |
| **Filme rodando** | `playing: true` | Só o filme e os avisos no canto, no máximo dois |
| **Alguém falando** | `speakingId` definido | Aviso "Nome está falando" enquanto durar a fala |
| **Pausado** | `playing: false` | Cena escurecida, título, barra de progresso e "Nome pausou para o grupo" até retomar |
| **Entrou, saiu, voltou** | `join`, `leave`, `back` | Aviso que some em 3 s |
| **Assistindo no celular** | A pessoa escolheu "No celular" | "Assistindo no celular" e como trazer o filme para a TV |
| **Fim** | `phase: ended` | "Fim da sessão" e "Obrigado por assistir junto" |

### Telas 8 a 11, 13 e 14 · Sessão (celular)

| Estado | Gatilho | Comportamento esperado |
| --- | --- | --- |
| **Primeira vez** | `firstTalk: true` | Botão "Segure para falar" com a dica de arrastar |
| **Default** | Depois da primeira fala | Título, aparelho, número de pessoas, sincronia, avatares, progresso, pausar, chat, participantes, reações e "Falar" |
| **Falando** | Segurar o botão | "Falando…", anel verde no próprio avatar, dica de arrastar para travar |
| **Microfone travado** | Arrastar 64 px para cima | "Microfone aberto" e "Fechar" |
| **Outra pessoa falando** | `otherSpeaks` | Anel verde no avatar de quem fala |
| **Reação escolhida** | Tocar numa reação | A reação fica marcada por 1 s |
| **Chat aberto** | Tocar no ícone de chat | Folha com mensagens e avisos do sistema e o campo de mensagem no rodapé (R18) |
| **Escrevendo** | Digitar no campo | Enviar ganha fundo `accent`; vazio, fica desabilitado; contador "x/200" a partir de 180 |
| **Participantes** | Tocar no ícone de pessoas | Painel com a lista; para o anfitrião, trava da pausa, silenciar e remover |
| **Pausa travada** | `pauseLocked: true` e não ser anfitrião | Botão de pausa desabilitado e "Só Nome pode pausar agora" |
| **Ajustando** | `sync: correcting` | "Ajustando o atraso"; volta a sincronizado em 2 s |
| **Atrás do grupo** | `sync: behind` | "x s atrás do grupo" e "Voltar ao grupo" |
| **Sem TV** | `device: phone` | Vídeo no topo, com o último aviso sobre ele |

### Telas 14b e 14c · Filme no celular deitado

| Estado | Gatilho | Comportamento esperado |
| --- | --- | --- |
| **Tela cheia** | Girar o aparelho, ou controles escondidos | Só o filme e o último aviso no canto superior esquerdo |
| **Controles visíveis** | Tocar no vídeo | Título, sincronia, sair, progresso, pausa, reações, chat, participantes e botão de falar em vidro; somem em 3 s |
| **Primeira vez** | `firstTalk: true` com os controles visíveis | Dica em vidro ao lado do botão: "Segure para falar · arraste para cima para travar" |
| **Falando** | Segurar o botão em vidro | Botão em `accent` com anel; continua visível com os controles escondidos |
| **Pausado** | `playing: false` | Controles ficam visíveis até retomar |
| **Chat aberto** | Tocar em chat | Vídeo encolhe à esquerda; folha lateral com mensagens e botão de falar no rodapé |
| **Participantes** | Tocar em participantes | Vídeo encolhe à esquerda; painel lateral com os controles do anfitrião |
| **Em pé de novo** | Girar de volta, ou fim da sessão | Volta para a sessão em pé (tela 14) |

### Tela 15 · Fim da sessão (celular)

| Estado | Gatilho | Comportamento esperado |
| --- | --- | --- |
| **Resumo** | `phase: ended` | "Vocês assistiram juntos", quem assistiu, tempo juntos, mensagens, "Assistir junto de novo" e "Voltar ao início" |

## 6. Componentes e design system

### Componentes em uso

Todos vêm de `src/ds`. Componente que não estiver aqui não pode ser criado nas telas: entra primeiro no design system, com aprovação (D36).

| Componente | Variante ou configuração | Onde aparece |
| --- | --- | --- |
| Button | `primary`, `secondary`, `ghost`; `block`; `size lg` | Título, convite, lobby, fim, facilitador |
| IconButton | `size lg` para pausar; `active` quando pausado | Sessão (pausar, chat, participantes, sair) |
| ParticipantAvatar | Iniciais sobre cor 1 a 6; `host`, `muted`, `speaking`; `size tv` | Lobby, sessão, TV |
| PushToTalk | `idle`, `talking`, `locked`, `muted`; `showHint` na primeira vez; `variant="glass"` compacto em vidro | Sessão; vidro no celular deitado |
| ReactionBar | Cinco reações; `selected` por 1 s | Sessão |
| ChatMessage | `message` (autor, cor, hora, `mine`) e `system` | Folha de chat |
| SyncIndicator | `synced`, `correcting`, `behind` com `onRejoin` | Sessão |
| PlayerProgress | Celular e `size tv` | Sessão, TV pausada |
| InviteSheet | Link, copiar, compartilhar, contagem | Tela 2 |
| LobbyList | Pessoa, aparelho e anfitrião | Tela 4 |
| ParticipantPanel | `isHost`, `pauseLocked`, silenciar, remover; `placement="side"` | Telas 11 e 14c |
| Countdown | 3, 2, 1 com participantes | Tela 6 |
| TvNotice | `speaking`, `paused`, `joined`, `left`, `back` | TV e vídeo no celular |
| Sheet | Folha com título e fechar; `placement="side"` ao lado do vídeo | Chat, em pé e deitado |
| Switch | Trava da pausa | Painel de participantes |
| Icon | Conjunto do design system | Todas as telas |
| ChatComposer | Campo e enviar; Enter envia; limite de 200 com contador a partir de 180 | Rodapé do chat, em pé e deitado (R18) |

### Tokens aplicados

Só tokens; nenhum valor visual solto no código (D38). Fonte: `src/ds/tokens.json`, gerado em `src/ds/tokens.css`.

| Grupo | Tokens | Regra |
| --- | --- | --- |
| Superfície | `--surface`, `--surface-raised`, `--surface-sheet`, `--surface-control`, `--surface-hover` | Tema escuro em tudo |
| Texto | `--ink`, `--ink-muted`, `--ink-subtle`, `--on-accent`, `--on-avatar` | Contraste AA |
| Acento | `--accent` (#D92B38), `--accent-pressed`, `--accent-text` (#FF5A64) | Só ação principal e destaque; nunca #E50914 |
| Fala | `--speaking` (#46D369) | Exclusivo de quem está falando (D28) |
| Status | `--status-warn`, `--status-danger` | Atraso e erro |
| Avatar | `--avatar-1` a `--avatar-6` | Cor fixa por pessoa |
| Linha e foco | `--line-subtle`, `--line-strong`, `--focus` | Foco de 4 px na TV (D31) |
| Camadas | `--scrim`, `--scrim-strong`, `--veil`, `--veil-strong`, `--shadow-sheet`, `--shadow-overlay` | Folhas e cena pausada |
| Vidro | `--glass`, `--glass-line` | Controles flutuando sobre o vídeo em tela cheia |
| Espaço e forma | `--space-1` a `--space-8`, `--radius-sm` a `--radius-pill` | Escala única |
| Medidas | `--touch-target` (48 px), `--tv-safe-x`, `--tv-safe-y` | Alvo no celular e área segura na TV |
| Tipografia | `--font-sans` (Inter) | Escala do design system (D26) |

## 7. Comportamentos e interações

### Botão de falar

| Ação | Resultado |
| --- | --- |
| Segurar | Abre o microfone, `ptt: talking`, anel verde, aviso na TV |
| Soltar | Fecha o microfone, `ptt: idle`, tira o aviso; a dica da primeira vez some |
| Segurar e arrastar 64 px para cima | Trava, `ptt: locked`; continua falando sem segurar |
| Tocar em "Fechar" com a trava | Destrava e fecha o microfone |
| Silenciado pelo anfitrião | Botão desabilitado |

### Volume do filme durante a fala

Enquanto alguém fala, o filme baixa para todos e volta ao soltar. Proposta de nível: 30% (`DUCK_LEVEL = 0.3`), ainda em definição (R14). No protótipo, sem áudio, a regra só existe como constante.

### Sincronia

| Atraso | Indicador | Ação |
| --- | --- | --- |
| 0 s | Sincronizado | Nenhuma |
| Até 2 s (`SYNC_LIMIT_S`) | "Ajustando o atraso" | Correção sozinha em 2 s |
| Acima de 2 s | "x s atrás do grupo" | "Voltar ao grupo" leva ao ponto atual |

### Avisos na TV

- No máximo dois empilhados no canto; o mais novo substitui o mais antigo.
- Somem em 3 s, menos "está falando", que fica enquanto a pessoa fala, e "pausou", que fica até retomar.
- Uma pessoa tem no máximo um aviso de fala por vez.
- No celular sem TV, só o último aviso aparece sobre o vídeo.

### Pausa

- Qualquer pessoa pausa e retoma para o grupo, a não ser que a pausa esteja travada.
- Com a trava, só o anfitrião pausa; os outros veem o botão desabilitado e o motivo.
- Toda pausa fica registrada no chat como aviso do sistema.

### Entrada, saída e volta

- `join` recusa a 9ª pessoa e quem já está na sala.
- Entrar, sair, voltar e ser removido geram aviso no chat; entrar, sair e voltar geram aviso na TV.
- Quem volta entra no ponto atual do grupo.

### Celular deitado

| Situação | Resultado |
| --- | --- |
| Girar com o filme no celular | Tela cheia, sem controles; giro animado em até 200 ms |
| Tocar no vídeo | Mostra ou esconde os controles e o botão de falar em vidro |
| 3 s sem toque | Os controles somem, menos com pausa, folha aberta ou microfone aberto |
| Abrir chat ou participantes | O vídeo encolhe e a folha lateral abre; o botão de falar vai para o rodapé da folha |
| Fim da sessão ou trocar para "Na TV" | O celular volta em pé |

### Feedbacks

- Toda mudança de estado aparece na própria tela, junto do controle ou como aviso discreto; não há alerta modal.
- Mensagens do sistema no chat registram o que aconteceu com o grupo: entrou, saiu, voltou, pausou, foi removido.
- Movimento só como feedback, até 200 ms; com "reduzir movimento", tudo para (D41).

## 8. Dependências técnicas

### Estado simulado

O protótipo não tem servidor. A sala inteira é um estado em `src/session/session.js`, mudado por ações num reducer; cada tela é função desse estado. O modo demonstração (`#demo`) fixa um estado por tela.

```js
// initialState()
{
  phase: 'title',          // title | lobby | countdown | session | ended
  sheet: null,             // invite | chat | people | null
  copied: false,
  people: [{ id, name, short, color, host, me, device, muted }], // device: tv | phone | null
  countdown: 3,
  position: 2292,          // segundos do filme
  playing: false,
  pausedBy: null,          // id de quem pausou
  pauseLocked: false,
  ptt: 'idle',             // idle | talking | locked | muted
  firstTalk: true,
  speakingId: null,
  sync: 'synced',          // synced | correcting | behind
  delay: 0,                // segundos de atraso
  notices: [],             // { id, kind, name, color, personId }, no máximo 2
  messages: [],            // { id, kind: 'system' | 'message', text, from?, time? }
  reaction: null,
  orientation: 'portrait', // portrait | landscape
  controls: false,         // controles sobre o vídeo deitado
  rotated: false           // já girou uma vez
}
```

Constantes: `MAX_PEOPLE = 8`, `SYNC_LIMIT_S = 2`, `DUCK_LEVEL = 0.3`, `TITLE` ("O Farol de Bruma", 6152 s).

### Ações

| Ação | Payload | Efeito | Requisito |
| --- | --- | --- | --- |
| `openInvite` | | Abre a folha de convite | R01 |
| `copyLink` | | Marca o link como copiado | R02 |
| `share` | | Fecha a folha e vai para o lobby | R02 |
| `join` | `id`, `device?` | Entra na sala, com aviso; recusa acima de 8 | R04, R05 |
| `setDevice` | `id`, `device` | Muda o aparelho da pessoa | R06 |
| `start` | | Começa a contagem | R07 |
| `tickCountdown` | | Desce a contagem; no fim, começa o filme | R07 |
| `tick` | | Avança 1 s; no fim do filme, encerra | R27 |
| `pttStart` / `pttEnd` | | Abre e fecha a própria fala | R09, R12 |
| `pttLock` / `pttUnlock` | | Trava e destrava o microfone | R10 |
| `otherSpeaks` / `otherStops` | `id` | Fala de outra pessoa | R12 |
| `otherReacts` / `clearOtherReaction` | `id`, `emoji`, `label` | Reação de outra pessoa: emoji no avatar e aviso na TV por 2 s (proposta) | R16 |
| `pause` / `resume` | `id` | Pausa e retoma para o grupo | R19 |
| `toggleLock` | | Trava ou destrava a pausa | R20 |
| `mute` / `remove` | `id` | Silencia ou remove | R21 |
| `fallBehind` | `delay` | Simula atraso; até 2 s corrige, acima fica atrás | R22 |
| `resync` | | Volta ao ponto do grupo | R22 |
| `leave` / `back` | `id`, `device?` | Simula queda e volta | R25 |
| `react` / `clearReaction` | `label` | Marca e desmarca a reação | R15 |
| `message` | `id`, `text`, `time` | Mensagem no chat | R17 |
| `dismissNotice` | `id` | Tira um aviso da TV | R26 |
| `rotate` | | Gira o celular; deitado começa em tela cheia, sem folha aberta | R28 |
| `showControls` / `hideControls` | | Mostra e esconde os controles sobre o vídeo deitado | R28 |
| `openSheet` / `closeSheet` | `sheet` | Abre e fecha folhas | R17, R21 |
| `end` | | Encerra para todos | R27 |
| `reset` | | Volta ao estado inicial | |

Os controles do facilitador (modo protótipo) disparam essas ações para simular o que os outros fariam; não fazem parte da interface.

### Dependências para a versão real

Nada disso existe no protótipo; fica registrado para quem for além dele.

| Dependência | O que exige | Bloqueia |
| --- | --- | --- |
| Servidor de sala | Distribuir as ações acima entre aparelhos, com uma fonte única do estado | Tudo fora do protótipo |
| Sincronia real | Relógio comum e correção contínua do ponto do filme | R22, R25 |
| Mistura de áudio | Controle do volume no player da TV e do celular durante a fala | R13, R14 |
| Voz em tempo real | Captação, transmissão e meta de latência (em definição) | R09, R10 |
| Pareamento celular e TV | O celular encontra e controla a TV, no padrão de transmitir (D18) | R08, C |
| Navegação por controle remoto | Setas e OK chegando a tudo na TV | N03 |

## 9. Critérios de aceite

Cada requisito passa por cinco status, nesta ordem; só o Rubens move um requisito para Concluído. Atualize a coluna Status a cada entrega.

| Status | Significa | Passa para o próximo quando |
| --- | --- | --- |
| Definição | Ainda falta decisão sobre o que fazer | O Rubens decide e a decisão entra no diário |
| Design | Decidido; existe no design system ou no design.md, mas não no protótipo | Funciona no protótipo |
| Implementação | Funciona no protótipo e aguarda validação com pessoas | Passa nos critérios abaixo e no teste de usabilidade |
| Testado | Validado com pessoas; pode precisar de ajuste | O Rubens aprova o resultado |
| Concluído | Testado e aprovado | |

### Fluxo A · Criar a sala e convidar

| ID | Critério de aceite | Origem | Status |
| --- | --- | --- | --- |
| R01 | Dado que a pessoa está na página do título, então "Assistir Junto" é o único botão primário e o toque abre a folha de convite | D18 | Implementação |
| R02 | Dado que a folha de convite está aberta, quando a pessoa toca em "Copiar link", então o botão vira "Link copiado"; quando toca em "Compartilhar", então abre a folha do sistema; a folha sempre mostra "x de 8 pessoas na sala" | D22, D24 | Implementação |

### Fluxo B · Entrar pelo link

| ID | Critério de aceite | Origem | Status |
| --- | --- | --- | --- |
| R03 | Dado que o convidado abre o link, então vê quem chamou, o título e o aviso de conta própria antes de "Entrar na sala" | D22 | Implementação |
| R04 | Dado que a sala tem 8 pessoas, quando alguém abre o link, então vê que está cheia e o botão de entrar fica desabilitado | D24 | Implementação |

### Fluxo C · Lobby e início

| ID | Critério de aceite | Origem | Status |
| --- | --- | --- | --- |
| R05 | Dado que a pessoa está no lobby, então vê cada pessoa com avatar, anfitrião e aparelho ("na TV", "no celular", "entrando…") e a contagem "x de 8" | D18, D21 | Implementação |
| R06 | Dado que a pessoa escolhe "Na TV" ou "No celular", então a escolha aparece na lista na hora | D21 | Implementação |
| R07 | Dado que o anfitrião toca em "Começar", então todos veem 3, 2, 1 ao mesmo tempo e o filme começa junto; convidados não veem "Começar" | D18 | Implementação |
| R08 | Dado que a sala está no lobby, então a TV mostra o título, a instrução de entrar pelo celular, quem já entrou e "esperando o anfitrião começar" | D7 | Implementação |

### Fluxo D · Conversa durante o filme

| ID | Critério de aceite | Origem | Status |
| --- | --- | --- | --- |
| R09 | Dado que a pessoa segura o botão, então o microfone abre e aparece "Falando…"; quando solta, então fecha | D8, D29 | Implementação |
| R10 | Dado que a pessoa está segurando, quando arrasta 64 px para cima, então o microfone trava ("Microfone aberto"); quando toca em "Fechar", então destrava | D29 | Implementação |
| R11 | Dado que a pessoa ainda não falou, então o botão diz "Segure para falar" com a dica de arrastar; depois da primeira fala, só "Falar" | D29 | Implementação |
| R12 | Dado que alguém fala, então o avatar ganha o anel verde no celular e a TV mostra "Nome está falando" | D27, D28 | Implementação |
| R13 | Dado que alguém fala, então o volume do filme cai para todos e volta ao soltar | Princípios do design.md | Design |
| R14 | Dado que o nível de volume foi testado, então ele está registrado no diário; proposta de 30% | Em aberto | Definição |
| R15 | Dado que a pessoa toca numa das cinco reações, então a reação fica marcada por 1 s | D15, D30 | Implementação |
| R16 | Dado que alguém reage, então a TV mostra a reação na forma decidida. Proposta simulada no protótipo para avaliação: aviso "Nome reagiu 😱" na TV e o emoji sobre o avatar no celular, por 2 s (telas 7b e 10b; facilitador "Bruno escreve e Carla reage") | Em aberto | Definição |
| R17 | Dado que a pessoa abre o chat, então vê as mensagens (autor e hora) e os avisos do sistema (entrou, saiu, pausou) | D8 | Implementação |
| R18 | Dado que o campo está vazio, então enviar fica desabilitado; dado que a pessoa escreve e envia pelo botão ou pelo Enter, então o campo limpa e a mensagem aparece na hora para o grupo, como "Você"; dado que passa de 180 caracteres, então aparece o contador, com limite de 200. Mensagens não aparecem na TV | D8, D36, D49 | Implementação |
| R26 | Dado que há avisos na TV, então ficam no máximo dois no canto e somem em 3 s, menos "está falando" e "pausou" | design.md | Implementação |

### Fluxo E · Pausa e controles do anfitrião

| ID | Critério de aceite | Origem | Status |
| --- | --- | --- | --- |
| R19 | Dado que qualquer pessoa pausa, então o filme pausa para todos e a TV mostra "Nome pausou para o grupo" e a barra de progresso | D19 | Implementação |
| R20 | Dado que o anfitrião ativa "Só eu posso pausar", então os outros veem o botão desabilitado e o aviso | D19 | Implementação |
| R21 | Dado que o anfitrião abre o painel, então pode silenciar ou remover qualquer pessoa, menos ele mesmo | D8 | Implementação |

### Fluxo F · Exceções

| ID | Critério de aceite | Origem | Status |
| --- | --- | --- | --- |
| R22 | Dado um atraso de até 2 s, então aparece "Ajustando o atraso" e a correção é sozinha; dado um atraso maior, então aparecem "x s atrás do grupo" e "Voltar ao grupo". No protótipo, o atraso é simulado | D22, D28 | Implementação |
| R23 | Dado que a pessoa escolheu "No celular", então vê o vídeo no topo, o aviso de quem fala sobre ele, os mesmos controles e "Gire para ver maior" até o primeiro giro | D21, D46 | Implementação |
| R24 | Dado que o anfitrião sai, então quem entrou primeiro vira anfitrião, recebe a coroa e os controles, e a sessão continua | D20 | Design |
| R28 | Dado que o filme está no celular e a pessoa gira o aparelho, então o filme ocupa a tela inteira; quando toca no vídeo, então aparecem os controles e o botão de falar em vidro, que somem em 3 s; quando abre chat ou participantes, então o vídeo encolhe e a folha lateral abre ao lado | D46, D47 | Implementação |
| R25 | Dado que a pessoa reconecta, então entra no ponto atual do grupo, e a TV e o chat mostram "saiu" e "voltou" | D23 | Implementação |

### Fluxo G · Fim da sessão

| ID | Critério de aceite | Origem | Status |
| --- | --- | --- | --- |
| R27 | Dado que o filme acaba ou o anfitrião encerra, então o celular mostra quem assistiu, tempo juntos e mensagens, com "Assistir junto de novo" | Fluxo | Implementação |

### Não funcionais

| ID | Critério de aceite | Origem | Status |
| --- | --- | --- | --- |
| N01 | Na TV, nada abaixo de 20 px e avisos em 24 px; 9 de 10 avisos lidos de relance a 3 m. Resultado: 3 pessoas, 30 de 30 | D33 | Concluído |
| N02 | WCAG 2.1 AA: contraste 4.5:1 no texto e 3:1 em ícones e bordas; elementos reais; rótulo em todo botão só de ícone. Falta auditoria completa | D40 | Implementação |
| N03 | Na TV, setas e OK chegam a tudo; o item em foco tem anel de 4 px e cresce 6%. O estilo existe; a navegação não | D31, D40 | Design |
| N04 | Movimento só como feedback, até 200 ms; com "reduzir movimento", tudo para | D41 | Implementação |
| N05 | Só componentes e tokens do design system; desvios listados e aprovados. Hoje há dois desvios aguardando revisão | D36, D38 | Implementação |
| N06 | Nenhum logo, Netflix Sans, #E50914 ou imagem de título real | D5 | Implementação |
| N07 | Celular em pé em 390 × 844 e deitado em 844 × 390, com alvos de 48 px; TV em 1920 × 1080 dentro da área segura | design.md, D46 | Implementação |

## 10. Pendências abertas

### Incertezas de produto

- Quanto o filme baixa enquanto alguém fala (R14); proposta: 30%.
- Como as reações aparecem na TV (R16); proposta: no aviso discreto, por 2 s.
- Qual a meta de latência da voz entre quem fala e quem ouve.

### Melhorias a implementar

| # | Melhoria | Requisito |
| --- | --- | --- |
| M1 | ✓ Feito na rev5: ChatComposer criado no design system e ligado ao chat | R18 |
| M2 | Programar a troca de anfitrião | R24 |
| M3 | Programar a navegação por controle remoto na TV | N03 |
| M4 | Mostrar as reações na TV, depois da decisão | R16 |
| M5 | Fluxo interativo do convidado no modo protótipo (hoje só no modo demonstração) | R03, R04 |

### Pendências técnicas

| # | Pendência | Bloqueador? |
| --- | --- | --- |
| P1 | O "Sair da sala" (IconButton `close`) chama `end` e encerra para todos. Falta separar "Sair" de "Encerrar para todos", que é só do anfitrião | Sim, para R24 |
| P2 | `leave` tira a pessoa sem passar o papel de anfitrião | Sim, para R24 |
| P3 | ✓ Resolvido na rev4: `pttStart`, `pttEnd` e `pttUnlock` usam `me(state).id` | |
| P4 | `react` só marca a reação no próprio celular; nada chega à TV nem aos outros | Não, depende de R16 |
| P5 | ✓ Resolvido na rev5: o texto provisório saiu e o campo entrou | |
| P11 | O protótipo roda no computador e não simula o teclado do celular. Na versão real, com o celular deitado, a folha sobe com o teclado e o miniplayer fica no topo | Não |
| P6 | `DUCK_LEVEL` existe, mas não é usado, porque o protótipo não tem áudio | Não |
| P7 | Dois desvios do design.md aguardam revisão: cores provisórias da cena do filme (`scene.css`) e medidas de moldura em px | Não, mas bloqueia N05 |
| P8 | Auditoria completa de WCAG 2.1 AA, com leitor de tela e teclado | Não, mas bloqueia N02 |
| P9 | A moldura do celular e as margens do modo deitado (56px nas laterais, 28px do botão de falar) usam px sem token. Propor tokens ou aprovar como desvio, junto com P7 | Não, mas bloqueia N05 |

### Textos novos para revisão (D39)

- "Escreva uma mensagem", "Mensagem para o grupo" (nome acessível do campo) e "Enviar" (ChatComposer)
- "Nome reagiu" (aviso da TV, proposta R16) e "Não acredito que a luz apagou de novo" (mensagem de exemplo)
- "Gire para ver maior" (botão sobre o vídeo em pé)
- "Mostrar os controles" e "Esconder os controles" (nome acessível da camada de toque, deitado)
- "Segure para falar · arraste para cima para travar" (dica da primeira vez, deitado)
- "Girar aparelho" e "Voltar o aparelho em pé" (botão do protótipo, fora da moldura)
- "Sem TV: o filme está no celular." e "Toque no vídeo para ver os controles." (legenda do protótipo)

## 11. Histórico de decisões

Só as decisões que mudam a implementação. As do case (D1 a D4, D6, D10, D14, D16, D17) estão no diário.

| # | Decisão | Motivo | Autor |
| --- | --- | --- | --- |
| D5 | Design system próprio inspirado em streaming, sem a marca Netflix | O DS da Netflix é interno; fonte e logo são proprietários | Rubens |
| D7 | Filme na TV, celular como segunda tela para voz, reações e chat | A interação no celular não cobre o filme | Rubens |
| D8 | MVP com voz push-to-talk, reações, chat e controles do anfitrião | Voz é o pedido principal; reações e chat são interação leve | Rubens |
| D9 | Nome da feature: "Assistir Junto" | Diz o que faz e cabe num botão | Rubens |
| D11 | Público: grupos de 2 a 4 pessoas próximas | Os grupos citados têm de 2 a 5 pessoas | Rubens |
| D12 | Problema: a conversa fica fora da experiência e o atraso separa o grupo | 5 de 7 com problema de sincronia; 5 de 7 conversam fora | Rubens |
| D13 | Escolher o que assistir fica fora do MVP | É outro problema | Rubens |
| D15 | Reações no MVP como hipótese a validar | Interação mais leve para quem não quer falar | Rubens |
| D18 | A sessão começa no celular e vai para a TV | Repete o padrão de transmitir para a TV | Rubens |
| D19 | Todos pausam para o grupo; o anfitrião pode travar | P2 pausa para comentar; a trava evita excesso | Rubens |
| D20 | Se o anfitrião sai, quem entrou primeiro assume | Uma pessoa não derruba o grupo | Rubens |
| D21 | Sem TV, o filme e a camada social ficam no celular | Não exclui quem não tem TV | Rubens |
| D22 | Convite por link; atraso até 2 s corrigido sem aviso; conta própria | Hábito de combinar por mensagem; 5 de 7 sofrem com atraso | Rubens |
| D23 | Quem reconecta volta no ponto do grupo; todos veem quem saiu e voltou | Mantém todos no mesmo ponto | Rubens |
| D24 | Limite de 8 pessoas por sala | Folga sobre o maior grupo citado, sem virar sala pública | Rubens |
| D25 | Acento vermelho próprio (#D92B38), diferente de #E50914 | Leitura de streaming sem copiar a marca | Rubens |
| D26 | Fonte Inter | Aberta e legível em celular e TV | Rubens |
| D27 | Avatar com iniciais sobre cor; anel em quem fala | Mostra quem fala sem texto extra | Rubens |
| D28 | Sincronia por ícone e texto; verde só para quem fala | Uma cor, um significado | Rubens |
| D29 | Segurar para falar ou arrastar para travar; instrução só na primeira vez | Conversas longas cansam o dedo | Rubens |
| D30 | Emojis no padrão do iPhone no protótipo | Padrão único nas telas | Rubens |
| D31 | Foco da TV: anel de 4 px e crescimento de 6% | No controle remoto, o foco é o único sinal | Rubens |
| D32 | Convite, lobby, contagem, painel e progresso criados no DS antes das telas | Sistema completo antes da construção | Rubens |
| D33 | TV com 20 px para texto pequeno e 24 px para avisos | 30 de 30 avisos lidos no teste | Rubens |
| D34 | Protótipo direto em código, com modo demonstração das 15 telas | O fluxo estático sai do mesmo código | Rubens |
| D35 | React com Vite | Mesma base do design system | Rubens |
| D36 | Só componentes do DS; o que faltar entra primeiro no DS | Código fiel ao sistema | Rubens |
| D37 | O agente pede aprovação antes de mudar estrutura, dependências ou fluxo | Evita retrabalho | Rubens |
| D38 | Só tokens no código | Uma fonte única de valores | Rubens |
| D39 | O agente escreve textos novos e lista todos para revisão | Não trava o código em placeholders | Rubens |
| D40 | WCAG 2.1 AA, com navegação completa pelo controle remoto | Padrão verificável | Rubens |
| D41 | Movimento discreto, até 200 ms | O filme manda | Rubens |
| D42 | PRD com status por requisito, de Definição a Concluído | Acompanha cada requisito até o fim | Rubens |
| D43 | PRD técnico, sem riscos de negócio | O PRD orienta quem constrói | Rubens |
| D44 | PRD em markdown na pasta do projeto, fluxo em passos e seção de fora do escopo | Acompanha o código e é lido por agentes | Rubens |
| D45 | PRD reorganizado no modelo de PRD do trabalho do Rubens, mantendo status por requisito, metas e fora do escopo com motivo | Estrutura conhecida pelo time, com estados e contrato explícitos para quem implementa | Rubens |
| D46 | Com o filme no celular, a sessão também funciona deitada: tela cheia, controles ao tocar, vídeo encolhe com chat ou participantes numa folha lateral | O filme maior sem perder a conversa; encolher mantém a cena inteira, como no YouTube | Rubens |
| D47 | Botão de falar em vidro (`PushToTalk variant="glass"`) que aparece ao tocar na tela, com giro animado em até 200 ms | Discreto sobre o filme e a um polegar de distância; a voz é a interação principal | Rubens |
| D48 | Protótipo com moldura de celular estilo iPhone; celular à esquerda, TV no centro; sem TV, só o celular, com botão de girar fora da moldura | Deixa evidente que é um celular e reflete o uso real: a conversa na mão, o filme na frente | Rubens |
| D49 | ChatComposer aprovado: campo "Escreva uma mensagem" e enviar; Enter envia; limite de 200 com contador a partir de 180; no rodapé do chat, em pé e deitado; mensagens fora da TV | Libera R18 e mantém a TV só para o filme e os avisos | Rubens |

## 12. Referências

- `design.md`, nesta pasta: as regras de como construir.
- Diário de decisões: https://claude.ai/code/artifact/3e81a43e-4fc2-4444-88bf-2f15e990bc90
- Design system Assistir Junto: https://claude.ai/artifact/UDbAyLBApvyBgRb1kjWkX8
- Teste de leitura da TV: https://claude.ai/artifact/6jRyaUDysrxpRUWmitrjkL
- Case original no Behance: https://www.behance.net/gallery/202425711/Estudo-de-caso-Desafio-Pm3-de-co-watching-Neflix
- Protótipo no ar: https://assistir-junto.vercel.app (demonstração em `#demo`), publicado pelo Vercel a cada mudança no repositório https://github.com/rubensguilhon-ux/assistir-junto
- Protótipo: esta pasta. `npm run dev`; modo protótipo na raiz, modo demonstração em `#demo`.
- Código de referência: `src/session/session.js` (estado e ações), `src/App.jsx` (simulação, disposição e facilitador), `src/screens/phone/LandscapeSession.jsx` (celular deitado), `src/screens/PhoneFrame.jsx` (moldura), `src/demo/Demo.jsx` (15 telas e variações).
