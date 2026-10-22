# Defesa de Redes: jogos e treino

Projeto desenvolvido para praticar ACLs, Firewalls e ZPF (Cisco NetAcad, módulos 4, 5 e 6), usando analogias de Harry Potter para facilitar o entendimento dos conceitos.

A ideia é sair um pouco da teoria e testar como as regras de acesso funcionam na prática: quem pode passar, quem deve ser bloqueado e como a ordem das regras interfere no resultado.

## Modos de jogo

### Modo divertido

- **O Portão de Hogwarts:** você assume o papel de Filch e decide quem pode passar pelo portão, analisando as regras em 8 rodadas.
- **Monte a Lista do Filch:** aqui, você cria suas próprias regras, organiza a ordem e vê o que acontece. A atividade também mostra os comandos correspondentes na configuração do roteador.

### Modo prova

- **Treino estilo prova:** 12 questões por rodada, com endereços IP e máscaras curinga (*wildcards*) gerados a cada rodada.

Você pode escolher entre dois formatos:
- **Treino:** recebe uma explicação após cada resposta.
- **Prova:** responde a todas as questões e confere o resultado no final.

##  Como executar

É necessário ter o [Node.js](https://nodejs.org/) 18 ou superior instalado.

```bash
git clone https://github.com/larissa-fv/Os-Portoes.git
cd Os-Portoes
npm install
npm run dev
```

Depois, acesse no navegador o endereço local indicado no terminal.

## 🔗 Projeto

[Repositório no GitHub](https://github.com/larissa-fv/Os-Portoes)

## Por que Harry Potter?

Porque estudar regras, endereços IP e configurações pode ficar abstrato quando tudo se resume a comandos e teoria. A ideia de um portão com regras de entrada ajuda a visualizar a lógica das ACLs e a entender por que a ordem das regras importa.

O projeto é uma forma de estudar, testar e aprender com os próprios erros, aproximando os conceitos de redes de situações mais fáceis de visualizar.
