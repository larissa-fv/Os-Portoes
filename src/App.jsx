import { useEffect, useState } from 'react'
import Portao from './games/Portao'
import Monte from './games/Monte'
import Prova from './games/Prova'
import './styles.css'

const GAMES = { portao: Portao, monte: Monte, prova: Prova }

const readHash = () => {
  const h = location.hash.slice(1)
  return GAMES[h] ? h : 'menu'
}

export default function App() {
  const [g, setG] = useState(readHash)

  useEffect(() => {
    const f = () => setG(readHash())
    addEventListener('hashchange', f)
    return () => removeEventListener('hashchange', f)
  }, [])

  const go = (x) => {
    location.hash = x === 'menu' ? '' : x
    setG(x)
    scrollTo(0, 0)
  }

  if (g !== 'menu') {
    const Game = GAMES[g]
    return (
      <>
        <nav className="top">
          <button className="back" onClick={() => go('menu')}>← Menu</button>
        </nav>
        <Game key={g} />
      </>
    )
  }

  return (
    <>
      <header>
        <h1>Defesa de Redes</h1>
        <div className="stats">ACLs · Firewalls · ZPF</div>
      </header>
      <main className="menu">
        <p className="mut">Escolha como praticar. Os três usam as analogias de Harry Potter e os conceitos dos Módulos 4, 5 e 6.</p>
        <h3>Modo divertido</h3>
        <button className="card" onClick={() => go('portao')}>
          <strong>O Portão de Hogwarts</strong>
          <span>Você é o Filch: decida quem passa, rodada a rodada, e descubra o conceito de cada uma.</span>
        </button>
        <button className="card" onClick={() => go('monte')}>
          <strong>Monte a Lista do Filch</strong>
          <span>Monte a lista de regras, coloque na ordem e veja as corujas passarem ou serem barradas.</span>
        </button>
        <h3>Modo prova</h3>
        <button className="card" onClick={() => go('prova')}>
          <strong>Treino estilo prova</strong>
          <span>Perguntas com IPs, curingas e ACLs para ler, em modo treino ou modo prova.</span>
        </button>
      </main>
    </>
  )
}
