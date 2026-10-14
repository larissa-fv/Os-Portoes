# Defesa de Redes: jogos e treino

Site com três formas de praticar ACLs, firewalls e ZPF (Cisco NetAcad, Módulos 4, 5 e 6), com analogias de Harry Potter.

**Modo divertido**
- **O Portão de Hogwarts:** o aluno vira o Filch e decide quem passa, em 8 rodadas.
- **Monte a Lista do Filch:** o aluno monta a lista de regras, põe na ordem e vê o resultado animado. Mostra a configuração real do roteador.

**Modo prova**
- **Treino estilo prova:** 12 perguntas por rodada, com IPs e curingas gerados na hora. Tem modo treino (explicação a cada resposta) e modo prova (resultado só no final).

## Rodar no seu computador

Precisa do [Node.js](https://nodejs.org) 18 ou mais novo.

```bash
npm install
npm run dev
```

Abra o endereço que aparecer no terminal (normalmente http://localhost:5173).

## Publicar no GitHub Pages

1. Suba o projeto para um repositório no GitHub, na branch `main`.
2. Em **Settings → Pages**, escolha **Source: GitHub Actions**.
3. A cada `git push`, o workflow em `.github/workflows/deploy.yml` publica o site.

O link fica em `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`.

## Onde editar

- `src/data/rounds.js`: rodadas do Portão de Hogwarts e o texto da explicação final.
- `src/data/monte.js`: fases do Monte a Lista do Filch.
- `src/data/prova.js`: banco de perguntas do treino (a primeira opção de cada pergunta é a correta; o jogo embaralha) e os geradores de perguntas com números.
- `src/games/`: a lógica de cada jogo. `src/App.jsx`: o menu. `src/styles.css`: cores e layout.
