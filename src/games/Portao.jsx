import { useEffect, useRef, useState } from 'react'
import { rounds, labels, practice } from '../data/rounds'

const FIELDS = ['nome', 'id', 'casa', 'dest', 'ativ', 'diz', 'por', 'para', 'visita']

// Lê as regras de cima para baixo; a primeira que combina vale.
// Se nenhuma combinar, vale o bloqueio invisível do final (i = -1).
const check = (round, card) => {
  const i = round.rules.findIndex((r) => r.f(card))
  return i >= 0 ? { i, a: round.rules[i].a } : { i: -1, a: 'D' }
}

function RulesBox({ round, hit }) {
  return (
    <div className="box">
      <h3>Lista do Filch (lida de cima para baixo)</h3>
      <ol className="rules">
        {round.rules.map((u, i) => (
          <li key={i} className={hit === i ? 'hit' : ''}>
            <b>{i + 1}.</b>
            <span>{u.x}</span>
          </li>
        ))}
        <li className={'inv' + (hit === -1 ? ' hit' : '')}>
          <b>·</b>
          <span>Barrar todo o resto (regra invisível do final)</span>
        </li>
      </ol>
      {round.caderno && (
        <p className="intro">Caderno da Rosmerta: pedidos de {round.caderno.join(' e ')}.</p>
      )}
    </div>
  )
}

function FieldRow({ label, value }) {
  return (
    <>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </>
  )
}

function CardBox({ card }) {
  return (
    <div className="box">
      <h3>Quem chegou ao portão</h3>
      <dl className="pc">
        {FIELDS.filter((k) => card[k] !== undefined && !(k === 'casa' && card.id)).map((k) => (
          <FieldRow key={k} label={labels[k]} value={card[k]} />
        ))}
      </dl>
    </div>
  )
}

export default function Portao() {
  const [screen, setScreen] = useState('start') // start | play | lesson | end
  const [ri, setRi] = useState(0)
  const [ci, setCi] = useState(0)
  const [score, setScore] = useState(0)
  const [total, setTotal] = useState(0)
  const [res, setRes] = useState(null)
  const fbRef = useRef(null)

  const round = rounds[ri]
  const card = round.cards[ci]

  useEffect(() => {
    if (res && fbRef.current) fbRef.current.scrollIntoView({ block: 'nearest' })
  }, [res])

  const answer = (decision) => {
    const k = check(round, card)
    const ok = decision === k.a
    setTotal(total + 1)
    if (ok) setScore(score + 1)
    setRes({ ok, i: k.i, a: k.a })
  }

  const nextCard = () => {
    setRes(null)
    if (ci === round.cards.length - 1) setScreen('lesson')
    else setCi(ci + 1)
  }

  const nextRound = () => {
    if (ri + 1 >= rounds.length) {
      setScreen('end')
    } else {
      setRi(ri + 1)
      setCi(0)
      setScreen('play')
    }
  }

  const restart = () => {
    setScreen('start')
    setRi(0)
    setCi(0)
    setScore(0)
    setTotal(0)
    setRes(null)
  }

  const stats =
    screen === 'start' ? '' : `Rodada ${ri + 1} de ${rounds.length} · Acertos: ${score}/${total}`

  return (
    <>
      <header>
        <h1>O Portão de Hogwarts</h1>
        <div className="stats" aria-live="polite">{stats}</div>
      </header>
      <main>
        {screen === 'start' && (
          <>
            <h2>Você é o Filch</h2>
            <p className="intro">
              Cada pessoa que chega ao portão é um pacote de rede. Leia a lista de regras, decida
              quem passa e descubra por que. São {rounds.length} rodadas, e cada uma ensina um
              conceito de ACL, firewall ou ZPF.
            </p>
            <button className="main" onClick={() => setScreen('play')}>Começar</button>
          </>
        )}

        {screen === 'end' && (
          <>
            <h2>Fim de jogo</h2>
            <p className="big">{score} de {total}</p>
            <p className="intro">
              {score >= total * 0.85
                ? 'Pronto para guardar qualquer portão.'
                : score >= total * 0.6
                ? 'Bom trabalho. Reveja as rodadas em que errou.'
                : 'Releia as explicações e tente de novo.'}
            </p>
            <div className="box">
              <h3>Na prática, como seria de verdade</h3>
              <p>{practice.intro}</p>
              <dl className="pc">
                {practice.map.map(([a, b]) => (
                  <FieldRow key={a} label={a} value={b} />
                ))}
              </dl>
            </div>
            <div className="box">
              <h3>Passo a passo no mundo real</h3>
              <ol className="steps">
                {practice.steps.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ol>
              <p>{practice.care}</p>
            </div>
            <button className="main" onClick={restart}>Jogar de novo</button>
          </>
        )}

        {screen === 'lesson' && (
          <>
            <h2>{round.t}</h2>
            <p className="intro">{round.intro}</p>
            <RulesBox round={round} hit={-2} />
            <div className="box">
              <h3>O que você descobriu</h3>
              <strong>{round.L.t}</strong>
              <p>{round.L.x}</p>
              <pre>{round.L.c}</pre>
            </div>
            <button className="main" onClick={nextRound}>
              {ri === rounds.length - 1 ? 'Ver resultado' : 'Próxima rodada'}
            </button>
          </>
        )}

        {screen === 'play' && (
          <>
            <h2>{round.t}</h2>
            <p className="intro">{round.intro}</p>
            <RulesBox round={round} hit={res ? res.i : -2} />
            <CardBox card={card} />
            {!res ? (
              <div className="btns">
                <button className="go" onClick={() => answer('P')}>Deixar passar</button>
                <button className="stop" onClick={() => answer('D')}>Barrar</button>
              </div>
            ) : (
              <>
                <div ref={fbRef} className={'fb ' + (res.ok ? 'ok' : 'bad')} role="status">
                  <strong>
                    {res.ok ? 'Certo! ' : 'Quase. '}
                    {res.a === 'P' ? 'Esse pacote passa.' : 'Esse pacote é barrado.'}
                  </strong>
                  <span>
                    {res.i >= 0 ? `Regra ${res.i + 1} combinou. ` : 'Nenhuma regra combinou. '}
                    {card.w}
                  </span>
                </div>
                <button className="main" onClick={nextCard}>
                  {ci === round.cards.length - 1 ? 'Ver o que você descobriu' : 'Próximo pacote'}
                </button>
              </>
            )}
          </>
        )}
      </main>
    </>
  )
}
