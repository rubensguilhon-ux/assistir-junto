# Assistir Junto · protótipo

Protótipo do conceito Assistir Junto: o filme na TV, a conversa no celular. Conceito não oficial, inspirado na Netflix, feito para o desafio da PM3.

**No ar:** https://assistir-junto.vercel.app (modo demonstração em https://assistir-junto.vercel.app/#demo). Melhor em tela de 1280 px de largura ou mais; em telas menores, celular e TV ficam um embaixo do outro.

## Rodar

Precisa do Node.js 18 ou mais novo.

```
npm install
npm run dev
```

Abra o endereço que aparecer no terminal (normalmente http://localhost:5173).

## Modos

- **Protótipo:** o celular de Ana (anfitriã) e a TV da sala lado a lado. Os convidados entram sozinhos depois do convite. Os controles do facilitador simulam pausa, atraso, queda de conexão e fim do filme, para o teste de usabilidade.
- **Demonstração:** as 15 telas do design.md em estado fixo, mais as variações, para as imagens do case. Também abre direto por `#demo` no endereço.

## Publicar

O Vercel publica este repositório sozinho a cada mudança: build `npm run build`, pasta de saída `dist` (o Vite é reconhecido automaticamente).

## Documentos

- `PRD.md`: o que construir e por quê, com status por requisito.
- `design.md`: como construir, com as regras para agentes de IA.

## Regras

Leia o `design.md` antes de mudar qualquer coisa. Os componentes vêm do design system em `src/ds/` e não são reescritos aqui.
